import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I am</h2>
            <h1>
              ANANT
              <br />
              <span>YASH</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>Full Stack</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Developer</div>
              <div className="landing-h2-2">AI Engineer</div>
            </h2>
          </div>
          <div className="landing-scroll-hint">
            <span>SCROLL TO EXPLORE</span>
            <div className="scroll-indicator-bar"></div>
          </div>
        </div>
        {children}
      </div>

    </>
  );
};

export default Landing;
