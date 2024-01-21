import type { Connection } from "@planetscale/database";
export async function userExists(email: string, db: Connection) {

  const userQuery = await db.execute(`SELECT name FROM User WHERE email = "${email}"`)

  if (userQuery.size == 0) {
    return {
      success: true,
      message: "Checked user existance successfully",
      payload: {
        response: false
      }
    }
  }
  return {
    success: true,
    message: "Checked user existance successfully",
    payload: {
        response: true
    }
  }
}