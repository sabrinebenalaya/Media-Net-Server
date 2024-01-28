const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  sexe: {
    type: String,
    enum: ['Homme', 'Femme'],
    required: true
  },
  adresse: {
    type: String,
    required: true
  },
  numeroTelephone: {
    type: String,
    required: true
  },
  mailPatient: {
    type: String,
    required: true
  },
  notePatient: {
    type: String,
    required: false
  },
 image: {  type: String },
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
