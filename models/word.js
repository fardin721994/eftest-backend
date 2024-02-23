const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const wordSchema = new Schema({
  word: { type: String, required: true },
  pronunciation: { type: String, required: true },
  frequency: { type: Object, required: true },
  partOfSpeech: { type: String, required: true },
  additionalInfo: { type: String, required: true },
  register: { type: String, required: true },
  meaning: { type: Object, required: true },
  title: { type: String, required: true },
  translation: { type: String, required: true },
  images: { type: Array, required: true },
});

module.exports = mongoose.model("Word", wordSchema);
