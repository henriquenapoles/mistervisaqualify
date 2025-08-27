interface SimpleProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function SimpleProgress({ currentStep, totalSteps }: SimpleProgressProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const starsCount = 8;
  const starsCompleted = Math.ceil((currentStep + 1) / totalSteps * starsCount);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-600">Progresso da Jornada</span>
        <span className="text-sm font-medium text-blue-600">
          Passo {currentStep + 1} de {totalSteps}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div 
          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-center space-x-3">
        {Array.from({ length: starsCount }, (_, i) => (
          <i
            key={i}
            className={`fas fa-star ${
              i < starsCompleted ? 'text-yellow-500' : 'text-gray-300'
            }`}
            data-testid={`progress-star-${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}