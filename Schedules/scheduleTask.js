const cron = require("node-cron");
const notification = require("../Controller/notificationController"); // Importez votre fonction d'envoi de notification par e-mail
const RDV = require("../Model/RDV");
const Patient = require("../Model/Patient");


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
  // Récupérer tous les rendez-vous programmés pour les prochaines 72 heures
  const rdvs = await RDV.find({
    date: {
      $gte: new Date(),
      $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  });

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



// Planifier la tâche pour s'exécuter tous les jours à 8h du matin
const schedulejournaliere = cron.schedule("0 8 * * *", async () => {
  try {
    notificationRDV()
notificationMedicament()
  } catch (error) {
    console.error("Erreur lors de la planification de la tâche :", error);
  }
});
module.exports = schedulejournaliere;
