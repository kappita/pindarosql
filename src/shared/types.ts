export type silaba = {
  id: number,
  word: string,
  answer: number,
  difficulty: number,
  creation_date: Date,
  modification_date: Date
}

export type answerOption = {
  value: number,
  answer: string
}

export type silabaQuestion = {
  word: string
  id: number
  options: answerOption[]
  option_schema_id: number
}

export type user = {
  id: number,
  name: string,
  course: string,
  email: string,
  password: string
}

export type userAnswers = {
  question_id: number,
  answer: number
}

export type silabaQuestionResponse = {
  session_difficulty: number
  creation_date: Date
  game_id: number
  option_schema_id: number
  silaba_id: number
  word: string
  silaba_answer: number
}
export type silabaCorrection = {
  game_id: number,
  silaba_id: number,
  word: string,
  answer: number
  user_answer_value: number,
  user_answer: string,
  options: answerOption[],
  is_correct: boolean
}

export type userSubmit = {
  session_id: string
  email: string | null
  password: string | null
  answers: userAnswers[]
}

