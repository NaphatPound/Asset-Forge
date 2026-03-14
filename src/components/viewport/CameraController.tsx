import { useRef, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  orbitRef: React.RefObject<any>;
  focusTarget?: [number, number, number] | null;
}

export const CAMERA_PRESETS: Record<string, { position: [number, number, number]; target: [number, number, number] }> = {
  front: { position: [0, 3, 12], target: [0, 3, 0] },
  back: { position: [0, 3, -12], target: [0, 3, 0] },
  left: { position: [-12, 3, 0], target: [0, 3, 0] },
  right: { position: [12, 3, 0], target: [0, 3, 0] },
  top: { position: [0, 15, 0.01], target: [0, 0, 0] },
  isometric: { position: [8, 6, 8], target: [0, 2, 0] },
};

export default function CameraController({ orbitRef, focusTarget }: CameraControllerProps) {
  const { camera } = useThree();
  const internalRef = useRef<any>(null);
  const ref = orbitRef || internalRef;

  useEffect(() => {
    if (focusTarget && ref.current) {
      const target = new THREE.Vector3(...focusTarget);
      ref.current.target.copy(target);
      camera.position.set(
        focusTarget[0] + 4,
        focusTarget[1] + 3,
        focusTarget[2] + 4
      );
      ref.current.update();
    }
  }, [focusTarget, camera, ref]);

  return (
    <OrbitControls
      ref={ref}
      makeDefault
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.PAN,
        RIGHT: THREE.MOUSE.PAN,
      }}
      minDistance={1}
      maxDistance={50}
      enableDamping
      dampingFactor={0.1}
      target={[0, 2, 0]}
    />
  );
}
