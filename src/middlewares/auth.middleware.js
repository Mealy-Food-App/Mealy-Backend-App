import { UnAuthorizedError } from "../error/error.js";
import { authToken } from "../utils/jwt.utils.js";

const userAuthMiddleWare = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];
  console.log(token)
  if (!token) {
    throw new UnAuthorizedError("You must provide an authorization token.");
  }

  try {
    const payload = authToken(token);
    req.user = payload;
    next();
  } catch (err) {
    throw new UnAuthorizedError("Access denied, invalid token.");
  }
};

export { userAuthMiddleWare };