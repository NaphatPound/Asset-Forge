import { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { ThreeEvent, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useEditorStore } from '../../store/useEditorStore';
import { getBlockGeometry } from '../../blocks/blockDefinitions';

const HANDLE_RADIUS = 0.2;
const HANDLE_GAP = 0.4;
const HIT_RADIUS = 0.45;
const AXIS_COLORS = ['#e94560', '#4ecdc4', '#45b7e9'];
const MIN_SCALE = 0.1;
const DRAG_SENSITIVITY = 4;

interface HandleProps {
  axis: number;
  direction: number;
  blockId: string;
  orbitRef: React.RefObject<any>;
}

function StretchHandle({ axis, direction, blockId, orbitRef }: HandleProps) {
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);

  const dragRef = useRef<{
    startScale: number;
    startPos: [number, number, number];
    startScreenX: number;
    startScreenY: number;
    screenAxis: [number, number]; // normalized 2D direction of the 3D axis on screen
  } | null>(null);

  const updateBlock = useEditorStore((s) => s.updateBlock);
  const saveSnapshot = useEditorStore((s) => s.saveSnapshot);
  const block = useEditorStore((s) => s.blocks.find((b) => b.id === blockId));
  const { camera, gl, size } = useThree();

  const bbox = useMemo(() => {
    if (!block) return new THREE.Box3(new THREE.Vector3(-0.5, -0.5, -0.5), new THREE.Vector3(0.5, 0.5, 0.5));
    const geo = getBlockGeometry(block.type);
    geo.computeBoundingBox();
    return geo.boundingBox!.clone();
  }, [block?.type]);

  // Project a 3D world point to 2D screen coordinates
  const toScreen = useCallback((worldPos: THREE.Vector3): [number, number] => {
    const v = worldPos.clone().project(camera);
    return [
      (v.x * 0.5 + 0.5) * size.width,
      (-v.y * 0.5 + 0.5) * size.height,
    ];
  }, [camera, size]);

  // Get the world-space axis direction
  const getWorldAxis = useCallback((): THREE.Vector3 => {
    if (!block) return new THREE.Vector3(1, 0, 0);
    const rot = block.rotation.map((r) => (r * Math.PI) / 180);
    const euler = new THREE.Euler(rot[0], rot[1], rot[2], 'XYZ');
    const dir = new THREE.Vector3(0, 0, 0);
    dir.setComponent(axis, direction);
    dir.applyEuler(euler).normalize();
    return dir;
  }, [block?.rotation[0], block?.rotation[1], block?.rotation[2], axis, direction]);

  // Compute 2D screen direction of the 3D axis
  const getScreenAxis = useCallback((): [number, number] => {
    if (!block) return [1, 0];
    const origin = new THREE.Vector3(...block.position);
    const worldAxis = getWorldAxis();
    const end = origin.clone().add(worldAxis);

    const [sx1, sy1] = toScreen(origin);
    const [sx2, sy2] = toScreen(end);

    let dx = sx2 - sx1;
    let dy = sy2 - sy1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 0.001) return [1, 0];
    return [dx / len, dy / len];
  }, [block?.position, getWorldAxis, toScreen]);

  const applyDrag = useCallback((screenX: number, screenY: number) => {
    if (!dragRef.current || !block) return;

    const { startScale, startPos, startScreenX, startScreenY, screenAxis } = dragRef.current;

    // Mouse delta in screen pixels
    const dx = screenX - startScreenX;
    const dy = screenY - startScreenY;

    // Project mouse delta onto the screen-space axis direction
    const projected = dx * screenAxis[0] + dy * screenAxis[1];

    // Convert pixel delta to scale delta
    const delta = projected / (size.width * 0.5) * DRAG_SENSITIVITY * (camera as any).position?.length?.() || projected / 100;

    const newScale: [number, number, number] = [...block.scale];
    newScale[axis] = Math.max(MIN_SCALE, startScale + delta);

    // Shift position so opposite face stays fixed
    const scaleDiff = newScale[axis] - startScale;
    const posShift = (scaleDiff / 2) * direction;

    const rot = block.rotation.map((r) => (r * Math.PI) / 180);
    const euler = new THREE.Euler(rot[0], rot[1], rot[2], 'XYZ');
    const offset = new THREE.Vector3(0, 0, 0);
    offset.setComponent(axis, posShift);
    offset.applyEuler(euler);

    const newPos: [number, number, number] = [
      startPos[0] + offset.x,
      startPos[1] + offset.y,
      startPos[2] + offset.z,
    ];

    updateBlock(blockId, { scale: newScale, position: newPos });
  }, [block, axis, direction, blockId, updateBlock, size, camera]);

  // Mouse move & up on the DOM for reliable dragging
  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: PointerEvent) => {
      applyDrag(e.clientX, e.clientY);
    };

    const onUp = () => {
      setDragging(false);
      dragRef.current = null;
      if (orbitRef.current) orbitRef.current.enabled = true;
      document.body.style.cursor = '';
      saveSnapshot();
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [dragging, applyDrag, orbitRef, saveSnapshot]);

  if (!block) return null;

  // Handle position in parent-local space (rotated, not scaled)
  const extent = direction > 0
    ? bbox.max.getComponent(axis) * block.scale[axis]
    : bbox.min.getComponent(axis) * block.scale[axis];
  const localPos: [number, number, number] = [0, 0, 0];
  localPos[axis] = extent + HANDLE_GAP * direction;

  const color = AXIS_COLORS[axis];

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setDragging(true);
    if (orbitRef.current) orbitRef.current.enabled = false;
    document.body.style.cursor = 'grabbing';

    dragRef.current = {
      startScale: block.scale[axis],
      startPos: [...block.position],
      startScreenX: e.nativeEvent.clientX,
      startScreenY: e.nativeEvent.clientY,
      screenAxis: getScreenAxis(),
    };
  };

  // Cone rotation pointing outward along axis
  const coneRot: [number, number, number] =
    axis === 0 ? [0, 0, direction > 0 ? -Math.PI / 2 : Math.PI / 2] :
    axis === 1 ? [0, 0, direction > 0 ? 0 : Math.PI] :
                 [direction > 0 ? Math.PI / 2 : -Math.PI / 2, 0, 0];

  const scale = hovered || dragging ? 1.5 : 1;

  return (
    <group position={localPos}>
      {/* Visible cone arrow */}
      <mesh rotation={coneRot} renderOrder={999}>
        <coneGeometry args={[HANDLE_RADIUS * scale, HANDLE_RADIUS * 2.5 * scale, 8]} />
        <meshBasicMaterial
          color={dragging ? '#ffffff' : color}
          opacity={hovered || dragging ? 1 : 0.8}
          transparent
          depthTest={false}
        />
      </mesh>
      {/* Large invisible hit sphere */}
      <mesh
        onPointerDown={onPointerDown}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'grab'; }}
        onPointerOut={() => { setHovered(false); if (!dragging) document.body.style.cursor = ''; }}
      >
        <sphereGeometry args={[HIT_RADIUS, 8, 8]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}

interface StretchHandlesProps {
  blockId: string;
  orbitRef: React.RefObject<any>;
}

export default function StretchHandles({ blockId, orbitRef }: StretchHandlesProps) {
  const block = useEditorStore((s) => s.blocks.find((b) => b.id === blockId));
  if (!block || !block.visible || block.locked) return null;

  const rotation = block.rotation.map((r) => (r * Math.PI) / 180) as [number, number, number];

  return (
    <group position={block.position} rotation={rotation}>
      {[0, 1, 2].map((ax) => (
        <group key={ax}>
          <StretchHandle axis={ax} direction={1} blockId={blockId} orbitRef={orbitRef} />
          <StretchHandle axis={ax} direction={-1} blockId={blockId} orbitRef={orbitRef} />
        </group>
      ))}
    </group>
  );
}
