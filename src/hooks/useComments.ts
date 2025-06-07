import { useState } from 'react';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  votes: number;
}

export const useComments = (initialComments: Comment[] = []) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');

  const addComment = (content: string, userName: string = 'Current User') => {
    if (!content.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      votes: 0
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  const updateComment = (commentId: string, updates: Partial<Comment>) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId ? { ...comment, ...updates } : comment
      )
    );
  };

  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  return {
    comments,
    newComment,
    setNewComment,
    addComment,
    updateComment,
    deleteComment
  };
};