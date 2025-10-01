# Dockerfile para VisaQualify - Mister Visa Immigration Wizard
FROM node:20-alpine AS base

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Expor porta
EXPOSE 5000

# Configurar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Mudar propriedade dos arquivos
RUN chown -R nextjs:nodejs /app
USER nextjs

# Comando de inicialização
CMD ["npm", "start"]
