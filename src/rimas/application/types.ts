import { answerOption } from "../../shared/types"

export type rimaResponse = {
  id: number,
  word: string,
  category: string,
  rhyme: string,
  vowels: string,
  is_active: boolean
}

export type rimaSet = {
  rhyme_a: rimaResponse,
  rhyme_b: rimaResponse
}

export type rimaSetResponse = {
  success: boolean,
  payload: {
    message: string,
    rimaSets: rimaSet[] | null
  }
}

export type rimaCorrection = {
  game_id: number,
  word_a_id: number,
  word_b_id: number,
  word_a: string,
  word_b: string,
  answer_value: number,
  answer: string,
  user_answer_value: number,
  user_answer: string,
  options: answerOption[],
  is_correct: boolean
}

export type completeRimaGame = {
  game_id: number,
  option_schema_id: number,
  word_a_id: number,
  word_b_id: number,
  word_a: string,
  word_b: string,
  rima_answer: number
}

export type completeRimaGames = {
  success: boolean,
  payload: {
    message: string,
    rimaGames: completeRimaGame[] | null
  }
}
export type rimaSessionAnswers = {
  success: boolean,
  payload: {
    message: string,
    answers: completeRimaGame[] | null,
    difficulty: number | null,
    creation_date: Date | null
  }
}

export type rimaQuestion = {
  game_id: number,
  word_a_id: number,
  word_b_id: number,
  word_a: string,
  word_b: string,
  options: answerOption[],
  option_schema_id: number
}

export type rimaGames = {
  success: boolean,
  payload: {
    message: string,
    rimaGames: rimaGame[] | null
  }
}

export type rimaGame = {
  game_id: number,
  word_a_id: number,
  word_b_id: number,
  rima_answer: number,
  option_schema_id: number
}

export type rimaSessionResponse = {
  session_difficulty: number,
  creation_date: Date
}


export type rimaSetWithGame = {
  rhyme_a: rimaResponse,
  rhyme_b: rimaResponse,
  game_id: number
}

export type SessionAnswers = {
  answers: completeRimaGame[],
  difficulty: number,
  creation_date: Date
}