import { Connection } from "@planetscale/database";
import { acentualResponse, acentualGameWithWord, completeAcentualGame, completeAcentualGames } from "./types";
import { getAcentualGamesWithWords } from "./addWordsToGames";
import { Optional } from "../../shared/types";



export async function getCompleteAcentualGames(session_id: string, db: Connection): Promise<Optional<completeAcentualGame[]>> {
  const gamesWithWordsRequest = await getAcentualGamesWithWords(session_id, db)
  if (!gamesWithWordsRequest.content) {
    return {
      content: null,
      message: gamesWithWordsRequest.message,
    }
  }
  const games = gamesWithWordsRequest.content
  const acentualIds = games.map(e => {return e.acentual_id})
  const query = `SELECT Acentual.id acentual_id,
                        Acentual.phrase acentual_phrase
                        FROM Acentual WHERE Acentual.id = ${acentualIds.join(" OR Acentual.id = ")};`
  const phrasesQuery = await db.execute(query)
  if (phrasesQuery.size == 0) {
    return {
      content: null,
      message: "No words found from given games!",
    }
  }
  const phrases = phrasesQuery.rows as acentualResponse[]
  const completeAcentualGames:completeAcentualGame[] = []

  for (const game of games) {
    const phrase = phrases.find(e => {return game.acentual_id == e.acentual_id})
    if (!phrase) {
      return {
        message: "Error while trying to find the word of one of the games",
        content: null
      }
    }
    
    completeAcentualGames.push({
      ...game,
      ...phrase
    })
  }
  return {
    content: completeAcentualGames,
    message: "Games retrieved successfully",
  }
}