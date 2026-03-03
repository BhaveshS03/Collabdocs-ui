
# Collabdocs

A collaborative note-taking and document editing application.

> [!IMPORTANT]
> AWS setup is currently unstable. Please follow the instructions below to set up Collabdocs locally.

## Project Structure

- `notes-app-backend/`: The backend server powered by Bun and Express.
- `Collabdocs-ui/`: The frontend application built with Vite, React, and Tailwind CSS.

## Prerequisites

- [Bun](https://bun.sh/) (Recommended) or Node.js
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas cluster)
- Google Cloud Project (for Google OAuth)

---

## 1. Database Setup

Ensure you have a MongoDB instance running. If using Atlas, have your connection string ready.

---

## 2. Backend Setup (`notes-app-backend`)

### Installation

```bash
cd notes-app-backend
bun install
```

### Environment Variables

Create a `.env` file in the `notes-app-backend` directory:

```env
PORT=1234
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EXPRESS_SECRET=your_express_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:1234/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

### Start Backend

```bash
bun start
```

---

## 3. Frontend Setup (`Collabdocs-ui`)

### Installation

```bash
cd ..
bun install
```

### Environment Variables

Create a `.env` file in the root directory (`Collabdocs-ui/`):

```env
VITE_API_BASE_URL=http://localhost:1234
VITE_NODE_ENV=development
```

### Start Frontend

```bash
bun dev
```

---

## Technical Stack

- **Backend**: Bun, Express, Mongoose, Passport (Google OAuth), WebSocket (for collaboration).
- **Frontend**: Vite, React, Tailwind CSS, TanStack Query, Axios
