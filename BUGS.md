# EduPlatform — Troubleshooting, Known Edge Cases & Roadmap

This document catalogs potential edge cases, common developer troubleshooting solutions, known limitations, and the future engineering roadmap for **EduPlatform**.

---

## 1. Common Troubleshooting Scenarios & Fixes

### 1.1 MongoDB Connection Refused (`ECONNREFUSED 127.0.0.1:27017`)
- **Symptom**: Server startup logs `MongoDB connection failed. Retrying in 5s...`
- **Cause**: Local MongoDB service is not running.
- **Resolution**:
  - Windows: Open Services (`services.msc`) and start `MongoDB Server (MongoDB)`.
  - Docker: Run `docker start eduplatform-mongo` or `docker run -d -p 27017:27017 --name eduplatform-mongo mongo:7`.
  - Alternatively, update `MONGO_URI` in `server/.env` to point to a free MongoDB Atlas cloud cluster.

### 1.2 Vite Proxy 500 / Network Error on `/api/*`
- **Symptom**: Frontend displays `Network Error` or Axios returns status `500` for API calls.
- **Cause**: The Express server on port `5000` is either offline or crashed.
- **Resolution**:
  - Check the backend console output for syntax or unhandled errors.
  - Verify that `client/vite.config.js` has the proxy target set to `http://localhost:5000`.

### 1.3 JWT Token Expiration & Infinite Redirect Loop
- **Symptom**: User is continuously kicked back to `/login` immediately after navigating to `/dashboard`.
- **Cause**: Token in `localStorage` expired or `JWT_SECRET` in `server/.env` was modified after issuing tokens.
- **Resolution**:
  - Open browser DevTools ➔ Application ➔ Local Storage ➔ Clear `token` and `user`.
  - Log in again with valid credentials.

### 1.4 Multer File Upload Failures (`File too large` / `LIMIT_FILE_SIZE`)
- **Symptom**: Uploading large video files or slide decks returns `400 Bad Request`.
- **Cause**: The upload exceeds Multer's default 100MB limit.
- **Resolution**:
  - For files > 100MB, adjust `limits: { fileSize: 500 * 1024 * 1024 }` in `server/middleware/upload.js`.
  - For production scaling, offload large video uploads directly to Amazon S3 or Cloudinary with presigned URLs.

---

## 2. Handled Edge Cases & Built-In Resilience

### 2.1 CBT Examination Tab Switching & Browser Refresh
- **Edge Case**: Student accidentally reloads the page during a 3-hour CBT mock exam.
- **Resilience**: The client state synchronizes with `TestAttempt` in MongoDB. Because every question answer is auto-saved via `PUT /api/tests/:id/answer`, refreshing the browser resumes the test from the exact question and remaining time without data loss.

### 2.2 Double Form Submissions & Rapid Click Spamming
- **Edge Case**: Rapidly clicking "Submit Test" or "Enroll Course" creating duplicate attempts or database anomalies.
- **Resilience**:
  - Frontend buttons automatically enter an `isLoading` disabled state upon initial click.
  - Mongoose models enforce compound unique indexes: `{ user: 1, course: 1 }` on `Enrollment` and `{ user: 1, lecture: 1 }` on `LectureProgress`.

### 2.3 Floating-Point Negative Marking Calculations
- **Edge Case**: Subtraction of decimal penalties (e.g. `-0.33` or `-0.25` marks) causing JavaScript floating-point errors (e.g., `3.999999999996`).
- **Resilience**: `testController.js` and `quizController.js` apply `Math.round(score * 100) / 100` to ensure two decimal places on all score totals.

### 2.4 Unvisited vs. Unanswered Questions in CBT Palette
- **Edge Case**: Distinction between skipping a question and visiting a question without choosing an option.
- **Resilience**: The `TestAttempt` model tracks both `visited` (Boolean) and `selectedOption` (Array), accurately rendering the national exam palette legend (Red for visited but unanswered, Gray for unvisited).

---

## 3. Known Limitations (Phase 1 MVP)

| Limitation | Impact | Workaround in MVP |
|---|---|---|
| **Local File Storage** | Uploaded PDFs and images are stored in `server/uploads/` on the server disk. | Served statically via Express; works for single-server setups. |
| **Mock AI Engine** | AI summaries and recommendations use rule-based heuristics rather than live LLM tokens. | Structured data models allow dropping in Google Gemini or OpenAI API keys in Phase 2. |
| **Simulated Video Streaming** | Video lectures play via standard HTML5 video elements or embed URLs. | Full HLS/DASH adaptive bitrate streaming can be added with AWS MediaConvert or Cloudflare Stream. |
| **Single-Attempt Leaderboard Scoring** | Leaderboard aggregates maximum score per test rather than averaging historical retakes. | Fair cohort comparison for standard test series. |

---

## 4. Phase 2 Roadmap & Planned Enhancements

### 4.1 Real-Time Live Virtual Classrooms
- [ ] WebRTC / Socket.io peer-to-peer live streaming for instructor sessions.
- [ ] Real-time in-session chat, live MCQ polls, and student hand-raising queues.

### 4.2 Live Generative AI Integration (Gemini 2.0 / OpenAI)
- [ ] Automated question paper generation from uploaded PDF textbooks.
- [ ] Multi-lingual AI doubt tutor offering voice explanations and KaTeX mathematical step derivations.
- [ ] Intelligent semantic search across transcripts of all recorded video lectures.

### 4.3 Cloud Asset Management & CDN
- [ ] Direct-to-S3 / Google Cloud Storage file uploads using presigned URLs.
- [ ] CloudFront / Fastly CDN edge distribution for low-latency PDF streaming.

### 4.4 Advanced Gamification & Social Learning
- [ ] XP points system, level progression, and daily streak freeze rewards.
- [ ] Peer-to-peer 1v1 live quiz battles with timed leaderboards.
- [ ] Student study groups with shared document annotation capabilities.

### 4.5 Native Mobile Apps
- [ ] React Native / Expo cross-platform mobile application with offline video downloads and push notifications.
