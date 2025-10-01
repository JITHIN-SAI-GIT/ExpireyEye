const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const alertsSchema = new Schema({
  product: {
    type: String,
    required: true,
  },
  validdate: {
    type: Number,
    required: true,
  },
    expiredate: {
    type: Number,
    required: true,
  },
});


module.exports = mongoose.module("Alerts",alertsSchema)