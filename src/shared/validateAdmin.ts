import type { Connection } from "@planetscale/database";

export async function validateAdmin(email: string, password: string,  db: Connection) {
  const query = await db.execute(`
    SELECT is_admin FROM User WHERE email = "${email}" AND password = "${password}" AND is_admin = 1;
  `);
  if (query.rows.length < 1) {
    return {
      success: false
    }
  }
  return {
    success: true
  }
}

