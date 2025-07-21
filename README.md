# KAIZEN

Kaizen proposes a new framework for acquiring and validating knowledge. It is a decentralized protocol that replaces the passive logic of content consumption with an active, intelligent, and community-driven learning experience.

Through the combination of artificial intelligence and collective curation, users build personalized learning paths, while the network itself validates and enhances the most effective routes to mastery. Individual progress is transparently recorded and recognized through NFT certificates, which securely, verifiably, and permanently attest to proficiency in specific skills.

More than just an educational platform, Kaizen lays the foundation for a decentralized, interoperable, and reputation-based knowledge infrastructure.

---

## Solution Overview

The advancement of artificial intelligence has radically transformed access to knowledge. Tools like ChatGPT, YouTube, and online course platforms are empowering a new generation of autonomous learners — a movement growing rapidly, as highlighted by HolonIQ reports.

However, this revolution faces a structural limitation: the lack of reliable mechanisms to authenticate learning acquired outside of traditional institutions.

Kaizen was created to bridge this gap. It combines artificial intelligence, collective curation, and decentralized infrastructure to transform individual learning journeys into verifiable records. Each path is built with AI support, validated by the community, and registered as NFT certificates that securely, auditably, and interoperably prove the real competencies acquired by each user.

---

## Core Features

### 1. Kai — AI-Powered Content Engine

Kai is the intelligent core of Kaizen, designed to turn any information source into a structured and meaningful learning experience:

- **Interactive & Contextual Chat**: Acts as an overlay tutor, allowing users to input topics, links, or documents (e.g. PDFs) to start a learning journey.
- **Automated Path Generation**: Builds personalized tracks with quizzes, flashcards, mind maps, and summaries.
- **Incentivized Smart Curation**: Evaluates the quality of generated paths and suggests publishing them to the community — high-quality contributions are rewarded with $KOIN tokens.
- **Modular Visual Editing**: Users can visually rearrange and edit content through an intuitive block/card interface.

---

### 2. Collaborative & Community Ecosystem

Kaizen is not just a platform — it’s a living ecosystem where knowledge evolves through collective intelligence:

- **Community Feed**: Explore published learning paths, track trends, and engage with other learners.
- **Knowledge Forking**: Any public path can be forked, allowing others to adapt, enhance, or expand it.
- **Integrated Contextual Forums**: Discussions, feedback, and debates are embedded directly within content modules.

---

### 3. Knowledge Validation & Reputation (Proof-of-Learning)

Kaizen introduces a reliable infrastructure to authenticate acquired skills, replacing generic certificates with immutable technical proof:

- **NFT Certificates**: Completing a track generates an NFT that verifiably proves mastery.
- **Social Recognition**: NFT credentials can be shared on LinkedIn and other networks, with verified blockchain authenticity.
- **Incentivized Sharing**: Users are rewarded with $KOIN tokens for promoting their earned credentials.

---

### 4. User Experience & Impact Monitoring

The user journey is carefully designed to maximize clarity, autonomy, and long-term value:

- **Universal User Profile**: A personal hub aggregating created tracks, earned NFTs, preferences, and history.
- **Content Creator Dashboard**: Insightful metrics on views, forks, and rewards for each created learning path.
- **Guided Onboarding**: An interactive tutorial walks new users through the full platform potential step-by-step.

---

## Technologies Used

### Languages & Frameworks

- **Motoko** – Native language for Internet Computer, used to build decentralized backend canisters.
- **TypeScript** – Statically typed JavaScript superset used for frontend scalability.
- **JavaScript** – Browser-side logic and library interoperability.
- **React** – Declarative library for building reactive modular UIs.
- **Next.js** – React framework with hybrid rendering and routing, powered by Turbopack for fast builds.

### UI & Styling

- **Tailwind CSS** – Utility-first CSS framework for fast, responsive design.
- **CSS** – Custom styling support on top of Tailwind.
- **next-themes** – Theme-switching library with dark/light mode support.

### Web3 & Internet Computer

- **DFX** – CLI tool for building, testing, and deploying canisters.
- `@dfinity/agent`, `@dfinity/candid`, `@dfinity/auth-client`, `@dfinity/ledger-icp`, `@dfinity/principal`, `@dfinity/utils` – Official DFINITY libraries for agent communication, authentication, serialization, and identity handling.

### Identity & Integrations

