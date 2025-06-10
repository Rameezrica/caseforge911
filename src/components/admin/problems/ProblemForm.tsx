import React, { useState, useEffect } from 'react';
import { Problem, ProblemCreate, ProblemUpdate } from '../../../services/adminApi';

interface ProblemFormProps {
  initialData?: Problem | ProblemCreate;
  onSubmit: (data: ProblemCreate | ProblemUpdate) => Promise<void>;
  isEditMode: boolean;
  onCancel: () => void; // To close the form/modal
  isLoading?: boolean; // To disable form during submission
}

const ProblemForm: React.FC<ProblemFormProps> = ({
  initialData,
  onSubmit,
  isEditMode,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ProblemCreate | ProblemUpdate>(
    initialData || {
      title: '',
      description: '',
      difficulty: 'Medium', // Default difficulty
      category: '',
      domain: '',
      company: '',
      time_limit: 60,
      sample_framework: '',
    }
  );
  const [errors, setErrors] = useState<Partial<Record<keyof ProblemCreate, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else if (!isEditMode) {
      // Reset form for creation mode if initialData is not provided
      setFormData({
        title: '',
        description: '',
        difficulty: 'Medium',
        category: '',
        domain: '',
        company: '',
        time_limit: 60,
        sample_framework: '',
      });
    }
  }, [initialData, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    let processedValue: string | number = value;
    if (type === 'number') {
      processedValue = value === '' ? '' : Number(value); // Allow empty string for optional number, convert to number otherwise
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProblemCreate, string>> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    if (!formData.category.trim()) newErrors.category = 'Category is required.';
    if (!formData.domain.trim()) newErrors.domain = 'Domain is required.';
    if (formData.time_limit !== undefined && formData.time_limit !== null && formData.time_limit <=0) {
        newErrors.time_limit = 'Time limit must be a positive number.'
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await onSubmit(formData);
  };

  const difficultyOptions = ['Easy', 'Medium', 'Hard'];

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h3 style={{ marginTop: 0 }}>{isEditMode ? 'Edit Problem' : 'Create New Problem'}</h3>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="title">Title:</label>
        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} disabled={isLoading} style={{width: '100%', padding: '8px'}}/>
        {errors.title && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.title}</p>}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="description">Description:</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={5} disabled={isLoading} style={{width: '100%', padding: '8px'}}/>
        {errors.description && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.description}</p>}
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
        <div style={{flex: 1}}>
            <label htmlFor="difficulty">Difficulty:</label>
            <select name="difficulty" id="difficulty" value={formData.difficulty} onChange={handleChange} disabled={isLoading} style={{width: '100%', padding: '8px'}}>
            {difficultyOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
        <div style={{flex: 1}}>
            <label htmlFor="category">Category:</label>
            <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} disabled={isLoading} style={{width: '100%', padding: '8px'}}/>
            {errors.category && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.category}</p>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
        <div style={{flex: 1}}>
            <label htmlFor="domain">Domain:</label>
            <input type="text" name="domain" id="domain" value={formData.domain} onChange={handleChange} disabled={isLoading} style={{width: '100%', padding: '8px'}}/>
            {errors.domain && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.domain}</p>}
        </div>
        <div style={{flex: 1}}>
            <label htmlFor="company">Company (Optional):</label>
            <input type="text" name="company" id="company" value={formData.company || ''} onChange={handleChange} disabled={isLoading} style={{width: '100%', padding: '8px'}}/>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
        <div style={{flex: 1}}>
            <label htmlFor="time_limit">Time Limit (minutes, Optional):</label>
            <input type="number" name="time_limit" id="time_limit" value={formData.time_limit || ''} onChange={handleChange} disabled={isLoading} style={{width: '100%', padding: '8px'}}/>
            {errors.time_limit && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.time_limit}</p>}
        </div>
         <div style={{flex: 1}}>
            {/* Placeholder for another field if needed, or adjust layout */}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="sample_framework">Sample Framework (Optional, Markdown supported):</label>
        <textarea name="sample_framework" id="sample_framework" value={formData.sample_framework || ''} onChange={handleChange} rows={4} disabled={isLoading} style={{width: '100%', padding: '8px'}}/>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button type="button" onClick={onCancel} disabled={isLoading} style={{padding: '8px 15px'}}>Cancel</button>
        <button type="submit" disabled={isLoading} style={{padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none'}}>
          {isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Problem' : 'Create Problem')}
        </button>
      </div>
    </form>
  );
};

export default ProblemForm;
