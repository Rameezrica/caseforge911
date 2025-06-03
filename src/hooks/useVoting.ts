import { useStore } from '../store/useStore';

export const useVoting = (id: string) => {
  const { votes, setVote } = useStore();
  const currentVote = votes[id];
  
  const handleVote = (vote: 'up' | 'down') => {
    if (currentVote === vote) {
      setVote(id, null);
    } else {
      setVote(id, vote);
    }
  };
  
  return {
    currentVote,
    handleUpvote: () => handleVote('up'),
    handleDownvote: () => handleVote('down')
  };
};