- **@nfid/identitykit** – NFID-based authentication as an alternative to Internet Identity.
- **Gemini API (Google)** – Integration with generative AI for content creation (summaries, quizzes, etc.).

### DevTools & Infrastructure

- **TypeScript 5** – Modern features and type safety.
- **dotenv** – Environment variable management.
- **path (Node.js)** – File path manipulation utility.

---

## Project Setup

### Requirements

| OS              | Requirements                                                      |
| --------------- | ----------------------------------------------------------------- |
| **Linux/macOS** | Node.js 18.x, DFX CLI, npm or yarn                                |
| **Windows**     | WSL 2 with Ubuntu 20.04+, Node.js 18.x (inside WSL), DFX CLI, Git |

> ⚠️ **Note**: DFX runs only on Linux/macOS. Windows users must use WSL (Windows Subsystem for Linux).

---

### Installation Guide

#### 💻 Linux/macOS

```bash
git clone https://github.com/your-username/kaizen.git
cd kaizen
npm install
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
dfx start --background
dfx deploy
npm run dev
```

#### 🪟 Windows (via WSL)

1. Install WSL 2 (Microsoft Official Guide)

2. Use Ubuntu 20.04+ from Microsoft Store

3. Open the WSL terminal and run:

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs build-essential
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
sudo apt install git

git clone https://github.com/your-username/kaizen.git
cd kaizen
npm install
dfx start --background
dfx deploy
npm run dev
```

**Check:** Visit http://localhost:3000 to view the running app.

---

## Data Storage Setup

> ⚠️This project does not use a traditional relational database. All data storage is decentralized and handled through Internet Computer canisters.

### 📦 Storage Structure

- Canisters written in Motoko store persistent application state and logic.

- User data (tracks, certificates, tokens) is kept directly inside canisters and accessed via authenticated calls.

- Frontend communicates via @dfinity/agent using the Candid interface.

### 🔐 Architecture Benefits

- **Fully decentralized:** No external databases or cloud servers required.

- **Automatic persistence:** Handled natively by the ICP protocol.

- **Built-in security:** Identity, isolation, and data integrity by design.

## Deploying to ICP Mainnet

### Prerequisites

- Internet Identity account

- ICP Wallet with sufficient cycles

- DFX CLI installed and authenticated

### Deployment Steps

```bash
dfx identity new <your-identity>  # only if needed
dfx identity use <your-identity>
dfx identity get-principal
dfx wallet --network ic
dfx build --network ic
dfx deploy --network ic
```

## Application Flows

[to fill in]

## Demo

_Colocar vídeo da demo_
_Colocar Dapp funcional_
_Colocar vídeo da apresentação_

## System Architecture

[to fill in]

_Colocar o diagrama de arquitetura_

## Folder Structure and Files

```
Kaizen/
│
├── backend/               # Motoko Canisters for Internet Computer
│   ├── kai/               # Main canister with Gemini AI integration
│   │   └── main.mo
│   └── tracks/            # Canister for track management de trilhas
│       └── main.mo
├── src/                   # Next.js application source code
│   ├── app/               # Next.js 13+ App Router
│   │   ├── favicon.ico
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Application root layout
│   │   └── page.tsx       # Home page
│   ├── lib/               # Utilities and settings
│   │   └── agent.ts       # IC agent configuration for communication with canisters
│   ├── providers/         # React providers (Theme, Authentication)
│   │   └── index.tsx
│   └── declarations/      # TypeScript types automatically generated by dfx
├── public/                # Static files
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── documents/             # Project documentation
│   ├── wad.md             # Main analysis and requirements document
│   └── assets/            # Documentation images and resources
│       ├── canvas-value.png
│       ├── five-forces.png
│       └── persona-*.png
├── .gitignore             # File to ignore files in Git
├── package.json           # Node.js dependency manager
├── package-lock.json      # Dependency lock file
├── dfx.json               # DFX (Internet Computer SDK) configuration
├── next.config.js         # Next.js configuration
└── README.md              # Project documentation
```

## Release History

0.1.0 - XX/XX/2025

## Development Team

[to fill in]

## 📄 License

This project is licensed under the terms of the [Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/).  
You are free to use, modify, and distribute this software — including for commercial purposes — as long as you retain the copyright notices and attribution.

> See the [LICENSE](./LICENSE) file for more details.
