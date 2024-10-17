const express = require('express');
const {
    getPatientById,
    updatePatient,
    deletePatient,
    approveDoctorAccess,
    getAccessRequests,
    getPatientDetails,
    createTreatmentRequest
} = require('../controllers/patientController');

const router = express.Router();

router.post('/approve-access', approveDoctorAccess);

router.get('/:id/access-requests', getAccessRequests);

router.get('/dashboard', getPatientDetails);

router.post('/request-for-treatment', createTreatmentRequest);

router.put('/:id', updatePatient);





module.exports = router;
