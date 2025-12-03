# Generate Recruitment System - MVP Instructions

## 🚨 Emergency Sprint Completion Status

The system has been consolidated to ensure stability and rapid deployment.

### 1. Architecture Changes
- **Unified Backend:** The Review API and Chatbot API have been merged into the main FastAPI backend (`port 8000`). This simplifies deployment (only one backend service needed).
- **RAG System:** Implemented using `LangChain` + `ChromaDB` (local vector store) to ensure it works immediately without complex MongoDB Atlas configuration.
- **Background Tasks:** Email notifications and status updates are handled via FastAPI background tasks instead of a separate complex ETL pipeline.

### 2. Running the System

#### Backend
1. Navigate to `Recruitment-System/backend`
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set Environment Variables (create `.env`):
   ```
   MONGO=mongodb://localhost:27017/recruitment  # Or your Atlas URI
   OPENAI_API_KEY=sk-...
   JWT_SECRET=your-secret
   # CLERK keys if needed for backend verification (optional for MVP)
   ```
4. Run the server:
   ```bash
   uvicorn app:app --reload --port 8000
   ```

#### Frontend
1. Navigate to `Recruitment-System/frontend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the dev server:
   ```bash
   npm start
   ```

### 3. New Features
- **Chatbot:** Located at bottom right. Connects to `/api/chat`.
  - *Data Ingestion:* To add knowledge, place `.txt` or `.md` files in `backend/data/` and run `python ingest.py`.
- **Review Dashboard:** Accessible via Sidebar > "Review Queue". 
  - URL: `/review/software` (or any branch name).
  - Features: Queue list, Claiming, Accept/Reject/Interview decisions.

### 4. Missing Credentials Note
- **Google Drive:** The service account email was provided, but the **JSON Key File** content is required to programmatically access Drive. 
- **Workaround:** I have provided a `backend/ingest.py` script. You can manually download the Generate documents (PDF/Text) and place them in `backend/data/`, then run the script to ingest them into the AI's memory.

### 5. Deployment
- **Backend:** Deploy `Recruitment-System/backend` to Render.
- **Frontend:** Deploy `Recruitment-System/frontend` to Vercel/Netlify.
- Ensure `REACT_APP_API_URL` in Frontend environment matches the Render backend URL.

