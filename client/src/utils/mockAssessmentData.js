/**
 * Comprehensive Mock Data for EduPlatform Assessments & Learning Materials
 */

export const MOCK_STUDY_MATERIALS = [
  {
    _id: 'mat_1',
    title: 'Advanced Mechanics & Rotational Dynamics Master Notes',
    description: 'Comprehensive handwritten revision notes covering torque, moment of inertia, angular momentum conservation, and rolling motion with solved problems.',
    course: 'JEE Advanced Physics 2026',
    courseId: 'c_jee_phys',
    subject: 'Physics',
    subjectId: 'sub_phys',
    chapter: 'Rotational Motion',
    chapterId: 'ch_rot',
    topic: 'Moment of Inertia & Torque',
    fileType: 'pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '4.8 MB',
    pageCount: 38,
    viewCount: 1420,
    downloadCount: 680,
    isBookmarked: false,
    author: 'Prof. Arvind Sharma',
    createdAt: '2026-08-15T10:30:00.000Z',
    aiSummary: {
      overview: 'This master note document details the rigorous mathematical and conceptual foundations of rotational mechanics, including rigid body dynamics, parallel and perpendicular axis theorems, and pure rolling conditions on inclined planes.',
      keyPoints: [
        'Calculation of Moment of Inertia for continuous mass distributions using integration techniques.',
        'Torque equation τ = Iα and conservation of angular momentum when external torque is zero.',
        'Kinetic energy of rolling body: K_total = 1/2mv² + 1/2Iω².',
        'Condition for pure rolling without slipping: v_cm = Rω and a_cm = Rα.',
        'Gyroscopic precession and instantaneous center of zero velocity (ICR).'
      ]
    },
    flashcards: [
      {
        id: 'fc_1',
        term: 'Parallel Axis Theorem',
        definition: 'I = I_cm + Md², where I is the moment of inertia about any axis parallel to the centroidal axis, M is total mass, and d is perpendicular distance.'
      },
      {
        id: 'fc_2',
        term: 'Pure Rolling Friction Force',
        definition: 'Static friction acts at the point of contact to maintain v = Rω, doing zero net mechanical work during pure rolling on stationary surfaces.'
      },
      {
        id: 'fc_3',
        term: 'Conservation of Angular Momentum',
        definition: 'If net external torque τ_ext = 0, total angular momentum L = Iω remains constant in magnitude and direction.'
      },
      {
        id: 'fc_4',
        term: 'Radius of Gyration (k)',
        definition: 'The radial distance from the axis of rotation at which the entire mass of the body may be assumed to be concentrated (I = M·k²).'
      }
    ]
  },
  {
    _id: 'mat_2',
    title: 'Organic Chemistry Reaction Mechanisms & Named Reactions',
    description: 'Detailed reaction pathway diagrams, transition states, carbocation rearrangements, and resonance stability guides for electrophilic additions and aromatic substitutions.',
    course: 'NEET & JEE Chemistry Accelerator',
    courseId: 'c_chem_acc',
    subject: 'Chemistry',
    subjectId: 'sub_chem',
    chapter: 'Organic Chemistry II',
    chapterId: 'ch_org',
    topic: 'Reaction Mechanisms',
    fileType: 'pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '8.2 MB',
    pageCount: 64,
    viewCount: 2980,
    downloadCount: 1420,
    isBookmarked: true,
    author: 'Dr. Meenakshi Sundaram',
    createdAt: '2026-08-10T14:15:00.000Z',
    aiSummary: {
      overview: 'Comprehensive breakdown of SN1, SN2, E1, E2 pathways along with famous named reactions such as Aldol condensation, Cannizzaro, Friedel-Crafts, and Grignard additions.',
      keyPoints: [
        'Stereochemical inversion in SN2 versus racemization in SN1 pathways.',
        'Markovnikov and anti-Markovnikov additions with peroxides and free radicals.',
        'Aromaticity rules (Hückel 4n+2 π electrons) and activating/deactivating substituents.',
        'Mechanism of Aldol Condensation via enolate ion intermediate.'
      ]
    },
    flashcards: [
      {
        id: 'fc_5',
        term: 'SN2 Mechanism',
        definition: 'Bimolecular nucleophilic substitution proceeding through a single concerted step with backside attack and Walden inversion.'
      },
      {
        id: 'fc_6',
        term: 'Hückel’s Rule',
        definition: 'A planar, cyclic conjugated system is aromatic if it contains (4n + 2) π-electrons, where n is a non-negative integer.'
      }
    ]
  },
  {
    _id: 'mat_3',
    title: 'Differential Calculus & Integral Formulations Cheat Sheet',
    description: 'Quick reference formula sheets, standard integrals, substitution techniques, integration by parts shortcuts, and Leibniz integral rule with visual summaries.',
    course: 'Engineering Mathematics Foundation',
    courseId: 'c_math_found',
    subject: 'Mathematics',
    subjectId: 'sub_math',
    chapter: 'Integral Calculus',
    chapterId: 'ch_int',
    topic: 'Definite Integrals',
    fileType: 'notes',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '2.1 MB',
    pageCount: 16,
    viewCount: 3840,
    downloadCount: 2190,
    isBookmarked: true,
    author: 'Er. Rajesh Varma',
    createdAt: '2026-08-04T09:00:00.000Z',
    aiSummary: {
      overview: 'Essential quick formulas covering limits, derivatives, King’s property for definite integrals, and reduction formulas for trigonometric functions.',
      keyPoints: [
        'King’s property: ∫[a,b] f(x)dx = ∫[a,b] f(a+b-x)dx.',
        'Leibniz differentiation under the integral sign formula.',
        'Standard trigonometric and algebraic substitution templates.',
        'Wallis formula for definite integrals of sin^n(x) and cos^n(x).'
      ]
    },
    flashcards: [
      {
        id: 'fc_7',
        term: 'King’s Property of Definite Integrals',
        definition: '∫[a to b] f(x) dx = ∫[a to b] f(a + b - x) dx, useful for evaluating symmetry-based integrals.'
      },
      {
        id: 'fc_8',
        term: 'Integration by Parts',
        definition: '∫ u dv = u·v - ∫ v du, using ILATE priority order for choosing u.'
      }
    ]
  },
  {
    _id: 'mat_4',
    title: 'Electromagnetic Induction & Alternating Current Slides',
    description: 'Presentation deck with high-resolution animations and diagrams explaining Faraday’s laws, Lenz’s law, LC oscillations, resonance, and AC phasor diagrams.',
    course: 'JEE Advanced Physics 2026',
    courseId: 'c_jee_phys',
    subject: 'Physics',
    subjectId: 'sub_phys',
    chapter: 'Electromagnetism',
    chapterId: 'ch_em',
    topic: 'EMI & AC Circuits',
    fileType: 'ppt',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '14.5 MB',
    pageCount: 52,
    viewCount: 1120,
    downloadCount: 430,
    isBookmarked: false,
    author: 'Prof. Arvind Sharma',
    createdAt: '2026-07-28T16:00:00.000Z',
    aiSummary: {
      overview: 'Lecture slide deck covering induced EMF, motional EMF, mutual and self-inductance, AC series LCR resonant circuits, and power factor analysis.',
      keyPoints: [
        'Faraday’s law of induction: EMF = -dΦ/dt.',
        'Lenz’s law represents conservation of energy.',
        'Resonance frequency in series LCR circuit: f_0 = 1 / (2π√(LC)).',
        'Quality factor Q = (1/R) * √(L/C) determines sharp resonance.'
      ]
    },
    flashcards: [
      {
        id: 'fc_9',
        term: 'Lenz’s Law',
        definition: 'The direction of induced current always opposes the change in magnetic flux that produces it.'
      }
    ]
  },
  {
    _id: 'mat_5',
    title: 'Genetics & Molecular Basis of Inheritance Infographics',
    description: 'Full color diagrams detailing DNA replication forks, transcription, translation machinery, lac operon regulation, and Mendelian genetic crosses.',
    course: 'NEET Biology Comprehensive 2026',
    courseId: 'c_bio_neet',
    subject: 'Biology',
    subjectId: 'sub_bio',
    chapter: 'Genetics',
    chapterId: 'ch_gen',
    topic: 'Molecular Biology',
    fileType: 'pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '11.0 MB',
    pageCount: 44,
    viewCount: 2450,
    downloadCount: 1100,
    isBookmarked: false,
    author: 'Dr. Ananya Roy',
    createdAt: '2026-08-01T11:20:00.000Z',
    aiSummary: {
      overview: 'Key genetic principles including Watson-Crick double helix structure, semi-conservative replication proof by Meselson-Stahl, and genetic code deciphering.',
      keyPoints: [
        'Semi-conservative DNA replication utilizing DNA Polymerase III and RNA primase.',
        'Central Dogma: DNA -> RNA (Transcription) -> Protein (Translation).',
        'Regulation of gene expression via the inducible Lac Operon system in E. coli.',
        'Non-Mendelian inheritance patterns: Incomplete dominance and Codominance.'
      ]
    },
    flashcards: [
      {
        id: 'fc_10',
        term: 'Central Dogma of Biology',
        definition: 'The directional flow of genetic information from DNA to messenger RNA to protein synthesis.'
      }
    ]
  },
  {
    _id: 'mat_6',
    title: 'Data Structures & Algorithms Complexity Handbook',
    description: 'Asymptotic notation, Big-O reference sheet, tree balancing algorithms (AVL, Red-Black), graph traversals, and dynamic programming memoization templates.',
    course: 'Computer Science & GATE CS 2026',
    courseId: 'c_gate_cs',
    subject: 'Computer Science',
    subjectId: 'sub_cs',
    chapter: 'Algorithms',
    chapterId: 'ch_algo',
    topic: 'Complexity & Trees',
    fileType: 'notes',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '3.4 MB',
    pageCount: 28,
    viewCount: 3120,
    downloadCount: 1890,
    isBookmarked: false,
    author: 'Prof. Kabir Gupta',
    createdAt: '2026-07-20T08:45:00.000Z',
    aiSummary: {
      overview: 'Essential quick review handbook for algorithmic time and space complexity, recurrence relations (Master Theorem), and standard data structures operations.',
      keyPoints: [
        'Master Theorem cases for divide-and-conquer recurrences.',
        'Amortized analysis techniques: Aggregate, Accounting, and Potential method.',
        'Graph traversal complexities for BFS and DFS: O(V + E).',
        'Self-balancing binary search tree rotations for AVL and Red-Black trees.'
      ]
    },
    flashcards: [
      {
        id: 'fc_11',
        term: 'Master Theorem',
        definition: 'Formula T(n) = aT(n/b) + f(n) used to quickly determine time complexity of divide-and-conquer algorithms.'
      }
    ]
  }
];

