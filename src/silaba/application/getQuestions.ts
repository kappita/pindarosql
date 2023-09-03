import { Connection } from "@planetscale/database"
import { silabaQuestionResponse } from "../../shared/types"

export async function getQuestions(session_id: string, db: Connection) {
  const questionsQuery = await db.execute(`SELECT GameSession.difficulty session_difficulty, GameSession.creation_date, SilabaGame.id game_id, SilabaGame.option_schema_id, Silaba.id silaba_id, Silaba.word, Silaba.answer silaba_answer FROM 
    ((GameSession INNER JOIN SilabaGame
      ON SilabaGame.session_id = GameSession.id)
      INNER JOIN 
      Silaba ON Silaba.id = SilabaGame.silaba_id) WHERE GameSession.id = "${session_id}" AND GameSession.is_answered = 0;`)
  
  
  if (questionsQuery.size == 0) {
    return {
      success: false,
      payload: {
        message: "The game session does not exist or has already been answered!",
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

