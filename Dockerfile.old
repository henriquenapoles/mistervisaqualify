# Dockerfile para VisaQualify - Mister Visa Immigration Wizard
FROM node:20-alpine

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat curl

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar TODAS as dependências (incluindo devDependencies para o build)
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Remover devDependencies após o build para reduzir tamanho
RUN npm prune --production

# Expor porta
EXPOSE 5000

# Variável de ambiente padrão
ENV NODE_ENV=production
ENV PORT=5000

# Comando de inicialização
CMD ["npm", "start"]
