export enum Roles {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  VIEWER = "VIEWER",
}

export type AuthUser = {
  id: number;
  role: Roles;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
