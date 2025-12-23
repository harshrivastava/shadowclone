<div align="center">

# 🌌 KRACHET

### Your AI Executive Assistant

*Neural-powered productivity orchestration with voice interaction and intelligent automation*

[![Electron](https://img.shields.io/badge/Electron-28.0.0-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.3.5-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Architecture](#-architecture) • [Development](#-development)

---

</div>

## ✨ Overview

**KRACHET** (formerly ShadowClone AI) is a next-generation desktop AI assistant that transforms how you interact with your computer. Built on cutting-edge AI technology, KRACHET combines voice interaction, intelligent automation, and neural-powered decision making to create a seamless productivity experience.

Unlike traditional assistants, KRACHET learns your patterns, understands your intent, and operates as your digital executive—handling tasks, managing workflows, and making intelligent decisions on your behalf.

## 🚀 Features

### 🧠 **Neural Synthesis**
Advanced cognitive modeling that replicates your decision patterns with extreme fidelity. KRACHET learns your intent, not just your commands.

- **Contextual Understanding**: Maintains conversation context across sessions
- **Pattern Recognition**: Learns from your interactions to provide personalized responses
- **Adaptive Behavior**: Evolves with your workflow preferences

### 🎤 **Voice Interaction**
Natural voice commands powered by state-of-the-art speech recognition and synthesis.

- **Wake Word Detection**: Activate with "Hey Krachet" or custom wake words
- **Real-time Transcription**: Powered by Groq Whisper for accurate speech-to-text
- **Voice Responses**: Natural text-to-speech for hands-free operation
- **Continuous Listening**: Optional always-on mode for seamless interaction

### 💬 **Intelligent Chat Interface**
A beautiful, modern chat interface for text-based interactions.

- **Streaming Responses**: Real-time AI responses with typing indicators
- **Rich Message History**: Persistent conversation tracking
- **Multi-modal Input**: Text, voice, or hybrid interaction modes
- **Command Recognition**: Automatic detection of action requests and workflows

### 🎨 **Premium UI/UX**
Enterprise-grade design with attention to every detail.

- **Glassmorphism Effects**: Modern, translucent UI elements
- **Smooth Animations**: Micro-interactions that feel alive
- **Dark Mode Native**: Optimized for extended use
- **Responsive Layout**: Adapts to any screen size

### 🔒 **Quantum Security**
Your data never leaves your machine.

- **Local Processing**: All AI operations run on your device
- **Encrypted Storage**: Enterprise-grade data protection
- **Privacy First**: No telemetry, no tracking, no cloud dependencies

## 📦 Installation

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+ (for backend services)
- **Windows** 10/11 (macOS and Linux support coming soon)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/shadowclone.git
cd shadowclone

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your API keys

# Run in development mode
npm run dev
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here

# Optional: Custom wake word settings
WAKE_WORD=hey krachet
```

## 🎯 Usage

### Launching the Application

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production build
npm start
```

### Voice Commands

Activate KRACHET with your wake word and try:

- *"Hey Krachet, what's on my schedule today?"*
- *"Send an email to John about the project update"*
- *"Create a new workflow for daily standup"*
- *"Search for React hooks documentation"*

### Chat Interface

Click the **Launch Workspace** button to access the command center where you can:

- Type messages directly to KRACHET
- Use the microphone button for voice input
- View conversation history
- Manage your user profile and preferences

## 🏗️ Architecture

### Tech Stack

```
┌─────────────────────────────────────────┐
│           Frontend (React)              │
│  ┌─────────────────────────────────┐   │
│  │  Components & UI (TypeScript)   │   │
│  │  - CommandCenter                │   │
│  │  - LandingPage                  │   │
│  │  - Voice Controls               │   │
│  └─────────────────────────────────┘   │
│                 ↕                       │
│  ┌─────────────────────────────────┐   │
│  │   Services & Hooks              │   │
│  │  - ChatService (Groq SDK)       │   │
│  │  - useSpeech (Web Speech API)   │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
                  ↕
┌─────────────────────────────────────────┐
│        Electron Main Process            │
│  - IPC Communication                    │
│  - Window Management                    │
│  - System Integration                   │
└─────────────────────────────────────────┘
                  ↕
┌─────────────────────────────────────────┐
│         AI Backend (Groq)               │
│  - LLaMA 3.3 70B Model                  │
│  - Whisper Transcription                │
│  - Streaming Responses                  │
└─────────────────────────────────────────┘
```

### Project Structure

```
shadowclone/
├── electron/           # Electron main and preload scripts
│   ├── main.ts        # Main process entry point
│   └── preload.ts     # Preload script for IPC
├── src/
│   ├── components/    # React components
│   │   ├── pages/     # Page components
│   │   ├── ui/        # Reusable UI components
│   │   └── layout/    # Layout components
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API and service layers
│   ├── styles/        # Global styles
│   └── types/         # TypeScript type definitions
├── public/            # Static assets
└── dist/              # Build output
```

## 🛠️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run watch` | Watch mode for webpack |
| `npm run compile:electron` | Compile Electron TypeScript files |
| `npm run clean` | Clean build artifacts |

### Building from Source

```bash
# Compile Electron files
npm run compile:electron

# Build React app
webpack --mode production

# Package for distribution
electron-builder
```

### Code Style

This project uses:
- **TypeScript** for type safety
- **ESLint** for code linting (configuration in progress)
- **Prettier** for code formatting (configuration in progress)

## 🎨 Customization

### Theming

KRACHET uses Tailwind CSS with custom design tokens. Modify `tailwind.config.js` to customize:

- Color palette
- Typography
- Spacing and sizing
- Animations and transitions

### Voice Settings

Customize wake word detection and voice synthesis in the settings panel or by modifying environment variables.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Groq** for lightning-fast LLM inference
- **Electron** for cross-platform desktop capabilities
- **React** and the amazing open-source community
- **Lucide Icons** for beautiful iconography

## 📧 Contact

Have questions or feedback? Reach out:

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/shadowclone/issues)
- **Twitter**: [@YourTwitter](https://twitter.com/yourtwitter)
- **Email**: your.email@example.com

---

<div align="center">

**Built with ❤️ by developers, for developers**

*KRACHET - Your AI Executive Assistant*

</div>
