import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { problems } from '../data/mockData';
import ProblemCard from '../components/common/ProblemCard';
import { 
  Search, Filter, X, BookOpen, TrendingUp, Users, 
  Settings, BarChart, Briefcase, Grid, List, 
  Clock, Award, ChevronDown, ChevronUp
} from 'lucide-react';
import { Category, Difficulty, Problem } from '../types';

type SortOption = 'recent' | 'popular' | 'difficulty' | 'time';
type ViewMode = 'grid' | 'list';

const ProblemsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProblems, setFilteredProblems] = useState(problems);
  const [selectedCategory, setSelectedCategory] = useState<Category | ''>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | ''>('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [timeRange, setTimeRange] = useState<number | null>(null);

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
  const timeRanges = [30, 45, 60, 90, 120];

  // Get search term from URL on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchTerm(decodeURIComponent(searchParam));
    }
  }, [location.search]);

  // Filter and sort problems
  useEffect(() => {
    let result = [...problems];
    
    // Apply filters
    if (selectedCategory) {
      result = result.filter(problem => problem.category === selectedCategory);
    }
    
    if (selectedSubcategory) {
      result = result.filter(problem => problem.tags?.includes(selectedSubcategory));
    }
    
    if (selectedDifficulty) {
      result = result.filter(problem => problem.difficulty === selectedDifficulty);
    }

    if (timeRange) {
      result = result.filter(problem => problem.timeLimit <= timeRange);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(problem => 
        problem.title.toLowerCase().includes(term) || 
        problem.companyContext?.toLowerCase().includes(term) || 
        problem.description.toLowerCase().includes(term) ||
        problem.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        result.sort((a, b) => b.solvedCount - a.solvedCount);
        break;
      case 'difficulty':
        const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        result.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
        break;
      case 'time':
        result.sort((a, b) => a.timeLimit - b.timeLimit);
        break;
    }
    
    setFilteredProblems(result);
  }, [selectedCategory, selectedSubcategory, selectedDifficulty, searchTerm, sortBy, timeRange]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedDifficulty('');
    setTimeRange(null);
    setSearchTerm('');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Finance & Investment':
        return <BarChart className="h-5 w-5" />;
      case 'Operations & Supply Chain':
        return <Settings className="h-5 w-5" />;
      case 'Management':
        return <Users className="h-5 w-5" />;
      case 'Strategy & Consulting':
        return <Briefcase className="h-5 w-5" />;
      case 'Marketing & Growth':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-50 mb-2">Business Case Problems</h1>
        <p className="text-dark-400">Practice with real-world business scenarios across multiple domains</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 p-6 mb-8">
        <div className="flex flex-col space-y-4">
          {/* Search and View Controls */}
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search cases by title, company, or keywords..."
                className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-dark-50 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid' 
                    ? 'bg-emerald-500 text-dark-900' 
                    : 'bg-dark-700 text-dark-400 hover:text-dark-200'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list' 
                    ? 'bg-emerald-500 text-dark-900' 
                    : 'bg-dark-700 text-dark-400 hover:text-dark-200'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-dark-400 hover:text-dark-200"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
              {showFilters ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
            </button>

            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <span className="text-dark-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-1.5 text-dark-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="difficulty">Difficulty</option>
                <option value="time">Time Required</option>
              </select>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="space-y-4 pt-4 border-t border-dark-700">
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

              {/* Difficulty and Time Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <h3 className="text-sm font-medium text-dark-200 mb-2">Difficulty</h3>
                  <div className="flex flex-wrap gap-2">
                    {difficulties.map((difficulty) => (
                      <button
                        key={difficulty}
                        onClick={() => setSelectedDifficulty(selectedDifficulty === difficulty ? '' : difficulty)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 ${
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

                <div className="flex-1 min-w-[200px]">
                  <h3 className="text-sm font-medium text-dark-200 mb-2">Time Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {timeRanges.map((time) => (
                      <button
                        key={time}
                        onClick={() => setTimeRange(timeRange === time ? null : time)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 ${
                          timeRange === time
                            ? 'bg-emerald-500 text-dark-900'
                            : 'bg-dark-700 text-dark-400 hover:text-dark-200'
                        }`}
                      >
                        ≤ {time} min
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedCategory || selectedSubcategory || selectedDifficulty || timeRange || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center text-dark-400 hover:text-dark-200"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="mb-6 flex justify-between items-center">
        <div className="text-dark-400">
          Showing {filteredProblems.length} {filteredProblems.length === 1 ? 'case' : 'cases'}
          {selectedCategory && ` in ${selectedCategory}`}
          {selectedSubcategory && ` > ${selectedSubcategory}`}
        </div>
      </div>

      {/* Problem Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredProblems.map((problem) => (
          <ProblemCard key={problem.id} problem={problem} viewMode={viewMode} />
        ))}
      </div>

      {filteredProblems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-dark-400 mb-2">No cases found matching your criteria</div>
          <button
            onClick={clearFilters}
            className="text-emerald-500 hover:text-emerald-400"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProblemsPage;