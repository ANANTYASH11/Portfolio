// ============================================================================
// 💼 PROJECTS REPOSITORY & RESUME VERIFIED METRICS
// Exact facts from resume. Palette: #0b0912 / #110e1a / #8b5cf6 / #c4b5fd / #00f0ff
// ============================================================================

export interface ProjectMetric {
  label: string;
  value: string;
  detail: string;
}

export interface ProjectLinks {
  live?: string;
  github?: string;
}

export interface ProjectData {
  id: string;
  number: string;
  title: string;
  category: string;
  role: string;
  timeline: string;
  summary: string;
  tools: string[];
  problem: string;
  approach: string;
  result: string;
  metrics: ProjectMetric[];
  diagram: string;
  demoUrl: string;
  videoSrc: string;
  image: string;
  links: ProjectLinks;
}

export const projects: ProjectData[] = [
  {
    id: "algoquiz",
    number: "01",
    title: "AlgoQuiz Pro",
    category: "EdTech · Full Stack Platform",
    role: "Full Stack Engineer",
    timeline: "2025 – 2026",
    summary:
      "Algorithmic diagnostic and evaluation platform featuring curated data structure MCQs, instant complexity feedback, and optimized server latency.",
    tools: [
      "TypeScript",
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Tailwind CSS",
    ],
    problem:
      "Engineering candidates and students required a targeted diagnostic platform to practice data structures and algorithm analysis with instant validation, timed execution, and minimal loading overhead.",
    approach:
      "Architected a full-stack evaluation pipeline with indexed schema queries in MongoDB, stateless JWT authorization, and an optimized client-side state machine with pre-fetched question bundles.",
    result:
      "Published 150+ MCQs spanning sorting, dynamic programming, trees, and graphs, while achieving a verified 20% faster load through bundle splitting and query indexing.",
    metrics: [
      {
        label: "Curated MCQs",
        value: "150+ MCQs",
        detail: "Categorized by topic and asymptotic complexity",
      },
      {
        label: "Load Optimization",
        value: "20% faster load",
        detail: "Optimized indexing & asset pre-caching",
      },
    ],
    diagram: `<svg viewBox="0 0 760 140" fill="none" xmlns="http://www.w3.org/2000/svg" class="case-study-diagram-svg">
  <defs>
    <marker id="arrowAQ" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#8b5cf6"/>
    </marker>
  </defs>
  <!-- Box 1: Client -->
  <rect x="15" y="30" width="145" height="80" rx="12" fill="#110e1a" stroke="rgba(196, 181, 253, 0.25)" stroke-width="1.5"/>
  <text x="87" y="62" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" text-anchor="middle">Client App (React)</text>
  <text x="87" y="82" fill="#c4b5fd" font-family="'DM Mono', monospace" font-size="10" text-anchor="middle">Timed Quiz & UI Engine</text>

  <!-- Line 1 to 2 -->
  <line x1="160" y1="70" x2="195" y2="70" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrowAQ)"/>

  <!-- Box 2: Express -->
  <rect x="200" y="30" width="150" height="80" rx="12" fill="#110e1a" stroke="rgba(196, 181, 253, 0.25)" stroke-width="1.5"/>
  <text x="275" y="62" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" text-anchor="middle">Express API Gateway</text>
  <text x="275" y="82" fill="#c4b5fd" font-family="'DM Mono', monospace" font-size="10" text-anchor="middle">REST & JWT Middleware</text>

  <!-- Fork lines -->
  <path d="M 350 55 L 385 35" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrowAQ)"/>
  <path d="M 350 85 L 385 105" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrowAQ)"/>

  <!-- Box 3: Evaluation Engine -->
  <rect x="390" y="10" width="160" height="50" rx="10" fill="#181324" stroke="rgba(139, 92, 246, 0.35)" stroke-width="1.5"/>
  <text x="470" y="34" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600" text-anchor="middle">Diagnostic Engine</text>
  <text x="470" y="48" fill="#c4b5fd" font-family="'DM Mono', monospace" font-size="9" text-anchor="middle">Dynamic Question Scoring</text>

  <!-- Box 4: In-Memory Cache -->
  <rect x="390" y="80" width="160" height="50" rx="10" fill="#181324" stroke="rgba(139, 92, 246, 0.35)" stroke-width="1.5"/>
  <text x="470" y="104" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600" text-anchor="middle">Response Cache Layer</text>
  <text x="470" y="118" fill="#00f0ff" font-family="'DM Mono', monospace" font-size="9" text-anchor="middle">20% Faster Load Times</text>

  <!-- Line to Box 5 -->
  <line x1="550" y1="35" x2="585" y2="70" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrowAQ)"/>
  <line x1="550" y1="105" x2="585" y2="70" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrowAQ)"/>

  <!-- Box 5: MongoDB -->
  <rect x="590" y="30" width="155" height="80" rx="12" fill="#110e1a" stroke="rgba(196, 181, 253, 0.25)" stroke-width="1.5"/>
  <text x="667" y="62" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" text-anchor="middle">MongoDB Atlas</text>
  <text x="667" y="82" fill="#c4b5fd" font-family="'DM Mono', monospace" font-size="10" text-anchor="middle">150+ Curated Records</text>
</svg>`,
    demoUrl: "https://algo-quiz-pro.vercel.app/",
    videoSrc: "",
    image: "/images/algoquiz.png",
    links: {
      live: "https://algo-quiz-pro.vercel.app/",
      github: "https://github.com/ANANTYASH11/AlgoQuiz-Pro",
    },
  },
  {
    id: "hydrogrid",
    number: "02",
    title: "HydroGrid",
    category: "AI & IoT · Telemetry Infrastructure",
    role: "AI & Systems Developer",
    timeline: "2025",
    summary:
      "IoT telemetry pipeline and predictive machine learning system for municipal water distribution networks and anomaly mitigation.",
    tools: [
      "Python",
      "FastAPI",
      "TensorFlow",
      "Scikit-learn",
      "IoT Sockets",
      "React",
    ],
    problem:
      "Municipal water infrastructure faces significant resource loss and physical pipeline damage due to undetected pressure anomalies and delayed leak identification.",
    approach:
      "Engineered an end-to-end telemetry ingestion layer receiving streaming flow and pressure sensor readings, evaluated by unsupervised anomaly detection models and automated threshold triggers.",
    result:
      "Validated in network simulations flagging 92% of anomalies in real time and reducing municipal water waste by 18% through automated valve throttling triggers.",
    metrics: [
      {
        label: "Anomaly Detection",
        value: "92% anomalies flagged",
        detail: "Real-time unsupervised telemetry classification",
      },
      {
        label: "Waste Reduction",
        value: "18% waste cut",
        detail: "Automated pressure spike throttling",
      },
    ],
    diagram: `<svg viewBox="0 0 760 140" fill="none" xmlns="http://www.w3.org/2000/svg" class="case-study-diagram-svg">
  <defs>
    <marker id="arrowHG" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#8b5cf6"/>
    </marker>
  </defs>
  <!-- Box 1: IoT Sensors -->
  <rect x="15" y="30" width="145" height="80" rx="12" fill="#110e1a" stroke="rgba(196, 181, 253, 0.25)" stroke-width="1.5"/>
  <text x="87" y="62" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" text-anchor="middle">IoT Telemetry Nodes</text>
  <text x="87" y="82" fill="#c4b5fd" font-family="'DM Mono', monospace" font-size="10" text-anchor="middle">Flow & Pressure Sensors</text>

  <!-- Line 1 to 2 -->
  <line x1="160" y1="70" x2="195" y2="70" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrowHG)"/>

  <!-- Box 2: FastAPI -->
  <rect x="200" y="30" width="150" height="80" rx="12" fill="#110e1a" stroke="rgba(196, 181, 253, 0.25)" stroke-width="1.5"/>
  <text x="275" y="62" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" text-anchor="middle">FastAPI Gateway</text>
  <text x="275" y="82" fill="#c4b5fd" font-family="'DM Mono', monospace" font-size="10" text-anchor="middle">WebSocket Ingestion</text>

  <!-- Fork lines -->
  <path d="M 350 55 L 385 35" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrowHG)"/>
  <path d="M 350 85 L 385 105" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrowHG)"/>

  <!-- Box 3: ML Model -->
  <rect x="390" y="10" width="160" height="50" rx="10" fill="#181324" stroke="rgba(139, 92, 246, 0.35)" stroke-width="1.5"/>
  <text x="470" y="34" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600" text-anchor="middle">ML Anomaly Model</text>
  <text x="470" y="48" fill="#00f0ff" font-family="'DM Mono', monospace" font-size="9" text-anchor="middle">92% Anomalies Flagged</text>

  <!-- Box 4: Valve Controller -->
  <rect x="590" y="10" width="155" height="50" rx="10" fill="#110e1a" stroke="rgba(0, 240, 255, 0.3)" stroke-width="1.5"/>
  <text x="667" y="34" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600" text-anchor="middle">Valve Throttling</text>
  <text x="667" y="48" fill="#00f0ff" font-family="'DM Mono', monospace" font-size="9" text-anchor="middle">18% Waste Cut</text>

  <!-- Box 5: Live Dashboard -->
  <rect x="390" y="80" width="160" height="50" rx="10" fill="#181324" stroke="rgba(139, 92, 246, 0.35)" stroke-width="1.5"/>
  <text x="470" y="104" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600" text-anchor="middle">Operator Dashboard</text>
  <text x="470" y="118" fill="#c4b5fd" font-family="'DM Mono', monospace" font-size="9" text-anchor="middle">Live Grid Map Stream</text>

  <!-- Line to Box 6 -->
  <line x1="550" y1="35" x2="585" y2="35" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrowHG)"/>
  <line x1="550" y1="105" x2="585" y2="105" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrowHG)"/>

  <!-- Box 6: Alerts -->
  <rect x="590" y="80" width="155" height="50" rx="10" fill="#110e1a" stroke="rgba(196, 181, 253, 0.25)" stroke-width="1.5"/>
  <text x="667" y="104" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600" text-anchor="middle">Incident Dispatch</text>
  <text x="667" y="118" fill="#c4b5fd" font-family="'DM Mono', monospace" font-size="9" text-anchor="middle">Automated Maintenance Alert</text>
</svg>`,
    demoUrl: "https://hydro-grid-kappa.vercel.app/",
    videoSrc: "",
    image: "/images/hydrogrid.png",
    links: {
      live: "https://hydro-grid-kappa.vercel.app/",
      github: "https://github.com/ANANTYASH11/HydroGrid",
    },
  },
  {
    id: "hmis",
    number: "03",
    title: "Hospital Management System (HMIS)",
    category: "Full Stack · Capstone (IIT Guwahati)",
    role: "Lead Full Stack Engineer",
    timeline: "2024 – 2025",
    summary:
      "Enterprise healthcare records and workflow automation system developed as the Capstone Project for IIT Guwahati Computer Science.",
    tools: [
      "React.js",
      "Node.js",
      "Express",
      "MongoDB",
      "JWT Auth",
      "REST APIs",
    ],
    problem:
      "Manual and fragmented hospital logs resulted in patient record duplication, scheduling bottlenecks, and uncoordinated billing cycles between doctors and pharmacies.",
    approach:
      "Constructed a secure multi-role web platform featuring patient management, doctor consultation scheduling, digital pharmacy tracking, and administrative analytics powered by Express and MongoDB.",
    result:
      "Successfully consolidated over 2,000+ patient records with an audited 30% reduction in data redundancy across hospital departments.",
    metrics: [
      {
        label: "Records Managed",
        value: "2,000+ records",
        detail: "Zero corruption across clinical departments",
      },
      {
        label: "Data Integrity",
        value: "30% less redundancy",
        detail: "Centralized relational database schemas",
      },
    ],
    diagram: `<svg viewBox="0 0 760 140" fill="none" xmlns="http://www.w3.org/2000/svg" class="case-study-diagram-svg">
  <defs>
    <marker id="arrowHMIS" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#8b5cf6"/>
    </marker>
  </defs>
  <!-- Box 1: Portals -->
  <rect x="15" y="30" width="145" height="80" rx="12" fill="#110e1a" stroke="rgba(196, 181, 253, 0.25)" stroke-width="1.5"/>
  <text x="87" y="62" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" text-anchor="middle">Clinical Portals</text>
  <text x="87" y="82" fill="#c4b5fd" font-family="'DM Mono', monospace" font-size="10" text-anchor="middle">Doctor · Patient · Admin</text>

  <!-- Line 1 to 2 -->
  <line x1="160" y1="70" x2="195" y2="70" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrowHMIS)"/>

  <!-- Box 2: JWT Auth & Gateway -->
  <rect x="200" y="30" width="150" height="80" rx="12" fill="#110e1a" stroke="rgba(196, 181, 253, 0.25)" stroke-width="1.5"/>
  <text x="275" y="62" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" text-anchor="middle">JWT Security Layer</text>
  <text x="275" y="82" fill="#c4b5fd" font-family="'DM Mono', monospace" font-size="10" text-anchor="middle">RBAC Access Control</text>

  <!-- Fork lines -->
  <path d="M 350 55 L 385 35" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrowHMIS)"/>
  <path d="M 350 85 L 385 105" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrowHMIS)"/>

  <!-- Box 3: Patient Records -->
  <rect x="390" y="10" width="160" height="50" rx="10" fill="#181324" stroke="rgba(139, 92, 246, 0.35)" stroke-width="1.5"/>
  <text x="470" y="34" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600" text-anchor="middle">Records Sync Pipeline</text>
  <text x="470" y="48" fill="#00f0ff" font-family="'DM Mono', monospace" font-size="9" text-anchor="middle">2,000+ Records Handled</text>

  <!-- Box 4: Pharmacy/Billing -->
  <rect x="390" y="80" width="160" height="50" rx="10" fill="#181324" stroke="rgba(139, 92, 246, 0.35)" stroke-width="1.5"/>
  <text x="470" y="104" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600" text-anchor="middle">Pharmacy & Billing</text>
  <text x="470" y="118" fill="#c4b5fd" font-family="'DM Mono', monospace" font-size="9" text-anchor="middle">Prescription & Ledgers</text>

  <!-- Line to Box 5 -->
  <line x1="550" y1="35" x2="585" y2="70" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrowHMIS)"/>
  <line x1="550" y1="105" x2="585" y2="70" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrowHMIS)"/>

  <!-- Box 5: MongoDB -->
  <rect x="590" y="30" width="155" height="80" rx="12" fill="#110e1a" stroke="rgba(196, 181, 253, 0.25)" stroke-width="1.5"/>
  <text x="667" y="62" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" text-anchor="middle">MongoDB Cluster</text>
  <text x="667" y="82" fill="#00f0ff" font-family="'DM Mono', monospace" font-size="10" text-anchor="middle">30% Less Redundancy</text>
</svg>`,
    demoUrl: "",
    videoSrc: "",
    image: "/images/hmis.png",
    links: {
      github:
        "https://github.com/ANANTYASH11/Capstone-Project-IITGCS_24061332",
    },
  },
];

export default projects;
