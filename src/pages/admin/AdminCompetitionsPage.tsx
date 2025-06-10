import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Play, Pause } from 'lucide-react';
import { 
  getCompetitions, 
  createCompetition, 
  updateCompetition, 
  deleteCompetition, 
  Competition, 
  CompetitionCreate, 
  CompetitionUpdate 
} from '../../services/adminApi';

const AdminCompetitionsPage: React.FC = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState<CompetitionCreate>({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    problem_ids: [],
    is_active: false,
  });

  useEffect(() => {
    loadCompetitions();
  }, []);

  const loadCompetitions = async () => {
    try {
      setLoading(true);
      const data = await getCompetitions();
      setCompetitions(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load competitions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCompetition) {
        const updatedCompetition = await updateCompetition(editingCompetition.id, formData as CompetitionUpdate);
        setCompetitions(prev => prev.map(c => c.id === editingCompetition.id ? updatedCompetition : c));
      } else {
        const newCompetition = await createCompetition(formData);
        setCompetitions(prev => [newCompetition, ...prev]);
      }
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Failed to save competition');
    }
  };

  const handleEdit = (competition: Competition) => {
    setEditingCompetition(competition);
    setFormData({
      name: competition.name,
      description: competition.description,
      start_date: competition.start_date.split('T')[0], // Convert to date format
      end_date: competition.end_date.split('T')[0],
      problem_ids: competition.problem_ids || [],
      is_active: competition.is_active,
    });
    setShowModal(true);
  };

  const handleDelete = async (competitionId: string) => {
    if (!confirm('Are you sure you want to delete this competition?')) return;
    
    try {
      await deleteCompetition(competitionId);
      setCompetitions(prev => prev.filter(c => c.id !== competitionId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete competition');
    }
  };

  const toggleActive = async (competition: Competition) => {
    try {
      const updatedCompetition = await updateCompetition(competition.id, {
        is_active: !competition.is_active
      });
      setCompetitions(prev => prev.map(c => c.id === competition.id ? updatedCompetition : c));
    } catch (err: any) {
      setError(err.message || 'Failed to update competition status');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      problem_ids: [],
      is_active: false,
    });
    setEditingCompetition(null);
    setShowModal(false);
  };

  const filteredCompetitions = competitions.filter(competition =>
    competition.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    competition.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-2xl font-bold text-gray-900">Competitions Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Competition
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search competitions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Competitions Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCompetitions.map((competition) => (
          <div key={competition.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{competition.name}</h3>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  competition.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {competition.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {competition.description}
            </p>
            
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div>
                <span className="font-medium">Start:</span> {new Date(competition.start_date).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">End:</span> {new Date(competition.end_date).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Problems:</span> {competition.problem_ids?.length || 0}
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t">
              <button
                onClick={() => toggleActive(competition)}
                className={`p-2 rounded-md ${
                  competition.is_active
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-green-600 hover:bg-green-50'
                }`}
                title={competition.is_active ? 'Deactivate' : 'Activate'}
              >
                {competition.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(competition)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(competition.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCompetitions.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No competitions found.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCompetition ? 'Edit Competition' : 'Add New Competition'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    Active Competition
                  </label>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingCompetition ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCompetitionsPage;