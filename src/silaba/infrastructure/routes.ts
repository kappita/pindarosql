import { Hono } from 'hono';
import { startGame } from '../application/startGame';
import { connect, Config } from "@planetscale/database";

export function getDatabaseConfig(env: Bindings) {
  return {
    host: env.DB_HOST,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    fetch: (url: string, init: RequestInit<RequestInitCfProperties>) => {
      delete (init as any)["cache"]; // Remove cache header
      return fetch(url, init);
    },
  } as Config;
}

const silabas = new Hono<{ Bindings: Bindings }>()

silabas.get("/start/:difficulty", async (c) => {
  const conn = connect(getDatabaseConfig(c.env))
  const diff = parseInt(c.req.param("difficulty"))
  const game = await startGame(diff, conn)
  if (!game.success) {
    return c.json({success: false, payload: {message: game.payload.message, game: null}}, 400)
  }
  return c.json({success: true, payload: {message: game.payload.message, game: game.payload.game}}, 200)
})

export default silabas


