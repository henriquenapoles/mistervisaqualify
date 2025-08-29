# 📁 Como subir para o GitHub

## Passo 1: Criar repositório no GitHub
1. Acesse [github.com](https://github.com)
2. Clique em "New repository"
3. Nome sugerido: `mister-visa-wizard`
4. Descrição: "Formulário gamificado de qualificação para imigração aos EUA"
5. Marque "Public" ou "Private" conforme preferir
6. **NÃO** marque "Initialize with README" (já temos um)
7. Clique "Create repository"

## Passo 2: Configurar Git local (no Replit Shell)
```bash
# Configurar seu nome e email (se não estiver configurado)
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"

# Verificar status atual
git status

# Adicionar todos os arquivos
git add .

# Fazer o commit inicial
git commit -m "Initial commit: Mister Visa immigration qualification wizard

Features:
- Complete gamified immigration form with 14 questions
- Real-time scoring system and visa recommendations
- Professional Mister Visa branding with logo and favicon
- Auto-submission to webhook on every step
- Responsive design with blue header backgrounds
- Input validation and error handling
- Progress tracking and navigation
- Lead generation with detailed user data collection"
```

## Passo 3: Conectar ao GitHub
```bash
# Adicionar o repositório remoto (substitua USERNAME/REPO-NAME)
git remote add origin https://github.com/USERNAME/mister-visa-wizard.git

# Verificar se foi adicionado corretamente
git remote -v

# Fazer o primeiro push
git push -u origin main
```

## Passo 4: Futuras atualizações
Para enviar mudanças futuras:
```bash
git add .
git commit -m "Descrição das mudanças"
git push
```

## 🔑 Autenticação
Se solicitar login:
- **Username**: Seu usuário do GitHub
- **Password**: Use um Personal Access Token (não sua senha)

### Como criar Personal Access Token:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token → Classic
3. Marcar "repo" scope
4. Copiar o token gerado (guarde bem!)

## 📝 Estrutura do Projeto
```
mister-visa-wizard/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── types/          # Definições TypeScript
│   │   └── utils/          # Utilitários
│   └── index.html
├── server/                 # Backend Express
│   ├── routes.ts          # Rotas da API
│   └── storage.ts         # Interface de armazenamento
├── shared/                # Tipos compartilhados
├── attached_assets/       # Logos e assets
├── package.json
├── README.md
└── .gitignore
```

## 🌐 Deploy no Replit
O projeto já está configurado para rodar no Replit:
- Workflow "Start application" executa `npm run dev`
- Frontend e backend no mesmo port (5000)
- Hot reload automático

## 📞 Suporte
Se tiver problemas:
1. Verifique se o repositório GitHub foi criado corretamente
2. Confirme as credenciais Git
3. Use `git status` para verificar o estado
4. Use `git log --oneline` para ver commits