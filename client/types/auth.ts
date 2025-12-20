import { Role } from "./next-auth";

export interface User {
  id: string | null;
  first_name?: string | null;
  last_name?: string | null;
  username: string | null;
  email?: string | null;
  role: Role;
}
