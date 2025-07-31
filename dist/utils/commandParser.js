"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCommand = void 0;
const zod_1 = require("zod");
const gastoSchema = zod_1.z.object({
    command: zod_1.z.literal('/gasto'),
    value: zod_1.z.number(),
    category: zod_1.z.string(),
    description: zod_1.z.string().optional(),
});
const receitaSchema = zod_1.z.object({
    command: zod_1.z.literal('/receita'),
    value: zod_1.z.number(),
    source: zod_1.z.string(),
    description: zod_1.z.string().optional(),
});
const saldoSchema = zod_1.z.object({
    command: zod_1.z.literal('/saldo'),
});
const relatorioSchema = zod_1.z.object({
    command: zod_1.z.literal('/relatorio'),
    monthYear: zod_1.z.string().optional(),
});
const categoriasSchema = zod_1.z.object({
    command: zod_1.z.literal('/categorias'),
});
const limiteSchema = zod_1.z.object({
    command: zod_1.z.literal('/limite'),
    category: zod_1.z.string(),
    value: zod_1.z.number(),
});
const ajudaSchema = zod_1.z.object({
    command: zod_1.z.literal('/ajuda'),
});
const gastosSchema = zod_1.z.object({
    command: zod_1.z.literal('/gastos'),
});
const commandSchema = zod_1.z.union([
    gastoSchema,
    receitaSchema,
    saldoSchema,
    relatorioSchema,
    categoriasSchema,
    limiteSchema,
    gastosSchema,
    ajudaSchema,
]);
const parseCommand = (message) => {
    const [command, ...args] = message.split(' ');
    switch (command) {
        case '/gasto':
            return gastoSchema.safeParse({
                command,
                value: parseFloat(args[0]),
                category: args[1],
                description: args.slice(2).join(' '),
            });
        case '/receita':
            return receitaSchema.safeParse({
                command,
                value: parseFloat(args[0]),
                source: args[1],
                description: args.slice(2).join(' '),
            });
        case '/saldo':
            return saldoSchema.safeParse({ command });
        case '/relatorio':
            return relatorioSchema.safeParse({ command, monthYear: args[0] });
        case '/categorias':
            return categoriasSchema.safeParse({ command });
        case '/limite':
            return limiteSchema.safeParse({
                command,
                category: args[0],
                value: parseFloat(args[1]),
            });
        case '/ajuda':
            return ajudaSchema.safeParse({ command });
        case '/gastos':
            return gastosSchema.safeParse({ command });
        default:
            return null;
    }
};
exports.parseCommand = parseCommand;
