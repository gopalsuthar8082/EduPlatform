# EduPlatform — Digital Education & Exam-Preparation Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MongoDB%20|%20Express%20|%20React%20|%20Node-61DAFB?logo=react&logoColor=white)](#)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%203.4-38B2AC?logo=tailwind-css&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Bundler-Vite%205-646CFF?logo=vite&logoColor=white)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

A modern, student-centric digital education and competitive exam preparation ecosystem. EduPlatform combines a structured **Learning Management System (LMS)**, a simulated **Computer-Based Testing (CBT) Examination Engine**, a multi-tiered **Question Bank with PYQs**, an interactive **Academic Community & Doubts Forum**, and an intelligent **AI Study Assistant**.

---

## 🌟 Key Features

### 🎓 1. Student Dashboard & Personalized Hub
- **KPI Metrics**: Real-time tracking of active study streaks (`🔥`), total enrolled courses, questions attempted, average accuracy, and study hours.
- **Continue Learning**: 1-click resumption of the latest watched video lecture, opened PDF, or pending quiz.
- **Visual Analytics**: Interactive Recharts graphs showing score progression over time and subject-wise strengths vs. weaknesses.
- **AI Study Assistant**: Contextual recommendations highlighting topics requiring revision based on diagnostic test accuracy.

### 📚 2. Structured Course Syllabus & Taxonomy
- **4-Level Hierarchy**: Courses ➔ Subjects ➔ Chapters ➔ Topics.
- **Interactive Topic View**: Dedicated learning hub per topic with 5 built-in tabs (Study Materials, Video Lectures, Topic Quizzes, Practice MCQs, and Topic Doubts).
- **Progress Tracking**: Automatic percentage calculation based on completed topics, video watch time, and quiz scores.

### 📝 3. Study Materials & Document Reader
- **Multi-Format Support**: High-performance reading experience for PDFs, PPT slide decks, formula sheets, and handwritten notes.
- **AI Sidebar**: Summaries, numbered key takeaways, and 3D interactive flashcard flip decks.
- **Annotate & Bookmark**: Personal note-taking markdown editor and one-click bookmarking for quick revision.

### 🎥 4. Video Lectures & Classroom Masterclasses
- **HD Video Player**: 16:9 player with progress resume (`"Resume from 12:45"`), elapsed time tracking, and playback controls.
- **Interactive Companion**: Synchronized chapter notes, downloadable slide decks, concept-check questions, and time-stamped doubt threads.

### ⚡ 5. Quizzes & Rapid Concept Drills
- **Formats**: Single Choice (MCQ), Multiple Select (MSQ), and Numerical inputs.
- **Modes**: Timed drills, graded assessments, and practice drills with instant color-coded feedback (`after_each`).
- **Scorecards**: Accuracy percentages, speed telemetry, and step-by-step mathematical explanations.

### 🎯 6. CBT Examination Simulator (Competitive Mock Exams)
- **Authentic Examination Interface**: Multi-section tabs (e.g., Physics / Chemistry / Math), countdown timer with warning alerts, and fullscreen mode.
- **Standard 5-State Palette**: Color-coded tracking for Answered (Green), Unanswered (Red), Marked for Review (Purple), and Visited.
- **Auto-Save & Auto-Submit**: 30-second background auto-save and automatic submission upon timer expiration.
- **Post-Exam Intelligence**: All India Rank (AIR), cohort percentile, section-wise breakdown, time spent per question, and AI remediation plan.

### 🗄️ 7. Comprehensive Question Bank & PYQ Archives
- **Advanced 7-Field Filtering**: Search by Subject, Chapter, Topic, Difficulty (Easy/Medium/Hard), Question Type, Target Exam, and PYQ Year.
- **Focus Practice Mode**: Single-question drill modal with instant solution reveal and bookmarking.
- **Previous Year Papers (PYQ)**: Browse, download, or directly launch past exam papers into the CBT simulator.

### 💬 8. Academic Community, Forums & Polls
- **Topic-Linked Doubts**: Ask questions tagged to specific courses or topics with markdown and image attachments.
- **Educator Verification**: Verified educator answer badges and accepted solution checkmarks.
- **Interactive Polls**: Live vote casting with instant horizontal bar chart tallies.

