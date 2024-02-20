const cron = require('node-cron');
const notification = require('../Controller/notificationController'); 
const RDV = require('../Model/RDV');
const Patient = require('../Model/Patient');
const moment = require('moment');
const client = require('twilio')(process.env.ACCOUNTSID, process.env.AUTHTOKENN);
//changer statut et envoyer mail quant le rdv est fait pour informer le patient qu il peut MAJ son ordonnace
async function statusRDVFait() {
  try {
    const heureActuelle = moment();
    const rdvs = await RDV.find({ status: 'avant24' });

    for (const rdv of rdvs) {
      const dateRDV = moment(rdv.date);

      const differenceHeures = dateRDV.diff(heureActuelle, 'hours');
     
      if (differenceHeures <= 1 && differenceHeures >= -1) {
      
        await RDV.findByIdAndUpdate(rdv._id, { status: 'fait' });

        const formattedDate = moment(dateRDV).format("YYYY-MM-DD");
    
        const patient = await Patient.findById(rdv.patient);
        const message = `Cher(e) ${patient.prenom},

        Nous sommes heureux de vous informer que votre rendez-vous avec ${rdv.title} a été effectué avec succès le ${formattedDate}.
        
        Nous espérons que votre consultation a été satisfaisante et que vous avez reçu le traitement approprié. Si vous avez besoin de toute assistance supplémentaire ou si vous souhaitez poser des questions sur votre traitement, n'hésitez pas à nous contacter.
        
        De plus, nous tenons à vous rappeler que vous avez la possibilité de mettre à jour votre ordonnance depuis votre espace patient sur notre plateforme en ligne. Cela vous permet de communiquer facilement avec votre médecin et de recevoir les modifications nécessaires à votre traitement.
        
        Connectez-vous à votre espace patient dès maintenant pour mettre à jour votre ordonnance .
        
        Nous vous remercions pour votre confiance en nos services et restons à votre disposition pour toute demande supplémentaire.
        
       
        Cordialement,
        L'équipe de prise de rendez-vous`;

        await notification.sendEmail(
          patient.mailPatient,
          message,
         " Rendez-vous réussi - Mettez à jour votre ordonnance"
        );

        const patientPhoneNumber = "+216" + patient.numeroTelephone;
        const formattedHeure = moment(dateRDV).format('HH:mm');
const SMS = `Cher ${patient.prenom},

Nous vous rappelons que vous avez un rendez-vous médical important demain à ${formattedHeure} chez ${rdv.title}.

Date du rendez-vous : ${formattedDate}
Heure du rendez-vous :${formattedHeure}

Si vous avez des questions ou si vous devez annuler ou reporter votre rendez-vous, veuillez contacter notre équipe dès que possible au [Numéro de téléphone].

Nous avons hâte de vous voir demain et de vous offrir les meilleurs soins possibles.

Cordialement,
L'équipe médicale`
        client.messages
          .create({
            body: SMS,
            from: '+16812532331',
            to: patientPhoneNumber
          })
          .then(message => console.log(message.sid))
          .catch(error => console.error('Erreur lors de l\'envoi du SMS:', error));
      }
    }
  } catch (error) {
    console.error("Erreur lors de la planification de la tâche :", error);
  }
}
  


// Planifier la tâche pour s'exécuter toutes les heures entre 8h et 20h de chaque jour
const scheduleTaskHeure = cron.schedule("55 8-20 * * *", async () => {
    try {
      statusRDVFait();
    } catch (error) {
      console.error("Erreur lors de la planification de la tâche :", error);
    }
  });
  
  module.exports = scheduleTaskHeure;
  