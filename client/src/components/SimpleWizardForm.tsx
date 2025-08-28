import React, { useState, useRef, useEffect } from "react";
import { LeadFormData, Question } from "../types/form";
import { calculateScore } from "../utils/scoring";
import { getVisaRecommendations, getScoreMessage, generatePersonalizedReport } from "../utils/visa-recommendations";
import { useToast } from "@/hooks/use-toast";
import { SimpleProgress } from "./ui/simple-progress";
import flagGif from "@assets/flag-america-usa-35_1756390382970.gif";

// Comentários interativos para cada resposta
const getComment = (questionId: string, value: string): string => {
  const comments: Record<string, Record<string, string>> = {
    objective: {
      'trabalho': 'Ótimo! Os EUA buscam talentos em diversas áreas. Seu perfil pode ser ideal para vistos de trabalho como o H1B ou EB-2.',
      'estudo': 'As universidades americanas são de nível mundial. O visto de estudante (F-1) pode ser um caminho para oportunidades futuras no país.',
      'investimento': 'Esse é um dos caminhos mais diretos para um Green Card! O visto de investidor (EB-5) pode ser a sua porta de entrada.',
      'familia': 'A base de toda imigração é a família. Este é um processo prioritário para o governo americano.',
      'turismo': 'Uma ótima forma de conhecer o país e suas oportunidades! O visto de turista (B1/B2) é o primeiro passo.',
      'outro': 'Entendido. Sua jornada é única, e estamos prontos para traçar o mapa ideal para você.'
    },
    capital: {
      'menos-20k': 'Não se preocupe, existem diversas opções para quem não possui alto capital. Vamos explorar todas elas!',
      '20k-500k': 'Esse capital pode ser um diferencial para vistos de empreendedorismo ou para dar suporte ao processo.',
      '500k-1m': 'Excelente! Você se enquadra na faixa de investimento para o visto EB-5 em determinadas áreas. Isso é uma vantagem enorme.',
      'mais-1m': 'Isso abre as portas para todas as oportunidades de visto de investidor (EB-5), inclusive em centros regionais de alta demanda.'
    },
    maritalStatus: {
      'solteiro': 'O processo para solteiros costuma ser mais simples e rápido. Ótimo!',
      'casado': 'É uma jornada para toda a família! Quando você obtém o visto de imigrante, seu cônjuge e filhos menores de 21 anos também se qualificam.',
      'casado-filhos': 'É uma jornada para toda a família! Quando você obtém o visto de imigrante, seu cônjuge e filhos menores de 21 anos também se qualificam.'
    },
    citizenship: {
      'sim': 'Isso pode acelerar ou até abrir novos caminhos! Algumas nacionalidades têm acordos especiais com os EUA.',
      'nao': 'Não há problema! A cidadania brasileira já é um ótimo ponto de partida para a maioria dos processos.'
    },
    education: {
      'ensino-medio': 'Perfeito! Vamos focar em outras áreas do seu perfil, como experiência profissional e vínculos familiares, para encontrar o visto ideal.',
      'graduacao': 'Ótimo! Sua formação acadêmica é um dos principais pilares para vistos de trabalho, especialmente o EB-2 e o H1B.',
      'pos': 'Ótimo! Sua formação acadêmica é um dos principais pilares para vistos de trabalho, especialmente o EB-2 e o H1B.',
      'mestrado': 'Ótimo! Sua formação acadêmica é um dos principais pilares para vistos de trabalho, especialmente o EB-2 e o H1B.',
      'doutorado': 'Ótimo! Sua formação acadêmica é um dos principais pilares para vistos de trabalho, especialmente o EB-2 e o H1B.'
    },
    englishLevel: {
      'basico': 'Não se preocupe, a falta de fluência não impede a maioria dos processos. No entanto, é algo que podemos trabalhar juntos para melhorar.',
      'intermediario': 'Bom nível! Isso já é um diferencial importante para muitos processos de imigração.',
      'avancado': 'Isso é um grande diferencial! A fluência em inglês é muito valorizada por empregadores e é um ponto forte no seu perfil.',
      'fluente': 'Isso é um grande diferencial! A fluência em inglês é muito valorizada por empregadores e é um ponto forte no seu perfil.'
    },
    experience: {
      'menos-1': 'Todo profissional começou de algum lugar! Vamos focar em outras fortalezas do seu perfil.',
      '1-5': 'Boa experiência inicial! Isso já demonstra conhecimento prático na sua área.',
      '5-10': 'Sua experiência é um ativo muito valioso! Profissionais experientes são extremamente procurados nos EUA.',
      '10-plus': 'Sua experiência é um ativo muito valioso! Profissionais experientes são extremamente procurados nos EUA.'
    },
    hasLeadership: {
      'sim': 'Fantástico! Liderança e reconhecimento podem qualificar você para vistos de habilidade extraordinária, como o EB-1 ou o O-1.',
      'nao': 'Não há problema! Sua experiência técnica e outras qualificações são igualmente valiosas.'
    },
    hasRecognition: {
      'sim': 'Fantástico! Liderança e reconhecimento podem qualificar você para vistos de habilidade extraordinária, como o EB-1 ou o O-1, o caminho mais rápido para um Green Card.',
      'nao': 'Tudo bem! O mais importante é a sua experiência prática e qualificações técnicas.'
    },
    familyInUS: {
      'sim': 'Isso é uma grande vantagem! Vistos de família são uma das vias mais seguras e diretas para a imigração.',
      'nao': 'Não se preocupe! Há muitos outros caminhos através de qualificação profissional e outras habilidades.'
    },
    jobOffer: {
      'sim': 'Você encontrou o "bilhete de ouro"! Com uma oferta de emprego, seu processo de visto de trabalho se torna muito mais forte e focado.',
      'nao': 'Tudo bem! Muitos conseguem ofertas de emprego durante o processo ou usam outros caminhos.'
    },
    companyTransfer: {
      'sim': 'Essa é uma das formas mais comuns de imigração para executivos e profissionais especializados. O visto L-1 pode ser a sua opção!',
      'nao': 'Sem problemas! Existem muitas outras formas de conseguir oportunidades de trabalho nos EUA.'
    }
  };
  
  return comments[questionId]?.[value] || 'Obrigado pela sua resposta! Vamos continuar construindo seu perfil.';
};

