import { Connection } from "@planetscale/database"
import { silabaQuestionResponse } from "../../shared/types"

export async function getQuestions(session_id: string, db: Connection) {
  const questionsQuery = await db.execute(`SELECT GameSession.difficulty, SilabaGame.id, SilabaGame.option_schema_id, Silaba.id, Silaba.answer FROM 
    ((GameSession INNER JOIN SilabaGame
      ON SilabaGame.session_id = GameSession.id)
      INNER JOIN 
      Silaba ON Silaba.id = SilabaGame.silaba_id) WHERE GameSession.id = "${session_id}";`)
  
  
  if (questionsQuery.size == 0) {
    return {
      success: false,
      payload: {
        message: "The game session does not exist!",
        questions: null
      }
    }
  }
  return {
    success: true,
    payload: {
      message: "Session's questions successfully retrieved",
      questions: questionsQuery.rows as silabaQuestionResponse[]
    }
  }
}

