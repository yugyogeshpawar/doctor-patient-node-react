const Patient = require('../models/patientModel');
const Authorization = require('../models/doctorModel');
const TreatmentRequest = require('../models/treatmentRequestModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get a single patient by ID
exports.getPatientById = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient.findById(id);

        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new patient
exports.createPatient = async (req, res) => {
    try {
        const { name, age, medicalHistory, email, password } = req.body;

        if (!name || !age || !medicalHistory || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const patient = await Patient.findOne({ email });
        if (patient) {
            return res.status(400).json({ message: 'Patient already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newPatient = new Patient({
            _id: new mongoose.Types.ObjectId(),
            name,
            age,
            medicalHistory,
            treatmentPlan: null,
            email,
            password: hashedPassword
        });

        await newPatient.save();
        res.status(201).json(newPatient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// {
//     "name": "John Doe",
//     "age": 30,
//         "medicalHistory": {
//             "allergies": ["Penicillin", "Aspirin"],
//             "medications": ["Amoxicillin", "Ibuprofen"],

//     },
//     "email": "jdoe@jdoe.com"
// }



// Update patient details by ID
exports.updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, medicalHistory, treatmentPlan } = req.body;

        const updatedPatient = await Patient.findByIdAndUpdate(id, {
            name,
            age,
            medicalHistory,
            treatmentPlan
        }, { new: true });

        if (!updatedPatient) return res.status(404).json({ message: 'Patient not found' });

        res.status(200).json(updatedPatient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete patient by ID
exports.deletePatient = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPatient = await Patient.findByIdAndDelete(id);

        if (!deletedPatient) return res.status(404).json({ message: 'Patient not found' });

        res.status(200).json({ message: 'Patient deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Approve doctor's access to patient data based on authorization
exports.approveDoctorAccess = async (req, res) => {
    try {
        const { patientId, authorizationId } = req.body;

        // Find the patient
        const patient = await Patient.findById(patientId);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        // Find the authorization request
        const authorization = await Authorization.findById(authorizationId);
        if (!authorization) return res.status(404).json({ message: 'Authorization request not found' });

        // Check if authorization is approved
        if (authorization.status === 'approved') {
            patient.approvedForDoctor = true;  // Approve access for doctor
            await patient.save();

            res.status(200).json({ message: 'Doctor access approved for patient data.' });
        } else {
            res.status(400).json({ message: 'Authorization request is not approved yet.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get access requests for a patient
exports.getAccessRequests = async (req, res) => {
    try {
        const { id } = req.params;

        const patient = await Patient.findById(id).populate('accessRequests');

        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        res.status(200).json(patient.accessRequests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loginPatient = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the patient by email
        const patient = await Patient.findOne({ email });

        if (!patient) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }    

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, patient.password);


        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ patientId: patient._id }, process.env.JWT_SECRET);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getPatientDetails = async (req, res) => {
    try {
        const id = req.patientId;
        const patient = await Patient.findById(id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

exports.createTreatmentRequest = async (req, res) => {
    try {

        const patientId = req.patientId;
        const { problemDescription } = req.body;

        if (!problemDescription) {
            return res.status(400).json({ message: 'Problem description is required' });
        }

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        TreatmentRequest.patientId = patientId;
        TreatmentRequest.problemDescription = problemDescription;

        const newTreatmentRequest = new TreatmentRequest({
            _id: new mongoose.Types.ObjectId(),
            patientId: patientId,
            problemDescription: problemDescription
        });

        await newTreatmentRequest.save();
       
        res.status(200).json({ message: 'Treatment request created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


exports.getRequestsWithStatus = async (req, res) => {
    try {
        const id = req.patientId;

        const requests = await TreatmentRequest.find({ patientId: id });

        if (!requests) {
            return res.status(404).json({ message: 'No requests found' });
        } 

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}