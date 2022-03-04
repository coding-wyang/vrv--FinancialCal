const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var userSchema = new Schema({
  year: {
    type: Number,
    require: true,
  },
  month: {
    type: Number,
    require: true,
  },
  name: {
    type: String,
    required: true
  },
  traffic: {
    type: Number,
    required: true,
  },
  meal: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});
var user = mongoose.model('WorkMan', userSchema);
module.exports = user;