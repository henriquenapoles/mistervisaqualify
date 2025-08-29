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
        
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-3" style={{color: '#1a365d'}}>
            Avaliação Gratuita de Elegibilidade
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Descubra Suas Oportunidades de Imigração para os Estados Unidos
          </p>
          
          <div className="border-l-4 p-4 mb-6 text-left rounded-lg" style={{background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', borderColor: '#667eea'}}>
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fas fa-star text-purple-500 text-lg"></i>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold mb-2" style={{color: '#1a365d'}}>
                  Consultoria Especializada em Imigração Americana
                </h3>
                <ul className="space-y-1" style={{color: '#2d3748'}}>
                  <li className="flex items-center text-sm">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    Análise personalizada do seu perfil migratório
                  </li>
                  <li className="flex items-center text-sm">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    Estratégias baseadas em nossa experiência de mercado
                  </li>
                  <li className="flex items-center text-sm">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    Acompanhamento completo durante todo o processo
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Process Steps */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg border">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <i className="fas fa-user-tie text-white text-lg"></i>
              </div>
              <h4 className="font-semibold text-gray-800 mb-1 text-sm">Perfil Profissional</h4>
              <p className="text-xs text-gray-600">Experiência e qualificações</p>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg border">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <i className="fas fa-graduation-cap text-white text-lg"></i>
              </div>
              <h4 className="font-semibold text-gray-800 mb-1 text-sm">Educação</h4>
              <p className="text-xs text-gray-600">Histórico educacional</p>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg border">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <i className="fas fa-language text-white text-lg"></i>
              </div>
              <h4 className="font-semibold text-gray-800 mb-1 text-sm">Idiomas</h4>
              <p className="text-xs text-gray-600">Proficiência em inglês</p>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg border">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <i className="fas fa-chart-line text-white text-lg"></i>
              </div>
              <h4 className="font-semibold text-gray-800 mb-1 text-sm">Resultado</h4>
              <p className="text-xs text-gray-600">Pontuação e recomendações</p>
            </div>
          </div>
          
          <button
            onClick={startJourney}
            className="btn-primary text-lg font-bold px-12 py-4 rounded-lg"
            data-testid="button-start-journey"
          >
            <i className="fas fa-rocket mr-2"></i>
            INICIAR MINHA AVALIAÇÃO GRATUITA
          </button>
          
          <p className="text-xs text-gray-600 mt-4 font-medium">
            ⏱️ Tempo: 8-10 minutos | 🎯 100% Personalizado | 🔒 Totalmente Confidencial
          </p>
        </div>
      </div>
    </div>
  );
}