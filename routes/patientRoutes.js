const express = require('express');
const {
    updatePatient,
    getRequestsWithStatus,
    approveDoctorAccess,
    getAccessRequests,
    getPatientDetails,
    createTreatmentRequest
} = require('../controllers/patientController');

const router = express.Router();


router.get('/dashboard', getPatientDetails);

router.post('/request-for-treatment', createTreatmentRequest);

router.get('/requests-with-status', getRequestsWithStatus);

router.put('/:id', updatePatient);

router.post('/approve-access', approveDoctorAccess);

router.get('/:id/access-requests', getAccessRequests);

module.exports = router;
