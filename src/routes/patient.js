const express = require("express");
const {
  createPatient,
  addAppointment,
  getPatient,
} = require("../controllers/patient");

const router = express.Router();

router.route("/").get(getPatient).post(createPatient);
router.route("/appointment").post(addAppointment);

module.exports = router;
