import { Connection } from "@planetscale/database";
import { GameCorrections, Optional, silabaCorrection, silabaQuestionResponse, userSubmit } from "../../shared/types";
import { options } from "./optionSchemas";
import { uploadAnswers } from "./uploadAnswers";
import { corrections } from "../../acentual/application/types";

const scores = [ 100, 125, 150, 200 ]
const answerStrings = [ "Sin respuesta", "Una sílaba", "Dos sílabas", "Tres sílabas", "Cuatro sílabas", "Cinco sílabas", "Seis sílabas", "Siete sílabas", "Ocho sílabas"]

export async function checkAnswers(answers: userSubmit, questions:silabaQuestionResponse[], env: Bindings, db: Connection): Promise<Optional<GameCorrections<silabaCorrection>>> {
  const session_difficulty = questions[0].session_difficulty;
  if (answers.answers.length != questions.length) {
    return {
      content: null,
      message: "Invalid answers for the question"
    }
  }

  let score = 0
  let correct = 0
  let corrections: silabaCorrection[] = []

  for(let i = 0; i < questions.length; i++) {
    const answer = answers.answers.find(e => {return e.question_id === questions[i].silaba_id})
    if (!answer) {
      return {
        content: null,
        message: "Invalid answers sent!",
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

  const uploadAnswersQuery = await uploadAnswers(corrections, answers.session_id, answers.token, score, questions[0].creation_date, session_difficulty, env, db)
  if (!uploadAnswersQuery.content) {
    return {
      message: "Answers were not stored successfully",
      content: null
    }
  }

  return {
    content: null,
    message: "All questions checked successfully"
  }


}
