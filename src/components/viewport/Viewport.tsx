import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useEditorStore } from '../../store/useEditorStore';
import SceneGrid from './SceneGrid';
import SceneLighting from './SceneLighting';
import BlockMesh from './BlockMesh';
import GizmoControls from './GizmoControls';
import CameraController from './CameraController';
import './Viewport.css';

export default function Viewport() {
  const orbitRef = useRef<any>(null);
  const blocks = useEditorStore((s) => s.blocks);
  const clearSelection = useEditorStore((s) => s.clearSelection);

  return (
    <div className="viewport">
      <Canvas
        shadows
        camera={{ position: [10, 8, 10], fov: 50, near: 0.1, far: 200 }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
        onPointerMissed={() => clearSelection()}
      >
        <color attach="background" args={['#1a1a2e']} />
        <fog attach="fog" args={['#1a1a2e', 30, 80]} />
        <SceneLighting />
        <SceneGrid />
        <CameraController orbitRef={orbitRef} />
        <GizmoControls orbitRef={orbitRef} />
        {blocks.map((block) => (
          <BlockMesh key={block.id} blockId={block.id} />
        ))}
      </Canvas>
    </div>
  );
}
