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
  option_schema_id: number
}

export type user = {
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
  silaba_word: string,
  silaba_answer: number
  user_answer_value: number,
  user_answer: string,
  options: silabaOption[],
  is_correct: boolean
}

export type userSubmit = {
  session_id: string
  email: string | null
  password: string | null
  answers: userAnswers[]
}

export type acentualPreGame = {
  acentual_id: number
  acentual_phrase: string
  acentual_words: string
  acentual_word: string
  acentual_word_pos: number
  acentual_answer: number
}

export type acentualQuestionResponse = {
  session_difficulty: number
  creation_date: Date
  game_id: number
  option_schema_id: number
  word: string
  word_id: number
  acentual_phrase: string
  acentual_answer: number
  word_pos: number
}

export type acentual = {
  acentual_id: number,
  phrase: string,
  word_id: number,
  word: string,
  word_pos: number,
  answer: number
}

export type acentualQuestion = {
  id: number,
  phrase: string,
  word: string,
  word_pos: number,
  options: silabaOption[],
  option_schema_id: number
}

export type acentualCorrection = {
  game_id: number,
  word_id: number,
  word: string,
  acentual_phrase: string,
  acentual_answer_value: number,
  acentual_answer: string,
  user_answer_value: number,
  user_answer: string,
  options: silabaOption[],
  is_correct: boolean
}