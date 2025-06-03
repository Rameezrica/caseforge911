import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Comment } from '../types';

export const useComments = (parentId: string) => {
  const { comments, addComment } = useStore();
  const [newComment, setNewComment] = useState('');
  
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      userId: '1', // Replace with actual user ID
      userName: 'Current User', // Replace with actual username
      content: newComment,
      createdAt: new Date().toISOString(),
      votes: 0
    };
    
    addComment(parentId, comment);
    setNewComment('');
  };
  
  return {
    comments: comments[parentId] || [],
    newComment,
    setNewComment,
    handleAddComment
  };
};