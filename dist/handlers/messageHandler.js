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
exports.handleMessage = void 0;
const commandParser_1 = require("../utils/commandParser");
const firebaseService_1 = __importDefault(require("../services/firebaseService"));
const handleMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = yield message.getChat();
    if (!chat.isGroup || chat.name !== 'custos') {
        return;
    }
    const parsedCommand = (0, commandParser_1.parseCommand)(message.body);
    if (!parsedCommand) {
        // Handle invalid command
        message.reply('Comando inválido. Digite /ajuda para ver a lista de comandos.');
        return;
    }
    if (!parsedCommand.success) {
        // Handle invalid command format
        message.reply('Formato do comando inválido. Digite /ajuda para ver a lista de comandos.');
        return;
    }
    switch (parsedCommand.data.command) {
        case '/gasto':
            try {
                yield firebaseService_1.default.addTransaction({
                    type: 'despesa',
                    userId: message.from,
                    value: parsedCommand.data.value,
                    category: parsedCommand.data.category,
                    description: parsedCommand.data.description,
                });
                message.reply(`✅ *Gasto* de *R$ ${parsedCommand.data.value.toFixed(2)}* na categoria *${parsedCommand.data.category}* registrado com sucesso!`);
            }
            catch (error) {
                console.error("Erro ao registrar gasto:", error);
                message.reply('❌ Ocorreu um erro ao registrar seu gasto. Tente novamente.');
            }
            break;
        case '/receita':
            try {
                yield firebaseService_1.default.addTransaction({
                    type: 'receita',
                    userId: message.from,
                    value: parsedCommand.data.value,
                    source: parsedCommand.data.source,
                    description: parsedCommand.data.description,
                });
                message.reply(`✅ *Receita* de *R$ ${parsedCommand.data.value.toFixed(2)}* da fonte *${parsedCommand.data.source}* registrada com sucesso!`);
            }
            catch (error) {
                console.error("Erro ao registrar receita:", error);
                message.reply('❌ Ocorreu um erro ao registrar sua receita. Tente novamente.');
            }
            break;
        case '/saldo':
            try {
                const balance = yield firebaseService_1.default.getBalance(message.from);
                message.reply(`💰 Seu saldo atual é de *R$ ${balance.toFixed(2)}*.`);
            }
            catch (error) {
                console.error("Erro ao buscar saldo:", error);
                message.reply('❌ Ocorreu um erro ao buscar seu saldo. Tente novamente.');
            }
            break;
        case '/relatorio':
            try {
                const report = yield firebaseService_1.default.getReport(message.from, parsedCommand.data.monthYear);
                message.reply(`📊 *Relatório do Mês (${report.monthYear})* 📊\n\n` +
                    `🟢 *Receitas:* R$ ${report.revenues.toFixed(2)}\n` +
                    `🔴 *Despesas:* R$ ${report.expenses.toFixed(2)}\n` +
                    `---------------------\n` +
                    `⚖️ *Saldo Final:* R$ ${report.balance.toFixed(2)}`);
            }
            catch (error) {
                console.error("Erro ao gerar relatório:", error);
                message.reply('❌ Ocorreu um erro ao gerar seu relatório. Tente novamente.');
            }
            break;
        case '/categorias':
            try {
                const categories = yield firebaseService_1.default.getCategories(message.from);
                message.reply(`Categorias de gastos:\n${categories.join('\n')}`);
            }
            catch (error) {
                console.error("Erro ao buscar categorias:", error);
                message.reply('❌ Ocorreu um erro ao buscar suas categorias. Tente novamente.');
            }
            break;
        case '/limite':
            try {
                yield firebaseService_1.default.setBudget({
                    userId: message.from,
                    category: parsedCommand.data.category,
                    limit: parsedCommand.data.value,
                });
                message.reply(`✅ *Limite* para a categoria *${parsedCommand.data.category}* definido para *R$ ${parsedCommand.data.value.toFixed(2)}*`);
            }
            catch (error) {
                console.error("Erro ao definir limite:", error);
                message.reply('❌ Ocorreu um erro ao definir seu limite. Tente novamente.');
            }
            break;
        case '/ajuda':
            message.reply('*Comandos disponíveis:*\n\n' +
                '*/gasto* [valor] [categoria] [descrição] - Registra um novo gasto\n' +
                '*/receita* [valor] [fonte] [descrição] - Registra uma nova receita\n' +
                '*/saldo* - Exibe o saldo atual\n' +
                '*/relatorio* [mês/ano] - Exibe o relatório do mês\n' +
                '*/categorias* - Exibe as categorias de gastos\n' +
                '*/limite* [categoria] [valor] - Define um limite de gasto para uma categoria\n' +
                '*/ajuda* - Exibe esta mensagem de ajuda');
            break;
        case '/gastos':
            try {
                const expenses = yield firebaseService_1.default.getExpenses(message.from);
                if (expenses.length === 0) {
                    message.reply('Você ainda não registrou nenhum gasto.');
                    return;
                }
                const expensesList = expenses.map(exp => {
                    const date = exp.date ? exp.date.toLocaleDateString('pt-BR') : 'N/A';
                    return `*${date}* - R$ ${exp.value.toFixed(2)} (${exp.category}) - ${exp.description || 'Sem descrição'}`;
                }).join('\n');
                message.reply(`📊 *Seus Últimos Gastos:*
${expensesList}`);
            }
            catch (error) {
                console.error("Erro ao buscar gastos:", error);
                message.reply('❌ Ocorreu um erro ao buscar seus gastos. Tente novamente.');
            }
            break;
    }
});
exports.handleMessage = handleMessage;
