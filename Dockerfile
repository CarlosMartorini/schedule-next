# FROM node:lts

# WORKDIR /app

# COPY package*.json ./
# COPY next.config.mjs ./
# COPY components.json ./
# COPY postcss.config.mjs ./
# COPY tailwind.config.ts ./
# COPY tsconfig.json ./
# COPY src ./src

# RUN npm install

# RUN npm run build

# EXPOSE 8080

# CMD ["npm", "run", "start"]

# Use a imagem oficial do Node.js
FROM node:lts AS build

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos necessários para instalar dependências
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.mjs ./
COPY tailwind.config.ts ./
COPY postcss.config.mjs ./
COPY components.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código
COPY ./src ./src

# Construa o aplicativo
RUN npm run build

# Imagem final para produção
FROM node:lts AS production

# Defina o diretório de trabalho
WORKDIR /app

# Copie as dependências da etapa anterior
COPY package*.json ./
COPY --from=build /app/.next ./.next

# Instale apenas as dependências de produção
RUN npm install --production

# Exponha a porta padrão
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["npm", "start", "--", "-p", "8080"]
