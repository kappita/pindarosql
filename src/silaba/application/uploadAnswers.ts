import { silabaCorrection } from "../../shared/types";
import { Connection } from "@planetscale/database";
import { getUserId } from "../../user/application/getUser";
import { uploadScore } from "./uploadScore";



export async function uploadAnswers(corrections: silabaCorrection[],
                                    gameSession: string,
                                    userEmail: string | null,
                                    userPassword: string | null,
                                    score: number,
                                    start_date: Date,
                                    difficulty: number,
                                    db: Connection) {
  if (!userEmail || !userPassword) { 
    const uploadAnswersQuery = await db.execute(`INSERT INTO Answer (session_id, user_id, answer_value, game_type_id, game_id) VALUES ${corrections.map(e=> `("${gameSession}", 0, ${e.user_answer_value}, 1, ${e.game_id})`).join(",")}`)
    const uploadScoreQuery = await uploadScore(gameSession,
                                               0,
                                               score,
                                               start_date,
                                               difficulty,
                                               db)

    if (!uploadScoreQuery.success) {
      return {
        success: false,
        payload: {
          message: uploadScoreQuery.payload.message,
          time: null
        }
      }
    }
    return {
      success: true,
      payload: {
        message: "Answers stored as anonymous/guest",
        time: uploadScoreQuery.payload.time
      }
      
    }
  }
  const userData = await getUserId(userEmail, userPassword, db)
  if (!userData.success || !userData.payload.id) {
    return {
      success: false,
      payload: {
        message: userData.payload.message,
        time: null
      }
    }
  }
  const uploadAnswersQuery = await db.execute(`INSERT INTO Answer (session_id, user_id, answer_value, game_type_id, game_id) VALUES ${corrections.map(e=> `("${gameSession}", ${userData.payload.id}, ${e.user_answer_value}, 1, ${e.game_id})`).join(",")}`)
  if (uploadAnswersQuery.rowsAffected == 0) {
    return {
      success: false,
      payload: {
        message: "Couldn't store answers",
        time: null
      }
    }
  }

  const uploadScoreQuery = await uploadScore(gameSession,
                                             userData.payload.id,
                                             score,
                                             start_date,
                                             difficulty,
                                             db)
  if (!uploadScoreQuery.success) {
    return {
      success: false,
      payload: {
        message: "Couldn't store score",
        time: null
      }
    }
  }
  return {
    success: true,
    payload: {
      message: "Answers stored successfully by user",
      time: uploadScoreQuery.payload.time!
    }
  }
}