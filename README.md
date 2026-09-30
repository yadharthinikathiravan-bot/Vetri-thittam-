# EduGenie — Google Gemini Powered Learning Assistant

A complete educational web-project prototype inspired by the supplied project card.

## Features

- AI topic explanation
- Quiz generation
- Flashcard generation
- 7-day study-plan generation
- Learning-session progress stored in the browser
- Responsive web UI
- Gemini API key kept on the server
- Simple Express backend and vanilla HTML/CSS/JS frontend

## Project structure

```text
edugenie-project/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## Run locally

1. Install Node.js 20+.
2. Open this project folder in a terminal.
3. Run:

```bash
npm install
```

4. Copy `.env.example` to `.env`.
5. Put your Gemini API key in `.env`:

```env
GEMINI_API_KEY=YOUR_KEY
PORT=3000
```

6. Start:

```bash
npm start
```

7. Open:

```text
http://localhost:3000
```

## Getting the Gemini API key

Use Google AI Studio's API-key page. Keep the key private and only store it in `.env` or your hosting provider's environment variables.

Official docs:
https://ai.google.dev/gemini-api/docs/get-started
https://ai.google.dev/gemini-api/docs/api-key

## Important security rule

Do NOT put `GEMINI_API_KEY` inside `public/app.js`, `index.html`, or any file committed to GitHub.

## GitHub

Create a new GitHub repository named `edugenie-gemini-learning-assistant`, then from the project folder:

```bash
git init
git add .
git commit -m "Initial EduGenie project"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Before pushing, verify `.env` is not being committed.

## Deployment

The project is a Node/Express application. On a Node-compatible host:

- Build/install command: `npm install`
- Start command: `npm start`
- Environment variable: `GEMINI_API_KEY=your_key`
- Optional environment variable: `PORT`

After deployment, the host will provide your public project URL.

## Project report summary

### Title
EduGenie: Google Gemini Powered Learning Assistant

### Problem
Students often need quick explanations, practice questions, revision material, and study plans in one place.

### Objective
Build an AI-powered learning assistant that converts a student's topic or question into understandable learning support.

### Technology
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js + Express
- AI: Google Gemini API using `@google/genai`
- Storage: Browser localStorage for prototype progress

### Modules
1. User interface
2. Learning-mode selection
3. Gemini AI service
4. Quiz generator
5. Flashcard generator
6. Study-plan generator
7. Progress tracking
8. API/security layer

### Future enhancements
- Student accounts and database
- Teacher dashboard
- PDF/notes upload
- Subject-wise analytics
- Voice input/output
- Source citations for research answers
- Accessibility improvements
- Moderation and school-admin controls
