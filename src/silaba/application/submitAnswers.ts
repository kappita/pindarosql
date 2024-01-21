import type { Connection } from "@planetscale/database";
import { sessionAnswers } from "../../shared/schemas"
import { getQuestions } from "./getQuestions";
import { checkAnswers } from "./checkAnswers";

export async function submitAnswers(body: any, env: Bindings, db: Connection) {
  const bodyValidation = sessionAnswers.safeParse(body);
  if (!bodyValidation.success) {
    return {
      success: false,
      message: bodyValidation.error.toString(),
      payload: null
    };
  }
  const data = bodyValidation.data
  const questions = await getQuestions(data.session_id, db)
  if (!questions.content) {
    return {
      success: false,
      message: questions.message,
      payload: null
    }
  }

const check = await checkAnswers(data, questions.content, env, db)

  if (!check.content) {
    return {
      success: false,
      message: check.message,
      payload: null
    };
  }
  return {
    success: true,
    message: check.message,
    payload: {
      ... check.content
    }
  };
}

