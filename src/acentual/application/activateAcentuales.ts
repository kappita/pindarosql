import { Connection } from "@planetscale/database";
import { silaba } from "../../shared/types";
import { validateAdmin } from "../../shared/validateAdmin";
import { adminCredentialsSchema, deleteByIdSchema } from "../../shared/schemas";

export async function activateAcentuales(body: any, env: Bindings, db: Connection) {
  const bodyValidation = deleteByIdSchema.safeParse(body);

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



  const idsString = data.ids.map(e=>{return `Acentual.id = ${e}`}).join(" OR ")
  await db.execute(`UPDATE Acentual SET Acentual.is_active = 1 WHERE ${idsString}`)

  return {
    success: true,
    payload: {
      message: "Given acentuales updated successfully"
    }
  };
}