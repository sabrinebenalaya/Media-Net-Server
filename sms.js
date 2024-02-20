const accountSid = 'AC4a8720faa47629672a7591e3b0103507';
const authToken = '4190da62eb890b41df340e43c21fdaf1';
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        body: 'helloeee',
        from: '+16812532331',
        to: '+21656145169'
    })
    .then(message => console.log(message.sid))
    .catch(error => console.error('Erreur lors de l\'envoi du SMS:', error));
