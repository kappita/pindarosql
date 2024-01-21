import { Connection } from "@planetscale/database"
import { user } from "../../shared/types"


export async function getUserId(email: string, password: string, db: Connection) {
  const userQuery = await db.execute(`SELECT id FROM User WHERE email = "${email}" AND password = "${password}";`)

  if (userQuery.size == 0) {
    return {
      success: false,
      message: "User credentials do not exist in database",
      payload: {}
    }
  }
  return {
    success: true,
    message: "Successfully logged in!",
    payload: {
        ... userQuery.rows[0] as {id: number}
        
    }
  }
}