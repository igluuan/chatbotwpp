import { Client, LocalAuth } from 'whatsapp-web.js';
import * as fs from 'fs';
import * as path from 'path';

const SESSION_PATH = path.join(process.cwd(), '.wwebjs_auth', 'session');
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

  public async resetAndInitialize() {
    if (this.client) {
      try {
        await this.client.destroy();
        console.log('WhatsApp client destroyed.');
      } catch (error) {
        console.error('Error destroying WhatsApp client:', error);
      }
    }

    // Remove session directory
    if (fs.existsSync(SESSION_PATH)) {
      try {
        fs.rmSync(SESSION_PATH, { recursive: true, force: true });
        console.log('WhatsApp session directory removed.');
      } catch (error) {
        console.error('Error removing session directory:', error);
      }
    }

    this.qrCodeData = null;
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
}

export default new WhatsAppService();
