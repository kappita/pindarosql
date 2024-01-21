import type { Connection } from "@planetscale/database";
import { sessionAnswers } from "../../shared/schemas"
import { getRimaSessionAnswers } from "./getRimaSessionAnswers";
import { checkAnswers } from "./checkAnswers";



export async function submitAnswers(body: any, env: Bindings, db: Connection) {
  const bodyValidation = sessionAnswers.safeParse(body);
  if (!bodyValidation.success) {
    return {
      success: false,
      message: bodyValidation.error,
      payload: {

      }
    };
  }
  const data = bodyValidation.data
  const questions = await getRimaSessionAnswers(data.session_id, db)
  if (!questions.content) {
    return {
      success: false,
      message: questions.message,
      payload: {
      }
    }
  }


  const check = await checkAnswers(data, questions.content, env, db)

  if (!check.content) {
    return {
      success: false,
      message: check.message,
      payload: {

      }
    };
  }
  return {
    success: true,
    message: check.message,
    payload: {
      corrections: check.content.corrections,
      score: check.content.score,
      total: check.content.total,
      correct: check.content.correct,
      time: check.content.time!
    }
  };
}

