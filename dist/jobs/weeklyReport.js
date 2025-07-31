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
const node_cron_1 = __importDefault(require("node-cron"));
const firebaseService_1 = __importDefault(require("../services/firebaseService"));
const whatsappService_1 = __importDefault(require("../services/whatsappService"));
// Schedule a job to run every Sunday at 9:00 AM
node_cron_1.default.schedule('0 9 * * 0', () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield firebaseService_1.default.getUsers();
    for (const user of users) {
        const report = yield firebaseService_1.default.getReport(user.id);
        const message = `Relatório semanal:\nReceitas: R$ ${report.revenues.toFixed(2)}\nDespesas: R$ ${report.expenses.toFixed(2)}\nSaldo: R$ ${report.balance.toFixed(2)}`;
        whatsappService_1.default.sendMessage(user.phone, message);
    }
}));
