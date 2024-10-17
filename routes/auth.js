const express = require("express");
const router = express.Router();
const { createPatient, loginPatient } = require("../controllers/patientController");
const { createDoctor, loginDoctor } = require("../controllers/doctorController");



router.post('/patient/signup', createPatient);

router.post('/patient/login', loginPatient);

router.post('/doctor/signup', createDoctor);

router.post('/doctor/login', loginDoctor);


module.exports = router;
