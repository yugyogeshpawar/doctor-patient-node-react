const Authorization = require('../models/Authorization');
const Patient = require('../models/Patient');

// Submit a prior authorization request
exports.submitAuthorizationRequest = async (req, res) => {
    try {
        const { patientId, doctorId } = req.body;

        // Create new authorization request
        const newAuthorization = new Authorization({
            _id: new mongoose.Types.ObjectId(),
            patientId,
            doctorId,
            status: 'pending'
        });

        // Save the authorization request
        await newAuthorization.save();

        res.status(201).json({ message: 'Authorization request submitted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update authorization request status (approve/deny)
exports.updateAuthorizationStatus = async (req, res) => {
    try {
        const { requestId, status } = req.body;

        // Find the authorization request by ID
        const authorization = await Authorization.findById(requestId);

        if (!authorization) return res.status(404).json({ message: 'Authorization request not found' });

        // Update the status (approved or denied)
        authorization.status = status;
        authorization.updatedAt = Date.now();

        // Save the updated authorization
        await authorization.save();

        res.status(200).json({ message: 'Authorization request status updated successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all prior authorization requests for a patient
exports.getPatientAuthorizations = async (req, res) => {
    try {
        const { patientId } = req.params;

        // Find all authorization requests for the patient
        const authorizations = await Authorization.find({ patientId }).populate('patientId');

        if (!authorizations) return res.status(404).json({ message: 'No authorization requests found for this patient' });

        res.status(200).json(authorizations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
