import React, { useState, useCallback } from 'react';
import ProblemList from '../../components/admin/problems/ProblemList';
import ProblemForm from '../../components/admin/problems/ProblemForm';
import { Problem, ProblemCreate, ProblemUpdate, createProblem, updateProblem } from '../../services/adminApi';
// Assuming a simple Modal and Button component might exist or using basic styles
// import Modal from '../../components/ui/Modal';
// import Button from '../../components/ui/Button';

// Simple Notification component (or use a library like react-toastify)
const Notification: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => {
  if (!message) return null;
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '10px 20px',
      backgroundColor: type === 'success' ? 'lightgreen' : 'lightcoral',
      color: type === 'success' ? 'darkgreen' : 'darkred',
      borderRadius: '5px',
      zIndex: 1000,
    }}>
      {message}
      <button onClick={onClose} style={{ marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
    </div>
  );
};


const AdminProblemsPage: React.FC = () => {
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // For form submission

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000); // Auto-hide after 5 seconds
  };

  // To refresh ProblemList after create/update.
  // A more robust solution might involve a global state or context for data invalidation.
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleCreateNew = () => {
    setEditingProblem(null);
    setIsFormVisible(true);
  };

  const handleEdit = (problem: Problem) => {
    setEditingProblem(problem);
    setIsFormVisible(true);
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setEditingProblem(null);
  };

  const handleSubmitForm = async (data: ProblemCreate | ProblemUpdate) => {
    setIsLoading(true);
    try {
      if (editingProblem && editingProblem.id) { // Edit mode
        await updateProblem(editingProblem.id, data as ProblemUpdate);
        showNotification('Problem updated successfully!', 'success');
      } else { // Create mode
        await createProblem(data as ProblemCreate);
        showNotification('Problem created successfully!', 'success');
      }
      setIsFormVisible(false);
      setEditingProblem(null);
      setRefreshKey(prevKey => prevKey + 1); // Trigger list refresh
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      showNotification(errorMessage, 'error');
      console.error('Failed to save problem:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple Modal using a div overlay
  const Modal: React.FC<{ children: React.ReactNode; onClose: () => void; title: string }> = ({ children, onClose, title }) => (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
      <div style={{ background: 'white', padding: '0px', borderRadius: '8px', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #eee'}}>
            <h4 style={{margin: 0}}>{title}</h4>
            <button onClick={onClose} style={{background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer'}}>&times;</button>
        </div>
        <div style={{padding: '0px'}}> {/* Form will have its own padding */}
            {children}
        </div>
      </div>
    </div>
  );


  return (
    <div>
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Manage Problems</h2>
        <button
            onClick={handleCreateNew}
            style={{padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
        >
            Create New Problem
        </button>
      </div>

      {isFormVisible && (
         <Modal onClose={handleCancelForm} title={editingProblem ? 'Edit Problem' : 'Create New Problem'}>
            <ProblemForm
            initialData={editingProblem || undefined}
            onSubmit={handleSubmitForm}
            isEditMode={!!editingProblem}
            onCancel={handleCancelForm}
            isLoading={isLoading}
            />
        </Modal>
      )}

      <ProblemList key={refreshKey} onEdit={handleEdit} setNotification={showNotification} />
    </div>
  );
};

export default AdminProblemsPage;
