# YouTube Companion Dashboard

A full-stack application to manage YouTube videos with AI-powered features, comments, notes, and event logging.

## Features

- ✅ View detailed video information from YouTube API
- ✅ Edit video title and description
- ✅ Add, reply to, and delete comments
- ✅ Notes section with tagging and search functionality
- ✅ AI-powered title suggestions (using OpenAI)
- ✅ Event logging stored in PostgreSQL database
- ✅ RESTful API with Express.js
- ✅ React frontend with Tailwind CSS

## Tech Stack

**Frontend:**
- React with TypeScript
- Tailwind CSS
- Lucide React (icons)
- Vite

**Backend:**
- Node.js + Express.js
- PostgreSQL
- YouTube Data API v3
- OpenAI API
- googleapis package

## Prerequisites

Before you begin, ensure you have:
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- YouTube API credentials (OAuth 2.0)
- OpenAI API key

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd youtube-companion
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend directory:

```env
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_client_secret
YOUTUBE_REDIRECT_URI=http://localhost:5000/auth/callback

OPENAI_API_KEY=your_openai_api_key

DATABASE_URL=postgresql://username:password@localhost:5432/youtube_companion

PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Database Setup

Create PostgreSQL database:

```bash
createdb youtube_companion
```

Run schema:

```bash
psql youtube_companion < src/db/schema.sql
```

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file in frontend directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 5. Getting YouTube API Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable YouTube Data API v3
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs
6. Copy Client ID and Client Secret

### 6. Getting OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key

## Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

Server runs on http://localhost:5000

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on http://localhost:5173

## API Endpoints

### Videos

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/videos/:videoId` | Get video details |
| PUT | `/api/videos/:videoId` | Update video title/description |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comments/:videoId` | Get all comments for a video |
| POST | `/api/comments/:videoId` | Add a new comment |
| POST | `/api/comments/:commentId/reply` | Reply to a comment |
| DELETE | `/api/comments/:commentId` | Delete a comment |

### Notes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes/:videoId` | Get all notes for a video |
| POST | `/api/notes/:videoId` | Create a new note |
| PUT | `/api/notes/:noteId` | Update a note |
| DELETE | `/api/notes/:noteId` | Delete a note |
| GET | `/api/notes/:videoId/search` | Search notes by query or tag |

### AI

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/suggest-titles` | Get AI-powered title suggestions |

## Database Schema

### Notes Table

```sql
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    video_id VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Event Logs Table

```sql
CREATE TABLE event_logs (
    id SERIAL PRIMARY KEY,
    video_id VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes

- `idx_notes_video_id` - Index on notes.video_id
- `idx_notes_tags` - GIN index for tag searching
- `idx_event_logs_video_id` - Index on event_logs.video_id
- `idx_event_logs_timestamp` - Index on timestamp
- `idx_notes_text_search` - Full-text search index

## Deployment

### Backend Deployment (Render/Railway)

1. Push code to GitHub
2. Connect repository to Render/Railway
3. Add environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables
6. Deploy

### Database (Neon/Supabase)

1. Create PostgreSQL database
2. Run schema.sql
3. Update DATABASE_URL in backend

## Usage

1. Upload an unlisted video to YouTube
2. Copy the video ID from the URL
3. Update `videoId` in `App.tsx` (line 31)
4. Load the application
5. Use the dashboard to:
   - View video statistics
   - Edit title/description
   - Get AI title suggestions
   - Manage comments and replies
   - Create and search notes with tags

## Event Logging

All actions are logged automatically:
- Video loads
- Video updates
- Comment additions/deletions
- Reply additions
- Note creation/updates/deletions
- AI suggestion requests
- Errors

## Notes Search & Tagging

- Add tags to notes (comma-separated)
- Search notes by text content
- Filter notes by specific tags
- Full-text search powered by PostgreSQL

## License

MIT

## Author
Bhanu007

## Support

For issues and questions, please open an issue on GitHub.
