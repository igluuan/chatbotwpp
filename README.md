# Bot WhatsApp para Gestão Financeira Familiar

## Descrição

Este é um bot para WhatsApp que permite o controle de gastos e receitas familiares através de comandos simples, com relatórios automáticos e sincronização em tempo real usando Firebase.

## Comandos

- `/gasto [valor] [categoria] [descrição]` - Registra um novo gasto
- `/receita [valor] [fonte] [descrição]` - Registra uma nova receita
- `/saldo` - Exibe o saldo atual
- `/relatorio [mês/ano]` - Exibe o relatório do mês
- `/categorias` - Exibe as categorias de gastos
- `/limite [categoria] [valor]` - Define um limite de gasto para uma categoria
- `/ajuda` - Exibe a lista de comandos

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na raiz do projeto e adicione as credenciais de serviço do Firebase:
   ```
   FIREBASE_SERVICE_ACCOUNT=...
   ```

4. Inicie o bot:
   ```bash
   npm start
   ```

5. Abra o WhatsApp no seu celular e escaneie o QR code que aparecerá no terminal.

## Licença

Este projeto está licenciado sob a Licença MIT.