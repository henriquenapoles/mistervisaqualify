import React, { useState } from "react";
import { SimpleWizardForm } from "@/components/SimpleWizardForm";

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  const startJourney = () => {
    setShowForm(true);
  };

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <SimpleWizardForm />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="wizard-container rounded-lg shadow-lg p-8 text-center" data-testid="welcome-screen">
        <div className="stars-decoration">🇺🇸</div>
        
        <div className="mb-8 relative z-10">
          {/* American flag icon */}
          <div className="eagle-avatar"></div>
          
          {/* Main title */}
          <h1 className="text-5xl font-bold mb-4 text-center">
            <span className="bg-gradient-to-r from-blue-800 to-red-600 bg-clip-text text-transparent">
              WIZARD EMIGRATION
            </span>
          </h1>
          
          <h2 className="text-2xl font-semibold text-blue-800 text-center mb-6">
            Descubra Suas Chances de Viver o Sonho Americano!
          </h2>
          
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-2xl border-4 border-blue-200 relative">
            <div className="absolute top-4 right-4 text-2xl">🇺🇸</div>
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                  <i className="fas fa-star text-white"></i>
                </div>
                <p className="text-xl text-blue-800 font-semibold">
                  <strong>Avaliação Completa</strong> do seu perfil para imigração
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                  <i className="fas fa-chart-line text-white"></i>
                </div>
                <p className="text-xl text-red-800 font-semibold">
                  <strong>Pontuação Personalizada</strong> baseada em critérios oficiais
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                  <i className="fas fa-medal text-white"></i>
                </div>
                <p className="text-xl text-blue-800 font-semibold">
                  <strong>Recomendações de Vistos</strong> ideais para você
                </p>
              </div>
            </div>
          </div>
          
          {/* Journey steps preview */}
          <div className="grid grid-cols-4 gap-4 text-center mb-8">
            <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                <i className="fas fa-passport text-white text-lg"></i>
              </div>
              <span className="text-sm font-medium text-blue-800">Documents</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mb-2">
                <i className="fas fa-graduation-cap text-white text-lg"></i>
              </div>
              <span className="text-sm font-medium text-red-800">Education</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                <i className="fas fa-briefcase text-white text-lg"></i>
              </div>
              <span className="text-sm font-medium text-blue-800">Career</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mb-2">
                <i className="fas fa-trophy text-white text-lg"></i>
              </div>
              <span className="text-sm font-medium text-red-800">Success</span>
            </div>
          </div>
          
          <button
            onClick={startJourney}
            className="btn-primary text-xl font-bold px-8 py-4 rounded-lg transform hover:scale-105 transition-all"
            data-testid="button-start-journey"
          >
            🚀 COMEÇAR SUA JORNADA
          </button>
        </div>
      </div>
    </div>
  );
}