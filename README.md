<div align="center">

# 🗳️ VoteWise — AI-Powered Voter Education Platform

### *Empowering every citizen to vote with confidence*

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Now-brightgreen?style=for-the-badge)](https://anubhabjana.github.io/votewise/)
&nbsp;
[![Google AI](https://img.shields.io/badge/Powered_by-Gemini_2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
&nbsp;
[![Firebase](https://img.shields.io/badge/Backend-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite 8](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

---

**VoteWise** is a Progressive Web Application that leverages **Google's Gemini 2.5 Flash AI** to make election education accessible, inclusive, and engaging for **every** citizen — from first-time 18-year-old voters to elderly citizens who have never used a smartphone.

Built for a demographic of **18–80 years** across India, VoteWise breaks language barriers with support for **23 Indian languages**, provides **Text-to-Speech** for low-literacy users, and features a dedicated **First-Timer Mode** that simplifies complex electoral concepts into plain language.

</div>

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [Google Technologies Used](#-google-technologies-used)
- [Feature Deep Dive](#-feature-deep-dive)
  - [🤖 AI Chatbot (Gemini + Google Search Grounding)](#-ai-chatbot-assistant--gemini-25-flash--google-search-grounding)
  - [📸 AI Document Scanner (Gemini Vision)](#-ai-document-scanner--gemini-vision-multimodal)
  - [🗣️ Voice Input & Output](#-voice-input--output)
  - [📊 AI Voter Readiness Report (Structured Output)](#-ai-voter-readiness-report--gemini-structured-output)
  - [🌍 Multilingual Translation Engine](#-multilingual-translation-engine-23-languages)
  - [🎓 First-Timer Mode](#-first-timer-mode)
  - [📅 Election Lifecycle Timeline](#-election-lifecycle-timeline)
  - [✅ Voter Eligibility Checker](#-voter-eligibility-checker)
  - [🧠 Interactive Quiz with Gamification](#-interactive-quiz-with-gamification)
  - [🚫 Myth vs Fact Cards](#-myth-vs-fact-cards)
  - [📍 Inside the Polling Booth (8-Step Guide)](#-inside-the-polling-booth-8-step-visual-guide)
  - [🔊 Text-to-Speech (TTS)](#-text-to-speech-tts)
  - [♿ Accessibility Menu](#-accessibility-menu)
  - [📱 Progressive Web App (PWA)](#-progressive-web-app-pwa)
  - [🎮 Demo Mode](#-demo-mode)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Problem Statement

> Millions of eligible voters, especially **first-time voters, elderly citizens, rural populations**, and **non-English speakers**, lack access to clear, trustworthy, and understandable information about the election process. This leads to **low voter turnout, misinformation, and civic disengagement**.

Key challenges:
- **Language barriers** — India has 22 official languages; most election information is only in English or Hindi.
- **Digital literacy gaps** — Elderly and rural users struggle with complex interfaces.
- **Misinformation** — Social media spreads myths about EVMs, voting rights, and procedures.
- **First-time voter anxiety** — Young voters don't know what to expect at a polling booth.

---

## 💡 Our Solution

VoteWise is an **AI-first, accessibility-first** platform that addresses every challenge above:

| Challenge | VoteWise Solution |
|---|---|
| Language barriers | Real-time translation into **23 Indian languages** via Gemini AI + Google Translate, with pre-generated static locale files for instant switching |
| Digital literacy gaps | **Text-to-Speech** audio for all content, **adjustable text sizes**, **high-contrast mode**, and large touch targets (44px minimum) |
| Misinformation | **Myth vs Fact** carousel with shareable fact cards backed by Election Commission data |
| First-time voter anxiety | Dedicated **First-Timer Mode** that rewrites all content in simple, jargon-free language |
| Complex procedures | **8-step interactive Polling Booth guide** with a detailed VVPAT machine diagram |
| General awareness | **AI chatbot** for instant Q&A + **gamified quizzes** with streaks, scoring, and social sharing |

---

## 🔧 Google Technologies Used

| Technology | How It's Used | Gemini Feature |
|---|---|---|
| **Gemini 2.5 Flash** (`@google/genai`) | Powers the AI chatbot for real-time voter Q&A with context-aware, jargon-free responses. Also serves as the primary translation engine for batch UI string translation. | `generateContent`, System Instructions |
| **Gemini Vision (Multimodal)** | Analyzes photos of Voter ID (EPIC) cards, extracts personal details, and verifies voter eligibility from document images. | **Multimodal Input** (Image + Text) |
| **Gemini Google Search Grounding** | Chatbot automatically grounds answers about current elections, schedules, and candidates using live Google Search data with source citations. | **Grounding with Google Search** |
| **Gemini Structured Output** | Generates personalized Voter Readiness Reports as strict JSON with scores, strengths, gaps, and action items. | **`responseMimeType: 'application/json'`** |
| **Web Speech API** | Bidirectional voice I/O: Speech Recognition for voice questions in 12+ Indian languages + Text-to-Speech for audio responses. | Speech Recognition + TTS |
| **Firebase Authentication** | Anonymous authentication for tracking user quiz progress without requiring sign-up. | — |
| **Firebase Realtime Database** | Stores quiz scores, streaks, and user progress data. | — |
| **Google Cloud Translation API** | Primary translation tier for paid API users; the app also gracefully falls back to the free Google Translate endpoint when no key is configured. | — |

---

## 🔍 Feature Deep Dive

### 🤖 AI Chatbot Assistant — Gemini 2.5 Flash + Google Search Grounding

> **File:** [`src/components/features/Chatbot.jsx`](src/components/features/Chatbot.jsx) · [`src/services/gemini.js`](src/services/gemini.js)

The chatbot is the heart of VoteWise. It uses **Gemini 2.5 Flash** with a carefully tuned system prompt that:

- Restricts responses strictly to **civic education** — no political opinions, no party endorsements, no election predictions.
- Dynamically adjusts language complexity when **First-Timer Mode** is enabled, converting technical terms (EVM, VVPAT, Form 6) into plain analogies.
- Maintains full **conversation history** for contextual follow-up questions.
- Responds in the user's language when prompted in Hindi or any other language.
- **🔍 Google Search Grounding** — When users ask about current events (*"When is the next election?"*, *"Who are the candidates?"*), Gemini automatically queries Google Search and returns **grounded answers with source citations** displayed as clickable links.

**Key UX Details:**
- 🎯 **Suggested Quick Questions** — Pre-built prompts appear on first load (e.g., *"How to register to vote?"*, *"What is an EVM?"*).
- 🔊 **Per-message TTS** — Every AI response has a hover-reveal 🔊 button for audio playback.
- 🎤 **Voice Input** — Microphone button for speech-to-text in 12+ Indian languages using Web Speech Recognition API.
- 🌐 **Source Citations** — Grounded responses show source URLs with globe icons for transparency.
- 💬 **Markdown rendering** — Bold text and structured responses are parsed and displayed cleanly.
- ⏳ **Loading skeleton** — Animated bouncing dots indicate the AI is thinking.

---

### 📸 AI Document Scanner — Gemini Vision (Multimodal)

> **File:** [`src/components/features/VoterIDScanner.jsx`](src/components/features/VoterIDScanner.jsx) · [`src/services/gemini.js`](src/services/gemini.js)

A groundbreaking feature that uses **Gemini's multimodal capabilities** to analyze physical ID documents:

- **Camera Capture** — Take a live photo of your Voter ID using the device camera with an alignment guide overlay.
- **File Upload** — Upload an existing photo of any ID card (Voter ID, Aadhaar, Driving License).
- **AI Extraction** — Gemini Vision reads the document and extracts: Name, Father/Husband Name, Age/DOB, EPIC Number, Constituency, State, and Gender.
- **Validity Check** — Determines if the document is a valid Indian Voter ID (EPIC) card.
- **Eligibility Assessment** — Provides a brief AI-generated eligibility summary based on the visible information.
- **Actionable Tips** — Returns personalized suggestions like *"Consider updating your address if you have moved"*.

Uses `responseMimeType: 'application/json'` for **structured output** to ensure reliable data extraction.

---

### 🗣️ Voice Input & Output

> **File:** [`src/components/features/Chatbot.jsx`](src/components/features/Chatbot.jsx) · [`src/hooks/useTextToSpeech.js`](src/hooks/useTextToSpeech.js)

Full **bidirectional voice interface** for users who cannot read or type:

- **🎤 Speech-to-Text Input** — Press the microphone button and speak your question in any supported Indian language. Uses the Web Speech Recognition API with BCP 47 locale mapping (`hi-IN`, `bn-IN`, `ta-IN`, etc.).
- **🔊 Text-to-Speech Output** — Every AI response has a listen button. Speech rate is set to 0.9x for elderly comprehension.
- **Visual Indicators** — Pulsing red microphone animation during active listening, "Voice Ready" badge in the chatbot header.
- **Graceful Degradation** — Voice buttons are hidden on unsupported browsers.

This creates a **fully hands-free voting education experience** — a user can ask a question by voice in Hindi, receive the answer in Hindi text, and listen to it read aloud.

---

### 📊 AI Voter Readiness Report — Gemini Structured Output

> **File:** [`src/components/features/VoterReadinessReport.jsx`](src/components/features/VoterReadinessReport.jsx) · [`src/services/gemini.js`](src/services/gemini.js)

After completing the quiz, users can generate a **personalized AI-powered Voter Readiness Report**:

- **Readiness Score** (0-100%) with color-coded circular badge
- **Fun Badge** — AI-generated title like *"Democracy Champion 🏅"* or *"Rising Voter 🌱"*
- **Strengths** — What the user already knows well
- **Knowledge Gaps** — Areas that need improvement
- **Action Items** — Prioritized next steps with official URLs (e.g., `voters.eci.gov.in`)
- **Motivational Message** — Personalized encouragement

Powered by Gemini's **structured JSON output** (`responseMimeType: 'application/json'`) to guarantee consistent, parseable reports every time.

---

### 🌍 Multilingual Translation Engine (23 Languages)

> **File:** [`src/services/translation.js`](src/services/translation.js) · [`src/contexts/LanguageContext.jsx`](src/contexts/LanguageContext.jsx)

VoteWise supports all **22 languages of the Eighth Schedule** of the Indian Constitution plus English:

| | | | |
|---|---|---|---|
| 🇮🇳 Hindi (हिंदी) | 🇮🇳 Bengali (বাংলা) | 🇮🇳 Telugu (తెలుగు) | 🇮🇳 Marathi (मराठी) |
| 🇮🇳 Tamil (தமிழ்) | 🇮🇳 Urdu (اردو) | 🇮🇳 Gujarati (ગુજરાતી) | 🇮🇳 Kannada (ಕನ್ನಡ) |
| 🇮🇳 Odia (ଓଡ଼ିଆ) | 🇮🇳 Malayalam (മലയാളം) | 🇮🇳 Punjabi (ਪੰਜਾਬੀ) | 🇮🇳 Assamese (অসমীয়া) |
| 🇮🇳 Maithili (मैथिली) | 🇮🇳 Sanskrit (संस्कृतम्) | 🇮🇳 Nepali (नेपाली) | 🇮🇳 Konkani (कोंकणी) |
| 🇮🇳 Manipuri (মৈতৈলোন্) | 🇮🇳 Kashmiri (كٲشُر) | 🇮🇳 Sindhi (سنڌي) | 🇮🇳 Santali (ᱥᱟᱱᱛᱟᱲᱤ) |
| 🇮🇳 Dogri (डोगरी) | 🇮🇳 Bodo (बड़ो) | 🇬🇧 English | |

**Translation Architecture — 4-Tier Fallback Strategy:**

```
┌─────────────────────────────────────────────┐
│  1. Pre-generated Static Locale Files       │  ← Instant (0ms)
│     /public/locales/{lang}.json             │
├─────────────────────────────────────────────┤
│  2. LocalStorage Translation Cache          │  ← Instant (0ms)
│     Persists across sessions                │
├─────────────────────────────────────────────┤
│  3. Google Cloud Translation API (paid)     │  ← ~200ms
│     OR Gemini AI batch translation          │
├─────────────────────────────────────────────┤
│  4. Free Google Translate Endpoint          │  ← Fallback
│     No API key required                     │
└─────────────────────────────────────────────┘
```

**Onboarding Experience:**
- On first visit, a full-screen **Language Welcome Modal** appears showing the top 8 most spoken Indian languages prominently, with all others searchable below.
- Language selection is **remembered** via `localStorage` and persisted across sessions.
- A **toast notification** confirms the switch (e.g., *"Language changed to हिंदी"*).

---

### 🎓 First-Timer Mode

> **File:** [`src/contexts/FirstTimerContext.jsx`](src/contexts/FirstTimerContext.jsx)

A global toggle that simplifies **every piece of content** across the entire application:

| Component | Normal Mode | First-Timer Mode |
|---|---|---|
| Timeline | *"Candidates file their nomination papers, which are then scrutinized."* | *"People who want to be leaders submit their paperwork."* |
| Eligibility | *"Individuals declared to be of unsound mind by a competent court cannot be enrolled."* | *"People declared medically unsound by a judge cannot vote."* |
| Chatbot | Standard Gemini responses | System prompt forces **jargon-free, analogy-based** explanations |
| Eligibility Result | *"Register using Form 6 (Voter Registration) →"* | *"Get your voter card (EPIC) now! →"* |

- Activated via a prominent **"First Time Voter? Start Here →"** button on the Learn page.
- A persistent **green banner** at the top of the app confirms the mode is active.
- **"Beginner Friendly"** badges appear on all compatible components.

---

### 📅 Election Lifecycle Timeline

> **File:** [`src/components/features/Timeline.jsx`](src/components/features/Timeline.jsx)

An interactive, vertical timeline walking users through all **6 phases** of the Indian election cycle:

1. **Voter Registration** — Form 6, online/offline options
2. **Election Announcement** — Model Code of Conduct
3. **Candidate Nominations** — Scrutiny process
4. **Campaign Period** — 48-hour silence rule
5. **Voting Day** — EVM polling procedures
6. **Counting & Results** — Declaration process

- Each phase has **dual descriptions**: standard and beginner-friendly (for First-Timer Mode).
- Visual indicators show **completed**, **active**, and **upcoming** phases.
- Demo Mode auto-highlights *"Voting Day"* for presentation purposes.

---

### ✅ Voter Eligibility Checker

> **File:** [`src/components/features/EligibilityChecker.jsx`](src/components/features/EligibilityChecker.jsx)

An interactive form that evaluates voter eligibility based on three criteria:

- **Age** — Must be 18+; if under 18, calculates the *exact year* the user becomes eligible.
- **Citizenship** — Must be an Indian citizen.
- **Mental Competency** — Based on competent court declarations.

**Smart Feedback:**
- ✅ **Eligible** → Direct link to `voters.eci.gov.in` for Form 6 registration.
- ⏳ **Too young** → Shows the future year of eligibility (e.g., *"You can vote around 2028"*).
- ❌ **Not eligible** → Clear explanation with links to official resources.

---

### 🧠 Interactive Quiz with Gamification

> **File:** [`src/components/features/Quiz.jsx`](src/components/features/Quiz.jsx)

A **10-question** quiz covering Indian electoral knowledge with full gamification:

- 📊 **Visual progress bar** tracking completion
- 🔥 **Streak counter** with animated fire icon for consecutive correct answers
- ✅ / ❌ **Instant feedback** with detailed explanations per question
- 🏆 **Score display** with circular badge and performance message (*"Excellent Citizen!"* / *"Good Job!"* / *"Keep Learning!"*)
- 📤 **Share Score** — Copies a formatted message to clipboard for social sharing
- 🔄 **Retake Quiz** — Full reset for replayability
- ☁️ **Firebase persistence** — Scores are saved to Firebase Realtime Database

**Quiz Topics:**
Election Commission, voting age, EVMs, NOTA, VVPAT, Model Code of Conduct, constituency system, Voter ID (EPIC), prison voting rights, and tie-breaking procedures.

---

### 🚫 Myth vs Fact Cards

> **File:** [`src/components/features/MythBusters.jsx`](src/components/features/MythBusters.jsx)

A swipeable carousel debunking **5 common election myths**:

| Myth | Fact |
|---|---|
| *"My single vote doesn't matter anyway."* | Many elections are decided by 1-2 votes. |
| *"I can't vote because I'm away from my home."* | You must update your registration using Form 8. |
| *"EVMs can be easily hacked."* | EVMs are standalone, non-networked, with rigorous security. |
| *"A slip from a political party guarantees my vote."* | Your name must be on the official Electoral Roll. |
| *"NOTA is a wasted vote."* | High NOTA counts send a statistical message to parties. |

- **Navigation arrows** for browsing
- **🔊 Read Aloud** button for TTS of the current card
- **📋 Share this fact** — Copies the myth + fact to clipboard for WhatsApp/social sharing

---

### 📍 Inside the Polling Booth (8-Step Visual Guide)

> **File:** [`src/components/features/PollingBooth.jsx`](src/components/features/PollingBooth.jsx)

A horizontally scrollable card deck (mobile) / 4-column grid (desktop) walking users through every step inside a polling booth:

1. Show Your ID → 2. Indelible Ink → 3. Sign the Register → 4. Receive Voter Slip → 5. Enter Compartment → 6. Press 'Vote' on EVM → 7. Verify with VVPAT → 8. Exit the Booth

**Bonus Sections:**
- 🖥️ **Interactive VVPAT Diagram** — A CSS-rendered schematic of the VVPAT machine showing the Transparent Window, Thermal Printer Unit, Sealed Drop Box, and EVM Connection Port with labeled explanations.
- 🖋️ **Indelible Ink Deep Dive** — An illustrated section covering what the ink is (Silver Nitrate), which finger it goes on (left index), how long it lasts (2-3 weeks), and a fun fact about Mysore Paints and Varnish Ltd.

---

### 🔊 Text-to-Speech (TTS)

> **File:** [`src/hooks/useTextToSpeech.js`](src/hooks/useTextToSpeech.js)

Global audio support using the **Web Speech API** with language-aware voice selection:

- Maps all 23 app languages to their **BCP 47 locale codes** (e.g., `hi-IN`, `bn-IN`, `ta-IN`).
- Speech rate is set to **0.9x** (slightly slower) for better comprehension by elderly users.
- Available on: **Chatbot messages** (per-message toggle), **Myth vs Fact cards** (global toggle).
- Gracefully degrades on unsupported browsers (hides TTS buttons entirely).

---

### ♿ Accessibility Menu

> **File:** [`src/components/ui/AccessibilityMenu.jsx`](src/components/ui/AccessibilityMenu.jsx) · [`src/contexts/AccessibilityContext.jsx`](src/contexts/AccessibilityContext.jsx)

A **floating action button** (bottom-right corner) providing:

- **Text Size Control** — Three levels: Normal → Large → Extra Large. Applied globally via CSS classes on `<html>`.
- **High Contrast Mode** — Toggle for enhanced visibility with increased contrast ratios.
- All preferences are **persisted in `localStorage`** and restored on next visit.

---

### 📱 Progressive Web App (PWA)

> **File:** [`vite.config.js`](vite.config.js)

VoteWise is a fully installable PWA via `vite-plugin-pwa`:

- **Service Worker** with `autoUpdate` strategy for seamless updates.
- **Offline support** — Precached assets (6 entries, ~815 KB) for use without internet.
- **Custom manifest** with app name, theme color (`#000080`), and icons.
- **Add to Home Screen** prompt on mobile browsers.

---

### 🎮 Demo Mode

> **File:** [`src/contexts/DemoContext.jsx`](src/contexts/DemoContext.jsx)

A one-click toggle in the Navbar that showcases the app's capabilities for **presentations and judging**:

- **Chatbot** — Pre-fills with a sample conversation.
- **Eligibility Checker** — Auto-fills with a valid eligible voter profile.
- **Timeline** — Highlights "Voting Day" as the active phase.
- **Polling Booth** — Auto-scrolls to the indelible ink step.
- **Quiz** — Auto-selects the correct answer for quick demonstration.
- **Language switching** is locked to English during Demo Mode for consistency.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React 19)                   │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  Learn    │  │   Ask    │  │   Quiz   │   ← Views        │
│  │  View     │  │   View   │  │   View   │                  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                  │
│       │              │              │                        │
│  ┌────┴──────────────┴──────────────┴────┐                  │
│  │            React Router DOM           │                  │
│  └───────────────────┬───────────────────┘                  │
│                      │                                       │
│  ┌───────────────────┴───────────────────┐                  │
│  │         Context Providers              │                  │
│  │  ┌─────────┐ ┌──────┐ ┌───────────┐  │                  │
│  │  │Language  │ │Demo  │ │Accessibility│ │                  │
│  │  │Context   │ │Mode  │ │Context     │ │                  │
│  │  └─────────┘ └──────┘ └───────────┘  │                  │
│  │  ┌─────────────────────────────────┐  │                  │
│  │  │     FirstTimer Context          │  │                  │
│  │  └─────────────────────────────────┘  │                  │
│  └───────────────────────────────────────┘                  │
│                      │                                       │
│  ┌───────────────────┴───────────────────┐                  │
│  │           Service Layer                │                  │
│  │  ┌──────────┐ ┌──────────┐ ┌────────┐│                  │
│  │  │ gemini.js│ │firebase.js│ │transl. ││                  │
│  │  └─────┬────┘ └─────┬────┘ └───┬────┘│                  │
│  └────────┼─────────────┼──────────┼─────┘                  │
└───────────┼─────────────┼──────────┼────────────────────────┘
            │             │          │
            ▼             ▼          ▼
    ┌──────────────┐ ┌─────────┐ ┌────────────────────┐
    │ Gemini 2.5   │ │Firebase │ │ Google Translate /  │
    │ Flash API    │ │ RTDB +  │ │ Gemini Batch /     │
    │              │ │ Auth    │ │ Free Translate     │
    └──────────────┘ └─────────┘ └────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/Anubhabjana/votewise.git
cd votewise

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at **`http://localhost:5173`**.

> **Note:** The app works in a **zero-config mode** — without any API keys, it falls back to Demo Mode, free translation endpoints, and mock Firebase data. No setup required to explore the UI!

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
# Required for AI Chatbot
VITE_GEMINI_API_KEY=your_gemini_api_key

# Optional — Firebase (for quiz score persistence)
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id

# Optional — Google Cloud Translation (paid tier)
VITE_GOOGLE_TRANSLATE_API_KEY=your_translate_key
```

| Variable | Required? | Purpose |
|---|---|---|
| `VITE_GEMINI_API_KEY` | **Recommended** | Powers AI chatbot and batch translation |
| `VITE_FIREBASE_*` | Optional | Enables quiz score persistence |
| `VITE_GOOGLE_TRANSLATE_API_KEY` | Optional | Premium translation quality; falls back to free endpoints |

---

## 📁 Project Structure

```
votewise/
├── public/
│   ├── locales/              # Pre-generated translation files (23 languages)
│   │   ├── hi.json           # Hindi translations
│   │   ├── bn.json           # Bengali translations
│   │   └── ...               # 21 more language files
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── features/
│   │   │   ├── Chatbot.jsx          # Gemini AI assistant + voice + grounding
│   │   │   ├── VoterIDScanner.jsx   # 📸 Gemini Vision document scanner [NEW]
│   │   │   ├── VoterReadinessReport.jsx  # 📊 AI readiness report [NEW]
│   │   │   ├── Quiz.jsx             # Gamified election knowledge quiz
│   │   │   ├── Timeline.jsx         # Election lifecycle timeline
│   │   │   ├── EligibilityChecker.jsx  # Voter eligibility form
│   │   │   ├── MythBusters.jsx      # Myth vs Fact carousel
│   │   │   └── PollingBooth.jsx     # 8-step booth guide + VVPAT diagram
│   │   ├── layout/
│   │   │   ├── Navbar.jsx           # Navigation + language selector
│   │   │   └── LanguageWelcomeModal.jsx  # First-visit language picker
│   │   └── ui/
│   │       ├── AccessibilityMenu.jsx  # Floating FAB for a11y settings
│   │       └── Logo.jsx
│   ├── constants/
│   │   ├── componentData.js   # Quiz questions, myths, election phases, booth steps
│   │   ├── languages.js       # 23 supported languages
│   │   └── uiStrings.js       # All translatable UI strings
│   ├── contexts/
│   │   ├── AccessibilityContext.jsx  # Text size + high contrast state
│   │   ├── DemoContext.jsx           # Demo mode toggle
│   │   ├── FirstTimerContext.jsx     # First-timer mode toggle
│   │   └── LanguageContext.jsx       # Language state + batch translation
│   ├── hooks/
│   │   ├── useTextToSpeech.js  # Web Speech API wrapper
│   │   └── useTranslation.js   # t() function hook
│   ├── services/
│   │   ├── gemini.js           # Gemini 2.5 Flash (multimodal, grounding, structured)
│   │   ├── firebase.js         # Auth + Realtime Database
│   │   └── translation.js     # 4-tier translation engine
│   ├── views/
│   │   ├── LearnView.jsx       # Main education dashboard
│   │   ├── AskView.jsx         # AI chatbot page
│   │   └── QuizView.jsx        # Quiz page
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .github/workflows/
│   └── deploy.yml              # GitHub Pages CI/CD
├── package.json
└── vite.config.js
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ for Google PromptWars Hackathon**

*Making democracy accessible, one voter at a time.*

**Gemini Features Used:** Multimodal Vision • Google Search Grounding • Structured JSON Output • System Instructions • Batch Translation

</div>