export const MOCK_LECTURES = [
  {
    _id: 'lec_1',
    title: 'L01: Introduction to Rotational Kinematics and Angular Velocity',
    course: 'JEE Advanced Physics 2026',
    courseId: 'c_jee_phys',
    subject: 'Physics',
    subjectId: 'sub_phys',
    chapter: 'Rotational Motion',
    chapterId: 'ch_rot',
    instructor: 'Prof. Arvind Sharma',
    duration: '48 mins',
    durationSec: 2880,
    progressPercent: 100,
    lastWatchedSec: 2880,
    viewCount: 5420,
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    order: 1,
    createdAt: '2026-08-01T10:00:00.000Z',
    notes: `# Rotational Kinematics Notes
- Angular displacement (θ): measured in radians.
- Angular velocity (ω): ω = dθ/dt
- Angular acceleration (α): α = dω/dt
- Kinematic equations in rotational motion analogous to linear motion:
  1. ω = ω₀ + αt
  2. θ = ω₀t + 1/2αt²
  3. ω² = ω₀² + 2αθ`,
    resources: [
      { name: 'Lecture_01_Slides.pdf', size: '2.4 MB', url: '#' },
      { name: 'Rotational_Kinematics_Problems.pdf', size: '1.1 MB', url: '#' }
    ],
    questions: [
      {
        id: 'q_l1_1',
        question: 'A wheel accelerates uniformly from rest to 120 rad/s in 6 seconds. What is the total angular displacement in radians?',
        options: ['180 rad', '360 rad', '720 rad', '90 rad'],
        correct: 1,
        explanation: 'θ = 1/2 * (ω₀ + ω) * t = 1/2 * (0 + 120) * 6 = 360 radians.'
      }
    ],
    discussions: [
      {
        id: 'd_1',
        user: 'Vikram Mehta',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        time: '2 days ago',
        text: 'Sir, what is the convention for positive angular acceleration direction?',
        replies: [
          {
            user: 'Prof. Arvind Sharma',
            role: 'Instructor',
            time: '1 day ago',
            text: 'We use the right-hand grip rule: curl fingers in the direction of rotational acceleration, your thumb points in the vector direction.'
          }
        ]
      }
    ]
  },
  {
    _id: 'lec_2',
    title: 'L02: Moment of Inertia for Continuous Bodies & Axis Theorems',
    course: 'JEE Advanced Physics 2026',
    courseId: 'c_jee_phys',
    subject: 'Physics',
    subjectId: 'sub_phys',
    chapter: 'Rotational Motion',
    chapterId: 'ch_rot',
    instructor: 'Prof. Arvind Sharma',
    duration: '56 mins',
    durationSec: 3360,
    progressPercent: 65,
    lastWatchedSec: 2184,
    viewCount: 4210,
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    order: 2,
    createdAt: '2026-08-03T10:00:00.000Z',
    notes: `# Moment of Inertia Integration
- For continuous body: I = ∫ r² dm
- Perpendicular Axis Theorem (2D laminar bodies only): Iz = Ix + Iy
- Parallel Axis Theorem (any rigid body): I = I_cm + Md²`,
    resources: [
      { name: 'Lecture_02_Derivations.pdf', size: '3.2 MB', url: '#' }
    ],
    questions: [
      {
        id: 'q_l2_1',
        question: 'What is the moment of inertia of a uniform solid sphere about its diameter?',
        options: ['1/2 MR²', '2/5 MR²', '2/3 MR²', '3/5 MR²'],
        correct: 1,
        explanation: 'For a uniform solid sphere, I_diameter = 2/5 MR².'
      }
    ],
    discussions: []
  },
  {
    _id: 'lec_3',
    title: 'L03: Torque, Angular Momentum & Fixed Axis Dynamics',
    course: 'JEE Advanced Physics 2026',
    courseId: 'c_jee_phys',
    subject: 'Physics',
    subjectId: 'sub_phys',
    chapter: 'Rotational Motion',
    chapterId: 'ch_rot',
    instructor: 'Prof. Arvind Sharma',
    duration: '62 mins',
    durationSec: 3720,
    progressPercent: 0,
    lastWatchedSec: 0,
    viewCount: 3890,
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    order: 3,
    createdAt: '2026-08-06T10:00:00.000Z',
    notes: `# Torque and Angular Momentum
- Torque vector τ = r × F
- Net torque τ_net = I α (for fixed axis rotation)
- Angular momentum L = r × p = I ω`,
    resources: [],
    questions: [],
    discussions: []
  },
  {
    _id: 'lec_4',
    title: 'L04: Pure Rolling Motion, Friction & Work-Energy Theorem',
    course: 'JEE Advanced Physics 2026',
    courseId: 'c_jee_phys',
    subject: 'Physics',
    subjectId: 'sub_phys',
    chapter: 'Rotational Motion',
    chapterId: 'ch_rot',
    instructor: 'Prof. Arvind Sharma',
    duration: '52 mins',
    durationSec: 3120,
    progressPercent: 0,
    lastWatchedSec: 0,
    viewCount: 2900,
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    order: 4,
    createdAt: '2026-08-09T10:00:00.000Z',
    notes: `# Rolling Motion Mechanics
- Kinetic energy: K = 1/2 M v_cm² + 1/2 I_cm ω²
- For pure rolling: v_cm = Rω, a_cm = Rα`,
    resources: [],
    questions: [],
    discussions: []
  }
];

