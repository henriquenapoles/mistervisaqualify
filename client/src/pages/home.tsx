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
        <div className="flag-stripes"></div>
        <div className="stars-decoration">⭐🇺🇸⭐</div>
        
        <div className="mb-8 relative z-10">
          {/* Eagle Avatar */}
          <div className="eagle-avatar"></div>
          
          {/* Main title with American patriotic style */}
          <h1 className="text-6xl font-black mb-4 text-center">
            <span className="bg-gradient-to-r from-blue-800 via-white to-red-600 bg-clip-text text-transparent drop-shadow-lg">
              WIZARD EMIGRATION
            </span>
          </h1>
          
          <div className="flex justify-center items-center mb-6">
            <span className="text-4xl mr-2">🦅</span>
            <h2 className="text-3xl font-bold text-blue-800 text-center">
              Descubra Suas Chances de Viver o Sonho Americano!
            </h2>
            <span className="text-4xl ml-2">🗽</span>
          </div>
          
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
          
          {/* American patriotic journey elements */}
          <div className="grid grid-cols-4 gap-6 text-center mb-8">
            <div className="flex flex-col items-center transform hover:scale-105 transition-transform">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mb-3 shadow-xl">
                <i className="fas fa-passport text-white text-3xl"></i>
              </div>
              <span className="font-bold text-blue-800 text-lg">📄 Documents</span>
            </div>
            <div className="flex flex-col items-center transform hover:scale-105 transition-transform">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mb-3 shadow-xl">
                <i className="fas fa-graduation-cap text-white text-3xl"></i>
              </div>
              <span className="font-bold text-red-800 text-lg">🎓 Education</span>
            </div>
            <div className="flex flex-col items-center transform hover:scale-105 transition-transform">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mb-3 shadow-xl">
                <i className="fas fa-briefcase text-white text-3xl"></i>
              </div>
              <span className="font-bold text-blue-800 text-lg">💼 Career</span>
            </div>
            <div className="flex flex-col items-center transform hover:scale-105 transition-transform">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mb-3 shadow-xl">
                <i className="fas fa-trophy text-white text-3xl"></i>
              </div>
              <span className="font-bold text-red-800 text-lg">🏆 Success</span>
            </div>
          </div>
          
          <button
            onClick={startJourney}
            className="btn-primary text-xl font-bold px-8 py-4 rounded-lg transform hover:scale-105 transition-all"
            data-testid="button-start-journey"
          >
            🚀 COMEÇAR SUA JORNADA AMERICANA
          </button>
        </div>
      </div>
    </div>
  );
}