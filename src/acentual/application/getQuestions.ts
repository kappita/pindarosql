import { Connection } from "@planetscale/database"
import { acentualSessionAnswers, acentualGameResponse, completeAcentualGame } from "./types"
import { getSession } from "./getSession"
import { getCompleteAcentualGames } from "./addPhraseToGames";



export async function getAcentualSessionAnswers(session_id: string, db: Connection): Promise<acentualSessionAnswers> {
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

  const games = await getCompleteAcentualGames(session_id, db);
  const gamesPayload = {
    message: games.payload.message,
    answers: null,
    difficulty: null,
    creation_date: null
  }
  
  if (!games.payload.acentualGames) {
    return {
      success: false,
      payload: gamesPayload
    }
  }

  return {
    success: true,
    payload: {
      message: "Session's questions successfully retrieved",
      answers: games.payload.acentualGames,
      difficulty: session.payload.session.session_difficulty,
      creation_date: session.payload.session?.creation_date
    }
  }
}
