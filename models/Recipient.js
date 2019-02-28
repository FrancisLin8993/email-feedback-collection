const mongoose = require("mongoose");
const { Schema } = mongoose;

const RecipientSchema = new Schema({
  email: String,
  isResponded: { type: Boolean, default: false }
});

module.exports = RecipientSchema;