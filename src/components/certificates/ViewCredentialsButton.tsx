import React, { useRef } from "react";
import { FiArrowRight } from "react-icons/fi";
import "../styles/vault.css";

interface ViewCredentialsButtonProps {
  onClick: (coords: { x: number; y: number }) => void;
  className?: string;
}

export const ViewCredentialsButton: React.FC<ViewCredentialsButtonProps> = ({
  onClick,
  className = "",
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickViewportX = e.clientX || rect.left + rect.width / 2;
    const clickViewportY = e.clientY || rect.top + rect.height / 2;
    onClick({ x: clickViewportX, y: clickViewportY });
  };

  return (
    <div
      className={`vault-trigger-wrapper ${className}`}
      style={{ pointerEvents: "auto", margin: "24px auto 0 auto" }}
    >
      <button
        ref={btnRef}
        type="button"
        className="vault-view-details-btn"
        onClick={handleClick}
        aria-label="View Credentials & Certificate Vault (18 Credentials)"
        data-cursor="disable"
        style={{ pointerEvents: "auto", cursor: "pointer" }}
      >
        <span>View Credentials & Certificate Vault (18 Credentials)</span>
        <FiArrowRight style={{ fontSize: "16px", marginLeft: "4px" }} />
      </button>
    </div>
  );
};

export default ViewCredentialsButton;
