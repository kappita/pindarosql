
import { Connection } from "@planetscale/database"
import { rimaSessionAnswers } from "./types"
import { getSession } from "./getSession"
import { getCompleteRimaGames } from "./getCompleteRimaGames";



export async function getRimaSessionAnswers(session_id: string, db: Connection): Promise<rimaSessionAnswers> {
  const session = await getSession(session_id, db);
  const sessionPayload = {
    message: session.payload.message,
    answers: null,
    difficulty: null,
    creation_date: null
  }

  if (!session.payload.session) {
    return {
      success: false,
      payload: sessionPayload
    }
  }

  const games = await getCompleteRimaGames(session_id, db);
  const gamesPayload = {
    message: games.payload.message,
    answers: null,
    difficulty: null,
    creation_date: null
  }
  
  if (!games.payload.rimaGames) {
    return {
      success: false,
      payload: gamesPayload
    }
  }

  return {
    success: true,
    payload: {
      message: "Session's questions successfully retrieved",
      answers: games.payload.rimaGames,
      difficulty: session.payload.session.session_difficulty,
      creation_date: session.payload.session?.creation_date
    }
  }
}
