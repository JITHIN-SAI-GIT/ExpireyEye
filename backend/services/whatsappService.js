const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER; // Must be a WhatsApp enabled number, e.g., 'whatsapp:+14155238886' if using sandbox

let client;

if (accountSid && authToken && fromPhone) {
    console.log("Twilio Service Initialized");
    client = twilio(accountSid, authToken);
} else {
    console.log("Twilio credentials missing. WhatsApp service will run in SIMULATION mode.");
}

const sendReceiptToWhatsApp = async (toName, toPhone, pdfBuffer, orderId) => {
    // Basic phone number cleaning to ensure format whatsapp:+91xxxxxxxxxx
    let formattedPhone = toPhone.replace(/\D/g, ''); // Remove non-generic chars
    if (formattedPhone.length === 10) {
        formattedPhone = '91' + formattedPhone; // Default to India if 10 digits
    }
    const to = `whatsapp:+${formattedPhone}`;
    const from = (fromPhone && fromPhone.startsWith('whatsapp:')) ? fromPhone : `whatsapp:${fromPhone}`;

    if (!client) {
        console.log(`[SIMULATION] Sending WhatsApp to ${to} (${toName}): "Thank you for shopping..." (PDF attached)`);
        return Promise.resolve({ sid: 'SIMULATED_SID', status: 'simulated' });
    }

    try {
        // Note: Sending media (PDF) directly via Twilio WhatsApp API might require the file to be hosted on a public URL.
        // For this local implementation without cloud storage, we might initially just send text or look for a workaround if public URL is strictly needed.
        // However, standard Twilio generic files usually need a public URL. 
        // IF we cannot upload to a public bucket, we will send a text confirmation.
        // FOR NOW: We will assume we just send text message confirming order, 
        // OR we'd need a way to serve this PDF publicly from our server (e.g., exposing a static route).
        
        // Let's rely on text message first to be safe, as we don't have S3 set up.
        // We can include a link if we host the PDF.
        
        const message = await client.messages.create({
            body: `Hello ${toName},\n\nThank you for shopping at Expiry Eye!\n\nYour order #${orderId} has been successfully placed.\n\nTotal: ₹${pdfBuffer ? '(PDF Generated)' : ''}\n\nVisit Again!`,
            from: from,
            to: to
        });
        
        console.log(`WhatsApp sent to ${to}: ${message.sid}`);
        return message;
    } catch (error) {
        console.error("Error sending WhatsApp:", error);
        // Don't crash the main flow if notification fails
        return null;
    }
};

module.exports = { sendReceiptToWhatsApp };
