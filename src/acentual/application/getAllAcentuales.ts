import { Connection } from "@planetscale/database";
import { silaba } from "../../shared/types";
import { validateAdmin } from "../../shared/validateAdmin";
import { adminCredentialsSchema } from "../../shared/schemas";
import { acentualResponse } from "./types";

export async function getAllAcentuales(body: any, db: Connection) {

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

  const acentualQuery = await db.execute(`
    SELECT id acentual_id, phrase acentual_phrase FROM Acentual ORDER BY id;`);

  const acentuales = acentualQuery.rows as acentualResponse[]


  return {
    success: true,
    payload: {
      message: "Questions retreived successfully",
      silabas: acentuales
    }
  };
}