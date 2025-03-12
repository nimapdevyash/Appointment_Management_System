const express = require("express");
const {
  getAppointment,
  deleteAppointment,
  createAppointment,
  blockPatient,
  unBlockPatient,
} = require("../controllers/appointment");

const router = express.Router();

router
  .route("/")
  .get(getAppointment)
  .delete(deleteAppointment)
  .post(createAppointment);

router.route("/block").post(blockPatient);
router.route("/unblock").delete(unBlockPatient);

module.exports = router;
