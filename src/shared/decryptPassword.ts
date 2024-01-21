import { AES, enc } from "crypto-js"

export function decryptPassword(password: string, env: Bindings) {
  const decrypted = AES.decrypt(password, env.ENC_KEY).toString(enc.Utf8)
  return decrypted;

}