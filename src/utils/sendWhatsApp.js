const twilio = require("twilio");

const client = twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH
);

const sendWhatsApp = async (to, message) => {
    await client.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: `whatsapp:${to}`,
        body: message
    });
};

module.exports = sendWhatsApp;
