import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProgressBar } from "./ui/progress-bar";
import { LeadFormData, Question } from "../types/form";
import { calculateScore } from "../utils/scoring";
import { getVisaRecommendations, getScoreMessage } from "../utils/visa-recommendations";
import { useToast } from "@/hooks/use-toast";

// Question definitions
const questions: Question[] = [
  {
    id: 'objective',
    title: 'Sua Missão Principal',
    subtitle: 'Qual o seu objetivo mais importante nos EUA?',
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
    title: 'Sua Capacidade de Investimento',
    subtitle: 'Perfeito! E qual o seu Capital disponível para Investir (USD)?',
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
    title: 'Revelando seu Perfil',
    subtitle: 'Qual o seu nome completo e email?',
    type: 'form-fields',
    icon: 'fas fa-user',
    fields: [
      { id: 'fullName', label: 'Nome Completo', type: 'text', required: true },
      { id: 'email', label: 'Email', type: 'email', required: true }
    ]
  },
  {
    id: 'contact-info',
    title: 'Onde podemos falar com você?',
    subtitle: 'Vamos precisar dessas informações para entrar em contato',
    type: 'form-fields',
    icon: 'fas fa-phone',
    fields: [
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
    id: 'marital-status',
    title: 'Montando seu Time',
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
    title: 'Sobre sua Cidadania',
    subtitle: 'Você possui outra cidadania além da brasileira?',
    type: 'single-choice',
    icon: 'fas fa-passport',
    options: [
      { value: 'sim', label: 'Sim', score: 5, hasInput: true },
      { value: 'nao', label: 'Não', score: 0 }
    ]
  },
  {
    id: 'education',
    title: 'Suas Habilidades em Ação',
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
    title: 'Detalhes da sua Formação',
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
    id: 'english-level',
    title: 'Seu Nível de Inglês',
    subtitle: 'Qual o seu nível de proficiência em inglês?',
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
    title: 'Suas Ferramentas de Imigração',
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
    id: 'current-position',
    title: 'Seu Cargo Atual',
    subtitle: 'Qual o seu cargo atual ou mais recente?',
    type: 'form-fields',
    icon: 'fas fa-id-badge',
    fields: [
      { id: 'currentPosition', label: 'Cargo atual ou mais recente', type: 'text', required: true }
    ]
  },
  {
    id: 'leadership',
    title: 'Liderança e Reconhecimento',
    subtitle: 'Sobre liderança e reconhecimento...',
    type: 'multiple-choice',
    icon: 'fas fa-trophy',
    questions: [
      {
        id: 'hasLeadership',
        label: 'Já exerceu cargos de liderança/gerência?',
        options: [
          { value: 'sim', label: 'Sim', score: 5, hasInput: true },
          { value: 'nao', label: 'Não', score: 0 }
        ]
      },
      {
        id: 'hasRecognition',
        label: 'Já teve reconhecimento nacional/internacional?',
        options: [
          { value: 'sim', label: 'Sim', score: 25, hasInput: true },
          { value: 'nao', label: 'Não', score: 0 }
        ]
      }
    ]
  },
  {
    id: 'us-connections',
    title: 'Seu Caminho para o Green Card',
    subtitle: 'Seus vínculos com os EUA',
    type: 'multiple-choice',
    icon: 'fas fa-route',
    questions: [
      {
        id: 'familyInUS',
        label: 'Você tem familiares diretos nos EUA com Green Card ou cidadania?',
        options: [
          { value: 'sim', label: 'Sim', score: 10 },
          { value: 'nao', label: 'Não', score: 0 }
        ]
      },
      {
        id: 'jobOffer',
        label: 'Você já tem uma oferta de emprego nos EUA?',
        options: [
          { value: 'sim', label: 'Sim', score: 20 },
          { value: 'nao', label: 'Não', score: 0 }
        ]
      },
      {
        id: 'companyTransfer',
        label: 'Sua empresa tem filial nos EUA e você poderia ser transferido?',
        options: [
          { value: 'sim', label: 'Sim', score: 10 },
          { value: 'nao', label: 'Não', score: 0 }
        ]
      }
    ]
  },
  {
    id: 'how-found-us',
    title: 'Como chegou até nós?',
    subtitle: 'Esta informação nos ajuda a melhorar nossos serviços',
    type: 'single-choice',
    icon: 'fas fa-compass',
    options: [
      { value: 'instagram', label: 'Instagram', icon: 'fab fa-instagram', score: 0 },
      { value: 'google', label: 'Google/Busca', icon: 'fab fa-google', score: 0 },
      { value: 'linkedin', label: 'LinkedIn', icon: 'fab fa-linkedin', score: 0 },
      { value: 'facebook', label: 'Facebook', icon: 'fab fa-facebook', score: 0 },
      { value: 'youtube', label: 'YouTube', icon: 'fab fa-youtube', score: 0 },
      { value: 'whatsapp', label: 'WhatsApp', icon: 'fab fa-whatsapp', score: 0 },
      { value: 'site', label: 'Site da empresa', icon: 'fas fa-globe', score: 0 },
      { value: 'indicacao', label: 'Indicação', icon: 'fas fa-handshake', score: 0 },
      { value: 'eventos', label: 'Eventos', icon: 'fas fa-calendar', score: 0 },
      { value: 'outros', label: 'Outros', icon: 'fas fa-ellipsis-h', score: 0, hasInput: true }
    ]
  }
];

export function WizardForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<LeadFormData>({});
  const [showInput, setShowInput] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const currentQuestion = questions[currentStep];

  const handleOptionSelect = (questionId: string, value: string, hasInput?: boolean) => {
    setSelectedOptions({ ...selectedOptions, [questionId]: value });
    setFormData({ ...formData, [questionId]: value });

    if (hasInput) {
      setShowInput(questionId);
    } else {
      setTimeout(() => {
        nextStep();
      }, 800);
    }
  };

  const handleInputSubmit = (questionId: string) => {
    setFormData({ ...formData, [`${questionId}Detail`]: inputValue });
    setShowInput(null);
    setInputValue('');
    nextStep();
  };

  const handleFormSubmit = () => {
    const fields = currentQuestion.fields || [];
    const formElement = document.getElementById('wizard-form') as HTMLFormElement;
    const formDataObj = new FormData(formElement);
    
    let valid = true;
    const newData: Record<string, any> = {};

    fields.forEach(field => {
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
      nextStep();
    }
  };

  const handleMultipleChoiceSelect = (questionId: string, subQuestionId: string, value: string) => {
    const updatedFormData = { ...formData };
    updatedFormData[subQuestionId] = value;
    setFormData(updatedFormData);
    setSelectedOptions({ ...selectedOptions, [`${questionId}-${subQuestionId}`]: value });
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      showResultsScreen();
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
        country: formData.country,
        objective: formData.objective,
        capital: formData.capital,
        maritalStatus: formData.maritalStatus,
        citizenship: formData.citizenship,
        education: formData.education,
        graduationYear: formData.graduationYear,
        institution: formData.institution,
        fieldOfStudy: formData.fieldOfStudy,
        experience: formData.experience,
        currentPosition: formData.currentPosition,
        hasLeadership: formData.hasLeadership,
        hasRecognition: formData.hasRecognition,
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

  const restartForm = () => {
    setCurrentStep(0);
    setFormData({});
    setShowResults(false);
    setTotalScore(0);
    setSelectedOptions({});
    setShowInput(null);
    setInputValue('');
  };

  if (showResults) {
    const visaRecommendations = getVisaRecommendations(totalScore);
    const scoreMessage = getScoreMessage(totalScore);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="wizard-container rounded-2xl shadow-2xl p-8 text-center"
        data-testid="results-screen"
      >
        <div className="celebration">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-trophy text-white text-4xl"></i>
            </div>
            
            <img 
              src="https://images.unsplash.com/photo-1541336032412-2048a678540d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=200" 
              alt="Statue of Liberty and NYC skyline" 
              className="rounded-lg mb-6 w-full h-32 object-cover"
            />
            
            <h2 className="text-4xl font-bold text-primary mb-4">
              🎉 Seu Oráculo Pessoal
            </h2>
            
            <div className="bg-gradient-to-r from-blue-800 to-red-600 text-white p-6 rounded-xl mb-8">
              <p className="text-xl mb-2">Com base nas suas respostas, sua pontuação é</p>
              <p className="text-5xl font-bold" data-testid="total-score">{totalScore} pontos!</p>
            </div>
          </div>
          
          <div className="bg-secondary p-6 rounded-xl mb-8">
            <h3 className="text-2xl font-bold text-primary mb-6">
              🎯 Com esta pontuação, seu perfil é promissor para os seguintes vistos:
            </h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              {visaRecommendations.map((visa, index) => (
                <div key={index} className="bg-card p-6 rounded-lg border border-border">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                      <i className={`${visa.icon} text-white text-xl`}></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-primary">{visa.name}</h4>
                      <p className="text-sm text-muted-foreground">{visa.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">{scoreMessage}</p>
            </div>
          </div>
          
          <div className="bg-primary text-primary-foreground p-8 rounded-xl mb-8">
            <h3 className="text-2xl font-bold mb-4">🙏 Obrigado(a) por concluir sua jornada!</h3>
            <p className="text-lg leading-relaxed">
              Sua pontuação é um excelente indicativo. Um de nossos consultores especializados da 
              <strong> Wizard Emigration</strong> entrará em contato em breve para uma análise aprofundada 
              do seu perfil e para te guiar nos próximos passos.
            </p>
            <p className="mt-4 text-yellow-300">
              📧 Fique de olho no seu email e WhatsApp! 📱
            </p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={submitLead} 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
              data-testid="button-submit-lead"
            >
              <i className="fas fa-check-circle mr-2"></i>
              {isSubmitting ? 'Enviando...' : 'Finalizar Cadastro'}
            </Button>
            
            <Button 
              onClick={restartForm}
              variant="secondary"
              className="px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              data-testid="button-restart-form"
            >
              <i className="fas fa-redo mr-2"></i>
              Refazer Questionário
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="wizard-container rounded-2xl shadow-2xl p-8"
      data-testid="wizard-form-container"
    >
      <ProgressBar currentStep={currentStep} totalSteps={questions.length} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-800 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className={`${currentQuestion.icon} text-white text-2xl`}></i>
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2" data-testid="question-title">
              {currentQuestion.title}
            </h2>
            <p className="text-muted-foreground" data-testid="question-subtitle">
              {currentQuestion.subtitle}
            </p>
          </div>

          {currentQuestion.type === 'single-choice' && (
            <div className="space-y-3 mb-8">
              {currentQuestion.options?.map((option, index) => (
                <motion.button
                  key={option.value}
                  onClick={() => handleOptionSelect(currentQuestion.id, option.value, option.hasInput)}
                  className={`option-button w-full p-4 text-left rounded-xl border-2 border-border hover:border-primary bg-card flex items-center space-x-4 ${
                    selectedOptions[currentQuestion.id] === option.value ? 'selected' : ''
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  data-testid={`option-${option.value}`}
                >
                  {option.icon && <i className={`${option.icon} text-primary text-xl`}></i>}
                  <span className="font-medium">{option.label}</span>
                </motion.button>
              ))}
              
              {showInput === currentQuestion.id && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 bg-secondary rounded-lg"
                >
                  <Label className="block text-sm font-medium text-foreground mb-2">
                    Por favor, especifique:
                  </Label>
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Digite aqui..."
                    className="mb-3"
                    data-testid="input-specify"
                  />
                  <Button 
                    onClick={() => handleInputSubmit(currentQuestion.id)}
                    className="bg-primary text-primary-foreground"
                    data-testid="button-continue-input"
                  >
                    Continuar
                  </Button>
                </motion.div>
              )}
            </div>
          )}

          {currentQuestion.type === 'form-fields' && (
            <form id="wizard-form" className="space-y-4 mb-8">
              {currentQuestion.fields?.map((field) => (
                <div key={field.id}>
                  <Label className="block text-sm font-medium text-foreground mb-2">
                    {field.label}
                  </Label>
                  {field.type === 'select' ? (
                    <Select name={field.id} required={field.required}>
                      <SelectTrigger data-testid={`select-${field.id}`}>
                        <SelectValue placeholder="Selecione uma opção" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === 'textarea' ? (
                    <Textarea
                      id={field.id}
                      name={field.id}
                      required={field.required}
                      className="w-full"
                      data-testid={`textarea-${field.id}`}
                    />
                  ) : (
                    <Input
                      type={field.type}
                      id={field.id}
                      name={field.id}
                      required={field.required}
                      className="w-full"
                      data-testid={`input-${field.id}`}
                    />
                  )}
                </div>
              ))}
              
              <div className="flex justify-center mt-8">
                <Button 
                  type="button"
                  onClick={handleFormSubmit}
                  className="bg-gradient-to-r from-blue-800 to-red-600 hover:from-blue-900 hover:to-red-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
                  data-testid="button-continue-form"
                >
                  Continuar <i className="fas fa-arrow-right ml-2"></i>
                </Button>
              </div>
            </form>
          )}

          {currentQuestion.type === 'multiple-choice' && (
            <>
              {currentQuestion.questions?.map((subQuestion, subIndex) => (
                <div key={subQuestion.id} className="mb-6 p-6 bg-secondary rounded-xl">
                  <h3 className="font-semibold text-foreground mb-4">{subQuestion.label}</h3>
                  <div className="space-y-2">
                    {subQuestion.options.map(option => (
                      <motion.button
                        key={option.value}
                        onClick={() => handleMultipleChoiceSelect(currentQuestion.id, subQuestion.id, option.value)}
                        className={`option-button w-full p-3 text-left rounded-lg border border-border hover:border-primary bg-card ${
                          selectedOptions[`${currentQuestion.id}-${subQuestion.id}`] === option.value ? 'selected' : ''
                        }`}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        data-testid={`option-${subQuestion.id}-${option.value}`}
                      >
                        {option.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-center mt-8">
                <Button 
                  onClick={nextStep}
                  className="bg-gradient-to-r from-blue-800 to-red-600 hover:from-blue-900 hover:to-red-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
                  data-testid="button-continue-multiple"
                >
                  Continuar <i className="fas fa-arrow-right ml-2"></i>
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
