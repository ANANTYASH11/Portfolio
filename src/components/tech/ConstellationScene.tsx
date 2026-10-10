import React, { useRef, useMemo, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import gsap from "gsap";
import {
  CONSTELLATION_CONFIG,
  constellationsData,
  SkillNode,
} from "./constellationData";
import { Constellation } from "./Constellation";
import {
  nebulaVertexShader,
  nebulaFragmentShader,
  stardustVertexShader,
  stardustFragmentShader,
} from "./shaders";

interface ConstellationSceneProps {
  focusedConstellationId: string | null;
  selectedSkill?: SkillNode | null;
  onFocusConstellation: (id: string | null) => void;
  onSelectSkill: (skill: SkillNode | null) => void;
  onHoverSkillChange: (skill: SkillNode | null, screenPos?: { x: number; y: number } | null) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// 🌌 VOLUMETRIC NEBULA BACKGROUND PLANE
// ─────────────────────────────────────────────────────────────────────────────
const NebulaBackground: React.FC<{ mousePos: THREE.Vector2 }> = ({ mousePos }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uOpacity: { value: CONSTELLATION_CONFIG.nebulaOpacity },
    };
  }, []);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uMouse.value.lerp(mousePos, 0.05);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -14]}>
      <planeGeometry args={[44, 28]} />
      <shaderMaterial
        vertexShader={nebulaVertexShader}
        fragmentShader={nebulaFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ✨ 1,500+ DISTANT STARDUST PARTICLES (WITH DEPTH PARALLAX)
// ─────────────────────────────────────────────────────────────────────────────
const StardustField: React.FC<{ mousePos: THREE.Vector2 }> = ({ mousePos }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [geo, uniforms] = useMemo(() => {
    const count = CONSTELLATION_CONFIG.stardustCount;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const opacities = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color("#818cf8"), // Indigo
      new THREE.Color("#00f0ff"), // Cyan
      new THREE.Color("#f43f5e"), // Rose
      new THREE.Color("#ffffff"), // Pure Starlight
      new THREE.Color("#a855f7"), // Purple
      new THREE.Color("#38bdf8"), // Sky
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 36;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16 - 3;

      sizes[i] = Math.random() * 2.8 + 1.2;
      opacities[i] = Math.random() * 0.7 + 0.25;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    g.setAttribute("aOpacity", new THREE.BufferAttribute(opacities, 1));
    g.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));

    const u = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    };

    return [g, u];
  }, []);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uMouse.value.lerp(mousePos, 0.04);
  });

  return (
    <points ref={pointsRef} geometry={geo}>
      <shaderMaterial
        vertexShader={stardustVertexShader}
        fragmentShader={stardustFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 🌠 SHOOTING STAR (OCCASIONAL METEOR STREAK)
// ─────────────────────────────────────────────────────────────────────────────
const ShootingStar: React.FC = () => {
  const isShooting = useRef(false);
  const startPos = useRef(new THREE.Vector3());
  const velocity = useRef(new THREE.Vector3());
  const trailLength = useRef(2.5);
  const progress = useRef(0);

  const { lineMesh, geom, mat } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(6);
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const m = new THREE.LineBasicMaterial({
      color: "#a5f3fc",
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const lm = new THREE.Line(g, m);
    return { lineMesh: lm, geom: g, mat: m };
  }, []);

  useEffect(() => {
    let timeout: any;

    const scheduleNext = () => {
      const delay = Math.random() * 5000 + 4000;
      timeout = setTimeout(() => {
        startPos.current.set(
          (Math.random() - 0.5) * 18 - 4,
          Math.random() * 6 + 6,
          (Math.random() - 0.5) * 4
        );
        velocity.current.set(
          Math.random() * 12 + 10,
          -(Math.random() * 8 + 8),
          0
        );
        progress.current = 0;
        isShooting.current = true;
        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timeout);
  }, []);

  useFrame((_, delta) => {
    if (!isShooting.current) {
      mat.opacity = 0;
      return;
    }

    progress.current += delta * 1.6;
    if (progress.current > 1.2) {
      isShooting.current = false;
      mat.opacity = 0;
      return;
    }

    const currentHead = startPos.current
      .clone()
      .add(velocity.current.clone().multiplyScalar(progress.current));
    const currentTail = currentHead
      .clone()
      .sub(velocity.current.clone().normalize().multiplyScalar(trailLength.current));

    const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
    posAttr.setXYZ(0, currentHead.x, currentHead.y, currentHead.z);
    posAttr.setXYZ(1, currentTail.x, currentTail.y, currentTail.z);
    posAttr.needsUpdate = true;

    mat.opacity = Math.sin((progress.current / 1.2) * Math.PI) * 0.9;
  });

  return <primitive object={lineMesh} />;
};

// ─────────────────────────────────────────────────────────────────────────────
// 🔗 CROSS-CONSTELLATION CONNECTING ARCS
// ─────────────────────────────────────────────────────────────────────────────
const CrossConstellationArcs: React.FC<{
  hoveredSkill: SkillNode | null;
}> = ({ hoveredSkill }) => {
  const arcLines = useMemo(() => {
    if (!hoveredSkill || !hoveredSkill.relatedIds || hoveredSkill.relatedIds.length === 0) {
      return [];
    }

    let originWorld: THREE.Vector3 | null = null;
    const targets: { pos: THREE.Vector3; id: string }[] = [];

    constellationsData.forEach((c) => {
      c.skills.forEach((s) => {
        if (s.id === hoveredSkill.id) {
          originWorld = new THREE.Vector3(
            c.center[0] + s.pos[0],
            c.center[1] + s.pos[1],
            c.center[2] + s.pos[2]
          );
        }
      });
    });

    if (!originWorld) return [];

    constellationsData.forEach((c) => {
      c.skills.forEach((s) => {
        if (hoveredSkill.relatedIds?.includes(s.id)) {
          targets.push({
            id: s.id,
            pos: new THREE.Vector3(
              c.center[0] + s.pos[0],
              c.center[1] + s.pos[1],
              c.center[2] + s.pos[2]
            ),
          });
        }
      });
    });

    return targets.map((t) => {
      const mid = originWorld!.clone().add(t.pos).multiplyScalar(0.5);
      mid.z += 1.8;
      const curve = new THREE.QuadraticBezierCurve3(originWorld!, mid, t.pos);
      const points = curve.getPoints(40);
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: "#c084fc",
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
      });
      const lineMesh = new THREE.Line(geom, mat);
      return { lineMesh, id: t.id };
    });
  }, [hoveredSkill]);

  if (arcLines.length === 0) return null;

  return (
    <group>
      {arcLines.map((arc) => (
        <primitive key={arc.id} object={arc.lineMesh} />
      ))}
    </group>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 🎥 CAMERA RIG & FLIGHT TIMELINE (GSAP POWER3.INOUT)
// ─────────────────────────────────────────────────────────────────────────────
const CameraRig: React.FC<{
  focusedConstellationId: string | null;
  mousePos: THREE.Vector2;
}> = ({ focusedConstellationId, mousePos }) => {
  const { camera } = useThree();
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const targetConstellation = constellationsData.find(
      (c) => c.id === focusedConstellationId
    );

    let destPos: [number, number, number] = CONSTELLATION_CONFIG.cameraDefaultPos;
    let destFov = CONSTELLATION_CONFIG.cameraFov;
    let destLook = new THREE.Vector3(0, 0, 0);

    if (targetConstellation) {
      destPos = [
        targetConstellation.center[0],
        targetConstellation.center[1],
        targetConstellation.center[2] + 4.8,
      ];
      destFov = CONSTELLATION_CONFIG.flightFovPunch;
      destLook = new THREE.Vector3(...targetConstellation.center);
    }

    targetLookAt.current.copy(destLook);

    gsap.to(camera.position, {
      x: destPos[0],
      y: destPos[1],
      z: destPos[2],
      duration: CONSTELLATION_CONFIG.flightDuration,
      ease: "power3.inOut",
      overwrite: "auto",
    });

    const fovObj = { fov: (camera as THREE.PerspectiveCamera).fov };
    gsap.to(fovObj, {
      fov: destFov,
      duration: CONSTELLATION_CONFIG.flightDuration,
      ease: "power3.inOut",
      onUpdate: () => {
        (camera as THREE.PerspectiveCamera).fov = fovObj.fov;
        (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
      },
    });
  }, [focusedConstellationId, camera]);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime() * CONSTELLATION_CONFIG.driftSpeed;
    const parallaxX = (mousePos.x - 0.5) * CONSTELLATION_CONFIG.mouseParallax * 2.5;
    const parallaxY = (mousePos.y - 0.5) * CONSTELLATION_CONFIG.mouseParallax * 2.0;

    if (!focusedConstellationId) {
      camera.position.x += (Math.sin(t) * 0.4 + parallaxX - camera.position.x) * (delta * 2);
      camera.position.y += (Math.cos(t * 0.8) * 0.3 + parallaxY - camera.position.y) * (delta * 2);
    }

    currentLookAt.current.lerp(targetLookAt.current, delta * 3);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// 🌟 MAIN CONSTELLATION SCENE CONTENT
// ─────────────────────────────────────────────────────────────────────────────
const SceneContent: React.FC<{
  focusedConstellationId: string | null;
  onFocusConstellation: (id: string | null) => void;
  onSelectSkill: (skill: SkillNode | null) => void;
  onHoverSkillChange: (skill: SkillNode | null, screenPos?: { x: number; y: number } | null) => void;
}> = ({
  focusedConstellationId,
  onFocusConstellation,
  onSelectSkill,
  onHoverSkillChange,
}) => {
  const { camera, raycaster, gl } = useThree();
  const [hoveredSkill, setHoveredSkill] = useState<SkillNode | null>(null);
  const cursorWorldPos = useRef<THREE.Vector3>(new THREE.Vector3(999, 999, 999));
  const [shockwave, setShockwave] = useState<{ origin: THREE.Vector3; time: number } | null>(null);
  const mouseNorm = useRef(new THREE.Vector2(0.5, 0.5));
  const mouseScreen = useRef(new THREE.Vector2(0, 0));

  const relatedSkillIds = useMemo(() => {
    if (!hoveredSkill || !hoveredSkill.relatedIds) return [];
    return hoveredSkill.relatedIds;
  }, [hoveredSkill]);

  const planeZ = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);

  const handlePointerMove = useCallback(
    (e: any) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      mouseNorm.current.set((x + 1) * 0.5, (y + 1) * 0.5);
      mouseScreen.current.set(e.clientX, e.clientY);

      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      const intersectionPoint = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(planeZ, intersectionPoint)) {
        cursorWorldPos.current.copy(intersectionPoint);
      }
    },
    [camera, gl, raycaster, planeZ]
  );

  const handlePointerDown = useCallback(() => {
    setShockwave({ origin: cursorWorldPos.current.clone(), time: performance.now() });
  }, []);

  const handleHoverSkill = useCallback(
    (skill: SkillNode) => {
      setHoveredSkill(skill);
      onHoverSkillChange(skill, {
        x: mouseScreen.current.x,
        y: mouseScreen.current.y,
      });
    },
    [onHoverSkillChange]
  );

  const handleUnhoverSkill = useCallback(() => {
    setHoveredSkill(null);
    onHoverSkillChange(null);
  }, [onHoverSkillChange]);

  const handleClickSkill = useCallback(
    (skill: SkillNode) => {
      onSelectSkill(skill);
      const parent = constellationsData.find((c) =>
        c.skills.some((s) => s.id === skill.id)
      );
      if (parent) {
        onFocusConstellation(parent.id);
      }
    },
    [onSelectSkill, onFocusConstellation]
  );

  return (
    <>
      <CameraRig
        focusedConstellationId={focusedConstellationId}
        mousePos={mouseNorm.current}
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        maxPolarAngle={Math.PI / 2 + 0.35}
        minPolarAngle={Math.PI / 2 - 0.35}
        maxAzimuthAngle={0.45}
        minAzimuthAngle={-0.45}
      />

      <mesh
        position={[0, 0, 0]}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        visible={false}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial />
      </mesh>

      <NebulaBackground mousePos={mouseNorm.current} />
      <StardustField mousePos={mouseNorm.current} />
      <ShootingStar />
      <CrossConstellationArcs hoveredSkill={hoveredSkill} />

      {constellationsData.map((constellation) => (
        <Constellation
          key={constellation.id}
          data={constellation}
          hoveredSkillId={hoveredSkill?.id || null}
          relatedSkillIds={relatedSkillIds}
          focusedConstellationId={focusedConstellationId}
          cursorWorldPos={cursorWorldPos}
          shockwave={shockwave}
          onHoverSkill={handleHoverSkill}
          onUnhoverSkill={handleUnhoverSkill}
          onClickSkill={handleClickSkill}
          onFocusConstellation={onFocusConstellation}
        />
      ))}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 🌌 EXPORTED ROOT CONSTELLATION SCENE
// ─────────────────────────────────────────────────────────────────────────────
export const ConstellationScene: React.FC<ConstellationSceneProps> = ({
  focusedConstellationId,
  onFocusConstellation,
  onSelectSkill,
  onHoverSkillChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full select-none overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at center, #070314 0%, #03000a 100%)",
      }}
    >
      <Canvas
        camera={{
          position: CONSTELLATION_CONFIG.cameraDefaultPos,
          fov: CONSTELLATION_CONFIG.cameraFov,
          near: 0.1,
          far: 100,
        }}
        dpr={Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.5)}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        frameloop="always"
      >
        <SceneContent
          focusedConstellationId={focusedConstellationId}
          onFocusConstellation={onFocusConstellation}
          onSelectSkill={onSelectSkill}
          onHoverSkillChange={onHoverSkillChange}
        />
      </Canvas>
    </div>
  );
};
