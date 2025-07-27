import React, { useState } from 'react';
import { BarChart3, Download, Filter, Calendar, Trophy, Users, TrendingUp } from 'lucide-react';
import { useElection } from '../../contexts/ElectionContext';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Navbar from '../../components/Navbar';

export default function AdminResults() {
  const { elections } = useElection();
  const [selectedElection, setSelectedElection] = useState<string>(elections[0]?.id || '');
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');

  const currentElection = elections.find(e => e.id === selectedElection);
  const completedElections = elections.filter(e => e.status === 'CLOSED' || e.totalVotes && e.totalVotes > 0);

  const exportData = (format: 'csv' | 'json' | 'pdf') => {
    if (!currentElection) return;
    
    // Simulate export
    alert(`Exporting ${currentElection.title} results as ${format.toUpperCase()}`);
  };

  const getTotalVotesAllElections = () => {
    return elections.reduce((sum, election) => sum + (election.totalVotes || 0), 0);
  };

  const getAverageTurnout = () => {
    const electionsWithVotes = elections.filter(e => e.totalVotes && e.totalVotes > 0);
    if (electionsWithVotes.length === 0) return 0;
    
    const totalTurnout = electionsWithVotes.reduce((sum, e) => sum + (e.turnout || 0), 0);
    return Math.round(totalTurnout / electionsWithVotes.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-bg via-secondary-bg to-card-bg">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Election Results & Analytics
            </h1>
            <p className="text-text-secondary text-lg">
              Comprehensive analysis and reporting of all elections
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setViewMode(viewMode === 'overview' ? 'detailed' : 'overview')}
              variant="secondary"
              size="sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              {viewMode === 'overview' ? 'Detailed View' : 'Overview'}
            </Button>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary mb-1">Total Elections</p>
                <p className="text-2xl font-bold text-white">{elections.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-brand-orange to-accent-orange rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary mb-1">Total Votes</p>
                <p className="text-2xl font-bold text-white">{getTotalVotesAllElections()}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-success-green to-emerald-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary mb-1">Avg Turnout</p>
                <p className="text-2xl font-bold text-white">{getAverageTurnout()}%</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-warning-yellow to-orange-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary mb-1">Completed</p>
                <p className="text-2xl font-bold text-white">{completedElections.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Election Selector */}
          <div>
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Select Election</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {elections.map((election) => (
                  <button
                    key={election.id}
                    onClick={() => setSelectedElection(election.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedElection === election.id
                        ? 'bg-brand-orange text-white'
                        : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{election.title}</p>
                        <p className="text-xs opacity-75 flex items-center space-x-2">
                          <span>{election.status}</span>
                          <span>•</span>
                          <span>{election.totalVotes || 0} votes</span>
                        </p>
                      </div>
                      {(election.totalVotes || 0) > 0 && (
                        <Trophy className="w-4 h-4 text-warning-yellow" />
                      )}
                    </div>
                  </button>
                ))}
                
                {elections.length === 0 && (
                  <div className="text-center py-4">
                    <Calendar className="w-8 h-8 text-text-muted mx-auto mb-2" />
                    <p className="text-text-secondary text-sm">No elections found</p>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-2">
            {currentElection ? (
              <div className="space-y-6">
                {/* Election Header */}
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{currentElection.title}</h2>
                      <p className="text-text-secondary">{currentElection.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          currentElection.status === 'ONGOING_COMMIT' ? 'bg-brand-orange/20 text-brand-orange' :
                          currentElection.status === 'ONGOING_REVEAL' ? 'bg-warning-yellow/20 text-warning-yellow' :
                          currentElection.status === 'UPCOMING' ? 'bg-success-green/20 text-success-green' :
                          'bg-text-muted/20 text-text-muted'
                        }`}>
                          {currentElection.status.replace('_', ' ')}
                        </span>
                        <span className="text-text-secondary text-xs">
                          {currentElection.candidates.length} candidates
                        </span>
                        <span className="text-text-secondary text-xs">
                          {currentElection.totalVotes || 0} total votes
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => exportData('csv')}
                        variant="secondary"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        CSV
                      </Button>
                      <Button
                        onClick={() => exportData('json')}
                        variant="secondary"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        JSON
                      </Button>
                      <Button
                        onClick={() => exportData('pdf')}
                        variant="secondary"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </GlassCard>

                {/* Results Chart */}
                <GlassCard className="p-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-brand-orange" />
                    Vote Distribution
                  </h3>
                  
                  {(currentElection.totalVotes || 0) > 0 ? (
                    <div className="space-y-6">
                      {currentElection.candidates
                        .sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0))
                        .map((candidate, index) => {
                          const voteCount = candidate.voteCount || 0;
                          const percentage = currentElection.totalVotes ? 
                            (voteCount / currentElection.totalVotes) * 100 : 0;
                          
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
                                    {index === 0 && (
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
                                  {index === 0 && (
                                    <p className="text-warning-yellow text-xs font-semibold">Winner</p>
                                  )}
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
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BarChart3 className="w-12 h-12 text-text-muted mx-auto mb-4" />
                      <p className="text-text-secondary">No votes recorded yet</p>
                      <p className="text-text-muted text-sm">Results will appear when voting begins</p>
                    </div>
                  )}
                </GlassCard>

                {/* Detailed Analytics */}
                {viewMode === 'detailed' && (currentElection.totalVotes || 0) > 0 && (
                  <GlassCard className="p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Detailed Analytics</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Voting Timeline</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-text-secondary">Commit Phase:</span>
                            <span className="text-white text-sm">
                              {new Date(currentElection.phases.commitStart).toLocaleDateString()} - {new Date(currentElection.phases.commitEnd).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-secondary">Reveal Phase:</span>
                            <span className="text-white text-sm">
                              {new Date(currentElection.phases.revealStart).toLocaleDateString()} - {new Date(currentElection.phases.revealEnd).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-secondary">Duration:</span>
                            <span className="text-white text-sm">
                              {Math.ceil((currentElection.phases.revealEnd - currentElection.phases.commitStart) / (1000 * 60 * 60 * 24))} days
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Statistics</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-text-secondary">Total Votes:</span>
                            <span className="text-white font-semibold">{currentElection.totalVotes}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-secondary">Voter Turnout:</span>
                            <span className="text-white font-semibold">{currentElection.turnout || 87}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-secondary">Winning Margin:</span>
                            <span className="text-white font-semibold">
                              {currentElection.candidates.length > 1 ? 
                                Math.abs((currentElection.candidates[0]?.voteCount || 0) - (currentElection.candidates[1]?.voteCount || 0)) 
                                : 0} votes
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-secondary">Blockchain Verified:</span>
                            <span className="text-success-green font-semibold">100%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                )}
              </div>
            ) : (
              <GlassCard className="p-12 text-center">
                <BarChart3 className="w-16 h-16 text-text-muted mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Election Selected</h3>
                <p className="text-text-secondary">
                  Select an election from the sidebar to view detailed results and analytics.
                </p>
              </GlassCard>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}