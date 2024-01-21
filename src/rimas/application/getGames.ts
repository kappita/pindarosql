import { Connection } from "@planetscale/database";
import { rimaGames, rimaGame } from "./types";
import { Optional } from "../../shared/types";


export async function getRimaGames(session_id: string, db: Connection): Promise<Optional<rimaGame[]>>{


  const gameQuery = await db.execute(`SELECT RimaGame.id game_id,
                                             RimaGame.word_a_id,
                                             RimaGame.word_b_id,
                                             RimaGame.answer rima_answer,
                                             RimaGame.option_schema_id
                                             FROM RimaGame
                                             WHERE RimaGame.session_id = "${session_id}";`)

  if (gameQuery.size == 0) {
    return {
      content: null,
      message: "No games found with such session id!",
    }
  }
  return {
    message: "Games retrieved successfully",
    content: gameQuery.rows as rimaGame[]
  }
}