const { Patient, Doctor, Appointments } = require("../modules");
const BlockedPatients = require("../modules/blockedPatients");
const fs = require("fs");
const path = require("path");

async function getAppointment(req, res) {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(404).json({
        message: "all feilds are required",
      });
    }

    const appointment = await Appointments.findByPk(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        message: "invalid appointment id",
      });
    }

    return res.status(200).json({
      message: "appointment deleted successfully",
      data: appointment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function createAppointment(req, res) {
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

    const isBlocked = await BlockedPatients.findOne({
      where: {
        doctorId,
        patientId,
      },
    });

    if (isBlocked) {
      return res.status(200).json({
        message: "doctor has blocked the patient",
        data: isBlocked,
      });
    }

    let appointmentsOftheDay = await Appointments.count({
      where: {
        doctorId,
      },
    });

    // doctor works seven hourse a day thus only 7 appointments , (one appointment per hour)
    if (appointmentsOftheDay > 7) {
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

async function deleteAppointment(req, res) {
  try {
    const { doctorId, appointmentId } = req.body;

    if (!doctorId || !appointmentId) {
      return res.status(404).json({
        message: "all feilds are required",
      });
    }

    const [doctor, appointment] = await Promise.all([
      Doctor.findByPk(doctorId),
      Appointments.findByPk(appointmentId),
    ]);

    if (!doctor || !appointment) {
      return res.status(404).json({
        message: "invalid credentials",
      });
    }

    await appointment.destroy();

    return res.status(200).json({
      message: "appointment deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function blockPatient(req, res) {
  try {
    const { patientId, doctorId } = req.body;

    if (!patientId || !doctorId) {
      return res.status(404).send("all feilds are required");
    }

    const [patient, doctor] = await Promise.all([
      Patient.findByPk(patientId),
      Doctor.findByPk(doctorId),
    ]);

    if (!patient || !doctor) {
      return res.status(404).json({
        message: "invalid credentialls",
      });
    }

    const block = await BlockedPatients.create({
      doctorId,
      patientId,
    });

    if (!block) {
      return res.status(500).json({
        message: "couldn't block patient",
      });
    }

    return res.status(200).json({
      message: "patient blocked successfully",
      data: block,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function unBlockPatient(req, res) {
  try {
    const { patientId, doctorId } = req.body;

    if (!patientId || !doctorId) {
      return res.status(404).send("all feilds are required");
    }

    const [patient, doctor] = await Promise.all([
      Patient.findByPk(patientId),
      Doctor.findByPk(doctorId),
    ]);

    if (!patient || !doctor) {
      return res.status(404).json({
        message: "invalid credentialls",
      });
    }

    const blockedPatient = await BlockedPatients.findOne({
      where: {
        doctorId,
        patientId,
      },
    });

    if (!blockedPatient) {
      return res.status(404).json({
        message: "couldn't find blocked patient",
      });
    }

    await blockedPatient.destroy();

    return res.status(200).json({
      message: "patient unBlocked successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function fetchAllAppointments(req, res) {
  try {
    const { doctorId } = req.body;

    if (!doctorId) {
      return res.status(404).json({
        message: "credentials required",
      });
    }

    const doctor = Doctor.findByPk(doctorId);

    if (!doctor) {
      return res.status(404).json({
        message: "invalid credentials",
      });
    }

    const appointments = await Appointments.findAll({
      where: { doctorId },
    });

    if (!appointments) {
      return res.status(200).json({
        message: "no appointments for today",
      });
    }

    let filePath = path.resolve(__dirname, "../../public");
    let fileName = Date.now().toString() + ".json";
    let file = path.join(filePath, fileName);

    const data = JSON.stringify(appointments);

    fs.writeFileSync(file, data);

    res.status(200).sendFile(file);

    // fs.unlinkSync(file);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  getAppointment,
  deleteAppointment,
  createAppointment,
  blockPatient,
  unBlockPatient,
  fetchAllAppointments,
};
