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