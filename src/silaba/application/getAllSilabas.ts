import { Connection } from "@planetscale/database";
import { silaba } from "../../shared/types";
import { validateAdmin } from "../../shared/validateAdmin";
import { adminCredentialsSchema } from "../../shared/schemas";

export async function getAllSilabas(body: any, db: Connection) {

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