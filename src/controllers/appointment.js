const { Patient, Doctor, Appointments } = require("../modules");
const BlockedPatients = require("../modules/blockedPatients");
const ExcelJS = require("exceljs");
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
      return res.status(400).json({ message: "Doctor ID is required" });
    }

    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const appointments = await Appointments.findAll({ where: { doctorId } });

    if (!appointments || appointments.length === 0) {
      return res.status(200).json({ message: "No appointments for today" });
    }

    // Define file path and name
    const filePath = path.resolve(__dirname, "../../public");
    const fileName = `appointments_${Date.now()}.xlsx`;
    const file = path.join(filePath, fileName);

    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Appointments");

    // Define columns
    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Doctor ID", key: "doctorId", width: 10 },
      { header: "Patient ID", key: "patientId", width: 10 },
      { header: "Created At", key: "createdAt", width: 25 },
      { header: "Updated At", key: "updatedAt", width: 25 },
    ];

    // Add rows
    appointments.forEach((appointment) => {
      worksheet.addRow({
        id: appointment.id,
        doctorId: appointment.doctorId,
        patientId: appointment.patientId,
        createdAt: new Date(appointment.createdAt).toLocaleString(),
        updatedAt: new Date(appointment.updatedAt).toLocaleString(),
      });
    });

    // Ensure the workbook is fully written before sending
    await workbook.xlsx.writeFile(file);

    // Stream the file to the response
    res.sendFile(file, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        return res.status(500).json({ message: "Error sending file" });
      }
      // Delete file after sending
      fs.unlinkSync(file);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
