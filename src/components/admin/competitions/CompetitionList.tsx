import React, { useState, useEffect, useCallback } from 'react';
import { Competition, getCompetitions, deleteCompetition } from '../../../services/adminApi';

interface CompetitionListProps {
  onEdit: (competition: Competition) => void; // Callback to signal editing a competition
  setNotification: (message: string, type: 'success' | 'error') => void;
}

// Helper to format date string for display
const formatDateForDisplay = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString(); // Adjust format as needed
  } catch (e) {
    return dateString; // Return original if parsing fails
  }
};

const CompetitionList: React.FC<CompetitionListProps> = ({ onEdit, setNotification }) => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);

  const fetchCompetitions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const skip = (currentPage - 1) * itemsPerPage;
      const fetchedCompetitions = await getCompetitions(skip, itemsPerPage);
      setCompetitions(fetchedCompetitions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch competitions.';
      setError(errorMessage);
      setNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, setNotification]);

  useEffect(() => {
    fetchCompetitions();
  }, [fetchCompetitions]);

  const handleDelete = async (competitionId: string) => {
    if (window.confirm('Are you sure you want to delete this competition?')) {
      try {
        await deleteCompetition(competitionId);
        setNotification('Competition deleted successfully!', 'success');
        setCompetitions(prevCompetitions => prevCompetitions.filter(c => c.id !== competitionId));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete competition.';
        setError(errorMessage);
        setNotification(errorMessage, 'error');
      }
    }
  };

  if (loading) return <p>Loading competitions...</p>;

  const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
  const thStyle: React.CSSProperties = { border: '1px solid #ddd', padding: '8px', background: '#f2f2f2', textAlign: 'left' };
  const tdStyle: React.CSSProperties = { border: '1px solid #ddd', padding: '8px', textAlign: 'left' };
  const actionButtonStyle: React.CSSProperties = { marginRight: '5px', padding: '5px 10px', cursor: 'pointer' };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Start Date</th>
            <th style={thStyle}>End Date</th>
            <th style={thStyle}>Active</th>
            <th style={thStyle}>Problems</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {competitions.length === 0 && !loading ? (
            <tr>
              <td colSpan={6} style={{...tdStyle, textAlign: 'center'}}>No competitions found.</td>
            </tr>
          ) : (
            competitions.map(comp => (
              <tr key={comp.id}>
                <td style={tdStyle}>{comp.name}</td>
                <td style={tdStyle}>{formatDateForDisplay(comp.start_date)}</td>
                <td style={tdStyle}>{formatDateForDisplay(comp.end_date)}</td>
                <td style={tdStyle}>{comp.is_active ? 'Yes' : 'No'}</td>
                <td style={tdStyle}>{comp.problem_ids.length}</td>
                <td style={tdStyle}>
                  <button onClick={() => onEdit(comp)} style={actionButtonStyle}>Edit</button>
                  <button onClick={() => handleDelete(comp.id)} style={{...actionButtonStyle, background: '#dc3545', color: 'white'}}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1 || loading}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={competitions.length < itemsPerPage || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CompetitionList;
