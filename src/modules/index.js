const Appointments = require("./appointments");
const BlockedPatients = require("./blockedPatients");
const Doctor = require("./doctor");
const Patient = require("./patient");

// single patient can book appointment with many doctors and one doctor can examine many patients
Doctor.belongsToMany(Patient, {
  through: Appointments,
  foreignKey: "doctorId",
  constraints: false,
});

Patient.belongsToMany(Doctor, {
  through: Appointments,
  foreignKey: "patientId",
  constraints: false,
});

// Explicitly define relationships to enable eager loading
Appointments.belongsTo(Doctor, { foreignKey: "doctorId" });
Appointments.belongsTo(Patient, { foreignKey: "patientId" });

// single patient can be blacked by many doctors and one doctor can black many patients
Doctor.belongsToMany(Patient, {
  through: BlockedPatients,
  foreignKey: "doctorId",
  constraints: false,
});

Patient.belongsToMany(Doctor, {
  through: BlockedPatients,
  foreignKey: "patientId",
  constraints: false,
});

module.exports = {
  Doctor,
  Patient,
  Appointments,
};
