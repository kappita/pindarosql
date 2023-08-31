import type { Connection } from "@planetscale/database";
import { sessionAnswers } from "../../shared/schemas"
import { validateAdmin } from "../../shared/validateAdmin"

export async function submitAnswers(body: any, db: Connection) {
  const bodyValidation = sessionAnswers.safeParse(body);

  if (!bodyValidation.success) {
    return {
      success: false,
      payload: {
        message: bodyValidation.error
      }
    };
  }
  const data = bodyValidation.data

  const questionsQuery = await db.execute(`SELECT SilabaGame.id, Silaba.id, Silaba.answer,  FROM 
    ((GameSession INNER JOIN SilabaGame
      ON SilabaGame.session_id = GameSession.id)
      INNER JOIN 
      Silaba ON Silaba.id = SilabaGame.silaba_id) WHERE GameSession.id = "${data.session_id}";`)
  
  
  if (questionsQuery.size == 0) {
    return {
      success: false,
      payload: {
        message: "The game session does not exist!"
      }
    }
  }



  return {
    success: true,
  };
}

