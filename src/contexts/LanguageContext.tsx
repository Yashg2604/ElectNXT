import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'bn';

interface Translations {
  [key: string]: {
    [K in Language]: string;
  };
}

const translations: Translations = {
  'hero.title': {
    en: 'Secure, Transparent Campus Voting Begins Here',
    hi: 'सुरक्षित, पारदर्शी कैंपस मतदान यहाँ शुरू होता है',
    bn: 'নিরাপদ, স্বচ্ছ ক্যাম্পাস ভোটিং এখানে শুরু হয়'
  },
  'hero.subtitle': {
    en: 'Blockchain-powered democracy for the digital generation',
    hi: 'डिजिटल पीढ़ी के लिए ब्लॉकचेन-संचालित लोकतंत्र',
    bn: 'ডিজিটাল প্রজন্মের জন্য ব্লকচেইন-চালিত গণতন্ত্র'
  },
  'connect.wallet': {
    en: 'Connect Wallet',
    hi: 'वॉलेट कनेक्ट करें',
    bn: 'ওয়ালেট কানেক্ট করুন'
  },
  'login.email': {
    en: 'Login via Email',
    hi: 'ईमेल से लॉगिन करें',
    bn: 'ইমেইল দিয়ে লগইন করুন'
  },
  'cast.vote': {
    en: 'Cast Vote',
    hi: 'वोट डालें',
    bn: 'ভোট দিন'
  },
  'mint.nft': {
    en: 'Mint NFT Voter ID',
    hi: 'NFT वोटर आईडी मिंट करें',
    bn: 'NFT ভোটার আইডি মিন্ট করুন'
  },
  'elections': {
    en: 'Elections',
    hi: 'चुनाव',
    bn: 'নির্বাচন'
  },
  'candidates': {
    en: 'Candidates',
    hi: 'प्रत्याशी',
    bn: 'প্রার্থী'
  },
  'results': {
    en: 'Results',
    hi: 'परिणाम',
    bn: 'ফলাফল'
  },
  'dashboard': {
    en: 'Dashboard',
    hi: 'डैशबोर्ड',
    bn: 'ড্যাশবোর্ড'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}