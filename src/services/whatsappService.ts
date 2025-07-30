import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode';
import { handleMessage } from '../handlers/messageHandler';

class WhatsAppService {
  private client: Client;
  private qrCodeData: string | null = null;

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
    });

    this.client.on('qr', (qr) => {
      qrcode.toDataURL(qr, (err, url) => {
        if (err) {
          console.error('Error generating QR code:', err);
          return;
        }
        this.qrCodeData = url;
      });
    });

    this.client.on('ready', () => {
      console.log('Client is ready!');
    });

    this.client.on('message', handleMessage);
  }

  public sendMessage(to: string, message: string) {
    this.client.sendMessage(to, message);
  }

  public getQrCodeData(): string | null {
    return this.qrCodeData;
  }

  public initialize() {
    this.client.initialize();
  }
}

export default new WhatsAppService();
