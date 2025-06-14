import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, TrendingUp, Target, Award, 
  Briefcase, BarChart2, Users, CheckCircle,
  Lock, Star, Clock
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface StudyPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  problemCount: number;
  difficulty: string;
  progress: number;
  locked: boolean;
  comingSoon?: boolean;
  icon: JSX.Element;
  topics: string[];
  skills: string[];
}

const StudyPlansPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'my-plans'>('all');

  const studyPlans: StudyPlan[] = [
    {
      id: '1',
      title: 'Investment Banking Fundamentals',
      description: 'Master core concepts in financial modeling, valuation, and M&A analysis',
      duration: '12 weeks',
      problemCount: 120,
      difficulty: 'Intermediate',
      progress: 0,
      locked: false,
      icon: <TrendingUp className="h-6 w-6 text-success" />,
      topics: ['Financial Modeling', 'Valuation', 'M&A', 'LBO Analysis'],
      skills: ['Excel Modeling', 'Financial Analysis', 'Due Diligence']
    },
    {
      id: '2',
      title: 'Management Consulting Path',
      description: 'Develop structured problem-solving and strategic thinking skills',
      duration: '16 weeks',
      problemCount: 160,
      difficulty: 'Advanced',
      progress: 0,
      locked: true,
      icon: <Briefcase className="h-6 w-6 text-blue-500" />,
      topics: ['Strategy', 'Operations', 'Market Entry', 'Digital Transformation'],
      skills: ['Problem Structuring', 'Data Analysis', 'Client Communication']
    },
    {
      id: '3',
      title: 'Product Management Essentials',
      description: 'Learn product strategy, market analysis, and user-centric design',
      duration: '10 weeks',
      problemCount: 100,
      difficulty: 'Intermediate',
      progress: 0,
      locked: true,
      comingSoon: true,
      icon: <Target className="h-6 w-6 text-purple-500" />,
      topics: ['Product Strategy', 'Market Analysis', 'UX Design', 'Roadmap Planning'],
      skills: ['Product Development', 'User Research', 'Stakeholder Management']
    },
    {
      id: '4',
      title: 'Data Analytics & Business Intelligence',
      description: 'Master data-driven decision making and business analytics',
      duration: '8 weeks',
      problemCount: 80,
      difficulty: 'Intermediate',
      progress: 0,
      locked: true,
      comingSoon: true,
      icon: <BarChart2 className="h-6 w-6 text-orange-500" />,
      topics: ['Data Analysis', 'Business Metrics', 'Visualization', 'SQL'],
      skills: ['Data Analysis', 'Dashboard Creation', 'Statistical Analysis']
    }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-dark-800 rounded-xl border border-dark-700 p-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-dark-50 mb-3">Study Plans</h1>
          <p className="text-dark-400 mb-6">
            Follow structured learning paths to master specific business domains and prepare for your career
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === 'all'
                  ? 'bg-emerald-500 text-dark-900'
                  : 'bg-dark-700 text-dark-400 hover:text-dark-200'
              }`}
            >
              All Plans
            </button>
            <button
              onClick={() => setActiveTab('my-plans')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === 'my-plans'
                  ? 'bg-emerald-500 text-dark-900'
                  : 'bg-dark-700 text-dark-400 hover:text-dark-200'
              }`}
            >
              My Plans
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {studyPlans.map(plan => (
          <div 
            key={plan.id}
            className="bg-dark-800 rounded-xl border border-dark-700 p-6 relative"
          >
            {plan.locked && !plan.comingSoon && (
              <div className="absolute top-4 right-4">
                <Lock className="h-5 w-5 text-dark-400" />
              </div>
            )}
            
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-dark-700 rounded-lg">
                {plan.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-dark-50 mb-2">{plan.title}</h3>
                <p className="text-dark-400 mb-4">{plan.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-dark-400">
                    <Clock className="h-4 w-4 mr-2" />
                    {plan.duration}
                  </div>
                  <div className="flex items-center text-dark-400">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {plan.problemCount} problems
                  </div>
                  <div className="flex items-center text-dark-400">
                    <Target className="h-4 w-4 mr-2" />
                    {plan.difficulty}
                  </div>
                  <div className="flex items-center text-dark-400">
                    <Users className="h-4 w-4 mr-2" />
                    1.2k enrolled
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-dark-400 mb-2">Topics covered:</div>
                  <div className="flex flex-wrap gap-2">
                    {plan.topics.map((topic, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-dark-700 text-dark-200 rounded-full text-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-sm text-dark-400 mb-2">Skills you'll gain:</div>
                  <div className="flex flex-wrap gap-2">
                    {plan.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="flex items-center px-2 py-1 bg-dark-700 text-dark-200 rounded-full text-sm"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-dark-400">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>4.8</span>
                    <span className="mx-1">•</span>
                    <span>2.1k reviews</span>
                  </div>
                  {plan.comingSoon ? (
                    <div className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium">
                      Coming Soon
                    </div>
                  ) : (
                    <button
                      className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                        plan.locked
                          ? 'bg-dark-700 text-dark-400 cursor-not-allowed'
                          : 'bg-emerald-500 text-dark-900 hover:bg-emerald-600'
                      }`}
                      disabled={plan.locked}
                    >
                      {plan.locked ? 'Premium Plan' : 'Start Learning'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyPlansPage;