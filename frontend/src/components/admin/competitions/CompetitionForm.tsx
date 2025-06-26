import React, { useState, useEffect, useCallback } from 'react';
import {
  Competition,
  CompetitionCreate,
  CompetitionUpdate,
  Problem,
  getProblems, // To fetch problems for selection
} from '../../../services/adminApi';

interface CompetitionFormProps {
  initialData?: Competition | CompetitionCreate; // initialData for edit, undefined for create
  onSubmit: (data: CompetitionCreate | CompetitionUpdate) => Promise<void>;
  isEditMode: boolean;
  onCancel: () => void;
  isLoading?: boolean;
}

// Helper to format date for datetime-local input
const formatDateForInput = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    // Format: YYYY-MM-DDTHH:mm
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (e) {
    console.warn("Error formatting date string for input:", dateString, e);
    return ''; // Fallback if date string is invalid
  }
};


const CompetitionForm: React.FC<CompetitionFormProps> = ({
  initialData,
  onSubmit,
  isEditMode,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CompetitionCreate | CompetitionUpdate>(
    initialData || {
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      problem_ids: [],
      is_active: false,
    }
  );

  const [availableProblems, setAvailableProblems] = useState<Problem[]>([]);
  const [selectedProblemIds, setSelectedProblemIds] = useState<string[]>(initialData?.problem_ids || []);
  const [errors, setErrors] = useState<Partial<Record<keyof CompetitionCreate, string>>>({});

  useEffect(() => {
    // Load available problems for selection
    const fetchAvailableProblems = async () => {
      try {
        // Assuming getProblems can fetch all problems if no pagination args are passed,
        // or use a high limit. For many problems, pagination/search for problems would be better here.
        const problems = await getProblems(0, 1000); // Fetch up to 1000 problems
        setAvailableProblems(problems);
      } catch (error) {
        console.error('Failed to fetch problems for selection:', error);
        setErrors(prev => ({...prev, problem_ids: 'Could not load problems for selection.'}));
      }
    };
    fetchAvailableProblems();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Ensure dates are formatted for datetime-local input if they are not already
        start_date: formatDateForInput(initialData.start_date),
        end_date: formatDateForInput(initialData.end_date),
      });
      setSelectedProblemIds(initialData.problem_ids || []);
    } else {
      // Reset for create mode
      setFormData({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        problem_ids: [],
        is_active: false,
      });
      setSelectedProblemIds([]);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleProblemSelectionChange = (problemId: string) => {
    setSelectedProblemIds(prevSelectedIds =>
      prevSelectedIds.includes(problemId)
        ? prevSelectedIds.filter(id => id !== problemId)
        : [...prevSelectedIds, problemId]
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CompetitionCreate, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    if (!formData.start_date) newErrors.start_date = 'Start date is required.';
    if (!formData.end_date) newErrors.end_date = 'End date is required.';
    if (formData.start_date && formData.end_date && new Date(formData.start_date) >= new Date(formData.end_date)) {
      newErrors.end_date = 'End date must be after start date.';
    }
    // Basic check for problem IDs, could be more complex (e.g., at least one problem)
    if (selectedProblemIds.length === 0) newErrors.problem_ids = 'At least one problem must be selected.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Ensure dates are in ISO string format if needed, though datetime-local provides compatible strings.
    // The backend Pydantic models expect datetime strings that can be parsed.
    const submissionData = {
      ...formData,
      problem_ids: selectedProblemIds,
      start_date: new Date(formData.start_date).toISOString(), // Ensure ISO string
      end_date: new Date(formData.end_date).toISOString(),     // Ensure ISO string
    };
    await onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h3 style={{ marginTop: 0 }}>{isEditMode ? 'Edit Competition' : 'Create New Competition'}</h3>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="name">Name:</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} disabled={isLoading} style={{width: '100%', padding: '8px'}}/>
        {errors.name && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.name}</p>}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="description">Description:</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} disabled={isLoading} style={{width: '100%', padding: '8px'}}/>
        {errors.description && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.description}</p>}
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
        <div style={{flex: 1}}>
          <label htmlFor="start_date">Start Date:</label>
          <input type="datetime-local" name="start_date" id="start_date" value={formData.start_date} onChange={handleChange} disabled={isLoading} style={{width: '100%', padding: '8px'}}/>
          {errors.start_date && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.start_date}</p>}
        </div>
        <div style={{flex: 1}}>
          <label htmlFor="end_date">End Date:</label>
          <input type="datetime-local" name="end_date" id="end_date" value={formData.end_date} onChange={handleChange} disabled={isLoading} style={{width: '100%', padding: '8px'}}/>
          {errors.end_date && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.end_date}</p>}
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Select Problems:</label>
        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', background: 'white' }}>
          {availableProblems.length === 0 && <p>Loading problems or no problems available...</p>}
          {availableProblems.map(problem => (
            <div key={problem.id}>
              <input
                type="checkbox"
                id={`problem-${problem.id}`}
                value={problem.id}
                checked={selectedProblemIds.includes(problem.id)}
                onChange={() => handleProblemSelectionChange(problem.id)}
                disabled={isLoading}
              />
              <label htmlFor={`problem-${problem.id}`} style={{marginLeft: '5px'}}>{problem.title} ({problem.difficulty})</label>
            </div>
          ))}
        </div>
        {errors.problem_ids && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.problem_ids}</p>}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="is_active" style={{ marginRight: '10px' }}>Is Active:</label>
        <input
          type="checkbox"
          name="is_active"
          id="is_active"
          checked={formData.is_active || false}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button type="button" onClick={onCancel} disabled={isLoading} style={{padding: '8px 15px'}}>Cancel</button>
        <button type="submit" disabled={isLoading} style={{padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none'}}>
          {isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Competition' : 'Create Competition')}
        </button>
      </div>
    </form>
  );
};

export default CompetitionForm;
