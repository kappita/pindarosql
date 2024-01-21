import { Hono } from 'hono';
import { startGame } from '../application/startGame';
import { connect, Config } from "@planetscale/database";
import { submitAnswers } from '../application/submitAnswers';
import { addSilaba } from '../application/addSilaba';
import { getAllSilabas } from '../application/getAllSilabas';
import { deleteSilabas } from '../application/deleteSilabas';
import { activateSilabas } from '../application/activateSilabas';

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
    return c.json({success: false, payload: {message: game.message, game: null}}, 400)
  }
  return c.json({success: true, payload: {message: game.message, game: game.payload}}, 200)
})

silabas.post("/submit", async (c) => {
  const conn = connect(getDatabaseConfig(c.env))
  const body = await c.req.json()
  const submit = await submitAnswers(body, c.env, conn)
  if (!submit.success) {
    return c.json({success: false, payload: submit.payload}, 400)
  }
  return c.json({success: true, payload: submit.payload}, 200)
  
})

silabas.post("/uploadSilaba", async (c) => {
  const conn = connect(getDatabaseConfig(c.env))
  const body = await c.req.json()
  const upload = await addSilaba(body, c.env, conn)
  if (!upload.success) {
    return c.json({success: false, payload: upload.message}, 400)
  }
  return c.json({success: true, payload: upload.payload}, 200)

})


silabas.post("/allSilabas", async (c) => {
  const conn = connect(getDatabaseConfig(c.env))
  const body = await c.req.json()
  const silabas = await getAllSilabas(body, c.env, conn)
  if (!silabas.success) {
    return c.json({success: false, payload: silabas.payload.message}, 400)
  }
  return c.json({success: true, payload: silabas.payload}, 200)
})

silabas.post("/deleteSilabas", async (c) => {
  const conn = connect(getDatabaseConfig(c.env))
  const body = await c.req.json()
  const silabas = await deleteSilabas(body, c.env, conn)
  if (!silabas.success) {
    return c.json({success: false, payload: silabas.payload.message}, 400)
  }
  return c.json({success: true, payload: silabas.payload}, 200)
})

silabas.post("/activateSilabas", async (c) => {
  const conn = connect(getDatabaseConfig(c.env))
  const body = await c.req.json()
  const silabas = await activateSilabas(body, c.env, conn)
  if (!silabas.success) {
    return c.json({success: false, payload: silabas.message}, 400)
  }
  return c.json({success: true, payload: silabas.payload}, 200)
})




export default silabas


