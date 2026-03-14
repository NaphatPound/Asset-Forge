import type { Block } from '../../types/editor';
import './MaterialEditor.css';

interface MaterialEditorProps {
  block: Block;
  onUpdate: (updates: Record<string, any>) => void;
  onCommit: () => void;
}

const MATERIAL_PRESETS = [
  { name: 'Plastic', color: '#e94560', metalness: 0.0, roughness: 0.6 },
  { name: 'Metal', color: '#8899aa', metalness: 0.9, roughness: 0.2 },
  { name: 'Wood', color: '#8B6914', metalness: 0.0, roughness: 0.85 },
  { name: 'Stone', color: '#888888', metalness: 0.0, roughness: 0.95 },
  { name: 'Glass', color: '#aaddff', metalness: 0.1, roughness: 0.05 },
  { name: 'Gold', color: '#FFD700', metalness: 1.0, roughness: 0.1 },
  { name: 'Silver', color: '#C0C0C0', metalness: 1.0, roughness: 0.15 },
  { name: 'Concrete', color: '#999999', metalness: 0.0, roughness: 1.0 },
];

const PALETTE = [
  '#e94560', '#ff6b6b', '#ffa07a', '#ffd93d', '#6bcb77',
  '#4ecdc4', '#45b7e9', '#533483', '#e0e0e0', '#333333',
  '#8B6914', '#2d4a22', '#1a3a5c', '#5c1a3a', '#ffffff',
];

export default function MaterialEditor({ block, onUpdate, onCommit }: MaterialEditorProps) {
  return (
    <div className="material-editor">
      <div className="material-row">
        <span className="material-label">Color</span>
        <div className="color-input-row">
          <input
            type="color"
            value={block.color}
            onChange={(e) => onUpdate({ color: e.target.value })}
            onBlur={onCommit}
            className="color-picker"
          />
          <input
            type="text"
            value={block.color}
            onChange={(e) => onUpdate({ color: e.target.value })}
            onBlur={onCommit}
            className="color-hex-input"
          />
        </div>
      </div>

      <div className="color-palette">
        {PALETTE.map((c) => (
          <button
            key={c}
            className={`palette-swatch ${block.color === c ? 'active' : ''}`}
            style={{ background: c }}
            onClick={() => { onUpdate({ color: c }); onCommit(); }}
          />
        ))}
      </div>

      <div className="material-row">
        <span className="material-label">Metalness</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={block.metalness}
          onChange={(e) => onUpdate({ metalness: parseFloat(e.target.value) })}
          onMouseUp={onCommit}
        />
        <span className="material-value">{block.metalness.toFixed(2)}</span>
      </div>

      <div className="material-row">
        <span className="material-label">Roughness</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={block.roughness}
          onChange={(e) => onUpdate({ roughness: parseFloat(e.target.value) })}
          onMouseUp={onCommit}
        />
        <span className="material-value">{block.roughness.toFixed(2)}</span>
      </div>

      <div className="material-presets">
        <span className="material-label">Presets</span>
        <div className="preset-grid">
          {MATERIAL_PRESETS.map((p) => (
            <button
              key={p.name}
              className="preset-btn"
              onClick={() => { onUpdate({ color: p.color, metalness: p.metalness, roughness: p.roughness }); onCommit(); }}
            >
              <span className="preset-swatch" style={{ background: p.color }} />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
