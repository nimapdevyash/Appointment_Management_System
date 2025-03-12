const { Patient } = require("../modules");

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

async function deletePatient(req, res) {
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

    await patient.destroy();

    return res.status(200).json({
      message: "patient deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  createPatient,
  getPatient,
  deletePatient,
};
