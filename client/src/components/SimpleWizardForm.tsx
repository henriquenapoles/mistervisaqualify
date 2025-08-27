import React, { useState } from "react";
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
    id: 'hasLeadership',
    title: '👔 Liderança',
    subtitle: 'Já exerceu cargos de liderança/gerência?',
    type: 'single-choice',
    icon: 'fas fa-users-cog',
    options: [
      { value: 'sim', label: 'Sim', score: 5, hasInput: true },
      { value: 'nao', label: 'Não', score: 0 }
    ]
  },
  {
    id: 'hasRecognition',
    title: '🏆 Reconhecimento',
    subtitle: 'Já teve reconhecimento nacional/internacional (prêmios, publicações, etc.)?',
    type: 'single-choice',
    icon: 'fas fa-trophy',
    options: [
      { value: 'sim', label: 'Sim', score: 25, hasInput: true },
      { value: 'nao', label: 'Não', score: 0 }
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
  const [showComment, setShowComment] = useState<string | null>(null);
  const [showInput, setShowInput] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const { toast } = useToast();

  const currentQuestion = questions[currentStep];

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setShowComment(null);
    setShowInput(null);
  };

  const handleOptionSelect = (value: string, hasInput?: boolean) => {
    const newFormData = { ...formData, [currentQuestion.id]: value };
    setFormData(newFormData);
    
    // Mostrar comentário
    const comment = getComment(currentQuestion.id, value);
    setShowComment(comment);
    
    if (hasInput) {
      setShowInput(currentQuestion.id);
    } else {
      setTimeout(() => {
        if (currentStep < questions.length - 1) {
          setCurrentStep(currentStep + 1);
          setShowComment(null);
        } else {
          showResultsScreen();
        }
      }, 2000);
    }
  };

  const handleInputSubmit = () => {
    if (showInput && inputValue.trim()) {
      setFormData({ ...formData, [`${showInput}Detail`]: inputValue });
      setShowInput(null);
      setInputValue('');
      
      setTimeout(() => {
        if (currentStep < questions.length - 1) {
          setCurrentStep(currentStep + 1);
          setShowComment(null);
        } else {
          showResultsScreen();
        }
      }, 500);
    }
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
    <div className="wizard-container rounded-lg shadow-lg p-8">
      <SimpleProgress currentStep={currentStep} totalSteps={questions.length} />
      
      {/* Navigation Bar */}
      {currentStep > 0 && (
        <div className="mb-6">
          <button
            onClick={() => goToStep(currentStep - 1)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            data-testid="button-back"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Voltar
          </button>
        </div>
      )}
      
      <div className="text-center mb-8 relative">
        <div className="eagle-avatar mb-4"></div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-red-600 bg-clip-text text-transparent mb-2">
          {currentQuestion.title}
        </h2>
        <p className="text-xl text-blue-700 font-medium">{currentQuestion.subtitle}</p>
        <div className="absolute top-0 right-0 text-2xl animate-pulse">🇺🇸</div>
      </div>

      {currentQuestion.type === 'single-choice' && (
        <div className="space-y-4 max-w-md mx-auto">
          {currentQuestion.options?.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionSelect(option.value, option.hasInput)}
              className="option-button w-full p-4 text-left border rounded-lg hover:bg-gray-50"
              data-testid={`option-${option.value}`}
            >
              <div className="flex items-center">
                {option.icon && <i className={`${option.icon} mr-3 text-blue-600`}></i>}
                <span>{option.label}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Show Comment with Patriotic Bubble */}
      {showComment && (
        <div className="comment-bubble max-w-lg mx-auto mb-6" data-testid="comment-bubble">
          <div className="flex items-start">
            <div className="text-2xl mr-3">🦅</div>
            <p className="text-white font-medium">{showComment}</p>
          </div>
        </div>
      )}

      {/* Show Input for Additional Details */}
      {showInput && (
        <div className="max-w-md mx-auto mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <label className="block text-sm font-medium text-blue-700 mb-2">
            Nos conte mais detalhes:
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digite aqui..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
            data-testid="input-details"
          />
          <button
            onClick={handleInputSubmit}
            className="btn-primary mt-3 px-4 py-2 rounded-lg"
            data-testid="button-submit-details"
          >
            Continuar →
          </button>
        </div>
      )}

      {currentQuestion.type === 'form-fields' && (
        <form onSubmit={handleFormSubmit} className="max-w-md mx-auto space-y-4">
          {currentQuestion.fields?.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.id}
                required={field.required}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                data-testid={`input-${field.id}`}
              />
            </div>
          ))}
          <button
            type="submit"
            className="btn-primary w-full text-lg font-bold py-3 rounded-lg"
            data-testid="button-continue"
          >
            Continuar →
          </button>
        </form>
      )}
    </div>
  );
}