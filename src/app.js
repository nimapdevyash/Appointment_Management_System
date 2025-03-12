const express = require("express");
const doctorRouter = require("./routes/doctor");
const patientRouter = require("./routes/patient");
const appointmentRouter = require("./routes/appointment");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/doctor", doctorRouter);
app.use("/patient", patientRouter);
app.use("/appointment", appointmentRouter);

app.get("/", (req, res) =>
  res.json({
    "Hospital Name": "shamshan",
    "Doctor Name": "maut ka saudagar",
    "Hospital Moto": "jine nahi dunga",
  })
);

module.exports = app;
