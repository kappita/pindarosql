import { Connection } from "@planetscale/database";
import { acentualSessionResponse } from "./types";
import { Optional } from "../../shared/types";


export async function getSession(session_id: string, db: Connection): Promise<Optional<acentualSessionResponse>> {
  const sessionQuery = await db.execute(`SELECT GameSession.difficulty session_difficulty,
                                                GameSession.creation_date creation_date
                                                FROM GameSession WHERE GameSession.id = "${session_id}" AND GameSession.is_answered = 0;`)

  if (sessionQuery.size == 0) {
    return {
      message: "No active session found with such id",
      content: null
    }
  }

  return {
    message: "Session retrieved successfully",
    content: sessionQuery.rows[0] as acentualSessionResponse
  }
                                              
  
}