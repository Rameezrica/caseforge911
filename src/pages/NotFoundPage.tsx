import React from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-dark-50 mb-4">404</h1>
        <p className="text-xl text-dark-400 mb-8">Page not found</p>
        <Link 
          to="/"
          className="inline-flex items-center px-4 py-2 bg-emerald-500 text-dark-900 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}