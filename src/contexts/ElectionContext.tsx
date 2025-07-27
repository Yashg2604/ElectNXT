// ✅ ElectionContext.tsx (No localStorage for vote state — in-memory only)
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ElectionStatus = 'UPCOMING' | 'ONGOING_COMMIT' | 'ONGOING_REVEAL' | 'CLOSED';

export type Candidate = {
  id: string;
  name: string;
  photo: string;
  manifesto: string;
  manifestoCID: string;
  voteCount: number;
};

export type Election = {
  id: string;
  title: string;
  description: string;
  phases: {
    commitStart: number;
    commitEnd: number;
    revealStart: number;
    revealEnd: number;
  };
  candidates: Candidate[];
  status?: ElectionStatus;
  totalVotes: number;
  turnout: number;
};

export function computeElectionStatus(e: Election): ElectionStatus {
  const now = Date.now();
  const { commitStart, commitEnd, revealStart, revealEnd } = e.phases;
  if (now < commitStart) return 'UPCOMING';
  if (now < commitEnd) return 'ONGOING_COMMIT';
  if (now < revealEnd) return 'ONGOING_REVEAL';
  return 'CLOSED';
}

interface ElectionContextType {
  elections: Election[];
  currentElection: Election | null;
  setCurrentElection: (election: Election | null) => void;
  createElection: (data: Omit<Election, 'id' | 'status'>) => Promise<string>;
  commitVote: (electionId: string, candidateId: string, salt: string) => Promise<void>;
  revealVote: (electionId: string, candidateId: string, salt: string) => Promise<void>;
  hasVoted: (electionId: string) => boolean;
  hasCommitted: (electionId: string) => boolean;
}

const ElectionContext = createContext<ElectionContextType | undefined>(undefined);

export function ElectionProvider({ children }: { children: ReactNode }) {
  const [elections, setElections] = useState<Election[]>([]);
  const [currentElection, setCurrentElection] = useState<Election | null>(null);
  const [votes, setVotes] = useState<Record<string, { committed: boolean; revealed: boolean; candidateId?: string }>>({});

  // Load elections from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('elections');
    if (saved) {
      try {
        const parsed: Election[] = JSON.parse(saved);
        const updated = parsed.map(e => ({
          ...e,
          status: computeElectionStatus(e),
        }));
        setElections(updated);
      } catch (err) {
        console.error('Failed to parse elections from localStorage:', err);
      }
    }
  }, []);

  // Save elections to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('elections', JSON.stringify(elections));
  }, [elections]);

  // Live update statuses every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      setElections(prev => prev.map(e => ({ ...e, status: computeElectionStatus(e) })));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const commitVote = async (electionId: string, candidateId: string, salt: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    setVotes(prev => ({ ...prev, [electionId]: { committed: true, revealed: false, candidateId } }));
  };

  const revealVote = async (electionId: string, candidateId: string, salt: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    setVotes(prev => {
      const updated = { ...prev[electionId], revealed: true };
      return { ...prev, [electionId]: updated };
    });
  };

  const hasVoted = (electionId: string) => votes[electionId]?.revealed ?? false;
  const hasCommitted = (electionId: string) => votes[electionId]?.committed ?? false;

  const createElection = async (electionData: Omit<Election, 'id' | 'status'>) => {
    const base: Election = {
      ...electionData,
      id: `election-${Date.now()}`,
      totalVotes: 0,
      turnout: 0,
    };
    const newElection = { ...base, status: computeElectionStatus(base) };
    setElections(prev => [...prev, newElection]);
    return newElection.id;
  };

  return (
    <ElectionContext.Provider
      value={{
        elections,
        currentElection,
        setCurrentElection,
        createElection,
        commitVote,
        revealVote,
        hasVoted,
        hasCommitted,
      }}
    >
      {children}
    </ElectionContext.Provider>
  );
}

export function useElection() {
  const context = useContext(ElectionContext);
  if (!context) throw new Error('useElection must be used within ElectionProvider');
  return context;
}
