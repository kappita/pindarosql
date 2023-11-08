import type { Connection, ExecutedQuery } from "@planetscale/database";
import { acentual, acentualPreGame } from "./types";

export async function getAcentuales(difficulty: number, amount: number, db: Connection) {
  let acentualQuery: ExecutedQuery
  switch (difficulty) {
    case 0:
      acentualQuery = await db.execute(`SELECT Acentual.id acentual_id, Acentual.phrase phrase, AcentualWord.id word_id, AcentualWord.word word, AcentualWord.word_pos word_pos, AcentualWord.answer answer FROM Acentual INNER JOIN AcentualWord ON Acentual.id = AcentualWord.acentual_id WHERE answer > 3 AND Acentual.is_active = 1 ORDER BY RAND() LIMIT ${amount};`)
      break
    case 1:
      acentualQuery = await db.execute(`SELECT Acentual.id acentual_id, Acentual.phrase phrase, AcentualWord.id word_id, AcentualWord.word word, AcentualWord.word_pos word_pos, AcentualWord.answer answer FROM Acentual INNER JOIN AcentualWord ON Acentual.id = AcentualWord.acentual_id WHERE answer > 3 OR answer < 3 AND Acentual.is_active = 1 ORDER BY RAND() LIMIT ${amount};`)
      break
    default:
      acentualQuery = await db.execute(`SELECT Acentual.id acentual_id, Acentual.phrase phrase, AcentualWord.id word_id, AcentualWord.word word, AcentualWord.word_pos word_pos, AcentualWord.answer answer FROM Acentual INNER JOIN AcentualWord ON Acentual.id = AcentualWord.acentual_id  WHERE Acentual.is_active = 1 ORDER BY RAND() LIMIT ${amount};`)
      break
  }

  if (acentualQuery.size < amount) {
    return {
      success: false,
      payload: {message: "Not enough questions to ask!", acentuales: null}
    }
  }
  return {
    success: true,
    payload: {
      message: "Questions retreived successfully",
      acentuales: acentualQuery.rows as acentual[]
    }
  };
}