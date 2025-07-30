import express from 'express';
import whatsAppService from './services/whatsappService';
import './jobs/weeklyReport';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/qrcode', (req, res) => {
  const qrCodeData = whatsAppService.getQrCodeData();
  if (qrCodeData) {
    res.send(`<img src="${qrCodeData}" alt="QR Code">`);
  } else {
    res.send('QR Code not available yet. Please wait a few moments and refresh.');
  }
});

app.get('/reset-qrcode', async (req, res) => {
  await whatsAppService.resetAndInitialize();
  res.send('WhatsApp client reset and re-initialized. Check /qrcode for new QR code.');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

whatsAppService.initialize();