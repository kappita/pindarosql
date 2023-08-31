export type silaba = {
  id: number,
  word: string,
  answer: number,
  difficulty: number,
  creation_date: Date,
  modification_date: Date
}

export type silabaOption = {
  value: number,
  answer: string
}

export type silabaQuestion = {
  word: string
  id: number
  options: silabaOption[]
  optionSchemaId: number
}

export type user = {
  name: string,
  course: string,
  email: string,
  password: string
}

export type userAnswers = {
  question_id: string,
  answer: number
}

export type silabaQuestionResponse = {
  session_difficulty: number
  game_id: number,
  option_schema_id: number,
  silaba_id: number,
  silaba_answer: number
}