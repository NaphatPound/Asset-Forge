import type { Block } from '../../types/editor';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './MaterialEditor.css';

interface TransformInputsProps {
  block: Block;
  onUpdate: (updates: Record<string, any>) => void;
  onCommit: () => void;
}

const LABELS = ['X', 'Y', 'Z'];
const COLORS = ['#e94560', '#4ecdc4', '#45b7e9'];
const STRETCH_STEP = 0.25;

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

  // Rotate a local-space vector by block's Euler rotation (XYZ order)
  const rotateLocal = (lx: number, ly: number, lz: number): [number, number, number] => {
    const rot = block.rotation.map((r) => (r * Math.PI) / 180);
    const cx = Math.cos(rot[0]), sx = Math.sin(rot[0]);
    const cy = Math.cos(rot[1]), sy = Math.sin(rot[1]);
    const cz = Math.cos(rot[2]), sz = Math.sin(rot[2]);

    const zx = lx * cz - ly * sz;
    const zy = lx * sz + ly * cz;
    const zz = lz;
    const yx = zx * cy + zz * sy;
    const yy = zy;
    const yz = -zx * sy + zz * cy;
    return [yx, yy * cx - yz * sx, yy * sx + yz * cx];
  };

  // Stretch one side: change scale and shift position so opposite side stays fixed
  const handleStretch = (axis: number, direction: number, scaleDelta: number) => {
    const newScale: [number, number, number] = [...block.scale];
    const next = newScale[axis] + scaleDelta;
    if (next < 0.1) return;

    newScale[axis] = next;

    const offset = (scaleDelta / 2) * direction;
    const local: [number, number, number] = [0, 0, 0];
    local[axis] = offset;
    const [wx, wy, wz] = rotateLocal(...local);

    const newPos: [number, number, number] = [
      block.position[0] + wx,
      block.position[1] + wy,
      block.position[2] + wz,
    ];

    onUpdate({ scale: newScale, position: newPos });
    onCommit();
  };

  return (
    <div className="transform-inputs-container">
      <Vec3Row label="Position" values={block.position} step={0.5} onChange={handlePosition} onBlur={onCommit} />
      <Vec3Row label="Rotation" values={block.rotation} step={15} onChange={handleRotation} onBlur={onCommit} />
      <Vec3Row label="Scale" values={block.scale} step={0.25} onChange={handleScale} onBlur={onCommit} />

      <div className="stretch-section">
        <span className="transform-label">Stretch</span>
        <div className="stretch-controls">
          {LABELS.map((axisLabel, i) => (
            <div key={axisLabel} className="stretch-axis">
              <span className="axis-label" style={{ color: COLORS[i] }}>{axisLabel}</span>
              <button
                className="stretch-btn"
                onClick={() => handleStretch(i, -1, -STRETCH_STEP)}
                title={`Shrink from -${axisLabel}`}
              >
                <ChevronRight size={12} />
              </button>
              <button
                className="stretch-btn stretch-extend"
                onClick={() => handleStretch(i, -1, STRETCH_STEP)}
                title={`Extend -${axisLabel}`}
              >
                <ChevronLeft size={12} />
              </button>
              <span className="stretch-value">{block.scale[i].toFixed(2)}</span>
              <button
                className="stretch-btn stretch-extend"
                onClick={() => handleStretch(i, 1, STRETCH_STEP)}
                title={`Extend +${axisLabel}`}
              >
                <ChevronRight size={12} />
              </button>
              <button
                className="stretch-btn"
                onClick={() => handleStretch(i, 1, -STRETCH_STEP)}
                title={`Shrink from +${axisLabel}`}
              >
                <ChevronLeft size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
