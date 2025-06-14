import React, { useState, useEffect } from 'react';
import { Eye, Search, Filter, FileText, User, Calendar } from 'lucide-react';
import { apiService } from '../../services/api';

interface Solution {
  id: string;
  problem_id: string;
  problem_title: string;
  problem_difficulty: string;
  user_id: string;
  user_email: string;
  user_name: string;
  content: string;
  submitted_at: string;
}

const AdminSolutionsPage: React.FC = () => {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadSolutions();
  }, []);

  const loadSolutions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/solutions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('caseforge_admin_access_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch solutions');
      }

      const data = await response.json();
      setSolutions(data.solutions);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load solutions');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSolution = (solution: Solution) => {
    setSelectedSolution(solution);
    setShowModal(true);
  };

  const filteredSolutions = solutions.filter(solution => {
    const matchesSearch = solution.problem_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solution.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solution.user_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = !filterDifficulty || solution.problem_difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Solutions Management</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Total Solutions: {solutions.length}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by problem title, user name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Solutions Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Problem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Difficulty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSolutions.map((solution) => (
              <tr key={solution.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-gray-400 mr-2" />
                    <div className="text-sm font-medium text-gray-900">{solution.problem_title}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    solution.problem_difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    solution.problem_difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {solution.problem_difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{solution.user_name}</div>
                      <div className="text-sm text-gray-500">{solution.user_email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <div className="text-sm text-gray-900">
                      {new Date(solution.submitted_at).toLocaleDateString()}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewSolution(solution)}
                    className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    View Solution
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSolutions.length === 0 && (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No solutions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {solutions.length === 0 ? 'No solutions have been submitted yet.' : 'No solutions match your search criteria.'}
            </p>
          </div>
        )}
      </div>

      {/* Solution View Modal */}
      {showModal && selectedSolution && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Solution for: {selectedSolution.problem_title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Submitted by {selectedSolution.user_name} ({selectedSolution.user_email}) on{' '}
                    {new Date(selectedSolution.submitted_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <h4 className="font-medium text-gray-900 mb-2">Solution Content:</h4>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedSolution.content}
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSolutionsPage;