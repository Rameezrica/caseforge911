import React from 'react';
import { Search, FileText, MessageSquare, Award } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: <Search className="h-10 w-10 text-blue-600" />,
      title: 'Choose a Case',
      description: 'Browse our library of real-world business cases across multiple industries and difficulty levels.'
    },
    {
      icon: <FileText className="h-10 w-10 text-blue-600" />,
      title: 'Submit Your Solution',
      description: 'Analyze the problem and submit a structured solution with recommendations and implementation plans.'
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-blue-600" />,
      title: 'Get Feedback',
      description: 'Receive AI-powered feedback on your solution and learn from the community\'s discussions.'
    },
    {
      icon: <Award className="h-10 w-10 text-blue-600" />,
      title: 'Track Progress',
      description: 'Build your profile, earn achievement badges, and monitor your improvement over time.'
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How CaseForge Works
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            A simple process designed to help you master business case solving
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  {step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-blue-200 transform -translate-x-8">
                    <div className="absolute right-0 top-1/2 w-2 h-2 rounded-full bg-blue-400 transform -translate-y-1/2"></div>
                  </div>
                )}
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;