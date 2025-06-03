import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { problems } from '../data/mockData';
import ProblemCard from '../components/common/ProblemCard';
import { Search, Filter, X, BookOpen, TrendingUp, Users, Settings, BarChart, Briefcase } from 'lucide-react';
import { Category, Difficulty, Problem } from '../types';
import { useAuth } from '../context/AuthContext';

const ProblemsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProblems, setFilteredProblems] = useState(problems);
  const [selectedCategory, setSelectedCategory] = useState<Category | ''>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | ''>('');

  const categories = {
    'Finance & Investment': [
      'Financial Modeling',
      'Investment Analysis',
      'Corporate Finance',
      'Personal Finance',
      'Quantitative Finance'
    ],
    'Operations & Supply Chain': [
      'Supply Chain Optimization',
      'Process Improvement',
      'Quality Management',
      'Project Management',
      'Production Planning'
    ],
    'Management': [
      'Organizational Design',
      'Leadership Scenarios',
      'HR Analytics',
      'Decision Making',
      'Performance Management'
    ],
    'Strategy & Consulting': [
      'Market Analysis',
      'Growth Strategy',
      'Digital Transformation',
      'Competitive Strategy',
      'Business Model Design'
    ],
    'Marketing & Growth': [
      'Customer Segmentation',
      'Pricing Strategy',
      'Campaign Optimization',
      'Brand Strategy',
      'Digital Marketing'
    ]
  };

  const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];

  // Get search term from URL on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchTerm(decodeURIComponent(searchParam));
    }
  }, [location.search]);

  // Filter problems based on search and filters
  useEffect(() => {
    let result = [...problems];
    
    if (selectedCategory) {
      result = result.filter(problem => problem.category === selectedCategory);
    }
    
    if (selectedSubcategory) {
      result = result.filter(problem => problem.tags.includes(selectedSubcategory));
    }
    
    if (selectedDifficulty) {
      result = result.filter(problem => problem.difficulty === selectedDifficulty);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(problem => 
        problem.title.toLowerCase().includes(term) || 
        problem.companyContext.toLowerCase().includes(term) || 
        problem.description.toLowerCase().includes(term) ||
        problem.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    setFilteredProblems(result);
  }, [selectedCategory, selectedSubcategory, selectedDifficulty, searchTerm]);

  const handleProblemClick = (problemId: string) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/problem/${problemId}` } });
      return;
    }
    navigate(`/problem/${problemId}`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Finance & Investment':
        return <TrendingUp className="h-5 w-5" />;
      case 'Operations & Supply Chain':
        return <Settings className="h-5 w-5" />;
      case 'Management':
        return <Users className="h-5 w-5" />;
      case 'Strategy & Consulting':
        return <Briefcase className="h-5 w-5" />;
      case 'Marketing & Growth':
        return <BarChart className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-50 mb-2">Business Case Problems</h1>
        <p className="text-dark-400">Practice with real-world business scenarios across multiple domains</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 p-6 mb-8">
        <div className="flex flex-col space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 h-5 w-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search cases by title, company, or keywords..."
              className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-dark-50 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categories).map(([category, subcategories]) => (
              <div
                key={category}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-dark-700 border-emerald-500'
                    : 'bg-dark-700 border-dark-600 hover:border-dark-500'
                }`}
                onClick={() => setSelectedCategory(selectedCategory === category ? '' : category as Category)}
              >
                <div className="flex items-center mb-2">
                  <span className={`${selectedCategory === category ? 'text-emerald-500' : 'text-dark-400'}`}>
                    {getCategoryIcon(category)}
                  </span>
                  <span className={`ml-2 font-medium ${
                    selectedCategory === category ? 'text-emerald-500' : 'text-dark-200'
                  }`}>
                    {category}
                  </span>
                </div>
                {selectedCategory === category && (
                  <div className="mt-2 space-y-1">
                    {subcategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSubcategory(selectedSubcategory === sub ? '' : sub);
                        }}
                        className={`block w-full text-left px-2 py-1 rounded text-sm ${
                          selectedSubcategory === sub
                            ? 'bg-emerald-500/20 text-emerald-500'
                            : 'text-dark-400 hover:text-dark-200'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex space-x-4">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(selectedDifficulty === difficulty ? '' : difficulty)}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  selectedDifficulty === difficulty
                    ? 'bg-emerald-500 text-dark-900'
                    : 'bg-dark-700 text-dark-400 hover:text-dark-200'
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-6 flex justify-between items-center">
        <div className="text-dark-400">
          Showing {filteredProblems.length} {filteredProblems.length === 1 ? 'case' : 'cases'}
          {selectedCategory && ` in ${selectedCategory}`}
          {selectedSubcategory && ` > ${selectedSubcategory}`}
        </div>
        
        {(selectedCategory || selectedSubcategory || selectedDifficulty || searchTerm) && (
          <button
            onClick={() => {
              setSelectedCategory('');
              setSelectedSubcategory('');
              setSelectedDifficulty('');
              setSearchTerm('');
            }}
            className="flex items-center text-dark-400 hover:text-emerald-500"
          >
            <X className="h-4 w-4 mr-1" />
            Clear filters
          </button>
        )}
      </div>

      {/* Problem Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProblems.map((problem) => (
          <div key={problem.id} onClick={() => handleProblemClick(problem.id)}>
            <ProblemCard problem={problem} />
          </div>
        ))}
      </div>

      {filteredProblems.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-dark-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-dark-200 mb-2">No cases found</h3>
          <p className="text-dark-400">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
};

export default ProblemsPage;