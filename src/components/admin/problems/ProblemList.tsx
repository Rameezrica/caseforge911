import React, { useState, useEffect, useCallback } from 'react';
import { Problem, getProblems, deleteProblem } from '../../../services/adminApi';
// import { Button } from '../../ui/Button'; // Assuming a UI Button component exists
// import { Table, Th, Td, Tr, Thead, Tbody } from '../../ui/Table'; // Assuming UI Table components

interface ProblemListProps {
  onEdit: (problem: Problem) => void; // Callback to signal editing a problem
  setNotification: (message: string, type: 'success' | 'error') => void; // For feedback
}

const ProblemList: React.FC<ProblemListProps> = ({ onEdit, setNotification }) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Basic pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10); // Or make this configurable

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Calculate skip for pagination
      const skip = (currentPage - 1) * itemsPerPage;
      const fetchedProblems = await getProblems(skip, itemsPerPage);
      // TODO: Need total count from API for proper pagination controls if not just next/prev
      setProblems(fetchedProblems);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch problems.';
      setError(errorMessage);
      setNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, setNotification]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const handleDelete = async (problemId: string) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      try {
        await deleteProblem(problemId);
        setNotification('Problem deleted successfully!', 'success');
        // Refetch problems or remove from local state
        setProblems(prevProblems => prevProblems.filter(p => p.id !== problemId));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete problem.';
        setError(errorMessage);
        setNotification(errorMessage, 'error');
      }
    }
  };

  if (loading) return <p>Loading problems...</p>;
  // Error is handled by notification, but can also show a message here
  // if (error && problems.length === 0) return <p style={{color: 'red'}}>{error}</p>;


  // Basic table styling - replace with actual UI components if available
  const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
  const thStyle: React.CSSProperties = { border: '1px solid #ddd', padding: '8px', background: '#f2f2f2', textAlign: 'left' };
  const tdStyle: React.CSSProperties = { border: '1px solid #ddd', padding: '8px', textAlign: 'left' };
  const actionButtonStyle: React.CSSProperties = { marginRight: '5px', padding: '5px 10px', cursor: 'pointer' };


  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display general error if needed */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Difficulty</th>
            <th style={thStyle}>Domain</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {problems.length === 0 && !loading ? (
            <tr>
              <td colSpan={5} style={{...tdStyle, textAlign: 'center'}}>No problems found.</td>
            </tr>
          ) : (
            problems.map(problem => (
              <tr key={problem.id}>
                <td style={tdStyle}>{problem.title}</td>
                <td style={tdStyle}>{problem.category}</td>
                <td style={tdStyle}>{problem.difficulty}</td>
                <td style={tdStyle}>{problem.domain}</td>
                <td style={tdStyle}>
                  <button onClick={() => onEdit(problem)} style={actionButtonStyle}>Edit</button>
                  <button onClick={() => handleDelete(problem.id)} style={{...actionButtonStyle, background: '#dc3545', color: 'white'}}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Basic Pagination (conceptual) */}
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
          // Disable if on last page - requires knowing total number of items
          disabled={problems.length < itemsPerPage || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProblemList;
