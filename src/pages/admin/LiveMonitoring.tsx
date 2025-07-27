import React, { useState, useEffect } from 'react';
import { Activity, Users, TrendingUp, Clock, Eye, AlertCircle, Zap } from 'lucide-react';
import { useElection } from '../../contexts/ElectionContext';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Navbar from '../../components/Navbar';

interface ActivityLog {
  id: string;
  type: 'commit' | 'reveal' | 'mint';
  timestamp: Date;
  voter: string;
  electionId?: string;
  candidate?: string;
}

export default function LiveMonitoring() {
  const { elections } = useElection();
  const [selectedElection, setSelectedElection] = useState<string>('');
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLive, setIsLive] = useState(true);

  const currentElection = elections.find(e => e.id === selectedElection);
  const activeElections = elections.filter(e => (e.status ?? '').includes('ONGOING'));

  useEffect(() => {
    if (!selectedElection && activeElections.length > 0) {
      setSelectedElection(activeElections[0].id);
    }
  }, [activeElections, selectedElection]);

  // Simulate real-time activity
  useEffect(() => {
    if (!isLive || !selectedElection) return;

    const interval = setInterval(() => {
      const types: ActivityLog['type'][] = ['commit', 'reveal', 'mint'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      
      const newLog: ActivityLog = {
        id: Date.now().toString(),
        type: randomType,
        timestamp: new Date(),
        voter: `0x${Math.random().toString(16).substring(2, 10)}...`,
        electionId: selectedElection,
        candidate: randomType !== 'mint' ? `Candidate ${Math.floor(Math.random() * 3) + 1}` : undefined,
      };

      setActivityLogs(prev => [newLog, ...prev.slice(0, 49)]); // Keep last 50 logs
    }, Math.random() * 5000 + 2000); // Random interval 2-7 seconds

    return () => clearInterval(interval);
  }, [isLive, selectedElection]);

  const stats = [
    {
      title: 'Active Elections',
      value: activeElections.length,
      icon: Clock,
      color: 'from-brand-orange to-accent-orange',
    },
    {
      title: 'Total Participants',
      value: elections.reduce((sum, e) => sum + (e.totalVotes || 0), 0),
      icon: Users,
      color: 'from-success-green to-emerald-500',
    },
    {
      title: 'Votes This Hour',
      value: activityLogs.filter(log => 
        Date.now() - log.timestamp.getTime() < 3600000
      ).length,
      icon: TrendingUp,
      color: 'from-warning-yellow to-orange-500',
    },
    {
      title: 'System Status',
      value: 'Online',
      icon: Activity,
      color: 'from-success-green to-emerald-500',
    },
  ];

  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'commit':
        return '📝';
      case 'reveal':
        return '🔓';
      case 'mint':
        return '🎫';
    }
  };

  const getActivityColor = (type: ActivityLog['type']) => {
    switch (type) {
      case 'commit':
        return 'text-brand-orange';
      case 'reveal':
        return 'text-success-green';
      case 'mint':
        return 'text-warning-yellow';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-bg via-secondary-bg to-card-bg">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Live Monitoring
            </h1>
            <p className="text-text-secondary text-lg">
              Real-time election activity and system monitoring
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-success-green animate-pulse' : 'bg-text-muted'}`}></div>
              <span className="text-white text-sm">{isLive ? 'Live' : 'Paused'}</span>
            </div>
            <Button
              onClick={() => setIsLive(!isLive)}
              variant={isLive ? 'danger' : 'success'}
              size="sm"
            >
              {isLive ? 'Pause' : 'Resume'}
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
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

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Election Selector & Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Election Selector */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Select Election</h3>
              <div className="space-y-2">
                {activeElections.map((election) => (
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
                        <p className="text-xs opacity-75">
                          {(election.status ?? '').replace('_', ' ')}
                        </p>
                      </div>
                      {selectedElection === election.id && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </button>
                ))}
                
                {activeElections.length === 0 && (
                  <div className="text-center py-4">
                    <AlertCircle className="w-8 h-8 text-text-muted mx-auto mb-2" />
                    <p className="text-text-secondary text-sm">No active elections</p>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Election Details */}
            {currentElection && (
              <GlassCard className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Election Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-text-secondary text-sm">Current Phase</p>
                    <p className="text-white font-semibold">
                      {(currentElection.status ?? '').replace('ONGOING_', '').replace('_', ' ')} Phase
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-text-secondary text-sm">Candidates</p>
                    <p className="text-white font-semibold">{currentElection.candidates.length}</p>
                  </div>
                  
                  <div>
                    <p className="text-text-secondary text-sm">Total Votes</p>
                    <p className="text-white font-semibold">{currentElection.totalVotes || 0}</p>
                  </div>
                  
                  <div>
                    <p className="text-text-secondary text-sm">Phase Ends</p>
                    <p className="text-white font-semibold">
                      {(currentElection.status ?? '') === 'ONGOING_COMMIT' 
                        ? new Date(currentElection.phases.commitEnd).toLocaleString()
                        : new Date(currentElection.phases.revealEnd).toLocaleString()
                      }
                    </p>
                  </div>
                  
                  {/* Live Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-text-secondary">Progress</span>
                      <span className="text-brand-orange">Live</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-brand-orange to-accent-orange h-2 rounded-full w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            )}
          </div>

          {/* Live Activity Feed */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6 h-[600px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-brand-orange" />
                  Live Activity Feed
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-text-secondary text-sm">{activityLogs.length} events</span>
                  <Button variant="secondary" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Export Logs
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3">
                {activityLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className="flex items-start space-x-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors animate-fade-in"
                  >
                    <div className="text-2xl">{getActivityIcon(log.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`font-medium ${getActivityColor(log.type)}`}>
                          {log.type === 'commit' && 'Vote Committed'}
                          {log.type === 'reveal' && 'Vote Revealed'}
                          {log.type === 'mint' && 'NFT Voter ID Minted'}
                        </p>
                        <span className="text-text-muted text-xs">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm">
                        Voter: <span className="font-mono">{log.voter}</span>
                        {log.candidate && (
                          <span> • Candidate: <span className="text-white">{log.candidate}</span></span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
                
                {activityLogs.length === 0 && (
                  <div className="text-center py-12">
                    <Activity className="w-12 h-12 text-text-muted mx-auto mb-4" />
                    <p className="text-text-secondary">Waiting for activity...</p>
                    <p className="text-text-muted text-sm">Live events will appear here</p>
                  </div>
                )}
              </div>

              {/* Activity Summary */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-brand-orange">
                      {activityLogs.filter(log => log.type === 'commit').length}
                    </p>
                    <p className="text-text-secondary text-sm">Commits</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-success-green">
                      {activityLogs.filter(log => log.type === 'reveal').length}
                    </p>
                    <p className="text-text-secondary text-sm">Reveals</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-warning-yellow">
                      {activityLogs.filter(log => log.type === 'mint').length}
                    </p>
                    <p className="text-text-secondary text-sm">NFT Mints</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
}