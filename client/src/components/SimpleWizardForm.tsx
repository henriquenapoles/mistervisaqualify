import React, { useState, useRef, useEffect } from "react";
import { LeadFormData, Question } from "../types/form";
import { calculateScore } from "../utils/scoring";
import { getVisaRecommendations, getScoreMessage } from "../utils/visa-recommendations";
import { useToast } from "@/hooks/use-toast";
import { SimpleProgress } from "./ui/simple-progress";

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
      { id: 'graduationYear', label: 'Ano de formação', type: 'number', required: true },
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
    id: 'familyInUS',
    title: '👨‍👩‍👧 Bloco 7 - Vínculos com os EUA',
    subtitle: 'Você tem familiares diretos nos EUA com Green Card ou cidadania?',
    type: 'single-choice',
    icon: 'fas fa-route',
    options: [
      { value: 'sim', label: 'Sim', score: 10 },
      { value: 'nao', label: 'Não', score: 0 }
    ]
  },
  {
    id: 'jobOffer',
    title: '📑 Oferta de Emprego',
    subtitle: 'Já tem oferta de emprego de empresa nos EUA?',
    type: 'single-choice',
    icon: 'fas fa-file-contract',
    options: [
      { value: 'sim', label: 'Sim', score: 20 },
      { value: 'nao', label: 'Não', score: 0 }
    ]
  },
  {
    id: 'companyTransfer',
    title: '🏢 Transferência',
    subtitle: 'Trabalha em empresa com filial nos EUA (possibilidade de transferência)?',
    type: 'single-choice',
    icon: 'fas fa-building',
    options: [
      { value: 'sim', label: 'Sim', score: 10 },
      { value: 'nao', label: 'Não', score: 0 }
    ]
  }
];

export function SimpleWizardForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<LeadFormData>({});
  const [showResults, setShowResults] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showInput, setShowInput] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [showSubQuestions, setShowSubQuestions] = useState<string | null>(null);
  const [subAnswers, setSubAnswers] = useState<Record<string, any>>({});
  const [activeComment, setActiveComment] = useState<{text: string, x: number, y: number} | null>(null);
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
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowSubQuestions(null);
    } else {
      showResultsScreen();
    }
  };

  const previousQuestion = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowSubQuestions(null);
    }
  };

  const showCommentExplosion = (buttonElement: HTMLElement, comment: string) => {
    const rect = buttonElement.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;
    
    setActiveComment({ text: comment, x, y });
    
    // Remove comment after animation
    setTimeout(() => {
      setActiveComment(null);
    }, 2000);
  };

  const getComment = (questionId: string, value: string): string => {
    const comments: Record<string, Record<string, string>> = {
      objective: {
        trabalho: "Excelente! Os EUA precisam de profissionais qualificados!",
        negocios: "Ótima escolha! Empreendedores são bem-vindos nos EUA!",
        estudo: "Perfeito! Educação de qualidade abre muitas portas!",
        familia: "Maravilhoso! Reunificação familiar é prioridade!",
        investimento: "Fantástico! Investidores têm caminhos especiais!"
      },
      capital: {
        'menos-20k': "Entendi. Há opções de visto mesmo com menos capital!",
        '20k-500k': "Bom! Esse valor já abre algumas possibilidades!",
        '500k-1m': "Excelente! Com esse capital há várias opções de visto!",
        'mais-1m': "Perfeito! Você tem acesso aos melhores programas!"
      },
      maritalStatus: {
        solteiro: "Ok! Processo mais simples para solteiros!",
        casado: "Ótimo! Cônjuge pode acompanhar no processo!",
        'casado-filhos': "Perfeito! Família toda pode imigrar junta!"
      },
      education: {
        'ensino-medio': "Entendido! Há caminhos mesmo com ensino médio!",
        graduacao: "Ótimo! Graduação é muito valorizada nos EUA!",
        pos: "Excelente! Pós-graduação aumenta suas chances!",
        mestrado: "Fantástico! Mestrado é altamente valorizado!",
        doutorado: "Perfeito! PhD abre muitas portas especiais!"
      },
      englishLevel: {
        basico: "Vamos trabalhar no inglês! É fundamental!",
        intermediario: "Bom! Continue praticando o inglês!",
        avancado: "Excelente! Inglês avançado é um diferencial!",
        fluente: "Perfeito! Fluência é uma grande vantagem!"
      }
    };
    
    return comments[questionId]?.[value] || "Ótima escolha! Vamos continuar!";
  };

  const handleOptionSelect = (value: string, hasInput?: boolean, hasForm?: boolean, event?: React.MouseEvent) => {
    const newFormData = { ...formData, [currentQuestion.id]: value };
    setFormData(newFormData);
    
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
    setShowSubQuestions(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formDataObj = new FormData(form);
    const newData: Record<string, any> = {};
    let valid = true;
    
    currentQuestion.fields?.forEach(field => {
      const value = formDataObj.get(field.id) as string;
      if (field.required && !value) {
        valid = false;
        toast({
          variant: "destructive",
          title: "Campo obrigatório",
          description: `Por favor, preencha o campo ${field.label}`,
        });
      } else {
        newData[field.id] = field.type === 'number' ? parseInt(value) : value;
      }
    });

    if (valid) {
      setFormData({ ...formData, ...newData });
      
      setTimeout(() => {
        if (currentStep < questions.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          showResultsScreen();
        }
      }, 500);
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
        fullName: formData.fullName || '',
        email: formData.email || '',
        phone: formData.phone || '',
        birthDate: formData.birthDate,
        country: 'brasil',
        objective: formData.objective,
        capital: formData.capital,
        maritalStatus: 'solteiro',
        citizenship: 'nao',
        education: formData.education,
        graduationYear: null,
        institution: null,
        fieldOfStudy: null,
        experience: formData.experience,
        currentPosition: null,
        hasLeadership: 'nao',
        hasRecognition: 'nao',
        familyInUS: formData.familyInUS,
        jobOffer: formData.jobOffer,
        companyTransfer: formData.companyTransfer,
        howFoundUs: formData.howFoundUs,
        totalScore: score,
        formData: formData,
        visaRecommendations: visaRecommendations
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
            
            <div className="mt-6 p-4 bg-gray-200 rounded-lg">
              <p className="text-sm text-gray-700">{scoreMessage}</p>
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
              Um consultor Wizard Emigration entrará em contato em breve 
              com as melhores opções para o seu perfil.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="wizard-container rounded-lg shadow-lg p-8 relative">
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
        <div className="sub-questions">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Detalhes do Cônjuge</h3>
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
        <div className="sub-questions">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Nos conte mais detalhes:</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite aqui..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              data-testid="input-details"
            />
            <button
              onClick={handleInputSubmit}
              className="btn-primary px-6 py-3 rounded-lg"
              data-testid="button-submit-details"
            >
              Salvar Detalhes
            </button>
          </div>
        </div>
      )}

      {currentQuestion.type === 'form-fields' && (
        <div className="max-w-lg mx-auto space-y-4">
          {currentQuestion.fields?.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
              </label>
              <input
                type={field.type}
                value={formData[field.id] || ''}
                onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                required={field.required}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                data-testid={`input-${field.id}`}
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Navigation Buttons */}
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