import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    if (!canvasDiv.current) return;
    let isMounted = true;

    // Clear canvas container DOM elements
    canvasDiv.current.innerHTML = "";

    const scene = new THREE.Scene();
    const rect = canvasDiv.current.getBoundingClientRect();
    const container = { width: rect.width || window.innerWidth, height: rect.height || window.innerHeight };
    const aspect = container.width / container.height;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.width, container.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    // Append inner hover container and canvas renderer
    const hoverDiv = document.createElement("div");
    hoverDiv.className = "character-hover";
    canvasDiv.current.appendChild(hoverDiv);
    canvasDiv.current.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.set(0, 13.5, 30);
    camera.zoom = 0.95;
    camera.updateProjectionMatrix();

    let screenLight: any | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    const clock = new THREE.Clock();

    const light = setLighting(scene);
    const progress = setProgress((value) => setLoading(value));
    const { loadCharacter } = setCharacter(camera);

    let cleanupResize: (() => void) | null = null;

    loadCharacter()
      .then((gltf) => {
        if (!isMounted || !gltf) return;

        // Clear any prior objects to guarantee exactly ONE character in scene
        scene.clear();

        const characterInstance = gltf.scene;
        scene.add(characterInstance);

        const animations = setAnimations(gltf);
        animations.hover(gltf, hoverDiv);
        mixer = animations.mixer;

        screenLight = characterInstance.getObjectByName("screenlight") || null;
        light.turnOnLights();
        animations.startIntro();
        mixer.update(0.01);
        renderer.render(scene, camera);
        progress.loaded();

        let resizeTimer: ReturnType<typeof setTimeout>;
        const debouncedResize = () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            if (isMounted) {
              handleResize(renderer, camera, canvasDiv, characterInstance);
            }
          }, 200);
        };
        window.addEventListener("resize", debouncedResize);

        cleanupResize = () => {
          clearTimeout(resizeTimer);
          window.removeEventListener("resize", debouncedResize);
        };
      })
      .catch((err) => {
        console.error("Error loading character model:", err);
        progress.clear();
      });

    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );

    if (canvasDiv.current) {
      observer.observe(canvasDiv.current);
    }

    let animFrameId: number;
    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      if (screenLight) {
        light.setPointLight(screenLight);
      }
      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      isMounted = false;
      cancelAnimationFrame(animFrameId);
      observer.disconnect();
      cleanupResize?.();
      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss();
      if (canvasDiv.current) {
        canvasDiv.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="character-container">
      <div className="character-model">
        <div className="character-rim"></div>
        <div
          style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
          ref={canvasDiv}
        ></div>
      </div>
    </div>
  );
};

export default Scene;
