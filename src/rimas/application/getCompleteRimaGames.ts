import { Connection } from "@planetscale/database";
import { completeRimaGame, completeRimaGames, rimaResponse } from "./types";
import { getRimaGames } from './getGames'



export async function getCompleteRimaGames(session_id: string, db: Connection): Promise<completeRimaGames> {
  const gamesWithWordsRequest = await getRimaGames(session_id, db)
  if (!gamesWithWordsRequest.payload.rimaGames) {
    const payload = {
      message: gamesWithWordsRequest.payload.message,
      rimaGames: null
    }
    return {
      success: false,
      payload: payload
    }
  }
  const games = gamesWithWordsRequest.payload.rimaGames
  const acentualIds = games.map(e => {
    const bothIds = `Rima.id = ${e.word_a_id} 
                     OR Rima.id = ${e.word_b_id}`
    return bothIds
    })

  const query = `SELECT Rima.id id,
                        Rima.word word,
                        Rima.category,
                        Rima.rhyme rhyme
                        FROM Rima WHERE ${acentualIds.join(" OR ")};`
  console.log(query);
  const phrasesQuery = await db.execute(query)
  if (phrasesQuery.size == 0) {
    return {
      success: false,
      payload: {
        message: "No words found from given games!",
        rimaGames: null
      }
    }
  }
  const rimas = phrasesQuery.rows as rimaResponse[]
  const completeAcentualGames:completeRimaGame[] = []

  for (const game of games) {
    const word_a = rimas.find(e => {return game.word_a_id == e.id})
    const word_b = rimas.find(e => {return game.word_b_id == e.id})
    if (!word_a || !word_b) {
      console.log(JSON.stringify(rimas))
      console.log(JSON.stringify(games))
      const payload = {
        message: "Error while trying to find the word of one of the games",
        rimaGames: null
      }

      return {
        success: false,
        payload: payload
      }
    }
    
    completeAcentualGames.push({
      ...game,
      word_a_id: word_a.id,
      word_a: word_a.word,
      word_b_id: word_b.id,
      word_b:word_b.word
    })
  }
  return {
    success: true,
    payload: {
      message: "Games retrieved successfully",
      rimaGames: completeAcentualGames
    }
  }
}