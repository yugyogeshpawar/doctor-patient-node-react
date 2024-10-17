const AuthorizationRequest = require('../models/doctorModel');

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


exports.getPatientDetails= async (req, res) => {
    try {
        const approvedPatients = await Patient.find({ approvedForDoctor: true });
        res.status(200).json(approvedPatients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPatientDetailsById = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient.findById(id);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};  

exports.createDoctor = async (req, res) => {
    try {
        const newDoctor = new Doctor(req.body);
        await newDoctor.save();
        res.status(201).json(newDoctor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const doctor = await Doctor.findOne({ email });
        if (!doctor) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const passwordMatch = await bcrypt.compare(password, doctor.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ doctorId: doctor._id }, process.env.JWT_SECRET);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}