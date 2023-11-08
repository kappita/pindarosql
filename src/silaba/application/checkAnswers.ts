import { Connection } from "@planetscale/database";
import { silabaCorrection, silabaQuestionResponse, userSubmit } from "../../shared/types";
import { options } from "./optionSchemas";
import { uploadAnswers } from "./uploadAnswers";

const scores = [ 100, 125, 150, 200 ]
const answerStrings = [ "Sin respuesta", "Una sílaba", "Dos sílabas", "Tres sílabas", "Cuatro sílabas", "Cinco sílabas", "Seis sílabas", "Siete sílabas", "Ocho sílabas"]

export async function checkAnswers(answers: userSubmit, questions:silabaQuestionResponse[], db: Connection) {
  const session_difficulty = questions[0].session_difficulty;
  if (answers.answers.length != questions.length) {
    return {
      success: false,
      payload: {
        message: "Invalid answers for the question",
        corrections: null,
        score: null,
        correct: null,
        total: null
      }
    }
  }

  let score = 0
  let correct = 0
  let corrections: silabaCorrection[] = []

  for(let i = 0; i < questions.length; i++) {
    const answer = answers.answers.find(e => {return e.question_id === questions[i].silaba_id})
    if (!answer) {
      return {
        success: false,
        payload: {
          message: "Invalid answers sent!",
          corrections: null,
          score: null,
          correct: null,
          total: null,
          time: null
        }
      }
    }
    const is_correct = (questions[i].silaba_answer === answer.answer) ? true : false
    if (is_correct) {
      score += scores[questions[0].session_difficulty]
      correct ++

    }
    corrections.push({
      game_id: questions[i].game_id,
      silaba_id: questions[i].silaba_id,
      word: questions[i].word,
      answer: questions[i].silaba_answer,
      user_answer_value: answer.answer,
      user_answer: answerStrings[answer.answer],
      options: options[questions[i].option_schema_id],
      is_correct: is_correct
    })
  }

  const uploadAnswersQuery = await uploadAnswers(corrections, answers.session_id, answers.email, answers.password, score, questions[0].creation_date, session_difficulty, db)
  if (!uploadAnswersQuery.success) {
    return {
      success: false,
      payload: {
        message: "Answers were not stored successfully",
        corrections: null,
        score: null,
        correct: null,
        total: null,
        time: null
      }
    }
  }

  return {
    success: true,
    payload: {
      message: "All questions checked successfully",
      corrections: corrections,
      score: score,
      correct: correct,
      total: questions.length,
      time: uploadAnswersQuery.payload.time!
    }
  }


}
