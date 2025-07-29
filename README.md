# NOTE TO OUR JUDGES:- PLEASE WATCH THE DEMO VIDEO FIRST FOR BETTER UNDERSTANDING OF THE FLOW.
## Demo link- https://drive.google.com/file/d/1AUXvkemvf8uAfN2Vd7PX89M6tjCOi84I/view?usp=sharing
## https://elect-nxt.vercel.app/
Note- CampusBot will not work on vercel as we used a custom api key. You will have to add your own API key and run it on localhost to make it work.


# ElectNXT

**Version:** 1.0.0  
**Description:** Blockchain-based campus voting platform.

ElectNXT is a blockchain-based voting platform ensuring:
- Immutable NFT-based Digital Voter IDs
- On-chain vote recording for full auditability
- Anonymized, verifiable ballots
- Real-time result dashboards
- QR-based hybrid check-in for offline support
- AI-powered multilingual CampusBot for voter guidance
- Smart Campaign Pages with manifesto immutability



---

##  Features

- Web3 wallet integration  
- Blockchain-backed vote validation  
- Role-based access for admins and voters  
- Clean and responsive UI using TailwindCSS  
- Fast build using Vite and TypeScript  

---

##  Tech Stack
- **Framework**: Vite  
- **Language**: TypeScript  
- **Styling**: Tailwind CSS + PostCSS  
- **Linting**: ESLint  
- **Config**: TSConfig, Vite, PostCSS
- **Blockchain**: Solidity Smart Contracts,IPFS Pinata Cloud for Storage

---

##  Project Setup

### 1. Clone the Repo

git clone https://github.com/Yashg2604/ElectNXT.git
cd ElectNXT

### 2. CampusBot activation
TO ACCESS OUR AI CAMPUSBOT- GO TO src\components\CampusBot.tsx AND USE YOUR OWN API KEY AT LINE NUMBER 50

### 3. Install dependencies 

npm install

### 2. Start Development Server
npm run dev

## Folder Structure
```
ElectNXT/
├── public/                     # Public assets
├── src/                        # Main frontend source code (React/TS)
│   ├── components/             # Reusable UI components
│   ├── pages/                  # Route-based page components
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Utility functions/helpers
│   ├── App.tsx                 # Root React component
│   └── main.tsx                # App entry point
├── index.html                  # Root HTML file
├── package.json                # Project metadata and dependencies
├── package-lock.json           # Exact versions of dependencies
├── tailwind.config.js          # Tailwind CSS config
├── postcss.config.js           # PostCSS config for Tailwind
├── tsconfig.json               # TypeScript config
├── tsconfig.app.json           # TS config for app
├── tsconfig.node.json          # TS config for Node parts (if any)
├── vite.config.ts              # Vite build tool config
└── README.md                   # Project documentation
```
