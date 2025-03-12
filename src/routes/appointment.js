const express = require("express");
const {
  getAppointment,
  deleteAppointment,
  createAppointment,
  blockPatient,
  unBlockPatient,
  fetchAllAppointments,
} = require("../controllers/appointment");

const router = express.Router();

router
  .route("/")
  .get(getAppointment)
  .delete(deleteAppointment)
  .post(createAppointment);

router.route("/all").get(fetchAllAppointments);

router.route("/block").post(blockPatient);
router.route("/unblock").delete(unBlockPatient);

module.exports = router;
