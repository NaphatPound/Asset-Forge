import { useMemo, useState, useRef } from 'react';
import type { Block, TextureType } from '../../types/editor';
import { TEXTURE_PRESETS, generateTexturePreview, generateProceduralTexture } from '../../utils/proceduralTextures';
import { clearPaintData, fillRegionWithImage, getPaintCanvas } from '../../utils/texturePaint';
import { UV_REGION_LABELS } from '../../utils/uvUnwrap';
import { useEditorStore } from '../../store/useEditorStore';
import { Paintbrush, Eraser, ImagePlus } from 'lucide-react';

interface TextureEditorProps {
  block: Block;
  onUpdate: (updates: Record<string, any>) => void;
  onCommit: () => void;
}

type ApplyMode = 'all' | 'per-face';

export default function TextureEditor({ block, onUpdate, onCommit }: TextureEditorProps) {
  const paintSettings = useEditorStore((s) => s.paintSettings);
  const togglePaintMode = useEditorStore((s) => s.togglePaintMode);
  const updatePaintSettings = useEditorStore((s) => s.updatePaintSettings);
  const [applyMode, setApplyMode] = useState<ApplyMode>('all');
  const [selectedTexture, setSelectedTexture] = useState<TextureType>('none');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importedPreview, setImportedPreview] = useState<string | null>(null);

  const previews = useMemo(() => {
    const map: Record<string, string> = {};
    for (const preset of TEXTURE_PRESETS) {
      if (preset.id !== 'none') {
        map[preset.id] = generateTexturePreview(preset.id, block.color, 48);
      }
    }
    return map;
  }, [block.color]);

  // Apply texture: bake into paint canvas
  const applyTexture = (type: TextureType) => {
    setSelectedTexture(type);
    if (type === 'none') return;

    const tex = generateProceduralTexture(type, block.color, 1);
    if (!tex) return;
    const srcCanvas = tex.image as HTMLCanvasElement;

    if (applyMode === 'all') {
      // One image covers the entire paint canvas
      const paintCanvas = getPaintCanvas(block.id);
      const ctx = paintCanvas.getContext('2d')!;
      ctx.drawImage(srcCanvas, 0, 0, paintCanvas.width, paintCanvas.height);
    } else {
      // Fill each UV region separately with its own copy
      for (const item of UV_REGION_LABELS) {
        fillRegionWithImage(block.id, item.region, srcCanvas);
      }
    }

    onUpdate({ hasPaintData: true, textureType: 'none' });
    onCommit();
  };

  const handleClearPaint = () => {
    clearPaintData(block.id);
    onUpdate({ hasPaintData: false });
    onCommit();
    setImportedPreview(null);
  };

  const handleImportImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataURL = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Draw imported image onto a temp canvas
        const tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = img.width;
        tmpCanvas.height = img.height;
        const tmpCtx = tmpCanvas.getContext('2d')!;
        tmpCtx.drawImage(img, 0, 0);

        if (applyMode === 'all') {
          const paintCanvas = getPaintCanvas(block.id);
          const ctx = paintCanvas.getContext('2d')!;
          ctx.drawImage(tmpCanvas, 0, 0, paintCanvas.width, paintCanvas.height);
        } else {
          for (const item of UV_REGION_LABELS) {
            fillRegionWithImage(block.id, item.region, tmpCanvas);
          }
        }

        onUpdate({ hasPaintData: true, textureType: 'none' });
        onCommit();
        setImportedPreview(dataURL);
      };
      img.src = dataURL;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
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
      {/* Apply Mode */}
      <div className="texture-section">
        <div className="texture-section-header">
          <span className="material-label">Apply Texture</span>
        </div>

        <div className="apply-mode-select">
          <button
            className={`apply-mode-btn ${applyMode === 'all' ? 'active' : ''}`}
            onClick={() => setApplyMode('all')}
          >
            1 Image → All UV
          </button>
          <button
            className={`apply-mode-btn ${applyMode === 'per-face' ? 'active' : ''}`}
            onClick={() => setApplyMode('per-face')}
          >
            1 Image → Per Face
          </button>
        </div>

        <div className="apply-mode-desc">
          {applyMode === 'all'
            ? 'One texture image stretches across the entire UV map'
            : 'Each face gets its own copy of the texture'}
        </div>

        <div className="import-image-section">
          <button className="import-image-btn" onClick={() => fileInputRef.current?.click()}>
            <ImagePlus size={14} />
            Import Image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            style={{ display: 'none' }}
            onChange={handleImportImage}
          />
          {importedPreview && (
            <img src={importedPreview} alt="Imported" className="imported-preview" />
          )}
        </div>

        {Array.from(categories.entries()).map(([category, presets]) => (
          <div key={category} className="texture-category">
            <span className="texture-category-label">{category}</span>
            <div className="texture-grid">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  className={`texture-preset-btn ${selectedTexture === preset.id ? 'active' : ''}`}
                  onClick={() => applyTexture(preset.id)}
                  title={`Apply ${preset.name}`}
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

        {block.hasPaintData && (
          <button className="paint-clear-btn" onClick={handleClearPaint}>
            <Eraser size={14} />
            Clear All Textures
          </button>
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
          </div>
        )}
      </div>
    </div>
  );
}
