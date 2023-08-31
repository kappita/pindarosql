import type { Connection } from "@planetscale/database";
import { v4 } from 'uuid'
import { userExists } from "./userExists"

import { addUserSchema } from "../../shared/schemas"
export async function addUser(body: any, db: Connection) {
  const bodyValidation = addUserSchema.safeParse(body)

  if (!bodyValidation.success) {
    return {
      success: false,
      payload: {
        message: bodyValidation.error
      },
    };
  }
  const data = bodyValidation.data

  if ((await userExists(data.email, db)).payload.response) {
    return {
      success: false,
      payload: {
        message: "User already exists in database!"
      }
    }
  }

  const userQuery = await db.execute(`INSERT INTO User (name, course, email, password)
                                      VALUES ("${data.name}", "${data.course}", "${data.email}", "${data.password}")`)

  if (userQuery.rowsAffected != 1) {
    return {
      success: false,
      payload: {
        message: "Error adding user to database"
      }
    }
  }
  return {
    success: true,
    payload: {
      message: "User added successfully!"
    }
  }
}
