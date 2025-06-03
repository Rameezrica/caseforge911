import React from 'react';
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  BarChart2,
  TrendingUp,
  Clock
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-foreground">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-lg shadow border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Problems</p>
              <p className="text-3xl font-bold text-foreground mt-2">0</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Users</p>
              <p className="text-3xl font-bold text-foreground mt-2">0</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
              <p className="text-3xl font-bold text-foreground mt-2">0</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
              <p className="text-3xl font-bold text-foreground mt-2">0%</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <BarChart2 className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
          <button className="text-sm text-primary hover:text-primary/80">View All</button>
        </div>
        
        <div className="bg-card rounded-lg shadow border border-border">
          <div className="p-6">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Clock className="h-5 w-5" />
              <p>No recent activity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg shadow border border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Problem Difficulty Distribution</h3>
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow border border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">User Growth</h3>
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 