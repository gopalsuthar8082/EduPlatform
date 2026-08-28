# EduPlatform — REST API Reference Manual

Base URL: `http://localhost:5000/api`  
Authentication: `Authorization: Bearer <JWT_TOKEN>` header (or HTTP-only cookie)

---

## 1. Authentication & User Profile (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new student account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Protected | Fetch currently logged-in user profile |
| `PUT` | `/api/auth/update-profile` | Protected | Update profile (bio, phone, institution, city) |
| `PUT` | `/api/auth/change-password` | Protected | Change password with current password verification |
| `POST` | `/api/auth/forgot-password` | Public | Generate & dispatch password reset token |
| `POST` | `/api/auth/reset-password/:token` | Public | Set new password using reset token |

#### Example Login Request:
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@eduplatform.com",
  "password": "password123"
}
```

#### Example Login Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "66ce78a1f2b4c1001e389a01",
    "name": "Platform Administrator",
    "email": "admin@eduplatform.com",
    "role": "superadmin",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    "studyStreak": { "current": 14, "longest": 30 }
  }
}
```

---

## 2. Courses & Syllabus Taxonomy (`/api/courses`, `/api/subjects`, `/api/chapters`, `/api/topics`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/courses` | Public | List courses (supports `category`, `difficulty`, `search`, `page`, `limit`) |
| `GET` | `/api/courses/:id` | Public / Optional Auth | Get course details, syllabus tree, and student enrollment status |
| `POST` | `/api/courses` | Staff / Admin | Create a new course with auto-slugification |
| `PUT` | `/api/courses/:id` | Staff / Admin | Update course metadata, instructor, or thumbnail |
| `DELETE` | `/api/courses/:id` | Admin | Delete course and cascade cleanup |
| `PUT` | `/api/courses/:id/status` | Staff / Admin | Update status (`draft`, `review`, `published`, `archived`) |
| `POST` | `/api/courses/:id/enroll` | Student | Enroll authenticated user into course |
| `GET` | `/api/courses/:id/progress` | Student | Get user's completion percentage and completed modules |
| `GET` | `/api/subjects` | Public | List subjects (filterable by `course`) |
| `POST` | `/api/subjects` | Staff / Admin | Create subject under a course |
| `GET` | `/api/chapters` | Public | List chapters (filterable by `subject`, `course`) |
| `POST` | `/api/chapters` | Staff / Admin | Create chapter under a subject |
| `GET` | `/api/topics` | Public | List topics (filterable by `chapter`) |
| `GET` | `/api/topics/:id` | Public | Fetch topic with materials, lectures, and quizzes |
| `POST` | `/api/topics` | Staff / Admin | Create topic under a chapter |

---

## 3. Study Materials & Documents (`/api/materials`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/materials` | Public | List materials (filter by `course`, `subject`, `type`: `pdf`/`ppt`/`notes`) |
| `GET` | `/api/materials/:id` | Public | Get material details and increment view counter |
| `POST` | `/api/materials` | Staff / Admin | Upload new document with Multer multipart form data |
| `PUT` | `/api/materials/:id` | Staff / Admin | Update material details or replace document |
| `DELETE` | `/api/materials/:id` | Staff / Admin | Delete material and associated bookmarks |
| `POST` | `/api/materials/:id/bookmark` | Student | Toggle bookmark on study material |
| `POST` | `/api/materials/:id/highlight` | Student | Save page highlights / annotations |
| `POST` | `/api/materials/:id/note` | Student | Save personal study note on material |

---

## 4. Video Lectures & Progress (`/api/lectures`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/lectures` | Public | List lectures with hierarchy and duration |
| `GET` | `/api/lectures/:id` | Public / Auth | Fetch video URL, notes, resources, and resume position |
| `POST` | `/api/lectures` | Staff / Admin | Create new video lecture |
| `PUT` | `/api/lectures/:id` | Staff / Admin | Update lecture details or notes |
| `DELETE` | `/api/lectures/:id` | Staff / Admin | Delete lecture |
| `PUT` | `/api/lectures/:id/progress` | Student | Update playback position and mark completed (if `>=90%`) |
| `GET` | `/api/lectures/:id/progress` | Student | Get user's saved playback progress |

---

## 5. Question Bank & Question Papers (`/api/questions`, `/api/question-papers`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/questions` | Public | Search question bank with 7-field filtering and pagination |
| `GET` | `/api/questions/:id` | Public / Auth | Get question with step-by-step solution and explanation |
| `POST` | `/api/questions` | Staff / Admin | Create single question with MCQ/MSQ/Numerical options |
| `POST` | `/api/questions/bulk` | Staff / Admin | Batch insert multiple questions via JSON array |
| `PUT` | `/api/questions/:id` | Staff / Admin | Update question, options, or solution |
| `DELETE` | `/api/questions/:id` | Staff / Admin | Soft/Hard delete question |
| `POST` | `/api/questions/:id/bookmark`| Student | Bookmark question for revision |
| `GET` | `/api/questions/bookmarked` | Student | Get all bookmarked questions for authenticated user |
| `GET` | `/api/questions/incorrect` | Student | Get list of questions user previously answered incorrectly |
| `GET` | `/api/question-papers` | Public | List PYQ and Mock question papers |
| `GET` | `/api/question-papers/:id` | Public | Get full question paper with populated questions |
| `POST` | `/api/question-papers` | Staff / Admin | Create question paper bundle |

---

