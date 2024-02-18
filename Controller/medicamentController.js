const Medicament = require('../Model/Medicament');
const Ordonnance = require('../Model/Ordonnance');
const Rdv = require('../Model/RDV');


// Contrôleur pour récupérer tous les médicaments
exports.getAllMedicaments = async (req, res) => {
  try {
    const medicaments = await Medicament.find();
    res.status(200).json(medicaments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour récupérer tous les médicaments d'un patient
exports.getAllMedicamentsPrescritsToPatient= async (req, res) => {
  try {
    // Obtenez l'ID du patient à partir de la requête ou de l'authentification, selon votre implémentation.
    const patientId = req.params.id; // Assurez-vous que vous avez l'ID du patient dans la requête.

    // Obtenez la date actuelle et la date d'il y a trois mois
    const currentDate = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

    // Obtenez tous les rendez-vous du patient au cours des trois derniers mois
    const rdvs = await Rdv.find({
      patient: patientId,
      date: { $gte: threeMonthsAgo, $lte: currentDate }
    });
    // Obtenez toutes les ordonnances liées à ces rendez-vous
    const ordonnances = await Ordonnance.find({ rdv: { $in: rdvs.map(rdv => rdv._id) } });
    
    // Obtenez tous les médicaments liés à ces ordonnances
    const medicaments = await Medicament.find({ ordonnance: { $in: ordonnances.map(ord => ord._id) } });

    res.status(200).json(medicaments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour récupérer un médicament par son ID
exports.getMedicamentById = async (req, res) => {
  try {
    const medicament = await Medicament.findById(req.params.id);
    if (!medicament) {
      return res.status(404).json({ message: 'Medicament not found' });
    }
    res.status(200).json(medicament);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour mettre à jour un médicament par son ID
exports.updateMedicament = async (req, res) => {
  try {
    const medicament = await Medicament.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!medicament) {
      return res.status(404).json({ message: 'Medicament not found' });
    }
    res.status(200).json(medicament);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour supprimer un médicament par son ID
exports.deleteMedicament = async (req, res) => {
  try {
    const medicament = await Medicament.findByIdAndDelete(req.params.id);
    if (!medicament) {
      return res.status(404).json({ message: 'Medicament not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
