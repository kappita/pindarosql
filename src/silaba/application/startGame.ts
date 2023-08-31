import type { Connection } from "@planetscale/database";
import { z } from "zod";
import { uploadSilabasSchema } from "../shared/schemas"
import { validateAdmin } from "../shared/validateAdmin"
import { createSession } from "../shared/createSession"
import { silaba, silabaQuestion } from "../shared/types"
import { addSilabasToSession } from "./addSilabasToSession"
import { getSilabas } from "./getSilabas"
import { selectSchema } from "./optionSchemas"

export async function startGame(difficulty: number, db: Connection) {
  let rows = await getSilabas(difficulty, 10, db)
  if (!rows.success || !rows.payload.silabas) {
    return {
      success: false,
      payload: {
        message: rows.payload.message,
        game: null
      }
    }
  }

  const silabas = rows.payload.silabas as silaba[]
  const silabaQuestions: silabaQuestion[] = silabas.map(e => {
    const schema = selectSchema(e.answer)
    return {
    id: e.id, options: schema.options, optionSchemaId: schema.schemaId, word: e.word
    }
  })

  const session = await createSession(difficulty, db)
  if (!session.success || !session.payload.sessionId) {
    return {
      success: false,
      payload: {
        message: session.payload.message,
        game: null
      }
    }
  }

  const game = await addSilabasToSession(session.payload.sessionId, silabaQuestions, db)
  
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
        sessionId: session.payload.sessionId,
        questions: silabaQuestions
      }
    }
  }
  

}
