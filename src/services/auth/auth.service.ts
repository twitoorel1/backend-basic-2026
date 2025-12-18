import type { Pool } from "mysql2/promise";
import { withTransaction } from "../../db/tx.js";
import { AppError } from "../../middleware/error.middleware.js";
import { findUserByUsernameOrEmail, findUserById, insertRefreshToken, findActiveRefreshToken, revokeRefreshToken } from "../../db/queries/auth.queries.js";
import { verifyPassword } from "./password.service.js";
import { createRefreshToken, issueAccessToken, sha256Hex } from "./token.service.js";
import type { AppEnv } from "../../config/env.js";

export async function login(db: Pool, env: AppEnv, input: { username_or_email: string; password: string }, meta: { userAgent: string | null; ip: string | null }) {
  const user = await findUserByUsernameOrEmail(db, input.username_or_email);
  if (!user) {
    throw new AppError({ code: "AUTH_INVALID_CREDENTIALS", status: 401, message: "Invalid credentials" });
  }
  if (!user.is_active) {
    throw new AppError({ code: "AUTH_USER_INACTIVE", status: 403, message: "User inactive" });
  }

  const ok = await verifyPassword(input.password, user.password_hash);
  if (!ok) {
    throw new AppError({ code: "AUTH_INVALID_CREDENTIALS", status: 401, message: "Invalid credentials" });
  }

  const accessToken = await issueAccessToken({
    userId: user.id,
    role: user.role,
    secret: env.jwt.accessSecret,
    ttlSeconds: env.jwt.accessTtlSeconds,
  });

  const { token, tokenHashHex } = createRefreshToken();
  const issuedAt = new Date();
  const expiresAt = new Date(issuedAt.getTime() + env.jwt.refreshTtlDays * 86400000);

  await withTransaction(db, async (conn) => {
    await insertRefreshToken(conn, {
      userId: user.id,
      tokenHashHex,
      issuedAt,
      expiresAt,
      userAgent: meta.userAgent,
      ip: meta.ip,
    });
  });

  return { accessToken, refreshToken: token };
}

export async function refresh(db: Pool, env: AppEnv, refreshToken: string | null, meta: { userAgent: string | null; ip: string | null }) {
  if (!refreshToken) {
    throw new AppError({ code: "AUTH_REFRESH_INVALID", status: 401, message: "Invalid refresh token" });
  }

  const hash = sha256Hex(refreshToken);

  const result = await withTransaction(db, async (conn) => {
    const rt = await findActiveRefreshToken(conn, hash);
    if (!rt) {
      throw new AppError({ code: "AUTH_REFRESH_INVALID", status: 401, message: "Invalid refresh token" });
    }

    const user = await findUserById(conn, rt.user_id);
    if (!user || !user.is_active) {
      throw new AppError({ code: "AUTH_USER_INACTIVE", status: 403, message: "User inactive" });
    }

    await revokeRefreshToken(conn, hash);

    const { token, tokenHashHex } = createRefreshToken();
    const issuedAt = new Date();
    const expiresAt = new Date(issuedAt.getTime() + env.jwt.refreshTtlDays * 86400000);

    await insertRefreshToken(conn, {
      userId: user.id,
      tokenHashHex,
      issuedAt,
      expiresAt,
      userAgent: meta.userAgent,
      ip: meta.ip,
    });

    return { userId: user.id, role: user.role, newRefreshToken: token };
  });

  const accessToken = await issueAccessToken({
    userId: result.userId,
    role: result.role,
    secret: env.jwt.accessSecret,
    ttlSeconds: env.jwt.accessTtlSeconds,
  });

  return { accessToken, newRefreshToken: result.newRefreshToken };
}

export async function logout(db: Pool, refreshToken: string | null): Promise<void> {
  if (!refreshToken) return;

  const hash = sha256Hex(refreshToken);
  await withTransaction(db, async (conn) => {
    await revokeRefreshToken(conn, hash);
  });
}