### 🛡️ 9. Comprehensive Admin & Role-Based Control Suite
- **Granular RBAC**: 8 distinct roles (`superadmin`, `admin`, `content_manager`, `instructor`, `question_manager`, `reviewer`, `moderator`, `student`).
- **Curriculum Builder**: Visual tree builder to construct and reorder courses, subjects, chapters, and topics.
- **Question & Test Manager**: Multi-section CBT mock exam creator, bulk question importer, and rubric manager.
- **Platform Analytics**: Enrollment trends, 30-day user growth, active engagement metrics, and moderation tools.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18 (Vite 5), Tailwind CSS 3.4, React Router v6, Recharts, React Icons (Heroicons v2), React Hot Toast, Date-fns, React CountUp |
| **Backend** | Node.js, Express.js, Mongoose 8, JWT, BcryptJS, Multer, Helmet, Morgan, Express-Rate-Limit, Slugify |
| **Database** | MongoDB 7+ (21 normalized schemas with compound indexes) |
| **Tooling** | Concurrently, PostCSS, Autoprefixer |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [MongoDB](https://www.mongodb.com/) (v6.0 or higher running locally on `mongodb://localhost:27017` or MongoDB Atlas URI)

### Installation

1. **Clone or Navigate to the Project:**
   ```bash
   cd eduplatform
   ```

2. **Install All Dependencies:**
   ```bash
   npm run install-all
   ```
   *(This automatically installs root, server, and client dependencies)*

3. **Configure Environment Variables:**
   Create a `.env` file in the `server` directory (or verify `server/.env`):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/eduplatform
   JWT_SECRET=super_secret_jwt_key_eduplatform_2026
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:5173
   ```

4. **Seed the Database (Courses, Questions, Tests, Users):**
   ```bash
   node server/utils/seeder.js
   ```

5. **Start Both Backend and Frontend in Development Mode:**
   ```bash
   npm run dev
   ```
   - **Frontend App**: `http://localhost:5173`
   - **Backend API**: `http://localhost:5000/api`

---

## 🔑 Default Login Credentials (from Seeder)

| Role | Email | Password | Access Scope |
|---|---|---|---|
| **Super Admin** | `admin@eduplatform.com` | `password123` | Full admin suite, user management, all permissions |
| **Instructor** | `dr.sharma@eduplatform.com` | `password123` | Courses, lectures, quizzes, doubts, student analytics |
| **Instructor** | `prof.gupta@eduplatform.com` | `password123` | Content creation, test series, question authoring |
| **Student** | `rahul.verma@student.edu` | `password123` | Student dashboard, courses, CBT exams, forums |
| **Student** | `ananya.patel@student.edu` | `password123` | Student dashboard, courses, CBT exams, forums |

---

## 📁 Repository Structure

```
eduplatform/
├── package.json                   # Root orchestrator scripts (concurrently)
├── DESIGN.md                      # Complete system architecture and ER diagrams
├── DEVELOPMENT.md                 # Developer setup, conventions, and guidelines
├── API.md                         # Exhaustive REST API endpoint catalog
├── BUGS.md                        # Known issues, mitigations, and roadmap
│
├── server/                        # Node.js + Express Backend
│   ├── config/                    # Database (db.js) & System Constants (constants.js)
│   ├── controllers/               # 17 Business logic controllers
│   ├── middleware/                # Auth, RBAC, Upload (Multer), ErrorHandler
│   ├── models/                    # 21 Mongoose schema models
│   ├── routes/                    # 17 Express route handlers & API index
│   ├── utils/                     # Pagination helpers & Database Seeder
│   └── server.js                  # Main server entrypoint
│
└── client/                        # React 18 + Vite Frontend
    ├── src/
    │   ├── components/
    │   │   ├── common/            # 18 Reusable UI components (Button, Card, Modal, Table...)
    │   │   └── layout/            # 6 Layout components (Sidebar, Navbar, ProtectedRoute...)
    │   ├── context/               # AuthContext & ThemeContext providers
    │   ├── hooks/                 # Custom hooks (useAuth, useFetch, useTimer, useDebounce)
    │   ├── pages/
    │   │   ├── auth/              # Login, Register, Forgot Password
    │   │   ├── student/           # Dashboard, Courses, Materials, Lectures, CBT Exams...
    │   │   └── admin/             # 14 Full Admin Panel management views
    │   ├── services/              # 14 Axios REST API service clients
    │   ├── utils/                 # Formatting helpers, constants, mock datasets
    │   ├── App.js                 # Central React Router v6 route registry
    │   └── main.js                # Vite React root mount
    ├── tailwind.config.js         # Custom design tokens & palettes
    └── vite.config.js             # Vite config with API proxy
```

---

## 📜 Available NPM Scripts

| Command | Working Directory | Description |
|---|---|---|
| `npm run dev` | Root | Concurrently runs both backend (`:5000`) and frontend (`:5173`) |
| `npm run server` | Root | Runs backend server only (`node server/server.js`) |
| `npm run client` | Root | Runs Vite development server (`cd client && npm run dev`) |
| `npm run install-all` | Root | Installs dependencies across root, server, and client folders |
| `npm run build` | `client/` | Creates production-optimized frontend bundle |
| `node server/utils/seeder.js` | Root / `server/` | Flushes DB and populates rich test dataset |

---

## 📄 License
This project is licensed under the MIT License.
