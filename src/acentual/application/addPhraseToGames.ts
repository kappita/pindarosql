import { Connection } from "@planetscale/database";
import { acentualResponse, acentualGameWithWord, completeAcentualGame, completeAcentualGames } from "./types";
import { getAcentualGamesWithWords } from "./addWordsToGames";



export async function getCompleteAcentualGames(session_id: string, db: Connection): Promise<completeAcentualGames> {
  const gamesWithWordsRequest = await getAcentualGamesWithWords(session_id, db)
  if (!gamesWithWordsRequest.payload.acentualGames) {
    const payload = {
      message: gamesWithWordsRequest.payload.message,
      acentualGames: null
    }
    return {
      success: false,
      payload: payload
    }
  }
  const games = gamesWithWordsRequest.payload.acentualGames
  const acentualIds = games.map(e => {return e.acentual_id})
  const query = `SELECT Acentual.id acentual_id,
                        Acentual.phrase acentual_phrase
                        FROM Acentual WHERE Acentual.id = ${acentualIds.join(" OR Acentual.id = ")};`
  const phrasesQuery = await db.execute(query)
  if (phrasesQuery.size == 0) {
    return {
      success: false,
      payload: {
        message: "No words found from given games!",
        acentualGames: null
      }
    }
  }
  const phrases = phrasesQuery.rows as acentualResponse[]
  const completeAcentualGames:completeAcentualGame[] = []

  for (const game of games) {
    const phrase = phrases.find(e => {return game.acentual_id == e.acentual_id})
    if (!phrase) {
      const payload = {
        message: "Error while trying to find the word of one of the games",
        acentualGames: null
      }

      return {
        success: false,
        payload: payload
      }
    }
    
    completeAcentualGames.push({
      ...game,
      ...phrase
    })
  }
  return {
    success: true,
    payload: {
      message: "Games retrieved successfully",
      acentualGames: completeAcentualGames
    }
  }
}