import React from 'react';
import { Vote, Users, TrendingUp, Clock, Plus, BarChart3, Monitor, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useElection } from '../../contexts/ElectionContext';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Navbar from '../../components/Navbar';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { elections } = useElection();

  const stats = [
    {
      title: 'Total Elections',
      value: elections.length,
      icon: Vote,
      color: 'from-brand-orange to-accent-orange',
      change: '+2 this month',
    },
    {
      title: 'Active Elections',
      value: elections.filter(e => e.status.includes('ONGOING')).length,
      icon: Clock,
      color: 'from-success-green to-emerald-500',
      change: 'Currently running',
    },
    {
      title: 'Total Votes Cast',
      value: elections.reduce((sum, e) => sum + (e.totalVotes || 0), 0),
      icon: TrendingUp,
      color: 'from-warning-yellow to-orange-500',
      change: '+127 today',
    },
    {
      title: 'Average Turnout',
      value: '87%',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      change: '+5% from last election',
    },
  ];

  const quickActions = [
    {
      title: 'Create New Election',
      description: 'Set up a new election with candidates and voting phases',
      icon: Plus,
      action: () => navigate('/admin/create-election'),
      variant: 'primary' as const,
    },
    {
      title: 'Live Monitoring',
      description: 'Monitor ongoing elections and view real-time data',
      icon: Monitor,
      action: () => navigate('/admin/monitoring'),
      variant: 'secondary' as const,
    },
    {
      title: 'View Results',
      description: 'Access results and export election data',
      icon: BarChart3,
      action: () => navigate('/admin/results'),
      variant: 'secondary' as const,
    },
  ];

  const recentElections = elections.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-bg via-secondary-bg to-card-bg">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-text-secondary text-lg">
            Manage elections, monitor voting, and ensure democratic transparency
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <GlassCard key={index} className="p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-text-secondary text-sm">{stat.title}</p>
                </div>
              </div>
              <p className="text-brand-orange text-sm font-medium">{stat.change}</p>
            </GlassCard>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <GlassCard key={index} className="p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-orange to-accent-orange rounded-xl flex items-center justify-center flex-shrink-0">
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                  <p className="text-text-secondary text-sm mb-4">{action.description}</p>
                  <Button
                    onClick={action.action}
                    variant={action.variant}
                    size="sm"
                    className="w-full"
                  >
                    {action.title}
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Recent Elections */}
        <div className="grid lg:grid-cols-2 gap-8">
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Vote className="w-6 h-6 mr-3 text-brand-orange" />
              Recent Elections
            </h2>
            
            <div className="space-y-4">
              {recentElections.map((election) => (
                <div key={election.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{election.title}</h4>
                    <p className="text-text-secondary text-sm">
                      {election.candidates.length} candidates
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        election.status === 'ONGOING_COMMIT' ? 'bg-brand-orange/20 text-brand-orange' :
                        election.status === 'ONGOING_REVEAL' ? 'bg-warning-yellow/20 text-warning-yellow' :
                        election.status === 'UPCOMING' ? 'bg-success-green/20 text-success-green' :
                        'bg-text-muted/20 text-text-muted'
                      }`}>
                        {election.status.replace('_', ' ')}
                      </span>
                      <span className="text-text-secondary text-xs">
                        {election.totalVotes || 0} votes
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate('/admin/monitoring')}
                    variant="secondary"
                    size="sm"
                  >
                    View
                  </Button>
                </div>
              ))}
              
              {recentElections.length === 0 && (
                <div className="text-center py-8">
                  <Vote className="w-12 h-12 text-text-muted mx-auto mb-4" />
                  <p className="text-text-secondary">No elections created yet</p>
                  <Button
                    onClick={() => navigate('/admin/create-election')}
                    variant="primary"
                    size="sm"
                    className="mt-3"
                  >
                    Create First Election
                  </Button>
                </div>
              )}
            </div>
          </GlassCard>

          {/* System Status */}
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Monitor className="w-6 h-6 mr-3 text-success-green" />
              System Status
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Blockchain Network</p>
                  <p className="text-text-secondary text-sm">Ethereum Mainnet</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success-green rounded-full animate-pulse"></div>
                  <span className="text-success-green text-sm">Online</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">IPFS Gateway</p>
                  <p className="text-text-secondary text-sm">Manifesto Storage</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success-green rounded-full animate-pulse"></div>
                  <span className="text-success-green text-sm">Online</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Smart Contracts</p>
                  <p className="text-text-secondary text-sm">Election Factory</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success-green rounded-full animate-pulse"></div>
                  <span className="text-success-green text-sm">Deployed</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Database</p>
                  <p className="text-text-secondary text-sm">User & Election Data</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success-green rounded-full animate-pulse"></div>
                  <span className="text-success-green text-sm">Connected</span>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">System Health</span>
                  <span className="text-success-green font-bold">99.9%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div className="bg-gradient-to-r from-success-green to-emerald-500 h-2 rounded-full w-full"></div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}