const accountSid = '';
const authToken = '';
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        body: 'helloeee',
        from: '+',
        to: '+'
    })
    .then(message => console.log(message.sid))
    .catch(error => console.error('Erreur lors de l\'envoi du SMS:', error));
