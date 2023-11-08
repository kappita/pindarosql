import { Connection } from "@planetscale/database";
import { rimaSessionResponse } from "./types";


export async function getSession(session_id: string, db: Connection) {
  const sessionQuery = await db.execute(`SELECT GameSession.difficulty session_difficulty,
                                                GameSession.creation_date creation_date
                                                FROM GameSession WHERE GameSession.id = "${session_id}" AND GameSession.is_answered = 0;`)

  if (sessionQuery.size == 0) {
    return {
      success: false,
      payload: {
        message: "No active session found with such id",
        session: null
      }
    }
  }

  return {
    success: true,
    payload: {
      message: "Session retrieved successfully",
      session: sessionQuery.rows[0] as rimaSessionResponse
    }
  }
                                              
  
}