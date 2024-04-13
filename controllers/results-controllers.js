const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../utils/http-error");

const Results = require("../models/results");
// const User = require("../models/user");

const getAllResults = async (req, res, next) => {
  let data;
  try {
    data = await Results.find();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not return the results.",
      500
    );
    return next(error);
  }
  // TODO: Jonas said in situation when we try to get all data, if the number of data in database is 0, there hasn't been an error because we successfully received the request and mongoose successfully did it's job in searching in database. So no error actually happend and we should return a 200 response and 0 numbers data to deal with in front-end 👇:
  if (!data) {
    const error = new HttpError("There's not any results to return.", 404);
    return next(error);
  }
  const resultsList = data.map((results) => ({
    ...results,
    id: results._id,
  }));
  res.status(200).json(resultsList);
};
///////////////////////////
const getResultsById = async (req, res, next) => {
  const resultsId = req.params.rid;

  let results;
  try {
    results = await Results.findById(resultsId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find results.",
      500
    );
    return next(error);
  }
  // ?Why we need the following if block? Because if mongoose can't find a data for provided ID, it returns null (it does not throw an error)
  if (!results) {
    const error = new HttpError(
      "Could not find results for the provided id.",
      404
    );
    return next(error);
  }

  // res.json({ cResult: cResult.toObject({ getters: true }) });
  res.json(results);
};

/////////////////
const createResults = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { profile, results } = req.body;

  const createdResults = new Results({
    profile,
    results,
  });

  // let user;
  // try {
  //   user = await User.findById(creator);
  // } catch (err) {
  //   const error = new HttpError(
  //     "Creating cResult failed, please try again",
  //     500
  //   );
  //   return next(error);
  // }

  // if (!user) {
  //   const error = new HttpError("Could not find user for provided id", 404);
  //   return next(error);
  // }

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    // await createdCResult.save({ session: sess });
    // user.cResults.push(createdCResult);
    // await user.save({ session: sess });
    // await sess.commitTransaction();
    await createdResults.save();
  } catch (err) {
    const error = new HttpError(
      "Creating results failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ results: createdResults });
};

const deleteResults = async (req, res, next) => {
  const resultsId = req.params.rid;

  let results;
  try {
    // results = await Results.findById(resultsId).populate("creator");
    results = await Results.findById(resultsId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete results.",
      500
    );
    return next(error);
  }

  if (!results) {
    const error = new HttpError("Could not find results for this id.", 404);
    return next(error);
  }

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    // await Result.remove({ session: sess });
    await results.deleteOne();
    // Result.creator.Results.pull(Result);
    // await Result.creator.save({ session: sess });
    // await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete results.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Results deleted." });
};

exports.getAllResults = getAllResults;
exports.getResultsById = getResultsById;
exports.createResults = createResults;
exports.deleteResults = deleteResults;
