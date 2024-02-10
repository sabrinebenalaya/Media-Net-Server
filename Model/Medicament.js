const mongoose = require('mongoose');

const medicamentSchema = new mongoose.Schema({
  
  nom: {
    type: String,
    required: true
  },
  matin: {
    type: Number,
    required: false
  },
  midi: {
    type: Number,
    required: false
  },
  apres_midi: {
    type: Number,
    required: false
  },
  soir: {
    type: Number,
    required: false
  },
  stock: {
    type: Number,
    required: false
  },
  ordonnance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ordonnance'
  },
  // Autres attributs que vous pourriez avoir...
});

const Medicament = mongoose.model('Medicament', medicamentSchema);

module.exports = Medicament;
