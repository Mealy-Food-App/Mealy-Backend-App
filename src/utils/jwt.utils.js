import jwt from "jsonwebtoken";
import { config } from "../config/index.js";

export function genToken(user) {
  const payload = {
    email: user.email,
  };
  const token = jwt.sign(payload, config.jwt_key, { expiresIn: 60 * 60 * 24 });
  return token;
}