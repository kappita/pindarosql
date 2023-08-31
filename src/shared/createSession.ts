import type { Connection } from "@planetscale/database";
import { v4 } from 'uuid'
export async function createSession(difficulty: number, db: Connection) {
  const sessionId = v4()
  console.log(`
  INSERT INTO GameSession (id, difficulty) VALUES ("${sessionId}", ${difficulty});
`)
  const query = await db.execute(`
    INSERT INTO GameSession (id, difficulty) VALUES ("${sessionId}", ${difficulty});
  `);

  if (query.rowsAffected != 1) {
    return {
      success: false,
      payload: {message: "Error creating session", sessionId: null}
    }
  }
  return {
    success: true,
    payload: {message: "Session created successfully", sessionId: sessionId}
  }
}
