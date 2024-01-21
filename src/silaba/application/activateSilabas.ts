import { Connection } from "@planetscale/database";
import { silaba } from "../../shared/types";
import { validateAdmin } from "../../shared/validateAdmin";
import { adminCredentialsSchema, deleteByIdSchema } from "../../shared/schemas";

export async function activateSilabas(body: any, env: Bindings, db: Connection) {

  const bodyValidation = deleteByIdSchema.safeParse(body);

  if (!bodyValidation.success) {
    return {
      success: false,
      message: bodyValidation.error.toString(),
      payload: null
    };
  }
  const data = bodyValidation.data

  if (!(await validateAdmin(data.token, env))) {
    return {
      success: false,
      message: "You have no authorization to do this!",
      payload: null
    }
  }

  const idsString = data.ids.map(e=>{return `Silaba.id = ${e}`}).join(" OR ")
  await db.execute(`UPDATE Silaba SET Silaba.is_active = 1 WHERE ${idsString};`)

  return {
    success: true,
    message: "Given silabas activated successfully",
    payload: null
  };
}