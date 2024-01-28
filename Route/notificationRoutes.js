const express = require('express');
const router = express.Router();
const notificationController = require('../Controller/notificationController');

// Définir les routes CRUD pour le modèle Notification
router.post('/notifications', notificationController.createNotification);
router.get('/notifications', notificationController.getAllNotifications);
router.get('/notifications/:id', notificationController.getNotificationById);
router.put('/notifications/:id', notificationController.updateNotification);
router.delete('/notifications/:id', notificationController.deleteNotification);

module.exports = router;
