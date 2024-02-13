const cron = require("node-cron");
const notification = require("../Controller/notificationController"); // Importez votre fonction d'envoi de notification par e-mail
const RDV = require("../Model/RDV");
const Patient = require("../Model/Patient");
const moment = require('moment');

//formatDate
function formatDate(dateObj){

// Extraire la date
const day = dateObj.getDate();
const month = dateObj.getMonth() + 1; // Les mois commencent à partir de zéro, donc ajoutez 1
const year = dateObj.getFullYear();

// Extraire l'heure
const hours = dateObj.getHours();
const minutes = dateObj.getMinutes();

// Formater la date au format "jj/mm/aaaa"
const formattedDate = `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;

// Formater l'heure au format "hh:mm"
const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;



return   {formattedDate, formattedTime}
}

//gerer les notfication des rdv
async function notificationRDV() {

  const rdvs = await RDV.find({ status: 'avant72' });

  // Parcourir les rendez-vous et envoyer les notifications appropriées
  await Promise.all(rdvs.map(async (rdv) => {
    const {formattedDate, formattedTime} = formatDate(rdv.date)
    const timeDifference = rdv.date - Date.now();
    const hoursDifference = Math.ceil(timeDifference / (1000 * 60 * 60));
    let h = "0";

    if (hoursDifference <= 72 && hoursDifference > 24) {
      // Envoyer une notification 72 heures avant le rendez-vous
      h = "72";
    } else if (hoursDifference <= 24 && hoursDifference > 0) {
      h = "24";
    }
    const patient = await Patient.findById(rdv.patient);
    const message = `Cher(e),

Nous vous écrivons pour vous rappeler de votre rendez-vous prévu dans moins de ${h} heures. Voici les détails du rendez-vous :
  
Date : ${formattedDate}
Heure : ${formattedTime}
Chez : ${rdv.title}
Nous vous prions d'arriver à l'heure pour votre rendez-vous.
En cas d'empêchement ou si vous avez besoin de reprogrammer votre rendez-vous, veuillez nous contacter dès que possible.
  
Nous restons à votre disposition pour toute question supplémentaire.

Cordialement,
L'équipe de prise de rendez-vous`;

    await notification.sendEmail(
      patient.mailPatient,
      message,
      `Rappel de rendez-vous dans moins de ${h} heures`
    );
  }));
}


//gerer les notification des medicament
async function notificationMedicament() {
  try {
    // Récupérer tous les médicaments
    const medicaments = await Medicament.find();

    // Parcourir tous les médicaments
    medicaments.forEach(async (medicament) => {
      const { stock, matin, midi, apres_midi, soir } = medicament;

      // Calculer le nombre de jours restants avant la fin du stock
      const joursRestants = (stock * 30) / (matin + midi + apres_midi + soir);

      // Vérifier si le nombre de jours restants correspond à 21 jours ou 15 jours
      if (joursRestants === 21 || joursRestants === 15) {
        // Envoyer une notification par e-mail
        const ordonance = await Ordonance.findById(medicament.ordonnance);
        if (ordonance){  
         const patient = await Patient.findById(ordonance.patient)
         const message = `Stock du médicament ${medicament.nom} sera épuisé dans ${joursRestants} jours.`;
         await notification.sendEmail(patient.mailPatient, message, 'Notification de stock');
       }
       
      }
    });
  } catch (error) {
    console.error("Erreur lors de la planification de la tâche :", error);
  }
}

// MAJ status RDV
async function statusRDV() {
  try {
  
      // Obtenez l'heure actuelle
  const heureActuelle = moment();

  // Obtenez tous les rendez-vous
  const rdvs = await RDV.find({ status: 'attente' } );

  // Parcourez tous les rendez-vous
  rdvs.forEach(async (rdv) => {
    // Convertissez la date du rendez-vous en objet moment
    const dateRDV = moment(rdv.date);

    // Calculez la différence en heures entre l'heure actuelle et l'heure du rendez-vous
    const differenceJours = dateActuelle.diff(moment(rdv.date), 'days');

   if (differenceJours > 2) {
      // Rendez-vous dans les 48 heures, mettez à jour le statut à 'avant48'
      await RDV.findByIdAndUpdate(rdv._id, { status: 'avant48' });
    } else if (differenceJours > 3) {
      // Rendez-vous dans les 72 heures, mettez à jour le statut à 'avant72'
      await RDV.findByIdAndUpdate(rdv._id, { status: 'avant72' });
    }
  });
     
  } catch (error) {
    console.error("Erreur lors de la planification de la tâche :", error);
  }
}


// Planifier la tâche pour s'exécuter tous les jours à 8h du matin
const schedulejournaliere = cron.schedule("0 20 * * *", async () => {
  try {
    notificationRDV()
notificationMedicament()
statusRDV()
  } catch (error) {
    console.error("Erreur lors de la planification de la tâche :", error);
  }
});
module.exports = schedulejournaliere;
