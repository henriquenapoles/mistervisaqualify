# Mister Visa - Immigration Qualification Wizard

Um formulário gamificado de qualificação para imigração aos EUA, desenvolvido para a consultoria Mister Visa.

## 🚀 Funcionalidades

- **Formulário Interativo**: 14 perguntas estruturadas cobrindo perfil pessoal, educação, experiência e objetivos
- **Sistema de Pontuação**: Cálculo em tempo real da elegibilidade com recomendações de visto
- **Auto-Envio**: Submissão automática via webhook a cada etapa do formulário
- **Design Responsivo**: Interface profissional com branding da Mister Visa
- **Validação em Tempo Real**: Validação de campos na saída (onBlur) com feedback imediato
- **Navegação Inteligente**: Progresso visual e navegação entre etapas

## 🎯 Objetivo

Plataforma de qualificação de leads para consultoria de imigração, coletando dados detalhados dos interessados e fornecendo análises personalizadas de elegibilidade para diferentes tipos de visto americano.

## 🏗️ Arquitetura

### Frontend
- **React + TypeScript**: Interface moderna e type-safe
- **Tailwind CSS**: Estilização responsiva e profissional
- **Wouter**: Roteamento leve do lado cliente
- **TanStack Query**: Gerenciamento de estado do servidor
- **Framer Motion**: Animações e transições suaves

### Backend
- **Node.js + Express**: API RESTful
- **TypeScript**: Tipagem completa front-to-back
- **Drizzle ORM**: ORM type-safe para PostgreSQL
- **Neon Database**: Banco PostgreSQL serverless

### Integrações
- **Webhook**: Auto-envio para sistema CRM (n8n)
- **Validação**: Zod schemas para validação de dados
- **Armazenamento**: PostgreSQL com interface para expansão

## 🚀 Como Executar

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Executar aplicação**:
   ```bash
   npm run dev
   ```

3. **Acessar**:
   - Frontend: http://localhost:5000
   - Backend API: http://localhost:5000/api

## 📊 Dados Coletados

- **Perfil Pessoal**: Nome, email, telefone, data nascimento, país
- **Família**: Estado civil, filhos, cidadania
- **Educação**: Formação, ano graduação, instituição, certificações
- **Experiência**: Cargo atual, liderança, reconhecimentos
- **Objetivos**: Trabalho, investimento, capital disponível
- **Conexões EUA**: Família, oferta trabalho, transferência
- **Fonte**: Como conheceu a Mister Visa

## 🎨 Design

- **Header**: Fundo azul claro com logo centralizada
- **Cores**: Gradient azul (#dbeafe → #93c5fd)
- **Logo**: Mister Visa oficial em todas as telas
- **Layout**: Compacto e otimizado para conversão

## 📱 Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Grid Adaptativo**: Layouts flexíveis para diferentes tamanhos
- **Botões Compactos**: Altura reduzida para melhor UX móvel

## 🔗 Integrações

- **Webhook URL**: `https://2n8n.ominicrm.com/webhook-test/ef793db4-4f98-4013-839c-3c965a7b4f2c`
- **Auto-submit**: Envio automático a cada "Avançar" + submissão final
- **Dados Filtrados**: Apenas campos preenchidos são enviados

## 📈 Scoring System

Sistema de pontuação que avalia:
- Experiência profissional
- Nível educacional
- Proficiência em inglês
- Capital disponível
- Conexões nos EUA

Recomenda vistos baseado na pontuação:
- **EB-5**: Investimento ($800k+)
- **H1B**: Trabalho especializado
- **L1**: Transferência executiva
- **F1**: Estudante
- **Família**: Reunificação familiar

## 🛠️ Tecnologias

- React 18
- TypeScript
- Tailwind CSS
- Express.js
- Drizzle ORM
- PostgreSQL (Neon)
- Vite
- TanStack Query

## 📄 Licença

Propriedade da Mister Visa - Consultoria em Imigração