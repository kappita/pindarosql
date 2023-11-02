import { Hono } from 'hono';
import { connect, Config } from "@planetscale/database";
import { getLeaderboards } from '../application/getLeaderboard';
import { getPlayerHistory } from '../application/getPlayerHistory';



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

const scores = new Hono<{ Bindings: Bindings }>()

scores.get("/leaderboards", async (c) => {
  const conn = connect(getDatabaseConfig(c.env))
  const leaderboards = await getLeaderboards(conn)
  return c.json({success: true, payload: leaderboards.payload}, 200)
})

scores.get("/history/:userId", async (c) => {
  const conn = connect(getDatabaseConfig(c.env))
  const userId = parseInt(c.req.param("userId"))
  const leaderboards = await getPlayerHistory(userId, conn)
  return c.json({success: true, payload: leaderboards.payload}, 200)
})

export default scores