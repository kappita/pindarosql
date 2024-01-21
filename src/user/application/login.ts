import type { Connection } from "@planetscale/database";

import { loginSchema } from "../../shared/schemas"
import { user } from "../../shared/types";
import { decryptPassword } from "../../shared/decryptPassword";
import jwt from '@tsndr/cloudflare-worker-jwt'
export async function login(body: any, env: Bindings, db: Connection) {

  const bodyValidation = loginSchema.safeParse(body)

  if (!bodyValidation.success) {
    return {
      success: false,
      message: bodyValidation.error,
      payload: {
        user: null
      }
    }
  }
  const data = bodyValidation.data
  console.log(`SELECT name, course, email, password, is_admin FROM User WHERE email = "${data.email}" AND password = "${data.password}";`)
  const userQuery = await db.execute(`SELECT id, name, course, email, password, is_admin FROM User WHERE email = "${data.email}";`)

  if (userQuery.size == 0) {
    return {
      success: false,
      message: "User credentials do not exist in database",
      payload: {
        user: null
      }
    }
  }

  const user = userQuery.rows as user[]
  const decryptedPassword = decryptPassword(user[0].password, env);
  if (data.password != decryptedPassword) {
    return {
      success: false,
      message: "User credentials do not exist in database",
      payload: {
        user: null
      }
    }
  }

  const token = await jwt.sign({user_id: user[0].id, is_admin: user[0].is_admin}, env.JWT_KEY)


  const response = {
    name: user[0].name,
    course: user[0].course,
    token: token
  }
  
  return {
    success: true,
    message: "Successfully logged in!",
    payload: {
        user: response
        
    }
  }
}