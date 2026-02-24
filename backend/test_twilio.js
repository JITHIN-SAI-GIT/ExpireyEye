
try {
  const { sendReceiptToWhatsApp } = require('./services/whatsappService');
  console.log("Service loaded successfully");
} catch (error) {
  console.error("Error loading service:", error);
}
