"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const whatsappService_1 = __importDefault(require("./services/whatsappService"));
require("./jobs/weeklyReport");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/qrcode', (req, res) => {
    const qrCodeData = whatsappService_1.default.getQrCodeData();
    if (qrCodeData) {
        res.send(`<img src="${qrCodeData}" alt="QR Code">`);
    }
    else {
        res.send('QR Code not available yet. Please wait a few moments and refresh.');
    }
});
app.get('/reset-qrcode', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield whatsappService_1.default.resetAndInitialize();
    res.send('WhatsApp client reset and re-initialized. Check /qrcode for new QR code.');
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
whatsappService_1.default.initialize();
