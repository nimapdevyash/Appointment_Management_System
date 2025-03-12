const { Doctor } = require("../modules");

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

module.exports = {
  createDoctor,
  deleteDoctor,
  getDoctor,
};
