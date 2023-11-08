import { Connection } from "@planetscale/database"
import { getRimas } from "./getRimas"
import { rimaQuestion } from "./types"
import { selectSchema } from "./optionSchemas"
import { createSession } from "../../shared/createSession"
import { addRimasToSession } from "./addRimasToSession"





export async function startGame(difficulty: number, db: Connection) {
  let rimaSets = await getRimas(10, db)
  if (!rimaSets.success || !rimaSets.payload.rimaSets) {
    return {
      success: false,
      payload: {
        message: rimaSets.payload.message,
        game: null
      }
    }
  }

  // 3 FOR RIMAS GAME
  const session = await createSession(difficulty, 3, db)
  if (!session.success || !session.payload.session_id) {
    return {
      success: false,
      payload: {
        message: session.payload.message,
        game: null
      }
    }
  }

  const optionSchema = selectSchema(difficulty)
  const game = await addRimasToSession(session.payload.session_id, rimaSets.payload.rimaSets, optionSchema.schemaId, db)
  
  if (!game.success) {
    return {
      success: false,
      payload: {
        message: game.payload.message,
        game: null
      }
    }
  }




  
  const acentualQuestions: rimaQuestion[] = game.payload.rimaGames.map(e => {
    return {
            game_id: e.game_id,
            word_a_id: e.rhyme_a.id,
            word_b_id: e.rhyme_b.id,
            word_a: e.rhyme_a.word,
            word_b: e.rhyme_b.word,
            options: optionSchema.options, 
            option_schema_id: optionSchema.schemaId
    }
  })

  

  

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