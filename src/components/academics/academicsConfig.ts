// ============================================================================
// 🏛️ ACADEMICS "THE DEGREE AS HERO" — MASTER CONFIGURATION & TUNABLES
// ============================================================================

export const ACADEMICS_CONFIG = {
  // ─── 3-Column Composition Tunables ───
  railGap: 48,
  headingGap: 48,
  certWidthMin: 520,
  certWidthMax: 820,

  // ─── Motion & Scroll Entrance ───
  entranceY: 60,
  entranceRotateX: 12,
  entrancePerspective: 1400,
  entranceDuration: 0.9,
  entranceEase: "power3.out",
  entranceScaleStart: 0.9,
  railSlideDistance: 24,

  // ─── Backdrop & Parallax ───
  outlineParallaxDistance: 40,
  spotlightOpacity: 0.16,
  spotlightIntensity: 0.16,
  arcSpeed: 60,
  scanDuration: 1.6,
  floorReflectionOpacity: 0.08,
  fannedCardAngle: 4,
  fannedCardOpacity: 0.3,

  // ─── Idle Floating & Cursor Tilt ───
  floatY: 6,
  floatDuration: 6.0,
  tiltMaxDeg: 5,
  tiltQuickToDuration: 0.35,
  paperBrightness: 0.94,
  paperContrast: 1.02,

  // ─── Curriculum Stagger ───
  curriculumStagger: 0.06,

  // ─── Cursor Ring ───
  cursorDefaultSize: 10,
  cursorHoverSize: 36,

  // ─── Reveal Details Sequence ───
  revealDuration: 0.9,
  revealEase: "power3.out",
  certShrinkScale: 0.9,
  transcriptStagger: 0.06,
  factsStagger: 0.08,

  // ─── Aesthetics & Lighting ───
  glowOpacity: 0.25,
  reflectionOpacity: 0.18,
  glareOpacity: 0.35,

  // ─── Lightbox Zoom ───
  lightboxZoomMin: 1.0,
  lightboxZoomMax: 2.5,
  lightboxZoomStep: 0.3,
};

// ─── Course Transcript Data (Exact 6 courses from IIT Guwahati curriculum) ───
export interface CourseItem {
  code: string;
  title: string;
  status: "Completed";
  description: string;
  isCapstone?: boolean;
}

export const ACADEMIC_COURSES: CourseItem[] = [
  {
    code: "MTH 101",
    title: "Mathematics for Computer Science",
    status: "Completed",
    description: "Discrete mathematics, graph theory, combinatorics & mathematical logic proofs.",
  },
  {
    code: "CSE 101",
    title: "Intro to Computer Science & Programming",
    status: "Completed",
    description: "Algorithmic paradigms, memory addressing, recursion & pointers.",
  },
  {
    code: "CSE 201",
    title: "Data Structures and Algorithms",
    status: "Completed",
    description: "Asymptotic Big-O, dynamic programming, trees, balanced graphs & sorting.",
  },
  {
    code: "CSE 202",
    title: "Database Systems",
    status: "Completed",
    description: "Relational algebra, SQL, ACID transactions, normalization & index design.",
  },
  {
    code: "CSE 301",
    title: "Computer System Design & Architecture",
    status: "Completed",
    description: "Hardware-software interface, memory hierarchy, cache coherency & OS threads.",
  },
  {
    code: "CSE 302",
    title: "Capstone Project (HMIS)",
    status: "Completed",
    description: "Hospital Management Information System developed under IIT Guwahati CS faculty.",
    isCapstone: true,
  },
];

// ─── Academic Verified Facts & Metadata ───
export const ACADEMIC_FACTS = {
  candidateName: "Anant Yash",
  studentId: "IITGCS_24061332",
  refNumber: "DG/IITG/CSE/2024-2025/C0232",
  verificationCode: "MJkSD9GbtW",
  institution: "Indian Institute of Technology Guwahati",
  initiative: "Daksh Gurukul · Joint Initiative with NSDC (MSDE, Govt. of India)",
  coursesCount: 6,
  coursesTotal: 6,
  cgpa: 7.2,
  timeline: "Jun 2024 – May 2026",
  certificateImg: "/images/minor-degree.png",
  transcriptImg: "/images/minor-degree-transcript.png",
  pdfPath: "/docs/Anant_Yash_ReportCard.pdf",
  capstoneRepo: "https://github.com/ANANTYASH11/Capstone-Project-IITGCS_24061332",
};
