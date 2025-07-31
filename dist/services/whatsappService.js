"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const whatsapp_web_js_1 = require("whatsapp-web.js");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const BASE_SESSION_DIR = process.env.WHATSAPP_SESSION_DIR || path.join(process.cwd(), '.wwebjs_auth');
const SESSION_PATH = path.join(BASE_SESSION_DIR, 'session');
const qrcode = __importStar(require("qrcode"));
const messageHandler_1 = require("../handlers/messageHandler");
class WhatsAppService {
    constructor() {
        this.qrCodeData = null;
        this.client = new whatsapp_web_js_1.Client({
            authStrategy: new whatsapp_web_js_1.LocalAuth({
                clientId: 'whatsapp-bot',
                dataPath: BASE_SESSION_DIR,
            }),
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
        this.client.on('message', messageHandler_1.handleMessage);
    }
    sendMessage(to, message) {
        this.client.sendMessage(to, message);
    }
    initialize() {
        this.client.initialize();
    }
    getQrCodeData() {
        return this.qrCodeData;
    }
    resetAndInitialize() {
        return __awaiter(this, void 0, void 0, function* () {
            // Only attempt to destroy if the client and its internal browser instance exist
            if (this.client && this.client._puppeteer && this.client._puppeteer.browser) {
                try {
                    yield this.client.destroy();
                    console.log('WhatsApp client destroyed.');
                }
                catch (error) {
                    console.error('Error destroying WhatsApp client:', error);
                }
            }
            // Remove session directory
            if (fs.existsSync(SESSION_PATH)) {
                try {
                    fs.rmSync(SESSION_PATH, { recursive: true, force: true });
                    console.log('WhatsApp session directory removed.');
                }
                catch (error) {
                    console.error('Error removing session directory:', error);
                }
            }
            this.qrCodeData = null;
            this.client = new whatsapp_web_js_1.Client({
                authStrategy: new whatsapp_web_js_1.LocalAuth({
                    clientId: 'whatsapp-bot',
                    dataPath: BASE_SESSION_DIR,
                }),
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
            this.client.on('message', messageHandler_1.handleMessage);
        });
    }
}
exports.default = new WhatsAppService();
