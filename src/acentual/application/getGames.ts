import { Connection } from "@planetscale/database";
import { acentualGames, acentualGameResponse } from "./types";




export async function getAcentualGames(session_id: string, db: Connection): Promise<acentualGames>{


  const gameQuery = await db.execute(`SELECT AcentualGame.id game_id,
                                             AcentualGame.word_id,
                                             AcentualGame.option_schema_id
                                             FROM AcentualGame
                                             WHERE AcentualGame.session_id = "${session_id}";`)

  if (gameQuery.size == 0) {
    return {
      success: false,
      payload: {
        message: "No games found with such session id!",
        acentualGames: null
      }
    }
  }
  return {
    success: true,
    payload: {
      message: "Games retrieved successfully",
      acentualGames: gameQuery.rows as acentualGameResponse[]
    }
  }
}