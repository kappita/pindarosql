import type { Connection } from "@planetscale/database";
import { sessionAnswers } from "../../shared/schemas"
import { validateAdmin } from "../../shared/validateAdmin"

export async function submitAnswers(body: any, db: Connection) {
  const bodyValidation = sessionAnswers.safeParse(body);

  if (!bodyValidation.success) {
    return {
      success: false,
      payload: bodyValidation.error,
    };
  }
  const data = bodyValidation.data

  const uploadQuery = await db.execute(`
    SELECT FROM (GameSession INNER JOIN SilabaGame ON SilabaGame.session_id = GameSession.id) (word, answer, difficulty)
    VALUES ${data.silabas.map(e => `(${e.word}, ${e.answer_value}, ${e.difficulty})`).join(",")};
  `);
  return {
    success: true,
  };
}

