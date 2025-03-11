const { Patient, Doctor } = require("../modules");

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

async function addAppointment(req, res) {
  try {
    const { patientId, doctorId } = req.body;

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

    let appointmentsOftheDay = Appointments.count(doctorId);

    // FIXME: read about this , this is wrong
    if (appointmentsOftheDay >= 7) {
      return res.status(400).json({
        message: "appointments are full for the day",
      });
    }

    //FIXME: read about this relation setting
    await doctor.setAppointment(patient);

    return res.status(200).json({
      message: "appointment is added successfully",
    });
  } catch (error) {}
}

module.exports = {
  createPatient,
  addAppointment,
};
