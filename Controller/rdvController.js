const RDV = require("../Model/RDV");
const moment = require('moment');
exports.createRDV = async (req, res) => {
  try {
    const existingRdv = await RDV.findOne({
      patient: req.body.patient,
      date: req.body.date,
    });

    if (existingRdv) {
      return res
        .status(400)
        .json("Un rendez-vous existe déjà pour ce patient à cette date.");
    } else {
   
      
      const rdv = new RDV(req.body);
      await rdv.save();
      return res.status(201).json(rdv);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour récupérer tous les RDVs
exports.getAllRDVs = async (req, res) => {
  try {
    const rdvs = await RDV.find({ patient: req.params.idPatient });

    res.status(200).json(rdvs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour récupérer list des RDVs
exports.getListRDVs = async (req, res) => {
  const { id, status } = req.params;
  const redvs = [];
  try {
    if (status === "prochain") {
      rdvs = await RDV.find({
        patient: id,
        $or: [
          { status: "attente" },
          { status: "avant72" },
          { status: "avant24" },
        ],
      });
    } else {

      rdvs = await RDV.find({
        patient: id,
        $or: [
          { status: "passer" },
          { status: "Termine" },
        ],
      });

   
    }

    res.status(200).json(rdvs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour récupérer un RDV par son ID
exports.getRDVById = async (req, res) => {

  try {
    const rdv = await RDV.findById(req.params.id);
    if (!rdv) {
      return res.status(404).json({ message: "RDV not found" });
    }

    res.status(200).json(rdv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour mettre à jour un RDV par son ID
exports.updateRDV = async (req, res) => {
  const updateFields = {};

  if (req.body.note !== "") {
    updateFields.note = req.body.note;
  }

  if (req.body.date !== "") {
    updateFields.date = req.body.date;
  }
  try {
    const rdv = await RDV.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
    });
    if (!rdv) {
      return res.status(404).json({ message: "RDV not found" });
    }

    const rdvs = await RDV.find({ patient: rdv.patient });

    return res.status(200).json(rdvs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour supprimer un RDV par son ID
exports.deleteRDV = async (req, res) => {
  try {
    const rdv = await RDV.findByIdAndDelete(req.params.id);
    if (!rdv) {
      return res.status(404).json({ message: "RDV not found" });
    }else{

      const rdvs = await RDV.find();
      res.status(200).json(rdvs);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
