# Use a imagem oficial do Node.js como base
FROM node:20-slim

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Instale as dependências necessárias para o Puppeteer
RUN apt-get update && apt-get install -y     gconf-service     libasound2     libatk1.0-0     libcairo2     libcups2     libfontconfig1     libgdk-pixbuf2.0-0     libgtk-3-0     libjpeg-turbo8     libnss3     libxss1     libappindicator1     libindicator7     libglib2.0-0     libxcomposite1     libxdamage1     libxfixes3     libxrandr2     libxi6     libpangocairo-1.0-0     libudev1     --no-install-recommends && rm -rf /var/lib/apt/lists/*

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
