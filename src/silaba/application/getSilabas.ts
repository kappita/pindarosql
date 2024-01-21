import type { Connection } from "@planetscale/database";
import { z } from "zod";
import { uploadSilabasSchema } from "../../shared/schemas"
import { validateAdmin } from "../../shared/validateAdmin"
import { Optional, silaba } from "../../shared/types";

export async function getSilabas(difficulty: number, amount: number, db: Connection): Promise<Optional<silaba[]>> {

  const silabasQuery = await db.execute(`
    SELECT * FROM Silaba WHERE difficulty <= ${difficulty} AND Silaba.is_active = 1 ORDER BY RAND() LIMIT ${amount};
  `);

  if (silabasQuery.size < amount) {
    return {
      content: null,
      message: "Not enough questions to ask!"
    } 
  }

  return {
    message: "Questions retreived successfully",
    content: silabasQuery.rows as silaba[]
  };
}