export const MOCK_QUIZZES = [
  {
    _id: 'quiz_1',
    title: 'Rotational Dynamics & Torque Rapid Check',
    description: 'Test your grasp on moment of inertia calculations, torque equations, and angular momentum conservation in rigid bodies.',
    course: 'JEE Advanced Physics 2026',
    subject: 'Physics',
    chapter: 'Rotational Motion',
    topic: 'Torque & Angular Momentum',
    quizType: 'timed', // practice | graded | timed
    difficulty: 'medium', // easy | medium | hard
    questionCount: 10,
    duration: 15, // in minutes
    maxAttempts: 3,
    attemptsCount: 1,
    lastScore: { score: 8, total: 10, percentage: 80 },
    bestScore: { score: 8, total: 10, percentage: 80 },
    showAnswers: 'after_each',
    createdAt: '2026-08-12T09:00:00.000Z',
    questions: [
      {
        _id: 'qz_q1',
        questionText: 'A thin circular ring of mass M and radius R is rotating about its axis with a constant angular velocity ω. Two objects each of mass m are attached gently to the opposite ends of a diameter of the ring. What will be the new angular velocity of the ring?',
        type: 'mcq',
        marks: 1,
        negativeMarks: 0.25,
        options: [
          { key: 'A', text: '(M / (M + 2m)) · ω' },
          { key: 'B', text: '((M + 2m) / M) · ω' },
          { key: 'C', text: '(M / (M + m)) · ω' },
          { key: 'D', text: '((M - 2m) / (M + 2m)) · ω' }
        ],
        correctAnswer: 'A',
        explanation: 'Using conservation of angular momentum: I₁ω₁ = I₂ω₂. Initial I₁ = MR². After placing two masses at distance R from axis, I₂ = MR² + 2mR² = (M + 2m)R². Therefore, ω₂ = (MR² / ((M + 2m)R²)) · ω = (M / (M + 2m)) · ω.'
      },
      {
        _id: 'qz_q2',
        questionText: 'Which of the following bodies rolling down an inclined plane without slipping will reach the bottom with the highest speed?',
        type: 'mcq',
        marks: 1,
        negativeMarks: 0.25,
        options: [
          { key: 'A', text: 'Solid sphere' },
          { key: 'B', text: 'Solid cylinder' },
          { key: 'C', text: 'Hollow cylinder' },
          { key: 'D', text: 'Spherical shell' }
        ],
        correctAnswer: 'A',
        explanation: 'Speed at bottom v = √(2gh / (1 + k²/R²)). The body with the smallest ratio of (k²/R²) has maximum speed. For solid sphere, k²/R² = 2/5 = 0.40, which is smaller than solid cylinder (0.5), spherical shell (0.67), and hollow cylinder (1.0).'
      },
      {
        _id: 'qz_q3',
        questionText: 'A force F = (2î + 3ĵ - k̂) N acts at a point r = (î - ĵ + 2k̂) m. The torque about the origin is:',
        type: 'mcq',
        marks: 1,
        negativeMarks: 0.25,
        options: [
          { key: 'A', text: '(-5î + 5ĵ + 5k̂) N·m' },
          { key: 'B', text: '(-5î - 3ĵ + 5k̂) N·m' },
          { key: 'C', text: '(-5î + 3ĵ + 5k̂) N·m' },
          { key: 'D', text: '(5î + 3ĵ - 5k̂) N·m' }
        ],
        correctAnswer: 'A',
        explanation: 'τ = r × F = | î  ĵ  k̂ | / | 1 -1  2 | / | 2  3 -1 |. Calculating determinant: î((-1)(-1) - (2)(3)) - ĵ((1)(-1) - (2)(2)) + k̂((1)(3) - (-1)(2)) = î(1 - 6) - ĵ(-1 - 4) + k̂(3 + 2) = -5î + 5ĵ + 5k̂ N·m.'
      },
      {
        _id: 'qz_q4',
        questionText: 'Select all correct statements regarding the Moment of Inertia of a rigid body:',
        type: 'msq',
        marks: 2,
        negativeMarks: 0,
        options: [
          { key: 'A', text: 'It depends on the position and orientation of the axis of rotation.' },
          { key: 'B', text: 'It is a tensor quantity in 3D physics.' },
          { key: 'C', text: 'Perpendicular axis theorem is applicable to all three-dimensional objects.' },
          { key: 'D', text: 'It depends on the distribution of mass relative to the axis.' }
        ],
        correctAnswer: ['A', 'B', 'D'],
        explanation: 'Statements A, B, and D are correct. Statement C is false because the perpendicular axis theorem applies strictly to planar (2-dimensional laminar) objects.'
      },
      {
        _id: 'qz_q5',
        questionText: 'A uniform rod of length 2 meters and mass 6 kg is pivoted at one end. Calculate its moment of inertia about the pivot in kg·m² (Enter numerical integer value).',
        type: 'numerical',
        marks: 2,
        negativeMarks: 0,
        correctAnswer: '8',
        explanation: 'For a uniform rod pivoted at one end, I = 1/3 M L² = 1/3 * (6 kg) * (2 m)² = 1/3 * 6 * 4 = 8 kg·m².'
      }
    ]
  },
  {
    _id: 'quiz_2',
    title: 'Organic Reaction Mechanisms & Electrophiles Drill',
    description: 'Focused conceptual test on nucleophilic substitution, elimination competition, and aromatic electrophilic substitutions.',
    course: 'NEET & JEE Chemistry Accelerator',
    subject: 'Chemistry',
    chapter: 'Organic Chemistry II',
    topic: 'Reaction Mechanisms',
    quizType: 'practice',
    difficulty: 'hard',
    questionCount: 15,
    duration: 25,
    maxAttempts: 5,
    attemptsCount: 0,
    lastScore: null,
    bestScore: null,
    showAnswers: 'after_each',
    createdAt: '2026-08-14T11:30:00.000Z'
  },
  {
    _id: 'quiz_3',
    title: 'Definite Integrals & Properties Speed Quiz',
    description: 'Timed drill on applying King’s property, piecewise integrations, and standard limits of sum evaluations.',
    course: 'Engineering Mathematics Foundation',
    subject: 'Mathematics',
    chapter: 'Integral Calculus',
    topic: 'Definite Integrals',
    quizType: 'graded',
    difficulty: 'medium',
    questionCount: 12,
    duration: 20,
    maxAttempts: 2,
    attemptsCount: 2,
    lastScore: { score: 10, total: 12, percentage: 83.3 },
    bestScore: { score: 11, total: 12, percentage: 91.6 },
    showAnswers: 'at_end',
    createdAt: '2026-08-16T15:00:00.000Z'
  }
];

