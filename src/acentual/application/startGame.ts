import type { Connection } from "@planetscale/database";

import { createSession } from "../../shared/createSession"
import { acentualQuestion } from "../../shared/types"
import { addAcentualesToSession } from "./addAcentualesToSession"
import { getAcentuales } from "./getAcentuales"
import { selectSchema } from "./optionSchemas"

export async function startGame(difficulty: number, db: Connection) {
  let rows = await getAcentuales(difficulty, 10, db)
  if (!rows.success || !rows.payload.acentuales) {
    return {
      success: false,
      payload: {
        message: rows.payload.message,
        game: null
      }
    }
  }

  const acentualQuestions: acentualQuestion[] = rows.payload.acentuales.map(e => {
    const schema = selectSchema(e.answer, difficulty)
    return {
            id: e.word_id, phrase: e.phrase, word: e.word, word_pos: e.word_pos, options: schema.options, option_schema_id: schema.schemaId
    }
  })

  // 2 FOR ACENTUAL GAME
  const session = await createSession(difficulty, 2, db)
  if (!session.success || !session.payload.session_id) {
    return {
      success: false,
      payload: {
        message: session.payload.message,
        game: null
      }
    }
  }

  const game = await addAcentualesToSession(session.payload.session_id, acentualQuestions, db)
  
  if (!game.success) {
    return {
      success: false,
      payload: {
        message: game.payload.message,
        game: null
      }
    }
  }

  return {
    success: true,
    payload: {
      message: "Game created successfully",
      game: {
        session_id: session.payload.session_id,
        questions: acentualQuestions
      }
    }
  }
  

}
