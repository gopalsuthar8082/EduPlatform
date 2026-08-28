const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const {
  User,
  Course,
  Subject,
  Chapter,
  Topic,
  StudyMaterial,
  Lecture,
  LectureProgress,
  Question,
  QuestionPaper,
  Quiz,
  QuizAttempt,
  Test,
  TestAttempt,
  Discussion,
  Reply,
  Poll,
  Enrollment,
  Bookmark,
  StudentActivity,
  Announcement
} = require('../models');

const {
  USER_ROLES,
  CONTENT_STATUS,
  QUESTION_TYPES,
  DIFFICULTY_LEVELS,
  COURSE_DIFFICULTY,
  QUIZ_TYPES,
  TEST_TYPES,
  ATTEMPT_STATUS,
  ANNOUNCEMENT_AUDIENCE,
  ANNOUNCEMENT_PRIORITY
} = require('../config/constants');

const MONGO_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  'mongodb://127.0.0.1:27017/eduplatform';

const seedDatabase = async () => {
  try {
    console.log('==============================================');
    console.log('  EduPlatform Database Seeder');
    console.log('==============================================');
    console.log(`Connecting to MongoDB at: ${MONGO_URI}`);

    await mongoose.connect(MONGO_URI);
    console.log(' Connected to MongoDB successfully.');

    // 1. Clear all existing collections
    console.log('\n Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Subject.deleteMany({}),
      Chapter.deleteMany({}),
      Topic.deleteMany({}),
      StudyMaterial.deleteMany({}),
      Lecture.deleteMany({}),
      LectureProgress.deleteMany({}),
      Question.deleteMany({}),
      QuestionPaper.deleteMany({}),
      Quiz.deleteMany({}),
      QuizAttempt.deleteMany({}),
      Test.deleteMany({}),
      TestAttempt.deleteMany({}),
      Discussion.deleteMany({}),
      Reply.deleteMany({}),
      Poll.deleteMany({}),
      Enrollment.deleteMany({}),
      Bookmark.deleteMany({}),
      StudentActivity.deleteMany({}),
      Announcement.deleteMany({})
    ]);
    console.log(' All collections cleared successfully.');

    // 2. Create Users
    console.log('\n Creating Users...');
    const superAdmin = await User.create({
      name: 'Platform Administrator',
      email: 'admin@eduplatform.com',
      password: 'password123',
      role: USER_ROLES.SUPERADMIN,
      isVerified: true,
      permissions: [{ resource: '*', actions: ['*'] }],
      profile: {
        bio: 'Chief System Administrator of EduPlatform',
        institution: 'EduPlatform HQ'
      }
    });

    const instructor1 = await User.create({
      name: 'Dr. Rajesh Sharma',
      email: 'dr.sharma@eduplatform.com',
      password: 'password123',
      role: USER_ROLES.INSTRUCTOR,
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      profile: {
        bio: 'Senior Professor in Computer Science & Algorithms with 15+ years experience.',
        institution: 'Indian Institute of Technology',
        city: 'New Delhi',
        state: 'Delhi'
      }
    });

    const instructor2 = await User.create({
      name: 'Prof. Ananya Gupta',
      email: 'prof.gupta@eduplatform.com',
      password: 'password123',
      role: USER_ROLES.INSTRUCTOR,
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
      profile: {
        bio: 'Full-Stack Web Architect & Mathematics Educator.',
        institution: 'National Institute of Technology',
        city: 'Bengaluru',
        state: 'Karnataka'
      }
    });

    const studentsData = [
      {
        name: 'Rahul Verma',
        email: 'rahul.verma@eduplatform.com',
        password: 'password123',
        role: USER_ROLES.STUDENT,
        isVerified: true,
        studyStreak: { current: 7, longest: 14, lastStudyDate: new Date() },
        profile: { city: 'Mumbai', state: 'Maharashtra', institution: 'Mumbai University' }
      },
      {
        name: 'Priya Singh',
        email: 'priya.singh@eduplatform.com',
        password: 'password123',
        role: USER_ROLES.STUDENT,
        isVerified: true,
        studyStreak: { current: 12, longest: 18, lastStudyDate: new Date() },
        profile: { city: 'Pune', state: 'Maharashtra', institution: 'COEP Tech' }
      },
      {
        name: 'Amit Kumar',
        email: 'amit.kumar@eduplatform.com',
        password: 'password123',
        role: USER_ROLES.STUDENT,
        isVerified: true,
        studyStreak: { current: 4, longest: 9, lastStudyDate: new Date() },
        profile: { city: 'Jaipur', state: 'Rajasthan', institution: 'MNIT Jaipur' }
      },
      {
        name: 'Sneha Patel',
        email: 'sneha.patel@eduplatform.com',
        password: 'password123',
        role: USER_ROLES.STUDENT,
        isVerified: true,
        studyStreak: { current: 15, longest: 21, lastStudyDate: new Date() },
        profile: { city: 'Ahmedabad', state: 'Gujarat', institution: 'Nirma University' }
      },
      {
        name: 'Vikram Mehta',
        email: 'vikram.mehta@eduplatform.com',
        password: 'password123',
        role: USER_ROLES.STUDENT,
        isVerified: true,
        studyStreak: { current: 2, longest: 6, lastStudyDate: new Date() },
        profile: { city: 'Chandigarh', state: 'Punjab', institution: 'PEC Chandigarh' }
      }
    ];

    const students = await User.create(studentsData);
    console.log(` Created 1 Superadmin, 2 Instructors, and ${students.length} Students.`);

    // 3. Create Courses with Hierarchy (Course -> Subject -> Chapter -> Topic)
    console.log('\n Creating Courses, Subjects, Chapters & Topics...');

    // Course 1: Full-Stack MERN
    const course1 = await Course.create({
      title: 'Full-Stack Web Development with MERN Stack',
      description:
        'Comprehensive masterclass covering MongoDB, Express.js, React 18, Node.js, REST APIs, and production deployment.',
      category: 'Computer Science',
      tags: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Full-Stack'],
      instructor: instructor2._id,
      status: CONTENT_STATUS.PUBLISHED,
      difficulty: COURSE_DIFFICULTY.INTERMEDIATE,
      duration: '45 hours',
      prerequisites: ['Basic JavaScript', 'HTML/CSS basics'],
      enrollmentCount: 5,
      ratings: { average: 4.8, count: 24 }
    });

    const subject1A = await Subject.create({
      name: 'Frontend Engineering with React',
      description: 'Master React component architecture, Hooks, Context, State Management and Tailwind CSS.',
      course: course1._id,
      order: 1
    });

    const chapter1A1 = await Chapter.create({
      title: 'React Fundamentals and Hooks',
      description: 'Understanding JSX, Virtual DOM, useState, useEffect, and Custom Hooks.',
      subject: subject1A._id,
      order: 1
    });

    const topic1A1_1 = await Topic.create({
      title: 'Component Lifecycle and State Management',
      subject: subject1A._id,
      chapter: chapter1A1._id,
      order: 1
    });

    const topic1A1_2 = await Topic.create({
      title: 'Advanced Hooks: useMemo, useCallback & useRef',
      subject: subject1A._id,
      chapter: chapter1A1._id,
      order: 2
    });

    const subject1B = await Subject.create({
      name: 'Backend Engineering with Node.js & MongoDB',
      description: 'Building secure, scalable RESTful APIs with Express, Mongoose, and JWT authentication.',
      course: course1._id,
      order: 2
    });

    const chapter1B1 = await Chapter.create({
      title: 'REST API Architecture & MongoDB Modeling',
      description: 'Designing schema models, validation, middleware pipelines, and indexing.',
      subject: subject1B._id,
      order: 1
    });

    const topic1B1_1 = await Topic.create({
      title: 'Mongoose Schemas, Middleware and Indexing',
      subject: subject1B._id,
      chapter: chapter1B1._id,
      order: 1
    });

    // Course 2: Data Structures & Algorithms
    const course2 = await Course.create({
      title: 'Data Structures and Algorithms in Java',
      description:
        'Ace technical coding interviews with deep dives into Arrays, Trees, Graphs, Dynamic Programming and System Design basics.',
      category: 'Software Engineering',
      tags: ['Java', 'Algorithms', 'Data Structures', 'Interview Prep'],
      instructor: instructor1._id,
      status: CONTENT_STATUS.PUBLISHED,
      difficulty: COURSE_DIFFICULTY.ADVANCED,
      duration: '60 hours',
      prerequisites: ['Basic Java Programming'],
      enrollmentCount: 4,
      ratings: { average: 4.9, count: 42 }
    });

    const subject2A = await Subject.create({
      name: 'Advanced Data Structures',
      description: 'Binary Trees, BST, AVL Trees, Heaps, and Graph Representations.',
      course: course2._id,
      order: 1
    });

    const chapter2A1 = await Chapter.create({
      title: 'Trees and Binary Search Trees',
      description: 'Tree traversals, AVL self-balancing, Segment Trees, and Tries.',
      subject: subject2A._id,
      order: 1
    });

    const topic2A1_1 = await Topic.create({
      title: 'Binary Tree Traversals (BFS, DFS, Iterative)',
      subject: subject2A._id,
      chapter: chapter2A1._id,
      order: 1
    });

    // Course 3: Advanced Mathematics
    const course3 = await Course.create({
      title: 'Advanced Mathematics for Competitive Examinations',
      description:
        'Calculus, Linear Algebra, Probability, and Discrete Mathematics structured for national competitive tests.',
      category: 'Mathematics',
      tags: ['Calculus', 'Linear Algebra', 'GATE', 'Competitive Math'],
      instructor: instructor1._id,
      status: CONTENT_STATUS.PUBLISHED,
      difficulty: COURSE_DIFFICULTY.INTERMEDIATE,
      duration: '35 hours',
      enrollmentCount: 3,
      ratings: { average: 4.7, count: 18 }
    });

    const subject3A = await Subject.create({
      name: 'Calculus and Linear Algebra',
      description: 'Differential calculus, Matrices, Eigenvalues, and Vector Spaces.',
      course: course3._id,
      order: 1
    });

    const chapter3A1 = await Chapter.create({
      title: 'Matrix Theory and Eigenvalues',
      description: 'Determinants, Rank of a Matrix, Eigenvectors and Diagonalization.',
      subject: subject3A._id,
      order: 1
    });

    const topic3A1_1 = await Topic.create({
      title: 'Eigenvalues and Cayley-Hamilton Theorem',
      subject: subject3A._id,
      chapter: chapter3A1._id,
      order: 1
    });

    console.log(' Created 3 Courses with detailed Subjects, Chapters, and Topics.');

    // 4. Create 20 Sample Questions (MCQ / MSQ)
    console.log('\n Creating 20 Sample Questions...');
    const questionsData = [
      // React / Frontend Questions
      {
        questionText: 'Which React Hook is primarily used for performing side effects in functional components?',
        type: QUESTION_TYPES.MCQ,
        options: [
          { text: 'useState', isCorrect: false },
          { text: 'useEffect', isCorrect: true },
          { text: 'useContext', isCorrect: false },
          { text: 'useReducer', isCorrect: false }
        ],
        explanation: 'useEffect is the hook designated for side effects such as data fetching, subscriptions, and DOM mutations.',
        difficulty: DIFFICULTY_LEVELS.EASY,
        subject: subject1A._id,
        chapter: chapter1A1._id,
        topic: topic1A1_1._id,
        course: course1._id,
        marks: 2,
        negativeMarks: 0.5,
        createdBy: instructor2._id,
        status: CONTENT_STATUS.PUBLISHED
      },
      {
        questionText: 'What is the return value of useCallback(fn, deps)?',
        type: QUESTION_TYPES.MCQ,
        options: [
          { text: 'The computed result of calling fn', isCorrect: false },
          { text: 'A memoized version of the callback function', isCorrect: true },
          { text: 'A mutable ref object holding the function', isCorrect: false },
          { text: 'A promise that resolves to fn', isCorrect: false }
        ],
        explanation: 'useCallback returns a memoized version of the callback function that only changes if dependencies change.',
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        subject: subject1A._id,
        chapter: chapter1A1._id,
        topic: topic1A1_2._id,
        course: course1._id,
        marks: 3,
        negativeMarks: 1,
        createdBy: instructor2._id,
        status: CONTENT_STATUS.PUBLISHED
      },
      {
        questionText: 'In React, which of the following triggers a component re-render?',
        type: QUESTION_TYPES.MCQ,
        options: [
          { text: 'Updating a ref via ref.current = val', isCorrect: false },
          { text: 'Calling a state setter with a new state value', isCorrect: true },
          { text: 'Mutating a plain JavaScript object', isCorrect: false },
          { text: 'Console logging inside the component body', isCorrect: false }
        ],
        explanation: 'Calling state setter triggers a scheduled re-render when state value changes.',
        difficulty: DIFFICULTY_LEVELS.EASY,
        subject: subject1A._id,
        chapter: chapter1A1._id,
        topic: topic1A1_1._id,
        course: course1._id,
        marks: 2,
        negativeMarks: 0.5,
        createdBy: instructor2._id,
        status: CONTENT_STATUS.PUBLISHED
      },
      {
        questionText: 'Which lifecycle event does useEffect with an empty dependency array `[]` represent?',
        type: QUESTION_TYPES.MCQ,
        options: [
          { text: 'componentDidUpdate only', isCorrect: false },
          { text: 'componentDidMount (runs once on mount)', isCorrect: true },
          { text: 'componentWillUnmount only', isCorrect: false },
          { text: 'Runs before every render', isCorrect: false }
        ],
        explanation: 'An empty dependency array ensures the effect runs only once after the initial render (mount).',
        difficulty: DIFFICULTY_LEVELS.EASY,
        subject: subject1A._id,
        chapter: chapter1A1._id,
        topic: topic1A1_1._id,
        course: course1._id,
        marks: 2,
        negativeMarks: 0.5,
        createdBy: instructor2._id,
        status: CONTENT_STATUS.PUBLISHED
      },
      {
        questionText: 'What is the primary benefit of React Virtual DOM?',
        type: QUESTION_TYPES.MCQ,
        options: [
          { text: 'Directly executes native C++ graphics commands', isCorrect: false },
          { text: 'Minimizes costly real DOM manipulations via reconciliation algorithm', isCorrect: true },
          { text: 'Replaces the browser HTTP network stack', isCorrect: false },
          { text: 'Eliminates the need for JavaScript', isCorrect: false }
        ],
        explanation: 'Virtual DOM computes the minimal set of changes needed and batches updates to optimize DOM operations.',
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        subject: subject1A._id,
        chapter: chapter1A1._id,
        topic: topic1A1_1._id,
        course: course1._id,
        marks: 3,
        negativeMarks: 1,
        createdBy: instructor2._id,
        status: CONTENT_STATUS.PUBLISHED
      },

      // Backend / MongoDB / Node Questions
      {
        questionText: 'Which HTTP status code signifies that a resource was successfully created?',
        type: QUESTION_TYPES.MCQ,
        options: [
          { text: '200 OK', isCorrect: false },
          { text: '201 Created', isCorrect: true },
          { text: '204 No Content', isCorrect: false },
          { text: '202 Accepted', isCorrect: false }
        ],
        explanation: 'HTTP 201 Created indicates that the request has succeeded and led to the creation of a new resource.',
        difficulty: DIFFICULTY_LEVELS.EASY,
        subject: subject1B._id,
        chapter: chapter1B1._id,
        topic: topic1B1_1._id,
        course: course1._id,
        marks: 2,
        negativeMarks: 0.5,
        createdBy: instructor2._id,
        status: CONTENT_STATUS.PUBLISHED
      },
      {
        questionText: 'In Mongoose, what type of index provides lightning-fast keyword text searches?',
        type: QUESTION_TYPES.MCQ,
        options: [
          { text: '2dsphere index', isCorrect: false },
          { text: 'Text index ($text)', isCorrect: true },
          { text: 'Hashed index', isCorrect: false },
          { text: 'TTL index', isCorrect: false }
        ],
        explanation: 'MongoDB text indexes support text search queries on string content with stemming and language rules.',
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        subject: subject1B._id,
        chapter: chapter1B1._id,
        topic: topic1B1_1._id,
        course: course1._id,
        marks: 3,
        negativeMarks: 1,
        createdBy: instructor2._id,
        status: CONTENT_STATUS.PUBLISHED
      },
      {
        questionText: 'Which middleware is used in Express to parse JSON formatted request bodies?',
        type: QUESTION_TYPES.MCQ,
        options: [
          { text: 'express.static()', isCorrect: false },
          { text: 'express.json()', isCorrect: true },
          { text: 'express.router()', isCorrect: false },
          { text: 'express.cookie()', isCorrect: false }
        ],
        explanation: 'express.json() parses incoming requests with JSON payloads and populates req.body.',
        difficulty: DIFFICULTY_LEVELS.EASY,
        subject: subject1B._id,
        chapter: chapter1B1._id,
        topic: topic1B1_1._id,
        course: course1._id,
        marks: 2,
        negativeMarks: 0.5,
        createdBy: instructor2._id,
        status: CONTENT_STATUS.PUBLISHED
      },
      {
        questionText: 'What is the purpose of JWT (JSON Web Tokens) in web applications?',
        type: QUESTION_TYPES.MCQ,
        options: [
          { text: 'To encrypt the entire database on disk', isCorrect: false },
          { text: 'Stateless, securely verifiable authentication and authorization assertions', isCorrect: true },
          { text: 'To compress multimedia video streams', isCorrect: false },
          { text: 'To replace SSL/TLS certificates', isCorrect: false }
        ],
        explanation: 'JWTs allow claims to be securely transmitted between parties as a compact, digitally signed JSON object.',
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        subject: subject1B._id,
        chapter: chapter1B1._id,
        topic: topic1B1_1._id,
        course: course1._id,
        marks: 3,
        negativeMarks: 1,
        createdBy: instructor2._id,
        status: CONTENT_STATUS.PUBLISHED
      },
      {
        questionText: 'Which Mongoose method atomically finds and updates a document without race conditions?',
        type: QUESTION_TYPES.MCQ,
        options: [
          { text: 'findByIdAndUpdate', isCorrect: true },
          { text: 'findAndRemove', isCorrect: false },
          { text: 'saveAndFlush', isCorrect: false },
          { text: 'updateRawSync', isCorrect: false }
        ],
        explanation: 'findByIdAndUpdate issues a MongoDB native findAndModify command atomically.',
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        subject: subject1B._id,
        chapter: chapter1B1._id,
        topic: topic1B1_1._id,
        course: course1._id,
        marks: 3,
        negativeMarks: 1,
        createdBy: instructor2._id,
        status: CONTENT_STATUS.PUBLISHED
      },

      // Data Structures & Algorithms Questions
      {
        questionText: 'What is the worst-case time complexity of searching an element in a balanced Binary Search Tree (AVL / Red-Black)?',
        type: QUESTION_TYPES.MCQ,
        options: [
          { text: 'O(1)', isCorrect: false },
          { text: 'O(log N)', isCorrect: true },
          { text: 'O(N)', isCorrect: false },
          { text: 'O(N log N)', isCorrect: false }
        ],
        explanation: 'In a self-balancing BST with height O(log N), search requires traversing at most height steps: O(log N).',
        difficulty: DIFFICULTY_LEVELS.EASY,
        subject: subject2A._id,
        chapter: chapter2A1._id,
        topic: topic2A1_1._id,
        course: course2._id,
        marks: 3,
        negativeMarks: 1,
        createdBy: instructor1._id,
        status: CONTENT_STATUS.PUBLISHED
      },
      {
        questionText: 'Which tree traversal algorithm produces elements of a Binary Search Tree in strictly non-decreasing sorted order?',
        type: QUESTION_TYPES.MCQ,
        options: [
          { text: 'Preorder Traversal (Root, Left, Right)', isCorrect: false },
          { text: 'Inorder Traversal (Left, Root, Right)', isCorrect: true },
          { text: 'Postorder Traversal (Left, Right, Root)', isCorrect: false },
          { text: 'Level Order Traversal', isCorrect: false }
        ],
        explanation: 'Inorder traversal visits left subtree, current root node, and then right subtree, giving ascending sorted order for BST.',
        difficulty: DIFFICULTY_LEVELS.EASY,
        subject: subject2A._id,
        chapter: chapter2A1._id,
        topic: topic2A1_1._id,
        course: course2._id,
        marks: 2,
        negativeMarks: 0.5,
        createdBy: instructor1._id,
        status: CONTENT_STATUS.PUBLISHED
      },
      {
        questionText: 'What is the auxiliary space complexity required for Depth First Search (DFS) recursive traversal on a tree with height H?',
        type: QUESTION_TYPES.MCQ,
        options: [
          { text: 'O(1)', isCorrect: false },
          { text: 'O(H) due to call stack', isCorrect: true },
          { text: 'O(H^2)', isCorrect: false },
          { text: 'O(2^H)', isCorrect: false }
        ],
        explanation: 'The call stack grows proportionally to the maximum depth/height H of the tree.',
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        subject: subject2A._id,
        chapter: chapter2A1._id,
        topic: topic2A1_1._id,
        course: course2._id,
        marks: 3,
        negativeMarks: 1,
        createdBy: instructor1._id,
        status: CONTENT_STATUS.PUBLISHED
      },
      {
        questionText: 'Which data structure is typically used to implement Breadth First Search (BFS) / Level Order Traversal?',
        type: QUESTION_TYPES.MCQ,
        options: [
          { text: 'Stack (LIFO)', isCorrect: false },
          { text: 'Queue (FIFO)', isCorrect: true },
          { text: 'Priority Heap', isCorrect: false },
          { text: 'Disjoint Set Union', isCorrect: false }
        ],
        explanation: 'Queue maintains nodes at the current level before processing child nodes at the subsequent level.',
        difficulty: DIFFICULTY_LEVELS.EASY,
        subject: subject2A._id,
        chapter: chapter2A1._id,
        topic: topic2A1_1._id,
        course: course2._id,
        marks: 2,
        negativeMarks: 0.5,
        createdBy: instructor1._id,
        status: CONTENT_STATUS.PUBLISHED
      },
      {
        questionText: 'What is the maximum number of nodes in a binary tree of height H (where root is at height 1)?',
        type: QUESTION_TYPES.MCQ,
        options: [
          { text: '2^H - 1', isCorrect: true },
          { text: '2^(H-1)', isCorrect: false },
          { text: '2*H', isCorrect: false },
          { text: 'H^2', isCorrect: false }
        ],
        explanation: 'Geometric sum 1 + 2 + 4 + ... + 2^(H-1) equals 2^H - 1.',
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        subject: subject2A._id,
        chapter: chapter2A1._id,
        topic: topic2A1_1._id,
        course: course2._id,
        marks: 3,
        negativeMarks: 1,
        createdBy: instructor1._id,
        status: CONTENT_STATUS.PUBLISHED
      },

      // Mathematics / Calculus & Matrix Questions
      {
        questionText: 'If A is an n x n square matrix, the eigenvalues of A are the roots of which characteristic equation?',
        type: QUESTION_TYPES.MCQ,
        options: [
          { text: 'det(A - lambda * I) = 0', isCorrect: true },
          { text: 'trace(A) * lambda = 0', isCorrect: false },
          { text: 'A^T * A = lambda * I', isCorrect: false },
          { text: 'det(A + I) = lambda', isCorrect: false }
        ],
        explanation: 'Eigenvalues lambda satisfy det(A - lambda * I) = 0.',
        difficulty: DIFFICULTY_LEVELS.EASY,
        subject: subject3A._id,
        chapter: chapter3A1._id,
        topic: topic3A1_1._id,
        course: course3._id,
        marks: 2,
        negativeMarks: 0.5,
        createdBy: instructor1._id,
        status: CONTENT_STATUS.PUBLISHED
      },
      {
        questionText: 'What does the Cayley-Hamilton theorem state about any square matrix A?',
        type: QUESTION_TYPES.MCQ,
        options: [
          { text: 'A matrix is always invertible', isCorrect: false },
          { text: 'Every square matrix satisfies its own characteristic polynomial', isCorrect: true },
          { text: 'Determinant of A is always positive', isCorrect: false },
          { text: 'Eigenvalues are always real numbers', isCorrect: false }
        ],
        explanation: 'Cayley-Hamilton theorem states that if p(lambda) is the characteristic polynomial of A, then p(A) = 0.',
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        subject: subject3A._id,
        chapter: chapter3A1._id,
        topic: topic3A1_1._id,
        course: course3._id,
        marks: 3,
        negativeMarks: 1,
        createdBy: instructor1._id,
        status: CONTENT_STATUS.PUBLISHED
      },
      {
        questionText: 'The sum of all eigenvalues of a matrix A equals which matrix property?',
        type: QUESTION_TYPES.MCQ,
        options: [
          { text: 'Determinant of A', isCorrect: false },
          { text: 'Trace of A (sum of main diagonal elements)', isCorrect: true },
          { text: 'Rank of A', isCorrect: false },
          { text: 'Norm of A', isCorrect: false }
        ],
        explanation: 'Sum of eigenvalues = Trace(A), and Product of eigenvalues = Det(A).',
        difficulty: DIFFICULTY_LEVELS.EASY,
        subject: subject3A._id,
        chapter: chapter3A1._id,
        topic: topic3A1_1._id,
        course: course3._id,
        marks: 2,
        negativeMarks: 0.5,
        createdBy: instructor1._id,
        status: CONTENT_STATUS.PUBLISHED
      },
      {
        questionText: 'The product of all eigenvalues of a square matrix A is equal to:',
        type: QUESTION_TYPES.MCQ,
        options: [
          { text: 'Trace of A', isCorrect: false },
          { text: 'Determinant of A (det(A))', isCorrect: true },
          { text: 'Zero always', isCorrect: false },
          { text: 'Infinity', isCorrect: false }
        ],
        explanation: 'The determinant of a matrix equals the product of its eigenvalues.',
        difficulty: DIFFICULTY_LEVELS.EASY,
        subject: subject3A._id,
        chapter: chapter3A1._id,
        topic: topic3A1_1._id,
        course: course3._id,
        marks: 2,
        negativeMarks: 0.5,
        createdBy: instructor1._id,
        status: CONTENT_STATUS.PUBLISHED
      },
      {
        questionText: 'If a 3x3 matrix has eigenvalues 1, 2, and 3, what is det(A)?',
        type: QUESTION_TYPES.MCQ,
        options: [
          { text: '6', isCorrect: true },
          { text: '5', isCorrect: false },
          { text: '0', isCorrect: false },
          { text: '1', isCorrect: false }
        ],
        explanation: 'det(A) = 1 * 2 * 3 = 6.',
        difficulty: DIFFICULTY_LEVELS.EASY,
        subject: subject3A._id,
        chapter: chapter3A1._id,
        topic: topic3A1_1._id,
        course: course3._id,
        marks: 2,
        negativeMarks: 0.5,
        createdBy: instructor1._id,
        status: CONTENT_STATUS.PUBLISHED
      }
    ];

    const questions = await Question.create(questionsData);
    console.log(` Created ${questions.length} Questions with verified correct options.`);

    // 5. Create 2 Quizzes
    console.log('\n Creating Quizzes...');
    const quiz1Questions = questions.slice(0, 5).map((q) => q._id);
    const quiz1 = await Quiz.create({
      title: 'React Core Concepts & Hooks Mastery Quiz',
      description: 'Test your understanding of component lifecycles, hooks, virtual DOM, and re-rendering.',
      course: course1._id,
      subject: subject1A._id,
      chapter: chapter1A1._id,
      topic: topic1A1_1._id,
      questions: quiz1Questions,
      duration: 15,
      totalMarks: 12,
      passingMarks: 6,
      quizType: QUIZ_TYPES.PRACTICE,
      status: CONTENT_STATUS.PUBLISHED,
      createdBy: instructor2._id
    });

    const quiz2Questions = questions.slice(5, 10).map((q) => q._id);
    const quiz2 = await Quiz.create({
      title: 'Node.js, Express & MongoDB Backend Practice Quiz',
      description: 'Evaluate your knowledge on REST standards, Mongoose indexing, JWT and Express middleware.',
      course: course1._id,
      subject: subject1B._id,
      chapter: chapter1B1._id,
      topic: topic1B1_1._id,
      questions: quiz2Questions,
      duration: 20,
      totalMarks: 13,
      passingMarks: 7,
      quizType: QUIZ_TYPES.TIMED,
      status: CONTENT_STATUS.PUBLISHED,
      createdBy: instructor2._id
    });

    console.log(' Created 2 Quizzes.');

    // 6. Create 1 CBT Examination Test with Sections
    console.log('\n Creating CBT Examination Test...');
    const sectionAQuestions = questions.slice(0, 5).map((q) => q._id);
    const sectionBQuestions = questions.slice(5, 10).map((q) => q._id);
    const sectionCQuestions = questions.slice(10, 15).map((q) => q._id);

    const test1 = await Test.create({
      title: 'Full-Stack Engineering & DSA Comprehensive Mock Test',
      description:
        'All-India level computer-based mock examination covering React frontend, Node.js backend, and Data Structures.',
      type: TEST_TYPES.FULL_MOCK,
      course: course1._id,
      subject: subject1A._id,
      duration: 60,
      totalQuestions: 15,
      totalMarks: 40,
      negativeMarkingRule: {
        enabled: true,
        percentage: 25,
        fixed: 0
      },
      instructions:
        '1. Total duration: 60 minutes.\n2. Each question has 4 options with 1 correct answer.\n3. Negative marking of 25% applies on wrong attempts.\n4. You can navigate between sections freely.',
      status: CONTENT_STATUS.PUBLISHED,
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // in 2 days
      createdBy: instructor1._id,
      sections: [
        {
          name: 'Section A: Frontend Architecture (React)',
          description: 'React lifecycle, Hooks, and Virtual DOM',
          questions: sectionAQuestions,
          duration: 20,
          totalMarks: 12
        },
        {
          name: 'Section B: Backend Architecture (Node & Mongo)',
          description: 'REST APIs, Mongoose, JWT and Middlewares',
          questions: sectionBQuestions,
          duration: 20,
          totalMarks: 13
        },
        {
          name: 'Section C: Data Structures & Algorithms',
          description: 'Binary Trees, BST, and Traversals',
          questions: sectionCQuestions,
          duration: 20,
          totalMarks: 15
        }
      ]
    });

    console.log(' Created 1 CBT Test with 3 Sections and 15 Questions.');

    // 7. Create 3 Sample Discussions & Replies
    console.log('\n Creating Discussions & Replies...');
    const discussion1 = await Discussion.create({
      title: 'When should I use useMemo vs useCallback in React performance tuning?',
      body:
        'I am often confused between useMemo and useCallback. When is it genuinely beneficial for performance, and when does it add unnecessary overhead?',
      author: students[0]._id,
      course: course1._id,
      subject: subject1A._id,
      chapter: chapter1A1._id,
      topic: topic1A1_2._id,
      tags: ['React', 'Performance', 'Hooks'],
      upvotes: [students[1]._id, students[2]._id, instructor2._id],
      replyCount: 2,
      isAnswered: true,
      views: 45
    });

    const reply1A = await Reply.create({
      body:
        'useMemo caches the **result of a calculation** (a value), whereas useCallback caches a **function definition** between renders. Use useCallback when passing callbacks to optimized child components that rely on reference equality to prevent re-renders (like React.memo).',
      author: instructor2._id,
      discussion: discussion1._id,
      isInstructorReply: true,
      isMarkedHelpful: true,
      upvotes: [students[0]._id, students[1]._id]
    });

    await Reply.create({
      body: 'Thank you Professor Ananya! That makes the distinction crystal clear.',
      author: students[0]._id,
      discussion: discussion1._id,
      parentReply: reply1A._id,
      isInstructorReply: false
    });

    const discussion2 = await Discussion.create({
      title: 'Why is Mongoose compound index ordering crucial for multi-key queries?',
      body:
        'In compound indexes like `{ course: 1, status: 1 }`, does the order of fields in query match matters for index utilization?',
      author: students[1]._id,
      course: course1._id,
      subject: subject1B._id,
      tags: ['MongoDB', 'Indexing', 'Performance'],
      upvotes: [students[0]._id, students[3]._id],
      replyCount: 1,
      isAnswered: false,
      views: 32
    });

    await Reply.create({
      body:
        'Yes! MongoDB uses the prefix rule (Equality, Sort, Range). An index on (A, B) can support queries on (A) and (A, B), but cannot efficiently support queries solely on (B).',
      author: instructor1._id,
      discussion: discussion2._id,
      isInstructorReply: true,
      isMarkedHelpful: false
    });

    await Discussion.create({
      title: 'Tips for mastering AVL Tree self-balancing rotations in exams?',
      body: 'What is the fastest mental checklist to distinguish between LL, RR, LR, and RL rotations during timed tests?',
      author: students[2]._id,
      course: course2._id,
      subject: subject2A._id,
      tags: ['Trees', 'AVL', 'Algorithms'],
      upvotes: [students[4]._id],
      replyCount: 0,
      isAnswered: false,
      views: 18
    });

    console.log(' Created 3 Discussions with Instructor replies and helpful answers.');

    // 8. Create 2 Polls
    console.log('\n Creating Polls...');
    await Poll.create({
      question: 'Which frontend state management solution do you use most in 2026?',
      options: [
        { text: 'React Context API + Hooks', votes: [students[0]._id, students[1]._id] },
        { text: 'Zustand', votes: [students[2]._id, students[3]._id] },
        { text: 'Redux Toolkit (RTK)', votes: [students[4]._id] },
        { text: 'TanStack Query (React Query)', votes: [] }
      ],
      course: course1._id,
      createdBy: instructor2._id,
      totalVotes: 5,
      isActive: true
    });

    await Poll.create({
      question: 'What is your primary study goal this semester?',
      options: [
        { text: 'Software Engineering Campus Placements', votes: [students[0]._id, students[2]._id, students[4]._id] },
        { text: 'GATE / Higher Studies Competitive Exam', votes: [students[1]._id] },
        { text: 'Building Full-Stack Side Projects', votes: [students[3]._id] }
      ],
      createdBy: instructor1._id,
      totalVotes: 5,
      isActive: true
    });

    console.log(' Created 2 Interactive Polls with votes.');

    // 9. Create 2 Announcements
    console.log('\n Creating Announcements...');
    await Announcement.create({
      title: '🚀 Grand Launch of Full-Stack MERN Mock Examination 2026',
      body:
        'The National Full-Stack Mock Test is now scheduled. Review your React and Node modules before taking the timed exam.',
      targetAudience: ANNOUNCEMENT_AUDIENCE.ALL,
      priority: ANNOUNCEMENT_PRIORITY.HIGH,
      createdBy: superAdmin._id,
      isActive: true
    });

    await Announcement.create({
      title: 'Weekly Live Doubts & Coding Clinic with Dr. Sharma',
      body:
        'Join the live interactive doubt resolution session this Saturday at 6:00 PM IST on Data Structures and Binary Tree Traversals.',
      targetAudience: ANNOUNCEMENT_AUDIENCE.COURSE,
      course: course2._id,
      priority: ANNOUNCEMENT_PRIORITY.NORMAL,
      createdBy: instructor1._id,
      isActive: true
    });

    console.log(' Created 2 Announcements.');

    // 10. Enroll Students in Courses & Create Sample Progress
    console.log('\n Enrolling Students & Generating Attempt Data...');
    for (let i = 0; i < students.length; i++) {
      const student = students[i];

      // Enroll in Course 1
      await Enrollment.create({
        user: student._id,
        course: course1._id,
        completedTopics: [topic1A1_1._id],
        overallProgress: 35 + i * 12,
        status: 'active',
        lastAccessedAt: new Date(Date.now() - i * 3600000)
      });

      // Enroll some in Course 2
      if (i < 4) {
        await Enrollment.create({
          user: student._id,
          course: course2._id,
          completedTopics: [topic2A1_1._id],
          overallProgress: 20 + i * 15,
          status: 'active',
          lastAccessedAt: new Date(Date.now() - (i + 1) * 7200000)
        });
      }

      // Log Student Activities
      await StudentActivity.create({
        user: student._id,
        activityType: 'course_view',
        contentType: 'Course',
        contentId: course1._id,
        duration: 900 + i * 120,
        timestamp: new Date(Date.now() - i * 1800000)
      });

      // Create Sample Quiz Attempt for each student
      const qScore = 8 + (i % 5);
      await QuizAttempt.create({
        user: student._id,
        quiz: quiz1._id,
        score: qScore,
        totalMarks: 12,
        accuracy: Math.round((qScore / 12) * 100),
        timeTaken: 480 + i * 45,
        status: 'completed',
        completedAt: new Date(Date.now() - (i + 1) * 86400000),
        answers: quiz1Questions.map((qId, idx) => ({
          question: qId,
          selectedOption: [1],
          isCorrect: idx < 4,
          marksObtained: idx < 4 ? 2 : 0,
          timeTaken: 90
        }))
      });

      // Create Sample Test Attempt for students
      const tScore = 24 + i * 3;
      await TestAttempt.create({
        user: student._id,
        test: test1._id,
        score: tScore,
        totalMarks: 40,
        accuracy: Math.round((tScore / 40) * 100),
        correctCount: 10 + i,
        incorrectCount: 3,
        skippedCount: 2 - (i % 2),
        timeTaken: 2400 + i * 150,
        rank: students.length - i,
        percentile: Math.round(((i + 0.5) / students.length) * 100 * 10) / 10,
        status: ATTEMPT_STATUS.SUBMITTED,
        completedAt: new Date(Date.now() - (i + 1) * 43200000),
        sectionWiseResults: [
          {
            sectionName: 'Section A: Frontend Architecture (React)',
            score: 10,
            totalMarks: 12,
            correctCount: 4,
            incorrectCount: 1,
            skippedCount: 0,
            accuracy: 80,
            timeTaken: 800
          },
          {
            sectionName: 'Section B: Backend Architecture (Node & Mongo)',
            score: 8,
            totalMarks: 13,
            correctCount: 3,
            incorrectCount: 1,
            skippedCount: 1,
            accuracy: 75,
            timeTaken: 800
          },
          {
            sectionName: 'Section C: Data Structures & Algorithms',
            score: tScore - 18,
            totalMarks: 15,
            correctCount: 3 + (i % 2),
            incorrectCount: 1,
            skippedCount: 1,
            accuracy: 70,
            timeTaken: 800
          }
        ]
      });
    }

    console.log(' Enrolled students and populated realistic Quiz & Test attempts.');

    console.log('\n==============================================');
    console.log('  Database Seeding Completed Successfully!');
    console.log('==============================================');
    console.log('\nDemo User Accounts for Login:');
    console.log('----------------------------------------------------');
    console.log('1. Superadmin: admin@eduplatform.com / password123');
    console.log('2. Instructor: dr.sharma@eduplatform.com / password123');
    console.log('3. Instructor: prof.gupta@eduplatform.com / password123');
    console.log('4. Student:    rahul.verma@eduplatform.com / password123');
    console.log('5. Student:    priya.singh@eduplatform.com / password123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeder execution error:', error);
    process.exit(1);
  }
};

// Execute Seeder
seedDatabase();
