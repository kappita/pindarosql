import { Connection } from "@planetscale/database";
import { silaba } from "../../shared/types";
import { validateAdmin } from "../../shared/validateAdmin";
import { adminCredentialsSchema } from "../../shared/schemas";
import { rimaResponse } from "./types";

export async function getAllRimas(body: any, db: Connection) {

  const bodyValidation = adminCredentialsSchema.safeParse(body);

  if (!bodyValidation.success) {
    return {
      success: false,
      payload: {
        message: bodyValidation.error
      }
    };
  }
  const data = bodyValidation.data

  if (!(await validateAdmin(data.admin_email, data.admin_password, db)).success) {
    return {
      success: false,
      payload: {
        message: "You have no authorization to do this!"
      }
    }
  }

  const rimasQuery = await db.execute(`
    SELECT id, word, category, rhyme FROM Rima WHERE Rima.is_active = 1 ORDER BY id;`);

  const rimas = rimasQuery.rows as rimaResponse[]


  return {
    success: true,
    payload: {
      message: "Questions retreived successfully",
      silabas: rimas
    }
  };
}