import * as THREE from "three";
import { RGBELoader } from "three-stdlib";
import { gsap } from "gsap";

const setLighting = (scene: THREE.Scene) => {
  // Key Light (Violet/Lavender)
  const keyLight = new THREE.DirectionalLight(0xd8b4fe, 0);
  keyLight.position.set(2.5, 5, 4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 50;
  keyLight.shadow.bias = -0.0005;
  scene.add(keyLight);

  // Rim / Kicker Light (Electric Cyan) from behind for cyber edge highlights
  const rimLight = new THREE.DirectionalLight(0x06b6d4, 0);
  rimLight.position.set(-3.5, 4.5, -3);
  scene.add(rimLight);

  // Soft Ambient Fill Light (Deep Indigo) for rich contrast
  const fillLight = new THREE.AmbientLight(0x1e1838, 0);
  scene.add(fillLight);

  // Dynamic Point Light tied to laptop screen
  const pointLight = new THREE.PointLight(0xc2a4ff, 0, 100, 2.5);
  pointLight.position.set(3, 12, 4);
  pointLight.castShadow = true;
  scene.add(pointLight);

  new RGBELoader()
    .setPath("/models/")
    .load("char_enviorment.hdr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0;
      scene.environmentRotation.set(5.76, 85.85, 1);
    });

  function setPointLight(screenLight: any) {
    if (screenLight && screenLight.material && screenLight.material.opacity > 0.9) {
      pointLight.intensity = screenLight.material.emissiveIntensity * 22;
    } else {
      pointLight.intensity = 0;
    }
  }

  const duration = 2.2;
  const ease = "power2.inOut";

  function turnOnLights() {
    gsap.to(scene, {
      environmentIntensity: 0.75,
      duration: duration,
      ease: ease,
    });
    gsap.to(keyLight, {
      intensity: 1.6,
      duration: duration,
      ease: ease,
    });
    gsap.to(rimLight, {
      intensity: 1.8,
      duration: duration,
      ease: ease,
    });
    gsap.to(fillLight, {
      intensity: 0.9,
      duration: duration,
      ease: ease,
    });
    gsap.to(".character-rim", {
      y: "55%",
      opacity: 1,
      delay: 0.2,
      duration: 2,
    });
  }

  return { setPointLight, turnOnLights };
};

export default setLighting;

