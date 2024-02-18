const cron = require("node-cron");
const notification = require("./../Controller/notificationController"); // Importez votre fonction d'envoi de notification par e-mail
const RDV = require("../Model/RDV");
const Patient = require("../Model/Patient");
const Medicament = require("../Model/Medicament");
const Ordonance = require('../Model/Ordonnance')
const moment = require('moment');
// stock des medicaments
async function notificationStockMedicament() {
  try {
    // Récupérer tous les médicaments
    const medicaments = await Medicament.find();

    // Parcourir tous les médicaments
    medicaments.forEach(async (medicament) => {
      const { stock, matin, midi, apres_midi, soir } = medicament;

      // Calculer la consommation hebdomadaire
      const consommationHebdomadaire = (matin + midi + apres_midi + soir) * 7;

      // Mettre à jour le stock en déduisant la consommation hebdomadaire
      const nouveauStock = stock - consommationHebdomadaire;
      medicament.stock = nouveauStock;

      // Sauvegarder le médicament avec le nouveau stock
     // await medicament.save();

      // Vérifier si le stock est critique et envoyer une notification si nécessaire
      if (nouveauStock <= 30) {
        const ordonance = await Ordonance.findById(medicament.ordonnance);
       if (ordonance){  
        const patient = await Patient.findById(ordonance.patient)
        const message = `Le stock du médicament ${medicament.nom} est faible. Stock actuel : ${nouveauStock}.`;
        await notification.sendEmail(patient.mailPatient, message, 'Notification de stock faible');
      }
       
      }
    });
  } catch (error) {
    console.error("Erreur lors de la planification de la tâche :", error);
  }
}


// modifier le status du rdv chaque semaine (90j)
async function statusRDV() {
  try {
    // Obtenez la date actuelle
    const dateActuelle = moment();

    // Obtenez tous les rendez-vous terminés
    const rdvsTermines = await RDV.find({ status: 'terminer' }); // Modifier selon votre modèle de données

    // Parcourez tous les rendez-vous terminés
    rdvsTermines.forEach(async (rdv) => {
      // Calculez la différence en jours entre la date actuelle et la date du rendez-vous
      const differenceJours = dateActuelle.diff(moment(rdv.date), 'days');

      // Vérifiez si la différence est supérieure à 90 jours
      if (differenceJours > 90) {
        // Mettez à jour le statut du rendez-vous à 'passer'
        rdv.status = 'passer';
        await rdv.save();
      }
    });
  } catch (error) {
    console.error("Erreur lors de la planification de la tâche :", error);
  }
}

// Planifier la tâche pour s'exécuter tous les jours à 8h du matin
const scheduleHebdo = cron.schedule("0 8-20 * * *", async () => {
  try {
    notificationStockMedicament();
    statusRDV()
  } catch (error) {
    console.error("Erreur lors de la planification de la tâche :", error);
  }
});
module.exports = scheduleHebdo;