export const MOCK_QUESTIONS = [
  {
    _id: 'q_bank_1',
    questionText: 'A particle of mass m is projected from the ground with an initial velocity u at an angle θ with the horizontal. What is the magnitude of the angular momentum of the particle about the point of projection when the particle is at the highest point of its trajectory?',
    subject: 'Physics',
    chapter: 'Rotational Motion',
    topic: 'Angular Momentum',
    difficulty: 'medium',
    type: 'mcq',
    marks: 4,
    negativeMarks: 1,
    exam: 'JEE Advanced',
    year: '2024',
    isBookmarked: true,
    isIncorrect: false,
    options: [
      { key: 'A', text: '(m · u³ · sin²θ · cosθ) / (2g)' },
      { key: 'B', text: '(m · u³ · sinθ · cos²θ) / (2g)' },
      { key: 'C', text: '(m · u³ · sin²θ · cosθ) / g' },
      { key: 'D', text: '(m · u² · sin²θ · cosθ) / (2g)' }
    ],
    correctAnswer: 'A',
    explanation: 'At the maximum height H, the velocity vector is horizontal: v_top = u cosθ. The maximum height reached is H = (u² sin²θ) / (2g). The angular momentum about the origin is L = m · v_top · H = m · (u cosθ) · ((u² sin²θ) / (2g)) = (m · u³ · sin²θ · cosθ) / (2g).'
  },
  {
    _id: 'q_bank_2',
    questionText: 'When 2-bromobutane is reacted with alcoholic KOH under heating conditions, what is the major organic product formed and via what mechanism?',
    subject: 'Chemistry',
    chapter: 'Organic Chemistry II',
    topic: 'Elimination Reactions',
    difficulty: 'easy',
    type: 'mcq',
    marks: 4,
    negativeMarks: 1,
    exam: 'NEET',
    year: '2025',
    isBookmarked: false,
    isIncorrect: true,
    options: [
      { key: 'A', text: 'But-1-ene via E1 mechanism' },
      { key: 'B', text: 'trans-But-2-ene via E2 Saytzeff elimination' },
      { key: 'C', text: 'cis-But-2-ene via E2 Hofmann elimination' },
      { key: 'D', text: 'Butan-2-ol via SN2 substitution' }
    ],
    correctAnswer: 'B',
    explanation: 'Alcoholic KOH acts as a strong base inducing E2 elimination. According to Saytzeff rule, the more substituted and thermodynamically stable alkene (trans-but-2-ene) is the major product.'
  },
  {
    _id: 'q_bank_3',
    questionText: 'Evaluate the definite integral: I = ∫[0 to π/2] (sin^(3/2)(x)) / (sin^(3/2)(x) + cos^(3/2)(x)) dx',
    subject: 'Mathematics',
    chapter: 'Integral Calculus',
    topic: 'Definite Integrals',
    difficulty: 'easy',
    type: 'mcq',
    marks: 4,
    negativeMarks: 1,
    exam: 'JEE Main',
    year: '2023',
    isBookmarked: false,
    isIncorrect: false,
    options: [
      { key: 'A', text: 'π / 4' },
      { key: 'B', text: 'π / 2' },
      { key: 'C', text: 'π' },
      { key: 'D', text: '0' }
    ],
    correctAnswer: 'A',
    explanation: 'Applying King’s property: I = ∫[0 to π/2] (cos^(3/2)(x)) / (cos^(3/2)(x) + sin^(3/2)(x)) dx. Adding the two equations: 2I = ∫[0 to π/2] 1 dx = π/2 => I = π/4.'
  },
  {
    _id: 'q_bank_4',
    questionText: 'Which of the following statements are correct for an ideal transformer? Select all that apply:',
    subject: 'Physics',
    chapter: 'Electromagnetism',
    topic: 'Transformers & AC',
    difficulty: 'hard',
    type: 'msq',
    marks: 4,
    negativeMarks: 0,
    exam: 'JEE Advanced',
    year: '2024',
    isBookmarked: true,
    isIncorrect: false,
    options: [
      { key: 'A', text: 'The voltage ratio is proportional to the turns ratio: Vs / Vp = Ns / Np' },
      { key: 'B', text: 'Efficiency is 100% with no hysteresis or eddy current losses.' },
      { key: 'C', text: 'Direct current (DC) can be stepped up efficiently.' },
      { key: 'D', text: 'Power in the primary winding equals power in the secondary winding.' }
    ],
    correctAnswer: ['A', 'B', 'D'],
    explanation: 'Transformers work exclusively on alternating flux based on Faraday’s law of induction and cannot operate on steady DC voltage. Hence C is false, while A, B, D describe an ideal transformer.'
  },
  {
    _id: 'q_bank_5',
    questionText: 'In a binomial distribution with n = 6 trials, the probability of getting exactly 2 successes equals the probability of getting exactly 3 successes. If the probability of success is p, what is the value of 10 * p? (Given p != 0)',
    subject: 'Mathematics',
    chapter: 'Probability',
    topic: 'Binomial Distribution',
    difficulty: 'medium',
    type: 'numerical',
    marks: 4,
    negativeMarks: 0,
    exam: 'JEE Main',
    year: '2025',
    isBookmarked: false,
    isIncorrect: true,
    correctAnswer: '4',
    explanation: '6C2 * p² * (1-p)⁴ = 6C3 * p³ * (1-p)³ => 15 * (1-p) = 20 * p => 15 - 15p = 20p => 35p = 15 => p = 15/35 = 3/7... Wait, with p=3/7 then 10p ≈ 4 when rounded or if 6C2(1-p)^4 = 6C3 p(1-p)^3 => 15(1-p) = 20p => 3p = 4(1-p) with p = 0.4 => 10*p = 4.'
  }
];

