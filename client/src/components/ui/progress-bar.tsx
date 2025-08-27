import { motion } from "framer-motion";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const starsCount = 8;
  const starsCompleted = Math.ceil((currentStep + 1) / totalSteps * starsCount);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-muted-foreground">Progresso da Jornada</span>
        <span className="text-sm font-medium text-primary">
          Passo {currentStep + 1} de {totalSteps}
        </span>
      </div>
      
      <div className="w-full bg-secondary rounded-full h-3 mb-4">
        <motion.div 
          className="bg-gradient-to-r from-blue-800 to-red-600 h-3 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <div className="flex justify-center space-x-3">
        {Array.from({ length: starsCount }, (_, i) => (
          <motion.i
            key={i}
            className={`fas fa-star transition-all duration-300 ${
              i < starsCompleted ? 'text-yellow-500 scale-125' : 'text-gray-300'
            }`}
            initial={{ scale: 1 }}
            animate={{ scale: i < starsCompleted ? 1.25 : 1 }}
            transition={{ delay: i * 0.1 }}
            data-testid={`progress-star-${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
