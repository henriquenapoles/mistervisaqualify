import React, { useState } from "react";
import { LeadFormData, Question } from "../types/form";
import { calculateScore } from "../utils/scoring";
import { getVisaRecommendations, getScoreMessage } from "../utils/visa-recommendations";
import { useToast } from "@/hooks/use-toast";
import { SimpleProgress } from "./ui/simple-progress";

// Question definitions - simplified
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
    subtitle: 'Qual o seu Capital disponível para Investir (USD)?',
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
    subtitle: 'Suas informações pessoais',
    type: 'form-fields',
    icon: 'fas fa-user',
    fields: [
      { id: 'fullName', label: 'Nome Completo', type: 'text', required: true },
      { id: 'email', label: 'Email', type: 'email', required: true },
      { id: 'phone', label: 'Telefone (com DDD)', type: 'tel', required: true },
      { id: 'birthDate', label: 'Data de Nascimento', type: 'date', required: true }
    ]
  },
  {
    id: 'education',
    title: 'Suas Habilidades',
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
    id: 'experience',
    title: 'Experiência Profissional',
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
    id: 'us-connections',
    title: 'Vínculos com os EUA',
    subtitle: 'Você tem familiares diretos nos EUA com Green Card ou cidadania?',
    type: 'single-choice',
    icon: 'fas fa-route',
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
  const { toast } = useToast();

  const currentQuestion = questions[currentStep];

  const handleOptionSelect = (value: string) => {
    const newFormData = { ...formData, [currentQuestion.id]: value };
    setFormData(newFormData);
    
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        showResultsScreen();
      }
    }, 500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formDataObj = new FormData(form);
    const newData: Record<string, any> = {};
    
    currentQuestion.fields?.forEach(field => {
      const value = formDataObj.get(field.id) as string;
      if (field.required && !value) {
        toast({
          variant: "destructive",
          title: "Campo obrigatório",
          description: `Por favor, preencha o campo ${field.label}`,
        });
        return;
      }
      newData[field.id] = value;
    });

    setFormData({ ...formData, ...newData });
    
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
        familyInUS: formData['us-connections'],
        jobOffer: 'nao',
        companyTransfer: 'nao',
        howFoundUs: 'site',
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
      
      <div className="text-center mb-8">
        <div className="mb-4">
          <i className={`${currentQuestion.icon} text-blue-600 text-4xl mb-4`}></i>
        </div>
        <h2 className="text-3xl font-bold text-blue-600 mb-2">{currentQuestion.title}</h2>
        <p className="text-lg text-gray-600">{currentQuestion.subtitle}</p>
      </div>

      {currentQuestion.type === 'single-choice' && (
        <div className="space-y-4 max-w-md mx-auto">
          {currentQuestion.options?.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionSelect(option.value)}
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