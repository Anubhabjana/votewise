# VoteWise 🗳️

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://anubhabjana.github.io/votewise/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC.svg)](https://tailwindcss.com/)

VoteWise is an AI-powered, multilingual Progressive Web Application (PWA) designed to educate and assist voters with the election process. Built with inclusivity at its core, it aims to empower first-time voters, elderly citizens, and non-English speakers by providing a seamless, accessible, and highly informative platform.

## 🌟 Key Features

*   **🌍 Multilingual Support**: Dynamic translation across multiple regional languages, powered by the Gemini AI API, ensuring no voter is left behind due to language barriers.
*   **♿ Accessibility First**: Features a dedicated Accessibility Menu allowing users to adjust text sizes, toggle high-contrast modes, and utilize **Text-to-Speech** (TTS) functionality for all content.
*   **🤖 AI Chatbot Assistant**: An intelligent chatbot integrated with Google's Gemini AI to answer specific, real-time voter queries interactively.
*   **🎓 First-Timer Mode**: A specialized, simplified viewing mode that breaks down complex electoral concepts into easy-to-understand explanations for new voters.
*   **✅ Eligibility Checker**: A quick, interactive tool to help users determine their voting eligibility based on current guidelines.
*   **📅 Election Timeline**: A step-by-step interactive timeline explaining the entire voting process from registration to polling day.
*   **🧠 Interactive Quizzes**: Engaging quizzes designed to test and improve voter awareness and civic knowledge.
*   **🚫 Myth Busters**: A dedicated section to debunk common election myths and combat misinformation.
*   **📍 Polling Booth Guide**: Information on what to expect at the polling booth, required documents, and procedures.
*   **📱 PWA Ready**: Installable on mobile devices with offline capabilities and a native-app-like experience.

## 🛠️ Tech Stack

*   **Frontend Framework**: React 19
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS (v4)
*   **Routing**: React Router DOM
*   **AI Integration**: Google GenAI API (Gemini)
*   **Backend/Services**: Firebase
*   **Icons**: Lucide React

## 🚀 Live Demo

Experience VoteWise live at: **[https://anubhabjana.github.io/votewise/](https://anubhabjana.github.io/votewise/)**

## 💻 Running Locally

To run this project on your local machine, follow these steps:

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Anubhabjana/votewise.git
    cd votewise
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root of your project and add your respective API keys (e.g., Firebase config, Gemini API key).
    *(Note: Refer to `src/services/firebase.js` and `src/services/gemini.js` for required variables)*

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 📦 Build & Deployment

This project is configured to automatically deploy to **GitHub Pages** via GitHub Actions whenever changes are pushed to the `main` branch. 

To manually build the project:
```bash
npm run build
```
This will generate production-ready static files in the `dist/` directory.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Anubhabjana/votewise/issues) if you want to contribute.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