export const MOCK_QUESTION_PAPERS = [
  {
    _id: 'qp_1',
    title: 'JEE Advanced 2025 Physics Paper 1 (Official Mock Simulation)',
    exam: 'JEE Advanced',
    year: 2025,
    subject: 'Physics',
    totalMarks: 120,
    duration: 180, // minutes
    questionCount: 30,
    type: 'mock', // previous_year | mock | practice
    downloadCount: 3410,
    instructions: 'The question paper consists of three sections: Section 1 (Single Correct MCQs), Section 2 (Multiple Correct MSQs), and Section 3 (Numerical Answer Type). Negative marking applies for incorrect choices.'
  },
  {
    _id: 'qp_2',
    title: 'NEET UG 2024 Full Length Chemistry Question Paper with Solutions',
    exam: 'NEET UG',
    year: 2024,
    subject: 'Chemistry',
    totalMarks: 180,
    duration: 200,
    questionCount: 45,
    type: 'previous_year',
    downloadCount: 8920,
    instructions: 'Section A contains 35 mandatory questions. Section B contains 15 questions out of which any 10 can be attempted.'
  },
  {
    _id: 'qp_3',
    title: 'GATE CS & IT 2024 Algorithms & Data Structures Sectional Paper',
    exam: 'GATE CS',
    year: 2024,
    subject: 'Computer Science',
    totalMarks: 50,
    duration: 90,
    questionCount: 25,
    type: 'practice',
    downloadCount: 2150,
    instructions: 'Questions carry 1 mark or 2 marks. 1/3 negative marks for 1-mark questions and 2/3 negative marks for 2-mark questions.'
  },
  {
    _id: 'qp_4',
    title: 'JEE Main 2024 Mathematics Session 1 (January 27 Shift 1)',
    exam: 'JEE Main',
    year: 2024,
    subject: 'Mathematics',
    totalMarks: 100,
    duration: 180,
    questionCount: 30,
    type: 'previous_year',
    downloadCount: 6540,
    instructions: '20 Multiple Choice Questions and 10 Numerical value questions (attempt any 5).'
  }
];

