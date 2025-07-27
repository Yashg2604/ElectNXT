import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Users, BarChart3, TrendingUp, Award } from 'lucide-react';
import { useElection } from '../../contexts/ElectionContext';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Navbar from '../../components/Navbar';

export default function ResultsPage() {
  const { id: electionId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { elections } = useElection();
  const [animatedResults, setAnimatedResults] = useState<Record<string, number>>({});

  const election = elections.find(e => e.id === electionId);

  useEffect(() => {
    // Animate vote counts
    if (election) {
      const timer = setTimeout(() => {
        const animated: Record<string, number> = {};
        election.candidates.forEach(candidate => {
          animated[candidate.id] = candidate.voteCount || 0;
        });
        setAnimatedResults(animated);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [election]);

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

  const totalVotes = election.totalVotes || 0;
  const sortedCandidates = [...election.candidates].sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
  const winner = sortedCandidates[0];

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
              Election Results
            </h1>
            <p className="text-text-secondary mt-2">{election.title}</p>
          </div>
        </div>

        {/* Winner Announcement */}
        {winner && totalVotes > 0 && (
          <GlassCard className="p-8 mb-8 text-center relative overflow-hidden">
            {/* Confetti Effect */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-4 w-4 h-4 bg-brand-orange rounded-full animate-bounce"></div>
              <div className="absolute top-8 right-8 w-3 h-3 bg-success-green rounded-full animate-bounce animation-delay-1000"></div>
              <div className="absolute bottom-4 left-8 w-2 h-2 bg-warning-yellow rounded-full animate-bounce animation-delay-2000"></div>
              <div className="absolute bottom-8 right-4 w-3 h-3 bg-accent-orange rounded-full animate-bounce animation-delay-500"></div>
            </div>

            <div className="relative z-10">
              <Trophy className="w-16 h-16 text-warning-yellow mx-auto mb-4 animate-pulse" />
              <h2 className="text-3xl font-bold text-white mb-2">Winner Declared!</h2>
              <div className="flex items-center justify-center space-x-4 mb-4">
                <img
                  src={winner.photo}
                  alt={winner.name}
                  className="w-20 h-20 rounded-full border-4 border-warning-yellow"
                />
                <div className="text-left">
                  <p className="text-2xl font-bold text-warning-yellow">{winner.name}</p>
                  <p className="text-brand-orange text-lg font-semibold">
                    {winner.voteCount} votes ({Math.round(((winner.voteCount || 0) / totalVotes) * 100)}%)
                  </p>
                </div>
              </div>
              <p className="text-text-secondary">
                Congratulations to the winner of {election.title}!
              </p>
            </div>
          </GlassCard>
        )}

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6 text-center">
            <Users className="w-8 h-8 text-brand-orange mx-auto mb-3" />
            <p className="text-2xl font-bold text-white">{totalVotes}</p>
            <p className="text-text-secondary">Total Votes</p>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <Award className="w-8 h-8 text-success-green mx-auto mb-3" />
            <p className="text-2xl font-bold text-white">{election.candidates.length}</p>
            <p className="text-text-secondary">Candidates</p>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-warning-yellow mx-auto mb-3" />
            <p className="text-2xl font-bold text-white">{election.turnout || 85}%</p>
            <p className="text-text-secondary">Turnout</p>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <BarChart3 className="w-8 h-8 text-accent-orange mx-auto mb-3" />
            <p className="text-2xl font-bold text-white">100%</p>
            <p className="text-text-secondary">Transparency</p>
          </GlassCard>
        </div>

        {/* Detailed Results */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Vote Distribution Chart */}
          <GlassCard className="p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-3 text-brand-orange" />
              Vote Distribution
            </h3>
            
            <div className="space-y-6">
              {sortedCandidates.map((candidate, index) => {
                const voteCount = animatedResults[candidate.id] || 0;
                const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                
                return (
                  <div key={candidate.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={candidate.photo}
                            alt={candidate.name}
                            className="w-12 h-12 rounded-full border-2 border-brand-orange/30"
                          />
                          {index === 0 && totalVotes > 0 && (
                            <Trophy className="w-4 h-4 text-warning-yellow absolute -top-1 -right-1" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-semibold">{candidate.name}</p>
                          <p className="text-text-secondary text-sm">
                            {voteCount} votes • {percentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-brand-orange">{voteCount}</p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-2000 ease-out ${
                          index === 0 
                            ? 'bg-gradient-to-r from-warning-yellow to-brand-orange' 
                            : 'bg-gradient-to-r from-brand-orange to-accent-orange'
                        }`}
                        style={{
                          width: `${percentage}%`,
                          animationDelay: `${index * 200}ms`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Candidate Details */}
          <GlassCard className="p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Candidate Performance</h3>
            
            <div className="space-y-6">
              {sortedCandidates.map((candidate, index) => (
                <div key={candidate.id} className="bg-white/5 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <img
                        src={candidate.photo}
                        alt={candidate.name}
                        className="w-16 h-16 rounded-full border-2 border-brand-orange/30"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-warning-yellow text-black' : 'bg-brand-orange text-white'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-2">{candidate.name}</h4>
                      <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                        {candidate.manifesto}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="text-brand-orange font-bold text-lg">
                              {animatedResults[candidate.id] || 0}
                            </p>
                            <p className="text-text-secondary text-xs">votes</p>
                          </div>
                          <div>
                            <p className="text-white font-bold text-lg">
                              {totalVotes > 0 ? (((animatedResults[candidate.id] || 0) / totalVotes) * 100).toFixed(1) : 0}%
                            </p>
                            <p className="text-text-secondary text-xs">share</p>
                          </div>
                        </div>
                        
                        {index === 0 && totalVotes > 0 && (
                          <div className="flex items-center space-x-1">
                            <Trophy className="w-4 h-4 text-warning-yellow" />
                            <span className="text-warning-yellow text-sm font-semibold">Winner</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Blockchain Verification */}
        <GlassCard className="p-8 mt-8">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Award className="w-6 h-6 mr-3 text-success-green" />
            Blockchain Verification
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-success-green/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Award className="w-6 h-6 text-success-green" />
              </div>
              <p className="text-white font-semibold mb-1">100% Verified</p>
              <p className="text-text-secondary text-sm">All votes verified on blockchain</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-orange/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-brand-orange" />
              </div>
              <p className="text-white font-semibold mb-1">Transparent</p>
              <p className="text-text-secondary text-sm">Public audit trail available</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-warning-yellow/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Users className="w-6 h-6 text-warning-yellow" />
              </div>
              <p className="text-white font-semibold mb-1">Secure</p>
              <p className="text-text-secondary text-sm">Cryptographically secured</p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button variant="secondary" size="sm">
              View on Block Explorer
            </Button>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}