# Use a imagem oficial do Node.js como base
FROM node:20-slim

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie os arquivos package.json e package-lock.json para instalar as dependências
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install --production

# Copie o restante do código-fonte para o diretório de trabalho
COPY . .

# Compile o código TypeScript
RUN npm run build

# Exponha a porta em que a aplicação irá rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
