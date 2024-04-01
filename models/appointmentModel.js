const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  isTimeSlotAvailable: { type: Boolean, default: true }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
