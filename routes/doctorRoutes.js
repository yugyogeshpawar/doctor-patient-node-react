const express = require("express");
const router = express.Router();
const {
  createAuthorizationRequest,
  getPatientDetails,
  getAuthorizationRequests,
  getPatientDetailsById,
} = require("../controllers/doctorController");

router.post("/", createAuthorizationRequest);
router.get("/", getAuthorizationRequests);
router.get("approved-patients", getPatientDetails);
router.get("/:id", getPatientDetailsById);
router.get("/all", getPatientDetails);

module.exports = router;
