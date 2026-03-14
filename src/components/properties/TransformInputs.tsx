import type { Block } from '../../types/editor';
import './MaterialEditor.css';

interface TransformInputsProps {
  block: Block;
  onUpdate: (updates: Record<string, any>) => void;
  onCommit: () => void;
}

const LABELS = ['X', 'Y', 'Z'];
const COLORS = ['#e94560', '#4ecdc4', '#45b7e9'];

function Vec3Row({ label, values, step, onChange, onBlur }: {
  label: string;
  values: [number, number, number];
  step: number;
  onChange: (axis: number, val: number) => void;
  onBlur: () => void;
}) {
  return (
    <div className="transform-row">
      <span className="transform-label">{label}</span>
      <div className="transform-inputs">
        {LABELS.map((axisLabel, i) => (
          <div key={axisLabel} className="transform-input-group">
            <span className="axis-label" style={{ color: COLORS[i] }}>{axisLabel}</span>
            <input
              type="number"
              step={step}
              value={Math.round(values[i] * 1000) / 1000}
              onChange={(e) => onChange(i, parseFloat(e.target.value) || 0)}
              onBlur={onBlur}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TransformInputs({ block, onUpdate, onCommit }: TransformInputsProps) {
  const handlePosition = (axis: number, val: number) => {
    const pos: [number, number, number] = [...block.position];
    pos[axis] = val;
    onUpdate({ position: pos });
  };

  const handleRotation = (axis: number, val: number) => {
    const rot: [number, number, number] = [...block.rotation];
    rot[axis] = val;
    onUpdate({ rotation: rot });
  };

  const handleScale = (axis: number, val: number) => {
    const scl: [number, number, number] = [...block.scale];
    scl[axis] = val;
    onUpdate({ scale: scl });
  };

  return (
    <div className="transform-inputs-container">
      <Vec3Row label="Position" values={block.position} step={0.5} onChange={handlePosition} onBlur={onCommit} />
      <Vec3Row label="Rotation" values={block.rotation} step={15} onChange={handleRotation} onBlur={onCommit} />
      <Vec3Row label="Scale" values={block.scale} step={0.25} onChange={handleScale} onBlur={onCommit} />
    </div>
  );
}
