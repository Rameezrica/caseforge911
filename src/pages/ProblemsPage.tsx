import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProblems } from '../hooks/useProblems';
import ProblemCard from '../components/common/ProblemCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { 
  Search, Filter, X, BookOpen, TrendingUp, Users, 
  Settings, BarChart, Briefcase, Grid, List, 
  Clock, Award, ChevronDown, ChevronUp, Sparkles,
  Zap, Target
} from 'lucide-react';

type SortOption = 'recent' | 'popular' | 'difficulty' | 'time';
type ViewMode = 'grid' | 'list';

const ProblemsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [timeRange, setTimeRange] = useState<number | null>(null);

  const { problems, loading } = useProblems();
  const [filteredProblems, setFilteredProblems] = useState(problems);

  const categories = {
    'Strategy & Consulting': {
      subcategories: [
        'Market Analysis',
        'Growth Strategy', 
        'Digital Transformation',
        'Competitive Strategy',
        'Business Model Design'
      ],
      gradient: 'from-purple-500 to-pink-600',
      icon: <Briefcase className="h-5 w-5" />
    },
    'Finance & Investment': {
      subcategories: [
        'Financial Modeling',
        'Investment Analysis',
        'Corporate Finance', 
        'Personal Finance',
        'Quantitative Finance'
      ],
      gradient: 'from-emerald-500 to-teal-600',
      icon: <BarChart className="h-5 w-5" />
    },
    'Operations & Supply Chain': {
      subcategories: [
        'Supply Chain Optimization',
        'Process Improvement',
        'Quality Management',
        'Project Management', 
        'Production Planning'
      ],
      gradient: 'from-blue-500 to-cyan-600',
      icon: <Settings className="h-5 w-5" />
    },
    'Marketing & Growth': {
      subcategories: [
        'Customer Segmentation',
        'Pricing Strategy',
        'Campaign Optimization',
        'Brand Strategy',
        'Digital Marketing'
      ],
      gradient: 'from-orange-500 to-red-600',
      icon: <TrendingUp className="h-5 w-5" />
    },
    'Data Analytics': {
      subcategories: [
        'Business Intelligence',
        'Data Analysis',
        'Performance Metrics',
        'Reporting',
        'Analytics'
      ],
      gradient: 'from-cyan-500 to-blue-600',
      icon: <BarChart className="h-5 w-5" />
    }
  };

  const difficulties: { label: string; gradient: string }[] = [
    { label: 'Easy', gradient: 'from-emerald-500 to-teal-600' },
    { label: 'Medium', gradient: 'from-yellow-500 to-orange-600' },
    { label: 'Hard', gradient: 'from-red-500 to-pink-600' }
  ];
  
  const timeRanges = [30, 45, 60, 90, 120];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchTerm(decodeURIComponent(searchParam));
    }
  }, [location.search]);

  useEffect(() => {
    let result = [...problems];
    
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
  }, [problems, selectedCategory, selectedSubcategory, selectedDifficulty, searchTerm, sortBy, timeRange]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedDifficulty('');
    setTimeRange(null);
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading problems..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl mb-6 shadow-neon"
        >
          <BookOpen className="h-8 w-8 text-white" />
        </motion.div>
        <h1 className="text-5xl font-bold mb-4">
          <span className="text-gradient">Business Case Problems</span>
        </h1>
        <p className="text-xl text-dark-300 max-w-2xl mx-auto">
          Practice with real-world business scenarios across multiple domains
        </p>
      </motion.section>

      {/* Search and Filters */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <Card variant="glass" className="p-8">
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="flex items-center justify-between gap-6">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-400 h-5 w-5 z-10" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search cases by title, company, or keywords..."
                  className="w-full pl-12 pr-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-300 text-lg"
                />
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-1">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-lg"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-lg"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center justify-between">
              <Button
                variant="glass"
                onClick={() => setShowFilters(!showFilters)}
                leftIcon={<Filter className="h-4 w-4" />}
                rightIcon={showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              >
                Filters
              </Button>

              <div className="flex items-center gap-3">
                <span className="text-dark-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="time">Time Required</option>
                </select>
              </div>
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6 pt-6 border-t border-white/10"
                >
                  {/* Categories */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(categories).map(([category, config]) => (
                        <motion.div
                          key={category}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            variant={selectedCategory === category ? "interactive" : "glass"}
                            className={`p-4 cursor-pointer transition-all duration-300 ${
                              selectedCategory === category ? 'border-brand-500/50 shadow-neon' : ''
                            }`}
                            onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                          >
                            <div className="flex items-center mb-3">
                              <div className={`p-2 bg-gradient-to-br ${config.gradient} rounded-lg mr-3 shadow-lg`}>
                                {config.icon}
                              </div>
                              <span className="font-medium text-white">{category}</span>
                            </div>
                            
                            {selectedCategory === category && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-3 space-y-2"
                              >
                                {config.subcategories.map((sub) => (
                                  <Button
                                    key={sub}
                                    variant={selectedSubcategory === sub ? "primary" : "ghost"}
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedSubcategory(selectedSubcategory === sub ? '' : sub);
                                    }}
                                    className="w-full justify-start text-sm"
                                  >
                                    {sub}
                                  </Button>
                                ))}
                              </motion.div>
                            )}
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty and Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Difficulty</h3>
                      <div className="flex flex-wrap gap-3">
                        {difficulties.map((difficulty) => (
                          <Button
                            key={difficulty.label}
                            variant={selectedDifficulty === difficulty.label ? "primary" : "glass"}
                            onClick={() => setSelectedDifficulty(selectedDifficulty === difficulty.label ? '' : difficulty.label)}
                            className="px-4 py-2"
                          >
                            {difficulty.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Time Required</h3>
                      <div className="flex flex-wrap gap-3">
                        {timeRanges.map((time) => (
                          <Button
                            key={time}
                            variant={timeRange === time ? "primary" : "glass"}
                            onClick={() => setTimeRange(timeRange === time ? null : time)}
                            className="px-4 py-2"
                          >
                            ≤ {time} min
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {(selectedCategory || selectedSubcategory || selectedDifficulty || timeRange || searchTerm) && (
                    <div className="flex justify-center pt-4">
                      <Button
                        variant="secondary"
                        onClick={clearFilters}
                        leftIcon={<X className="h-4 w-4" />}
                      >
                        Clear all filters
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </motion.section>

      {/* Results Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="flex justify-between items-center"
      >
        <div className="text-dark-300">
          Showing <span className="text-white font-semibold">{filteredProblems.length}</span> {filteredProblems.length === 1 ? 'case' : 'cases'}
          {selectedCategory && ` in ${selectedCategory}`}
          {selectedSubcategory && ` > ${selectedSubcategory}`}
        </div>
        
        {filteredProblems.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-dark-400">
            <Sparkles className="h-4 w-4" />
            <span>Premium quality cases</span>
          </div>
        )}
      </motion.div>

      {/* Problems Grid/List */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        {filteredProblems.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredProblems.map((problem, index) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.05, duration: 0.4 }}
              >
                <ProblemCard problem={problem} viewMode={viewMode} />
              </motion.div>
            ))}
          </div>
        ) : (
          <Card variant="glass" className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-dark-600 to-dark-700 rounded-2xl mb-6">
              <Target className="h-8 w-8 text-dark-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No cases found</h3>
            <p className="text-dark-400 mb-6">Try adjusting your search criteria or filters</p>
            <Button variant="primary" onClick={clearFilters}>
              Clear all filters
            </Button>
          </Card>
        )}
      </motion.section>
    </div>
  );
};

export default ProblemsPage;