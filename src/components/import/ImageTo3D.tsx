import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useEditorStore } from '../../store/useEditorStore';
import { analyzeImage, manualRegionToPart, shapeToBlockType, type AnalysisResult, type DetectedPart, type ManualRegion } from '../../utils/imageAnalyzer';
import { X, Upload, Cpu, Check, Eye, EyeOff, Sliders, MousePointer, Scan, PenTool } from 'lucide-react';
import './ImageTo3D.css';

interface ImageTo3DProps {
  onClose: () => void;
}

type Mode = 'auto' | 'manual';
type ViewTab = 'original' | 'segments' | 'edges';
const SHAPE_OPTIONS: DetectedPart['shape'][] = ['box', 'cylinder', 'sphere', 'cone', 'capsule'];

export default function ImageTo3D({ onClose }: ImageTo3DProps) {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [parts, setParts] = useState<(DetectedPart & { enabled: boolean })[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [threshold, setThreshold] = useState(35);
  const [minPixels, setMinPixels] = useState(200);
  const [bgThreshold, setBgThreshold] = useState(30);
  const [mode, setMode] = useState<Mode>('auto');
  const [viewTab, setViewTab] = useState<ViewTab>('original');
  const [drawingShape, setDrawingShape] = useState<DetectedPart['shape']>('box');

  // Manual drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<[number, number] | null>(null);
  const [drawCurrent, setDrawCurrent] = useState<[number, number] | null>(null);
  const [manualRegions, setManualRegions] = useState<ManualRegion[]>([]);
  const nextManualId = useRef(0);

  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addBlock = useEditorStore((s) => s.addBlock);
  const updateBlock = useEditorStore((s) => s.updateBlock);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setImageURL(url);
      setResult(null);
      setParts([]);
      setManualRegions([]);
      const img = new Image();
      img.onload = () => setImageEl(img);
      img.src = url;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, []);

  const handleAnalyze = useCallback(() => {
    if (!imageEl) return;
    setAnalyzing(true);
    setTimeout(() => {
      const r = analyzeImage(imageEl, { threshold, minPixels, maxParts: 30, bgThreshold });
      setResult(r);
      setParts(r.parts.map((p) => ({ ...p, enabled: true })));
      setViewTab('segments');
      setAnalyzing(false);
    }, 50);
  }, [imageEl, threshold, minPixels, bgThreshold]);

  // Convert manual regions to parts
  const handleManualGenerate = useCallback(() => {
    if (!imageEl || manualRegions.length === 0) return;
    const newParts = manualRegions.map((r) => ({
      ...manualRegionToPart(r, imageEl),
      enabled: true,
    }));
    setParts(newParts);
  }, [imageEl, manualRegions]);

  const handleGenerate = useCallback(() => {
    const enabled = parts.filter((p) => p.enabled);
    for (const part of enabled) {
      const blockType = shapeToBlockType(part.shape);
      addBlock(blockType, part.label);
      const state = useEditorStore.getState();
      const newBlock = state.blocks[state.blocks.length - 1];
      if (newBlock) {
        updateBlock(newBlock.id, {
          position: part.position,
          scale: part.scale,
          color: part.color,
          name: part.label,
        });
      }
    }
    onClose();
  }, [parts, addBlock, updateBlock, onClose]);

  const togglePart = (id: number) => {
    setParts((p) => p.map((x) => x.id === id ? { ...x, enabled: !x.enabled } : x));
  };

  const changePartShape = (id: number, shape: DetectedPart['shape']) => {
    setParts((p) => p.map((x) => x.id === id ? { ...x, shape } : x));
  };

  const changePartLabel = (id: number, label: string) => {
    setParts((p) => p.map((x) => x.id === id ? { ...x, label } : x));
  };

  // Manual drawing on the image
  const getImageCoords = (e: React.MouseEvent<HTMLCanvasElement>): [number, number] | null => {
    const canvas = imageCanvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    return [Math.max(0, Math.min(1, x)), Math.max(0, Math.min(1, y))];
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'manual') return;
    const coords = getImageCoords(e);
    if (!coords) return;
    setIsDrawing(true);
    setDrawStart(coords);
    setDrawCurrent(coords);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const coords = getImageCoords(e);
    if (coords) setDrawCurrent(coords);
  };

  const handleCanvasMouseUp = () => {
    if (!isDrawing || !drawStart || !drawCurrent) { setIsDrawing(false); return; }

    const x = Math.min(drawStart[0], drawCurrent[0]);
    const y = Math.min(drawStart[1], drawCurrent[1]);
    const w = Math.abs(drawCurrent[0] - drawStart[0]);
    const h = Math.abs(drawCurrent[1] - drawStart[1]);

    if (w > 0.01 && h > 0.01) {
      const id = nextManualId.current++;
      setManualRegions((prev) => [...prev, {
        id,
        label: `Part ${id + 1}`,
        shape: drawingShape,
        bounds: { x, y, w, h },
      }]);
    }

    setIsDrawing(false);
    setDrawStart(null);
    setDrawCurrent(null);
  };

  const removeManualRegion = (id: number) => {
    setManualRegions((prev) => prev.filter((r) => r.id !== id));
  };

  // Draw the image canvas with overlays
  const drawImageCanvas = useCallback(() => {
    const canvas = imageCanvasRef.current;
    if (!canvas || !imageEl) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw appropriate view
    if (viewTab === 'segments' && result) {
      ctx.drawImage(result.segmentCanvas, 0, 0, w, h);
    } else if (viewTab === 'edges' && result) {
      ctx.drawImage(result.edgeCanvas, 0, 0, w, h);
    } else {
      ctx.drawImage(imageEl, 0, 0, w, h);
    }

    // Draw manual regions
    if (mode === 'manual') {
      for (const r of manualRegions) {
        const rx = r.bounds.x * w, ry = r.bounds.y * h;
        const rw = r.bounds.w * w, rh = r.bounds.h * h;

        ctx.strokeStyle = '#4ecdc4';
        ctx.lineWidth = 2;
        ctx.strokeRect(rx, ry, rw, rh);

        ctx.fillStyle = 'rgba(78, 205, 196, 0.15)';
        ctx.fillRect(rx, ry, rw, rh);

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(rx, ry - 18, Math.max(rw, 80), 18);
        ctx.fillStyle = '#4ecdc4';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`${r.label} [${r.shape}]`, rx + 3, ry - 5);
      }

      // Current drawing rect
      if (isDrawing && drawStart && drawCurrent) {
        const rx = Math.min(drawStart[0], drawCurrent[0]) * w;
        const ry = Math.min(drawStart[1], drawCurrent[1]) * h;
        const rw = Math.abs(drawCurrent[0] - drawStart[0]) * w;
        const rh = Math.abs(drawCurrent[1] - drawStart[1]) * h;

        ctx.strokeStyle = '#e94560';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(rx, ry, rw, rh);
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(233, 69, 96, 0.1)';
        ctx.fillRect(rx, ry, rw, rh);
      }
    }
  }, [imageEl, viewTab, result, mode, manualRegions, isDrawing, drawStart, drawCurrent]);

  // Redraw canvas loop
  useEffect(() => {
    let raf: number;
    const loop = () => { drawImageCanvas(); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [drawImageCanvas]);

  const enabledCount = parts.filter((p) => p.enabled).length;

  return createPortal(
    <div className="i2d-overlay" onClick={onClose}>
      <div className="i2d-modal" onClick={(e) => e.stopPropagation()}>
        <div className="i2d-header">
          <span className="i2d-title">Image → 3D</span>
          <div className="i2d-mode-tabs">
            <button className={`i2d-mode-tab ${mode === 'auto' ? 'active' : ''}`} onClick={() => setMode('auto')}>
              <Scan size={13} /> Auto Detect
            </button>
            <button className={`i2d-mode-tab ${mode === 'manual' ? 'active' : ''}`} onClick={() => setMode('manual')}>
              <PenTool size={13} /> Manual Draw
            </button>
          </div>
          <button className="i2d-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="i2d-body">
          {/* Left: Image */}
          <div className="i2d-left">
            {!imageURL ? (
              <div className="i2d-drop-zone" onClick={() => fileInputRef.current?.click()}>
                <Upload size={32} />
                <span>Click to import a 2D image</span>
                <span className="i2d-drop-hint">PNG, JPG, WebP — concept art, character, mech design</span>
              </div>
            ) : (
              <div className="i2d-image-area">
                {/* View tabs */}
                <div className="i2d-view-tabs">
                  <button className={`i2d-view-tab ${viewTab === 'original' ? 'active' : ''}`} onClick={() => setViewTab('original')}>Original</button>
                  {result && <button className={`i2d-view-tab ${viewTab === 'segments' ? 'active' : ''}`} onClick={() => setViewTab('segments')}>Segments</button>}
                  {result && <button className={`i2d-view-tab ${viewTab === 'edges' ? 'active' : ''}`} onClick={() => setViewTab('edges')}>Edges</button>}
                </div>

                <div className="i2d-canvas-wrap">
                  <canvas
                    ref={imageCanvasRef}
                    width={512}
                    height={512}
                    className="i2d-main-canvas"
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                    style={{ cursor: mode === 'manual' ? 'crosshair' : 'default' }}
                  />
                </div>
              </div>
            )}

            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" style={{ display: 'none' }} onChange={handleFileSelect} />

            {/* Actions */}
            <div className="i2d-actions">
              <button className="i2d-btn-secondary" onClick={() => fileInputRef.current?.click()}>
                <Upload size={14} /> {imageURL ? 'Change' : 'Import'}
              </button>

              {mode === 'auto' && (
                <>
                  <button className="i2d-btn-secondary" onClick={() => setShowSettings(!showSettings)}>
                    <Sliders size={14} /> Settings
                  </button>
                  {imageEl && (
                    <button className="i2d-btn-primary" onClick={handleAnalyze} disabled={analyzing}>
                      <Cpu size={14} /> {analyzing ? 'Analyzing...' : 'Analyze'}
                    </button>
                  )}
                </>
              )}

              {mode === 'manual' && (
                <>
                  <div className="i2d-draw-shape-select">
                    {SHAPE_OPTIONS.map((s) => (
                      <button key={s} className={`i2d-shape-btn ${drawingShape === s ? 'active' : ''}`} onClick={() => setDrawingShape(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                  {manualRegions.length > 0 && (
                    <button className="i2d-btn-primary" onClick={handleManualGenerate}>
                      <MousePointer size={14} /> Detect {manualRegions.length} Region{manualRegions.length > 1 ? 's' : ''}
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Auto settings */}
            {showSettings && mode === 'auto' && (
              <div className="i2d-settings">
                <div className="i2d-setting-row">
                  <span>Color Threshold</span>
                  <input type="range" min={10} max={80} step={5} value={threshold} onChange={(e) => setThreshold(parseInt(e.target.value))} />
                  <span className="i2d-setting-val">{threshold}</span>
                </div>
                <div className="i2d-setting-row">
                  <span>BG Remove</span>
                  <input type="range" min={5} max={80} step={5} value={bgThreshold} onChange={(e) => setBgThreshold(parseInt(e.target.value))} />
                  <span className="i2d-setting-val">{bgThreshold}</span>
                </div>
                <div className="i2d-setting-row">
                  <span>Min Part Size</span>
                  <input type="range" min={50} max={1000} step={50} value={minPixels} onChange={(e) => setMinPixels(parseInt(e.target.value))} />
                  <span className="i2d-setting-val">{minPixels}px</span>
                </div>
              </div>
            )}

            {/* Manual region list */}
            {mode === 'manual' && manualRegions.length > 0 && (
              <div className="i2d-manual-list">
                {manualRegions.map((r) => (
                  <div key={r.id} className="i2d-manual-item">
                    <span>{r.label}</span>
                    <span className="i2d-manual-shape">[{r.shape}]</span>
                    <button className="i2d-manual-remove" onClick={() => removeManualRegion(r.id)}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <button className="i2d-btn-secondary" style={{ fontSize: 10 }} onClick={() => setManualRegions([])}>
                  Clear All Regions
                </button>
              </div>
            )}
          </div>

          {/* Right: Parts */}
          <div className="i2d-right">
            <div className="i2d-parts-header">
              <span className="i2d-parts-title">
                Parts {parts.length > 0 && `(${enabledCount}/${parts.length})`}
              </span>
              {parts.length > 0 && (
                <div className="i2d-parts-toggle-all">
                  <button onClick={() => setParts((p) => p.map((x) => ({ ...x, enabled: true })))}>All</button>
                  <button onClick={() => setParts((p) => p.map((x) => ({ ...x, enabled: false })))}>None</button>
                </div>
              )}
            </div>

            {parts.length === 0 && (
              <div className="i2d-parts-empty">
                {mode === 'auto'
                  ? (imageURL ? 'Click "Analyze" to detect parts' : 'Import an image to start')
                  : (imageURL ? 'Draw rectangles on the image to define parts' : 'Import an image to start')
                }
              </div>
            )}

            <div className="i2d-parts-list">
              {parts.map((part) => (
                <div key={part.id} className={`i2d-part-card ${part.enabled ? '' : 'disabled'}`}>
                  <div className="i2d-part-top">
                    <button className="i2d-part-toggle" onClick={() => togglePart(part.id)}>
                      {part.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <div className="i2d-part-color" style={{ background: part.color }} />
                    <input className="i2d-part-name" value={part.label} onChange={(e) => changePartLabel(part.id, e.target.value)} />
                  </div>
                  <div className="i2d-part-details">
                    <div className="i2d-part-shape-select">
                      {SHAPE_OPTIONS.map((s) => (
                        <button key={s} className={`i2d-shape-btn ${part.shape === s ? 'active' : ''}`} onClick={() => changePartShape(part.id, s)}>
                          {s}
                        </button>
                      ))}
                    </div>
                    <div className="i2d-part-info">
                      <span>{part.pixelCount}px</span>
                      <span>R:{part.aspectRatio.toFixed(1)}</span>
                      <span>C:{(part.circularity * 100).toFixed(0)}%</span>
                      {part.convexity > 0 && <span>V:{(part.convexity * 100).toFixed(0)}%</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {parts.length > 0 && (
              <button className="i2d-generate-btn" onClick={handleGenerate}>
                <Check size={16} /> Generate {enabledCount} Block{enabledCount !== 1 ? 's' : ''}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
