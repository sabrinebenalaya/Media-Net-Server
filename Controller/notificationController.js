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




// envoi mail from schedule
exports.sendEmail = async (email, message, Objet,req, res) => {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'benalayasabrine03@gmail.com',
      pass: 'taiq nwyk ztva sgnr'
    }
  });

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

