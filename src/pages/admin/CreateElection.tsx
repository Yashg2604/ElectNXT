import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Plus, X, Upload, Eye, ArrowRight, ArrowLeft } from 'lucide-react';
import { useElection, Candidate } from '../../contexts/ElectionContext';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface ElectionForm {
  title: string;
  description: string;
  commitStart: string;
  commitEnd: string;
  revealStart: string;
  revealEnd: string;
}

export default function CreateElection() {
  const navigate = useNavigate();
  const { createElection } = useElection();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<ElectionForm>({
    title: '',
    description: '',
    commitStart: '',
    commitEnd: '',
    revealStart: '',
    revealEnd: '',
  });

  const [candidates, setCandidates] = useState<Omit<Candidate, 'voteCount'>[]>([]);
  const [voterList, setVoterList] = useState<string>('');
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    photo: '',
    manifesto: '',
  });

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Election details and timeline' },
    { number: 2, title: 'Candidates', description: 'Add candidates and manifestos' },
    { number: 3, title: 'Voters', description: 'Upload eligible voter list' },
    { number: 4, title: 'Review', description: 'Review and deploy' },
  ];

  const handleInputChange = (field: keyof ElectionForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addCandidate = () => {
    if (!newCandidate.name || !newCandidate.manifesto) {
      alert('Please fill in all candidate details');
      return;
    }

    const candidate: Omit<Candidate, 'voteCount'> = {
      id: `candidate-${Date.now()}`,
      name: newCandidate.name,
      photo: newCandidate.photo || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      manifesto: newCandidate.manifesto,
      manifestoCID: `QmHash${Math.random().toString(36).substring(7)}`,
    };

    setCandidates(prev => [...prev, candidate]);
    setNewCandidate({ name: '', photo: '', manifesto: '' });
  };

  const removeCandidate = (id: string) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const electionData = {
        title: formData.title,
        description: formData.description,
        phases: {
          commitStart: new Date(formData.commitStart).getTime(),
          commitEnd: new Date(formData.commitEnd).getTime(),
          revealStart: new Date(formData.revealStart).getTime(),
          revealEnd: new Date(formData.revealEnd).getTime(),
        },
        candidates: candidates as Candidate[],
        totalVotes: 0,
        turnout: 0,
      };

      const electionId = await createElection(electionData);
      alert('Election created successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Failed to create election:', error);
      alert('Failed to create election. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.description && formData.commitStart && 
               formData.commitEnd && formData.revealStart && formData.revealEnd;
      case 2:
        return candidates.length >= 2;
      case 3:
        return voterList.length > 0;
      default:
        return true;
    }
  };

  if (loading) {
    return <LoadingSpinner text="Creating election..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-bg via-secondary-bg to-card-bg">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Create New Election
          </h1>
          <p className="text-text-secondary text-lg">
            Set up a secure, transparent campus election
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center space-x-2 ${
                  currentStep >= step.number ? 'text-brand-orange' : 'text-text-muted'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep >= step.number 
                      ? 'bg-gradient-to-r from-brand-orange to-accent-orange text-white' 
                      : 'bg-white/10 text-text-muted'
                  }`}>
                    {step.number}
                  </div>
                  <div className="hidden sm:block">
                    <p className="font-medium">{step.title}</p>
                    <p className="text-xs text-text-muted">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-20 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-brand-orange' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <GlassCard className="p-8">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Election Details</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Election Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                    placeholder="e.g., Student Council Elections 2025"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent h-20 resize-none"
                    placeholder="Brief description of the election"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Voting Timeline</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Commit Phase Start *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.commitStart}
                      onChange={(e) => handleInputChange('commitStart', e.target.value)}
                      className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Commit Phase End *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.commitEnd}
                      onChange={(e) => handleInputChange('commitEnd', e.target.value)}
                      className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Reveal Phase Start *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.revealStart}
                      onChange={(e) => handleInputChange('revealStart', e.target.value)}
                      className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Reveal Phase End *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.revealEnd}
                      onChange={(e) => handleInputChange('revealEnd', e.target.value)}
                      className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Candidates */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Add Candidates</h2>
              
              {/* Add New Candidate */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">New Candidate</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    value={newCandidate.name}
                    onChange={(e) => setNewCandidate(prev => ({...prev, name: e.target.value}))}
                    className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                    placeholder="Candidate Name"
                  />
                  <input
                    type="url"
                    value={newCandidate.photo}
                    onChange={(e) => setNewCandidate(prev => ({...prev, photo: e.target.value}))}
                    className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                    placeholder="Photo URL (optional)"
                  />
                </div>
                <textarea
                  value={newCandidate.manifesto}
                  onChange={(e) => setNewCandidate(prev => ({...prev, manifesto: e.target.value}))}
                  className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent h-24 resize-none mb-4"
                  placeholder="Candidate Manifesto"
                />
                <Button onClick={addCandidate} variant="primary" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Candidate
                </Button>
              </div>

              {/* Candidates List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Added Candidates ({candidates.length})
                </h3>
                
                {candidates.map((candidate) => (
                  <div key={candidate.id} className="bg-white/5 rounded-lg p-4 flex items-start space-x-4">
                    <img
                      src={candidate.photo}
                      alt={candidate.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-brand-orange/30"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{candidate.name}</h4>
                      <p className="text-text-secondary text-sm mt-1 line-clamp-2">
                        {candidate.manifesto}
                      </p>
                      <p className="text-brand-orange text-xs mt-2">
                        IPFS: {candidate.manifestoCID}
                      </p>
                    </div>
                    <Button
                      onClick={() => removeCandidate(candidate.id)}
                      variant="danger"
                      size="sm"
                      className="!p-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                {candidates.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-text-muted mx-auto mb-4" />
                    <p className="text-text-secondary">No candidates added yet</p>
                    <p className="text-text-muted text-sm">Add at least 2 candidates to continue</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Voters */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Eligible Voters</h2>
              
              <div className="bg-white/5 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Upload Voter List</h3>
                  <Button variant="secondary" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload CSV
                  </Button>
                </div>
                
                <p className="text-text-secondary text-sm mb-4">
                  Paste wallet addresses (one per line) or upload a CSV file with wallet addresses.
                </p>
                
                <textarea
                  value={voterList}
                  onChange={(e) => setVoterList(e.target.value)}
                  className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent h-40 resize-none font-mono text-sm"
                  placeholder="0x1234567890123456789012345678901234567890&#10;0xabcdefabcdefabcdefabcdefabcdefabcdefabcd&#10;0x9876543210987654321098765432109876543210"
                />
                
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-text-secondary text-sm">
                    {voterList.split('\n').filter(line => line.trim()).length} addresses detected
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Review & Deploy</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Election Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Title:</span>
                        <span className="text-white">{formData.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Description:</span>
                        <span className="text-white line-clamp-1">{formData.description}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Candidates:</span>
                        <span className="text-white">{candidates.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Eligible Voters:</span>
                        <span className="text-white">
                          {voterList.split('\n').filter(line => line.trim()).length}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Timeline</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Commit Start:</span>
                        <span className="text-white">
                          {new Date(formData.commitStart).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Commit End:</span>
                        <span className="text-white">
                          {new Date(formData.commitEnd).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Reveal Start:</span>
                        <span className="text-white">
                          {new Date(formData.revealStart).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Reveal End:</span>
                        <span className="text-white">
                          {new Date(formData.revealEnd).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-4">Deployment Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success-green rounded-full"></div>
                      <span className="text-text-secondary">Smart contract deployment</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success-green rounded-full"></div>
                      <span className="text-text-secondary">IPFS manifesto storage</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success-green rounded-full"></div>
                      <span className="text-text-secondary">Database initialization</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success-green rounded-full"></div>
                      <span className="text-text-secondary">Notification setup</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <p className="text-warning-yellow text-sm mb-2">⚠️ Important</p>
                    <p className="text-text-secondary text-xs">
                      Once deployed, election details cannot be modified. Please review carefully.
                    </p>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={handleSubmit}
                variant="success"
                size="lg"
                className="w-full"
                glow
              >
                Deploy Election to Blockchain
              </Button>
            </div>
          )}
        </GlassCard>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            onClick={prevStep}
            variant="secondary"
            disabled={currentStep === 1}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="text-center">
            <p className="text-text-secondary text-sm">
              Step {currentStep} of {steps.length}
            </p>
          </div>
          
          {currentStep < 4 ? (
            <Button
              onClick={nextStep}
              variant="primary"
              disabled={!isStepValid()}
              className="flex items-center"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <div className="w-20" /> // Spacer
          )}
        </div>
      </main>
    </div>
  );
}