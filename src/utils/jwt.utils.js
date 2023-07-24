import jwt from "jsonwebtoken";
import { config } from "../config/index.js";

export function genToken(user) {
  const payload = {
    email: user.email,
  };
  const token = jwt.sign(payload, config.jwt_key, { expiresIn: 60 * 60 * 24 * 30 });
  return token;
}


export function authToken(token) {
  return jwt.verify(token, config.jwt_key);
}