// Question definitions completas
const questions: Question[] = [
  {
    id: 'objective',
    title: '🎯 Bloco 1 - Seus Objetivos',
    subtitle: 'O que você busca nos EUA?',
    type: 'single-choice',
    icon: 'fas fa-bullseye',
    options: [
      { value: 'trabalho', label: 'Trabalho', icon: 'fas fa-briefcase', score: 10 },
      { value: 'estudo', label: 'Estudo', icon: 'fas fa-graduation-cap', score: 8 },
      { value: 'investimento', label: 'Investimento', icon: 'fas fa-chart-line', score: 15 },
      { value: 'familia', label: 'Reunião Familiar', icon: 'fas fa-heart', score: 12 },
      { value: 'turismo', label: 'Turismo', icon: 'fas fa-plane', score: 0 },
      { value: 'outro', label: 'Outro', icon: 'fas fa-question', score: 0, hasInput: true }
    ]
  },
  {
    id: 'capital',
    title: '💵 Capital Disponível',
    subtitle: 'Capital disponível para investir (USD)?',
    type: 'single-choice',
    icon: 'fas fa-dollar-sign',
    options: [
      { value: 'menos-20k', label: 'Menos de $20.000', score: 0 },
      { value: '20k-500k', label: '$20.000 – $500.000', score: 5 },
      { value: '500k-1m', label: '$500.001 – $1.000.000', score: 10 },
      { value: 'mais-1m', label: 'Mais de $1.000.000', score: 20 }
    ]
  },
  {
    id: 'personal-info',
    title: '📝 Bloco 2 - Dados Pessoais',
    subtitle: 'Suas informações pessoais',
    type: 'form-fields',
    icon: 'fas fa-user',
    fields: [
      { id: 'fullName', label: 'Nome Completo', type: 'text', required: true },
      { id: 'email', label: 'Email', type: 'email', required: true },
      { id: 'phone', label: 'Telefone (com DDD)', type: 'tel', required: true },
      { id: 'birthDate', label: 'Data de Nascimento', type: 'date', required: true },
      { id: 'country', label: 'País de Residência', type: 'select', required: true, 
        options: [
          { value: 'brasil', label: 'Brasil' },
          { value: 'outro', label: 'Outro', hasInput: true }
        ]
      }
    ]
  },
  {
    id: 'maritalStatus',
    title: '💍 Bloco 3 - Família e Cidadania',
    subtitle: 'Qual o seu estado civil?',
    type: 'single-choice',
    icon: 'fas fa-users',
    options: [
      { value: 'solteiro', label: 'Solteiro(a)', icon: 'fas fa-user', score: 0 },
      { value: 'casado', label: 'Casado(a)', icon: 'fas fa-heart', score: 0, hasForm: true },
      { value: 'casado-filhos', label: 'Casado(a) com filhos', icon: 'fas fa-home', score: 0, hasForm: true }
    ]
  },
  {
    id: 'citizenship',
    title: '🌐 Cidadania',
    subtitle: 'Possui outra cidadania além da brasileira?',
    type: 'single-choice',
    icon: 'fas fa-passport',
    options: [
      { value: 'sim', label: 'Sim', score: 5, hasInput: true },
      { value: 'nao', label: 'Não', score: 0 }
    ]
  },
  {
    id: 'howFoundUs',
    title: '📢 Bloco 4 - Origem do Contato',
    subtitle: 'Como chegou até nós?',
    type: 'single-choice',
    icon: 'fas fa-compass',
    options: [
      { value: 'instagram', label: 'Instagram', icon: 'fab fa-instagram', score: 0 },
      { value: 'facebook', label: 'Facebook', icon: 'fab fa-facebook', score: 0 },
      { value: 'google', label: 'Google', icon: 'fab fa-google', score: 0 },
      { value: 'linkedin', label: 'LinkedIn', icon: 'fab fa-linkedin', score: 0 },
      { value: 'youtube', label: 'YouTube', icon: 'fab fa-youtube', score: 0 },
      { value: 'whatsapp', label: 'WhatsApp', icon: 'fab fa-whatsapp', score: 0 },
      { value: 'site', label: 'Site', icon: 'fas fa-globe', score: 0 },
      { value: 'indicacao', label: 'Indicação', icon: 'fas fa-handshake', score: 0 },
      { value: 'evento', label: 'Evento', icon: 'fas fa-calendar', score: 0 },
      { value: 'outro', label: 'Outro', icon: 'fas fa-ellipsis-h', score: 0, hasInput: true }
    ]
  },
  {
    id: 'education',
    title: '🎓 Bloco 5 - Educação',
    subtitle: 'Qual o seu nível de escolaridade mais alto?',
    type: 'single-choice',
    icon: 'fas fa-graduation-cap',
    options: [
      { value: 'ensino-medio', label: 'Ensino Médio Completo', score: 0 },
      { value: 'graduacao', label: 'Graduação', score: 5 },
      { value: 'pos', label: 'Pós-Graduação/Especialização', score: 8 },
      { value: 'mestrado', label: 'Mestrado', score: 10 },
      { value: 'doutorado', label: 'Doutorado', score: 15 }
    ]
  },
  {
    id: 'education-details',
    title: '📚 Detalhes da Educação',
    subtitle: 'Ótimo! Para qualificar melhor, nos diga...',
    type: 'form-fields',
    icon: 'fas fa-school',
    fields: [
      { id: 'graduationYear', label: 'Ano de formação', type: 'number', required: true, min: 1950, max: 2025 },
      { id: 'institution', label: 'Instituição de Ensino', type: 'text', required: true },
      { id: 'fieldOfStudy', label: 'Área de Formação', type: 'text', required: true }
    ]
  },
  {
    id: 'certifications',
    title: '📜 Certificações',
    subtitle: 'Você possui certificações profissionais relevantes?',
    type: 'single-choice',
    icon: 'fas fa-certificate',
    options: [
      { value: 'sim', label: 'Sim', score: 2, hasInput: true },
      { value: 'nao', label: 'Não', score: 0 }
    ]
  },
  {
    id: 'englishLevel',
    title: '🗣️ Nível de Inglês',
    subtitle: 'Qual o seu nível de inglês?',
    type: 'single-choice',
    icon: 'fas fa-language',
    options: [
      { value: 'basico', label: 'Básico', score: 0 },
      { value: 'intermediario', label: 'Intermediário', score: 3 },
      { value: 'avancado', label: 'Avançado', score: 5 },
      { value: 'fluente', label: 'Fluente', score: 8 }
    ]
  },
  {
    id: 'experience',
    title: '⏳ Bloco 6 - Experiência Profissional',
    subtitle: 'Anos de experiência profissional relevante',
    type: 'single-choice',
    icon: 'fas fa-tools',
    options: [
      { value: 'menos-1', label: '< 1 ano', score: 0 },
      { value: '1-5', label: '1-5 anos', score: 5 },
      { value: '5-10', label: '5-10 anos', score: 8 },
      { value: '10-plus', label: '10+ anos', score: 10 }
    ]
  },
  {
    id: 'currentPosition',
    title: '💼 Cargo Atual',
    subtitle: 'Qual o seu cargo atual ou mais recente?',
    type: 'form-fields',
    icon: 'fas fa-id-badge',
    fields: [
      { id: 'currentPosition', label: 'Cargo atual ou mais recente', type: 'text', required: true }
    ]
  },
  {
    id: 'leadership-recognition',
    title: '🏆 Bloco 8 - Liderança e Reconhecimento',
    subtitle: 'Experiência em liderança e reconhecimentos',
    type: 'combined-questions',
    icon: 'fas fa-crown',
    subQuestions: [
      {
        id: 'hasRecognition',
        subtitle: 'Já teve reconhecimento nacional/internacional (prêmios, publicações, etc.)?',
        options: [
          { value: 'sim', label: 'Sim', score: 25, hasInput: true },
          { value: 'nao', label: 'Não', score: 0 }
        ]
      },
      {
        id: 'hasLeadership',
        subtitle: 'Já exerceu cargos de liderança/gerência?',
        options: [
          { value: 'sim', label: 'Sim', score: 5, hasInput: true },
          { value: 'nao', label: 'Não', score: 0 }
        ]
      }
    ]
  },
  {
    id: 'usConnections',
    title: '🇺🇸 Bloco 7 - Conexões nos EUA',
    subtitle: 'Avalie suas conexões com os Estados Unidos',
    type: 'combined-questions',
    icon: 'fas fa-flag-usa',
    subQuestions: [
      {
        id: 'familyInUS',
        subtitle: 'Tem familiares diretos nos EUA (pais, irmãos, filhos) com Green Card ou cidadania?',
        options: [
          { value: 'sim', label: 'Sim, tenho família nos EUA', score: 10 },
          { value: 'nao', label: 'Não tenho família nos EUA', score: 0 }
        ]
      },
      {
        id: 'jobOffer',
        subtitle: 'Tem oferta de emprego confirmada de empresa americana?',
        options: [
          { value: 'sim', label: 'Sim, tenho oferta confirmada', score: 20 },
          { value: 'nao', label: 'Não tenho oferta ainda', score: 0 }
        ]
      },
      {
        id: 'companyTransfer',
        subtitle: 'Trabalha em empresa multinacional com filial nos EUA?',
        options: [
          { value: 'sim', label: 'Sim, possibilidade de transferência', score: 10 },
          { value: 'nao', label: 'Não trabalho em multinacional', score: 0 }
        ]
      }
    ]
  }
];

