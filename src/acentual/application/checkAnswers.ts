import { Connection } from "@planetscale/database";
import { userSubmit } from "../../shared/types";
import { allOptions } from "./optionSchemas";
import { uploadAnswers } from "./uploadAnswers";
import { acentualSessionAnswers, acentualCorrection } from "./types";

const scores = [ 100, 125, 150, 200 ]
const answerStrings = [ "Sin respuesta", "Monosílabo átono", "Monosílabo tónico", "Bisílabo átono", "Aguda", "Grave", "Esdrújula", "Sobreesdrújula"]

export async function checkAnswers(answers: userSubmit, sessionAnswers:acentualSessionAnswers, db: Connection) {
  const questions = sessionAnswers.payload.answers!
  const session_difficulty = sessionAnswers.payload.difficulty!
  const creation_date = sessionAnswers.payload.creation_date!
  
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
  let corrections: acentualCorrection[] = []

  for(let i = 0; i < questions.length; i++) {
    const answer = answers.answers.find(e => {return e.question_id === questions[i].word_id})
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
    const is_correct = (questions[i].acentual_answer === answer.answer) ? true : false
    if (is_correct) {
      score += scores[session_difficulty]
      correct ++

    }
    corrections.push({
      game_id: questions[i].game_id,
      word_id: questions[i].word_id,
      word: questions[i].word,
      phrase: questions[i].acentual_phrase,
      answer_value: questions[i].acentual_answer,
      answer: answerStrings[questions[i].acentual_answer],
      user_answer_value: answer.answer,
      user_answer: answerStrings[answer.answer],
      options: allOptions[session_difficulty][questions[i].option_schema_id],
      is_correct: is_correct
    })
  }

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
