const Doctor = require("./doctor");
const Patient = require("./patient");

// single patient can book appointment with many doctors and one doctor can examine many patients
Doctor.belongsToMany(Patient, { through: "appointments" });
Patient.belongsToMany(Doctor, { through: "appointments" });

// doctor can block many patient
Doctor.hasMany(Patient, { as: "blockedPatients", foreignKey: "blockedByID" });
Patient.belongsTo(Doctor, { as: "BlockedByDoctor", foreignKey: "blockedByID" });

module.exports = {
  Doctor,
  Patient,
};