// Generate random form ID
const generateFormId = () => {
  return 'form_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export function SimpleWizardForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<LeadFormData>({});
  const [showResults, setShowResults] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formId] = useState(generateFormId()); // Random form ID
  const [midFormSubmitted, setMidFormSubmitted] = useState(false);

  const [showInput, setShowInput] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [showSubQuestions, setShowSubQuestions] = useState<string | null>(null);
  const [subAnswers, setSubAnswers] = useState<Record<string, any>>({});
  const [activeComment, setActiveComment] = useState<{text: string, x: number, y: number} | null>(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [savedDetails, setSavedDetails] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  const currentQuestion = questions[currentStep];

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setShowInput(null);
  };



  const getColumnsClass = (optionsCount: number) => {
    if (optionsCount <= 3) return 'cols-1';
    if (optionsCount <= 6) return 'cols-2';
    return 'cols-3';
  };

  const isCurrentQuestionAnswered = () => {
    const currentQ = questions[currentStep];
    
    // For form fields, check if all required fields are filled
    if (currentQ.type === 'form-fields') {
      return currentQ.fields?.every(field => {
        if (field.required) {
          return formData[field.id] && formData[field.id].trim() !== '';
        }
        return true;
      }) || false;
    }
    
    // For combined questions, check if all sub-questions are answered
    if (currentQ.type === 'combined-questions') {
      return currentQ.subQuestions?.every((subQ: any) => 
        formData[subQ.id] && formData[subQ.id] !== ''
      ) || false;
    }
    
    // For single choice, check if option is selected
    if (currentQ.type === 'single-choice') {
      const hasAnswer = formData[currentQ.id] && formData[currentQ.id] !== '';
      
      // If has sub-questions (like marriage), check those too
      if (hasAnswer && showSubQuestions === currentQ.id) {
        return Object.keys(subAnswers[currentQ.id] || {}).length > 0;
      }
      
      // If has input field, check if it's filled
      if (hasAnswer && showInput === currentQ.id) {
        return inputValue.trim() !== '';
      }
      
      return hasAnswer;
    }
    
    return false;
  };

  const nextQuestion = () => {
    // Don't advance if there are sub-questions or input fields open
    if (showSubQuestions || showInput) {
      return;
    }
    
    // Auto-submit at personal data question (block 3)
    if (currentQuestion.id === 'personalInfo' && !midFormSubmitted) {
      submitMidFormData(formData);
    }
    
    // Clear field errors when moving to next step
    setFieldErrors({});
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowSubQuestions(null);
      setShowInput(null);
    } else {
      showResultsScreen();
    }
  };

  const previousQuestion = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowSubQuestions(null);
      setShowInput(null);
      setFieldErrors({});
    }
  };

  const showCommentExplosion = (buttonElement: HTMLElement, comment: string) => {
    const rect = buttonElement.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;
    
    setActiveComment({ text: comment, x, y });
    
    // Remove comment after balloon animation (5 seconds)
    setTimeout(() => {
      setActiveComment(null);
    }, 5000);
  };

  const getComment = (questionId: string, value: string): string => {
    const comments: Record<string, Record<string, string>> = {
      objective: {
        trabalho: "Ótimo! Os EUA buscam talentos em diversas áreas. Seu perfil pode ser ideal para vistos de trabalho como o H1B ou EB-2.",
        negocios: "Empreendedores são muito bem-vindos! E-2 e EB-5 são excelentes opções de visto para negócios.",
        estudo: "As universidades americanas são de nível mundial. O visto de estudante (F-1) pode ser um caminho para oportunidades futuras no país.",
        familia: "A base de toda imigração é a família. Este é um processo prioritário para o governo americano.",
        investimento: "Esse é um dos caminhos mais diretos para um Green Card! O visto de investidor (EB-5) pode ser a sua porta de entrada."
      },
      capital: {
        'menos-20k': "Não se preocupe, existem diversas opções para quem não possui alto capital. Vamos explorar todas elas!",
        '20k-500k': "Esse capital pode ser um diferencial para vistos de empreendedorismo ou para dar suporte ao processo.",
        '500k-1m': "Excelente! Você se enquadra na faixa de investimento para o visto EB-5 em determinadas áreas. Isso é uma vantagem enorme.",
        'mais-1m': "Isso abre as portas para todas as oportunidades de visto de investidor (EB-5), inclusive em centros regionais de alta demanda."
      },
      maritalStatus: {
        solteiro: "O processo para solteiros costuma ser mais simples e rápido. Ótimo!",
        casado: "É uma jornada para toda a família! Quando você obtém o visto de imigrante, seu cônjuge também se qualifica.",
        'casado-filhos': "É uma jornada para toda a família! Quando você obtém o visto de imigrante, seu cônjuge e filhos menores de 21 anos também se qualificam."
      },
      citizenship: {
        sim: "Isso pode acelerar ou até abrir novos caminhos! Algumas nacionalidades têm acordos especiais com os EUA.",
        nao: "Não há problema! A cidadania brasileira já é um ótimo ponto de partida para a maioria dos processos."
      },
      education: {
        'ensino-medio': "Perfeito! Vamos focar em outras áreas do seu perfil, como experiência profissional e vínculos familiares, para encontrar o visto ideal.",
        graduacao: "Ótimo! Sua formação acadêmica é um dos principais pilares para vistos de trabalho, especialmente o EB-2 e o H1B.",
        pos: "Excelente! Pós-graduação é muito valorizada e abre portas para EB-2 Advanced Degree.",
        mestrado: "Fantástico! Mestrado acelera significativamente processos EB-2 e aumenta suas chances no H1B.",
        doutorado: "Incrível! PhD é altamente valorizado e pode qualificar para EB-1 Extraordinary Ability."
      },
      englishLevel: {
        basico: "Não se preocupe, a falta de fluência não impede a maioria dos processos. No entanto, é algo que podemos trabalhar juntos para melhorar.",
        intermediario: "Bom nível! Isso já é um diferencial importante para muitos processos de imigração.",
        avancado: "Isso é um grande diferencial! A fluência em inglês é muito valorizada por empregadores e é um ponto forte no seu perfil.",
        fluente: "Perfeito! Fluência elimina barreiras e é fundamental para sucesso profissional nos EUA."
      },
      experience: {
        'menos-1': "Início de carreira tem potencial! Foque em desenvolver habilidades específicas para H1B futuro.",
        '1-5': "Experiência sólida! Ideal para H1B e processos de trabalho qualificado.",
        '5-10': "Experiência robusta! Você se qualifica para posições sênior e EB-2 nos EUA.",
        '10-plus': "Experiência excepcional! EB-1 e posições executivas são definitivamente possíveis."
      },
      familyInUS: {
        sim: "Família nos EUA é uma grande vantagem! Facilita comprovação de vínculos e pode acelerar alguns processos.",
        nao: "Sem família nos EUA é completamente normal! Focaremos em qualificação profissional e outros caminhos."
      },
      jobOffer: {
        sim: "Incrível! Oferta de emprego americana é praticamente garantia para H1B com sponsor confirmado.",
        nao: "Sem oferta ainda, mas sua qualificação pode atrair empregadores americanos dispostos a patrocinar."
      },
      companyTransfer: {
        sim: "Transferência interna é caminho excelente! L-1 é opção muito viável com menos burocracia.",
        nao: "Sem transferência disponível, mas há muitas outras rotas diretas para os EUA."
      }
    };
    
    return comments[questionId]?.[value] || "Informação registrada! Cada detalhe conta na avaliação de imigração.";
  };

  const calculateCurrentScore = () => {
    let score = 0;
    questions.forEach(question => {
      if (question.options && formData[question.id]) {
        const selectedOption = question.options.find(opt => opt.value === formData[question.id]);
        if (selectedOption) {
          score += selectedOption.score || 0;
        }
      }
      
      // Add scores from sub-questions
      if (question.subQuestions) {
        question.subQuestions.forEach((subQ: any) => {
          if (formData[subQ.id]) {
            const selectedSubOption = subQ.options.find((opt: any) => opt.value === formData[subQ.id]);
            if (selectedSubOption) {
              score += selectedSubOption.score || 0;
            }
          }
        });
      }
    });
    return score;
  };

  const handleOptionSelect = (value: string, hasInput?: boolean, hasForm?: boolean, event?: React.MouseEvent) => {
    const newFormData = { ...formData, [currentQuestion.id]: value };
    setFormData(newFormData);
    
    // Clear saved details for this question when selecting a new option
    if (savedDetails[currentQuestion.id]) {
      const newSavedDetails = { ...savedDetails };
      delete newSavedDetails[currentQuestion.id];
      setSavedDetails(newSavedDetails);
    }
    
    // Close any open sub-questions or inputs when selecting a new option
    setShowSubQuestions(null);
    setShowInput(null);
    
    // Update score immediately
    const newScore = calculateCurrentScore();
    setCurrentScore(newScore);
    
    // Show explosive comment
    if (event?.currentTarget) {
      const comment = getComment(currentQuestion.id, value);
      showCommentExplosion(event.currentTarget as HTMLElement, comment);
    }
    
    if (hasInput) {
      setShowInput(currentQuestion.id);
    } else if (hasForm) {
      setShowSubQuestions(currentQuestion.id);
    }
  };

  const handleInputSubmit = () => {
    if (showInput && inputValue.trim()) {
      setFormData({ ...formData, [`${showInput}Detail`]: inputValue });
      setSavedDetails({ ...savedDetails, [showInput]: inputValue });
      setShowInput(null);
      setInputValue('');
    }
  };

  const handleSubQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formDataObj = new FormData(form);
    const subData: Record<string, any> = {};
    
    // Get spouse/family data
    subData.spouseName = formDataObj.get('spouseName') as string;
    subData.spouseAge = formDataObj.get('spouseAge') as string;
    subData.spouseEducation = formDataObj.get('spouseEducation') as string;
    
    if (formData.maritalStatus === 'casado-filhos') {
      subData.childrenCount = formDataObj.get('childrenCount') as string;
      subData.childrenAges = formDataObj.get('childrenAges') as string;
    }
    
    setSubAnswers({ ...subAnswers, [showSubQuestions!]: subData });
    
    // Save family details summary
    let familySummary = `Cônjuge: ${subData.spouseName} (${subData.spouseAge} anos, ${subData.spouseEducation})`;
    if (formData.maritalStatus === 'casado-filhos' && subData.childrenCount) {
      familySummary += ` | Filhos: ${subData.childrenCount} (idades: ${subData.childrenAges})`;
    }
    setSavedDetails({ ...savedDetails, [showSubQuestions!]: familySummary });
    
    setShowSubQuestions(null);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    // Must have exactly 13 digits (5581982917181)
    return cleanPhone.length === 13;
  };

  const validateGraduationYear = (year: string): boolean => {
    const currentYear = new Date().getFullYear();
    const numYear = parseInt(year);
    return numYear >= 1950 && numYear <= currentYear;
  };

  const validateBirthDate = (dateStr: string): boolean => {
    const birthDate = new Date(dateStr);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 16 && age - 1 <= 100;
    }
    return age >= 16 && age <= 100;
  };

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formDataObj = new FormData(form);
    const newData: Record<string, any> = {};
    const errors: Record<string, string> = {};
    let valid = true;
    
    currentQuestion.fields?.forEach(field => {
      let value = formDataObj.get(field.id) as string;
      
      // Clear previous error
      delete errors[field.id];
      
      if (field.required && !value) {
        valid = false;
        errors[field.id] = `Campo obrigatório`;
        return;
      }
      
      // Validate email
      if (field.id === 'email' && value && !validateEmail(value)) {
        valid = false;
        errors[field.id] = "E-mail inválido";
        return;
      }
      
      // Validate and format phone
      if (field.id === 'phone' && value) {
        const cleanPhone = value.replace(/\D/g, '');
        if (!validatePhone(value)) {
          valid = false;
          errors[field.id] = "Telefone deve ter 13 dígitos (ex: 5581982917181)";
          return;
        }
        value = cleanPhone; // Store clean phone number
      }
      
      // Validate graduation year
      if (field.id === 'graduationYear' && value && !validateGraduationYear(value)) {
        valid = false;
        errors[field.id] = "Ano de formação inválido (1950-2025)";
        return;
      }

      // Validate birth date
      if (field.id === 'birthDate' && value && !validateBirthDate(value)) {
        valid = false;
        errors[field.id] = "Data de nascimento inválida (idade entre 16-100 anos)";
        return;
      }
      
      if (value) {
        newData[field.id] = field.type === 'number' ? parseInt(value) : value;
      }
    });

    setFieldErrors(errors);

    if (valid) {
      const updatedFormData = { ...formData, ...newData };
      setFormData(updatedFormData);
      
      // Auto-submit at block 3 (personal info question)
      if (currentQuestion.id === 'personalInfo' && !midFormSubmitted) {
        submitMidFormData(updatedFormData);
      }
      
      setTimeout(() => {
        if (currentStep < questions.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          showResultsScreen();
        }
      }, 500);
    }
  };

  const submitMidFormData = async (currentFormData: LeadFormData) => {
    if (midFormSubmitted) return;
    
    try {
      const partialScore = calculateScore(currentFormData);
      
      const leadData = {
        formId,
        formType: 'partial',
        fullName: currentFormData.fullName || 'Dados parciais',
        email: currentFormData.email || 'partial@temp.com',
        phone: currentFormData.phone || '0000000000000',
        objective: currentFormData.objective,
        capital: currentFormData.capital,
        maritalStatus: currentFormData.maritalStatus || 'solteiro',
        totalScore: partialScore,
        submittedAt: new Date().toISOString(),
        step: 'block-3-personal-info',
        ...currentFormData
      };

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });
      
      if (response.ok) {
        console.log('Mid-form data submitted successfully');
        setMidFormSubmitted(true);
      } else {
        console.error('Mid-form submission failed:', response.statusText);
      }
    } catch (error) {
      console.error('Mid-form submission error:', error);
    }
  };

  const showResultsScreen = () => {
    const score = calculateScore(formData);
    setTotalScore(score);
    setShowResults(true);
  };

  const submitLead = async () => {
    setIsSubmitting(true);
    
    try {
      const score = calculateScore(formData);
      const visaRecommendations = getVisaRecommendations(score);
      
      const leadData = {
        formId,
        formType: 'complete',
        ...formData,
        ...subAnswers,
        score,
        visaRecommendations: visaRecommendations.map(v => v.name),
        submittedAt: new Date().toISOString()
      };

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      if (response.ok) {
        toast({
          title: "Cadastro enviado com sucesso!",
          description: "Nosso time entrará em contato em breve.",
        });
      } else {
        throw new Error('Failed to submit lead');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no envio",
        description: "Tente novamente ou entre em contato conosco.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showResults) {
    const visaRecommendations = getVisaRecommendations(totalScore);
    const scoreMessage = getScoreMessage(totalScore);
    const personalizedReport = generatePersonalizedReport(formData, totalScore);

    return (
      <div className="wizard-container rounded-lg shadow-lg p-8 text-center" data-testid="results-screen">
        <div className="mb-8">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-trophy text-white text-4xl"></i>
          </div>
          
          <h2 className="text-4xl font-bold text-blue-600 mb-4">
            🎉 Seu Resultado
          </h2>
          
          <div className="bg-blue-600 text-white p-6 rounded-lg mb-8">
            <p className="text-xl mb-2">Sua pontuação é</p>
            <p className="text-5xl font-bold" data-testid="total-score">{totalScore} pontos!</p>
          </div>
          
          <div className="bg-gray-100 p-6 rounded-lg mb-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-6">
              🎯 Vistos recomendados para seu perfil:
            </h3>
            
            <div className="space-y-4">
              {visaRecommendations.map((visa, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border">
                  <h4 className="font-bold text-blue-600">{visa.name}</h4>
                  <p className="text-sm text-gray-600">{visa.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-bold text-blue-700 mb-2">📋 Análise do Seu Perfil:</h4>
              <p className="text-sm text-blue-700 leading-relaxed">{personalizedReport}</p>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700 font-medium">{scoreMessage}</p>
            </div>
          </div>
          
          <button
            onClick={submitLead}
            disabled={isSubmitting}
            className="btn-primary text-xl font-bold px-8 py-4 rounded-lg disabled:opacity-50"
            data-testid="button-submit-lead"
          >
            {isSubmitting ? 'Enviando...' : '✅ FINALIZAR CADASTRO'}
          </button>
          
          <div className="mt-6 text-center">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">Obrigado!</h3>
            <p className="text-gray-700">
              Um consultor Mister Visa entrará em contato em breve 
              com as melhores estratégias para o seu perfil específico.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="wizard-container rounded-lg shadow-lg p-8 relative">
      {/* Score Display */}
      <div className="score-display">
        🏆 Pontuação:
        <span className="score-number">{currentScore}</span>
      </div>

      {/* USA Flag in header */}
      <div className="flag-container">
        <img src={flagGif} alt="USA Flag" className="flag-gif" />
      </div>

      {/* Brand Header */}
      <div className="brand-header">
        <h1>Mister Visa®</h1>
        <p>Pergunta {currentStep + 1} de {questions.length}</p>
      </div>



      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
        ></div>
      </div>
      
      {/* Navigation Bar */}
      {currentStep > 0 && (
        <div className="mb-6">
          <button
            onClick={() => goToStep(currentStep - 1)}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            data-testid="button-back"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Voltar à pergunta anterior
          </button>
        </div>
      )}
      
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {currentQuestion.title}
        </h2>
        <p className="text-lg text-gray-600">{currentQuestion.subtitle}</p>
      </div>

      {currentQuestion.type === 'single-choice' && (
        <div className={`options-grid ${getColumnsClass(currentQuestion.options?.length || 0)}`}>
          {currentQuestion.options?.map((option) => (
            <button
              key={option.value}
              onClick={(e) => handleOptionSelect(option.value, option.hasInput, option.hasForm, e)}
              className={`option-button text-left ${
                formData[currentQuestion.id] === option.value ? 'selected' : ''
              }`}
              data-testid={`option-${option.value}`}
            >
              <div className="flex items-center">
                {option.icon && <i className={`${option.icon} mr-3 text-gray-700`}></i>}
                <span className="font-medium">{option.label}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Show saved details for current question */}
      {savedDetails[currentQuestion.id] && (
        <div className="saved-details">
          <i className="fas fa-info-circle"></i>
          <span>Detalhes salvos: {savedDetails[currentQuestion.id]}</span>
        </div>
      )}

      {/* Show saved family details for marriage question */}
      {currentQuestion.id === 'maritalStatus' && savedDetails['maritalStatus'] && (
        <div className="saved-details">
          <i className="fas fa-users"></i>
          <span>{savedDetails['maritalStatus']}</span>
        </div>
      )}

      {/* Show saved family details for US connections */}
      {currentQuestion.id === 'usConnections' && (savedDetails['familyInUS'] || savedDetails['jobOffer'] || savedDetails['companyTransfer']) && (
        <div className="saved-details">
          <i className="fas fa-flag-usa"></i>
          <span>
            {savedDetails['familyInUS'] && `Família: ${formData.familyInUS === 'sim' ? 'Sim' : 'Não'}`}
            {savedDetails['jobOffer'] && ` | Oferta de emprego: ${formData.jobOffer === 'sim' ? 'Sim' : 'Não'}`}
            {savedDetails['companyTransfer'] && ` | Transferência: ${formData.companyTransfer === 'sim' ? 'Sim' : 'Não'}`}
          </span>
        </div>
      )}

      {/* Combined Questions (Leadership & Recognition) */}
      {currentQuestion.type === 'combined-questions' && (
        <div className="space-y-8">
          {currentQuestion.subQuestions?.map((subQ: any, index: number) => (
            <div key={subQ.id} className="sub-questions">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{subQ.subtitle}</h3>
              <div className={`options-grid ${getColumnsClass(subQ.options?.length || 0)}`}>
                {subQ.options?.map((option: any) => (
                  <button
                    key={`${subQ.id}-${option.value}`}
                    onClick={(e) => {
                      setFormData({ ...formData, [subQ.id]: option.value });
                      
                      // Update score immediately
                      const newScore = calculateCurrentScore();
                      setCurrentScore(newScore);
                      
                      // Show explosive comment
                      const comment = getComment(subQ.id, option.value);
                      showCommentExplosion(e.currentTarget as HTMLElement, comment);
                      
                      if (option.hasInput) {
                        setShowInput(subQ.id);
                      }
                    }}
                    className={`option-button text-left ${
                      formData[subQ.id] === option.value ? 'selected' : ''
                    }`}
                    data-testid={`option-${subQ.id}-${option.value}`}
                  >
                    <div className="flex items-center">
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show Sub-Questions for Marriage Details */}
      {showSubQuestions === 'maritalStatus' && (
        <div className="details-container">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">👨‍👩‍👧‍👦 Detalhes da Família</h3>
          <form onSubmit={handleSubQuestionSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do(a) Cônjuge
              </label>
              <input
                type="text"
                name="spouseName"
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idade do(a) Cônjuge
              </label>
              <input
                type="number"
                name="spouseAge"
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível de Escolaridade do(a) Cônjuge
              </label>
              <select
                name="spouseEducation"
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              >
                <option value="">Selecione...</option>
                <option value="ensino-medio">Ensino Médio</option>
                <option value="graduacao">Graduação</option>
                <option value="pos">Pós-graduação</option>
                <option value="mestrado">Mestrado</option>
                <option value="doutorado">Doutorado</option>
              </select>
            </div>
            
            {formData.maritalStatus === 'casado-filhos' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade de Filhos
                  </label>
                  <input
                    type="number"
                    name="childrenCount"
                    min="1"
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idades dos Filhos (separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    name="childrenAges"
                    placeholder="Ex: 5, 8, 12"
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>
              </>
            )}
            
            <button
              type="submit"
              className="btn-primary px-6 py-3 rounded-lg"
            >
              Salvar Informações
            </button>
          </form>
        </div>
      )}

      {/* Show Input for Additional Details */}
      {showInput && (
        <div className="details-container">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📝 Nos conte mais detalhes:</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite aqui para adicionar mais informações..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              data-testid="input-details"
            />
            <button
              onClick={handleInputSubmit}
              className="btn-primary px-6 py-3 rounded-lg"
              data-testid="button-submit-details"
            >
              ✅ Salvar Detalhes
            </button>
          </div>
        </div>
      )}

      {currentQuestion.type === 'form-fields' && (
        <form onSubmit={handleFormSubmit} className="max-w-lg mx-auto space-y-4">
          {currentQuestion.fields?.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.id}
                value={formData[field.id] || ''}
                min={field.min}
                max={field.max}
                onChange={(e) => {
                  setFormData({ ...formData, [field.id]: e.target.value });
                  // Clear error when user starts typing
                  if (fieldErrors[field.id]) {
                    const newErrors = { ...fieldErrors };
                    delete newErrors[field.id];
                    setFieldErrors(newErrors);
                  }
                }}
                onBlur={(e) => {
                  // Validate field when user leaves it
                  const value = e.target.value;
                  const errors: Record<string, string> = { ...fieldErrors };
                  
                  if (field.required && !value) {
                    errors[field.id] = 'Campo obrigatório';
                  } else if (field.id === 'email' && value && !validateEmail(value)) {
                    errors[field.id] = 'E-mail inválido';
                  } else if (field.id === 'phone' && value && !validatePhone(value)) {
                    errors[field.id] = 'Telefone deve ter 13 dígitos (ex: 5581982917181)';
                  } else if (field.id === 'graduationYear' && value && !validateGraduationYear(value)) {
                    errors[field.id] = 'Ano de formação inválido (1950-2025)';
                  } else if (field.id === 'birthDate' && value && !validateBirthDate(value)) {
                    errors[field.id] = 'Data de nascimento inválida (idade entre 16-100 anos)';
                  } else {
                    delete errors[field.id];
                  }
                  
                  setFieldErrors(errors);
                }}
                required={field.required}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
                  fieldErrors[field.id] ? 'border-red-500 bg-red-50' : ''
                }`}
                data-testid={`input-${field.id}`}
              />
              {fieldErrors[field.id] && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <i className="fas fa-exclamation-triangle mr-1"></i>
                  {fieldErrors[field.id]}
                </p>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="btn-primary w-full px-6 py-3 rounded-lg mt-6"
          >
            Avançar
          </button>
        </form>
      )}
      
      {/* Navigation Buttons - only show if not form-fields type */}
      {currentQuestion.type !== 'form-fields' && (
        <div className="navigation-buttons">
          <button
            onClick={previousQuestion}
            disabled={currentStep === 0}
            className="btn-nav patriotic"
            data-testid="button-previous"
          >
            <i className="fas fa-arrow-left"></i>
            Voltar
          </button>
          
          <div className="text-center">
            <span className="text-sm text-gray-600 font-medium">
              {currentStep + 1} de {questions.length}
            </span>
          </div>
          
          <button
            onClick={nextQuestion}
            disabled={!isCurrentQuestionAnswered()}
            className="btn-nav patriotic"
            data-testid="button-next"
          >
            Avançar
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      )}

      {/* Explosive Comment Popup */}
      {activeComment && (
        <div 
          className="comment-popup"
          style={{
            left: `${activeComment.x - 150}px`,
            top: `${activeComment.y - 60}px`
          }}
        >
          {activeComment.text}
        </div>
      )}
    </div>
  );
}