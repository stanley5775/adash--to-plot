/**
 * TEMPORARY mock admin "database".
 *
 * SECURITY NOTE: plain-text passwords are only acceptable here because this
 * is a throwaway prototype credential store. A real backend must:
 *   - store admins in a real database (e.g. Postgres)
 *   - hash passwords (bcrypt/argon2), never store them in plain text
 *   - rate-limit login attempts
 *
 * Server-only: never import this file from client components.
 */
export interface MockAdminRecord {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: "admin" | "superadmin";
}

export const MOCK_ADMINS: MockAdminRecord[] = [
  {
    id: "admin-001",
    fullName: "Adashè-to-Plot Admin",
    email: "admin@adashetoplot.com",
    password: "Admin@123",
    role: "superadmin",
  },
];
