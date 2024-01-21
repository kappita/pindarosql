import { Hono } from 'hono';
import { startGame } from '../application/startGame';
import { connect, Config } from "@planetscale/database";
import { submitAnswers } from '../application/submitAnswers';
import { addAcentual } from '../application/addAcentual';
import { cors } from 'hono/cors';
import { getAllAcentuales } from '../application/getAllAcentuales';
import { deleteAcentuales } from '../application/deleteAcentuales';
import { activateAcentuales } from '../application/activateAcentuales';

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

const acentual = new Hono<{ Bindings: Bindings }>()

acentual.use("*", cors())

acentual.get("/poto", async (c) => {
  const conn = connect(getDatabaseConfig(c.env))
  const bruh = await conn.execute('INSERT INTO AcentualWord (word, word_pos, acentual_id) VALUES ("Poto1", 1, 3), ("Poto2", 1, 3);')
  console.log(JSON.stringify(bruh))
  return c.text(":3")
})

acentual.get("/start/:difficulty", async (c) => {
  const conn = connect(getDatabaseConfig(c.env))
  const diff = parseInt(c.req.param("difficulty"))
  const game = await startGame(diff, conn)
  if (!game.success) {
    return c.json({success: false, payload: {message: game.payload.message, game: null}}, 400)
  }
  return c.json({success: true, payload: {message: game.payload.message, game: game.payload.game}}, 200)
})

acentual.post("/submit", async (c) => {
  const conn = connect(getDatabaseConfig(c.env))
  const body = await c.req.json()
  const submit = await submitAnswers(body, c.env, conn)
  if (!submit.success) {
    return c.json({success: false, payload: submit.payload}, 400)
  }
  return c.json({success: true, payload: submit.payload}, 200)
  
})


acentual.post("/uploadAcentual", async (c) => {
  const conn = connect(getDatabaseConfig(c.env))
  const body = await c.req.json()
  const upload = await addAcentual(body, c.env, conn)
  if (!upload.success) {
    return c.json({success: false, payload: upload.payload.message}, 400)
  }
  return c.json({success: true, payload: upload.payload}, 200)
})

acentual.post("/allAcentuales", async (c) => {
  const conn = connect(getDatabaseConfig(c.env))
  const body = await c.req.json()
  const acentuales = await getAllAcentuales(body, c.env, conn)
  if (!acentuales.success) {
    return c.json({success: false, payload: acentuales.payload.message}, 400)
  }
  return c.json({success: true, payload: acentuales.payload}, 200)
})

acentual.post("/deleteAcentuales", async (c) => {
  const conn = connect(getDatabaseConfig(c.env))
  const body = await c.req.json()
  const acentuales = await deleteAcentuales(body, c.env, conn)
  if (!acentuales.success) {
    return c.json({success: false, payload: acentuales.payload.message}, 400)
  }
  return c.json({success: true, payload: acentuales.payload}, 200)
})

acentual.post("/activateAcentuales", async (c) => {
  const conn = connect(getDatabaseConfig(c.env))
  const body = await c.req.json()
  const acentuales = await activateAcentuales(body, c.env, conn)
  if (!acentuales.success) {
    return c.json({success: false, payload: acentuales.payload.message}, 400)
  }
  return c.json({success: true, payload: acentuales.payload}, 200)
})



export default acentual


