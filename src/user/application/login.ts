import type { Connection } from "@planetscale/database";
import { v4 } from 'uuid'

import { loginSchema } from "../../shared/schemas"
import { user } from "../../shared/types";
export async function login(body: any, db: Connection) {

  const bodyValidation = loginSchema.safeParse(body)

  if (!bodyValidation.success) {
    return {
      success: false,
      payload: {
        message: bodyValidation.error,
        user: null
      }
    }
  }
  const data = bodyValidation.data
  console.log(`SELECT name, course, email, password FROM User WHERE email = "${data.email}" AND password = "${data.password}";`)
  const userQuery = await db.execute(`SELECT name, course, email, password FROM User WHERE email = "${data.email}" AND password = "${data.password}";`)

  if (userQuery.size == 0) {
    return {
      success: false,
      payload: {
        message: "User credentials do not exist in database",
        user: null
      }
    }
  }
  return {
    success: true,
    payload: {
        message: "Successfully logged in!",
        user: userQuery.rows as user[]
        
    }
  }
}