const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const appointmentScehma = new Schema({
  date: Date,
  time: Time,
  isTimeSlotAvailable: true,
});
