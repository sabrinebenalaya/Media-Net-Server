const cron = require("node-cron");
const notification = require("../Controller/notificationController"); 
const RDV = require("../Model/RDV");
const Patient = require("../Model/Patient");
const moment = require('moment');


async function statusRDV() {
    try {
    const heureActuelle = moment();
    const rdvs = await RDV.find({ status: 'avant48' });

    rdvs.forEach(async (rdv) => {
      const dateRDV = moment(rdv.date);
      const differenceHeures = dateRDV.diff(heureActuelle, 'hours');

      if (differenceHeures <= 1 && differenceHeures >= -1) {
        await RDV.findByIdAndUpdate(rdv._id, { status: 'fait' });
      } 
    });
       
    } catch (error) {
      console.error("Erreur lors de la planification de la tâche :", error);
    }
  }
  


// Planifier la tâche pour s'exécuter toutes les heures entre 8h et 20h de chaque jour
const scheduleTaskHeure = cron.schedule("0 8-20 * * *", async () => {
    try {
      statusRDV();
    } catch (error) {
      console.error("Erreur lors de la planification de la tâche :", error);
    }
  });
  
  module.exports = scheduleTaskHeure;
  