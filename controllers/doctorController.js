const Patient = require("../models/patientModel");
const Doctor = require("../models/doctorModel");
const TreatmentRequest = require("../models/treatmentRequestModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createAuthorizationRequest = async (req, res) => {
  try {
    const newRequest = new AuthorizationRequest(req.body);
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAuthorizationRequests = async (req, res) => {
  try {
    const requests = await AuthorizationRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPatientDetails = async (req, res) => {
  try {
    const Patients = await Patient.find();

    if (!Patients) {
      return res.status(404).json({ message: "No patients found" });
    }

    res.status(200).json(Patients);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getPatientDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createDoctor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const doctor = await Doctor.findOne({ email });
    if (doctor) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoctor = new Doctor({
      _id: new mongoose.Types.ObjectId(),
      name,
      email,
      password: hashedPassword,
    });
    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const passwordMatch = await bcrypt.compare(password, doctor.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ doctorId: doctor._id }, process.env.JWT_SECRET);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { requestId, status, doctorNotes, treatmentPlan } = req.body;

    if (!requestId || !status || !doctorNotes || !treatmentPlan) {
      return res
        .status(400)
        .json({ message: "Request ID and status are required" });
    }
    const request = await TreatmentRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status;
    request.doctorNotes = doctorNotes;
    request.treatmentPlan = treatmentPlan;

    await request.save();

    res
      .status(200)
      .json({ message: "Request status updated successfully", request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const { page_number, count, filter } = req.params;

    if (!page_number || !count) {
      return res
        .status(400)
        .json({ message: "Page number and count are required" });
    }

    const skip = (page_number - 1) * count;
    const limit = parseInt(count);

    if (filter === "all") {
      const requests = await TreatmentRequest.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
      return res.status(200).json(requests);
    } else {
      const requests = await TreatmentRequest.find({ status: filter })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
      return res.status(200).json(requests);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
