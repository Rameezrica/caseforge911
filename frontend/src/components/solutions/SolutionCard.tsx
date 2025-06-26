import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Award, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SolutionCardProps {
  solution: {
    id: string;
    userName: string;
    submittedAt: string;
    votes: number;
    aiScore: number;
    executiveSummary: string;
    problemId: string;
  };
}

const SolutionCard: React.FC<SolutionCardProps> = ({ solution }) => {
  const [votes, setVotes] = useState(solution.votes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Array<{
    id: string;
    userName: string;
    text: string;
    createdAt: string;
  }>>([]);
  const [newComment, setNewComment] = useState('');

  const handleVote = (type: 'up' | 'down') => {
    if (userVote === type) {
      setUserVote(null);
      setVotes(votes - (type === 'up' ? 1 : -1));
    } else {
      if (userVote) {
        setVotes(votes + (userVote === 'up' ? -2 : 2));
      } else {
        setVotes(votes + (type === 'up' ? 1 : -1));
      }
      setUserVote(type);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      userName: 'Current User',
      text: newComment,
      createdAt: new Date().toISOString(),
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  return (
    <div className="border border-dark-700 rounded-lg overflow-hidden">
      <div className="border-b border-dark-700 bg-dark-700 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="font-medium text-dark-50">{solution.userName}</div>
          <span className="mx-2 text-dark-500">•</span>
          <div className="text-sm text-dark-400">
            {new Date(solution.submittedAt).toLocaleDateString()}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-dark-600 text-emerald-500 rounded-full px-3 py-1 text-sm flex items-center">
            <Award className="mr-1 h-4 w-4" />
            AI Score: {solution.aiScore}
          </div>
          <div className="bg-dark-600 text-emerald-500 rounded-full px-3 py-1 text-sm">
            +{votes}
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-dark-50 mb-2">Executive Summary</h3>
        <p className="text-dark-300 mb-4">{solution.executiveSummary}</p>
        
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => handleVote('up')}
            className={`flex items-center space-x-1 text-sm ${
              userVote === 'up' ? 'text-emerald-500' : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            <ThumbsUp className="h-4 w-4" />
            <span>Upvote</span>
          </button>
          <button
            onClick={() => handleVote('down')}
            className={`flex items-center space-x-1 text-sm ${
              userVote === 'down' ? 'text-red-500' : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            <ThumbsDown className="h-4 w-4" />
            <span>Downvote</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1 text-sm text-dark-400 hover:text-dark-200"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Comments ({comments.length})</span>
          </button>
          <Link 
            to={`/solution/${solution.id}`} 
            className="text-emerald-500 hover:text-emerald-400 font-medium flex items-center text-sm"
          >
            View full solution
            <ExternalLink className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {showComments && (
          <div className="mt-4 border-t border-dark-700 pt-4">
            <form onSubmit={handleAddComment} className="mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full bg-dark-800 border border-dark-600 rounded-lg p-3 text-dark-200 placeholder-dark-500 focus:outline-none focus:border-emerald-500"
                rows={2}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-dark-900 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
                >
                  Post Comment
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-dark-800 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <div className="font-medium text-dark-50">{comment.userName}</div>
                    <span className="mx-2 text-dark-500">•</span>
                    <div className="text-sm text-dark-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-dark-300">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolutionCard; 