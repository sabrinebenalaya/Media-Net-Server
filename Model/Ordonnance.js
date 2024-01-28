const mongoose = require('mongoose');

const ordonnanceSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  medicaments: [{
    medicament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicament'
    }
    // Autres attributs que vous pourriez avoir pour chaque médicament dans l'ordonnance...
  }],
  rdv: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rdv',
    required: true
  },
  // Autres attributs que vous pourriez avoir pour l'ordonnance...
});

const Ordonnance = mongoose.model('Ordonnance', ordonnanceSchema);

module.exports = Ordonnance;
