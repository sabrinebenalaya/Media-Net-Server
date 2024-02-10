const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Mail', 'SMS'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  dateEnvoi: {
    type: Date,
    required: true,
    default: Date.now
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  rdv: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RDV',
    required: true
  },
  
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
