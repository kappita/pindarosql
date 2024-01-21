import { Hono } from 'hono';
import { startGame } from '../application/startGame';
import { connect, Config } from "@planetscale/database";
import { submitAnswers } from '../application/submitAnswers';
import { addRimas } from '../application/addRimas';
import { getAllRimas } from '../application/getAllRimas';
import { cors } from 'hono/cors';
import { deleteRimas } from '../application/deleteRimas';
import { activateRimas } from '../application/activateRimas';

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

const rimas = new Hono<{ Bindings: Bindings }>()
rimas.use("*", cors())


rimas.get("/start/:difficulty", async (c) => {
  const conn = connect(getDatabaseConfig(c.env))
  const diff = parseInt(c.req.param("difficulty"))
  const game = await startGame(diff, conn)
  if (!game.success) {
    return c.json({success: false, payload: {message: game.message, game: null}}, 400)
  }
  return c.json({success: true, payload: {message: game.message, game: game.payload.game}}, 200)
})

rimas.post("/submit", async (c) => {
  const conn = connect(getDatabaseConfig(c.env))
  const body = await c.req.json()
  const submit = await submitAnswers(body, c.env, conn)
  if (!submit.success) {
    return c.json({success: false, payload: submit.payload}, 400)
  }
  return c.json({success: true, payload: submit.payload}, 200)
  
})


rimas.post("/uploadRimas", async (c) => {
  const conn = connect(getDatabaseConfig(c.env))
  const body = await c.req.json()
  const upload = await addRimas(body, c.env, conn)
  if (!upload.success) {
    return c.json({success: false, payload: upload.payload.message}, 400)
  }
  return c.json({success: true, payload: upload.payload}, 200)
})


rimas.post("/allRimas", async (c) => {
  const conn = connect(getDatabaseConfig(c.env))
  const body = await c.req.json()
  const rimas = await getAllRimas(body, c.env, conn)
  if (!rimas.success) {
    return c.json({success: false, payload: rimas.message}, 400)
  }
  return c.json({success: true, payload: rimas.payload}, 200)
})

rimas.post("/deleteRimas", async (c) => {
  const conn = connect(getDatabaseConfig(c.env))
  const body = await c.req.json()
  const rimas = await deleteRimas(body, c.env, conn)
  if (!rimas.success) {
    return c.json({success: false, payload: rimas.payload.message}, 400)
  }
  return c.json({success: true, payload: rimas.payload}, 200)
})

rimas.post("activateRimas", async (c) => {
  const conn = connect(getDatabaseConfig(c.env))
  const body = await c.req.json()
  const rimas = await activateRimas(body, c.env, conn)
  if (!rimas.success) {
    return c.json({success: false, payload: rimas.payload.message}, 400)
  }
  return c.json({success: true, payload: rimas.payload}, 200)
})

export default rimas


