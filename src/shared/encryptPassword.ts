
import { AES } from "crypto-js"

export function encryptPassword(password: string, env: Bindings) {
  const encrypted = AES.encrypt(password, env.ENC_KEY).toString()
  return encrypted;

}