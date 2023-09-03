import { Connection } from "@planetscale/database"
import { acentualQuestionResponse, silabaQuestionResponse } from "../../shared/types"

export async function getQuestions(session_id: string, db: Connection) {
  const questionsQuery = await db.execute(`SELECT GameSession.difficulty session_difficulty,
                                                  GameSession.creation_date,
                                                  AcentualGame.id game_id,
                                                  AcentualGame.option_schema_id,
                                                  AcentualWord.id word_id,
                                                  Acentual.phrase acentual_phrase,
                                                  AcentualWord.answer acentual_answer,
                                                  AcentualWord.word_pos word_pos
                                                  FROM 
                                                  (((GameSession INNER JOIN AcentualGame
                                                    ON AcentualGame.session_id = GameSession.id)
                                                    INNER JOIN 
                                                    AcentualWord ON AcentualWord.id = AcentualGame.word_id) INNER JOIN Acentual ON Acentual.id = AcentualWord.acentual_id)  WHERE GameSession.id = "${session_id}" AND GameSession.is_answered = 0;`)
  
  
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
      questions: questionsQuery.rows as acentualQuestionResponse[]
    }
  }
}

