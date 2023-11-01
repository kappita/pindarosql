import { Connection } from "@planetscale/database";
import { userSubmit } from "../../shared/types";
import { getAnswer, selectSchema } from "./optionSchemas";
import { uploadAnswers } from "./uploadAnswers";
import { rimaCorrection, rimaSessionAnswers } from "./types";

const scores = [ 100, 125, 150, 200 ]


export async function checkAnswers(answers: userSubmit, sessionAnswers:rimaSessionAnswers, db: Connection) {
  const questions = sessionAnswers.payload.answers!
  const session_difficulty = sessionAnswers.payload.difficulty!
  const creation_date = sessionAnswers.payload.creation_date!
  const answerStrings = selectSchema(session_difficulty).options
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
  let corrections: rimaCorrection[] = []

  for(let i = 0; i < questions.length; i++) {
    const answer = answers.answers.find(e => {return e.question_id === questions[i].game_id})
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
    const is_correct = (questions[i].rima_answer === answer.answer) ? true : false
    if (is_correct) {
      score += scores[session_difficulty]
      correct ++

    }



    corrections.push({
      game_id: questions[i].game_id,
      word_a_id: questions[i].word_a_id,
      word_b_id: questions[i].word_b_id,
      word_a: questions[i].word_a,
      word_b: questions[i].word_b,
      answer_value: questions[i].rima_answer,
      answer: getAnswer(session_difficulty, questions[i].rima_answer),
      user_answer_value: answer.answer,
      user_answer: getAnswer(session_difficulty, answer.answer),
      options: answerStrings,
      is_correct: is_correct
    })
  }
  console.log("upload query")
  const uploadAnswersQuery = await uploadAnswers(corrections, answers.session_id, answers.email, answers.password, score, creation_date, db)
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
