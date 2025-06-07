import React from 'react';
import { 
  Calculator, 
  Brain, 
  Target, 
  BarChart3, 
  TrendingUp
} from 'lucide-react';
import { OnboardingData } from './OnboardingFlow';

interface DomainSelectionStepProps {
  data: Partial<OnboardingData>;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  showBackButton?: boolean;
}

const DomainSelectionStep: React.FC<DomainSelectionStepProps> = ({ 
  data, 
  updateData, 
  onNext, 
  onPrev, 
  showBackButton 
}) => {
  const domains = [
    {
      id: 'Finance & Investment',
      title: 'Finance',
      emoji: '💰',
      icon: <Calculator className="h-6 w-6" />,
      description: 'Investment analysis, valuation, financial modeling',
      color: 'from-green-500/10 to-green-600/10',
      borderColor: 'border-green-500/20',
      selectedColor: 'border-green-500 bg-green-500/10'
    },
    {
      id: 'Marketing & Growth',
      title: 'Marketing',
      emoji: '📈',
      icon: <BarChart3 className="h-6 w-6" />,
      description: 'Customer acquisition, growth strategies, campaigns',
      color: 'from-orange-500/10 to-orange-600/10',
      borderColor: 'border-orange-500/20',
      selectedColor: 'border-orange-500 bg-orange-500/10'
    },
    {
      id: 'Strategy & Consulting',
      title: 'Strategy',
      emoji: '♟️',
      icon: <Brain className="h-6 w-6" />,
      description: 'Business strategy, market entry, frameworks',
      color: 'from-purple-500/10 to-purple-600/10',
      borderColor: 'border-purple-500/20',
      selectedColor: 'border-purple-500 bg-purple-500/10'
    },
    {
      id: 'Operations & Supply Chain',
      title: 'Operations',
      emoji: '⚙️',
      icon: <Target className="h-6 w-6" />,
      description: 'Process optimization, supply chain, efficiency',
      color: 'from-blue-500/10 to-blue-600/10',
      borderColor: 'border-blue-500/20',
      selectedColor: 'border-blue-500 bg-blue-500/10'
    },
    {
      id: 'Data Analytics',
      title: 'Analytics',
      emoji: '📊',
      icon: <TrendingUp className="h-6 w-6" />,
      description: 'Data analysis, metrics, business intelligence',
      color: 'from-cyan-500/10 to-cyan-600/10',
      borderColor: 'border-cyan-500/20',
      selectedColor: 'border-cyan-500 bg-cyan-500/10'
    }
  ];

  const handleSelect = (domainId: string) => {
    updateData({ selectedDomain: domainId });
  };

  const canProceed = data.selectedDomain;

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Which domain do you want to master? 🎯
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose your primary area of focus
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {domains.map((domain) => {
          const isSelected = data.selectedDomain === domain.id;
          
          return (
            <button
              key={domain.id}
              onClick={() => handleSelect(domain.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 bg-gradient-to-br ${
                isSelected 
                  ? domain.selectedColor + ' shadow-lg' 
                  : `${domain.color} ${domain.borderColor} hover:border-opacity-60`
              }`}
            >
              <div className="flex items-center mb-3">
                <span className="text-3xl mr-3">{domain.emoji}</span>
                <div className="text-emerald-500">
                  {domain.icon}
                </div>
              </div>
              <h3 className="font-semibold text-foreground mb-2">{domain.title}</h3>
              <p className="text-sm text-muted-foreground">{domain.description}</p>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        {showBackButton ? (
          <button
            onClick={onPrev}
            className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </button>
        ) : (
          <div></div>
        )}

        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            canProceed
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          Continue →
        </button>
      </div>
    </div>
  );
};

export default DomainSelectionStep;