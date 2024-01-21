import type { Connection } from "@planetscale/database";
import { v4 } from 'uuid'
import { userExists } from "./userExists"

import { addUserSchema } from "../../shared/schemas"
import { encryptPassword } from "../../shared/encryptPassword";
export async function addUser(body: any, env: Bindings, db: Connection) {
  const bodyValidation = addUserSchema.safeParse(body)

  if (!bodyValidation.success) {
    return {
      success: false,
      message: bodyValidation.error,
      payload: {
      },
    };
  }
  const data = bodyValidation.data

  if ((await userExists(data.email, db)).payload.response) {
    return {
      success: false,
      message: "User already exists in database!",
      payload: {
      }
    }
  }


  const encryptedPassword = encryptPassword(data.password, env)
  console.log(encryptedPassword)
  const userQuery = await db.execute(`INSERT INTO User (name, course, email, password)
                                      VALUES ("${data.name}", "${data.course}", "${data.email}", "${encryptedPassword}")`)

  if (userQuery.rowsAffected != 1) {
    return {
      success: false,
      message: "Error adding user to database",
      payload: {
      }
    }
  }
  return {
    success: true,
    message: "User added successfully!",
    payload: {
    }
  }
}
