import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { SkillNode, CONSTELLATION_CONFIG } from "./constellationData";
import { starGlowVertexShader, starGlowFragmentShader } from "./shaders";

interface StarProps {
  skill: SkillNode;
  categoryHue: string;
  clusterCenter: [number, number, number];
  isHovered: boolean;
  isRelated: boolean;
  isFocusedCluster: boolean;
  cursorWorldPos?: React.MutableRefObject<THREE.Vector3> | THREE.Vector3 | null;
  shockwave?: { origin: THREE.Vector3; time: number } | null;
  onHover: (skill: SkillNode, event?: any) => void;
  onUnhover: () => void;
  onClick: (skill: SkillNode) => void;
}

export const Star: React.FC<StarProps> = ({
  skill,
  categoryHue,
  clusterCenter,
  isHovered,
  isRelated,
  isFocusedCluster,
  cursorWorldPos,
  shockwave,
  onHover,
  onUnhover,
  onClick,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  // Compute anchor position in world coordinates
  const anchorPos = useMemo(() => {
    return new THREE.Vector3(
      clusterCenter[0] + skill.pos[0],
      clusterCenter[1] + skill.pos[1],
      clusterCenter[2] + skill.pos[2]
    );
  }, [clusterCenter, skill.pos]);

  // Physics dynamic offset for gravity & shockwave
  const currentOffset = useRef(new THREE.Vector3(0, 0, 0));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const ringScale = useRef(0.1);
  const ringOpacity = useRef(0);

  // Base sizing based on skill level (1, 2, 3)
  const baseSize = useMemo(() => {
    switch (skill.level) {
      case 1:
        return 0.28;
      case 2:
        return 0.38;
      case 3:
      default:
        return 0.48;
    }
  }, [skill.level]);

  const baseIntensity = useMemo(() => {
    return (
      0.9 +
      skill.level * 0.35 +
      (skill.isPrimary ? 0.4 : 0) +
      (isFocusedCluster ? 0.3 : 0)
    );
  }, [skill.level, skill.isPrimary, isFocusedCluster]);

  // Color objects
  const threeColor = useMemo(() => new THREE.Color(categoryHue), [categoryHue]);

  // Custom Shader Material uniforms
  const uniforms = useMemo(() => {
    return {
      uColor: { value: threeColor },
      uIntensity: { value: baseIntensity },
      uHover: { value: 0.0 },
      uPulse: { value: 0.0 },
    };
  }, [threeColor, baseIntensity]);

  // Listen to shockwave events
  const lastHandledShockwaveTime = useRef<number>(0);
  if (shockwave && shockwave.time > lastHandledShockwaveTime.current) {
    lastHandledShockwaveTime.current = shockwave.time;
    const currentWorld = anchorPos.clone().add(currentOffset.current);
    const diff = currentWorld.clone().sub(shockwave.origin);
    const dist = diff.length();
    if (dist < 8.0 && dist > 0.05) {
      const force = (CONSTELLATION_CONFIG.shockwaveForce / (dist * dist + 1.2)) * 0.8;
      velocity.current.add(diff.normalize().multiplyScalar(force));
    }
  }

  // Animation & Physics Frame Loop
  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return;

    const time = clock.getElapsedTime();
    const dt = Math.min(delta, 0.05);

    // 1. Slow pulse for "Primary" stars
    let pulseVal = 0;
    if (skill.isPrimary) {
      pulseVal = Math.sin(time * CONSTELLATION_CONFIG.pulseSpeed + anchorPos.x * 2.0) * 0.5 + 0.5;
      uniforms.uPulse.value = pulseVal;
    }

    // 2. Hover / Related Bloom lerp
    const targetHover = isHovered ? 1.0 : isRelated ? 0.65 : 0.0;
    uniforms.uHover.value = THREE.MathUtils.lerp(uniforms.uHover.value, targetHover, dt * 10);

    // 3. Hover ripple ring expansion
    if (ringRef.current) {
      if (isHovered) {
        ringScale.current += dt * 3.5;
        if (ringScale.current > 3.0) {
          ringScale.current = 0.4;
        }
        ringOpacity.current = Math.max(0, 1.0 - ringScale.current / 3.0);
        ringRef.current.scale.set(ringScale.current, ringScale.current, 1);
        ringRef.current.visible = true;
        (ringRef.current.material as THREE.MeshBasicMaterial).opacity = ringOpacity.current * 0.75;
      } else {
        ringRef.current.visible = false;
        ringScale.current = 0.4;
      }
    }

    // 4. Cursor Gravity Pull
    let targetGravityOffset = new THREE.Vector3(0, 0, 0);
    const pos = cursorWorldPos && "current" in cursorWorldPos ? cursorWorldPos.current : cursorWorldPos;
    if (pos) {
      const currentWorld = anchorPos.clone().add(currentOffset.current);
      const toCursor = pos.clone().sub(currentWorld);
      toCursor.z = 0; // limit pull on xy plane
      const dist = toCursor.length();
      if (dist < CONSTELLATION_CONFIG.gravityRadius && dist > 0.05) {
        const pull = (1.0 - dist / CONSTELLATION_CONFIG.gravityRadius) * CONSTELLATION_CONFIG.gravityPull;
        targetGravityOffset = toCursor.normalize().multiplyScalar(pull);
      }
    }

    // 5. Spring-Damper Settle for Shockwave & Gravity
    // Spring force pulling currentOffset back to targetGravityOffset
    const springForce = targetGravityOffset.sub(currentOffset.current).multiplyScalar(18.0);
    velocity.current.add(springForce.multiplyScalar(dt));
    // Damping
    velocity.current.multiplyScalar(Math.pow(CONSTELLATION_CONFIG.shockwaveDamping, dt * 60));
    // Apply velocity
    currentOffset.current.add(velocity.current.clone().multiplyScalar(dt));

    // Update Mesh world position
    const finalPos = anchorPos.clone().add(currentOffset.current);
    meshRef.current.position.copy(finalPos);

    // Dynamic scale (hover expands star)
    const scaleFactor = 1.0 + uniforms.uHover.value * 0.7 + pulseVal * 0.15;
    meshRef.current.scale.set(baseSize * scaleFactor, baseSize * scaleFactor, baseSize * scaleFactor);
  });

  return (
    <group>
      {/* Interactive Glowing Star Plane (Always faces camera) */}
      <mesh
        ref={meshRef}
        position={anchorPos}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(skill, e);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onUnhover();
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick(skill);
        }}
      >
        <planeGeometry args={[1.5, 1.5]} />
        <shaderMaterial
          vertexShader={starGlowVertexShader}
          fragmentShader={starGlowFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />

        {/* Inner intense white-hot core sphere */}
        <mesh ref={coreRef} position={[0, 0, 0.02]}>
          <circleGeometry args={[0.09, 16]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.95}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Hover expanding ripple ring */}
        <mesh ref={ringRef} position={[0, 0, 0.01]} visible={false}>
          <ringGeometry args={[0.3, 0.38, 32]} />
          <meshBasicMaterial
            color={categoryHue}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </mesh>
    </group>
  );
};
