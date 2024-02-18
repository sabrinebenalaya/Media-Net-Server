const Ordonnance = require("../Model/Ordonnance");
const Medicament = require("../Model/Medicament");
const RDV = require("../Model/RDV");
const notificationController = require('./../Controller/notificationController');
const Patient = require("../Model/Patient");
const moment = require('moment');
// Contrôleur pour créer une ordonnance
exports.createOrdonnance = async (req, res) => {
  try {
  
    const { idPatient, idRdv, medicaments } = req.body;

    const ordonnancefound = await Ordonnance.find({ rdv: idRdv });

    if (ordonnancefound.length === 0) {
      const ordonnances = new Ordonnance({
        patient: idPatient,
        medicaments: medicaments,
        rdv: idRdv,
      });

      const ordonnance = await ordonnances.save();

      for (const medicamentObj of medicaments) {
        const matin = parseFloat(medicamentObj.matin) || 0;
        const apres_midi = parseFloat(medicamentObj.apres_midi) || 0;
        const midi = parseFloat(medicamentObj.midi) || 0;
        const soir = parseFloat(medicamentObj.soir) || 0;

        const totalTreatment = Math.ceil(
          (matin + midi + apres_midi + soir) * 90) 
        ;



        const medicament = new Medicament({
          nom: medicamentObj.nom,
          matin:medicamentObj.matin,
          soir:medicamentObj.soir,
          apres_midi:medicamentObj.apres_midi,
          midi :medicamentObj.midi,
          stock: totalTreatment,
          ordonnance: ordonnance._id,
        });

        await medicament.save();
   
      }
      

   const rdv = await RDV.findByIdAndUpdate(
        idRdv,
        { status: "Termine" },
        { new: true }
      );
      const patient = await Patient.findById(ordonnance.patient)
      const listeMedicaments = medicaments.map(medicament => medicament.nom).join(', ');
      const formattedDate = moment(rdv.date).format("YYYY-MM-DD");
   
      const message =`Cher(e) ${patient.prenom},

      Nous vous confirmons que votre ordonnance a bien été ajoutée à votre dossier médical. 
      Veuillez trouver ci-dessous les détails de l'ordonnance :
 
      Nom du médecin : ${rdv.title}
      Date de prescription :${formattedDate}
      Médicaments prescrits : ${listeMedicaments}
 
      Si vous avez des questions concernant votre ordonnance ou si vous avez besoin de plus d'informations, n'hésitez pas à nous contacter.
 
      Notre équipe est là pour vous aider.
 
      Merci de votre confiance.
 
     Cordialement,
     L'équipe MediaNet`
      await notificationController.sendEmail(
        patient.mailPatient,
        message,
       "Confirmation d'ajout d'ordonnance"
      );
     

      return res.status(201).json({ ordonnance: ordonnance });
   
    } else {
      return res
        .status(404)
        .json({ message: "Une ordonnace est deja prescrit pour cet RDV" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour récupérer une ordonnance par rdv
exports.getOrdonnanceByRDV = async (req, res) => {
  try {
       const ordonnancefound = await Ordonnance.find({ rdv: req.params.idRDV });

    if (ordonnancefound === null) {
      return res.status(404);
    } else {
      return res.status(201).json(ordonnancefound);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour récupérer toutes les ordonnances
exports.getAllOrdonnances = async (req, res) => {
  try {
    const ordonnances = await Ordonnance.find();
    res.status(200).json(ordonnances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour récupérer une ordonnance par son ID
exports.getOrdonnanceById = async (req, res) => {
  try {
    const ordonnance = await Ordonnance.findById(req.params.id);
    if (!ordonnance) {
      return res.status(404).json({ message: "Ordonnance not found" });
    }
    res.status(200).json(ordonnance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour mettre à jour une ordonnance par son ID
exports.updateOrdonnance = async (req, res) => {
  try {
    const ordonnance = await Ordonnance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!ordonnance) {
      return res.status(404).json({ message: "Ordonnance not found" });
    }
    res.status(200).json(ordonnance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour supprimer une ordonnance par son ID
exports.deleteOrdonnance = async (req, res) => {
  try {
    const ordonnance = await Ordonnance.findByIdAndDelete(req.params.id);
    if (!ordonnance) {
      return res.status(404).json({ message: "Ordonnance not found" });
    }
    const ordonnances = await Ordonnance.find();
    res.status(200).json(ordonnances);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
