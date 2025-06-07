import { useState } from 'react';

export interface VoteState {
  upvoted: boolean;
  downvoted: boolean;
  votes: number;
}

export const useVoting = (initialVotes: number = 0) => {
  const [voteState, setVoteState] = useState<VoteState>({
    upvoted: false,
    downvoted: false,
    votes: initialVotes
  });

  const handleUpvote = () => {
    setVoteState(prev => {
      if (prev.upvoted) {
        return { ...prev, upvoted: false, votes: prev.votes - 1 };
      } else {
        const adjustment = prev.downvoted ? 2 : 1;
        return { upvoted: true, downvoted: false, votes: prev.votes + adjustment };
      }
    });
  };

  const handleDownvote = () => {
    setVoteState(prev => {
      if (prev.downvoted) {
        return { ...prev, downvoted: false, votes: prev.votes + 1 };
      } else {
        const adjustment = prev.upvoted ? 2 : 1;
        return { upvoted: false, downvoted: true, votes: prev.votes - adjustment };
      }
    });
  };

  return {
    ...voteState,
    handleUpvote,
    handleDownvote
  };
};