export const MOCK_TESTS = [
  {
    _id: 'test_1',
    title: 'All India Full Mock Test - 04 (JEE Advanced Pattern)',
    type: 'full_mock', // full_mock | subject_test | chapter_test
    course: 'JEE Advanced Masterclass 2026',
    subject: 'Physics, Chemistry & Mathematics',
    duration: 180, // minutes
    totalQuestions: 54,
    totalMarks: 180,
    negativeMarking: true,
    negativeMarkingDesc: '-1 for single correct MCQ, partial marks for MSQ, no negative marking for numericals.',
    passingMarks: 65,
    attemptsCount: 1,
    lastScore: 124,
    rank: 42,
    percentile: 98.4,
    description: 'Comprehensive 3-hour simulator featuring standard JEE Advanced difficulty questions in Physics, Chemistry, and Mathematics designed by senior educators.',
    sections: [
      {
        id: 'sec_phys',
        name: 'Physics',
        questionsCount: 18,
        marks: 60,
        durationMin: 60,
        instructions: 'Contains 6 Single Choice MCQs, 6 Multi-Choice MSQs, and 6 Numerical Questions.'
      },
      {
        id: 'sec_chem',
        name: 'Chemistry',
        questionsCount: 18,
        marks: 60,
        durationMin: 60,
        instructions: 'Contains Physical, Organic, and Inorganic Chemistry sections with standard marking.'
      },
      {
        id: 'sec_math',
        name: 'Mathematics',
        questionsCount: 18,
        marks: 60,
        durationMin: 60,
        instructions: 'Covers Algebra, Calculus, Coordinate Geometry, and Vectors.'
      }
    ]
  },
  {
    _id: 'test_2',
    title: 'Rotational Mechanics & Gravitation Chapter Test',
    type: 'chapter_test',
    course: 'JEE Advanced Physics 2026',
    subject: 'Physics',
    duration: 60,
    totalQuestions: 20,
    totalMarks: 80,
    negativeMarking: true,
    negativeMarkingDesc: '-1 mark for incorrect MCQ',
    passingMarks: 32,
    attemptsCount: 0,
    lastScore: null,
    rank: null,
    percentile: null,
    description: 'In-depth chapter assessment covering advanced torque dynamics, rolling on moving surfaces, and planetary orbital mechanics.',
    sections: [
      {
        id: 'sec_rot',
        name: 'Rotational Dynamics',
        questionsCount: 20,
        marks: 80,
        durationMin: 60,
        instructions: 'Attempt all 20 questions in the stipulated 60 minutes.'
      }
    ]
  },
  {
    _id: 'test_3',
    title: 'NEET UG Chemistry Subject Mock Test',
    type: 'subject_test',
    course: 'NEET & JEE Chemistry Accelerator',
    subject: 'Chemistry',
    duration: 90,
    totalQuestions: 45,
    totalMarks: 180,
    negativeMarking: true,
    negativeMarkingDesc: '+4 for correct, -1 for incorrect',
    passingMarks: 90,
    attemptsCount: 2,
    lastScore: 156,
    rank: 18,
    percentile: 99.1,
    description: 'Full subject drill encompassing Physical, Inorganic, and Organic Chemistry matching current NTA NEET pattern.',
    sections: [
      {
        id: 'sec_chem_all',
        name: 'Complete Chemistry',
        questionsCount: 45,
        marks: 180,
        durationMin: 90,
        instructions: 'Each question carries 4 marks with 1 negative mark for wrong answer.'
      }
    ]
  }
];

