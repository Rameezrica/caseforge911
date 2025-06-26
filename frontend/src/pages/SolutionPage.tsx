import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const SolutionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-dark-900 pb-16">
      <div className="bg-dark-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/problems" 
            className="inline-flex items-center text-dark-400 hover:text-dark-200 mb-4"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Problems
          </Link>
          <h1 className="text-2xl font-bold text-dark-50">Solution Details</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-dark-800 rounded-lg border border-dark-700 p-8 text-center">
          <h2 className="text-xl font-semibold text-dark-50 mb-4">Solution #{id}</h2>
          <p className="text-dark-400">Solution details will be displayed here.</p>
        </div>
      </div>
    </div>
  );
};

export default SolutionPage;