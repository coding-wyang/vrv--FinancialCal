const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var manageSchema = new Schema({
  group: {
    type: String,
    require: true,
  },
  id: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    required: true
  },
});
var manage = mongoose.model('ManageMan', manageSchema);
module.exports = manage;
