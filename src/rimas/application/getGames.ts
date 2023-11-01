import { Connection } from "@planetscale/database";
import { rimaGames, rimaGame } from "./types";


export async function getRimaGames(session_id: string, db: Connection): Promise<rimaGames>{


  const gameQuery = await db.execute(`SELECT RimaGame.id game_id,
                                             RimaGame.word_a_id,
                                             RimaGame.word_b_id,
                                             RimaGame.answer rima_answer,
                                             RimaGame.option_schema_id
                                             FROM RimaGame
                                             WHERE RimaGame.session_id = "${session_id}";`)

  if (gameQuery.size == 0) {
    return {
      success: false,
      payload: {
        message: "No games found with such session id!",
        rimaGames: null
      }
    }
  }
  return {
    success: true,
    payload: {
      message: "Games retrieved successfully",
      rimaGames: gameQuery.rows as rimaGame[]
    }
  }
}