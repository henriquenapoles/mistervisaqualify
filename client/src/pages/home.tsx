import React, { useState } from "react";
import { SimpleWizardForm } from "@/components/SimpleWizardForm";
import flagGif from "@assets/flag-america-usa-35_1756390382970.gif";

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
      <div className="container mx-auto px-4 py-8 max-w-4xl relative">
        {/* Animated Stars */}
        {generateStars()}
        
        {/* USA Flag */}
        <div className="flag-container">
          <img src={flagGif} alt="USA Flag" className="flag-gif" />
        </div>
        
        <div className="relative z-20">
          <SimpleWizardForm />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl relative">
      {/* Animated Stars */}
      {generateStars()}
      

      <div className="wizard-container rounded-lg shadow-lg p-8" data-testid="welcome-screen">
        
        {/* Brand Header */}
        <div className="brand-header">
          <h1>Mister Visa®</h1>
          <p>Consultoria Especializada em Vistos e Imigração</p>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4" style={{color: '#1a365d'}}>
            Avaliação Gratuita de Elegibilidade
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Descubra Suas Oportunidades de Imigração para os Estados Unidos
          </p>
          
          <div className="border-l-4 p-6 mb-8 text-left rounded-lg" style={{background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', borderColor: '#667eea'}}>
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fas fa-star text-purple-500 text-xl"></i>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold mb-2" style={{color: '#1a365d'}}>
                  Consultoria Especializada em Imigração Americana
                </h3>
                <ul className="space-y-2" style={{color: '#2d3748'}}>
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    Análise personalizada do seu perfil migratório
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    Estratégias baseadas em nossa experiência de mercado
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    Acompanhamento completo durante todo o processo
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
            className="btn-primary text-xl font-bold px-16 py-5 rounded-lg"
            data-testid="button-start-journey"
          >
            <i className="fas fa-rocket mr-3"></i>
            INICIAR MINHA AVALIAÇÃO GRATUITA
          </button>
          
          <p className="text-sm text-gray-600 mt-6 font-medium">
            ⏱️ Tempo: 8-10 minutos | 🎯 100% Personalizado | 🔒 Totalmente Confidencial
          </p>
        </div>
      </div>
    </div>
  );
}