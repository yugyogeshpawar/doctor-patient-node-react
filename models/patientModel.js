const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  age: { type: Number, required: true },
  medicalHistory: { type: Object },
  treatmentPlan: { type: String },
  approvedForDoctor: { type: Boolean, default: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Patient", patientSchema);
