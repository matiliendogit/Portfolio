const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const port = 3000;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/send-message', (req, res) => {
    const { name, email, location, message } = req.body;

    const whatsappMessage = `Nombre: ${name}\nEmail: ${email}\nUbicación: ${location}\nMensaje: ${message}`;

    client.messages.create({
        body: whatsappMessage,
        from: 'whatsapp:+14155238886', 
        to: 'whatsapp:+5493512341032' 
    })
    .then(message => {
        console.log(message.sid);
        res.status(200).send('Mensaje enviado con éxito');
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('Error al enviar el mensaje');
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});