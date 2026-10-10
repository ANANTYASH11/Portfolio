import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiRedux,
  SiThreedotjs,
  SiGreensock,
  SiHtml5,
  SiCss,
  SiNodedotjs,
  SiExpress,
  SiGraphql,
  SiSocketdotio,
  SiJsonwebtokens,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiRedis,
  SiSupabase,
  SiFirebase,
  SiCplusplus,
  SiC,
  SiLinux,
  SiGnubash,
  SiPython,
  SiPytorch,
  SiTensorflow,
  SiOpencv,
  SiDocker,
  SiGit,
  SiGithub,
  SiPostman,
} from "react-icons/si";
import { FaJava } from "react-icons/fa6";
import { FiCloud, FiCpu, FiCode } from "react-icons/fi";

// ─────────────────────────────────────────────────────────────────────────────
// 🌟 ALL TUNABLES IN ONE MASTER CONFIG
// ─────────────────────────────────────────────────────────────────────────────
export const CONSTELLATION_CONFIG = {
  // Atmosphere & Stars
  stardustCount: 1600, // 1500+ distant stardust points
  nebulaOpacity: 0.55, // Volumetric nebula shader strength
  driftSpeed: 0.04, // Idle universe drift speed
  mouseParallax: 0.08, // Lerped mouse parallax intensity

  // Star Physics & Glow
  glowStrength: 1.8, // Additive bloom glow multiplier
  pulseSpeed: 1.6, // Slow pulse rate for "Primary" stars
  gravityRadius: 2.2, // Cursor gravity influence radius
  gravityPull: 0.35, // Force pulling stars toward cursor orb
  shockwaveForce: 3.2, // Scatter force when clicking empty space
  shockwaveDamping: 0.92, // Spring settle decay

  // Shooting Stars
  shootingStarInterval: 6000, // Time between shooting star streaks (ms)

  // Camera Flight
  cameraDefaultPos: [0, 0, 14] as [number, number, number],
  cameraFov: 45,
  flightDuration: 1.4, // GSAP fly-in duration in seconds
  flightFovPunch: 36, // FOV punch on focus

  // Constellation Colors
  hues: {
    languages: "#818cf8", // Indigo / Violet
    frontend: "#00f0ff", // Electric Cyan
    backend: "#f43f5e", // Rose / Fuchsia
    databases: "#10b981", // Emerald Green
    systems: "#f59e0b", // Amber / Gold
    ai_cloud: "#a855f7", // Mystical Purple
  },
};

export interface SkillNode {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  tag?: string;
  level: 1 | 2 | 3; // 1: Intermediate, 2: Advanced, 3: Master/Primary
  isPrimary?: boolean;
  pos: [number, number, number]; // Local 3D coordinate within constellation
  relatedIds?: string[]; // Cross-constellation links (e.g. Python <-> PyTorch <-> OpenCV)
}

export interface ConstellationData {
  id: string;
  category: string;
  hue: string;
  center: [number, number, number]; // Center 3D position in the celestial sphere
  skills: SkillNode[];
  edges: [number, number][]; // Index pairs forming the constellation lines
}

