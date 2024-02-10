const Notification = require('../Model/Notification');

const nodemailer = require('nodemailer');
// Contrôleur pour créer une notification
exports.createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour récupérer toutes les notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour récupérer une notification par son ID
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'benalayasabrine03@gmail.com',
    pass: 'taiq nwyk ztva sgnr'
  }
});
// Contrôleur pour mettre à jour une notification par son ID
exports.updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour supprimer une notification par son ID
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// envoi mail
exports.sendEmail = async (email, message, Objet,req, res) => {


  let emailToUse = "";
  let messageToUse = "";
  let ObjetToUse = "";

  if (req !== undefined && req.body !== undefined) {
    const { email: reqEmail, message: reqMessage, Objet: reqObjet } = req.body;
    emailToUse = reqEmail || email;
    messageToUse = reqMessage || message;
    ObjetToUse = reqObjet || Objet;
  } else {
    emailToUse = email;
    messageToUse = message;
    ObjetToUse = Objet;
  }

    const mailOptions = {
      from: 'benalayasabrine03@gmail.com',
      to: emailToUse,
      subject:ObjetToUse ,
      text:messageToUse
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('E-mail de confirmation envoyé avec succès !');
     if (res !== undefined ) {res.sendStatus(200);}
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail de confirmation :', error);
      if (res !== undefined ) { res.sendStatus(500);}
    }
    if (res !== undefined ) {  res.status(500).json({ error: error.message });}
  }
