
const easyAnswers = [
  "Sin respuesta",
  "No",
  "Sí"
]

const mediumAnswers = [
  "Sin respuesta",
  "No hay rima",
  "Rima consonante",
  "Rima asonante"
]

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

const allAnswers = [
  easyAnswers,
  mediumAnswers
]
export function getAnswer(difficulty: number, answer: number) {
  if (difficulty == 0) {
    answer = answer > 2 ? 2 : answer;
  } else {
    answer = answer > 3 ? 3 : answer;
  }
  
  difficulty = difficulty > 0 ? 1 : 0
  return allAnswers[difficulty][answer]
} 

export function selectSchema(difficulty: number) {
  difficulty = difficulty > 0 ? 1 : 0

  return {
    options: allOptions[difficulty],
    schemaId: difficulty
  }
}