import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProblems } from '../hooks/useProblems';
import { apiService } from '../services/api';
import ProblemCard from '../components/common/ProblemCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { 
  Search, Filter, X, BookOpen, TrendingUp, Users, 
  Settings, BarChart, Briefcase, Grid, List, 
  Clock, Award, ChevronDown, ChevronUp, Target
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
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableDifficulties, setAvailableDifficulties] = useState<string[]>([]);

  const { problems, loading } = useProblems();
  const [filteredProblems, setFilteredProblems] = useState(problems);

  // Load categories and difficulties from backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await apiService.getCategories();
        setAvailableCategories(categoriesData.categories || []);
        setAvailableDifficulties(categoriesData.difficulties || []);
      } catch (error) {
        console.error('Failed to load categories:', error);
        // Fallback to default categories
        setAvailableCategories(['Strategy', 'Marketing', 'Operations', 'Finance']);
        setAvailableDifficulties(['Easy', 'Medium', 'Hard']);
      }
    };
    
    loadCategories();
  }, []);

  const categories = {
    'Strategy & Consulting': {
      subcategories: [
        'Market Analysis',
        'Growth Strategy', 
        'Digital Transformation',
        'Competitive Strategy',
        'Business Model Design'
      ],
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
      icon: <BarChart className="h-5 w-5" />
    }
  };

  const difficulties = ['Easy', 'Medium', 'Hard'];
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

  const hasActiveFilters = selectedCategory || selectedSubcategory || selectedDifficulty || timeRange || searchTerm;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading problems..." />
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-xl mx-auto">
          <BookOpen className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Business Case Problems
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Practice with real-world business scenarios across multiple domains
          </p>
        </div>
      </div>

      {/* Search and Controls */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Search Bar and View Toggle */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search cases by title, company, or keywords..."
                className="pl-10"
              />
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-md"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-md"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="gap-1 text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                  Clear filters
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="input w-auto min-w-0 text-sm"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="difficulty">Difficulty</option>
                <option value="time">Time Required</option>
              </select>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="pt-4 border-t space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Categories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(categories).map(([category, config]) => (
                    <div key={category}>
                      <Button
                        variant={selectedCategory === category ? "secondary" : "outline"}
                        onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                        className="w-full justify-start gap-2 h-auto p-3"
                      >
                        {config.icon}
                        <span className="text-sm">{category}</span>
                      </Button>
                      
                      {selectedCategory === category && (
                        <div className="mt-2 ml-4 space-y-1">
                          {config.subcategories.map((sub) => (
                            <Button
                              key={sub}
                              variant={selectedSubcategory === sub ? "secondary" : "ghost"}
                              size="sm"
                              onClick={() => setSelectedSubcategory(selectedSubcategory === sub ? '' : sub)}
                              className="w-full justify-start text-xs"
                            >
                              {sub}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Difficulty and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Difficulty</h3>
                  <div className="flex flex-wrap gap-2">
                    {difficulties.map((difficulty) => (
                      <Button
                        key={difficulty}
                        variant={selectedDifficulty === difficulty ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setSelectedDifficulty(selectedDifficulty === difficulty ? '' : difficulty)}
                      >
                        {difficulty}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Time Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {timeRanges.map((time) => (
                      <Button
                        key={time}
                        variant={timeRange === time ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setTimeRange(timeRange === time ? null : time)}
                      >
                        ≤ {time} min
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Results Header */}
      <div className="flex justify-between items-center">
        <div className="text-muted-foreground">
          Showing <span className="text-foreground font-medium">{filteredProblems.length}</span> {filteredProblems.length === 1 ? 'case' : 'cases'}
          {selectedCategory && ` in ${selectedCategory}`}
          {selectedSubcategory && ` > ${selectedSubcategory}`}
        </div>
        
        {filteredProblems.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Award className="h-4 w-4" />
            <span>Professional quality cases</span>
          </div>
        )}
      </div>

      {/* Problems Grid/List */}
      <div>
        {filteredProblems.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredProblems.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-xl mb-6 mx-auto">
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No cases found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search criteria or filters</p>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProblemsPage;