import React from "react";
import {
  MdSchool,
  MdOutlineCloudQueue,
  MdCode,
  MdSecurity,
} from "react-icons/md";
import {
  FiCpu,
  FiTerminal,
  FiDatabase,
} from "react-icons/fi";
import { LuBinary, LuBrainCircuit } from "react-icons/lu";

// ─────────────────────────────────────────────────────────────────────────────
// ⚙️ THE PLAYFUL CERTIFICATE COLLECTION — MASTER TUNABLES & CONFIG
// ─────────────────────────────────────────────────────────────────────────────
export const COLLECTION_CONFIG = {
  // Goal & Counters
  totalGoal: "25+",
  currentCount: 18,
  nextUnlockTitle: "Next unlock: Oracle AI Vector Search?",

  // Restrained Palette
  colors: {
    base: "#0b0912",
    surface: "#110e1a",
    surfaceElevated: "#181324",
    lemon: "#c4b5fd", // remapped to lavender
    pink: "#8b5cf6",  // remapped to violet
    mint: "#00f0ff",  // remapped to cyan
    sky: "#c4b5fd",   // remapped to lavender
    grape: "#3b2a6b", // remapped to deep violet
    white: "#ffffff",
  },

  // Motion & Physics Tunables
  bounceStrength: 1.1,
  confettiCount: 24,
  maxConfetti: 60,
  rotationRangeDeg: 3, // Cards loose layout -3deg to +3deg
  dealStagger: 0.07, // Staggered card deal entrance

  // Booster Pack Physics & Vault Door
  pack: {
    floatDuration: 3.5,
    wobbleInterval: 3.2,
    shimmerInterval: 4.0,
    wiggleDeg: 3,
    squishScale: { x: 0.94, y: 1.06 },
    tearSpeed: 0.6,
    flipDuration: 0.95,
  },

  // Vault Door Split Physics
  vaultDoor: {
    splitDuration: 0.8,
    splitEase: "expo.inOut",
    splitDistancePercent: 60,
    lightSpillDuration: 0.9,
    flipDuration: 1.1,
  },

  // Spotlight on Album
  spotlight: {
    radiusPx: 300,
    opacity: 0.10,
  },

  // Motion & Portal Tunables
  shockwaveDuration: 1.2,
  flipDuration: 0.9,
  flipEase: "power3.inOut",
  tileEntranceDuration: 0.65,
  maxDpr: 1.5,
  tileShape: "hex" as "hex" | "octagon",
  frontTiltMaxDeg: 6,
  magneticButtonStrength: 4,

  // Holographic Foil & Tilt
  holoFoil: {
    maxTiltDeg: 5,
    tiltSpeed: 0.22,
    sheenOpacity: 0.12,
  },

  // Constellation relations
  constellation: {
    drawDuration: 0.5,
    lineOpacity: 0.45,
    lineColor: "#FFE45E",
    dimmedCardOpacity: 0.45,
  },

  // Milestones on XP progress bar
  milestones: [
    {
      id: "oracle_core",
      count: 6,
      label: "6 Oracle core",
      pct: 24,
      isReached: true,
      certs: ["GenAI Pro", "DevOps Pro", "Cloud Pro", "Architect", "Data Platform", "Autonomous DB"],
    },
    {
      id: "cloud_ai",
      count: 10,
      label: "10 Cloud & AI",
      pct: 40,
      isReached: true,
      certs: ["All 10 Oracle Cloud & AI Credentials", "Networking Pro", "Security Pro", "Data Science Pro", "OKE Developer"],
    },
    {
      id: "verified",
      count: 18,
      label: "18 Verified",
      pct: 72,
      isReached: true,
      certs: ["10 Oracle Certifications", "4 Software Engineering Internships", "IIT Guwahati CS Degree & Capstone"],
    },
    {
      id: "goal",
      count: 25,
      label: "25+ Goal",
      pct: 100,
      isReached: false,
      certs: ["Target 2026 Specializations & Advanced Architecture"],
    },
  ],
} as const;

export const VAULT_CONFIG = COLLECTION_CONFIG; // Backward compatibility alias

export type CertCategory = "all" | "oracle" | "internship" | "training";
export type CertRarity = "legendary" | "rare" | "epic";

export interface SkillStat {
  name: string;
  level: number;
}

export interface CollectibleCard {
  id: string;
  number: string;
  title: string;
  issuer: string;
  date: string;
  category: "oracle" | "internship" | "training";
  rarity: CertRarity;
  color: string; // Card's accent color (for hard offset shadow)
  tag: string;
  note?: string; // Handwritten Caveat annotation
  image?: string;
  credentialUrl?: string;
  credentialId?: string;
  downloadUrl?: string;
  skills: SkillStat[];
  relatedTo?: string[];
  relatedIds?: string[];
  icon?: React.ComponentType<{ size?: number; color?: string; className?: string; strokeWidth?: number }>;
}

export const COLLECTION_FILTERS: { label: string; value: CertCategory; count: number }[] = [
  { label: "All", value: "all", count: 18 },
  { label: "Oracle", value: "oracle", count: 10 },
  { label: "Internships", value: "internship", count: 4 },
  { label: "Trainings", value: "training", count: 4 },
];

export const OracleGlyph: React.FC<{ size?: number; color?: string; className?: string }> = ({
  size = 24,
  color = "currentColor",
  className = "",
}) =>
  React.createElement(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      className,
    },
    React.createElement("path", {
      d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z",
      fill: color,
    })
  );

export const CERTIFICATES: CollectibleCard[] = [
  // ─── ORACLE CLOUD & AI (Gold Holo · LEGENDARY) ───
  {
    id: "oci-genai-pro",
    number: "#001/025",
    title: "Oracle Certified Generative AI Professional",
    issuer: "Oracle University",
    date: "Sep 2025",
    category: "oracle",
    rarity: "legendary",
    color: "#FFE45E", // Lemon Gold
    tag: "Generative AI",
    note: "my favourite!",
    credentialId: "1Z0-1127-24",
    credentialUrl: "https://catalog-education.oracle.com/",
    relatedTo: ["oci-ds-pro", "oci-cloud-pro", "oracle-data-platform"],
    relatedIds: ["oci-ds-pro", "oci-cloud-pro", "oracle-data-platform"],
    icon: LuBrainCircuit,
    skills: [
      { name: "LLM Fine-Tuning", level: 96 },
      { name: "Vector Search", level: 94 },
      { name: "OCI AI Services", level: 92 },
    ],
  },
  {
    id: "oci-devops-pro",
    number: "#002/025",
    title: "Oracle Certified DevOps Professional",
    issuer: "Oracle University",
    date: "Aug 2025",
    category: "oracle",
    rarity: "legendary",
    color: "#FFE45E",
    tag: "DevOps & CI/CD",
    note: "built with OKE!",
    credentialId: "1Z0-1109-24",
    credentialUrl: "https://catalog-education.oracle.com/",
    relatedTo: ["oci-cloud-pro", "oci-architect-assoc", "oci-oke-native"],
    relatedIds: ["oci-cloud-pro", "oci-architect-assoc", "oci-oke-native"],
    icon: FiTerminal,
    skills: [
      { name: "CI/CD Pipelines", level: 94 },
      { name: "Docker & K8s", level: 90 },
      { name: "Infra as Code", level: 92 },
    ],
  },
  {
    id: "oci-network-pro",
    number: "#003/025",
    title: "Oracle Certified Networking Professional",
    issuer: "Oracle University",
    date: "Jul 2025",
    category: "oracle",
    rarity: "legendary",
    color: "#FFE45E",
    tag: "VCN & FastConnect",
    note: "zero packet loss!",
    credentialId: "1Z0-1075-24",
    credentialUrl: "https://catalog-education.oracle.com/",
    relatedTo: ["oci-architect-assoc", "oci-cloud-pro", "oci-security-pro"],
    relatedIds: ["oci-architect-assoc", "oci-cloud-pro", "oci-security-pro"],
    icon: MdOutlineCloudQueue,
    skills: [
      { name: "VCN Architecture", level: 95 },
      { name: "FastConnect Direct", level: 88 },
      { name: "Zero-Trust Mesh", level: 91 },
    ],
  },
  {
    id: "oci-cloud-pro",
    number: "#004/025",
    title: "Oracle Certified Cloud Professional",
    issuer: "Oracle University",
    date: "Jul 2025",
    category: "oracle",
    rarity: "legendary",
    color: "#FFE45E",
    tag: "OCI Architecture",
    note: "foundational core",
    credentialId: "1Z0-1072-24",
    credentialUrl: "https://catalog-education.oracle.com/",
    relatedTo: ["oci-architect-assoc", "oci-genai-pro", "oci-devops-pro"],
    relatedIds: ["oci-architect-assoc", "oci-genai-pro", "oci-devops-pro"],
    icon: OracleGlyph,
    skills: [
      { name: "High Availability", level: 93 },
      { name: "Compute Auto-scale", level: 90 },
      { name: "Security Zones", level: 92 },
    ],
  },
  {
    id: "oci-ds-pro",
    number: "#005/025",
    title: "OCI Data Science Professional",
    issuer: "Oracle University",
    date: "Jun 2025",
    category: "oracle",
    rarity: "legendary",
    color: "#FFE45E",
    tag: "Data Science",
    note: "AutoML pipeline!",
    credentialId: "1Z0-1110-24",
    credentialUrl: "https://catalog-education.oracle.com/",
    relatedTo: ["oci-genai-pro", "oracle-data-platform", "intern-iitg-analytics"],
    relatedIds: ["oci-genai-pro", "oracle-data-platform", "intern-iitg-analytics"],
    icon: FiCpu,
    skills: [
      { name: "ML Pipelines", level: 94 },
      { name: "AutoML Tuning", level: 90 },
      { name: "Model Inference", level: 92 },
    ],
  },
  {
    id: "oracle-data-platform",
    number: "#006/025",
    title: "Oracle Data Platform 2025 Certified Foundations",
    issuer: "Oracle University",
    date: "Jun 2025",
    category: "oracle",
    rarity: "legendary",
    color: "#FFE45E",
    tag: "Data Lakehouse",
    note: "fresh 2025!",
    credentialId: "1Z0-1122-25",
    credentialUrl: "https://catalog-education.oracle.com/",
    relatedTo: ["oci-ds-pro", "oci-autonomous-db"],
    relatedIds: ["oci-ds-pro", "oci-autonomous-db"],
    icon: FiDatabase,
    skills: [
      { name: "Data Lakehouse", level: 91 },
      { name: "GoldenGate Streaming", level: 88 },
      { name: "SQL Analytics", level: 93 },
    ],
  },
  {
    id: "oci-architect-assoc",
    number: "#007/025",
    title: "OCI Certified Architect Associate",
    issuer: "Oracle University",
    date: "May 2025",
    category: "oracle",
    rarity: "legendary",
    color: "#FFE45E",
    tag: "Solutions Architect",
    credentialId: "1Z0-1072-23",
    credentialUrl: "https://catalog-education.oracle.com/",
    relatedTo: ["oci-cloud-pro", "oci-network-pro"],
    relatedIds: ["oci-cloud-pro", "oci-network-pro"],
    icon: MdOutlineCloudQueue,
    skills: [
      { name: "Cloud Design", level: 92 },
      { name: "Storage Lifecycle", level: 89 },
      { name: "Identity IAM", level: 91 },
    ],
  },
  {
    id: "oci-autonomous-db",
    number: "#008/025",
    title: "Oracle Autonomous Database Cloud Specialist",
    issuer: "Oracle University",
    date: "Apr 2025",
    category: "oracle",
    rarity: "legendary",
    color: "#FFE45E",
    tag: "Autonomous DB",
    credentialId: "1Z0-931-24",
    credentialUrl: "https://catalog-education.oracle.com/",
    relatedTo: ["oracle-data-platform", "oci-cloud-pro"],
    relatedIds: ["oracle-data-platform", "oci-cloud-pro"],
    icon: FiDatabase,
    skills: [
      { name: "Autonomous OLTP", level: 95 },
      { name: "Auto-Patching", level: 91 },
      { name: "Data Warehousing", level: 93 },
    ],
  },
  {
    id: "oci-security-pro",
    number: "#009/025",
    title: "Oracle Cloud Security Professional 2025",
    issuer: "Oracle University",
    date: "Mar 2025",
    category: "oracle",
    rarity: "legendary",
    color: "#FFE45E",
    tag: "Zero-Trust",
    credentialId: "1Z0-1104-24",
    credentialUrl: "https://catalog-education.oracle.com/",
    relatedTo: ["train-iitr-hacking", "oci-network-pro"],
    relatedIds: ["train-iitr-hacking", "oci-network-pro"],
    icon: MdSecurity,
    skills: [
      { name: "Cloud Guard", level: 94 },
      { name: "Vault KMS", level: 92 },
      { name: "WAF Security", level: 90 },
    ],
  },
  {
    id: "oci-oke-native",
    number: "#010/025",
    title: "Oracle Kubernetes Engine (OKE) Developer",
    issuer: "Oracle University",
    date: "Feb 2025",
    category: "oracle",
    rarity: "legendary",
    color: "#FFE45E",
    tag: "Kubernetes",
    credentialId: "1Z0-1084-24",
    credentialUrl: "https://catalog-education.oracle.com/",
    relatedTo: ["oci-devops-pro", "oci-cloud-pro"],
    relatedIds: ["oci-devops-pro", "oci-cloud-pro"],
    icon: MdCode,
    skills: [
      { name: "OKE Clusters", level: 93 },
      { name: "Helm Deployments", level: 91 },
      { name: "Service Mesh", level: 89 },
    ],
  },

  // ─── INTERNSHIPS (Silver · RARE) ───
  {
    id: "intern-ascender",
    number: "#011/025",
    title: "Software Engineering Internship",
    issuer: "Ascender Foundation",
    date: "Jul – Sep 2025",
    category: "internship",
    rarity: "rare",
    color: "#5CC8FF", // Sky Silver
    tag: "Software Engineering",
    note: "production code!",
    credentialId: "ASC-SWE-2025-88",
    credentialUrl: "",
    relatedTo: ["intern-skillcraft", "intern-future-interns"],
    relatedIds: ["intern-skillcraft", "intern-future-interns"],
    icon: MdCode,
    skills: [
      { name: "Async REST APIs", level: 92 },
      { name: "SQL Tuning", level: 90 },
      { name: "Git Workflows", level: 94 },
    ],
  },
  {
    id: "intern-iitg-analytics",
    number: "#012/025",
    title: "Summer Analytics Intensive",
    issuer: "IIT Guwahati",
    date: "Jun – Sep 2025",
    category: "internship",
    rarity: "rare",
    color: "#5CC8FF",
    tag: "Data & ML",
    note: "IIT campus intensive",
    credentialId: "IITG-SA-2025-442",
    credentialUrl: "",
    relatedTo: ["oci-ds-pro", "iitg-minor-degree"],
    relatedIds: ["oci-ds-pro", "iitg-minor-degree"],
    icon: LuBinary,
    skills: [
      { name: "Statistical Modeling", level: 94 },
      { name: "Feature Engineering", level: 91 },
      { name: "Python / Pandas", level: 95 },
    ],
  },
  {
    id: "intern-future-interns",
    number: "#013/025",
    title: "Full-Stack Development Internship",
    issuer: "Future Interns",
    date: "Jun – Aug 2025",
    category: "internship",
    rarity: "rare",
    color: "#5CC8FF",
    tag: "Full-Stack React",
    credentialId: "FI-FS-2025-302",
    credentialUrl: "",
    relatedTo: ["intern-skillcraft", "iitg-capstone-hmis"],
    relatedIds: ["intern-skillcraft", "iitg-capstone-hmis"],
    icon: MdCode,
    skills: [
      { name: "React Components", level: 93 },
      { name: "Node.js Endpoints", level: 90 },
      { name: "State Systems", level: 89 },
    ],
  },
  {
    id: "intern-skillcraft",
    number: "#014/025",
    title: "Full-Stack Web Development Internship",
    issuer: "SkillCraft Technology",
    date: "Jun – Aug 2025",
    category: "internship",
    rarity: "rare",
    color: "#5CC8FF",
    tag: "Web Apps",
    credentialId: "SCT-FS-2025-144",
    credentialUrl: "",
    relatedTo: ["intern-ascender", "intern-future-interns"],
    relatedIds: ["intern-ascender", "intern-future-interns"],
    icon: MdCode,
    skills: [
      { name: "Client Profiling", level: 91 },
      { name: "MongoDB Schema", level: 89 },
      { name: "Responsive UI", level: 94 },
    ],
  },

  // ─── TRAININGS & ACADEMICS (Bronze · EPIC) ───
  {
    id: "train-iitg-consulting",
    number: "#015/025",
    title: "Consulting & Business Analytics Executive",
    issuer: "IIT Guwahati",
    date: "Dec 2025",
    category: "training",
    rarity: "epic",
    color: "#FF5CA8", // Hot Pink Bronze
    tag: "Consulting & Strategy",
    note: "executive track",
    credentialId: "IITG-CONSULT-2025-12",
    credentialUrl: "",
    relatedTo: ["iitg-minor-degree"],
    relatedIds: ["iitg-minor-degree"],
    icon: MdSchool,
    skills: [
      { name: "Strategic Frameworks", level: 93 },
      { name: "Cost Optimization", level: 90 },
      { name: "Executive Briefing", level: 91 },
    ],
  },
  {
    id: "train-iitr-hacking",
    number: "#016/025",
    title: "Ethical Hacking & Cybersecurity Workshop",
    issuer: "IIT Roorkee",
    date: "Feb 2025",
    category: "training",
    rarity: "epic",
    color: "#FF5CA8",
    tag: "Penetration Testing",
    note: "security audit",
    credentialId: "IITR-CYBER-2025-084",
    credentialUrl: "",
    relatedTo: ["oci-security-pro"],
    relatedIds: ["oci-security-pro"],
    icon: MdSecurity,
    skills: [
      { name: "OWASP Top 10", level: 95 },
      { name: "Packet Forensics", level: 92 },
      { name: "Vulnerability Audit", level: 93 },
    ],
  },
  {
    id: "iitg-minor-degree",
    number: "#017/025",
    title: "Minor Degree in Computer Science & Engineering",
    issuer: "IIT Guwahati",
    date: "2024 – 2025",
    category: "training",
    rarity: "epic",
    color: "#FF5CA8",
    tag: "Academic Degree",
    note: "official IITG degree",
    image: "/images/minor-degree.png",
    downloadUrl: "/docs/Anant_Yash_ReportCard.pdf",
    credentialUrl: "/docs/Anant_Yash_ReportCard.pdf",
    credentialId: "IITGCS_24061332",
    relatedTo: ["iitg-capstone-hmis", "intern-iitg-analytics"],
    relatedIds: ["iitg-capstone-hmis", "intern-iitg-analytics"],
    icon: MdSchool,
    skills: [
      { name: "Algorithms & Logic", level: 96 },
      { name: "Operating Systems", level: 92 },
      { name: "Database Theory", level: 94 },
    ],
  },
  {
    id: "iitg-capstone-hmis",
    number: "#018/025",
    title: "Capstone: Hospital Management Information System",
    issuer: "IIT Guwahati",
    date: "May 2025",
    category: "training",
    rarity: "epic",
    color: "#FF5CA8",
    tag: "Full-Stack HMIS",
    note: "capstone project",
    image: "/images/hmis.png",
    credentialUrl: "https://github.com/ANANTYASH11/Capstone-Project-IITGCS_24061332",
    credentialId: "IITG-CAPSTONE-2025-01",
    relatedTo: ["iitg-minor-degree", "intern-future-interns"],
    relatedIds: ["iitg-minor-degree", "intern-future-interns"],
    icon: LuBinary,
    skills: [
      { name: "Enterprise Architecture", level: 95 },
      { name: "Role-Based Auth", level: 93 },
      { name: "Relational Schema", level: 94 },
    ],
  },
];

export interface CertificateCluster {
  id: "oracle" | "internship" | "training";
  name: string;
  hue: string;
  borderRgba: string;
  glowRgba: string;
  items: CollectibleCard[];
}

export function getCertificateClusters(): CertificateCluster[] {
  return [
    {
      id: "oracle",
      name: "ORACLE CLOUD & AI",
      hue: "#FFE45E",
      borderRgba: "rgba(255, 228, 94, 0.35)",
      glowRgba: "rgba(255, 228, 94, 0.2)",
      items: CERTIFICATES.filter((item) => item.category === "oracle"),
    },
    {
      id: "internship",
      name: "INTERNSHIPS",
      hue: "#5CC8FF",
      borderRgba: "rgba(92, 200, 255, 0.35)",
      glowRgba: "rgba(92, 200, 255, 0.2)",
      items: CERTIFICATES.filter((item) => item.category === "internship"),
    },
    {
      id: "training",
      name: "TRAININGS",
      hue: "#FF5CA8",
      borderRgba: "rgba(255, 92, 168, 0.35)",
      glowRgba: "rgba(255, 92, 168, 0.2)",
      items: CERTIFICATES.filter((item) => item.category === "training"),
    },
  ];
}
