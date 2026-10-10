// ============================================================================
// 🏛️ VERIFICATION SCAN & HOTSPOT FACTS DATA
// ============================================================================

export interface VerificationHotspot {
  id: string;
  label: string;
  tooltipTitle: string;
  tooltipText: string;
  certPosition: {
    top: string;
    left: string;
  };
  triggerPct: number; // 0.0 - 1.0 scan line trigger progress
  factCode?: string;
  ariaLabel: string;
}

export const VERIFICATION_HOTSPOTS: VerificationHotspot[] = [
  {
    id: "hotspot-ref",
    label: "REF NUMBER",
    tooltipTitle: "Permanent Audit Reference",
    tooltipText: "Reference DG/IITG/CSE/2024-2025/C0232",
    certPosition: {
      top: "14%",
      left: "14%",
    },
    triggerPct: 0.14,
    factCode: "DG/IITG/CSE/2024-2025/C0232",
    ariaLabel: "Verification Check 1: Official reference number DG/IITG/CSE/2024-2025/C0232",
  },
  {
    id: "hotspot-qr",
    label: "QR TOKEN",
    tooltipTitle: "Cryptographic QR Code",
    tooltipText: "Scan to verify · Instant cryptographic verification",
    certPosition: {
      top: "22%",
      left: "88%",
    },
    triggerPct: 0.22,
    factCode: "MJkSD9GbtW",
    ariaLabel: "Verification Check 2: Cryptographic QR verification code MJkSD9GbtW",
  },
  {
    id: "hotspot-authority",
    label: "AUTHORITY",
    tooltipTitle: "Issuing Academic Body",
    tooltipText: "Issued by Daksh Gurukul, IIT Guwahati · Joint initiative with NSDC",
    certPosition: {
      top: "38%",
      left: "50%",
    },
    triggerPct: 0.38,
    ariaLabel: "Verification Check 3: Issued by Daksh Gurukul, Indian Institute of Technology Guwahati and NSDC",
  },
  {
    id: "hotspot-candidate",
    label: "CREDENTIAL",
    tooltipTitle: "Credit-Linked Completion",
    tooltipText: "Credit-linked CS programme, 6 courses · Anant Yash (IITGCS_24061332)",
    certPosition: {
      top: "60%",
      left: "50%",
    },
    triggerPct: 0.60,
    factCode: "IITGCS_24061332",
    ariaLabel: "Verification Check 4: Candidate Anant Yash, Student ID IITGCS_24061332, 6 of 6 courses completed",
  },
];
