import { useRef, useMemo, useEffect, useCallback } from 'react';
import { ThreeEvent, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEditorStore } from '../../store/useEditorStore';
import { getBlockGeometry } from '../../blocks/blockDefinitions';
import { ensureUVs } from '../../utils/uvUnwrap';
import { paintOnCanvas, getPaintTexture, hasPaintData } from '../../utils/texturePaint';

interface BlockMeshProps {
  blockId: string;
}

export default function BlockMesh({ blockId }: BlockMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const block = useEditorStore((s) => s.blocks.find((b) => b.id === blockId));
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const selectBlock = useEditorStore((s) => s.selectBlock);
  const paintSettings = useEditorStore((s) => s.paintSettings);
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const transformMode = useEditorStore((s) => s.transformMode);
  const selectedGroupId = useEditorStore((s) => s.selectedGroupId);
  const selectGroup = useEditorStore((s) => s.selectGroup);
  const isSelected = selectedBlockId === blockId;
  const isGroupSelected = block?.groupId ? block.groupId === selectedGroupId : false;
  const isHighlighted = isSelected || isGroupSelected;
  const isStretchMode = transformMode === 'stretch';
  const isPaintingRef = useRef(false);
  const raycasterRef = useRef(new THREE.Raycaster());
  const { camera, gl } = useThree();

  const geometry = useMemo(() => {
    if (!block) return null;
    const geo = getBlockGeometry(block.type).clone();
    ensureUVs(geo, 1);
    return geo;
  }, [block?.type]);

  // Raycast from screen position to find UV on this mesh
  const raycastForUV = useCallback((clientX: number, clientY: number): THREE.Vector2 | null => {
    const mesh = meshRef.current;
    if (!mesh || !geometry) return null;

    const rect = gl.domElement.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(new THREE.Vector2(x, y), camera);
    const hits = raycasterRef.current.intersectObject(mesh, false);

    if (hits.length > 0 && hits[0].uv) {
      return hits[0].uv;
    }
    return null;
  }, [camera, gl, geometry]);

  const doPaint = useCallback((clientX: number, clientY: number) => {
    const store = useEditorStore.getState();
    const ps = store.paintSettings;
    const blk = store.blocks.find((b) => b.id === blockId);
    if (!blk) return;

    const uv = raycastForUV(clientX, clientY);
    if (!uv) return;

    if (!blk.hasPaintData) {
      updateBlock(blockId, { hasPaintData: true });
    }
    paintOnCanvas(blockId, uv.x, uv.y, ps.brushSize, ps.brushColor, ps.brushOpacity);
  }, [blockId, raycastForUV, updateBlock]);

  // DOM-level paint events for reliable continuous painting
  useEffect(() => {
    if (!paintSettings.enabled || !isSelected) return;

    const canvas = gl.domElement;

    const onMove = (e: PointerEvent) => {
      if (!isPaintingRef.current) return;
      doPaint(e.clientX, e.clientY);
    };

    const onUp = () => {
      isPaintingRef.current = false;
    };

    canvas.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      canvas.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [paintSettings.enabled, isSelected, gl, doPaint]);

  // Keep paint texture updated every frame
  useFrame(() => {
    if (matRef.current && hasPaintData(blockId)) {
      const tex = getPaintTexture(blockId);
      matRef.current.map = tex;
      matRef.current.needsUpdate = true;
      tex.needsUpdate = true;
    }
  });

  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!block || block.locked) return;

    if (paintSettings.enabled && isSelected) {
      e.stopPropagation();
      isPaintingRef.current = true;
      doPaint(e.nativeEvent.clientX, e.nativeEvent.clientY);
    } else {
      e.stopPropagation();
      // Double-click or shift-click selects the group
      if (e.nativeEvent.shiftKey && block.groupId) {
        selectGroup(block.groupId);
      } else {
        selectBlock(block.id);
      }
    }
  }, [block, paintSettings.enabled, isSelected, blockId, selectBlock, selectGroup, doPaint]);

  if (!block || !block.visible || !geometry) return null;

  const materialProps: any = {
    color: block.color,
    metalness: block.metalness,
    roughness: block.roughness,
  };

  // Paint canvas is the single texture source (auto-textures are baked into it)
  const hasPaint = block.hasPaintData || hasPaintData(blockId);

  // If there's paint data, apply it as the main texture map
  if (hasPaint) {
    const paintTex = getPaintTexture(blockId);
    materialProps.map = paintTex;
  }

  return (
    <group
      position={block.position}
      rotation={block.rotation.map((r) => (r * Math.PI) / 180) as [number, number, number]}
      scale={block.scale}
    >
      <mesh
        ref={meshRef}
        geometry={geometry}
        onPointerDown={isStretchMode ? undefined : handlePointerDown}
        raycast={isStretchMode && isSelected ? () => {} : undefined}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          key={`mat_${hasPaint ? 'painted' : 'solid'}`}
          ref={matRef}
          {...materialProps}
        />
        {isHighlighted && (
          <lineSegments>
            <edgesGeometry args={[geometry]} />
            <lineBasicMaterial color={isSelected ? '#e94560' : '#4ecdc4'} linewidth={2} />
          </lineSegments>
        )}
      </mesh>
    </group>
  );
}
