import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { ConstellationData, SkillNode } from "./constellationData";
import { Star } from "./Star";

interface ConstellationProps {
  data: ConstellationData;
  hoveredSkillId: string | null;
  relatedSkillIds: string[];
  focusedConstellationId: string | null;
  cursorWorldPos?: React.MutableRefObject<THREE.Vector3> | THREE.Vector3 | null;
  shockwave?: { origin: THREE.Vector3; time: number } | null;
  onHoverSkill: (skill: SkillNode, event?: any) => void;
  onUnhoverSkill: () => void;
  onClickSkill: (skill: SkillNode) => void;
  onFocusConstellation: (constellationId: string) => void;
}

export const Constellation: React.FC<ConstellationProps> = ({
  data,
  hoveredSkillId,
  relatedSkillIds,
  focusedConstellationId,
  cursorWorldPos,
  shockwave,
  onHoverSkill,
  onUnhoverSkill,
  onClickSkill,
  onFocusConstellation,
}) => {
  const lineMeshRef = useRef<THREE.LineSegments>(null);
  const isFocused = focusedConstellationId === data.id;

  // Check if any star in this constellation is hovered
  const isClusterActive = useMemo(() => {
    if (isFocused) return true;
    if (!hoveredSkillId) return false;
    return data.skills.some((s) => s.id === hoveredSkillId);
  }, [data.skills, hoveredSkillId, isFocused]);

  // Build connecting lines buffer geometry from constellation edges
  const lineGeometry = useMemo(() => {
    const positions: number[] = [];
    data.edges.forEach(([startIdx, endIdx]) => {
      const s1 = data.skills[startIdx];
      const s2 = data.skills[endIdx];
      if (s1 && s2) {
        positions.push(
          data.center[0] + s1.pos[0],
          data.center[1] + s1.pos[1],
          data.center[2] + s1.pos[2],
          data.center[0] + s2.pos[0],
          data.center[1] + s2.pos[1],
          data.center[2] + s2.pos[2]
        );
      }
    });

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geom;
  }, [data]);

  // Smooth opacity lerp for constellation lines
  const currentOpacity = useRef(0.22);
  useFrame((_, delta) => {
    if (!lineMeshRef.current) return;
    const targetOpacity = isClusterActive ? 0.75 : 0.22;
    currentOpacity.current = THREE.MathUtils.lerp(
      currentOpacity.current,
      targetOpacity,
      Math.min(delta * 8, 0.2)
    );
    const mat = lineMeshRef.current.material as THREE.LineBasicMaterial;
    if (mat) {
      mat.opacity = currentOpacity.current;
    }
  });

  // Calculate highest point for label positioning
  const labelPos = useMemo(() => {
    let maxY = -Infinity;
    data.skills.forEach((s) => {
      if (s.pos[1] > maxY) maxY = s.pos[1];
    });
    return [
      data.center[0],
      data.center[1] + (maxY > 0 ? maxY + 0.65 : 1.4),
      data.center[2],
    ] as [number, number, number];
  }, [data]);

  return (
    <group>
      {/* ─── 1. Constellation Interconnecting Lines ─── */}
      <lineSegments ref={lineMeshRef} geometry={lineGeometry}>
        <lineBasicMaterial
          color={data.hue}
          transparent
          opacity={0.22}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* ─── 2. All Skill Stars in Cluster ─── */}
      {data.skills.map((skill) => {
        const isHovered = hoveredSkillId === skill.id;
        const isRelated = relatedSkillIds.includes(skill.id);

        return (
          <Star
            key={skill.id}
            skill={skill}
            categoryHue={data.hue}
            clusterCenter={data.center}
            isHovered={isHovered}
            isRelated={isRelated}
            isFocusedCluster={isFocused}
            cursorWorldPos={cursorWorldPos}
            shockwave={shockwave}
            onHover={onHoverSkill}
            onUnhover={onUnhoverSkill}
            onClick={() => onClickSkill(skill)}
          />
        );
      })}

      {/* ─── 3. Shimmering 3D Category Floating Label ─── */}
      <Html
        position={labelPos}
        center
        distanceFactor={18}
        zIndexRange={[100, 0]}
        style={{ pointerEvents: "auto" }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFocusConstellation(data.id);
          }}
          className="group relative cursor-pointer select-none rounded-full px-3 py-1 text-xs font-medium tracking-wider backdrop-blur-md transition-all duration-300"
          style={{
            background: isClusterActive
              ? `rgba(${parseInt(data.hue.slice(1, 3), 16)}, ${parseInt(
                  data.hue.slice(3, 5),
                  16
                )}, ${parseInt(data.hue.slice(5, 7), 16)}, 0.22)`
              : "rgba(15, 10, 30, 0.45)",
            border: `1px solid ${
              isClusterActive ? data.hue : "rgba(255, 255, 255, 0.12)"
            }`,
            color: isClusterActive ? "#ffffff" : "rgba(226, 232, 240, 0.75)",
            boxShadow: isClusterActive
              ? `0 0 20px ${data.hue}55, inset 0 0 10px ${data.hue}33`
              : "0 4px 12px rgba(0,0,0,0.4)",
          }}
          title={`Focus ${data.category} constellation`}
        >
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full transition-transform group-hover:scale-150"
              style={{ backgroundColor: data.hue }}
            />
            {data.category}
          </span>
        </button>
      </Html>
    </group>
  );
};
