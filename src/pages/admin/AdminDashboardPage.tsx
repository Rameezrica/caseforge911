import React, { useState, useEffect } from 'react';
import { FileText, Trophy, Users, TrendingUp, Calendar, Activity } from 'lucide-react';
import { getProblems, getCompetitions } from '../../services/adminApi';

interface DashboardStats {
  totalProblems: number;
  totalCompetitions: number;
  activeCompetitions: number;
  totalUsers: number; // This would come from a users API endpoint
}

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProblems: 0,
    totalCompetitions: 0,
    activeCompetitions: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [problems, competitions] = await Promise.all([
        getProblems(0, 1000), // Get all problems for counting
        getCompetitions(0, 1000), // Get all competitions for counting
      ]);

      setStats({
        totalProblems: problems.length,
        totalCompetitions: competitions.length,
        activeCompetitions: competitions.filter(c => c.is_active).length,
        totalUsers: 0, // TODO: Implement users API endpoint
      });
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Problems',
      value: stats.totalProblems,
      icon: FileText,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Competitions',
      value: stats.totalCompetitions,
      icon: Trophy,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Active Competitions',
      value: stats.activeCompetitions,
      icon: Activity,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to CaseForge Admin Panel</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className={`${card.bgColor} p-3 rounded-lg mr-4`}>
                <card.icon className={`h-6 w-6 ${card.textColor}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/problems"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Manage Problems</h3>
              <p className="text-sm text-gray-600">Create, edit, and organize problems</p>
            </div>
          </a>
          
          <a
            href="/admin/competitions"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Trophy className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Manage Competitions</h3>
              <p className="text-sm text-gray-600">Create and manage competitions</p>
            </div>
          </a>
          
          <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
            <Users className="h-8 w-8 text-gray-400 mr-3" />
            <div>
              <h3 className="font-medium text-gray-500">Manage Users</h3>
              <p className="text-sm text-gray-400">Coming soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>System initialized with sample problems</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Activity className="h-4 w-4 mr-2" />
            <span>Admin panel ready for management</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;