const Patient = require("../Model/Patient");
const patientController = {};
const notificationController = require('./notificationController')

const client = require('twilio')(process.env.ACCOUNTSID, process.env.AUTHTOKENN);
// Contrôleur pour créer un patient
patientController.createPatient = async (req, res) => {
  try {
    const newpatient = req.body;

    const patient = new Patient(newpatient);

    const imagePath =
      "http://localhost:4000/MedicaNet/" + req.file.path.replace(/\\/g, "/");
    patient.image = imagePath;

    const newPatientInstance = await patient.save();
    if (newPatientInstance){
      const message = `Cher(e) ${newPatientInstance.prenom},

      Nous sommes ravis de vous informer que votre inscription sur la plateforme MediaNet a bien été enregistrée avec succès.
      
      Votre compte a été créé et vous pouvez désormais accéder à toutes les fonctionnalités offertes par notre plateforme. 
      
      N'hésitez pas à explorer nos services et à profiter de notre contenu varié.
      
      Si vous avez des questions ou avez besoin d'assistance, n'hésitez pas à nous contacter à l'adresse email support@medianet.com.
      
      Merci de faire partie de la communauté MediaNet !

      Cordialement,
      L'équipe MediaNet"`
const SMS =`Cher ${newPatientInstance.prenom},

Merci pour votre inscription à MedicaNet, votre plateforme médicale personnelle. Votre souscription a été confirmée avec succès !

Nous sommes ravis de vous avoir parmi nous. Avec MedicaNet, vous pouvez accéder à votre dossier médical en ligne, prendre rendez-vous avec des spécialistes, consulter vos résultats de tests et bien plus encore.

N'hésitez pas à nous contacter si vous avez des questions ou des préoccupations. Nous sommes là pour vous aider à chaque étape du chemin.

Restez en bonne santé,
L'équipe MedicaNet`
      await notificationController.sendEmail(
        newPatientInstance.mailPatient,
        message,
      "Confirmation d'inscription sur MediaNet"
      );
      const patientPhoneNumber = "+216" + newPatientInstance.numeroTelephone;

      client.messages
        .create({
          body: SMS,
          from: '+16812532331',
          to: patientPhoneNumber
        })
        .then(message => console.log(message.sid))
        .catch(error => console.error('Erreur lors de l\'envoi du SMS:', error));
      
      
    }
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
