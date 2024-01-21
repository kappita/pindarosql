import { Connection } from "@planetscale/database";
import { silaba } from "../../shared/types";
import { validateAdmin } from "../../shared/validateAdmin";
import { adminCredentialsSchema, loginWithTokenSchema } from "../../shared/schemas";

export async function getAllSilabas(body: any, env: Bindings, db: Connection) {

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

  const silabasQuery = await db.execute(`
    SELECT * FROM Silaba ORDER BY id;
  `);


  return {
    success: true,
    payload: {
      message: "Questions retreived successfully",
      silabas: silabasQuery.rows as silaba[]
    }
  };
}