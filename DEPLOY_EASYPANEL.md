# 🚀 Guia de Deploy - VisaQualify no EasyPanel

Este guia detalha como hospedar o projeto VisaQualify (Mister Visa Immigration Wizard) no EasyPanel.

## 📋 Pré-requisitos

- Conta no EasyPanel
- Repositório Git com o código do projeto
- Domínio personalizado (opcional)

## 🎯 Sobre o Projeto

O VisaQualify é um **formulário gamificado de captura de leads** que:
- ✅ Coleta dados dos interessados em imigração
- ✅ Calcula pontuação de elegibilidade em tempo real
- ✅ Envia dados automaticamente via webhook para CRM
- ✅ **NÃO precisa de banco de dados** (armazenamento em memória)
- ✅ **NÃO persiste dados** (apenas envia para sistema externo)

## 🐳 Deploy no EasyPanel

### Passo 1: Preparar o Repositório
1. Faça commit de todos os arquivos necessários:
   ```bash
   git add .
   git commit -m "Preparar para deploy no EasyPanel"
   git push origin main
   ```

### Passo 2: Criar Aplicação no EasyPanel
1. Acesse seu painel EasyPanel
2. Clique em "New Application"
3. Selecione "Docker" como tipo de aplicação
4. Configure:
   - **Name**: `visaqualify` ou `mister-visa-wizard`
   - **Repository**: URL do seu repositório Git
   - **Branch**: `main`
   - **Dockerfile Path**: `./Dockerfile`

### Passo 3: Configurar Variáveis de Ambiente
No EasyPanel, adicione as seguintes variáveis de ambiente:

#### Obrigatórias:
```
NODE_ENV=production
PORT=5000
```

#### Opcionais:
```
WEBHOOK_URL=https://n8n.stratia.app.br/webhook-test/650b310d-cd0b-465a-849d-7c7a3991572e
SESSION_SECRET=sua_chave_secreta_aqui
CORS_ORIGIN=https://seudominio.com
```

### Passo 4: Configurar Porta e Rede
1. **Port**: `5000`
2. **Host**: `0.0.0.0`
3. **Protocol**: `HTTP`

### Passo 5: Configurar Domínio (Opcional)
1. Vá em "Domains" na aplicação
2. Adicione seu domínio personalizado
3. Configure SSL/TLS se necessário

### Passo 6: Deploy
1. Clique em "Deploy"
2. Aguarde o build e deploy completar
3. Verifique os logs para garantir que não há erros

## 🔧 Configurações Avançadas

### Health Check
A aplicação inclui health check em `/api/health`. Configure no EasyPanel:
- **Path**: `/api/health`
- **Interval**: `30s`
- **Timeout**: `10s`

### Recursos Recomendados
- **CPU**: 0.25-0.5 vCPU (aplicação leve)
- **RAM**: 256MB-512MB (suficiente para formulário)
- **Storage**: 1GB

### Auto-deploy
Configure auto-deploy para atualizações automáticas:
1. Vá em "Settings" da aplicação
2. Ative "Auto Deploy"
3. Configure branch para `main`

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Porta não Acessível
```
Error: Port 5000 is not accessible
```
**Solução**: Certifique-se de que a porta 5000 está configurada no EasyPanel.

#### 2. Build Falha
```
Error: npm ci failed
```
**Solução**: Verifique se todas as dependências estão no `package.json`.

#### 3. Webhook não Funciona
```
Error: Webhook submission failed
```
**Solução**: Verifique se a URL do webhook está correta e acessível.

### Logs
Para debugar problemas:
1. Acesse "Logs" na aplicação
2. Verifique logs de build e runtime
3. Procure por erros específicos

## 📊 Monitoramento

### Métricas Importantes
- **CPU Usage**: Deve ficar abaixo de 50% (aplicação leve)
- **Memory Usage**: Monitorar crescimento de memória
- **Response Time**: API deve responder em < 200ms
- **Uptime**: Manter acima de 99%

### Alertas Recomendados
- CPU > 70% por 5 minutos
- Memory > 80%
- Response time > 1 segundo
- Uptime < 99%

## 🔄 Atualizações

### Deploy Manual
1. Faça as alterações no código
2. Commit e push para o repositório
3. No EasyPanel, clique em "Redeploy"

### Deploy Automático
Com auto-deploy ativado, qualquer push para `main` dispara o deploy automaticamente.

## 🛡️ Segurança

### Recomendações
1. **Variáveis Sensíveis**: Nunca commite arquivos `.env`
2. **HTTPS**: Sempre use HTTPS em produção
3. **CORS**: Configure CORS adequadamente
4. **Rate Limiting**: Considere implementar rate limiting

### Backup
Como não há banco de dados, o backup é desnecessário. Os dados são enviados diretamente para o CRM via webhook.

## 📞 Suporte

### Recursos
- [Documentação EasyPanel](https://docs.easypanel.io/)
- [Docker Documentation](https://docs.docker.com/)

### Contato
Para suporte específico do projeto VisaQualify, consulte a documentação interna da Mister Visa.

---

## ✅ Checklist de Deploy

- [ ] Repositório Git atualizado
- [ ] Dockerfile criado
- [ ] Variáveis de ambiente configuradas
- [ ] Porta 5000 configurada
- [ ] Domínio personalizado (opcional)
- [ ] SSL/TLS configurado
- [ ] Health check funcionando
- [ ] Logs sem erros
- [ ] Aplicação acessível via URL
- [ ] Webhook funcionando (teste o formulário)

**🎉 Deploy concluído com sucesso!**
