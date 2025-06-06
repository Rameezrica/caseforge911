import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDomain } from '../context/DomainContext';
import { apiService, Problem } from '../services/api';
import ProblemCard from '../components/common/ProblemCard';
import { 
  Search, Filter, X, BookOpen, TrendingUp, Users, 
  Settings, BarChart, Briefcase, Grid, List, 
  Clock, Award, ChevronDown, ChevronUp, Star
} from 'lucide-react';

type SortOption = 'recent' | 'popular' | 'difficulty' | 'time';
type ViewMode = 'grid' | 'list';

const DomainProblemsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDomain } = useDomain();
  const [searchTerm, setSearchTerm] = useState('');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [timeRange, setTimeRange] = useState<number | null>(null);

  // Domain-specific categories mapping
  const domainCategories = {
    'Finance & Investment': [
      'Valuation Analysis', 'Financial Modeling', 'Investment Analysis', 
      'Corporate Finance', 'Risk Management'
    ],
    'Strategy & Consulting': [
      'Market Entry Strategy', 'Growth Strategy', 'Digital Transformation',
      'Competitive Strategy', 'Business Model Design'
    ],
    'Operations & Supply Chain': [
      'Supply Chain Management', 'Process Improvement', 'Quality Management',
      'Project Management', 'Production Planning'
    ],
    'Marketing & Growth': [
      'Customer Acquisition', 'Pricing Strategy', 'Campaign Optimization',
      'Brand Strategy', 'Digital Marketing'
    ],
    'Data Analytics': [
      'Business Intelligence', 'Data Analysis', 'Performance Metrics',
      'Reporting', 'Predictive Analytics'
    ]
  };

  const categories = selectedDomain ? domainCategories[selectedDomain as keyof typeof domainCategories] || [] : [];
  const difficulties: string[] = ['Easy', 'Medium', 'Hard'];
  const timeRanges = [30, 45, 60, 90, 120];

  // Fetch problems on initial load - filtered by selected domain
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setIsLoading(true);
        const filters = selectedDomain ? { domain: selectedDomain } : {};
        const problemData = await apiService.getProblems(filters);
        setProblems(problemData);
        setFilteredProblems(problemData);
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedDomain) {
      fetchProblems();
    }
  }, [selectedDomain]);

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
    
    if (selectedDifficulty) {
      result = result.filter(problem => problem.difficulty === selectedDifficulty);
    }

    if (timeRange) {
      result = result.filter(problem => (problem.time_limit || 60) <= timeRange);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(problem => 
        problem.title.toLowerCase().includes(term) || 
        problem.company?.toLowerCase().includes(term) || 
        problem.description.toLowerCase().includes(term) ||
        problem.category.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'popular':
        // Mock popularity - in real app would have solve count
        result.sort((a, b) => Math.random() - 0.5);
        break;
      case 'difficulty':
        const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        result.sort((a, b) => difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - difficultyOrder[b.difficulty as keyof typeof difficultyOrder]);
        break;
      case 'time':
        result.sort((a, b) => (a.time_limit || 60) - (b.time_limit || 60));
        break;
    }
    
    setFilteredProblems(result);
  }, [selectedCategory, selectedDifficulty, searchTerm, sortBy, timeRange, problems]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedDifficulty('');
    setTimeRange(null);
    setSearchTerm('');
  };

  if (!selectedDomain) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark-50 mb-2">No Domain Selected</h1>
          <p className="text-dark-400">Please select a domain to view problems.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-50 mb-2">
          {selectedDomain} Cases
        </h1>
        <p className="text-dark-400">
          Practice with real-world {selectedDomain.toLowerCase()} scenarios
        </p>
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
                placeholder={`Search ${selectedDomain.toLowerCase()} cases...`}
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
              <div>
                <h3 className="text-sm font-medium text-dark-200 mb-3">Categories in {selectedDomain}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                        selectedCategory === category
                          ? 'bg-emerald-500 text-dark-900'
                          : 'bg-dark-700 text-dark-400 hover:text-dark-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
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
              {(selectedCategory || selectedDifficulty || timeRange || searchTerm) && (
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
        </div>
        
        {/* Domain skills indicator */}
        <div className="text-sm text-dark-500">
          Developing skills: Financial Modeling, Valuation, Risk Assessment
        </div>
      </div>

      {/* Problem Grid/List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredProblems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} viewMode={viewMode} />
          ))}
        </div>
      )}

      {filteredProblems.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-dark-400 mb-2">No {selectedDomain.toLowerCase()} cases found matching your criteria</div>
          <button
            onClick={clearFilters}
            className="text-emerald-500 hover:text-emerald-400"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Domain Learning Progress */}
      <div className="mt-12 bg-dark-800 rounded-xl border border-dark-700 p-6">
        <h3 className="text-lg font-semibold text-dark-50 mb-4">Your {selectedDomain} Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-500 mb-1">12</div>
            <div className="text-sm text-dark-400">Problems Solved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500 mb-1">Level 3</div>
            <div className="text-sm text-dark-400">Current Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500 mb-1">85%</div>
            <div className="text-sm text-dark-400">Avg Score</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainProblemsPage;