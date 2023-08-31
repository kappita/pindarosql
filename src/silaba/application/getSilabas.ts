import type { Connection } from "@planetscale/database";
import { z } from "zod";
import { uploadSilabasSchema } from "../shared/schemas"
import { validateAdmin } from "../shared/validateAdmin"

export async function getSilabas(difficulty: number, amount: number, db: Connection) {

  const silabasQuery = await db.execute(`
    SELECT * FROM Silaba WHERE difficulty <= ${difficulty} ORDER BY RAND() LIMIT ${amount};
  `);

  if (silabasQuery.size < amount) {
    return {
      success: false,
      payload: {message: "Not enough questions to ask!", silabas: null}
    }
  }

  return {
    success: true,
    payload: {
      message: "Questions retreived successfully",
      silabas: silabasQuery.rows
    }
  };
}