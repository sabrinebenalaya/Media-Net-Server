const mongoose = require('mongoose');

const ordonnanceMedicamentSchema = new mongoose.Schema({
  ordonnance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ordonnance',
    required: true
  },
  medicament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicament',
    required: true
  },
  quantite: {
    type: Number,
    required: true
  }
  // Autres attributs que vous pourriez avoir pour cette relation...
});

const OrdonnanceMedicament = mongoose.model('OrdonnanceMedicament', ordonnanceMedicamentSchema);

module.exports = OrdonnanceMedicament;
