import React, { useState, useCallback } from 'react';
import CompetitionList from '../../components/admin/competitions/CompetitionList';
import CompetitionForm from '../../components/admin/competitions/CompetitionForm';
import { Competition, CompetitionCreate, CompetitionUpdate, createCompetition, updateCompetition } from '../../services/adminApi';

// Simple Notification component (can be shared or moved to a UI directory)
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

// Simple Modal (can be shared or moved to a UI directory)
const Modal: React.FC<{ children: React.ReactNode; onClose: () => void; title: string }> = ({ children, onClose, title }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
    <div style={{ background: 'white', padding: '0px', borderRadius: '8px', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #eee'}}>
          <h4 style={{margin: 0}}>{title}</h4>
          <button onClick={onClose} style={{background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer'}}>&times;</button>
      </div>
      {children}
    </div>
  </div>
);


const AdminCompetitionsPage: React.FC = () => {
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // For form submission

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0); // To trigger list refresh

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleCreateNew = () => {
    setEditingCompetition(null);
    setIsFormVisible(true);
  };

  const handleEdit = (competition: Competition) => {
    setEditingCompetition(competition);
    setIsFormVisible(true);
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setEditingCompetition(null);
  };

  const handleSubmitForm = async (data: CompetitionCreate | CompetitionUpdate) => {
    setIsLoading(true);
    try {
      if (editingCompetition && editingCompetition.id) { // Edit mode
        await updateCompetition(editingCompetition.id, data as CompetitionUpdate);
        showNotification('Competition updated successfully!', 'success');
      } else { // Create mode
        await createCompetition(data as CompetitionCreate);
        showNotification('Competition created successfully!', 'success');
      }
      setIsFormVisible(false);
      setEditingCompetition(null);
      setRefreshKey(prevKey => prevKey + 1); // Trigger list refresh
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while saving the competition.';
      showNotification(errorMessage, 'error');
      console.error('Failed to save competition:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Manage Competitions</h2>
        <button
            onClick={handleCreateNew}
            style={{padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
        >
            Create New Competition
        </button>
      </div>

      {isFormVisible && (
         <Modal onClose={handleCancelForm} title={editingCompetition ? 'Edit Competition' : 'Create New Competition'}>
            <CompetitionForm
              initialData={editingCompetition || undefined}
              onSubmit={handleSubmitForm}
              isEditMode={!!editingCompetition}
              onCancel={handleCancelForm}
              isLoading={isLoading}
            />
        </Modal>
      )}

      <CompetitionList key={refreshKey} onEdit={handleEdit} setNotification={showNotification} />
    </div>
  );
};

export default AdminCompetitionsPage;
