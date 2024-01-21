import { Connection } from "@planetscale/database";
import { acentualGames, acentualGameResponse } from "./types";
import { Optional } from "../../shared/types";




export async function getAcentualGames(session_id: string, db: Connection): Promise<Optional<acentualGameResponse[]>>{


  const gameQuery = await db.execute(`SELECT AcentualGame.id game_id,
                                             AcentualGame.word_id,
                                             AcentualGame.option_schema_id
                                             FROM AcentualGame
                                             WHERE AcentualGame.session_id = "${session_id}";`)

  if (gameQuery.size == 0) {
    return {
      message: "No games found with such session id!",
      content: null,
    }
  }
  return {
    message: "Games retrieved successfully",
    content: gameQuery.rows as acentualGameResponse[]
  }
}