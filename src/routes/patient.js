const express = require("express");
const {
  createPatient,
  getPatient,
  deletePatient,
} = require("../controllers/patient");

const router = express.Router();

router.route("/").get(getPatient).post(createPatient).delete(deletePatient);

module.exports = router;
