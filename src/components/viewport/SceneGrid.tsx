import { Grid } from '@react-three/drei';
import { useEditorStore } from '../../store/useEditorStore';

export default function SceneGrid() {
  const showGrid = useEditorStore((s) => s.showGrid);
  const gridSize = useEditorStore((s) => s.gridSize);

  if (!showGrid) return null;

  return (
    <Grid
      args={[20, 20]}
      cellSize={gridSize}
      cellThickness={0.5}
      cellColor="#3a3a5c"
      sectionSize={gridSize * 5}
      sectionThickness={1}
      sectionColor="#4a4a6c"
      fadeDistance={30}
      fadeStrength={1}
      infiniteGrid
      followCamera={false}
      position={[0, 0, 0]}
    />
  );
}
