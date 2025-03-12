const express = require("express");
const {
  createDoctor,
  deleteDoctor,
  getDoctor,
} = require("../controllers/doctor");

const router = express.Router();

router.route("/").get(getDoctor).post(createDoctor).delete(deleteDoctor);

module.exports = router;
