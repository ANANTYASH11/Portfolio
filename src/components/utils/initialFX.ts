import { SplitText } from "gsap/SplitText";
import gsap from "gsap";

let activeTimelines: gsap.core.Timeline[] = [];
let activeSplitTexts: SplitText[] = [];

export function initialFX() {
  // Clean up any existing SplitText instances and GSAP timelines to prevent text overlapping
  activeSplitTexts.forEach((st) => {
    try {
      st.revert();
    } catch (e) { }
  });
  activeSplitTexts = [];

  activeTimelines.forEach((tl) => {
    try {
      tl.kill();
    } catch (e) { }
  });
  activeTimelines = [];

  document.body.style.overflowY = "auto";
  const mainEl = document.getElementsByTagName("main")[0];
  if (mainEl) mainEl.classList.add("main-active");

  gsap.to("body", {
    backgroundColor: "#0b080c",
    duration: 0.5,
    delay: 1,
  });

  const landingText = new SplitText(
    [".landing-info h3", ".landing-intro h2", ".landing-intro h1"],
    {
      type: "chars,lines",
      linesClass: "split-line",
    }
  );
  activeSplitTexts.push(landingText);

  gsap.fromTo(
    landingText.chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.3,
    }
  );

  const TextProps = { type: "chars,lines", linesClass: "split-h2" };

  const landingText1 = new SplitText(".landing-h2-1", TextProps);
  const landingText2 = new SplitText(".landing-h2-2", TextProps);

  activeSplitTexts.push(landingText1, landingText2);

  // Animate initial Developer text IN
  gsap.fromTo(
    landingText1.chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.3,
    }
  );

  // Set initial hidden state for AI Engineer layer
  gsap.set(landingText2.chars, {
    opacity: 0,
    y: 80,
  });

  gsap.fromTo(
    ".landing-info-h2",
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      delay: 0.3,
    }
  );

  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      delay: 0.1,
    }
  );

  LoopText(landingText1, landingText2);
}

function LoopText(Text1: SplitText, Text2: SplitText) {
  const tl = gsap.timeline({ repeat: -1, delay: 3.5 });
  activeTimelines.push(tl);

  tl.to(Text1.chars, {
    y: -80,
    opacity: 0,
    duration: 0.8,
    ease: "power3.inOut",
    stagger: 0.03,
  })
    .call(() => {
      gsap.set(".landing-h2-2", { opacity: 1 });
      gsap.set(".landing-h2-1", { opacity: 0 });
    })
    .fromTo(
      Text2.chars,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.inOut",
        stagger: 0.03,
      },
      "-=0.6"
    )
    .to(
      Text2.chars,
      {
        y: -80,
        opacity: 0,
        duration: 0.8,
        ease: "power3.inOut",
        stagger: 0.03,
      },
      "+=3.5"
    )
    .call(() => {
      gsap.set(".landing-h2-1", { opacity: 1 });
      gsap.set(".landing-h2-2", { opacity: 0 });
    })
    .fromTo(
      Text1.chars,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.inOut",
        stagger: 0.03,
      },
      "-=0.6"
    )
    .to({}, { duration: 3.5 });
}
