const { Doctor, Patient } = require("../modules");

async function createDoctor(req, res) {
  try {
    const name = req.body.name;

    if (!name) {
      return res.status(404).send("name is required");
    }

    const doctor = await Doctor.create({ name });

    if (!doctor) {
      return res.status(500).json({
        message: "doctor creation failed",
      });
    }

    return res.status(200).json({
      message: "doctor created successfully",
      data: doctor,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

// FIXME: fix this after reading documention of sequelize
async function blockPatient(req, res) {
  try {
    const { patientId, doctorId } = req.body;

    if (!patientId) {
      return res.status(404).send("patientId is required");
    }

    const patient = await Patient.findByPk(patientId);
    const doctor = await Doctor.findByPk(doctorId);

    if (!patient || !doctor) {
      return res.status(404).json({
        message: "invalid credentialls",
      });
    }

    await doctor.blockPatient(patient.id);

    return res.status(200).json({
      message: "patient blocked successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function deleteDoctor(req, res) {
  try {
    const { doctorId } = req.body;

    if (!doctorId) {
      return res.status(404).json({
        message: "doctor id is required",
      });
    }

    const doctor = await Doctor.findByPk(doctorId);

    if (!doctor) {
      return res.status(400).json({
        message: "invalid doctor id",
      });
    }

    await doctor.destroy();

    return res.status(200).json({
      message: "doctor deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getDoctor(req, res) {
  try {
    const { doctorId } = req.body;

    if (!doctorId) {
      return res.status(404).json({
        message: "doctor id is required",
      });
    }

    const doctor = await Doctor.findByPk(doctorId);

    if (!doctor) {
      return res.status(400).json({
        message: "invalid doctor id",
      });
    }

    return res.status(200).json({
      message: "doctor fetched successfully",
      doctor,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

// FIXME: fix this after reading documention of sequelize
async function deleteAppointment(req, res) {
  try {
    const { doctorId, appointmentId } = req.body;

    if (!doctorId || !appointmentId) {
      return res.status(404).json({
        message: "all feilds are required",
      });
    }

    const doctor = Doctor.findByPk(doctorId);

    if (!doctor) {
      return res.status(404).json({
        message: "invalid doctor id",
      });
    }

    const appointment = await doctor.getAppointment(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        message: "appoitment not found",
      });
    }

    await doctor.deleteAppointment(appointmentId);

    return res.status(200).json({
      message: "appointment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  createDoctor,
  blockPatient,
  deleteDoctor,
  getDoctor,
  deleteAppointment,
};
