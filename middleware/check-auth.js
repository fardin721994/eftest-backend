const jwt = require("jsonwebtoken");

const HttpError = require("../utils/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req?.headers?.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      const error = new HttpError(
        "Authentication failed because token is not provided",
        401
      );
      return next(error);
    }
    const decodedToken = jwt.verify(token, "supersecret_dont_share");
    req.adminData = { adminId: decodedToken.adminId };
    next();
  } catch (err) {
    const error = new HttpError(
      "Authentication failed because token is not valid",
      403
    );
    return next(error);
  }
};
