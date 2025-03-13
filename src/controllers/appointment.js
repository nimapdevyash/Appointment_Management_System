const { Patient, Doctor, Appointments } = require("../modules");
const BlockedPatients = require("../modules/blockedPatients");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const sendMail = require("../services/mail");

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

    await sendMail({
      email: doctor.email,
      subject: "new Appointment",
      text: `you have an appointment with patient ${patient.name} who is diagnosed with ${patient.disease}`,
    });

    await sendMail({
      email: patient.email,
      subject: "new Appointment",
      text: `you have an appointment with doctor ${doctor.name}`,
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

    const patient = await Patient.findByPk(appointment.patientId);

    if (!patient) {
      throw new Error("patient is not present");
    }

    await appointment.destroy();

    await sendMail({
      email: doctor.email,
      subject: "Appointment Cancled",
      text: `you have cancled an appointment with patient ${patient.name} `,
    });

    await sendMail({
      email: patient.email,
      subject: "Appointment Cancled",
      text: `your appointment with doctor ${doctor.name} has been cancled`,
    });

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

    // Fetch appointments with patient names
    const appointments = await Appointments.findAll({
      where: { doctorId },
      include: [{ model: Patient, attributes: ["id", "name"] }],
      attributes: ["createdAt"],
    });

    if (!appointments || appointments.length === 0) {
      return res.status(200).json({ message: "No appointments for today" });
    }

    // Format response data
    const formattedData = appointments.map((appt) => {
      const appointmentDate = appt.createdAt.toISOString().split("T")[0]; // YYYY-MM-DD
      const appointmentTime = appt.createdAt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }); // HH:MM AM/PM

      return {
        patientName: appt.Patient ? appt.Patient.name : "Unknown",
        appointmentDate,
        appointmentTime,
      };
    });

    // ** Step 1: Create an Excel Workbook **
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Appointments");

    // ** Step 2: Define Column Headers **
    worksheet.columns = [
      { header: "Patient Name", key: "patientName", width: 30 },
      { header: "Appointment Date", key: "appointmentDate", width: 25 },
      { header: "Appointment Time", key: "appointmentTime", width: 20 },
    ];

    // ** Step 3: Add Data to Worksheet **
    worksheet.addRows(formattedData);

    // ** Step 4: Save Excel File **
    const filePath = path.join(__dirname, "../../public");
    if (!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true });

    const fileName = `appointments.xlsx`;
    const fileFullPath = path.join(filePath, fileName);

    await workbook.xlsx.writeFile(fileFullPath);

    // ** Step 5: Send File to User **
    res.download(fileFullPath, fileName, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        return res.status(500).json({ message: "Error sending file" });
      }

      // ** Step 6: Delete File After Sending **
      fs.unlinkSync(fileFullPath);
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
