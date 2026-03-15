import { useMemo } from 'react';
import type { Block, TextureType } from '../../types/editor';
import { TEXTURE_PRESETS, generateTexturePreview } from '../../utils/proceduralTextures';
import { clearPaintData } from '../../utils/texturePaint';
import { useEditorStore } from '../../store/useEditorStore';
import { Paintbrush, Eraser } from 'lucide-react';

interface TextureEditorProps {
  block: Block;
  onUpdate: (updates: Record<string, any>) => void;
  onCommit: () => void;
}

export default function TextureEditor({ block, onUpdate, onCommit }: TextureEditorProps) {
  const paintSettings = useEditorStore((s) => s.paintSettings);
  const togglePaintMode = useEditorStore((s) => s.togglePaintMode);
  const updatePaintSettings = useEditorStore((s) => s.updatePaintSettings);

  const previews = useMemo(() => {
    const map: Record<string, string> = {};
    for (const preset of TEXTURE_PRESETS) {
      if (preset.id !== 'none') {
        map[preset.id] = generateTexturePreview(preset.id, block.color, 32);
      }
    }
    return map;
  }, [block.color]);

  const handleTextureSelect = (type: TextureType) => {
    onUpdate({ textureType: type });
    onCommit();
  };

  const handleClearPaint = () => {
    clearPaintData(block.id);
    onUpdate({ hasPaintData: false });
    onCommit();
  };

  // Group textures by category
  const categories = useMemo(() => {
    const cats = new Map<string, typeof TEXTURE_PRESETS>();
    for (const preset of TEXTURE_PRESETS) {
      if (preset.id === 'none') continue;
      const list = cats.get(preset.category) || [];
      list.push(preset);
      cats.set(preset.category, list);
    }
    return cats;
  }, []);

  return (
    <div className="texture-editor">
      {/* Auto Texture Section */}
      <div className="texture-section">
        <div className="texture-section-header">
          <span className="material-label">Auto Texture</span>
          <button
            className={`texture-none-btn ${block.textureType === 'none' ? 'active' : ''}`}
            onClick={() => handleTextureSelect('none')}
          >
            None
          </button>
        </div>

        {Array.from(categories.entries()).map(([category, presets]) => (
          <div key={category} className="texture-category">
            <span className="texture-category-label">{category}</span>
            <div className="texture-grid">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  className={`texture-preset-btn ${block.textureType === preset.id ? 'active' : ''}`}
                  onClick={() => handleTextureSelect(preset.id)}
                  title={preset.name}
                >
                  <img
                    src={previews[preset.id]}
                    alt={preset.name}
                    className="texture-preview-img"
                  />
                  <span className="texture-preset-name">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {block.textureType !== 'none' && (
          <div className="material-row">
            <span className="material-label">UV Scale</span>
            <input
              type="range"
              min={0.25}
              max={4}
              step={0.25}
              value={block.textureScale}
              onChange={(e) => onUpdate({ textureScale: parseFloat(e.target.value) })}
              onMouseUp={onCommit}
            />
            <span className="material-value">{block.textureScale.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Texture Paint Section */}
      <div className="texture-section">
        <div className="texture-section-header">
          <span className="material-label">Texture Paint</span>
          <button
            className={`paint-toggle-btn ${paintSettings.enabled ? 'active' : ''}`}
            onClick={togglePaintMode}
            title={paintSettings.enabled ? 'Exit paint mode' : 'Enter paint mode'}
          >
            <Paintbrush size={14} />
            {paintSettings.enabled ? 'Painting' : 'Paint'}
          </button>
        </div>

        {paintSettings.enabled && (
          <div className="paint-controls">
            <div className="material-row">
              <span className="material-label">Brush Color</span>
              <div className="color-input-row">
                <input
                  type="color"
                  value={paintSettings.brushColor}
                  onChange={(e) => updatePaintSettings({ brushColor: e.target.value })}
                  className="color-picker"
                />
                <input
                  type="text"
                  value={paintSettings.brushColor}
                  onChange={(e) => updatePaintSettings({ brushColor: e.target.value })}
                  className="color-hex-input"
                />
              </div>
            </div>

            <div className="paint-palette">
              {['#ff0000', '#ff6600', '#ffff00', '#00ff00', '#0066ff', '#9900ff', '#ffffff', '#000000'].map((c) => (
                <button
                  key={c}
                  className={`palette-swatch ${paintSettings.brushColor === c ? 'active' : ''}`}
                  style={{ background: c }}
                  onClick={() => updatePaintSettings({ brushColor: c })}
                />
              ))}
            </div>

            <div className="material-row">
              <span className="material-label">Size</span>
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                value={paintSettings.brushSize}
                onChange={(e) => updatePaintSettings({ brushSize: parseInt(e.target.value) })}
              />
              <span className="material-value">{paintSettings.brushSize}</span>
            </div>

            <div className="material-row">
              <span className="material-label">Opacity</span>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.1}
                value={paintSettings.brushOpacity}
                onChange={(e) => updatePaintSettings({ brushOpacity: parseFloat(e.target.value) })}
              />
              <span className="material-value">{paintSettings.brushOpacity.toFixed(1)}</span>
            </div>

            {block.hasPaintData && (
              <button className="paint-clear-btn" onClick={handleClearPaint}>
                <Eraser size={14} />
                Clear Paint
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
