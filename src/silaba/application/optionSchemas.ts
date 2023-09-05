import { silabaOption } from "../../shared/types"
export const options = [
  [
    {value: 1, answer: "Una sílaba"},
    {value: 2, answer: "Dos sílabas"},
    {value: 3, answer: "Tres sílabas"},
    {value: 4, answer: "Cuatro sílabas"}
  ],
  [
    {value: 2, answer: "Dos sílabas"},
    {value: 3, answer: "Tres sílabas"},
    {value: 4, answer: "Cuatro sílabas"},
    {value: 5, answer: "Cinco sílabas"}
  ],
  [
    {value: 3, answer: "Tres sílabas"},
    {value: 4, answer: "Cuatro sílabas"},
    {value: 5, answer: "Cinco sílabas"},
    {value: 6, answer: "Seis sílabas"}
  ],
  [
    {value: 4, answer: "Cuatro sílabas"},
    {value: 5, answer: "Cinco sílabas"},
    {value: 6, answer: "Seis sílabas"},
    {value: 7, answer: "Siete sílabas"}
  ],
  [
    {value: 5, answer: "Cinco sílabas"},
    {value: 6, answer: "Seis sílabas"},
    {value: 7, answer: "Siete sílabas"},
    {value: 8, answer: "Ocho sílabas"}
  ],
  [
    {value: 6, answer: "Seis sílabas"},
    {value: 7, answer: "Siete sílabas"},
    {value: 8, answer: "Ocho sílabas"},
    {value: 9, answer: "Nueve sílabas"}
  ]
]

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}


export function selectSchema(correctAnswer: number): {options: silabaOption[], schemaId: number} {
  const value = correctAnswer - getRandomInt(3) - 1
  return {options: options[value], schemaId: value >= 0 ? value : 0}

}