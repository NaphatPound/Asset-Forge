import { useEffect, useRef } from 'react';
import { TransformControls } from '@react-three/drei';
import { useEditorStore } from '../../store/useEditorStore';
import * as THREE from 'three';

interface GizmoControlsProps {
  orbitRef: React.RefObject<any>;
}

export default function GizmoControls({ orbitRef }: GizmoControlsProps) {
  const transformRef = useRef<any>(null);
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const blocks = useEditorStore((s) => s.blocks);
  const transformMode = useEditorStore((s) => s.transformMode);
  const gridSnap = useEditorStore((s) => s.gridSnap);
  const gridSize = useEditorStore((s) => s.gridSize);
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const saveSnapshot = useEditorStore((s) => s.saveSnapshot);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  useEffect(() => {
    const controls = transformRef.current;
    if (!controls) return;

    const syncTransform = () => {
      if (!selectedBlock) return;
      const obj = controls.object as THREE.Object3D;
      if (!obj) return;
      updateBlock(selectedBlock.id, {
        position: [obj.position.x, obj.position.y, obj.position.z],
        rotation: [
          (obj.rotation.x * 180) / Math.PI,
          (obj.rotation.y * 180) / Math.PI,
          (obj.rotation.z * 180) / Math.PI,
        ],
        scale: [obj.scale.x, obj.scale.y, obj.scale.z],
      });
    };

    const onDraggingChanged = (event: { value: boolean }) => {
      if (orbitRef.current) {
        orbitRef.current.enabled = !event.value;
      }
      // Save snapshot only on release
      if (!event.value && selectedBlock) {
        syncTransform();
        saveSnapshot();
      }
    };

    // Update store in real-time while dragging
    const onObjectChange = () => {
      syncTransform();
    };

    controls.addEventListener('dragging-changed', onDraggingChanged);
    controls.addEventListener('objectChange', onObjectChange);
    return () => {
      controls.removeEventListener('dragging-changed', onDraggingChanged);
      controls.removeEventListener('objectChange', onObjectChange);
    };
  }, [selectedBlock, orbitRef, updateBlock, saveSnapshot]);

  if (!selectedBlock || selectedBlock.locked) return null;

  const translationSnap = gridSnap ? gridSize : null;
  const rotationSnap = gridSnap ? (Math.PI / 180) * 15 : null;
  const scaleSnap = gridSnap ? 0.25 : null;

  return (
    <TransformControls
      ref={transformRef}
      mode={transformMode}
      translationSnap={translationSnap}
      rotationSnap={rotationSnap}
      scaleSnap={scaleSnap}
      position={selectedBlock.position}
      rotation={selectedBlock.rotation.map((r) => (r * Math.PI) / 180) as [number, number, number]}
      scale={selectedBlock.scale}
    />
  );
}
