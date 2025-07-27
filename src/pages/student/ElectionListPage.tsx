import React, { useState } from 'react';
import { Calendar, Users, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useElection } from '../../contexts/ElectionContext';
import { useLanguage } from '../../contexts/LanguageContext';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Navbar from '../../components/Navbar';

export default function ElectionListPage() {
  const navigate = useNavigate();
  const { elections } = useElection();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'ongoing' | 'upcoming' | 'closed'>('ongoing');

  const getElectionsByStatus = (status: typeof activeTab) => {
    switch (status) {
      case 'ongoing':
        return elections.filter(e => e.status.includes('ONGOING'));
      case 'upcoming':
        return elections.filter(e => e.status === 'UPCOMING');
      case 'closed':
        return elections.filter(e => e.status === 'CLOSED');
      default:
        return [];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONGOING_COMMIT':
        return 'text-brand-orange';
      case 'ONGOING_REVEAL':
        return 'text-warning-yellow';
      case 'UPCOMING':
        return 'text-success-green';
      case 'CLOSED':
        return 'text-text-muted';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ONGOING_COMMIT':
        return 'Commit Phase Active';
      case 'ONGOING_REVEAL':
        return 'Reveal Phase Active';
      case 'UPCOMING':
        return 'Upcoming';
      case 'CLOSED':
        return 'Closed';
      default:
        return status;
    }
  };

  const formatTimeRemaining = (timestamp: number) => {
    const now = Date.now();
    const diff = timestamp - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const tabs = [
    { key: 'ongoing', label: 'Ongoing', count: getElectionsByStatus('ongoing').length },
    { key: 'upcoming', label: 'Upcoming', count: getElectionsByStatus('upcoming').length },
    { key: 'closed', label: 'Closed', count: getElectionsByStatus('closed').length },
  ];

  const currentElections = getElectionsByStatus(activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-bg via-secondary-bg to-card-bg">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {t('elections')}
          </h1>
          <p className="text-text-secondary text-lg">
            Participate in secure, transparent campus elections
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <GlassCard className="p-2 inline-flex">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === tab.key
                    ? 'bg-brand-orange text-white shadow-lg'
                    : 'text-text-secondary hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.key 
                      ? 'bg-white/20 text-white' 
                      : 'bg-white/10 text-text-secondary'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </GlassCard>
        </div>

        {/* Elections Grid */}
        {currentElections.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentElections.map((election) => (
              <GlassCard key={election.id} className="p-6 hover:scale-105 transition-all duration-300">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                        {election.title}
                      </h3>
                      <p className={`text-sm font-medium ${getStatusColor(election.status)}`}>
                        {getStatusText(election.status)}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-text-secondary text-sm line-clamp-2">
                    {election.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-brand-orange" />
                      <div>
                        <p className="text-text-secondary text-xs">Candidates</p>
                        <p className="text-white font-semibold">{election.candidates.length}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-brand-orange" />
                      <div>
                        <p className="text-text-secondary text-xs">
                          {election.status === 'ONGOING_COMMIT' ? 'Commit Ends' : 
                           election.status === 'ONGOING_REVEAL' ? 'Reveal Ends' : 
                           election.status === 'UPCOMING' ? 'Starts In' : 'Ended'}
                        </p>
                        <p className="text-white font-semibold text-sm">
                          {election.status === 'ONGOING_COMMIT' 
                            ? formatTimeRemaining(election.phases.commitEnd)
                            : election.status === 'ONGOING_REVEAL'
                            ? formatTimeRemaining(election.phases.revealEnd)
                            : election.status === 'UPCOMING'
                            ? formatTimeRemaining(election.phases.commitStart)
                            : 'Complete'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex justify-between text-xs text-text-secondary mb-2">
                      <span>Commit Phase</span>
                      <span>Reveal Phase</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          election.status === 'ONGOING_COMMIT' 
                            ? 'bg-gradient-to-r from-brand-orange to-accent-orange w-1/2' 
                            : election.status === 'ONGOING_REVEAL'
                            ? 'bg-gradient-to-r from-success-green to-emerald-500 w-full'
                            : election.status === 'CLOSED'
                            ? 'bg-gradient-to-r from-text-muted to-gray-500 w-full'
                            : 'w-0'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => {
                      if (election.status === 'CLOSED') {
                        navigate(`/election/${election.id}/results`);
                      } else {
                        navigate(`/election/${election.id}/candidates`);
                      }
                    }}
                    variant={election.status.includes('ONGOING') ? 'primary' : 'secondary'}
                    className="w-full justify-between group"
                  >
                    <span>
                      {election.status === 'CLOSED' 
                        ? 'View Results' 
                        : election.status.includes('ONGOING')
                        ? 'Vote Now'
                        : 'View Details'
                      }
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <GlassCard className="p-12 text-center">
            <Calendar className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No {activeTab} elections
            </h3>
            <p className="text-text-secondary">
              {activeTab === 'ongoing' && 'No elections are currently active.'}
              {activeTab === 'upcoming' && 'No elections are scheduled for the future.'}
              {activeTab === 'closed' && 'No completed elections to display.'}
            </p>
          </GlassCard>
        )}
      </main>
    </div>
  );
}