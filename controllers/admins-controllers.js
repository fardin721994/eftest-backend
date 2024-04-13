const { validationResult } = require("express-validator");
// This library helps us with hashing passwords. We don't want passwords to be stored in plain text.
const bcrypt = require("bcrypt");
// This library helps us with creating token
const jwt = require("jsonwebtoken");

const HttpError = require("../utils/http-error");
const Admin = require("../models/admin");

//////////////////////////////////////////////////////////

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingAdmin;

  try {
    existingAdmin = await Admin.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    // WHEN next() FUNCTION RECEIVES AN ARGUMENT, IT KNOWS AUTOMATICALLY THAT AN ERROR HAS HAPPEND SO AFTER RETURNING FROM CURRENT FUNCTION, NODE JS WILL JUMP TO OUR ERROR HANDLING MIDDLEWARE (THE FINAL app.use IN index.js FILE)
    // WE USE return TO PREVENT THE REMAINING CODE IN THIS FUNCTION FROM BEING EXECUTED SO WE JUMP STRAIT TO OUR ERROR HANDLING MIDDLEWARE
    return next(error);
  }
  // ?Why we need the following if block? Because if mongoose can't find a data for provided ID, it returns null (it does not throw an error)
  if (!existingAdmin) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingAdmin.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { adminId: existingAdmin.id, email: existingAdmin.email },
      "supersecret_dont_share",
      { expiresIn: "60d" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    adminId: existingAdmin.id,
    email: existingAdmin.email,
    token: token,
  });
};

exports.login = login;
