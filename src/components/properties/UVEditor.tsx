import { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import type { Block } from '../../types/editor';
import { useEditorStore } from '../../store/useEditorStore';
import { getPaintCanvas, paintOnCanvas, clearPaintData } from '../../utils/texturePaint';
import { UV_REGION_LABELS, ensureUVs } from '../../utils/uvUnwrap';
import { getBlockGeometry } from '../../blocks/blockDefinitions';
import { Eraser, ZoomIn, ZoomOut } from 'lucide-react';

interface UVEditorProps {
  block: Block;
  onUpdate: (updates: Record<string, any>) => void;
  onCommit: () => void;
}

const CANVAS_SIZE = 280;

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

    // Deduplicate edges
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

export default function UVEditor({ block, onUpdate, onCommit }: UVEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isPainting = useRef(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<[number, number]>([0, 0]);
  const paintSettings = useEditorStore((s) => s.paintSettings);

  // Get UV wireframe from geometry
  const wireframe = useMemo(() => getUVWireframe(block.type), [block.type]);

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

    // Draw checkerboard
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

    // UV to canvas pixel
    const uToX = (u: number) => u * uvW;
    const vToY = (v: number) => (1 - v) * uvH; // Flip Y: UV v=0 is bottom

    // Draw paint data
    if (block.hasPaintData) {
      const paintCanvas = getPaintCanvas(block.id);
      // Paint canvas has v flipped already (paintOnCanvas does 1-v)
      ctx.drawImage(paintCanvas, 0, 0, uvW, uvH);
    }

    // Draw UV region grid
    for (const { label, region } of UV_REGION_LABELS) {
      const [uMin, vMin, uMax, vMax] = region;
      const rx = uToX(uMin);
      const ry = vToY(vMax); // vMax is top of region
      const rw = (uMax - uMin) * uvW;
      const rh = (vMax - vMin) * uvH;

      // Region fill (subtle)
      ctx.fillStyle = 'rgba(100, 100, 200, 0.05)';
      ctx.fillRect(rx, ry, rw, rh);

      // Region border
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.4)';
      ctx.lineWidth = 1.5 / zoom;
      ctx.setLineDash([4 / zoom, 4 / zoom]);
      ctx.strokeRect(rx, ry, rw, rh);
      ctx.setLineDash([]);

      // Region label
      ctx.fillStyle = 'rgba(100, 180, 255, 0.7)';
      ctx.font = `bold ${12 / zoom}px monospace`;
      ctx.fillText(label, rx + 6 / zoom, ry + 16 / zoom);
    }

    // Draw UV wireframe from the actual model
    ctx.strokeStyle = 'rgba(233, 69, 96, 0.6)';
    ctx.lineWidth = 0.8 / zoom;
    ctx.beginPath();
    for (const [u1, v1, u2, v2] of wireframe.edges) {
      ctx.moveTo(uToX(u1), vToY(v1));
      ctx.lineTo(uToX(u2), vToY(v2));
    }
    ctx.stroke();

    // Draw UV vertices as dots
    ctx.fillStyle = 'rgba(233, 69, 96, 0.8)';
    const dotR = 1.5 / zoom;
    const drawnDots = new Set<string>();
    for (const [u1, v1, u2, v2] of wireframe.edges) {
      const k1 = `${Math.round(u1 * 100)},${Math.round(v1 * 100)}`;
      const k2 = `${Math.round(u2 * 100)},${Math.round(v2 * 100)}`;
      if (!drawnDots.has(k1)) {
        drawnDots.add(k1);
        ctx.beginPath();
        ctx.arc(uToX(u1), vToY(v1), dotR, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!drawnDots.has(k2)) {
        drawnDots.add(k2);
        ctx.beginPath();
        ctx.arc(uToX(u2), vToY(v2), dotR, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }, [block.id, block.type, block.hasPaintData, wireframe, zoom, offset]);

  // Redraw loop
  useEffect(() => {
    let raf: number;
    const loop = () => {
      redraw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [redraw]);

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

  const doPaintAtUV = useCallback((clientX: number, clientY: number) => {
    const uv = canvasToUV(clientX, clientY);
    if (!uv) return;

    if (!block.hasPaintData) {
      onUpdate({ hasPaintData: true });
      onCommit();
    }

    paintOnCanvas(block.id, uv[0], uv[1], paintSettings.brushSize, paintSettings.brushColor, paintSettings.brushOpacity);
  }, [block.id, block.hasPaintData, canvasToUV, paintSettings, onUpdate, onCommit]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!paintSettings.enabled) return;
    isPainting.current = true;
    doPaintAtUV(e.clientX, e.clientY);
  }, [paintSettings.enabled, doPaintAtUV]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPainting.current) return;
    doPaintAtUV(e.clientX, e.clientY);
  }, [doPaintAtUV]);

  const handlePointerUp = useCallback(() => {
    isPainting.current = false;
  }, []);

  const handleClear = () => {
    clearPaintData(block.id);
    onUpdate({ hasPaintData: false });
    onCommit();
  };

  return (
    <div className="uv-editor">
      <div className="uv-editor-toolbar">
        <span className="material-label">UV Editor</span>
        <div className="uv-editor-actions">
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
          <button
            className="stretch-btn"
            onClick={() => { setZoom(1); setOffset([0, 0]); }}
            title="Reset View"
          >
            1:1
          </button>
          {block.hasPaintData && (
            <button className="stretch-btn" onClick={handleClear} title="Clear Paint">
              <Eraser size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="uv-editor-canvas-wrap">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="uv-editor-canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ cursor: paintSettings.enabled ? 'crosshair' : 'default' }}
        />
        {!paintSettings.enabled && (
          <div className="uv-editor-hint">
            Enable Paint mode to draw here
          </div>
        )}
      </div>

      <div className="uv-region-legend">
        {UV_REGION_LABELS.map(({ key, label }) => (
          <span key={key} className="uv-region-tag">{label}</span>
        ))}
      </div>
    </div>
  );
}