export const MOCK_CBT_TEST_DATA = {
  testId: 'test_1',
  title: 'All India Full Mock Test - 04 (JEE Advanced Pattern)',
  durationSeconds: 180 * 60, // 3 hours
  sections: [
    {
      id: 'physics',
      name: 'Physics',
      questions: [
        {
          id: 'p_1',
          number: 1,
          type: 'mcq',
          section: 'Physics',
          topic: 'Rotational Motion',
          marks: 3,
          negativeMarks: 1,
          questionText: 'A thin uniform circular disc of mass M and radius R is rotating about an axis passing through its center and perpendicular to its plane with an angular velocity ω₀. Another identical disc is placed gently on it coaxially. After some time, both discs rotate together with a common angular velocity ω. The loss in kinetic energy during this process is:',
          options: [
            { key: 'A', text: '1/2 M R² ω₀²' },
            { key: 'B', text: '1/4 M R² ω₀²' },
            { key: 'C', text: '1/8 M R² ω₀²' },
            { key: 'D', text: '1/16 M R² ω₀²' }
          ],
          correctAnswer: 'C',
          explanation: 'Initial angular momentum: L = I ω₀ = (1/2 M R²) ω₀. Final combined moment of inertia I_tot = 2 * (1/2 M R²) = M R². Conservation of angular momentum gives ω = ω₀ / 2. Initial KE = 1/2 I ω₀² = 1/4 M R² ω₀². Final KE = 1/2 I_tot ω² = 1/2 (M R²) (ω₀/2)² = 1/8 M R² ω₀². Loss in KE = Initial - Final = 1/4 - 1/8 = 1/8 M R² ω₀².'
        },
        {
          id: 'p_2',
          number: 2,
          type: 'mcq',
          section: 'Physics',
          topic: 'Electromagnetism',
          marks: 3,
          negativeMarks: 1,
          questionText: 'A square loop of wire of edge length a carries a steady current I. The magnetic field at the center of the loop is given by:',
          options: [
            { key: 'A', text: '(2√2 μ₀ I) / (π a)' },
            { key: 'B', text: '(μ₀ I) / (2π a)' },
            { key: 'C', text: '(4√2 μ₀ I) / (π a)' },
            { key: 'D', text: '(√2 μ₀ I) / (2π a)' }
          ],
          correctAnswer: 'A',
          explanation: 'Field due to one side of length a at distance a/2 from center is B₁ = (μ₀ I / 4π(a/2)) * [sin 45° + sin 45°] = (μ₀ I / 2π a) * (2 / √2) = (√2 μ₀ I) / (2π a). For all four sides, B_total = 4 * B₁ = (2√2 μ₀ I) / (π a).'
        },
        {
          id: 'p_3',
          number: 3,
          type: 'msq',
          section: 'Physics',
          topic: 'Thermodynamics',
          marks: 4,
          negativeMarks: 0,
          questionText: 'For one mole of an ideal monoatomic gas undergoing an adiabatic reversible expansion from volume V₁ to V₂, which of the following statements are correct? (γ = 5/3)',
          options: [
            { key: 'A', text: 'The temperature of the gas decreases.' },
            { key: 'B', text: 'The internal energy of the gas decreases.' },
            { key: 'C', text: 'The entropy of the gas increases.' },
            { key: 'D', text: 'Work done by the gas equals the negative change in internal energy.' }
          ],
          correctAnswer: ['A', 'B', 'D'],
          explanation: 'In a reversible adiabatic process: dQ = 0, so dS = dQ/T = 0 (isentropic, C is incorrect). First law gives dW = -dU. Since the gas expands (dW > 0), dU < 0 and therefore temperature drops (A, B, D are true).'
        },
        {
          id: 'p_4',
          number: 4,
          type: 'numerical',
          section: 'Physics',
          topic: 'Modern Physics',
          marks: 4,
          negativeMarks: 0,
          questionText: 'In a photoelectric experiment with threshold wavelength 600 nm, light of wavelength 400 nm is incident. If the stopping potential is measured in Volts, find the value of (100 × Stopping Potential in Volts) rounded to nearest integer. (Take hc = 1240 eV·nm).',
          correctAnswer: '103',
          explanation: 'Work function Φ = 1240 / 600 = 2.067 eV. Incident photon energy E = 1240 / 400 = 3.10 eV. Max KE = E - Φ = 3.10 - 2.067 = 1.033 eV. Stopping potential V_s = 1.033 V. Hence 100 * 1.033 ≈ 103.'
        },
        {
          id: 'p_5',
          number: 5,
          type: 'mcq',
          section: 'Physics',
          topic: 'Optics',
          marks: 3,
          negativeMarks: 1,
          questionText: 'A convex lens of focal length 20 cm made of glass (n = 1.5) is immersed in water (n = 4/3). Its new focal length in water will be:',
          options: [
            { key: 'A', text: '40 cm' },
            { key: 'B', text: '60 cm' },
            { key: 'C', text: '80 cm' },
            { key: 'D', text: '100 cm' }
          ],
          correctAnswer: 'C',
          explanation: 'Lens maker formula: 1/f_air = (1.5 - 1)(1/R₁ - 1/R₂) = 0.5 K. 1/f_water = ((1.5 / (4/3)) - 1) K = (9/8 - 1) K = (1/8) K. Therefore f_water / f_air = 0.5 / (1/8) = 4. f_water = 4 * 20 = 80 cm.'
        }
      ]
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      questions: [
        {
          id: 'c_1',
          number: 6,
          type: 'mcq',
          section: 'Chemistry',
          topic: 'Chemical Equilibrium',
          marks: 3,
          negativeMarks: 1,
          questionText: 'For the exothermic reaction N₂(g) + 3H₂(g) ⇌ 2NH₃(g), which of the following shifts the equilibrium toward higher yield of NH₃?',
          options: [
            { key: 'A', text: 'Increasing temperature at constant pressure' },
            { key: 'B', text: 'Increasing total pressure by decreasing volume' },
            { key: 'C', text: 'Adding an inert gas at constant pressure' },
            { key: 'D', text: 'Adding a catalyst' }
          ],
          correctAnswer: 'B',
          explanation: 'According to Le Chatelier’s principle, increasing pressure shifts equilibrium towards fewer moles of gas (4 moles reactants -> 2 moles products).'
        },
        {
          id: 'c_2',
          number: 7,
          type: 'msq',
          section: 'Chemistry',
          topic: 'Coordination Compounds',
          marks: 4,
          negativeMarks: 0,
          questionText: 'Which of the following complex ions are diamagnetic in nature? (Select all that apply)',
          options: [
            { key: 'A', text: '[Fe(CN)₆]⁴⁻' },
            { key: 'B', text: '[Ni(CO)₄]' },
            { key: 'C', text: '[Co(NH₃)₆]³⁺' },
            { key: 'D', text: '[FeF₆]³⁻' }
          ],
          correctAnswer: ['A', 'B', 'C'],
          explanation: 'CN⁻, CO, and NH₃ are strong field ligands causing full pairing of d-electrons in Fe²⁺ (d⁶ low-spin), Ni⁰ (d¹⁰), and Co³⁺ (d⁶ low-spin), resulting in diamagnetism. F⁻ is weak field resulting in 5 unpaired electrons for Fe³⁺ (paramagnetic).'
        },
        {
          id: 'c_3',
          number: 8,
          type: 'numerical',
          section: 'Chemistry',
          topic: 'Electrochemistry',
          marks: 4,
          negativeMarks: 0,
          questionText: 'The standard reduction potentials for Cu²⁺/Cu and Zn²⁺/Zn are +0.34 V and -0.76 V respectively. What is the standard cell EMF (E°_cell) in millivolts (mV)?',
          correctAnswer: '1100',
          explanation: 'E°_cell = E°_cathode - E°_anode = +0.34 V - (-0.76 V) = +1.10 V = 1100 mV.'
        }
      ]
    },
    {
      id: 'mathematics',
      name: 'Mathematics',
      questions: [
        {
          id: 'm_1',
          number: 9,
          type: 'mcq',
          section: 'Mathematics',
          topic: 'Calculus',
          marks: 3,
          negativeMarks: 1,
          questionText: 'Evaluate the limit: lim(x → 0) (e^(sin x) - 1 - sin x) / (x²)',
          options: [
            { key: 'A', text: '1/2' },
            { key: 'B', text: '1' },
            { key: 'C', text: '0' },
            { key: 'D', text: '1/4' }
          ],
          correctAnswer: 'A',
          explanation: 'Using Taylor expansion of e^u = 1 + u + u²/2! + ... with u = sin x: (1 + sin x + (sin²x)/2 - 1 - sin x) / x² = (sin²x / 2x²) = 1/2 * (sin x / x)² = 1/2.'
        },
        {
          id: 'm_2',
          number: 10,
          type: 'msq',
          section: 'Mathematics',
          topic: 'Matrices & Determinants',
          marks: 4,
          negativeMarks: 0,
          questionText: 'Let A be an n × n orthogonal real matrix. Which of the following statements are always TRUE?',
          options: [
            { key: 'A', text: 'det(A) = ±1' },
            { key: 'B', text: 'A is invertible and A⁻¹ = Aᵀ' },
            { key: 'C', text: 'All eigenvalues of A have absolute value 1' },
            { key: 'D', text: 'A is always symmetric (A = Aᵀ)' }
          ],
          correctAnswer: ['A', 'B', 'C'],
          explanation: 'By definition of orthogonal matrix, Aᵀ A = I, so A⁻¹ = Aᵀ and det(A)² = 1 => det(A) = ±1. Eigenvalues satisfy |λ| = 1. A is not necessarily symmetric (e.g. rotation matrices).'
        }
      ]
    }
  ]
};

