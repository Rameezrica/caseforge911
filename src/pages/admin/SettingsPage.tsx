import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/button';
import { useAdmin } from '../../hooks/useAdmin';

interface Settings {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
  };
  problem: {
    defaultTimeLimit: number;
    maxFileSize: number;
    allowedFileTypes: string;
  };
  user: {
    requireEmailVerification: boolean;
    maxLoginAttempts: number;
    sessionTimeout: number;
  };
}

const defaultSettings: Settings = {
  general: {
    siteName: 'CaseForge',
    siteDescription: 'A platform for practicing coding problems',
    contactEmail: 'contact@caseforge.com'
  },
  problem: {
    defaultTimeLimit: 60,
    maxFileSize: 10,
    allowedFileTypes: '.pdf,.doc,.docx,.txt'
  },
  user: {
    requireEmailVerification: true,
    maxLoginAttempts: 5,
    sessionTimeout: 30
  }
};

export const AdminSettingsPage: React.FC = () => {
  const { admin } = useAdmin();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Replace with actual API call
        const response = await fetch('/api/admin/settings');
        if (!response.ok) throw new Error('Failed to fetch settings');
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaveStatus('saving');
      // TODO: Replace with actual API call
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      if (!response.ok) throw new Error('Failed to save settings');
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      setSaveStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    }
  };

  const handleInputChange = (
    section: keyof Settings,
    field: string,
    value: string | number | boolean
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  if (error) {
    return (
      <div className="p-4">
        <PageHeader title="Settings" />
        <Card>
          <div className="p-6 text-center text-red-500">
            {error}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Settings" />
      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4 text-foreground">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Site Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
                  value={settings.general.siteName}
                  onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Site Description</label>
                <textarea
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
                  rows={3}
                  value={settings.general.siteDescription}
                  onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Contact Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
                  value={settings.general.contactEmail}
                  onChange={(e) => handleInputChange('general', 'contactEmail', e.target.value)}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Problem Settings */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4 text-foreground">Problem Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Default Time Limit (minutes)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
                  value={settings.problem.defaultTimeLimit}
                  onChange={(e) => handleInputChange('problem', 'defaultTimeLimit', parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Maximum File Size (MB)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
                  value={settings.problem.maxFileSize}
                  onChange={(e) => handleInputChange('problem', 'maxFileSize', parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Allowed File Types</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
                  value={settings.problem.allowedFileTypes}
                  onChange={(e) => handleInputChange('problem', 'allowedFileTypes', e.target.value)}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* User Settings */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4 text-foreground">User Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Require Email Verification</label>
                <select
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
                  value={settings.user.requireEmailVerification.toString()}
                  onChange={(e) => handleInputChange('user', 'requireEmailVerification', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Maximum Login Attempts</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
                  value={settings.user.maxLoginAttempts}
                  onChange={(e) => handleInputChange('user', 'maxLoginAttempts', parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Session Timeout (minutes)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
                  value={settings.user.sessionTimeout}
                  onChange={(e) => handleInputChange('user', 'sessionTimeout', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={saveStatus === 'success' ? 'bg-green-500' : saveStatus === 'error' ? 'bg-red-500' : ''}
          >
            <Save className="h-4 w-4 mr-2" />
            {saveStatus === 'saving' ? 'Saving...' :
             saveStatus === 'success' ? 'Saved!' :
             saveStatus === 'error' ? 'Error Saving' :
             'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}; 