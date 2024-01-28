const Patient = require("../Model/Patient");
const patientController = {};
// Contrôleur pour créer un patient
patientController.createPatient = async (req, res) => {
  try {
    const newpatient = req.body;

    const patient = new Patient(newpatient);

    const imagePath =
      "http://localhost:4000/MedicaNet/" + req.file.path.replace(/\\/g, "/");
    patient.image = imagePath;

    const newPatientInstance = await patient.save();
    res.status(200).json({ user: newPatientInstance });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// Contrôleur pour récupérer tous les patients

patientController.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour récupérer un patient par son ID
patientController.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour mettre à jour un patient par son ID
patientController.updatePatient = async (req, res) => {
  try {
    const updateFields = {};

    if (req.body.adresse !== "") {
      updateFields.adresse = req.body.adresse;
    }

    if (req.body.notePatient !== "") {
      updateFields.notePatient = req.body.notePatient;
    }

    if (req.body.mailPatient !== "") {
      updateFields.mailPatient = req.body.mailPatient;
    }

    if (req.body.numeroTelephone !== "") {
      updateFields.numeroTelephone = req.body.numeroTelephone;
    }

    if (req.file && req.file.path) {
      const imagePath =
        "http://localhost:4000/MedicaNet/" + req.file.path.replace(/\\/g, "/");
      updateFields.image = imagePath;
    }

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      {
        new: true,
        omitUndefined: true,
      }
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour supprimer un patient par son ID
patientController.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = patientController;
