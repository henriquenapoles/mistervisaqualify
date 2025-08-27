import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { WizardForm } from "@/components/WizardForm";

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  const startJourney = () => {
    setShowForm(true);
  };

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <WizardForm />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="wizard-container rounded-2xl shadow-2xl p-8 text-center"
        data-testid="welcome-screen"
      >
        <div className="mb-8">
          {/* Patriotic header with stars */}
          <div className="flex justify-center mb-6">
            <div className="flex space-x-2">
              <i className="fas fa-star text-yellow-500 text-2xl"></i>
              <i className="fas fa-star text-yellow-500 text-3xl"></i>
              <i className="fas fa-star text-yellow-500 text-2xl"></i>
            </div>
          </div>
          
          {/* American flag image */}
          <img 
            src="https://images.unsplash.com/photo-1502764613149-7f1d229e230f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=200" 
            alt="American Flag" 
            className="rounded-lg mb-6 w-full h-32 object-cover"
          />
          
          <h1 className="text-4xl font-bold text-primary mb-4">
            Bem-vindo(a) à sua Jornada para os EUA! 🇺🇸
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Este questionário é o seu primeiro passo para descobrir o melhor caminho para o Green Card. 
            Leva menos de <strong className="text-accent">5 minutos</strong> e cada resposta te deixa mais perto do seu objetivo.
          </p>
          
          {/* Journey steps preview */}
          <div className="grid grid-cols-4 gap-2 mb-8 text-xs">
            <div className="flex flex-col items-center p-2 bg-secondary rounded-lg">
              <i className="fas fa-bullseye text-primary mb-1"></i>
              <span>Missão</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-secondary rounded-lg">
              <i className="fas fa-user text-primary mb-1"></i>
              <span>Perfil</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-secondary rounded-lg">
              <i className="fas fa-users text-primary mb-1"></i>
              <span>Time</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-secondary rounded-lg">
              <i className="fas fa-graduation-cap text-primary mb-1"></i>
              <span>Skills</span>
            </div>
          </div>
          
          <Button
            onClick={startJourney}
            className="pulse-button bg-gradient-to-r from-blue-800 to-red-600 hover:from-blue-900 hover:to-red-700 text-white px-8 py-4 rounded-xl text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-300"
            size="lg"
            data-testid="button-start-journey"
          >
            🚀 COMEÇAR SUA JORNADA
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
