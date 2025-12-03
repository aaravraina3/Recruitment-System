# System Design & Deployment Strategy

## 1. High-Level Architecture (24/7 Availability)

To make the system available 24/7 without keeping your laptop on, we move from "Localhost" to "Cloud Hosting".

```mermaid
graph TD
    User[Applicant / User] -->|HTTPS| CDN[CDN / Frontend Host]
    CDN -->|React App| Browser[User Browser]
    
    Browser -->|API Calls| API[Backend API (Container)]
    
    subgraph Cloud Infrastructure
        API -->|Auth| Clerk[Clerk Auth Service]
        API -->|Read/Write| MongoDB[MongoDB Atlas (Cloud DB)]
        API -->|Vector Search| ChromaDB[In-Memory/Local Vector Store]
        API -->|Fetch Roster| GSheets[Google Sheets API]
        API -->|LLM| Gemini[Google Gemini API]
    end
```

### Components
1.  **Frontend (Vercel/Netlify):** Serves the React files. It is "Serverless" and always on.
2.  **Backend (Render/Railway/AWS):** A Docker container running `uvicorn app:app`. It handles logic, RAG, and DB connections.
3.  **Database (MongoDB Atlas):** A managed cloud database. Persistent storage for applications/users.
4.  **Authentication (Clerk):** Managed identity provider.

---

## 2. Deployment Strategy (CI/CD)

We will use a **GitOps** workflow. When you push code to GitHub, it automatically builds and deploys.

### Option A: The "Easy/Free" Path (Recommended for MVP)
*   **Frontend:** **Vercel**. Connects to GitHub repo. Auto-deploys on push to `main`.
*   **Backend:** **Render.com**. Connects to GitHub. Auto-builds `backend/Dockerfile`.
*   **Database:** **MongoDB Atlas** (Free Tier).

### Option B: The "Professional/AWS" Path (Scalable)
*   **Containerization:** Dockerize both apps.
*   **Registry:** Push images to AWS ECR (Elastic Container Registry).
*   **Orchestration:** Run on AWS ECS (Fargate) or App Runner.
*   **CI/CD:** GitHub Actions to build & push Docker images.

---

## 3. Containerization (Docker)

We need to "containerize" the backend so it runs the same way in the cloud as it does on your machine.

### Backend Dockerfile (Python)
*   Installs Python 3.9+
*   Copies `requirements.txt` and installs libs.
*   Copies source code.
*   Runs `uvicorn`.

### Frontend Dockerfile (Node) - *Optional if using Vercel*
*   Builds the React app (`npm run build`).
*   Serves static files using `nginx` or a simple Node server.

---

## 4. Data Persistence Strategy

*   **Applications/Decisions:** Stored in MongoDB Atlas. **Safe.**
*   **Roster:** Fetched from Google Sheets on startup. **Safe.**
*   **Chatbot Memory (ChromaDB):**
    *   *Challenge:* Cloud containers (like Render free tier) lose local files on restart.
    *   *Solution 1 (MVP):* Re-ingest `data/` documents on every startup.
    *   *Solution 2 (Production):* Use a cloud vector DB (Pinecone) or mount a persistent volume.
    *   *Decision:* We will configure the backend to attempt ingestion of `data/` folder on startup if the DB is empty.

---

## 5. CI/CD Pipeline (GitHub Actions)

We will add a `.github/workflows/ci.yml` file to:
1.  **Lint:** Check code quality.
2.  **Test:** Run unit tests (if any).
3.  **Build:** Verify Docker images build successfully.

This ensures you don't deploy broken code.

