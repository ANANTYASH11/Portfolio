import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const setCharacter = (camera: THREE.PerspectiveCamera) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const setupCharacter = (gltf: GLTF) => {
    const character = gltf.scene;
    character.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.frustumCulled = false;
      }
    });
    setCharTimeline(character, camera);
    setAllTimeline();
    const footR =
      character.getObjectByName("footR") ||
      character.getObjectByName("foot.R");
    const footL =
      character.getObjectByName("footL") ||
      character.getObjectByName("foot.L");
    if (footR) footR.position.y = 3.36;
    if (footL) footL.position.y = 3.36;
    dracoLoader.dispose();
  };

  const loadCharacter = () => {
    return new Promise<GLTF | null>((resolve, reject) => {
      loader.load(
        "/models/character.glb",
        (gltf) => {
          setupCharacter(gltf);
          resolve(gltf);
        },
        undefined,
        () => {
          // Fallback to encrypted model if character.glb fails
          decryptFile("/models/character.enc", "Character3D#@")
            .then((encryptedBlob) => {
              const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));
              loader.load(
                blobUrl,
                (gltf) => {
                  setupCharacter(gltf);
                  resolve(gltf);
                },
                undefined,
                reject
              );
            })
            .catch(reject);
        }
      );
    });
  };

  return { loadCharacter };
};

export default setCharacter;