export const constellationsData: ConstellationData[] = [
  // ─── 1. Programming Languages (Indigo) ───
  {
    id: "languages",
    category: "Languages",
    hue: CONSTELLATION_CONFIG.hues.languages,
    center: [-4.2, 2.2, -1.2],
    skills: [
      {
        id: "typescript",
        name: "TypeScript",
        icon: SiTypescript,
        tag: "Primary",
        level: 3,
        isPrimary: true,
        pos: [0, 0.9, 0],
        relatedIds: ["react", "nextjs", "nodejs"],
      },
      {
        id: "javascript",
        name: "JavaScript",
        icon: SiJavascript,
        tag: "ES6+",
        level: 3,
        pos: [0.9, 0.4, 0.2],
        relatedIds: ["typescript", "react"],
      },
      {
        id: "python",
        name: "Python",
        icon: SiPython,
        tag: "AI / Data",
        level: 3,
        pos: [-0.9, 0.5, -0.3],
        relatedIds: ["pytorch", "tensorflow", "opencv"],
      },
      {
        id: "cpp",
        name: "C++",
        icon: SiCplusplus,
        tag: "Systems",
        level: 3,
        isPrimary: true,
        pos: [-0.6, -0.6, 0.1],
        relatedIds: ["c", "posix", "threads"],
      },
      {
        id: "c",
        name: "C",
        icon: SiC,
        tag: "Core",
        level: 2,
        pos: [-1.2, -0.2, -0.2],
        relatedIds: ["cpp", "posix"],
      },
      {
        id: "java",
        name: "Java",
        icon: FaJava,
        tag: "OOP",
        level: 2,
        pos: [0.6, -0.7, 0.3],
        relatedIds: ["hmis"],
      },
      {
        id: "html",
        name: "HTML5",
        icon: SiHtml5,
        tag: "Web",
        level: 3,
        pos: [1.2, -0.1, -0.1],
        relatedIds: ["css", "react"],
      },
      {
        id: "css",
        name: "CSS3",
        icon: SiCss,
        tag: "Styling",
        level: 3,
        pos: [0.1, -1.1, 0.1],
        relatedIds: ["tailwind", "html"],
      },
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 6],
      [6, 7],
      [7, 5],
      [5, 3],
      [3, 4],
      [4, 2],
      [0, 3],
    ],
  },

  // ─── 2. Frontend Engineering (Electric Cyan) ───
  {
    id: "frontend",
    category: "Frontend",
    hue: CONSTELLATION_CONFIG.hues.frontend,
    center: [0.2, 3.2, 0.5],
    skills: [
      {
        id: "react",
        name: "React.js",
        icon: SiReact,
        tag: "Primary",
        level: 3,
        isPrimary: true,
        pos: [0, 0.6, 0.2],
        relatedIds: ["nextjs", "typescript", "redux"],
      },
      {
        id: "nextjs",
        name: "Next.js",
        icon: SiNextdotjs,
        tag: "App Router",
        level: 3,
        isPrimary: true,
        pos: [-0.85, 0.1, -0.2],
        relatedIds: ["react", "typescript", "nodejs"],
      },
      {
        id: "redux",
        name: "Redux",
        icon: SiRedux,
        tag: "State",
        level: 2,
        pos: [0.85, 0.2, 0.1],
        relatedIds: ["react"],
      },
      {
        id: "tailwind",
        name: "Tailwind CSS",
        icon: SiTailwindcss,
        tag: "Design",
        level: 3,
        pos: [-0.6, -0.7, 0.2],
        relatedIds: ["css", "react"],
      },
      {
        id: "threejs",
        name: "Three.js",
        icon: SiThreedotjs,
        tag: "WebGL 3D",
        level: 3,
        isPrimary: true,
        pos: [0.65, -0.6, -0.3],
        relatedIds: ["gsap", "javascript"],
      },
      {
        id: "gsap",
        name: "GSAP",
        icon: SiGreensock,
        tag: "Motion",
        level: 3,
        pos: [0.1, -1.0, 0.1],
        relatedIds: ["threejs", "react"],
      },
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 4],
      [3, 5],
      [4, 5],
      [0, 5],
    ],
  },

  // ─── 3. Backend & APIs (Rose / Magenta) ───
  {
    id: "backend",
    category: "Backend & APIs",
    hue: CONSTELLATION_CONFIG.hues.backend,
    center: [4.4, 2.0, -0.8],
    skills: [
      {
        id: "nodejs",
        name: "Node.js",
        icon: SiNodedotjs,
        tag: "Runtime",
        level: 3,
        isPrimary: true,
        pos: [0, 0.8, 0],
        relatedIds: ["express", "typescript", "mongodb"],
      },
      {
        id: "express",
        name: "Express.js",
        icon: SiExpress,
        tag: "REST APIs",
        level: 3,
        pos: [-0.8, 0.1, 0.2],
        relatedIds: ["nodejs", "jwt"],
      },
      {
        id: "graphql",
        name: "GraphQL",
        icon: SiGraphql,
        tag: "Schema",
        level: 2,
        pos: [0.8, 0.2, -0.2],
        relatedIds: ["nodejs", "react"],
      },
      {
        id: "websockets",
        name: "WebSockets",
        icon: SiSocketdotio,
        tag: "Real-time",
        level: 3,
        pos: [-0.5, -0.7, -0.1],
        relatedIds: ["nodejs", "posix"],
      },
      {
        id: "jwt",
        name: "JWT & RBAC",
        icon: SiJsonwebtokens,
        tag: "Auth",
        level: 3,
        pos: [0.55, -0.65, 0.3],
        relatedIds: ["express", "nodejs"],
      },
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 4],
      [3, 4],
      [0, 3],
    ],
  },

  // ─── 4. Databases & Storage (Emerald Green) ───
  {
    id: "databases",
    category: "Databases",
    hue: CONSTELLATION_CONFIG.hues.databases,
    center: [-3.8, -2.4, 0.4],
    skills: [
      {
        id: "mongodb",
        name: "MongoDB",
        icon: SiMongodb,
        tag: "NoSQL",
        level: 3,
        isPrimary: true,
        pos: [0, 0.7, -0.1],
        relatedIds: ["nodejs", "express"],
      },
      {
        id: "postgresql",
        name: "PostgreSQL",
        icon: SiPostgresql,
        tag: "ACID SQL",
        level: 3,
        isPrimary: true,
        pos: [-0.9, 0.1, 0.2],
        relatedIds: ["supabase", "prisma"],
      },
      {
        id: "mysql",
        name: "MySQL",
        icon: SiMysql,
        tag: "RDBMS",
        level: 2,
        pos: [0.9, 0.2, 0.1],
        relatedIds: ["postgresql"],
      },
      {
        id: "redis",
        name: "Redis",
        icon: SiRedis,
        tag: "Cache",
        level: 3,
        pos: [-0.6, -0.7, -0.2],
        relatedIds: ["nodejs", "postgresql"],
      },
      {
        id: "supabase",
        name: "Supabase",
        icon: SiSupabase,
        tag: "BaaS",
        level: 2,
        pos: [0.65, -0.6, 0.3],
        relatedIds: ["postgresql", "react"],
      },
      {
        id: "firebase",
        name: "Firebase",
        icon: SiFirebase,
        tag: "Firestore",
        level: 2,
        pos: [0.1, -1.0, -0.1],
        relatedIds: ["react"],
      },
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 4],
      [3, 5],
      [4, 5],
      [0, 3],
    ],
  },

  // ─── 5. Systems & Core CS (Amber / Gold) ───
  {
    id: "systems",
    category: "Systems & Core",
    hue: CONSTELLATION_CONFIG.hues.systems,
    center: [0.0, -2.8, -0.6],
    skills: [
      {
        id: "posix",
        name: "POSIX Sockets",
        icon: SiGnubash,
        tag: "Networking",
        level: 3,
        isPrimary: true,
        pos: [0, 0.75, 0.1],
        relatedIds: ["cpp", "c", "linux"],
      },
      {
        id: "threads",
        name: "Multithreading",
        icon: FiCpu,
        tag: "Concurrency",
        level: 3,
        isPrimary: true,
        pos: [-0.85, 0.05, -0.2],
        relatedIds: ["cpp", "posix"],
      },
      {
        id: "linux",
        name: "Linux OS",
        icon: SiLinux,
        tag: "Kernel/Shell",
        level: 3,
        pos: [0.85, 0.1, 0.2],
        relatedIds: ["c", "docker"],
      },
      {
        id: "dsa",
        name: "Data Structures",
        icon: FiCode,
        tag: "150+ Solved",
        level: 3,
        isPrimary: true,
        pos: [-0.5, -0.75, 0.2],
        relatedIds: ["cpp", "python"],
      },
      {
        id: "algorithms",
        name: "Algorithms",
        icon: FiCpu,
        tag: "Dynamic Prog",
        level: 3,
        pos: [0.55, -0.7, -0.1],
        relatedIds: ["dsa"],
      },
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 4],
      [3, 4],
      [0, 3],
    ],
  },

  // ─── 6. AI, Cloud & DevOps (Mystical Purple) ───
  {
    id: "ai_cloud",
    category: "AI & DevOps",
    hue: CONSTELLATION_CONFIG.hues.ai_cloud,
    center: [4.0, -2.5, 0.2],
    skills: [
      {
        id: "pytorch",
        name: "PyTorch",
        icon: SiPytorch,
        tag: "Deep Learning",
        level: 3,
        isPrimary: true,
        pos: [0, 0.85, 0.1],
        relatedIds: ["python", "tensorflow", "opencv"],
      },
      {
        id: "tensorflow",
        name: "TensorFlow",
        icon: SiTensorflow,
        tag: "CNN Models",
        level: 2,
        pos: [-0.9, 0.35, -0.3],
        relatedIds: ["python", "pytorch"],
      },
      {
        id: "opencv",
        name: "OpenCV",
        icon: SiOpencv,
        tag: "Vision",
        level: 3,
        pos: [0.85, 0.4, 0.2],
        relatedIds: ["python", "pytorch"],
      },
      {
        id: "docker",
        name: "Docker",
        icon: SiDocker,
        tag: "Containers",
        level: 3,
        isPrimary: true,
        pos: [-0.75, -0.35, 0.1],
        relatedIds: ["linux", "git"],
      },
      {
        id: "git",
        name: "Git",
        icon: SiGit,
        tag: "VCS",
        level: 3,
        pos: [0.75, -0.3, -0.1],
        relatedIds: ["github", "docker"],
      },
      {
        id: "github",
        name: "GitHub",
        icon: SiGithub,
        tag: "Workflows",
        level: 3,
        pos: [0.1, -0.4, 0.25],
        relatedIds: ["git"],
      },
      {
        id: "oci",
        name: "Oracle Cloud",
        icon: FiCloud,
        tag: "25+ Certs",
        level: 3,
        isPrimary: true,
        pos: [-0.45, -0.95, -0.2],
        relatedIds: ["docker"],
      },
      {
        id: "postman",
        name: "Postman",
        icon: SiPostman,
        tag: "Testing",
        level: 2,
        pos: [0.45, -0.95, 0.1],
        relatedIds: ["express"],
      },
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 4],
      [3, 5],
      [4, 5],
      [3, 6],
      [4, 7],
      [6, 7],
    ],
  },
];
