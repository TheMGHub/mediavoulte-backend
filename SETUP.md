# MediaVault Backend API

Personal HLS streaming server with JWT auth, library management, and playback tracking.

## Setup

### 1. Environment

Copy and configure `.env.local`:

```bash
cp .env.example .env.local
```

Key variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for signing JWT tokens
- `AUTH_PASSWORD`: Password for login endpoint
- `FRONTEND_URL`: Frontend URL for CORS (e.g., `https://your-vercel-app.vercel.app`)

### 2. Database (PostgreSQL)

Option A: Local PostgreSQL
```bash
# Create database
createdb mediavault

# Run migrations
npm run prisma:migrate

# Seed with sample data
npm run db:seed
```

Option B: Render (Free Tier)
1. Create free PostgreSQL instance on Render
2. Update `DATABASE_URL` in `.env.local`
3. Run migrations

### 3. Development

```bash
npm install
npm run start:dev
```

API runs on `http://localhost:3001`

### 4. Database Studio (Optional)

View and edit data in browser:
```bash
npm run prisma:studio
```

## API Endpoints

All endpoints require JWT token in Authorization header (except `/api/auth/login`).

### Auth
- `POST /api/auth/login` - Login with password
  ```json
  { "password": "your-password" }
  ```
  Returns: `{ "access_token": "..." }`

### Libraries
- `GET /api/libraries` - Get all libraries
- `GET /api/libraries/:id` - Get library content
- `GET /api/libraries/search?q=query` - Search media

### Playback
- `GET /api/playback/media/:id` - Get media details + HLS variants
- `GET /api/playback/progress/:id` - Get user's watch progress
- `POST /api/playback/progress/:id` - Save watch position
  ```json
  { "position": 300, "duration": 600 }
  ```
- `GET /api/playback/continue-watching` - Get Continue Watching list
- `GET /api/playback/recently-added` - Get Recently Added list

## Database Schema

**users**: Single user account
- id, email, createdAt, updatedAt

**libraries**: Movie/Series folders
- id, name, type, path, createdAt, updatedAt

**media_items**: Movies, series, episodes
- id, title, type, libraryId, duration, codec, year, posterPath
- seriesId (for episodes), seasonNumber, episodeNumber
- createdAt, updatedAt

**hls_variants**: Multi-bitrate HLS outputs
- id, mediaItemId, quality (480p/720p/1080p), bitrate, manifestUrl
- createdAt, updatedAt

**playback_progress**: Watch progress per user
- id, userId, mediaItemId, position (seconds), duration, lastWatched

## Deployment (Render Free Tier)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repo
4. Set Environment Variables in Render project settings
5. Deploy

Build command: `npm install && npm run prisma:migrate:prod && npm run build`
Start command: `npm run start:prod`

## Troubleshooting

**Cannot connect to database**
- Verify `DATABASE_URL` is correct
- Check PostgreSQL is running
- For Render: Ensure IP whitelist includes Render dyno IPs

**JWT errors**
- Verify `JWT_SECRET` is set
- Token expires after 7 days by default

**CORS errors**
- Add your frontend URL to CORS origins in `src/main.ts`
- Include `https://` protocol

## Next Steps

1. Integrate with frontend player
2. Build media ingest/transcode worker (Phase 2)
3. Add admin endpoints for library scanning
4. Multi-bitrate HLS transcoding setup
