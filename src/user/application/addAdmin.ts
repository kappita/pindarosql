import type { Connection } from "@planetscale/database";
import { addAdminSchema } from "../../shared/schemas"
import { userExists } from "./userExists";
import { encryptPassword } from "../../shared/encryptPassword";
export async function addAdmin(body: any, env: Bindings, db: Connection) {
  const bodyValidation = addAdminSchema.safeParse(body)

  if (!bodyValidation.success) {
    return {
      success: false,
      message: bodyValidation.error,
      payload: {
      }
    };
  }
  const data = bodyValidation.data
  if (data.secret_key != env.SECRET_KEY) {
    return {
        success: false,
        message: "Invalid authorization",
        payload: {
        }
    }
  }

  if ((await userExists(data.email, db)).payload.response) {
    return {
      success: false,
      message: "User already exists in database!",
      payload: {
      }
    }
  }
  const encryptedPassword = await encryptPassword(data.password, env);
  const userQuery = await db.execute(`INSERT INTO User (name, course, email, password, is_admin)
                                      VALUES ("${data.name}", "N/A", "${data.email}", "${encryptedPassword}", 1)`)

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