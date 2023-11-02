import type { Connection } from "@planetscale/database";
import { uploadSilabasSchema } from "../../shared/schemas"
import { validateAdmin } from "../../shared/validateAdmin"

export async function addSilaba(body: any, db: Connection) {
  const bodyValidation = uploadSilabasSchema.safeParse(body);

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

  const uploadQuery = await db.execute(`
    INSERT INTO Silaba (word, answer, difficulty)
    VALUES ${data.silabas.map(e => `("${e.word}", ${e.answer_value}, ${e.difficulty})`).join(",")};
  `);
  return {
    success: true,
    payload: {
      message: "Words uploaded successfully!"
    }
  };
}

