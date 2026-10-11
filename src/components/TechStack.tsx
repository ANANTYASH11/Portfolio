import * as THREE from "three";
import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import { FiChevronDown, FiCpu as FiCpuIcon } from "react-icons/fi";
import TechVaultBack from "./tech/TechVaultBack";
import "./styles/TechStack.css";
import "./certificates/tokens.css";

const textureLoader = new THREE.TextureLoader();
const imageUrls = [
  "/images/react2.webp",
  "/images/next2.webp",
  "/images/node2.webp",
  "/images/express.webp",
  "/images/mongo.webp",
  "/images/mysql.webp",
  "/images/typescript.webp",
  "/images/javascript.webp",
];
const textures = imageUrls.map((url) => textureLoader.load(url));

const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);

const spheres = [...Array(14)].map(() => ({
  scale: [0.8, 1, 0.9][Math.floor(Math.random() * 3)],
}));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive || !api.current) return;
    delta = Math.min(0.05, delta);
    const impulse = vec
      .copy(api.current.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -40 * delta * scale,
          -120 * delta * scale,
          -40 * delta * scale
        )
      );

    api.current.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(15), r(15) - 20, r(15) - 8]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive || !ref.current) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDetailedOpen, setIsDetailedOpen] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const materials = useMemo(() => {
    return textures.map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.15,
          metalness: 0.15,
          roughness: 0.18,
          clearcoat: 1.0,
          clearcoatRoughness: 0.08,
          reflectivity: 0.95,
        })
    );
  }, []);

  const handleToggleDetailed = useCallback(() => {
    setIsDetailedOpen((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          document
            .getElementById("detailed-tech-stack")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
      return next;
    });
  }, []);

  // Keyboard Escape listener to close details
  useEffect(() => {
    if (!isDetailedOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsDetailedOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDetailedOpen]);

  return (
    <div className="techstack" ref={containerRef}>
      <div className="techstack-header">
        <h2>My Techstack</h2>
        <p className="techstack-subtitle">
          Interactive Physics Engine · Interact with tech nodes
        </p>
      </div>

      <Canvas
        shadows={false}
        gl={{
          alpha: true,
          stencil: false,
          depth: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
        className="tech-canvas"
        style={{ height: "calc(var(--vh, 100vh) - 60px)", minHeight: "560px", width: "100%", display: "block" }}
        frameloop={isVisible ? "always" : "never"}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 15, 10]} intensity={2.0} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={1.4} color="#06b6d4" />
        <pointLight position={[0, 0, 10]} intensity={1.8} color="#c2a4ff" />
        <Physics gravity={[0, 0, 0]} paused={!isVisible}>
          <Pointer isActive={isVisible} />
          {spheres.map((props, i) => (
            <SphereGeo
              key={i}
              {...props}
              material={materials[i % materials.length]}
              isActive={isVisible}
            />
          ))}
        </Physics>
        <Environment
          files="/models/char_enviorment.hdr"
          environmentIntensity={0.65}
        />
      </Canvas>

      {/* ─── Detailed Tech Stack (Tech Vault Honeycomb Album) ─── */}
      <div className="tech-toggle-bar" id="detailed-tech-stack">
        <button
          type="button"
          className={`tech-enchanted-toggle ${isDetailedOpen ? "open" : ""}`}
          onClick={handleToggleDetailed}
          data-cursor="disable"
          aria-expanded={isDetailedOpen}
          aria-controls="tech-vault-portal"
        >
          <span className="toggle-chip-icon">
            <FiCpuIcon />
          </span>
          <span className="toggle-btn-label">
            {isDetailedOpen ? "Hide Details of Tech Stack" : "View Details of Tech Stack"}
          </span>
          <FiChevronDown
            className={`toggle-chevron-icon ${isDetailedOpen ? "rotated" : ""}`}
          />
        </button>
      </div>

      <div
        className={`tech-collapsible-wrapper ${
          isDetailedOpen ? "open" : "collapsed"
        }`}
      >
        <div className="tech-vault-embedded-stage">
          <TechVaultBack
            isOpen={isDetailedOpen}
            onClose={() => setIsDetailedOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default TechStack;
