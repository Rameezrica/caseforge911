import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDomain } from '../context/DomainContext';
import { apiService, LearningPath } from '../services/api';
import { 
  BookOpen, 
  Clock, 
  Target, 
  Star,
  Play,
  CheckCircle,
  Users,
  Award,
  TrendingUp,
  BarChart3,
  Calendar,
  ChevronRight
} from 'lucide-react';

const DomainLearningPaths: React.FC = () => {
  const { domain } = useParams<{ domain: string }>();
  const { selectedDomain } = useDomain();
  const currentDomain = domain || selectedDomain;
  
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  useEffect(() => {
    if (currentDomain) {
      fetchLearningPaths();
    }
  }, [currentDomain]);

  const fetchLearningPaths = async () => {
    if (!currentDomain) return;
    
    try {
      setLoading(true);
      const pathsData = await apiService.getDomainLearningPaths(currentDomain);
      setLearningPaths(pathsData);
    } catch (error) {
      console.error('Error fetching learning paths:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentDomain) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark-50 mb-2">Domain Not Found</h1>
          <p className="text-dark-400">Please select a valid domain.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const filteredPaths = selectedLevel === 'all' 
    ? learningPaths 
    : learningPaths.filter(path => path.level === selectedLevel);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-900 text-green-200 border-green-700';
      case 'Intermediate':
        return 'bg-yellow-900 text-yellow-200 border-yellow-700';
      case 'Advanced':
        return 'bg-red-900 text-red-200 border-red-700';
      default:
        return 'bg-dark-700 text-dark-200 border-dark-600';
    }
  };

  const getDomainIcon = (domainName: string) => {
    switch (domainName) {
      case 'Finance & Investment':
        return <BarChart3 className="h-6 w-6 text-green-500" />;
      case 'Strategy & Consulting':
        return <Target className="h-6 w-6 text-purple-500" />;
      case 'Operations & Supply Chain':
        return <TrendingUp className="h-6 w-6 text-blue-500" />;
      case 'Marketing & Growth':
        return <BarChart3 className="h-6 w-6 text-orange-500" />;
      case 'Data Analytics':
        return <TrendingUp className="h-6 w-6 text-cyan-500" />;
      default:
        return <BookOpen className="h-6 w-6 text-dark-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            {getDomainIcon(currentDomain)}
            <h1 className="text-3xl font-bold text-dark-50 ml-3">
              {currentDomain} Learning Paths
            </h1>
          </div>
          <p className="text-dark-400 mb-6">
            Follow structured learning paths to master {currentDomain.toLowerCase()} skills
          </p>

          {/* Level Filter */}
          <div className="flex items-center gap-4">
            <span className="text-dark-300 font-medium">Filter by level:</span>
            <div className="flex gap-2">
              {['all', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedLevel === level
                      ? 'bg-emerald-500 text-dark-900'
                      : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                  }`}
                >
                  {level === 'all' ? 'All Levels' : level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Learning Paths Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {filteredPaths.map((path) => (
            <div
              key={path.id}
              className="bg-dark-800 rounded-xl border border-dark-700 p-6 hover:border-dark-600 transition-all duration-300"
            >
              {/* Path Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-dark-50">{path.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor(path.level)}`}>
                      {path.level}
                    </span>
                  </div>
                  <p className="text-dark-400 mb-4">{path.description}</p>
                </div>
              </div>

              {/* Path Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-dark-50 mb-1">
                    {path.estimated_duration}
                  </div>
                  <div className="text-xs text-dark-400 flex items-center justify-center">
                    <Clock className="h-3 w-3 mr-1" />
                    weeks
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-dark-50 mb-1">
                    {path.problems?.length || 0}
                  </div>
                  <div className="text-xs text-dark-400 flex items-center justify-center">
                    <BookOpen className="h-3 w-3 mr-1" />
                    problems
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-dark-50 mb-1">
                    {path.skills_covered.length}
                  </div>
                  <div className="text-xs text-dark-400 flex items-center justify-center">
                    <Award className="h-3 w-3 mr-1" />
                    skills
                  </div>
                </div>
              </div>

              {/* Skills Covered */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-dark-300 mb-3">Skills You'll Master:</h4>
                <div className="flex flex-wrap gap-2">
                  {path.skills_covered.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-dark-700 text-dark-300 rounded-md text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress Bar (Mock) */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-dark-300">Progress</span>
                  <span className="text-sm text-dark-400">0%</span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full w-0 transition-all duration-300"></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors">
                  <Play className="h-4 w-4 mr-2" />
                  Start Path
                </button>
                <button className="px-4 py-3 bg-dark-700 hover:bg-dark-600 text-dark-300 rounded-lg transition-colors">
                  <BookOpen className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Path Recommendations */}
        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
          <h2 className="text-xl font-bold text-dark-50 mb-4">Recommended Learning Journey</h2>
          <p className="text-dark-400 mb-6">
            Based on your current level and career goals, here's the optimal learning sequence:
          </p>

          <div className="space-y-4">
            {['Beginner', 'Intermediate', 'Advanced'].map((level, index) => {
              const pathsInLevel = learningPaths.filter(path => path.level === level);
              if (pathsInLevel.length === 0) return null;

              return (
                <div key={level} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-green-500 text-white' :
                    index === 1 ? 'bg-yellow-500 text-dark-900' :
                    'bg-red-500 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-dark-50">{level} Level</h3>
                    <p className="text-sm text-dark-400">
                      {pathsInLevel.map(path => path.title).join(', ')}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-dark-500" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredPaths.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-dark-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark-50 mb-2">
              No Learning Paths Available
            </h3>
            <p className="text-dark-400 mb-4">
              {selectedLevel === 'all' 
                ? `No learning paths found for ${currentDomain}`
                : `No ${selectedLevel.toLowerCase()} level paths available`
              }
            </p>
            {selectedLevel !== 'all' && (
              <button
                onClick={() => setSelectedLevel('all')}
                className="text-emerald-500 hover:text-emerald-400"
              >
                View all levels
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainLearningPaths;