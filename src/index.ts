import { Hono } from 'hono'
import silabas from './silaba/infrastructure/routes';
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

app.route("/silabas", silabas)
export default app
