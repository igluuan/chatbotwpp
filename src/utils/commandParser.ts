import { z } from 'zod';

const gastoSchema = z.object({
  command: z.literal('/gasto'),
  value: z.number(),
  category: z.string(),
  description: z.string().optional(),
});

const receitaSchema = z.object({
  command: z.literal('/receita'),
  value: z.number(),
  source: z.string(),
  description: z.string().optional(),
});

const saldoSchema = z.object({
  command: z.literal('/saldo'),
});

const relatorioSchema = z.object({
  command: z.literal('/relatorio'),
  monthYear: z.string().optional(),
});

const categoriasSchema = z.object({
  command: z.literal('/categorias'),
});

const limiteSchema = z.object({
  command: z.literal('/limite'),
  category: z.string(),
  value: z.number(),
});

const ajudaSchema = z.object({
  command: z.literal('/ajuda'),
});

const gastosSchema = z.object({
  command: z.literal('/gastos'),
});

const commandSchema = z.union([
  gastoSchema,
  receitaSchema,
  saldoSchema,
  relatorioSchema,
  categoriasSchema,
  limiteSchema,
  gastosSchema,
  ajudaSchema,
]);

export const parseCommand = (message: string) => {
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
