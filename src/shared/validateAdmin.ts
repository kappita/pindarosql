import { authenticateJWT } from "./authenticateJWT"

export async function validateAdmin(token: string, env: Bindings) {
  const creds = await authenticateJWT(token, env);

  if (!creds.content || !creds.content.is_admin) {
    return false
  }

  return true
}

