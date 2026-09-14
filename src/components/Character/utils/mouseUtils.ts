import * as THREE from "three";

export const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

export const handleMouseMove = (
  event: MouseEvent,
  setMousePosition: (x: number, y: number) => void
) => {
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  setMousePosition(mouseX, mouseY);
};

export const handleTouchMove = (
  event: TouchEvent,
  setMousePosition: (x: number, y: number) => void
) => {
  if (event.touches.length > 0) {
    const mouseX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    setMousePosition(mouseX, mouseY);
  }
};

export const handleTouchEnd = (
  setMousePosition: (
    x: number,
    y: number
  ) => void
) => {
  setTimeout(() => {
    setMousePosition(0, 0);
  }, 1000);
};

// Smoothed orientation state stored in module scope so it stays fluid and never stutters
let curNeckX = 0.0;
let curNeckY = 0.0;
let curHeadX = -0.01;
let curHeadY = 0.0;
let curSpineY = 0.0;

export const resetHeadPosition = () => {
  curNeckX = 0.0;
  curNeckY = 0.0;
  curHeadX = -0.01;
  curHeadY = 0.0;
  curSpineY = 0.0;
};

export const handleHeadRotation = (
  headBone: THREE.Object3D | null,
  neckBone: THREE.Object3D | null,
  spineBone: THREE.Object3D | null,
  mouseX: number,
  mouseY: number,
  interpolation: number = 0.08
) => {
  if (window.scrollY < 300) {
    // Upright, straight, bold posture: neck upright (0.0), head level directly at camera eye-line (-0.01)
    const baseNeckX = 0.0;
    const baseHeadX = -0.01;

    // Interactive cursor tracking ranges (subtle & crisp around forward baseline)
    const maxRotY = 0.26; // ~15 deg horizontal range
    const maxRotX = 0.12; // ~7 deg vertical tilt

    const targetNeckX = baseNeckX - mouseY * (maxRotX * 0.25);
    const targetNeckY = mouseX * (maxRotY * 0.3);
    const targetHeadX = baseHeadX - mouseY * (maxRotX * 0.65);
    const targetHeadY = mouseX * (maxRotY * 0.65);
    const targetSpineY = mouseX * 0.04;

    curNeckX = lerp(curNeckX, targetNeckX, interpolation);
    curNeckY = lerp(curNeckY, targetNeckY, interpolation);
    curHeadX = lerp(curHeadX, targetHeadX, interpolation);
    curHeadY = lerp(curHeadY, targetHeadY, interpolation);
    curSpineY = lerp(curSpineY, targetSpineY, interpolation * 0.5);

    if (neckBone) {
      neckBone.rotation.x = curNeckX;
      neckBone.rotation.y = curNeckY;
      neckBone.rotation.z = 0;
    }

    if (headBone) {
      headBone.rotation.x = curHeadX;
      headBone.rotation.y = curHeadY;
      headBone.rotation.z = 0;
    }

    if (spineBone) {
      spineBone.rotation.y = curSpineY;
      spineBone.rotation.z = 0; // Firmly grounded; no air rolling or lateral sway
    }
  }
};



