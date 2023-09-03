import type { Connection } from "@planetscale/database";
import { addAdminSchema } from "../../shared/schemas"
import { userExists } from "./userExists";
export async function addAdmin(body: any, secretKey: string, db: Connection) {
  const bodyValidation = addAdminSchema.safeParse(body)

  if (!bodyValidation.success) {
    return {
      success: false,
      payload: {
        message: bodyValidation.error
      }
    };
  }
  const data = bodyValidation.data
  if (data.secret_key != secretKey) {
    return {
        success: false,
        payload: {
          message: "Invalid authorization"
        }
    }
  }

  if ((await userExists(data.email, db)).payload.response) {
    return {
      success: false,
      payload: {
        message: "User already exists in database!"
      }
    }
  }

  const userQuery = await db.execute(`INSERT INTO User (name, course, email, password, is_admin)
                                      VALUES ("${data.name}", "N/A", "${data.email}", "${data.password}", 1)`)

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