import type { Connection } from "@planetscale/database";
import { sessionAnswers } from "../../shared/schemas"
import { getQuestions } from "./getQuestions";
import { checkAnswers } from "./checkAnswers";

export async function submitAnswers(body: any, db: Connection) {
  const bodyValidation = sessionAnswers.safeParse(body);
  if (!bodyValidation.success) {
    return {
      success: false,
      payload: {
        message: bodyValidation.error,
        corrections: null,
        score: null,
        total: null,
        correct: null,
        time: null
      }
    };
  }
  const data = bodyValidation.data
  const questions = await getQuestions(data.session_id, db)
  if (!questions.success) {
    return {
      success: false,
      payload: {
        message: questions.payload.message,
        corrections: null,
        score: null,
        total: null,
        correct: null,
        time: null
      }
    }
  }


  const check = await checkAnswers(data, questions.payload.questions!, db)

  if (!check.success) {
    return {
      success: false,
      payload: {
        message: check.payload.message,
        corrections: null,
        score: null,
        total: null,
        correct: null,
        time: null
      }
    };
  }
  return {
    success: true,
    payload: {
      message: check.payload.message,
      corrections: check.payload.corrections,
      score: check.payload.score,
      total: check.payload.total,
      correct: check.payload.correct,
      time: check.payload.time!
    }
  };
}

