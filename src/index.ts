import { Hono } from 'hono'
import { cors } from 'hono/cors'
import silabas from './silaba/infrastructure/routes';
import users from './user/infrastructure/routes';
import acentual from './acentual/infrastructure/routes';
import scores from './scores/infrastructure/routes';
import rimas from './rimas/infrastructure/routes';
const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  const environment = c.env.ENV;
  if (environment) {
    return c.json({
      success: true,
      payload: `Hono running on ${environment} environment`,
    });
  }
  return c.json({ success: false, payload: "Environment not found" });
});

app.get("/test", async (c) => {
  let result = 0;
  for (let i = 0; i < 500000; i++) {
    result += Math.random();
  }
  for (let i = 0; i < 500000; i++) {
    result += Math.random();
  }
  for (let i = 0; i < 500000; i++) {
    result += Math.random();
  }
  return c.text(`${result}`)
})

app.use("*", cors())
app.route("/silabas", silabas)
app.route("/users", users)
app.route("/acentual", acentual)
app.route("/scores", scores)
app.route("/rimas", rimas)
export default app
