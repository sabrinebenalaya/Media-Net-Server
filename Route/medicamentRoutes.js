const express = require('express');
const router = express.Router();
const medicamentController = require('../Controller/medicamentController');

// Définir les routes CRUD pour le modèle Medicament
router.post('/medicaments', medicamentController.createMedicament);
router.get('/medicaments', medicamentController.getAllMedicaments);
router.get('/medicaments/:id', medicamentController.getMedicamentById);
router.put('/medicaments/:id', medicamentController.updateMedicament);
router.delete('/medicaments/:id', medicamentController.deleteMedicament);

module.exports = router;
