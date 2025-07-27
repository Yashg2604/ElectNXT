import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Mail, Globe, Shield, Zap, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import LanguageSelector from '../components/LanguageSelector';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Add this to extend the Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Removed connectWallet
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [email, setEmail] = useState('');

  const handleWalletConnect = async () => {
    setLoading(true);
    try {
      if (typeof window.ethereum === 'undefined') {
        alert('MetaMask is not installed. Please install the MetaMask extension and try again.');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      if (!accounts || accounts.length === 0) {
        alert('Wallet connection denied.');
        return;
      }

      const walletAddress = accounts[0];
      await login(walletAddress);
      navigate('/dashboard');
    } catch (error) {
      console.error('Wallet connection failed:', error);
      alert('Something went wrong while connecting the wallet.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = () => {
    if (email) {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-bg via-secondary-bg to-card-bg">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-brand-orange rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-accent-orange rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-brand-red rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/10">
            <img
              src="/electnxt-logo.jpg"
              alt="ElectNXT Logo"
              className="w-8 h-8 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">ElectNXT</h1>
        </div>
        <LanguageSelector />
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Vote Smart. Vote Secure. Vote On-Chain.
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Button
              onClick={handleWalletConnect}
              className="group relative overflow-hidden w-full sm:w-auto"
              variant="primary"
              size="lg"
            >
              <Wallet className="w-5 h-5 mr-2" />
              {t('connect.wallet')}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </Button>

            <Button
              onClick={() => setShowEmailLogin(!showEmailLogin)}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Mail className="w-5 h-5 mr-2" />
              {t('login.email')}
            </Button>
          </div>

          {/* Email Login Form */}
          {showEmailLogin && (
            <GlassCard className="max-w-md mx-auto mt-8 p-6 animate-fade-in">
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
                />
                <Button onClick={handleEmailLogin} className="w-full" variant="primary">
                  Continue with Email
                </Button>
                <p className="text-sm text-text-muted text-center">
                  Demo: Use any email to continue
                </p>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          <GlassCard className="p-8 text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-orange to-accent-orange rounded-full mx-auto mb-6 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Blockchain Security</h3>
            <p className="text-text-secondary">
              Immutable voting records with cryptographic verification ensure complete transparency and trust.
            </p>
          </GlassCard>

          <GlassCard className="p-8 text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-success-green to-brand-orange rounded-full mx-auto mb-6 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Real-time Results</h3>
            <p className="text-text-secondary">
              Watch live voting progress with instant updates and beautiful visualizations.
            </p>
          </GlassCard>

          <GlassCard className="p-8 text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-orange to-brand-red rounded-full mx-auto mb-6 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Student-Centric</h3>
            <p className="text-text-secondary">
              Designed for Gen-Z with intuitive interface, multilingual support, and mobile-first approach.
            </p>
          </GlassCard>
        </div>

        {/* Demo Admin Access */}
        <div className="mt-20 text-center">
          <GlassCard className="inline-block p-6">
            <p className="text-text-secondary mb-4">Admin Demo Access</p>
            <Button
              onClick={() => navigate('/admin/login')}
              variant="secondary"
              size="sm"
            >
              Access Admin Panel
            </Button>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
