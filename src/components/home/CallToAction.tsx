import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CallToAction: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-800 to-blue-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-0 lg:flex-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Ready to master business case solving?
            </h2>
            <p className="mt-3 max-w-2xl text-lg leading-6 text-blue-100">
              Join thousands of business students who are improving their skills and preparing for career success.
            </p>
          </div>
          <div className="mt-8 lg:mt-0 lg:flex-shrink-0">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Link
                to="/register"
                className="px-6 py-3 text-lg font-medium rounded-lg bg-yellow-400 text-blue-900 hover:bg-yellow-300 transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/problems"
                className="px-6 py-3 text-lg font-medium rounded-lg bg-blue-700 text-white hover:bg-blue-600 transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Browse Cases
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;