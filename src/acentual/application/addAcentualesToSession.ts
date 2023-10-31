import type { Connection } from "@planetscale/database";

import { acentualQuestion } from "./types"

export async function addAcentualesToSession(sessionId: string, questions: acentualQuestion[], db: Connection) {


  const uploadQuery = await db.execute(`
    INSERT INTO AcentualGame (session_id, word_id, option_schema_id)
    VALUES ${questions.map(e => `("${sessionId}", ${e.id}, ${e.option_schema_id})`).join(",")};
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
