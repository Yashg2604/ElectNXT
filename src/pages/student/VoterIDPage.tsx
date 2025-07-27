import React, { useState } from 'react';
import { Download, Share2, QrCode, Shield, Wallet } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function VoterIDPage() {
  const { user, mintNFT } = useAuth();
  const { t } = useLanguage();
  const [minting, setMinting] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleMintNFT = async () => {
    setMinting(true);
    try {
      await mintNFT();
    } catch (error) {
      console.error('Minting failed:', error);
      alert('Failed to mint NFT. Please try again.');
    } finally {
      setMinting(false);
    }
  };

  const generateQRCode = () => {
    // In a real app, this would generate an actual QR code
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <text x="100" y="100" text-anchor="middle" fill="black" font-size="12">
          Voter ID: ${user?.id}
        </text>
        <text x="100" y="120" text-anchor="middle" fill="black" font-size="10">
          Wallet: ${user?.wallet?.substring(0, 10)}...
        </text>
      </svg>
    `)}`;
  };

  if (minting) {
    return <LoadingSpinner text="Minting your NFT Voter ID..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-bg via-secondary-bg to-card-bg">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Digital Voter ID
          </h1>
          <p className="text-text-secondary text-lg">
            Your secure, blockchain-verified voting identity
          </p>
        </div>

        {!user?.hasNFT ? (
          // Minting Section
          <div className="max-w-2xl mx-auto">
            <GlassCard className="p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-brand-orange to-accent-orange rounded-full mx-auto mb-6 flex items-center justify-center">
                <Shield className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4">
                {t('mint.nft')}
              </h2>
              
              <p className="text-text-secondary mb-8 max-w-md mx-auto">
                Create your unique, non-transferable digital voter ID as an NFT. This ensures your eligibility and prevents vote manipulation.
              </p>

              <div className="bg-white/5 rounded-lg p-6 mb-8">
                <h3 className="text-white font-semibold mb-4">Your Voter Information</h3>
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Name:</span>
                    <span className="text-white">{user?.name || 'Student User'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Wallet:</span>
                    <span className="text-white font-mono text-sm">
                      {user?.wallet ? `${user.wallet.substring(0, 6)}...${user.wallet.substring(-4)}` : 'Not connected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Status:</span>
                    <span className="text-success-green">Eligible</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleMintNFT}
                variant="primary"
                size="lg"
                glow
                className="mb-4"
              >
                <Wallet className="w-5 h-5 mr-2" />
                {t('mint.nft')}
              </Button>
              
              <p className="text-text-muted text-sm">
                This action will create a unique NFT in your wallet
              </p>
            </GlassCard>
          </div>
        ) : (
          // NFT Voter ID Card
          <div className="max-w-3xl mx-auto">
            <GlassCard className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Voter ID Card */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-brand-orange via-accent-orange to-brand-red p-6 rounded-2xl text-white shadow-2xl">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-lg font-bold">ElectNXT</h3>
                        <p className="text-sm opacity-90">Digital Voter ID</p>
                      </div>
                      <Shield className="w-8 h-8 opacity-90" />
                    </div>
                    
                    <div className="mb-6">
                      <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl font-bold">
                          {user?.name?.charAt(0) || 'S'}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-center">{user?.name || 'Student User'}</h4>
                      <p className="text-center text-sm opacity-90">Verified Voter</p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Token ID:</span>
                        <span className="font-mono">#{Math.floor(Math.random() * 10000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Network:</span>
                        <span>Ethereum</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="text-green-300">Active</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* NFT Badge */}
                  <div className="absolute -top-2 -right-2 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    NFT
                  </div>
                </div>

                {/* Controls & QR */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Card Actions</h3>
                    <div className="space-y-3">
                      <Button 
                        onClick={() => setShowQR(!showQR)}
                        variant="secondary" 
                        className="w-full justify-start"
                      >
                        <QrCode className="w-5 h-5 mr-3" />
                        {showQR ? 'Hide QR Code' : 'Show QR Code'}
                      </Button>
                      
                      <Button variant="secondary" className="w-full justify-start">
                        <Download className="w-5 h-5 mr-3" />
                        Download JSON
                      </Button>
                      
                      <Button variant="secondary" className="w-full justify-start">
                        <Share2 className="w-5 h-5 mr-3" />
                        Share Verification
                      </Button>
                    </div>
                  </div>

                  {/* QR Code */}
                  {showQR && (
                    <div className="bg-white p-4 rounded-lg">
                      <img 
                        src={generateQRCode()} 
                        alt="Voter ID QR Code" 
                        className="w-full max-w-[200px] mx-auto"
                      />
                      <p className="text-center text-xs text-gray-600 mt-2">
                        Scan for verification
                      </p>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3">NFT Metadata</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Contract:</span>
                        <span className="text-white font-mono text-xs">0xabc...def</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">IPFS:</span>
                        <span className="text-white font-mono text-xs">Qm123...xyz</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Minted:</span>
                        <span className="text-white">{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Security Notice */}
            <GlassCard className="p-6 mt-6">
              <div className="flex items-start space-x-4">
                <Shield className="w-6 h-6 text-brand-orange mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold mb-2">Security Notice</h4>
                  <p className="text-text-secondary text-sm">
                    Your NFT Voter ID is a Soulbound Token (SBT) that cannot be transferred or sold. 
                    It serves as your permanent proof of voting eligibility and maintains the integrity 
                    of the electoral process.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </main>
    </div>
  );
}