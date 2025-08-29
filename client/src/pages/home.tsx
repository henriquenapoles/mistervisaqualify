import React, { useState } from "react";
import { SimpleWizardForm } from "@/components/SimpleWizardForm";
import logoMisterVisa from "@assets/Logo2_1756485333265.png";

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  const startJourney = () => {
    setShowForm(true);
  };

  // Generate random stars
  const generateStars = () => {
    const stars = [];
    for (let i = 0; i < 15; i++) {
      stars.push(
        <div 
          key={i}
          className="star"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        />
      );
    }
    return stars;
  };

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-4 max-w-4xl relative">
        {/* Animated Stars */}
        {generateStars()}
        
        <div className="relative z-20">
          <SimpleWizardForm />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-2 max-w-4xl relative">
      {/* Animated Stars */}
      {generateStars()}
      

      <div className="wizard-container rounded-lg shadow-lg p-4" data-testid="welcome-screen">
        
        {/* Brand Header */}
        <div className="brand-header-home">
          <img src={logoMisterVisa} alt="Mister Visa" className="mister-visa-logo-home" />
          <p>Consultoria Especializada em Vistos e Imigração</p>
        </div>
        
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{color: '#1a365d'}}>
            Avaliação Gratuita de Elegibilidade
          </h2>
          <p className="text-base text-gray-600 mb-3">
            Descubra Suas Oportunidades de Imigração para os Estados Unidos
          </p>
          
          <div className="border-l-4 p-3 mb-4 text-left rounded-lg" style={{background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', borderColor: '#667eea'}}>
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fas fa-star text-purple-500 text-base"></i>
              </div>
              <div className="ml-2">
                <h3 className="text-base font-semibold mb-1" style={{color: '#1a365d'}}>
                  Consultoria Especializada em Imigração Americana
                </h3>
                <ul className="space-y-0.5" style={{color: '#2d3748'}}>
                  <li className="flex items-center text-xs">
                    <i className="fas fa-check-circle text-green-500 mr-2 text-xs"></i>
                    Análise personalizada do seu perfil migratório
                  </li>
                  <li className="flex items-center text-xs">
                    <i className="fas fa-check-circle text-green-500 mr-2 text-xs"></i>
                    Estratégias baseadas em nossa experiência de mercado
                  </li>
                  <li className="flex items-center text-xs">
                    <i className="fas fa-check-circle text-green-500 mr-2 text-xs"></i>
                    Acompanhamento completo durante todo o processo
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Process Steps */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            <div className="text-center p-2 bg-gray-50 rounded-lg border">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-1">
                <i className="fas fa-user-tie text-white text-sm"></i>
              </div>
              <h4 className="font-semibold text-gray-800 mb-0.5 text-xs">Perfil Profissional</h4>
              <p className="text-xs text-gray-600">Experiência</p>
            </div>
            
            <div className="text-center p-2 bg-gray-50 rounded-lg border">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-1">
                <i className="fas fa-graduation-cap text-white text-sm"></i>
              </div>
              <h4 className="font-semibold text-gray-800 mb-0.5 text-xs">Educação</h4>
              <p className="text-xs text-gray-600">Histórico</p>
            </div>
            
            <div className="text-center p-2 bg-gray-50 rounded-lg border">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-1">
                <i className="fas fa-language text-white text-sm"></i>
              </div>
              <h4 className="font-semibold text-gray-800 mb-0.5 text-xs">Idiomas</h4>
              <p className="text-xs text-gray-600">Inglês</p>
            </div>
            
            <div className="text-center p-2 bg-gray-50 rounded-lg border">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-1">
                <i className="fas fa-chart-line text-white text-sm"></i>
              </div>
              <h4 className="font-semibold text-gray-800 mb-0.5 text-xs">Resultado</h4>
              <p className="text-xs text-gray-600">Pontuação</p>
            </div>
          </div>
          
          <button
            onClick={startJourney}
            className="btn-primary text-base font-bold px-8 py-3 rounded-lg"
            data-testid="button-start-journey"
          >
            <i className="fas fa-rocket mr-2"></i>
            INICIAR MINHA AVALIAÇÃO GRATUITA
          </button>
          
          <p className="text-xs text-gray-600 mt-3 font-medium">
            ⏱️ Tempo: 8-10 minutos | 🎯 100% Personalizado | 🔒 Totalmente Confidencial
          </p>
        </div>
      </div>
    </div>
  );
}