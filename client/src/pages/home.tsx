import React, { useState } from "react";
import { SimpleWizardForm } from "@/components/SimpleWizardForm";

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  const startJourney = () => {
    setShowForm(true);
  };

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <SimpleWizardForm />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="wizard-container rounded-lg shadow-lg p-8" data-testid="welcome-screen">
        
        {/* Government Header */}
        <div className="gov-header">
          <div className="gov-seal mx-auto mb-3">
            🦅
          </div>
          <h1 className="text-2xl font-bold mb-1">U.S. IMMIGRATION ASSESSMENT</h1>
          <p className="text-sm opacity-90">Official Eligibility Evaluation System</p>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Wizard Emigration Services
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Descubra Suas Oportunidades de Imigração para os Estados Unidos
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8 text-left">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fas fa-info-circle text-blue-400 text-xl"></i>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Avaliação Oficial Baseada em Critérios do USCIS
                </h3>
                <ul className="text-blue-700 space-y-2">
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-600 mr-2"></i>
                    Análise completa do seu perfil profissional e educacional
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-600 mr-2"></i>
                    Pontuação baseada em critérios oficiais de imigração
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-600 mr-2"></i>
                    Recomendações personalizadas de categorias de visto
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg border">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-user-tie text-white text-xl"></i>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Perfil Profissional</h4>
              <p className="text-sm text-gray-600">Avaliação da experiência e qualificações</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg border">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-graduation-cap text-white text-xl"></i>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Educação</h4>
              <p className="text-sm text-gray-600">Análise do histórico educacional</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg border">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-language text-white text-xl"></i>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Idiomas</h4>
              <p className="text-sm text-gray-600">Proficiência em inglês e outros idiomas</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg border">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-chart-line text-white text-xl"></i>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Resultado</h4>
              <p className="text-sm text-gray-600">Pontuação e recomendações</p>
            </div>
          </div>
          
          <button
            onClick={startJourney}
            className="btn-primary text-lg font-bold px-12 py-4 rounded-lg"
            data-testid="button-start-journey"
          >
            <i className="fas fa-flag-usa mr-2"></i>
            INICIAR AVALIAÇÃO OFICIAL
          </button>
          
          <p className="text-sm text-gray-500 mt-4">
            ⏱️ Tempo estimado: 8-10 minutos | 📊 Baseado em critérios oficiais do USCIS
          </p>
        </div>
      </div>
    </div>
  );
}