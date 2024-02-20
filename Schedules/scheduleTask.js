const cron = require("node-cron");
const notification = require("../Controller/notificationController"); 
const RDV = require("../Model/RDV");
const Patient = require("../Model/Patient");
const moment = require("moment");

// MAJ status RDV (avant 24 ou avant 72 et envoi des mail durant les 3 derniers jours)
async function statusRDV_avant24_72() {
  try {
    const dateActuelle = moment();
    const rdvs = await RDV.find({
      $or: [{ status: "attente" }, { status: "avant72" }],
    });
    for (const rdv of rdvs) {
      const dateRDV = moment(rdv.date);
      const differenceJours = moment(dateRDV).diff(dateActuelle, "days")+1; 
     let  update = false
      if (differenceJours == 1 && rdv.status != "avant24") {
        await RDV.findByIdAndUpdate(rdv._id, { status: "avant24" });
        update = true
      } else if ((differenceJours == 3 || differenceJours == 2) && rdv.status != "avant72") {
        await RDV.findByIdAndUpdate(rdv._id, { status: "avant72" });
        update = true
      }

      if (update){

        const formattedDate = moment(dateRDV).format("YYYY-MM-DD");
        const formattedTime = moment(dateRDV).format("HH:mm");
        const message = `Cher(e),

        Nous vous écrivons pour vous rappeler de votre rendez-vous prévu dans ${differenceJours} jours. Voici les détails du rendez-vous :
          
        Date : ${formattedDate}
        Heure : ${formattedTime}
        Chez : ${rdv.title}
        Nous vous prions d'arriver à l'heure pour votre rendez-vous.
        En cas d'empêchement ou si vous avez besoin de reprogrammer votre rendez-vous, veuillez nous contacter dès que possible.
          
        Nous restons à votre disposition pour toute question supplémentaire.
        
        Cordialement,
        L'équipe de prise de rendez-vous`;

        const patient = await Patient.findById(rdv.patient);
        await notification.sendEmail(
          patient.mailPatient,
          message,
          `Rappel de rendez-vous dans ${differenceJours} jours`
        );
      
      }
   
    }
    
  } catch (error) {
    console.error("Erreur lors de la planification de la tâche :", error);
  }
}
// Planifier la tâche pour s'exécuter tous les jours à 8h du matin
const schedulejournaliere = cron.schedule("51 7 * * *", async () => {
  try {
    statusRDV_avant24_72();
  } catch (error) {
    console.error("Erreur lors de la planification de la tâche :", error);
  }
});
module.exports = schedulejournaliere;
