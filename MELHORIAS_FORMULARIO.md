# 📝 Melhorias Necessárias no Formulário VisaQualify

## ✅ Status Atual
- [x] Tela inicial funcionando perfeitamente
- [x] 18 perguntas básicas implementadas
- [x] Sistema de pontuação funcionando
- [x] Webhook configurado

## 🔧 Ajustes Necessários

### 1. Detalhes do Cônjuge (Quando Casado/União Estável)
**Localização**: Pergunta 4 - Estado Civil
- [ ] Adicionar campos quando selecionar "Casado(a)" ou "União Estável":
  - Nome do(a) cônjuge
  - Idade do(a) cônjuge  
  - Nível de escolaridade do(a) cônjuge
  - Profissão do(a) cônjuge

### 2. Detalhes dos Filhos
**Localização**: Pergunta 5 - Filhos
- [ ] Quando selecionar "Sim, tenho filhos":
  - Quantos filhos você tem?
  - Idades dos filhos (separadas por vírgula)
  - Ex: "5, 8, 12"

### 3. Detalhes de Cidadania
**Localização**: Pergunta 6 - Cidadania
- [ ] Quando selecionar "Sim":
  - Qual(is) cidadania(s) você possui?
  - Campo de texto para especificar

### 4. Detalhes de Indicação
**Localização**: Pergunta 7 - Origem do Contato
- [ ] Quando selecionar "Indicação":
  - Quem indicou você? (Nome da pessoa ou empresa)
  - Campo de texto

### 5. Bloco de Educação
**Localização**: Perguntas 8-9
- [ ] Manter pergunta 8: Nível de escolaridade
- [ ] Pergunta 9 deve ter:
  - Ano de formação
  - Instituição de Ensino
  - Área de Formação

### 6. Certificações Profissionais
**Localização**: Nova pergunta após Educação
- [ ] Adicionar pergunta 10:
  - "Você possui certificações profissionais relevantes?"
  - Sim/Não
  - Se Sim: Campo para listar certificações

### 7. Bloco de Trabalho/Experiência
**Localização**: Perguntas atuais sobre cargo
- [ ] Mudar de "Cargo Atual" para:
  - "Conte-nos sobre seu trabalho atual ou mais recente"
  - Campo de texto área (textarea)
  - Permitir explicação detalhada

### 8. Detalhes de Liderança
**Localização**: Pergunta sobre liderança
- [ ] Quando selecionar "Sim":
  - Descreva sua experiência em liderança
  - Quantas pessoas você já liderou?
  - Campo de texto

### 9. Detalhes de Reconhecimento/Prêmios
**Localização**: Pergunta sobre reconhecimento
- [ ] Quando selecionar "Sim":
  - Quais reconhecimentos/prêmios você recebeu?
  - Descreva brevemente
  - Campo de texto área

### 10. Webhook Configuration
- [ ] Revisar envio de webhook
- [ ] Garantir que TODOS os campos são enviados
- [ ] Criar tela de configuração de webhook (admin)

## 📊 Estrutura Final de Perguntas

1. **Bloco 1 - Objetivos** (2 perguntas)
   - Objetivo nos EUA
   - Capital disponível

2. **Bloco 2 - Dados Pessoais** (1 pergunta)
   - Nome, email, telefone, data nascimento, país

3. **Bloco 3 - Estado Civil** (1 pergunta + detalhes condicionais)
   - Estado civil
   - SE casado/união: detalhes do cônjuge

4. **Bloco 4 - Filhos** (1 pergunta + detalhes condicionais)
   - Tem filhos?
   - SE sim: quantidade e idades

5. **Bloco 5 - Cidadania** (1 pergunta + detalhes condicionais)
   - Outra cidadania?
   - SE sim: qual(is)?

6. **Bloco 6 - Origem do Contato** (1 pergunta + detalhes condicionais)
   - Como conheceu?
   - SE indicação: quem indicou?

7. **Bloco 7 - Educação** (2 perguntas)
   - Nível de escolaridade
   - Detalhes (ano, instituição, área)

8. **Bloco 8 - Certificações** (1 pergunta + detalhes condicionais)
   - Tem certificações?
   - SE sim: quais?

9. **Bloco 9 - Nível de Inglês** (1 pergunta)
   - Básico/Intermediário/Avançado/Fluente

10. **Bloco 10 - Experiência Profissional** (2 perguntas)
    - Anos de experiência
    - Descrição do trabalho atual

11. **Bloco 11 - Liderança** (1 pergunta + detalhes condicionais)
    - Exerceu liderança?
    - SE sim: detalhes

12. **Bloco 12 - Reconhecimento** (1 pergunta + detalhes condicionais)
    - Teve reconhecimento/prêmios?
    - SE sim: quais?

13. **Bloco 13 - Família nos EUA** (1 pergunta)
    - Tem família nos EUA?

14. **Bloco 14 - Oferta de Trabalho** (1 pergunta)
    - Tem oferta de trabalho nos EUA?

15. **Bloco 15 - Transferência** (1 pergunta)
    - Pode ser transferido por empresa?

## 🎯 Total de Perguntas
- **Base**: 15 blocos
- **Condicionais**: Até 6 perguntas adicionais (dependendo das respostas)
- **Máximo**: ~21 perguntas

## 📝 Próximos Passos
1. Atualizar arquivo SimpleWizardForm.tsx
2. Adicionar campos condicionais
3. Atualizar sistema de pontuação
4. Revisar envio de webhook
5. Criar tela de config webhook
6. Testar tudo
7. Deploy
