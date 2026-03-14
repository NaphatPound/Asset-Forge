import { useEditorStore } from '../../store/useEditorStore';
import './BottomBar.css';

export default function BottomBar() {
  const blocks = useEditorStore((s) => s.blocks);
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const gridSnap = useEditorStore((s) => s.gridSnap);
  const gridSize = useEditorStore((s) => s.gridSize);
  const showGrid = useEditorStore((s) => s.showGrid);
  const transformMode = useEditorStore((s) => s.transformMode);

  const selected = blocks.find((b) => b.id === selectedBlockId);

  return (
    <div className="bottom-bar">
      <span className="bottom-bar-item">
        Blocks: <strong>{blocks.length}</strong>
      </span>
      {selected && (
        <span className="bottom-bar-item">
          Selected: <strong>{selected.name}</strong>
        </span>
      )}
      <span className="bottom-bar-item">
        Mode: <strong>{transformMode}</strong>
      </span>
      <div className="bottom-bar-spacer" />
      <span className="bottom-bar-item">
        Grid: <strong>{showGrid ? 'On' : 'Off'}</strong>
      </span>
      <span className="bottom-bar-item">
        Snap: <strong>{gridSnap ? `${gridSize}u` : 'Off'}</strong>
      </span>
    </div>
  );
}
