export function getUserRole(): string | null {
  if (typeof window === "undefined") return null;
  return (window as any).__USER_ROLE || null;
}
