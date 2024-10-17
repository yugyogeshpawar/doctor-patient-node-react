const express = require("express");
const router = express.Router();
const {
  createAuthorizationRequest,
  getAllPatientDetails,
  getAuthorizationRequests,
  getPatientDetailsById,
  updateRequestStatus,
  getAllRequests
} = require("../controllers/doctorController");

// router.post("/", createAuthorizationRequest);
// router.get("/", getAuthorizationRequests);
// router.get("/:id", getPatientDetailsById);
router.get("/getAllPatientDetails", getAllPatientDetails);
router.get("/getAllRequests/:page_number/:count/:filter", getAllRequests);
router.put("/updateRequestStatus", updateRequestStatus);


module.exports = router;
