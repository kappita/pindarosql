import { Connection } from "@planetscale/database";
import { acentualGamesWithWords} from "./types"
import { getAcentualGames } from "./getGames";
import { acentualGames, acentualGameResponse, acentualWordResponse, acentualGameWithWord } from "./types";




export async function getAcentualGamesWithWords(session_id: string, db: Connection): Promise<acentualGamesWithWords> {
  const acentualGamesRequest = await getAcentualGames(session_id, db);
  if (!acentualGamesRequest.payload.acentualGames) {
    const payload = {
      message: acentualGamesRequest.payload.message,
      acentualGames: null
    }
    return {
      success: false,
      payload: payload
    }
  }

  const games = acentualGamesRequest.payload.acentualGames
  const wordIds = games.map(game => {return game.word_id})
  const query = `SELECT AcentualWord.id word_id,
                        AcentualWord.acentual_id acentual_id,
                        AcentualWord.word word,
                        AcentualWord.answer acentual_answer,
                        AcentualWord.word_pos word_pos
                        FROM AcentualWord WHERE AcentualWord.id = ${wordIds.join(" OR AcentualWord.id = ")};`
  
  const wordsQuery = await db.execute(query)

  if (wordsQuery.size == 0) {
    return {
      success: false,
      payload: {
        message: "No words found for given games!",
        acentualGames: null
      }
    }
  }

  const words = wordsQuery.rows as acentualWordResponse[]
  return addWordsToGames(games, words)
  
}

function addWordsToGames(games: acentualGameResponse[], words: acentualWordResponse[]): acentualGamesWithWords {
  const gamesWithWords:acentualGameWithWord[] = []

  for (const game of games) {
    const word = words.find(word => {return game.word_id == word.word_id})
    if (!word) {
      const payload = {
        message: "Error while trying to find the word of one of the games",
        acentualGames: null
      }

      return {
        success: false,
        payload: payload
      }
    }
    
    gamesWithWords.push({
      ...game,
      ...word
    })
  }
  return {
    success: true,
    payload: {
      message: "Games retrieved successfully",
      acentualGames: gamesWithWords
    }
  }

}