const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    problemDescription: { type: String, required: true },
    doctorNotes: { type: String },
    treatmentPlan: { type: String },
    status: {
        type: String,
        enum: ["pending", "approved", "denied"],
        default: "pending",
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    
});

module.exports = mongoose.model("TreatmentRequest", treatmentSchema);

