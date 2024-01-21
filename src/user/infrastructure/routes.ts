import { Hono } from 'hono';
import { login } from '../application/login';
import { connect, Config } from "@planetscale/database";
import { addUser } from '../application/addUser';
import { addAdmin } from '../application/addAdmin';
import { cors } from 'hono/cors';
import { encryptPassword } from '../../shared/encryptPassword';
import { decryptPassword } from '../../shared/decryptPassword';

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
  const res = await login(body, c.env, conn)
  if (!res.success) {
    return c.json(
      {
        success: false,
        message: res.message,
        payload: {
          user: res.payload.user
        }
      }, 400)
  }
  return c.json({
    success: true,
    message: res.message,
    payload:{
      user: res.payload.user
    }
  }, 200)
})

users.post("/register", async (c) => {
  const conn = connect(getDatabaseConfig(c.env))
  const body = await c.req.json()
  const res = await addUser(body, c.env, conn)
  if (!res.success) {
    return c.json(
      {
        success: false,
        message: res.message,
        payload: {}
      }, 400)
  }
  return c.json({
    success: true, payload:{
        message: res.message
    }
  }, 200)
})

users.post("/registerAdmin", async (c) => {
  const conn = connect(getDatabaseConfig(c.env))
  const body = await c.req.json()
  const res = await addAdmin(body, c.env, conn)
  if (!res.success) {
    return c.json({success: false, payload: {message: res.message}}, 400)
  }
  return c.json({
    success: true, 
    message: res.message,
    payload:{
    }
  }, 200)
})

users.get('/testEnc/:toEncrypt', async (c) => {
  const text = c.req.param("toEncrypt");
  const bruh = await encryptPassword(text, c.env);
  return c.text(bruh);

})

users.get('/test/:toDecrypt', async (c) => {
  const text = c.req.param("toDecrypt");
  const bruh = await decryptPassword("U2FsdGVkX19ExXGC9br/seDzSgNyuhKlOBmSfBslOIA=", c.env);
  return c.text(bruh);

})


export default users