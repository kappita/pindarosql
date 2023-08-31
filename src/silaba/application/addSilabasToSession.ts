import type { Connection } from "@planetscale/database";
import { z } from "zod";
import { uploadSilabasSchema } from "../shared/schemas"
import { validateAdmin } from "../shared/validateAdmin"
import { silaba, silabaQuestion } from "../shared/types"
import { selectSchema } from "./optionSchemas"

export async function addSilabasToSession(sessionId: string, questions: silabaQuestion[], db: Connection) {


  const uploadQuery = await db.execute(`
    INSERT INTO SilabaGame (session_id, silaba_id, optionSchemaId)
    VALUES ${questions.map(e => `("${sessionId}", ${e.id}, ${e.optionSchemaId})`).join(",")};
  `);

  if (uploadQuery.rowsAffected != questions.length) {
    return {
      success: false,
      payload: {
        message: "Session games linked unsuccessfully!"
      }
    }
  }
  return {
    success: true,
    payload: {
      message: "Session games linked successfully!"
    }
    
  };
}
