# VisaQualify - Mister Visa Immigration Form

Formulário estático de qualificação para imigração aos EUA.

## 📁 Estrutura
```
static/
├── index.html      # Formulário completo
├── styles.css      # Estilos e animações
├── app.js          # Lógica do formulário
└── comments.js     # Comentários animados
```

## 🚀 Deploy
```bash
docker build -t visaqualify .
docker run -p 80:80 visaqualify
```

## 🌐 Acesso
- Local: http://localhost
- Produção: Configurar no EasyPanel

## 📡 Webhook
URL: `https://n8n.stratia.app.br/webhook-test/650b310d-cd0b-465a-849d-7c7a3991572e`
