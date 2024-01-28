const Medicament = require('../Model/Medicament');

// Contrôleur pour créer un médicament
exports.createMedicament = async (req, res) => {
  try {
    const medicament = new Medicament(req.body);
    await medicament.save();
    res.status(201).json(medicament);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour récupérer tous les médicaments
exports.getAllMedicaments = async (req, res) => {
  try {
    const medicaments = await Medicament.find();
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
