# MindVault

Upload. Understand. Interact. Evolve.

## 📌 About the Project

MindVault is an AI-powered study assistance and productivity platform designed to help students transform raw academic material into structured, actionable knowledge.

It combines AI summarization, MCQ generation, smart contextual chat, and productivity planning into one centralized workspace.

---

## 🚀 Project Overview

In today’s fast-paced academic environment, students deal with:

- Large PDFs and lecture slides
- Time-consuming manual summarization
- Lack of structured revision tools
- Poor task and deadline management

MindVault solves these challenges by:

- Automating content processing using AI
- Generating summaries and MCQs instantly
- Providing smart file-based contextual chat
- Offering an integrated study planner with alerts

It acts as a personalized AI study companion.

---

## 🏗️ System Architecture

MindVault follows a three-tier architecture:

## 🖥️ Presentation Layer (Frontend)

- React.js + TypeScript
- Tailwind CSS
- Responsive and modular UI

Handles:

- File uploads
- Vault management
- Smart chat
- Planner dashboard
- Summary & MCQ display

---

## ⚙️ Application Layer (Backend)

Two backend services:

## 🐍 Flask (Python)

- File processing (PDF, PPT, TXT)
- AI summarization
- MCQ generation
- Smart chat
- Gemini API integration

## 🟢 Node.js + Express

- Authentication (JWT)
- Planner APIs
- Alerts system
- API routing

---

## 🗄️ Data Layer

- MongoDB
- Users
- Files metadata
- File chat history
- Planner tasks & events
- Alerts
- AI study plans

- Server Storage
- Uploaded files stored in myvault_files/

---

## ✨ Core Features

## 📂 1. File Uploads

- Supports PDFs, PPTs, TXT files
- Files stored securely
- Preview support inside vault

---

## 📝 2. AI Summarization

- Generates concise summaries using Gemini API
- Speeds up revision process
- Reduces cognitive overload

---

## ❓ 3. MCQ Generation

- Auto-generates multiple-choice questions
- Improves active recall
- Helps exam preparation

---

## 💬 4. Smart File-Based Chat

- Dedicated chat per file
- Context-aware responses
- Chat history stored in MongoDB
- Acts like a personalized AI tutor

---

## 🗂️ 5. MyVault Workspace

- Organized file repository
- Metadata view (size, type, upload date)
- Delete & manage files
- Centralized study hub

---

## 📅 6. AI Study Planner

- Generate AI-powered study plans
- Stored for future reference
- Structured preparation strategies

---

## ✅ 7. Tasks, Events & Alerts

Users can:

- Create tasks
- Create events with deadlines
- Mark tasks complete
- Receive automatic alerts

Background job:

- Runs every 30 seconds
- Checks expired & upcoming deadlines
- Generates real-time alerts

---

## 🔐 Authentication & Security

- JWT-based authentication
- Secure protected routes
- Role-based access
- User-specific data isolation
- Expired tokens automatically rejected

---

## 🛠️ Tech Stack

## 🎨 Frontend

- React.js
- TypeScript
- Tailwind CSS

## ⚙️ Backend

- Flask (Python)
- Node.js
- Express.js

## 🗄️ Database

- MongoDB

## 🤖 AI Integration

- Google Gemini API

---

## 🛠️ How to Run the Project

## ✅ Prerequisites

- Node.js (v18+)
- Python 3.9+
- MongoDB
- Gemini API Key

---

## 🔹 Backend Setup

cd backend

python -m venv .venv

.venv\\Scripts\\activate

pip install -r requirements.txt

python backend_app.py

---

## 🔹 Node Server Setup

cd server

npm install

npm start

---

## 🔹 Frontend Setup

cd frontend

npm install

npm run dev

---

## 📊 Database Collections

- users
- files
- file_chats
- planner_tasks
- planner_events
- planner_alerts
- ai_plans

---

## 🔮 Future Enhancements

- Semantic search (vector-based)
- Mind map generation
- Voice note transcription
- Collaborative vaults
- Advanced AI memory handling
