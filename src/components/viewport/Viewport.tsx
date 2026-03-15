import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useEditorStore } from '../../store/useEditorStore';
import SceneGrid from './SceneGrid';
import SceneLighting from './SceneLighting';
import BlockMesh from './BlockMesh';
import GizmoControls from './GizmoControls';
import CameraController from './CameraController';
import StretchHandles from './StretchHandles';
import './Viewport.css';

export default function Viewport() {
  const orbitRef = useRef<any>(null);
  const blocks = useEditorStore((s) => s.blocks);
  const clearSelection = useEditorStore((s) => s.clearSelection);
  const paintEnabled = useEditorStore((s) => s.paintSettings.enabled);
  const transformMode = useEditorStore((s) => s.transformMode);
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);

  const showGizmo = !paintEnabled && transformMode !== 'stretch';
  const showStretch = transformMode === 'stretch' && selectedBlockId;

  return (
    <div className={`viewport ${paintEnabled ? 'paint-mode' : ''}`}>
      {paintEnabled && (
        <div className="paint-mode-banner">
          Paint Mode Active - Click on selected block to paint
        </div>
      )}
      <Canvas
        shadows
        camera={{ position: [10, 8, 10], fov: 50, near: 0.1, far: 200 }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
        onPointerMissed={() => { if (!paintEnabled) clearSelection(); }}
      >
        <color attach="background" args={['#1a1a2e']} />
        <fog attach="fog" args={['#1a1a2e', 30, 80]} />
        <SceneLighting />
        <SceneGrid />
        <CameraController orbitRef={orbitRef} />
        {showGizmo && <GizmoControls orbitRef={orbitRef} />}
        {blocks.map((block) => (
          <BlockMesh key={block.id} blockId={block.id} />
        ))}
        {showStretch && (
          <StretchHandles blockId={selectedBlockId} orbitRef={orbitRef} />
        )}
      </Canvas>
    </div>
  );
}
