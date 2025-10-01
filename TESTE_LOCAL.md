# 🧪 Guia de Teste Local - VisaQualify

## ⚠️ Problema Atual

O servidor de desenvolvimento precisa de configuração de banco de dados que não temos localmente. 

## ✅ Solução: Testar Diretamente no EasyPanel

Como o projeto está configurado para produção, a melhor forma de testar é:

### 1️⃣ Deploy no EasyPanel

1. Acesse seu painel EasyPanel
2. Vá no serviço `visaqualify`
3. Clique em **"Redeploy"**
4. Aguarde 2-3 minutos para o build completar

### 2️⃣ Configurações no EasyPanel

- **Porta**: `80`
- **Build Path**: `/`
- **Variáveis de Ambiente**: Nenhuma necessária

### 3️⃣ Acessar a Aplicação

Após o deploy, clique na URL fornecida pelo EasyPanel (algo como `https://visaqualify.seudominio.com`)

## 🔍 O que Verificar

### Tela Inicial
- [ ] Logo da Mister Visa aparece
- [ ] Título "Avaliação Gratuita de Elegibilidade"
- [ ] Botão "INICIAR MINHA AVALIAÇÃO GRATUITA"
- [ ] Features: Perfil Profissional, Educação, Idiomas, Resultado

### Fluxo do Formulário
- [ ] **Pergunta 1**: Bloco 1 - Seus Objetivos (6 opções)
- [ ] **Pergunta 2**: Capital Disponível (4 opções)
- [ ] **Pergunta 3**: Bloco 2 - Dados Pessoais (5 campos)
- [ ] **Pergunta 4**: Estado Civil (6 opções)
- [ ] Barra de progresso atualiza
- [ ] Contador de pontos funciona
- [ ] Botões Voltar/Avançar funcionam

### Tela Final
- [ ] Mostra pontuação total
- [ ] Lista recomendações de visto
- [ ] Mensagem de agradecimento

### Webhook
- [ ] Verifique no n8n se os dados chegaram
- [ ] URL: `https://n8n.stratia.app.br/webhook-test/650b310d-cd0b-465a-849d-7c7a3991572e`

## 🐛 Troubleshooting

### Build falha
- Verifique os logs no EasyPanel
- Procure por erros de npm ou vite

### Página em branco
- Verifique se a porta está configurada como 80
- Verifique os logs do Nginx

### Webhook não funciona
- Teste manualmente com curl ou Postman
- Verifique se a URL do webhook está correta

## 📊 Logs Importantes

No EasyPanel, verifique:
```
Build logs: Deve mostrar "Build completed successfully"
Runtime logs: Nginx deve estar servindo na porta 80
```

## ✅ Sucesso!

Se tudo funcionar:
1. Formulário carrega corretamente
2. Todas as 18 perguntas aparecem
3. Pontuação é calculada
4. Recomendações aparecem
5. Webhook recebe os dados

**O projeto está pronto para produção!** 🎉
