import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <div className="cinema-journey">
          <div className="cinema-scene">
            <div className="scene-header">
              <span className="scene-num">ACT I</span>
              <span className="scene-title">The Inception</span>
            </div>
            <p className="para">
              My journey started not in front of a keyboard, but in front of a blank canvas—a fascination with how code can construct entire universes from logic. This curiosity led me to pursue my <strong>B.Tech in Computer Science and Engineering at LPU,</strong> establishing the raw foundation of my engineering craft.
            </p>
          </div>

          <div className="cinema-scene">
            <div className="scene-header">
              <span className="scene-num">ACT II</span>
              <span className="scene-title">The Convergence</span>
            </div>
            <p className="para">
              Seeking to refine my algorithmic lens, I embarked on a parallel track, pursuing a <strong>Minor in Computer Science from IIT Guwahati.</strong> Here, the boundaries of machine learning and deep architectures clicked. As an <strong>AI Fellow at 1M1B</strong> and ML trainee at Infosys, I began teaching machines to recognize patterns and build solutions targeting real-world social impact.
            </p>
          </div>

          <div className="cinema-scene">
            <div className="scene-header">
              <span className="scene-num">ACT III</span>
              <span className="scene-title">The System Engine</span>
            </div>
            <p className="para">
              But high-level abstraction was only half the story; I wanted to control the steel underneath. I dove deep into POSIX sockets, systems programming, and multithreading—building custom load balancers and network servers. This passion for performance took root during my engineering internship at <strong>Bluestock Fintech,</strong> where I optimized APIs and database queries to slash latency by 25%.
            </p>
          </div>

          <div className="cinema-scene">
            <div className="scene-header">
              <span className="scene-num">ACT IV</span>
              <span className="scene-title">The Next Scene</span>
            </div>
            <p className="para">
              Today, I treat software engineering as a cinematic discipline: precise choreography of data structures, optimized frames of execution, and robust systems built to scale. The camera is rolling, the code is compiling, and I am ready to engineer the next big narrative.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
