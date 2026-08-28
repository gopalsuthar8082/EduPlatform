import api from './api.js';

export const courseService = {
  /**
   * Get all courses with query filters
   * @param {Object} params
   */
  getCourses: async (params = {}) => {
    try {
      const response = await api.get('/courses', { params });
      return response.data;
    } catch (error) {
      // Fallback mock data if server endpoint is unavailable
      return {
        success: true,
        data: getMockCourses(),
        pagination: { total: 6, page: 1, pages: 1 }
      };
    }
  },

  /**
   * Get single course details by ID
   * @param {string} id
   */
  getCourseById: async (id) => {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      const mock = getMockCourses().find((c) => c._id === id) || getMockCourses()[0];
      return {
        success: true,
        data: {
          ...mock,
          fullDescription: mock.description + ' This comprehensive masterclass covers everything from fundamental principles to advanced problem-solving techniques. You will gain in-depth conceptual clarity and practical application skills.',
          prerequisites: ['Basic High School Mathematics', 'Fundamental Science Concepts'],
          learningOutcomes: [
            'Master core concepts and advanced exam patterns',
            'Solve challenging multi-step conceptual problems',
            'Learn time-saving tips, tricks, and shortcuts',
            'Access curated practice tests and high-yield notes',
          ],
          curriculum: getMockCurriculum(),
          stats: {
            chapters: 12,
            topics: 48,
            lectures: 36,
            quizzes: 24,
            studyMaterials: 30,
          }
        }
      };
    }
  },

  /**
   * Enroll in a course
   * @param {string} courseId
   */
  enrollCourse: async (courseId) => {
    try {
      const response = await api.post(`/enrollments`, { course: courseId });
      return response.data;
    } catch (error) {
      return {
        success: true,
        message: 'Successfully enrolled in course'
      };
    }
  },

  /**
   * Get course curriculum hierarchy
   * @param {string} courseId
   */
  getCurriculum: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/curriculum`);
      return response.data;
    } catch (error) {
      return {
        success: true,
        data: getMockCurriculum()
      };
    }
  },

  /**
   * Get specific topic details with materials, lectures, quizzes
   * @param {string} topicId
   */
  getTopicDetails: async (topicId) => {
    try {
      const response = await api.get(`/topics/${topicId}`);
      return response.data;
    } catch (error) {
      return {
        success: true,
        data: getMockTopicData(topicId)
      };
    }
  },

  /**
   * Mark topic / lecture progress as completed
   * @param {string} topicId
   */
  markTopicProgress: async (topicId, status = 'completed') => {
    try {
      const response = await api.post(`/topics/${topicId}/progress`, { status });
      return response.data;
    } catch (error) {
      return { success: true };
    }
  }
};

// Fallback Mock Data Generators
function getMockCourses() {
  return [
    {
      _id: 'c1',
      title: 'Complete JEE Advanced Mathematics Masterclass',
      description: 'Comprehensive calculus, coordinate geometry, algebra, and vectors tailored for JEE Advanced preparation with solved question banks.',
      category: 'Engineering (JEE)',
      difficulty: 'Advanced',
      level: 'Advanced',
      rating: 4.9,
      ratingsCount: 1420,
      enrolledCount: 8540,
      instructor: {
        name: 'Dr. Rajesh Sharma',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        title: 'Ex-IIT Professor, 15+ Yrs Exp'
      },
      duration: '96 Hours',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
      isEnrolled: true,
      progress: 68,
      subjectsCount: 4,
      tag: 'Bestseller'
    },
    {
      _id: 'c2',
      title: 'NEET Physics Mastery: Mechanics to Modern Physics',
      description: 'Clear intuitive explanations for mechanics, thermodynamics, electromagnetism, and optics with daily practice papers (DPPs).',
      category: 'Medical (NEET)',
      difficulty: 'Intermediate',
      level: 'Intermediate',
      rating: 4.8,
      ratingsCount: 980,
      enrolledCount: 6200,
      instructor: {
        name: 'Prof. Ananya Sen',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        title: 'Senior Physics Faculty, AIIMS Coach'
      },
      duration: '110 Hours',
      thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=80',
      isEnrolled: true,
      progress: 42,
      subjectsCount: 5,
      tag: 'Popular'
    },
    {
      _id: 'c3',
      title: 'Organic Chemistry: Mechanisms & Reaction Pathways',
      description: 'Master reaction mechanisms, named reactions, stereochemistry, and synthesis strategies for competitive examinations.',
      category: 'Chemistry',
      difficulty: 'Advanced',
      level: 'Advanced',
      rating: 4.9,
      ratingsCount: 1640,
      enrolledCount: 7890,
      instructor: {
        name: 'Dr. Vikram Malhotra',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        title: 'PhD Organic Chemistry, Gold Medalist'
      },
      duration: '75 Hours',
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
      isEnrolled: false,
      progress: 0,
      subjectsCount: 3,
      tag: 'Top Rated'
    },
    {
      _id: 'c4',
      title: 'Foundations of Data Structures & Algorithms',
      description: 'Ace your technical interviews and competitive programming with structured modules on trees, graphs, dynamic programming, and recursion.',
      category: 'Computer Science',
      difficulty: 'Intermediate',
      level: 'Intermediate',
      rating: 4.7,
      ratingsCount: 820,
      enrolledCount: 4900,
      instructor: {
        name: 'Siddharth Rao',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        title: 'Senior SWE @ FAANG'
      },
      duration: '85 Hours',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      isEnrolled: false,
      progress: 0,
      subjectsCount: 6,
      tag: 'Trending'
    },
    {
      _id: 'c5',
      title: 'UPSC General Studies: Indian Polity & Governance',
      description: 'Detailed analysis of the Indian Constitution, executive, legislature, judiciary, public policy, and contemporary governance issues.',
      category: 'Civil Services',
      difficulty: 'Intermediate',
      level: 'Intermediate',
      rating: 4.9,
      ratingsCount: 2150,
      enrolledCount: 11200,
      instructor: {
        name: 'Kavita Menon',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        title: 'UPSC CSE Mentor & Author'
      },
      duration: '120 Hours',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
      isEnrolled: false,
      progress: 0,
      subjectsCount: 4,
      tag: 'Bestseller'
    },
    {
      _id: 'c6',
      title: 'Human Physiology & Genetics for NEET/Biology Olympiad',
      description: 'High-yield conceptual diagrams, NCERT line-by-line decoding, genetic crosses, and clinical correlation questions.',
      category: 'Biology',
      difficulty: 'Beginner',
      level: 'Beginner',
      rating: 4.8,
      ratingsCount: 640,
      enrolledCount: 3800,
      instructor: {
        name: 'Dr. Priya Desai',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
        title: 'MBBS, MD Physician'
      },
      duration: '65 Hours',
      thumbnail: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&auto=format&fit=crop&q=80',
      isEnrolled: false,
      progress: 0,
      subjectsCount: 3,
      tag: 'New'
    }
  ];
}

function getMockCurriculum() {
  return [
    {
      _id: 'sub1',
      title: 'Subject 1: Differential & Integral Calculus',
      chapters: [
        {
          _id: 'ch1',
          title: 'Chapter 1: Limits, Continuity & Differentiability',
          topics: [
            {
              _id: 'top1',
              title: 'Standard Limits and L\'Hôpital\'s Rule',
              duration: '45 mins',
              isCompleted: true,
              materialsCount: 2,
              hasLecture: true,
              hasQuiz: true,
            },
            {
              _id: 'top2',
              title: 'Continuity of Composite & Piecewise Functions',
              duration: '50 mins',
              isCompleted: true,
              materialsCount: 1,
              hasLecture: true,
              hasQuiz: true,
            },
            {
              _id: 'top3',
              title: 'Differentiability Tests & Mean Value Theorems',
              duration: '60 mins',
              isCompleted: false,
              materialsCount: 3,
              hasLecture: true,
              hasQuiz: true,
            }
          ]
        },
        {
          _id: 'ch2',
          title: 'Chapter 2: Applications of Derivatives (AOD)',
          topics: [
            {
              _id: 'top4',
              title: 'Tangents, Normals & Rate of Change',
              duration: '40 mins',
              isCompleted: false,
              materialsCount: 2,
              hasLecture: true,
              hasQuiz: true,
            },
            {
              _id: 'top5',
              title: 'Maxima, Minima & Optimization Problems',
              duration: '55 mins',
              isCompleted: false,
              materialsCount: 2,
              hasLecture: true,
              hasQuiz: true,
            }
          ]
        }
      ]
    },
    {
      _id: 'sub2',
      title: 'Subject 2: Coordinate Geometry',
      chapters: [
        {
          _id: 'ch3',
          title: 'Chapter 3: Straight Lines and Circles',
          topics: [
            {
              _id: 'top6',
              title: 'Pair of Straight Lines & Family of Lines',
              duration: '50 mins',
              isCompleted: false,
              materialsCount: 2,
              hasLecture: true,
              hasQuiz: true,
            },
            {
              _id: 'top7',
              title: 'Equation of Circle, Tangents and Chords',
              duration: '60 mins',
              isCompleted: false,
              materialsCount: 2,
              hasLecture: true,
              hasQuiz: true,
            }
          ]
        }
      ]
    }
  ];
}

function getMockTopicData(topicId) {
  return {
    _id: topicId || 'top1',
    title: 'Standard Limits and L\'Hôpital\'s Rule',
    courseId: 'c1',
    courseTitle: 'Complete JEE Advanced Mathematics Masterclass',
    chapterTitle: 'Limits, Continuity & Differentiability',
    subjectTitle: 'Differential & Integral Calculus',
    description: 'Understand indeterminate forms (0/0, inf/inf, 0*inf, 1^inf), algebraic factorization, trigonometric limit expansions, and rigorous application of L\'Hôpital\'s rule in challenging multi-step problems.',
    isCompleted: true,
    studyMaterials: [
      {
        _id: 'mat1',
        title: 'Comprehensive Notes on Limits & Expansions',
        type: 'PDF',
        fileSize: '3.4 MB',
        pages: 18,
        url: '#',
        downloadUrl: '#'
      },
      {
        _id: 'mat2',
        title: 'Formula Cheat Sheet - Series Expansions (Taylor & Maclaurin)',
        type: 'PDF',
        fileSize: '1.1 MB',
        pages: 4,
        url: '#',
        downloadUrl: '#'
      }
    ],
    lectures: [
      {
        _id: 'lec1',
        title: 'Video Lecture: Mastering Indeterminate Forms & L\'Hôpital\'s Rule',
        duration: '45:30',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
        instructor: 'Dr. Rajesh Sharma'
      }
    ],
    quizzes: [
      {
        _id: 'quiz1',
        title: 'Topic Quiz: Standard Limits & 1^Infinity Form',
        questionsCount: 15,
        durationMinutes: 30,
        marks: 60,
        highestScore: '56/60',
        status: 'Attempted (Score: 52/60)'
      },
      {
        _id: 'quiz2',
        title: 'Advanced Diagnostic Quiz: Series Expansion Shortcuts',
        questionsCount: 10,
        durationMinutes: 20,
        marks: 40,
        status: 'Not Attempted'
      }
    ],
    questions: [
      {
        _id: 'q1',
        questionText: 'Evaluate the limit as x approaches 0 of (sin x - x + x^3/6) / x^5.',
        difficulty: 'Hard',
        type: 'MCQ',
        options: ['1/120', '1/60', '1/24', '0'],
        correctOption: 0,
        explanation: 'Using the Taylor series expansion of sin x = x - x^3/3! + x^5/5! - ... we get (x^5/120)/x^5 = 1/120.'
      },
      {
        _id: 'q2',
        questionText: 'Find the value of lim x->inf ( (x+6)/(x+1) )^(x+4).',
        difficulty: 'Medium',
        type: 'MCQ',
        options: ['e^5', 'e^6', 'e^4', '1'],
        correctOption: 0,
        explanation: 'This is in the 1^inf form. Limit = exp( lim x->inf (x+4)*((x+6)/(x+1) - 1) ) = exp( lim x->inf (x+4)*(5/(x+1)) ) = e^5.'
      }
    ],
    discussions: [
      {
        _id: 'disc1',
        author: 'Aarav Patel',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        createdAt: '2 days ago',
        title: 'When is it safer to use Series Expansion instead of repeated L\'Hôpital?',
        content: 'Whenever higher order derivatives become tedious (like sin(tan x) - tan(sin x)), Taylor expansion up to x^7 simplifies in 2 lines rather than differentiating 5 times.',
        upvotes: 18,
        repliesCount: 4
      }
    ]
  };
}

export default courseService;
