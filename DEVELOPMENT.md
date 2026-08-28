# EduPlatform — Developer & Contributor Guide

This document outlines local environment setup, architecture workflows, coding standards, API design patterns, testing instructions, and deployment practices for **EduPlatform**.

---

## 1. Local Development Workflow

### 1.1 Prerequisites Setup
1. **Node.js**: Ensure Node.js v18.0+ is installed (`node -v`).
2. **MongoDB**: Install MongoDB Community Server or run MongoDB via Docker:
   ```bash
   docker run -d -p 27017:27017 --name eduplatform-mongo mongo:7
   ```

### 1.2 Initial Project Bootstrapping
```bash
# 1. Clone/Navigate to directory
cd eduplatform

# 2. Install all dependencies recursively
npm run install-all

# 3. Populate sample courses, mock exams, and test credentials
node server/utils/seeder.js

# 4. Start full-stack development servers
npm run dev
```

The Vite dev server runs with Hot Module Replacement (HMR) on port `5173`, and automatically proxies all `/api/*` network requests to Express running on port `5000`.

---

## 2. Code Architecture & Conventions

### 2.1 Backend Conventions
- **Module System**: CommonJS (`require` and `module.exports`) is strictly used across all `server/` files.
- **Async Pattern**: All controllers must be `async` functions with proper `try / catch` blocks passing errors to `next(err)` or returning custom `ErrorResponse`.
- **Response Format**: All REST endpoints must return consistent JSON structures:
  ```json
  {
    "success": true,
    "count": 10,
    "pagination": { "page": 1, "limit": 10, "totalPages": 3, "totalResults": 25 },
    "data": [ ... ]
  }
  ```
- **Soft Deletions**: Important records (users, questions, courses) should utilize soft deletion (`isActive = false` or `status = 'archived'`) whenever feasible.

### 2.2 Frontend Conventions
- **Module System**: ES Modules (`import` / `export`) with `.js` file extensions.
- **Styling Strategy**: 100% Tailwind CSS utility classes. Custom colors are defined in `client/tailwind.config.js`:
  - `primary`: Indigo (`indigo-600`, `indigo-700`)
  - `success`: Emerald (`emerald-500`, `emerald-600`)
  - `warning`: Amber (`amber-500`, `amber-600`)
  - `danger`: Red (`red-500`, `red-600`)
  - `neutral`: Slate / Gray
- **Icons**: Standardized on **Heroicons v2** via `react-icons/hi2` (`HiOutline*` for navigation/cards, `Hi*` for filled actions).
- **Component Hierarchy**:
  - `components/common/`: Domain-agnostic UI primitives (`Button.js`, `Modal.js`, `Table.js`, `StatCard.js`).
  - `components/layout/`: Global structural elements (`Sidebar.js`, `Navbar.js`, `DashboardLayout.js`).
  - `pages/`: Page route controllers wrapped in `DashboardLayout` or standalone.

---

## 3. How to Add a New Feature

### Step 1: Create or Update Mongoose Model
Create a new model in `server/models/NewFeature.js` and export it through `server/models/index.js`.
```javascript
const mongoose = require('mongoose');

const NewFeatureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('NewFeature', NewFeatureSchema);
```

### Step 2: Implement Controller & Business Logic
Create `server/controllers/newFeatureController.js`:
```javascript
const { NewFeature } = require('../models');
const ErrorResponse = require('../middleware/errorHandler');

exports.getNewFeatures = async (req, res, next) => {
  try {
    const items = await NewFeature.find().populate('user', 'name avatar');
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (err) {
    next(err);
  }
};
```

### Step 3: Define Routes & RBAC Protection
Create `server/routes/newFeatures.js` and mount it inside `server/routes/index.js`:
```javascript
const express = require('express');
const router = express.Router();
const { getNewFeatures } = require('../controllers/newFeatureController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.route('/')
  .get(protect, getNewFeatures);

module.exports = router;
```

### Step 4: Add Frontend Service
Create `client/src/services/newFeatureService.js`:
```javascript
import api from './api';

export const getNewFeatures = async (params) => {
  const response = await api.get('/new-features', { params });
  return response.data;
};
```

### Step 5: Build View Component & Register Route
Create `client/src/pages/student/NewFeaturePage.js` and register it in `client/src/App.js`:
```javascript
const NewFeaturePage = lazy(() => import('./pages/student/NewFeaturePage'));
// In App.js routes:
<Route path="/new-features" element={<ProtectedRoute><DashboardLayout><NewFeaturePage /></DashboardLayout></ProtectedRoute>} />
```

---

## 4. Database Seeder & Data Management

The seeder (`server/utils/seeder.js`) resets the database and creates a complete demo environment:
- 1 Superadmin user (`admin@eduplatform.com`)
- 2 Instructors (`dr.sharma@eduplatform.com`, `prof.gupta@eduplatform.com`)
- 5 Students with varying study streaks and attempt records
- 3 Complete courses (Physics, Chemistry, Mathematics) with subjects, chapters, and topics
- 20 High-yield exam questions (MCQ/MSQ/Numerical)
- 2 Topic quizzes and 1 Full-length CBT Examination (3 sections)
- 3 Doubts discussion threads with verified faculty answers
- 2 Live polls and 2 System announcements

To execute:
```bash
node server/utils/seeder.js
```

---

## 5. Build & Production Deployment

### 5.1 Frontend Production Build
```bash
cd client
npm run build
```
This produces an optimized, minified single-page application in `client/dist/`.

### 5.2 Production Server Configuration
Set production environment variables in `.env`:
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/eduplatform?retryWrites=true&w=majority
JWT_SECRET=strong_production_random_secret_string
CLIENT_URL=https://your-domain.com
```

### 5.3 Serving Static Assets in Production
In production, Express can be configured to serve the `client/dist` build:
```javascript
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
}
```

---

## 6. Testing Strategy

- **Manual Route Verification**: Use Postman or VS Code REST Client to test `/api/*` endpoints.
- **Frontend State Testing**: Verify mock data fallbacks and offline resilience in custom hooks (`useFetch`, `useTimer`).
- **CBT Edge Case Testing**:
  - Test browser refresh during an active test to ensure answers persist.
  - Test countdown timer auto-submission when timer hits `00:00:00`.
  - Test negative marking calculations with decimal penalties.
