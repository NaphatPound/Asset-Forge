import { useRef, useMemo } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useEditorStore } from '../../store/useEditorStore';
import { getBlockGeometry } from '../../blocks/blockDefinitions';

interface BlockMeshProps {
  blockId: string;
}

export default function BlockMesh({ blockId }: BlockMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const block = useEditorStore((s) => s.blocks.find((b) => b.id === blockId));
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const selectBlock = useEditorStore((s) => s.selectBlock);
  const isSelected = selectedBlockId === blockId;

  const geometry = useMemo(() => {
    if (!block) return null;
    return getBlockGeometry(block.type).clone();
  }, [block?.type]);

  if (!block || !block.visible || !geometry) return null;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!block.locked) {
      selectBlock(block.id);
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={block.position}
      rotation={block.rotation.map((r) => (r * Math.PI) / 180) as [number, number, number]}
      scale={block.scale}
      onClick={handleClick}
      geometry={geometry}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={block.color}
        metalness={block.metalness}
        roughness={block.roughness}
      />
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[geometry]} />
          <lineBasicMaterial color="#e94560" linewidth={2} />
        </lineSegments>
      )}
    </mesh>
  );
}
