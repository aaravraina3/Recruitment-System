# Generate Recruitment System - Codebase Overview

## 🌟 Project Purpose
A centralized recruitment portal for **Generate** (Northeastern's Product Development Studio). It handles:
1.  **Applicants**: Applying to specific branches (Software, Hardware, etc.) & roles.
2.  **Staff**: Reviewing applications, scheduling interviews, and making hiring decisions.
3.  **Executives**: Managing the roster, questions, and seasonal resets.

---

## 📂 Directory Structure

```bash
Recruitment-System/
├── frontend/                  # The User Interface (React)
│   ├── src/
│   │   ├── pages/             # Main screens (Dashboard, ApplicationForm, ReviewDashboard)
│   │   ├── components/        # Reusable UI (Chatbot, Button, StatusTracker)
│   │   └── services/          # API connectors (talks to backend)
│   ├── public/                # Static assets (images, icons)
│   └── package.json           # Frontend dependencies
│
├── backend/                   # The Logic & Data (FastAPI + Python)
│   ├── data/                  # Data storage
│   │   ├── questions.json     # Dynamic application questions
│   │   └── roster.json        # Staff list (permissions)
│   ├── app.py                 # MAIN SERVER FILE (Routes, Logic, DB connections)
│   ├── rag.py                 # Chatbot logic (AI Retrieval)
│   ├── google_sheets.py       # Syncs roster with Google Sheets
│   └── Dockerfile             # Instructions to run backend in cloud
│
├── .github/workflows/         # Automation
│   ├── deploy-frontend.yml    # Puts website on GitHub Pages
│   └── ci.yml                 # Checks code for errors
│
└── SYSTEM_DESIGN.md           # Architecture & Deployment Guide
```

---

## 🧠 Key Features & How They Work

### 1. Dynamic Application Forms (`frontend/src/pages/ApplicationForm.jsx`)
*   **Problem**: Questions change every semester.
*   **Solution**: The form is **not hardcoded**.
*   **Flow**:
    1.  Frontend asks Backend: "Give me questions for Software Chief."
    2.  Backend reads `data/questions.json`.
    3.  Frontend draws the inputs (Textarea, Checkbox, etc.) automatically.

### 2. Hierarchical Review System (`frontend/src/pages/ReviewDashboard.jsx`)
*   **Problem**: Directors need to see Chiefs, Chiefs need to see Members.
*   **Solution**: Roster-based permissions.
*   **Flow**:
    1.  User logs in via Clerk.
    2.  Backend checks `roster.json` to see their role (e.g., "Software Director").
    3.  If Director -> Shows "Lead" and "Chief" applications.
    4.  If Chief -> Shows "Member" applications.

### 3. AI Chatbot (`backend/rag.py` + `frontend/src/components/Chatbot.jsx`)
*   **Problem**: Applicants ask the same questions ("What are the hours?").
*   **Solution**: RAG (Retrieval-Augmented Generation).
*   **Flow**:
    1.  User asks a question.
    2.  Backend searches `.txt` files in `data/` for keywords.
    3.  Sends relevant text + question to **Google Gemini**.
    4.  Gemini writes a polite answer based *only* on your documents.

### 4. Admin Panel (`frontend/src/pages/AdminDashboard.jsx`)
*   **Access**: Only for users with "Executive" in their role.
*   **Capabilities**:
    *   **Roster**: Add/Remove staff permissions instantly.
    *   **Form Builder**: Edit `questions.json` in a text editor UI.
    *   **Seasonal Reset**: Wipes all applications for next semester.

---

## 🛠 Tech Stack

*   **Frontend**: React, Framer Motion (animations), Clerk (Auth), Axios (API).
*   **Backend**: Python, FastAPI (API), LangChain (AI), MongoDB (Database).
*   **Deployment**:
    *   **Frontend**: GitHub Pages (via GitHub Actions).
    *   **Backend**: Render (via Docker).
    *   **Database**: MongoDB Atlas (Cloud).

---

## 🚀 How to Run It

### Local Development
1.  **Backend**:
    ```bash
    cd backend
    source venv/bin/activate
    uvicorn app:app --reload
    ```
2.  **Frontend**:
    ```bash
    cd frontend
    npm start
    ```

### Cloud Deployment
*   **Frontend**: Just push to GitHub! (The Action does the rest).
*   **Backend**: Connect your repo to Render.com.
