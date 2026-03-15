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
  const selectedGroupId = useEditorStore((s) => s.selectedGroupId);
  const blocks = useEditorStore((s) => s.blocks);
  const transformMode = useEditorStore((s) => s.transformMode);
  const gridSnap = useEditorStore((s) => s.gridSnap);
  const gridSize = useEditorStore((s) => s.gridSize);
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const transformGroup = useEditorStore((s) => s.transformGroup);
  const saveSnapshot = useEditorStore((s) => s.saveSnapshot);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  // Group center calculation
  const groupBlocks = selectedGroupId ? blocks.filter((b) => b.groupId === selectedGroupId) : [];
  const groupCenter: [number, number, number] = [0, 0, 0];
  if (groupBlocks.length > 0) {
    for (const b of groupBlocks) {
      groupCenter[0] += b.position[0];
      groupCenter[1] += b.position[1];
      groupCenter[2] += b.position[2];
    }
    groupCenter[0] /= groupBlocks.length;
    groupCenter[1] /= groupBlocks.length;
    groupCenter[2] /= groupBlocks.length;
  }

  // Store previous gizmo position for delta calculation
  const prevPosRef = useRef<[number, number, number]>([0, 0, 0]);
  const prevRotRef = useRef<[number, number, number]>([0, 0, 0]);
  const prevScaleRef = useRef<[number, number, number]>([1, 1, 1]);

  const isGroup = selectedGroupId && groupBlocks.length > 0;
  const isBlock = selectedBlock && !selectedBlock.locked && !selectedGroupId;

  useEffect(() => {
    const controls = transformRef.current;
    if (!controls) return;

    const onDraggingChanged = (event: { value: boolean }) => {
      if (orbitRef.current) orbitRef.current.enabled = !event.value;

      if (event.value) {
        // Drag started: store initial position
        if (isGroup) {
          prevPosRef.current = [...groupCenter];
          prevRotRef.current = [0, 0, 0];
          prevScaleRef.current = [1, 1, 1];
        }
      } else {
        // Drag ended
        if (isBlock) {
          const obj = controls.object as THREE.Object3D;
          if (obj) {
            updateBlock(selectedBlock!.id, {
              position: [obj.position.x, obj.position.y, obj.position.z],
              rotation: [(obj.rotation.x * 180) / Math.PI, (obj.rotation.y * 180) / Math.PI, (obj.rotation.z * 180) / Math.PI],
              scale: [obj.scale.x, obj.scale.y, obj.scale.z],
            });
          }
        }
        saveSnapshot();
      }
    };

    const onObjectChange = () => {
      const obj = controls.object as THREE.Object3D;
      if (!obj) return;

      if (isBlock) {
        updateBlock(selectedBlock!.id, {
          position: [obj.position.x, obj.position.y, obj.position.z],
          rotation: [(obj.rotation.x * 180) / Math.PI, (obj.rotation.y * 180) / Math.PI, (obj.rotation.z * 180) / Math.PI],
          scale: [obj.scale.x, obj.scale.y, obj.scale.z],
        });
      } else if (isGroup) {
        const mode = useEditorStore.getState().transformMode;

        if (mode === 'translate') {
          const dx = obj.position.x - prevPosRef.current[0];
          const dy = obj.position.y - prevPosRef.current[1];
          const dz = obj.position.z - prevPosRef.current[2];
          if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001 || Math.abs(dz) > 0.001) {
            transformGroup(selectedGroupId!, [dx, dy, dz]);
            prevPosRef.current = [obj.position.x, obj.position.y, obj.position.z];
          }
        } else if (mode === 'rotate') {
          const rx = (obj.rotation.x * 180) / Math.PI;
          const ry = (obj.rotation.y * 180) / Math.PI;
          const rz = (obj.rotation.z * 180) / Math.PI;
          const drx = rx - prevRotRef.current[0];
          const dry = ry - prevRotRef.current[1];
          const drz = rz - prevRotRef.current[2];
          if (Math.abs(drx) > 0.1 || Math.abs(dry) > 0.1 || Math.abs(drz) > 0.1) {
            transformGroup(selectedGroupId!, undefined, [drx, dry, drz]);
            prevRotRef.current = [rx, ry, rz];
          }
        } else if (mode === 'scale') {
          const sx = obj.scale.x / prevScaleRef.current[0];
          const sy = obj.scale.y / prevScaleRef.current[1];
          const sz = obj.scale.z / prevScaleRef.current[2];
          if (Math.abs(sx - 1) > 0.001 || Math.abs(sy - 1) > 0.001 || Math.abs(sz - 1) > 0.001) {
            transformGroup(selectedGroupId!, undefined, undefined, [sx, sy, sz]);
            prevScaleRef.current = [obj.scale.x, obj.scale.y, obj.scale.z];
          }
        }
      }
    };

    controls.addEventListener('dragging-changed', onDraggingChanged);
    controls.addEventListener('objectChange', onObjectChange);
    return () => {
      controls.removeEventListener('dragging-changed', onDraggingChanged);
      controls.removeEventListener('objectChange', onObjectChange);
    };
  }, [selectedBlock, selectedGroupId, isBlock, isGroup, groupCenter, orbitRef, updateBlock, transformGroup, saveSnapshot]);

  if (!isBlock && !isGroup) return null;

  const translationSnap = gridSnap ? gridSize : null;
  const rotationSnap = gridSnap ? (Math.PI / 180) * 15 : null;
  const scaleSnap = gridSnap ? 0.25 : null;

  const position = isGroup ? groupCenter : selectedBlock!.position;
  const rotation = isGroup ? [0, 0, 0] : selectedBlock!.rotation.map((r) => (r * Math.PI) / 180);
  const scale = isGroup ? [1, 1, 1] : selectedBlock!.scale;

  return (
    <TransformControls
      ref={transformRef}
      mode={transformMode === 'stretch' ? 'translate' : transformMode}
      translationSnap={translationSnap}
      rotationSnap={rotationSnap}
      scaleSnap={scaleSnap}
      position={position as [number, number, number]}
      rotation={rotation as [number, number, number]}
      scale={scale as [number, number, number]}
    />
  );
}
