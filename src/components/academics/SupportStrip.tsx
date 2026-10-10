import React from "react";
import { ACADEMIC_FACTS } from "./academicsConfig";

export const SupportStrip: React.FC = () => {
  return (
    <div className="academics-support-strip" aria-label="Official accreditation partners">
      <span className="support-strip-item">DAKSH GURUKUL</span>
      <span className="support-strip-dot" aria-hidden="true">·</span>
      <span className="support-strip-item">NSDC</span>
      <span className="support-strip-dot" aria-hidden="true">·</span>
      <span className="support-strip-item">MSDE</span>
      <span className="support-strip-dot" aria-hidden="true">·</span>
      <span className="support-strip-item">MASAI</span>
      <span className="support-strip-dot" aria-hidden="true">·</span>
      <span className="support-strip-item">IIT GUWAHATI</span>
      <span className="support-strip-dot" aria-hidden="true">·</span>
      <span className="support-strip-item">REF {ACADEMIC_FACTS.refNumber}</span>
    </div>
  );
};

export default SupportStrip;
