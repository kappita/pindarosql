import { Connection } from "@planetscale/database";
import { rimaSet, rimaResponse, rimaSetResponse } from "./types";



export async function getRimas(amount: number, db: Connection) {
  // const minimumCorrectAnswers = Math.floor(Math.random() * amount / 3);

  const rimasQuery = await db.execute(`
    SELECT id, word, category, rhyme FROM Rima ORDER BY RAND() LIMIT ${amount * 2};`);

  const rimas = rimasQuery.rows as rimaResponse[]
  const rimaSets = selectRimas(rimas, amount)

  return rimaSets
}

// TODO: FIND A WAY TO MAKE SURE THERE ARE AT LEAST X RHYMES
function selectRimas(rimas: rimaResponse[], totalRhymes: number): rimaSetResponse {
  const fastSets = Math.floor(rimas.length / 2)
  if (fastSets < totalRhymes) {
    const payload = {
      message: "Not enough rhymes in database",
      rimaSets: null
    }
    return {
      success: false,
      payload: payload
    }
  }
  const selectedRhymes: rimaSet[] = []
  for (let i = 0; i < fastSets; i++) {
    const newSet:rimaSet = {
      rhyme_a: rimas[i* 2],
      rhyme_b: rimas[i * 2 + 1]
    }
    selectedRhymes.push(newSet)
  }

  
  return {
    success: true,
    payload: {
      message: "Rhymes retrieved successfully",
      rimaSets: selectedRhymes
    }
  }
}