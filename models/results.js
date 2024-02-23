const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const resultsSchema = new Schema({
  profile: { type: Object, required: true },
  results: { type: Object, required: true },
});

module.exports = mongoose.model("results", resultsSchema);
