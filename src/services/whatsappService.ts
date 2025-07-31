import { Client, LocalAuth } from 'whatsapp-web.js';
import * as fs from 'fs';
import * as path from 'path';

import * as qrcode from 'qrcode';
import { handleMessage } from '../handlers/messageHandler';

const BASE_SESSION_DIR = process.env.WHATSAPP_SESSION_DIR || path.join(process.cwd(), '.wwebjs_auth');
const SESSION_PATH = path.join(BASE_SESSION_DIR, 'session');

class WhatsAppService {
  private client: Client;
  private qrCodeData: string | null = null;

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: 'whatsapp-bot',
        dataPath: BASE_SESSION_DIR,
      }),
      puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
    });

    this.client.on('qr', (qr) => {
      qrcode.toDataURL(qr, (err: any, url: string | null) => {
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

  public initialize() {
    this.client.initialize();
  }

  public getQrCodeData(): string | null {
    return this.qrCodeData;
  }

  public async resetAndInitialize() {
    // Only attempt to destroy if the client and its internal browser instance exist
    if (this.client && (this.client as any)._puppeteer && (this.client as any)._puppeteer.browser) {
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
      authStrategy: new LocalAuth({
        clientId: 'whatsapp-bot',
        dataPath: BASE_SESSION_DIR,
      }),
      puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
    });

    this.client.on('qr', (qr) => {
      qrcode.toDataURL(qr, (err: any, url: string | null) => {
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
