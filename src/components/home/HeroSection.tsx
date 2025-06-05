ruimport React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Award, Users, Zap } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 right-0 h-40 bg-white/10 transform -skew-y-6"></div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-white/5 transform skew-y-6"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Master Business Cases Like <span className="text-yellow-400">Never Before</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            The ultimate platform for business students to practice real-world case studies, develop strategic thinking, and prepare for career success.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center mb-12">
            <Link to="/problems" className="px-6 py-3 text-lg font-medium rounded-lg bg-yellow-400 text-blue-900 hover:bg-yellow-300 transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center">
              Start Practicing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/register" className="px-6 py-3 text-lg font-medium rounded-lg bg-blue-700 text-white hover:bg-blue-600 transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center">
              Create Account
            </Link>
          </div>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="bg-blue-800 bg-opacity-50 py-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 p-3 bg-blue-700 rounded-lg">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-white">Real-World Cases</h3>
                <p className="mt-1 text-blue-100">Practice with cases based on actual business scenarios across multiple industries.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 p-3 bg-blue-700 rounded-lg">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-white">Track Progress</h3>
                <p className="mt-1 text-blue-100">Monitor your improvement with detailed analytics and achievement badges.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 p-3 bg-blue-700 rounded-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-white">Community Learning</h3>
                <p className="mt-1 text-blue-100">Learn from peers by discussing approaches and reviewing top solutions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;