import { Connection } from "@planetscale/database";
import { getUserId } from "../../user/application/getUser";
import { calculateTime } from "./calculateTime";

export async function uploadScore(sessionId: string, userId: number, score: number, start_date: Date, difficulty: number, db: Connection) {

  const answerTime = await calculateTime(start_date, db)
  const uploadQuery = await db.execute(`INSERT INTO SessionScore (session_id, score, user_id, answer_time, game_id, difficulty) VALUES ("${sessionId}", ${score}, ${userId}, "${answerTime}", 1, ${difficulty})`)
  if (uploadQuery.rowsAffected != 1) {
    return {
      success: false,
      payload: {
        message: "Error storing score",
        time: null
      }
    }
  }

  const setAnsweredQuery = await db.execute(`UPDATE GameSession SET is_answered = 1 WHERE GameSession.id = "${sessionId}"`)
  if (setAnsweredQuery.rowsAffected != 1) {
    return {
      success: false,
      payload: {
        message: "Error changing session status",
        time: null
      }
    }
  }

  return {
    success: true,
    payload: {
      message: "Score stored successfully!",
      time: answerTime
    }
  }
}