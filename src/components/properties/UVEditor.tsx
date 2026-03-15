import { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import type { Block, TextureType } from '../../types/editor';
import { useEditorStore } from '../../store/useEditorStore';
import { getPaintCanvas, paintOnCanvas, clearPaintData, fillRegionWithImage, fillRegionWithColor, clearRegion } from '../../utils/texturePaint';
import { UV_REGION_LABELS } from '../../utils/uvUnwrap';
import { getBlockGeometry } from '../../blocks/blockDefinitions';
import { ensureUVs } from '../../utils/uvUnwrap';
import { TEXTURE_PRESETS, generateProceduralTexture } from '../../utils/proceduralTextures';
import { Eraser, ZoomIn, ZoomOut, PaintBucket, Paintbrush } from 'lucide-react';

interface UVEditorProps {
  block: Block;
  onUpdate: (updates: Record<string, any>) => void;
  onCommit: () => void;
}

const CANVAS_SIZE = 280;

type ToolMode = 'paint' | 'fill';

// Extract UV wireframe edges from geometry
function getUVWireframe(blockType: string): { edges: [number, number, number, number][] } {
  const geo = getBlockGeometry(blockType).clone();
  ensureUVs(geo, 1);

  const uvAttr = geo.getAttribute('uv');
  const indexAttr = geo.getIndex();
  if (!uvAttr) return { edges: [] };

  const edges: [number, number, number, number][] = [];
  const edgeSet = new Set<string>();

  const addEdge = (i1: number, i2: number) => {
    const u1 = uvAttr.getX(i1);
    const v1 = uvAttr.getY(i1);
    const u2 = uvAttr.getX(i2);
    const v2 = uvAttr.getY(i2);

    const key = [
      Math.round(u1 * 1000), Math.round(v1 * 1000),
      Math.round(u2 * 1000), Math.round(v2 * 1000),
    ].sort().join(',');

    if (!edgeSet.has(key)) {
      edgeSet.add(key);
      edges.push([u1, v1, u2, v2]);
    }
  };

  if (indexAttr) {
    for (let i = 0; i < indexAttr.count; i += 3) {
      const a = indexAttr.getX(i);
      const b = indexAttr.getX(i + 1);
      const c = indexAttr.getX(i + 2);
      addEdge(a, b);
      addEdge(b, c);
      addEdge(c, a);
    }
  } else {
    for (let i = 0; i < uvAttr.count; i += 3) {
      addEdge(i, i + 1);
      addEdge(i + 1, i + 2);
      addEdge(i + 2, i);
    }
  }

  return { edges };
}

// Find which UV region a UV point falls in
function findRegionAtUV(u: number, v: number): { key: string; label: string; region: [number, number, number, number] } | null {
  for (const item of UV_REGION_LABELS) {
    const [uMin, vMin, uMax, vMax] = item.region;
    if (u >= uMin && u <= uMax && v >= vMin && v <= vMax) {
      return item;
    }
  }
  return null;
}

export default function UVEditor({ block, onUpdate, onCommit }: UVEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isPainting = useRef(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<[number, number]>([0, 0]);
  const [toolMode, setToolMode] = useState<ToolMode>('paint');
  const [selectedTexture, setSelectedTexture] = useState<TextureType>('wood');
  const [fillColor, setFillColor] = useState('#e94560');
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const paintSettings = useEditorStore((s) => s.paintSettings);

  const wireframe = useMemo(() => getUVWireframe(block.type), [block.type]);

  // Canvas pixel → UV coordinate
  const canvasToUV = useCallback((clientX: number, clientY: number): [number, number] | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width * canvas.width;
    const py = (clientY - rect.top) / rect.height * canvas.height;

    const u = (px - offset[0]) / (canvas.width * zoom);
    const v = 1 - (py - offset[1]) / (canvas.height * zoom);

    if (u < 0 || u > 1 || v < 0 || v > 1) return null;
    return [u, v];
  }, [zoom, offset]);

  // Draw the UV editor canvas
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, w, h);

    // Checkerboard
    const checkSize = 8 * zoom;
    for (let y = 0; y < h; y += checkSize) {
      for (let x = 0; x < w; x += checkSize) {
        const ix = Math.floor(x / checkSize);
        const iy = Math.floor(y / checkSize);
        ctx.fillStyle = (ix + iy) % 2 === 0 ? '#222240' : '#1e1e36';
        ctx.fillRect(x, y, checkSize, checkSize);
      }
    }

    ctx.save();
    ctx.translate(offset[0], offset[1]);
    ctx.scale(zoom, zoom);

    const uvW = w / zoom;
    const uvH = h / zoom;
    const uToX = (u: number) => u * uvW;
    const vToY = (v: number) => (1 - v) * uvH;

    // Draw paint data
    if (block.hasPaintData) {
      const paintCanvas = getPaintCanvas(block.id);
      ctx.drawImage(paintCanvas, 0, 0, uvW, uvH);
    }

    // Draw UV region grid
    for (const { key, label, region } of UV_REGION_LABELS) {
      const [uMin, vMin, uMax, vMax] = region;
      const rx = uToX(uMin);
      const ry = vToY(vMax);
      const rw = (uMax - uMin) * uvW;
      const rh = (vMax - vMin) * uvH;

      // Highlight hovered region in fill mode
      if (toolMode === 'fill' && hoveredRegion === key) {
        ctx.fillStyle = 'rgba(233, 69, 96, 0.15)';
        ctx.fillRect(rx, ry, rw, rh);
      }

      // Region fill
      ctx.fillStyle = 'rgba(100, 100, 200, 0.03)';
      ctx.fillRect(rx, ry, rw, rh);

      // Region border
      ctx.strokeStyle = hoveredRegion === key ? 'rgba(233, 69, 96, 0.8)' : 'rgba(100, 150, 255, 0.4)';
      ctx.lineWidth = (hoveredRegion === key ? 2 : 1) / zoom;
      ctx.setLineDash([4 / zoom, 4 / zoom]);
      ctx.strokeRect(rx, ry, rw, rh);
      ctx.setLineDash([]);

      // Label
      ctx.fillStyle = hoveredRegion === key ? 'rgba(233, 69, 96, 0.9)' : 'rgba(100, 180, 255, 0.7)';
      ctx.font = `bold ${12 / zoom}px monospace`;
      ctx.fillText(label, rx + 6 / zoom, ry + 16 / zoom);
    }

    // UV wireframe
    ctx.strokeStyle = 'rgba(233, 69, 96, 0.5)';
    ctx.lineWidth = 0.8 / zoom;
    ctx.beginPath();
    for (const [u1, v1, u2, v2] of wireframe.edges) {
      ctx.moveTo(uToX(u1), vToY(v1));
      ctx.lineTo(uToX(u2), vToY(v2));
    }
    ctx.stroke();

    // UV vertices
    ctx.fillStyle = 'rgba(233, 69, 96, 0.7)';
    const dotR = 1.2 / zoom;
    const drawnDots = new Set<string>();
    for (const [u1, v1, u2, v2] of wireframe.edges) {
      for (const [u, v] of [[u1, v1], [u2, v2]]) {
        const k = `${Math.round(u * 100)},${Math.round(v * 100)}`;
        if (!drawnDots.has(k)) {
          drawnDots.add(k);
          ctx.beginPath();
          ctx.arc(uToX(u), vToY(v), dotR, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.restore();
  }, [block.id, block.type, block.hasPaintData, wireframe, zoom, offset, toolMode, hoveredRegion]);

  useEffect(() => {
    let raf: number;
    const loop = () => {
      redraw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [redraw]);

  const ensurePaintData = useCallback(() => {
    if (!block.hasPaintData) {
      onUpdate({ hasPaintData: true });
      onCommit();
    }
  }, [block.hasPaintData, onUpdate, onCommit]);

  // Fill a region with selected texture
  const fillRegion = useCallback((regionItem: { key: string; region: [number, number, number, number] }) => {
    ensurePaintData();

    if (selectedTexture === 'none') {
      // Fill with solid color
      fillRegionWithColor(block.id, regionItem.region, fillColor);
    } else {
      // Generate the procedural texture and fill
      const tex = generateProceduralTexture(selectedTexture, fillColor, 1);
      if (tex) {
        const srcCanvas = tex.image as HTMLCanvasElement;
        fillRegionWithImage(block.id, regionItem.region, srcCanvas);
      }
    }

    // Ensure hasPaintData is set
    if (!block.hasPaintData) {
      onUpdate({ hasPaintData: true });
      onCommit();
    }
  }, [block.id, block.hasPaintData, selectedTexture, fillColor, ensurePaintData, onUpdate, onCommit]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const uv = canvasToUV(e.clientX, e.clientY);
    if (!uv) return;

    if (toolMode === 'fill') {
      // Fill the region under the cursor
      const region = findRegionAtUV(uv[0], uv[1]);
      if (region) {
        fillRegion(region);
      }
    } else if (paintSettings.enabled) {
      // Paint mode
      isPainting.current = true;
      ensurePaintData();
      paintOnCanvas(block.id, uv[0], uv[1], paintSettings.brushSize, paintSettings.brushColor, paintSettings.brushOpacity);
    }
  }, [toolMode, paintSettings, canvasToUV, fillRegion, block.id, ensurePaintData]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const uv = canvasToUV(e.clientX, e.clientY);

    // Track hovered region for fill mode
    if (toolMode === 'fill' && uv) {
      const region = findRegionAtUV(uv[0], uv[1]);
      setHoveredRegion(region ? region.key : null);
    } else {
      setHoveredRegion(null);
    }

    // Continuous painting
    if (isPainting.current && toolMode === 'paint' && uv) {
      paintOnCanvas(block.id, uv[0], uv[1], paintSettings.brushSize, paintSettings.brushColor, paintSettings.brushOpacity);
    }
  }, [toolMode, canvasToUV, block.id, paintSettings]);

  const handlePointerUp = useCallback(() => {
    isPainting.current = false;
  }, []);

  const handleClear = () => {
    clearPaintData(block.id);
    onUpdate({ hasPaintData: false });
    onCommit();
  };

  const handleClearRegion = (regionItem: { key: string; region: [number, number, number, number] }) => {
    clearRegion(block.id, regionItem.region);
  };

  // Fill ALL regions with selected texture
  const handleFillAll = () => {
    ensurePaintData();
    for (const item of UV_REGION_LABELS) {
      if (selectedTexture === 'none') {
        fillRegionWithColor(block.id, item.region, fillColor);
      } else {
        const tex = generateProceduralTexture(selectedTexture, fillColor, 1);
        if (tex) {
          fillRegionWithImage(block.id, item.region, tex.image as HTMLCanvasElement);
        }
      }
    }
    if (!block.hasPaintData) {
      onUpdate({ hasPaintData: true });
      onCommit();
    }
  };

  const cursorStyle = toolMode === 'fill' ? 'pointer' : (paintSettings.enabled ? 'crosshair' : 'default');

  return (
    <div className="uv-editor">
      {/* Tool mode selector */}
      <div className="uv-tool-bar">
        <button
          className={`uv-tool-btn ${toolMode === 'paint' ? 'active' : ''}`}
          onClick={() => setToolMode('paint')}
          title="Paint Brush"
        >
          <Paintbrush size={13} />
          Paint
        </button>
        <button
          className={`uv-tool-btn ${toolMode === 'fill' ? 'active' : ''}`}
          onClick={() => setToolMode('fill')}
          title="Fill Region with Texture"
        >
          <PaintBucket size={13} />
          Fill
        </button>
        <div style={{ flex: 1 }} />
        <button
          className="stretch-btn"
          onClick={() => setZoom((z) => Math.min(4, z + 0.5))}
          title="Zoom In"
        >
          <ZoomIn size={12} />
        </button>
        <button
          className="stretch-btn"
          onClick={() => setZoom((z) => Math.max(0.5, z - 0.5))}
          title="Zoom Out"
        >
          <ZoomOut size={12} />
        </button>
        {block.hasPaintData && (
          <button className="stretch-btn" onClick={handleClear} title="Clear All">
            <Eraser size={12} />
          </button>
        )}
      </div>

      {/* Fill mode controls */}
      {toolMode === 'fill' && (
        <div className="uv-fill-controls">
          <div className="material-row">
            <span className="material-label">Color</span>
            <div className="color-input-row">
              <input
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="color-picker"
              />
              <input
                type="text"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="color-hex-input"
              />
            </div>
          </div>

          <div className="uv-fill-texture-select">
            <span className="material-label">Texture</span>
            <div className="uv-fill-texture-grid">
              <button
                className={`uv-fill-tex-btn ${selectedTexture === 'none' ? 'active' : ''}`}
                onClick={() => setSelectedTexture('none')}
              >
                Solid
              </button>
              {TEXTURE_PRESETS.filter((p) => p.id !== 'none').map((preset) => (
                <button
                  key={preset.id}
                  className={`uv-fill-tex-btn ${selectedTexture === preset.id ? 'active' : ''}`}
                  onClick={() => setSelectedTexture(preset.id)}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <button className="uv-fill-all-btn" onClick={handleFillAll}>
            <PaintBucket size={12} />
            Fill All Faces
          </button>

          <div className="uv-fill-hint">Click a face region in the canvas below to fill it</div>
        </div>
      )}

      {/* Canvas */}
      <div className="uv-editor-canvas-wrap">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="uv-editor-canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => { handlePointerUp(); setHoveredRegion(null); }}
          style={{ cursor: cursorStyle }}
        />
        {toolMode === 'paint' && !paintSettings.enabled && (
          <div className="uv-editor-hint">
            Enable Paint mode to draw here
          </div>
        )}
      </div>

      {/* Per-region controls */}
      <div className="uv-region-list">
        {UV_REGION_LABELS.map(({ key, label, region }) => (
          <div key={key} className="uv-region-row">
            <span className="uv-region-tag">{label}</span>
            <button
              className="uv-region-action"
              onClick={() => fillRegion({ key, region })}
              title={`Fill ${label} with selected texture`}
            >
              <PaintBucket size={10} />
            </button>
            <button
              className="uv-region-action"
              onClick={() => handleClearRegion({ key, region })}
              title={`Clear ${label}`}
            >
              <Eraser size={10} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
