const express = require('express');
const router = express.Router();
const patientController = require('../Controller/patientController');
const path = require('path');


const multer  = require('multer')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assets/patients/')
  },
  filename: function (req, file, cb) {
    const newFileName = Date.now() + '-' + file.originalname
    cb(null, newFileName)
  }
})
const upload = multer({ storage: storage })


// Définir les routes CRUD pour le modèle Patient

router.post('/patients', upload.single("image"), patientController.createPatient);
router.get('/patients', patientController.getAllPatients);
router.get('/patients/:id', patientController.getPatientById);
router.put('/patients/:id',  upload.single("image"),patientController.updatePatient);
router.delete('/patients/:id', patientController.deletePatient);
router.get('/assets/patients/:filename', (req, res) => {
   
    const { filename } = req.params;
    const filePath = path.join(__dirname, '..','assets','patients', filename);
    
    res.sendFile(filePath)


  });
module.exports = router;
