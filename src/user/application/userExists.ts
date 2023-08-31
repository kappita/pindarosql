import type { Connection } from "@planetscale/database";
export async function userExists(email: string, db: Connection) {

  const userQuery = await db.execute(`SELECT name FROM User WHERE email = "${email}"`)

  if (userQuery.size == 0) {
    return {
      success: true,
      payload: {
        message: "Checked user existance successfully",
        response: false
      }
    }
  }
  return {
    success: true,
    payload: {
        message: "Checked user existance successfully",
        response: true
    }
  }
}