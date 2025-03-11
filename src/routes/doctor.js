const express = require("express");
const {
  createDoctor,
  deleteAppointment,
  deleteDoctor,
  blockPatient,
  getDoctor,
} = require("../controllers/doctor");

const router = express.Router();

router.route("/").get(getDoctor).post(createDoctor).delete(deleteDoctor);
router.route("/appointment").delete(deleteAppointment).get(blockPatient);

module.exports = router;
