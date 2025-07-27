import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Vote, Check, Clock, AlertCircle } from 'lucide-react';
import { useElection } from '../../contexts/ElectionContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function CandidateViewPage() {
  const { id: electionId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { elections, commitVote, revealVote, hasVoted, hasCommitted } = useElection();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [salt, setSalt] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCommitModal, setShowCommitModal] = useState(false);
  const [showRevealModal, setShowRevealModal] = useState(false);

  const election = elections.find(e => e.id === electionId);
  const voted = hasVoted(electionId!);
  const committed = hasCommitted(electionId!);

  useEffect(() => {
    // Generate random salt for commit-reveal
    if (!salt) {
      setSalt(Math.random().toString(36).substring(2, 15));
    }
  }, [salt]);

  if (!election) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-bg via-secondary-bg to-card-bg">
        <Navbar />
        <div className="flex items-center justify-center pt-20">
          <GlassCard className="p-8 text-center">
            <h2 className="text-xl font-semibold text-white mb-4">Election Not Found</h2>
            <Button onClick={() => navigate('/elections')} variant="primary">
              Back to Elections
            </Button>
          </GlassCard>
        </div>
      </div>
    );
  }

  const handleCommitVote = async () => {
    if (!selectedCandidate || !user?.hasNFT) return;
    
    setLoading(true);
    try {
      await commitVote(electionId!, selectedCandidate, salt);
      setShowCommitModal(false);
      // Show success with fireworks effect
      setTimeout(() => {
        alert('Vote committed successfully! Remember to reveal during the reveal phase.');
      }, 500);
    } catch (error) {
      console.error('Commit vote failed:', error);
      alert('Failed to commit vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRevealVote = async () => {
    const storedSalt = localStorage.getItem(`salt-${electionId}`);
    if (!storedSalt || !selectedCandidate) {
      alert('Salt not found. You may have cleared your browser data.');
      return;
    }

    setLoading(true);
    try {
      await revealVote(electionId!, selectedCandidate, storedSalt);
      setShowRevealModal(false);
      // Fireworks effect
      setTimeout(() => {
        alert('Vote revealed successfully! Thank you for participating.');
        navigate(`/election/${electionId}/results`);
      }, 500);
    } catch (error) {
      console.error('Reveal vote failed:', error);
      alert('Failed to reveal vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Processing your vote..." />;
  }

  const canCommit = election.status === 'ONGOING_COMMIT' && !committed && user?.hasNFT;
  const canReveal = election.status === 'ONGOING_REVEAL' && committed && !voted;
  const showResults = election.status === 'CLOSED' || voted;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-bg via-secondary-bg to-card-bg">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            onClick={() => navigate('/elections')}
            variant="secondary"
            size="sm"
            className="!p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {election.title}
            </h1>
            <p className="text-text-secondary mt-2">{election.description}</p>
          </div>
        </div>

        {/* Status Banner */}
        <GlassCard className="p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {voted ? (
                <>
                  <Check className="w-6 h-6 text-success-green" />
                  <div>
                    <p className="text-success-green font-semibold">You've voted!</p>
                    <p className="text-text-secondary text-sm">Your vote has been recorded on the blockchain</p>
                  </div>
                </>
              ) : committed ? (
                <>
                  <Clock className="w-6 h-6 text-warning-yellow" />
                  <div>
                    <p className="text-warning-yellow font-semibold">Vote Committed</p>
                    <p className="text-text-secondary text-sm">Remember to reveal during the reveal phase</p>
                  </div>
                </>
              ) : election.status === 'ONGOING_COMMIT' ? (
                <>
                  <Vote className="w-6 h-6 text-brand-orange animate-pulse" />
                  <div>
                    <p className="text-brand-orange font-semibold">Commit Phase Active</p>
                    <p className="text-text-secondary text-sm">Select a candidate and commit your vote</p>
                  </div>
                </>
              ) : election.status === 'ONGOING_REVEAL' ? (
                <>
                  <Eye className="w-6 h-6 text-warning-yellow" />
                  <div>
                    <p className="text-warning-yellow font-semibold">Reveal Phase Active</p>
                    <p className="text-text-secondary text-sm">Time to reveal your committed vote</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-6 h-6 text-text-muted" />
                  <div>
                    <p className="text-text-muted font-semibold">Election Closed</p>
                    <p className="text-text-secondary text-sm">View final results below</p>
                  </div>
                </>
              )}
            </div>

            {!user?.hasNFT && (
              <Button
                onClick={() => navigate('/voter-id')}
                variant="primary"
                size="sm"
                glow
              >
                Mint NFT to Vote
              </Button>
            )}
          </div>
        </GlassCard>

        {/* Candidates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {election.candidates.map((candidate) => (
            <GlassCard 
              key={candidate.id} 
              className={`p-6 transition-all duration-300 cursor-pointer ${
                selectedCandidate === candidate.id 
                  ? 'ring-2 ring-brand-orange bg-white/10' 
                  : 'hover:bg-white/5'
              }`}
              onClick={() => !voted && setSelectedCandidate(candidate.id)}
            >
              <div className="space-y-4">
                {/* Candidate Photo */}
                <div className="relative">
                  <img
                    src={candidate.photo}
                    alt={candidate.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-brand-orange/20"
                  />
                  {selectedCandidate === candidate.id && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Candidate Info */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">{candidate.name}</h3>
                  {showResults && candidate.voteCount !== undefined && (
                    <div className="mb-3">
                      <p className="text-2xl font-bold text-brand-orange">{candidate.voteCount}</p>
                      <p className="text-text-secondary text-sm">votes</p>
                    </div>
                  )}
                </div>

                {/* Manifesto */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Manifesto</h4>
                  <p className="text-text-secondary text-sm line-clamp-4">
                    {candidate.manifesto}
                  </p>
                </div>

                {/* IPFS Link */}
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    // In real app, this would open IPFS content
                    alert(`Opening manifesto from IPFS: ${candidate.manifestoCID}`);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Full Manifesto
                </Button>

                {/* Vote Progress Bar (for results) */}
                {showResults && election.totalVotes && election.totalVotes > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-secondary">Vote Share</span>
                      <span className="text-white">
                        {Math.round(((candidate.voteCount || 0) / election.totalVotes) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-brand-orange to-accent-orange h-2 rounded-full transition-all duration-1000"
                        style={{
                          width: `${((candidate.voteCount || 0) / election.totalVotes) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Action Buttons */}
        {(canCommit || canReveal) && (
          <div className="mt-8 text-center">
            <GlassCard className="p-6 max-w-md mx-auto">
              {canCommit && (
                <>
                  <h3 className="text-xl font-bold text-white mb-4">Ready to Vote?</h3>
                  <p className="text-text-secondary mb-6">
                    {selectedCandidate 
                      ? `You've selected ${election.candidates.find(c => c.id === selectedCandidate)?.name}` 
                      : 'Please select a candidate above'
                    }
                  </p>
                  <Button
                    onClick={() => setShowCommitModal(true)}
                    disabled={!selectedCandidate}
                    variant="primary"
                    size="lg"
                    glow
                    className="w-full"
                  >
                    <Vote className="w-5 h-5 mr-2" />
                    {t('cast.vote')}
                  </Button>
                </>
              )}

              {canReveal && (
                <>
                  <h3 className="text-xl font-bold text-white mb-4">Reveal Your Vote</h3>
                  <p className="text-text-secondary mb-6">
                    The reveal phase is active. Click below to reveal your committed vote.
                  </p>
                  <Button
                    onClick={() => setShowRevealModal(true)}
                    variant="primary"
                    size="lg"
                    glow
                    className="w-full"
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    Reveal Vote
                  </Button>
                </>
              )}
            </GlassCard>
          </div>
        )}

        {/* Commit Modal */}
        {showCommitModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <GlassCard className="p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Confirm Your Vote</h3>
              
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <p className="text-text-secondary mb-2">You are voting for:</p>
                <p className="text-xl font-bold text-brand-orange">
                  {election.candidates.find(c => c.id === selectedCandidate)?.name}
                </p>
              </div>

              <div className="bg-warning-yellow/10 border border-warning-yellow/20 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-warning-yellow mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-warning-yellow font-semibold mb-1">Important</p>
                    <p className="text-text-secondary text-sm">
                      Your vote will be committed to the blockchain. You'll need to reveal it during 
                      the reveal phase to make it count. Keep your browser data intact.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowCommitModal(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCommitVote}
                  variant="primary"
                  className="flex-1"
                  glow
                >
                  Commit Vote
                </Button>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Reveal Modal */}
        {showRevealModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <GlassCard className="p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Reveal Your Vote</h3>
              
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <p className="text-text-secondary mb-2">Revealing vote for:</p>
                <p className="text-xl font-bold text-brand-orange">
                  {election.candidates.find(c => localStorage.getItem(`candidate-${electionId}`) === c.id)?.name || 'Unknown'}
                </p>
              </div>

              <div className="bg-success-green/10 border border-success-green/20 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-success-green mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-success-green font-semibold mb-1">Final Step</p>
                    <p className="text-text-secondary text-sm">
                      This will permanently record your vote on the blockchain and make it count 
                      towards the final results.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowRevealModal(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRevealVote}
                  variant="success"
                  className="flex-1"
                  glow
                >
                  Reveal Vote
                </Button>
              </div>
            </GlassCard>
          </div>
        )}
      </main>
    </div>
  );
}