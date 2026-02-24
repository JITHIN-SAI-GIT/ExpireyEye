const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateReceiptPDF = (order) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // --- Header ---
            doc.font('Helvetica-Bold').fontSize(20).text('Expiry Eye', { align: 'center' });
            doc.font('Helvetica').fontSize(10).text('Smart Retail Solutions', { align: 'center' });
            doc.text('+91 999 888 7777', { align: 'center' });
            doc.moveDown();

            // --- Order Details ---
            doc.fontSize(10).text(`Date: ${new Date(order.createdAt).toLocaleString()}`, { align: 'left' });
            doc.text(`Order ID: ${order._id}`, { align: 'left' }); // Using _id as OrderID for now
            doc.moveDown();

            doc.text(`Customer: ${order.customerName}`, { align: 'left' });
            doc.text(`Phone: ${order.phoneNumber}`, { align: 'left' });
            doc.moveDown();

            // --- Table Header ---
            const tableTop = doc.y;
            const itemX = 50;
            const qtyX = 280;
            const priceX = 350;
            const totalX = 450;

            doc.font('Helvetica-Bold');
            doc.text('Item', itemX, tableTop);
            doc.text('Qty', qtyX, tableTop);
            doc.text('Price', priceX, tableTop);
            doc.text('Total', totalX, tableTop);
            doc.moveTo(itemX, tableTop + 15).lineTo(550, tableTop + 15).stroke();
            doc.font('Helvetica');

            // --- detailed Items ---
            let y = tableTop + 25;
            order.items.forEach(item => {
                const itemTotal = item.price * item.quantity;
                doc.text(item.name.substring(0, 40), itemX, y); // Truncate long names
                doc.text(item.quantity.toString(), qtyX, y);
                doc.text(item.price.toFixed(2), priceX, y);
                doc.text(itemTotal.toFixed(2), totalX, y);
                y += 20;
            });

            doc.moveTo(itemX, y).lineTo(550, y).stroke();
            y += 10;

            // --- Totals ---
            doc.font('Helvetica-Bold');
            doc.text(`Subtotal: ${order.totalAmount.toFixed(2)}`, totalX - 50, y, { align: 'right' });
            y += 15;
            doc.text(`Total: ${order.totalAmount.toFixed(2)}`, totalX - 50, y, { align: 'right' });
            
            y += 20;
             doc.font('Helvetica').fontSize(10);
            doc.text(`Payment Method: ${order.paymentMethod}`, 50, y);

            // --- Footer ---
            doc.moveDown(4);
            doc.font('Helvetica-Oblique').fontSize(10).text('Thank you for shopping with us!', { align: 'center' });
            doc.text('Please visit again.', { align: 'center' });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generateReceiptPDF };
