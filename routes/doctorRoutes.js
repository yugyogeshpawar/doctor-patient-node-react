const express = require("express");
const router = express.Router();
const {
  getAllPatients,
  updateRequestStatus,
  getAllRequests
} = require("../controllers/doctorController");


router.get("/getAllPatients", getAllPatients);
router.get("/getAllRequests/:page_number/:count/:filter", getAllRequests);
router.put("/updateRequestStatus", updateRequestStatus);


module.exports = router;
