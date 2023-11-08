import type { Connection } from "@planetscale/database";
import { z } from "zod";
import { uploadRimaSchema } from "../../shared/schemas"
import { validateAdmin } from "../../shared/validateAdmin"

export async function addRimas(body: any, db: Connection) {
  const bodyValidation = uploadRimaSchema.safeParse(body);

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
        message: "You have no authorization to do this! "
      }
    }
  }

  const rhymesValues = data.rimas.map(e=>{return `("${e.word}", "${e.category}", "${e.rhyme}")`})
  const rhymesString = rhymesValues.join(",")
  const query = `INSERT INTO Rima (word, category, rhyme) VALUES ${rhymesString};`
  const uploadRhymeRequest = await db.execute(query)

  if (uploadRhymeRequest.rowsAffected != data.rimas.length) {
    return {
      success: false,
      payload: {
        message: "Error while trying to upload the rhymes to the database"
      }
    }
  }

  return {
    success: true,
    payload: {
      message: "Rhymes uploaded to database successfully!"
    }
  }
}

