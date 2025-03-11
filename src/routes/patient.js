const express = require("express");
const { createPatient, addAppointment } = require("../controllers/patient");

const router = express.Router();

router.route("/").post(createPatient);
router.route("/appointment").post(addAppointment);

module.exports = router;
