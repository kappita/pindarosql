import { Hono } from 'hono';
import { login } from '../application/login';
import { connect, Config } from "@planetscale/database";
import { addUser } from '../application/addUser';
import { addAdmin } from '../application/addAdmin';
import { cors } from 'hono/cors';

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

const users = new Hono<{ Bindings: Bindings }>()
users.use("*", cors())
users.post("/login", async (c) => {
  const conn = connect(getDatabaseConfig(c.env))
  const body = await c.req.json()
  const res = await login(body, conn)
  if (!res.success) {
    return c.json({success: false, payload: {message: res.payload.message, user: res.payload.user}}, 400)
  }
  return c.json({
    success: true, payload:{
      message: res.payload.message,
      user: res.payload.user
    }
  }, 200)
})

users.post("/register", async (c) => {
  const conn = connect(getDatabaseConfig(c.env))
  const body = await c.req.json()
  const res = await addUser(body, conn)
  if (!res.success) {
    return c.json({success: false, payload: {message: res.payload.message}}, 400)
  }
  return c.json({
    success: true, payload:{
        message: res.payload.message
    }
  }, 200)
})

users.post("/registerAdmin", async (c) => {
  const conn = connect(getDatabaseConfig(c.env))
  const body = await c.req.json()
  const res = await addAdmin(body, c.env.SECRET_KEY, conn)
  if (!res.success) {
    return c.json({success: false, payload: {message: res.payload.message}}, 400)
  }
  return c.json({
    success: true, payload:{
        message: res.payload.message
    }
  }, 200)
})

export default users