const { Appointments, Patient, Doctor } = require("../modules");

async function createPatient(req, res) {
  try {
    const { name, disease } = req.body;

    if (!name || !disease) {
      return res.status(404).json({
        Message: "all fields are required",
      });
    }

    const patient = await Patient.create({
      name,
      disease,
    });

    if (!patient) {
      return res.status(500).json({
        message: "error while creating the patient",
      });
    }

    return res.status(200).json({
      message: "patient created successfully",
      data: patient,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getPatient(req, res) {
  try {
    const { patientId } = req.body;

    if (!patientId) {
      return res.status(404).json({
        Message: "patientId is required",
      });
    }

    const patient = await Patient.findByPk(patientId);

    if (!patient) {
      return res.status(500).json({
        message: "invalid patientId",
      });
    }

    return res.status(200).json({
      message: "patient fetched successfully",
      data: patient,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function addAppointment(req, res) {
  try {
    const { patientId, doctorId } = req.body;

    console.log(patientId, doctorId);

    if (!patientId || !doctorId) {
      return res.status(404).json({
        message: "all feilds are required",
      });
    }

    const patient = await Patient.findByPk(patientId);
    const doctor = await Doctor.findByPk(doctorId);

    if (!patient || !doctor) {
      return res.status(404).json({
        message: "invalid credentials",
      });
    }

    let appointmentsOftheDay = await Appointments.count({
      where: {
        doctorId,
      },
    });

    console.log("count : ", appointmentsOftheDay);

    if (appointmentsOftheDay >= 7) {
      return res.status(400).json({
        message: "appointments are full for the day",
      });
    }

    const appointment = await Appointments.create({
      doctorId,
      patientId,
    });

    return res.status(200).json({
      message: "appointment is added successfully",
      data: appointment,
    });
  } catch (error) {
    console.log("error while setting an appointment", error);
    res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  createPatient,
  getPatient,
  addAppointment,
};
