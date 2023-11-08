import { Connection } from "@planetscale/database"
import { sessionScoreResponse } from "./types"



export async function getPlayerHistory(userId: number, db: Connection) {
  const history = await getPlayerSessions(userId, db);

  return {
    success: true,
    payload: {
      message: "Leaderboard retrieved successfully",
      history: history
    }
  }
}


export async function getPlayerSessions(userId: number, db: Connection) {
  const query = `SELECT session_id,
                        score,
                        answer_time,
                        game_id,
                        difficulty
                        FROM SessionScore
                        WHERE user_id = ${userId}
                        ORDER BY creation_date DESC`

  const sessions = (await db.execute(query)).rows as sessionScoreResponse[]

  const sessionsPerGame: sessionScoreResponse[][] = [[], [], []]

  for (let i = 0; i < sessions.length; i++) {
    sessionsPerGame[sessions[i].game_id - 1].push(sessions[i]);
  }
  
  return sessionsPerGame;

}

  
