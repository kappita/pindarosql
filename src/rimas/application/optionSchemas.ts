

const easyOptions = [
  {
    value: 1,
    answer: "No"
  },
  {
    value: 2,
    answer: "Sí"
  }
]

const mediumOptions = [
  {
    value: 1,
    answer: "No hay rima"
  },
  {
    value: 2,
    answer: "Rima consonante",
  },
  {
    value: 3,
    answer: "Rima asonante"
  }
]

const allOptions = [
  easyOptions,
  mediumOptions
]


export function getAnswer(difficulty: number, answer: number) {
  answer = answer > 0 ? 1 : 0
  difficulty = difficulty > 0 ? 1 : 0
  return allOptions[difficulty][answer].answer
} 

export function selectSchema(difficulty: number) {
  difficulty = difficulty > 0 ? 1 : 0

  return {
    options: allOptions[difficulty],
    schemaId: difficulty
  }
}