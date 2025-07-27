import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Vote, Trophy, Settings, LogOut, CreditCard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useElection } from '../../contexts/ElectionContext';
import { useLanguage } from '../../contexts/LanguageContext';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Navbar from '../../components/Navbar';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { elections } = useElection();
  const { t } = useLanguage();

  const ongoingElections = elections.filter(e => e.status.includes('ONGOING'));
  const upcomingElections = elections.filter(e => e.status === 'UPCOMING');

  const stats = [
    {
      title: 'Active Elections',
      value: ongoingElections.length,
      icon: Vote,
      color: 'from-brand-orange to-accent-orange',
    },
    {
      title: 'Upcoming Elections',
      value: upcomingElections.length,
      icon: Trophy,
      color: 'from-success-green to-emerald-500',
    },
    {
      title: 'NFT Status',
      value: user?.hasNFT ? 'Minted' : 'Not Minted',
      icon: CreditCard,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-bg via-secondary-bg to-card-bg">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="text-text-secondary text-lg">
            Your secure voting dashboard is ready. Make your voice heard.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <GlassCard key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-4">
              {!user?.hasNFT && (
                <Button
                  onClick={() => navigate('/voter-id')}
                  className="w-full justify-start"
                  variant="primary"
                  glow
                >
                  <CreditCard className="w-5 h-5 mr-3" />
                  {t('mint.nft')}
                </Button>
              )}
              
              <Button
                onClick={() => navigate('/elections')}
                className="w-full justify-start"
                variant="secondary"
              >
                <Vote className="w-5 h-5 mr-3" />
                View {t('elections')}
              </Button>
              
              {user?.hasNFT && (
                <Button
                  onClick={() => navigate('/voter-id')}
                  className="w-full justify-start"
                  variant="secondary"
                >
                  <Wallet className="w-5 h-5 mr-3" />
                  View NFT Voter ID
                </Button>
              )}
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {ongoingElections.length > 0 ? (
                ongoingElections.slice(0, 3).map((election) => (
                  <div key={election.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{election.title}</p>
                      <p className="text-text-secondary text-sm">
                        {election.status === 'ONGOING_COMMIT' ? 'Commit Phase' : 'Reveal Phase'}
                      </p>
                    </div>
                    <Button
                      onClick={() => navigate(`/election/${election.id}/candidates`)}
                      size="sm"
                      variant="primary"
                    >
                      View
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-text-secondary">No active elections at the moment.</p>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Upcoming Elections Preview */}
        {upcomingElections.length > 0 && (
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Upcoming Elections</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingElections.map((election) => (
                <div key={election.id} className="p-4 bg-white/5 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">{election.title}</h3>
                  <p className="text-text-secondary text-sm mb-3">{election.description}</p>
                  <p className="text-brand-orange text-sm">
                    Starts: {new Date(election.phases.commitStart).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </main>
    </div>
  );
}