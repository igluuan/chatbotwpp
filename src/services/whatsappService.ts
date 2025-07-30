import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { handleMessage } from '../handlers/messageHandler';

class WhatsAppService {
  private client: Client;

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
    });

    this.client.on('qr', (qr) => {
      qrcode.generate(qr, { small: true });
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
}

export default new WhatsAppService();