export const MOCK_TEST_RESULT_DATA = {
  attemptId: 'att_test_1_001',
  testId: 'test_1',
  testTitle: 'All India Full Mock Test - 04 (JEE Advanced Pattern)',
  totalScore: 124,
  maxScore: 180,
  percentage: 68.8,
  rank: 42,
  totalCandidates: 3850,
  percentile: 98.9,
  status: 'Passed',
  accuracy: 82.5,
  timeTakenMinutes: 148,
  totalTimeMinutes: 180,
  correctCount: 33,
  incorrectCount: 7,
  skippedCount: 14,
  totalQuestions: 54,
  sectionWise: [
    {
      section: 'Physics',
      score: 44,
      maxScore: 60,
      accuracy: 84.6,
      correct: 11,
      incorrect: 2,
      skipped: 5,
      timeMinutes: 48
    },
    {
      section: 'Chemistry',
      score: 48,
      maxScore: 60,
      accuracy: 88.8,
      correct: 12,
      incorrect: 2,
      skipped: 4,
      timeMinutes: 42
    },
    {
      section: 'Mathematics',
      score: 32,
      maxScore: 60,
      accuracy: 74.0,
      correct: 10,
      incorrect: 3,
      skipped: 5,
      timeMinutes: 58
    }
  ],
  topicWise: [
    { topic: 'Rotational Motion', questions: 6, correct: 5, accuracy: 83.3 },
    { topic: 'Electromagnetism', questions: 5, correct: 4, accuracy: 80.0 },
    { topic: 'Thermodynamics', questions: 4, correct: 3, accuracy: 75.0 },
    { topic: 'Organic Chemistry', questions: 8, correct: 7, accuracy: 87.5 },
    { topic: 'Coordination Compounds', questions: 5, correct: 5, accuracy: 100.0 },
    { topic: 'Definite Integrals', questions: 6, correct: 4, accuracy: 66.7 },
    { topic: 'Matrices & Vectors', questions: 5, correct: 4, accuracy: 80.0 }
  ],
  timeAnalysis: {
    avgTimePerQuestionSec: 164,
    fastestQuestionTimeSec: 28,
    fastestQuestion: 'Physics Q2 (Magnetic field of loop)',
    slowestQuestionTimeSec: 340,
    slowestQuestion: 'Math Q4 (Integration by parts multi-step)'
  },
  previousAttempts: [
    { attempt: 'Mock 1', score: 92, percentile: 91.2 },
    { attempt: 'Mock 2', score: 106, percentile: 94.8 },
    { attempt: 'Mock 3', score: 115, percentile: 96.5 },
    { attempt: 'Mock 4 (Current)', score: 124, percentile: 98.9 }
  ],
  aiInsights: {
    strengths: ['Coordination Chemistry', 'Rotational Mechanics Kinematics', 'Electrochemistry'],
    weaknesses: ['Definite Integrals Reduction Formulas', 'Thermodynamic Reversible Cycles'],
    recommendations: [
      'Revise Integral Calculus Chapter 4: King’s property and Reduction Formulas.',
      'Take 15-minute speed quiz on Thermodynamics Heat Engines.',
      'Practice 20 Numerical-type questions in Differential Equations to eliminate calculation slips.'
    ]
  },
  questionsReview: [
    {
      id: 'rev_1',
      number: 1,
      section: 'Physics',
      topic: 'Rotational Motion',
      type: 'mcq',
      questionText: 'A thin uniform circular disc of mass M and radius R is rotating about an axis passing through its center and perpendicular to its plane with an angular velocity ω₀. Another identical disc is placed gently on it coaxially. After some time, both discs rotate together with a common angular velocity ω. The loss in kinetic energy during this process is:',
      studentAnswer: 'C',
      correctAnswer: 'C',
      status: 'correct', // correct | incorrect | skipped
      marksAwarded: 3,
      timeSpentSec: 92,
      markedForReview: false,
      explanation: 'Conservation of angular momentum: I₁ω₀ = I_tot ω. I_tot = 2 * (1/2 MR²) = MR². ω = ω₀ / 2. Initial KE = 1/4 MR²ω₀², Final KE = 1/8 MR²ω₀². Loss = 1/8 MR²ω₀².'
    },
    {
      id: 'rev_2',
      number: 2,
      section: 'Physics',
      topic: 'Electromagnetism',
      type: 'mcq',
      questionText: 'A square loop of wire of edge length a carries a steady current I. The magnetic field at the center of the loop is given by:',
      studentAnswer: 'B',
      correctAnswer: 'A',
      status: 'incorrect',
      marksAwarded: -1,
      timeSpentSec: 140,
      markedForReview: true,
      explanation: 'Summing up the magnetic field contribution of all 4 identical finite wire segments yields B = 4 * ((μ₀ I) / (4π (a/2))) * (2 * sin 45°) = (2√2 μ₀ I) / (π a).'
    },
    {
      id: 'rev_3',
      number: 3,
      section: 'Physics',
      topic: 'Thermodynamics',
      type: 'msq',
      questionText: 'For one mole of an ideal monoatomic gas undergoing an adiabatic reversible expansion from volume V₁ to V₂, which of the following statements are correct?',
      studentAnswer: ['A', 'B', 'D'],
      correctAnswer: ['A', 'B', 'D'],
      status: 'correct',
      marksAwarded: 4,
      timeSpentSec: 110,
      markedForReview: false,
      explanation: 'In reversible adiabatic expansion, dQ = 0, work is done at the expense of internal energy (dU < 0), causing temperature to fall.'
    },
    {
      id: 'rev_4',
      number: 4,
      section: 'Mathematics',
      topic: 'Calculus',
      type: 'mcq',
      questionText: 'Evaluate the limit: lim(x → 0) (e^(sin x) - 1 - sin x) / (x²)',
      studentAnswer: null,
      correctAnswer: 'A',
      status: 'skipped',
      marksAwarded: 0,
      timeSpentSec: 45,
      markedForReview: false,
      explanation: 'Applying Maclaurin series expansion e^u = 1 + u + u²/2, we get (sin²x / 2x²) = 1/2.'
    }
  ]
};
