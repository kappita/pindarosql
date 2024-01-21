import { Connection } from "@planetscale/database";
import { silaba } from "../../shared/types";
import { validateAdmin } from "../../shared/validateAdmin";
import { loginWithTokenSchema } from "../../shared/schemas";
import { acentualResponse } from "./types";

export async function getAllAcentuales(body: any, env: Bindings, db: Connection) {

  const bodyValidation = loginWithTokenSchema.safeParse(body);

  if (!bodyValidation.success) {
    return {
      success: false,
      payload: {
        message: bodyValidation.error
      }
    };
  }
  const data = bodyValidation.data

  if (!(await validateAdmin(data.token, env))) {
    return {
      success: false,
      payload: {
        message: "You have no authorization to do this!"
      }
    }
  }

  const acentualQuery = await db.execute(`
    SELECT id acentual_id, phrase acentual_phrase, is_active FROM Acentual ORDER BY id;`);

  const acentuales = acentualQuery.rows as acentualResponse[]


  return {
    success: true,
    payload: {
      message: "Questions retreived successfully",
      silabas: acentuales
    }
  };
}