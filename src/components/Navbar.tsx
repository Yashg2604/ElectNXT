import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Vote, CreditCard, BarChart3, Settings, LogOut, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import Button from './ui/Button';
import LanguageSelector from './LanguageSelector';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const isActive = (path: string) => location.pathname === path;

  const studentNavItems = [
    { path: '/dashboard', icon: Home, label: t('dashboard') },
    { path: '/elections', icon: Vote, label: t('elections') },
    { path: '/voter-id', icon: CreditCard, label: 'Voter ID' },
  ];

  const adminNavItems = [
    { path: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/admin/create-election', icon: Vote, label: 'Create Election' },
    { path: '/admin/monitoring', icon: BarChart3, label: 'Monitoring' },
    { path: '/admin/results', icon: BarChart3, label: 'Results' },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : studentNavItems;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/5 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            {/* <div className="w-10 h-10 bg-gradient-to-br from-brand-orange to-accent-orange rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div> */}
            <img
              src="/electnxt-logo.jpg"
              alt="ElectNXT Logo"
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-xl font-bold text-white">ElectNXT</h1>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-brand-orange text-white shadow-lg'
                    : 'text-text-secondary hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-white text-sm font-medium">
                  {user?.name || (user?.role === 'admin' ? 'Admin' : 'Student')}
                </p>
                <p className="text-text-muted text-xs capitalize">{user?.role}</p>
              </div>

              <Button
                onClick={logout}
                variant="secondary"
                size="sm"
                className="!p-2"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 flex space-x-1 overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
                isActive(item.path)
                  ? 'bg-brand-orange text-white'
                  : 'text-text-secondary hover:text-white hover:bg-white/10'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}