## 6. Quizzes & Rapid Drills (`/api/quizzes`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/quizzes` | Public | List available quizzes by course/topic/type |
| `GET` | `/api/quizzes/:id` | Public | Get quiz info and question count (sanitized answers) |
| `POST` | `/api/quizzes` | Staff / Admin | Create quiz and associate questions |
| `POST` | `/api/quizzes/:id/start` | Student | Initialize a new QuizAttempt record |
| `PUT` | `/api/quizzes/:id/submit` | Student | Submit answers, calculate score, and auto-grade |
| `GET` | `/api/quizzes/:id/result` | Student | Get scorecard with correct answers & explanations |
| `GET` | `/api/quizzes/:id/history` | Student | Get attempt history and accuracy trends for quiz |

---

## 7. CBT Mock Examinations (`/api/tests`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/tests` | Public | List CBT test series and scheduled mock exams |
| `GET` | `/api/tests/:id` | Public | Get test instructions, sections breakdown, and timing rules |
| `POST` | `/api/tests` | Staff / Admin | Create multi-section CBT exam with negative marking rules |
| `POST` | `/api/tests/:id/start` | Student | Start CBT test, create `TestAttempt`, return questions |
| `PUT` | `/api/tests/:id/answer` | Student | **Auto-Save**: Save/update answer for a single question |
| `PUT` | `/api/tests/:id/mark-review`| Student | Toggle "Mark for Review" state on question |
| `PUT` | `/api/tests/:id/submit` | Student | Final submit: auto-grade, apply negative marks, compute rank |
| `GET` | `/api/tests/:id/result` | Student | Comprehensive scorecard with section breakdown and solutions |
| `GET` | `/api/tests/:id/analysis` | Student | Topic-wise performance, time analysis, and percentile |

#### Example CBT Auto-Save Payload:
```http
PUT /api/tests/66ce78a1f2b4c1001e389b02/answer
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "questionId": "66ce78a1f2b4c1001e389c15",
  "selectedOption": [1],
  "timeTaken": 42,
  "markedForReview": false
}
```

---

## 8. Academic Community & Polls (`/api/discussions`, `/api/polls`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/discussions` | Public | List discussions (sort: `recent`, `popular`, `unanswered`) |
| `GET` | `/api/discussions/:id` | Public | Get discussion thread with replies and accepted solutions |
| `POST` | `/api/discussions` | Protected | Post new discussion or doubt |
| `POST` | `/api/discussions/:id/reply` | Protected | Post reply to discussion thread |
| `PUT` | `/api/discussions/:id/upvote`| Protected | Upvote / remove upvote on discussion |
| `PUT` | `/api/discussions/:id/downvote`| Protected | Downvote discussion |
| `PUT` | `/api/replies/:id/mark-helpful`| Author/Admin| Mark reply as verified/accepted solution |
| `GET` | `/api/polls` | Public | List active community polls |
| `POST` | `/api/polls` | Staff / Admin | Create new poll |
| `POST` | `/api/polls/:id/vote` | Protected | Cast vote on poll option |

---

## 9. Dashboards & Learning Analytics (`/api/dashboard`, `/api/analytics`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/dashboard/student` | Student | Aggregated metrics: streak, progress, continue learning, AI tips |
| `GET` | `/api/dashboard/admin` | Admin | Platform stats: users, enrollments, test velocity, activity |
| `GET` | `/api/dashboard/instructor` | Instructor | Course stats: student counts, doubts, submissions |
| `GET` | `/api/analytics/performance` | Student | Overall accuracy, score timeline, total hours |
| `GET` | `/api/analytics/subject-wise`| Student | Multi-subject radar/bar accuracy breakdown |
| `GET` | `/api/analytics/leaderboard` | Public / Auth | Cohort leaderboard (filter by `scope` and `timeframe`) |
| `GET` | `/api/analytics/recommendations`| Student| Rule-based AI study recommendations for weak topics |

---

## 10. Admin User Governance & Announcements (`/api/admin`, `/api/announcements`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/users` | Admin | Paginated user management table with role/status filters |
| `GET` | `/api/admin/users/:id` | Admin | Fetch user profile and activity summary |
| `POST` | `/api/admin/users` | Admin | Create user with specific role |
| `PUT` | `/api/admin/users/:id/role` | Superadmin | Update user role |
| `PUT` | `/api/admin/users/:id/permissions`| Superadmin | Assign granular resource-action permission matrix |
| `DELETE` | `/api/admin/users/:id` | Admin | Soft delete / deactivate user account |
| `GET` | `/api/admin/roles` | Admin | List system roles and permission catalogs |
| `GET` | `/api/announcements` | Public / Auth | List active broadcasts (filtered by user role) |
| `POST` | `/api/announcements` | Staff / Admin | Publish new announcement |
| `DELETE` | `/api/announcements/:id` | Admin | Delete announcement |

---

## 11. Global Error Code Standards

| HTTP Status | Meaning | Typical Scenario |
|---|---|---|
| `200 OK` | Success | Standard successful retrieval or update |
| `201 Created` | Resource Created | Successful registration, course creation, or submission |
| `400 Bad Request` | Validation Error | Missing required fields, invalid email format, incorrect password |
| `401 Unauthorized` | Auth Required | Missing or expired JWT bearer token |
| `403 Forbidden` | Access Denied | Student attempting to access admin route or alter another user's content |
| `404 Not Found` | Resource Missing | Course, quiz, or question ID does not exist in database |
| `429 Too Many Requests`| Rate Limited | Exceeded 100 requests per 15-minute window |
| `500 Server Error` | Internal Failure | Unhandled database error or unexpected server exception |
