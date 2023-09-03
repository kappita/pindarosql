import { Connection } from "@planetscale/database"
import { user } from "../../shared/types"


export async function getUserId(email: string, password: string, db: Connection) {
  const userQuery = await db.execute(`SELECT id FROM User WHERE email = "${email}" AND password = "${password}";`)

  if (userQuery.size == 0) {
    return {
      success: false,
      payload: {
        message: "User credentials do not exist in database",
        id: null
      }
    }
  }
  return {
    success: true,
    payload: {
        message: "Successfully logged in!",
        ... userQuery.rows[0] as {id: number}
        
    }
  }
}