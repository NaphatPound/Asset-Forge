import { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import type { Block, TextureType } from '../../types/editor';
import { useEditorStore } from '../../store/useEditorStore';
import { getPaintCanvas, paintOnCanvas, clearPaintData, fillRegionWithImage, fillRegionWithColor, clearRegion, scaleRegion, rotateRegion, scaleFullCanvas, rotateFullCanvas } from '../../utils/texturePaint';
import { UV_REGION_LABELS, ensureUVs } from '../../utils/uvUnwrap';
import { getBlockGeometry } from '../../blocks/blockDefinitions';
import { TEXTURE_PRESETS, generateProceduralTexture, generateTexturePreview } from '../../utils/proceduralTextures';
import { X, Eraser, ZoomIn, ZoomOut, PaintBucket, Paintbrush, Move, Maximize, RotateCw, RotateCcw } from 'lucide-react';
import './UVEditorModal.css';

interface UVEditorModalProps {
  block: Block;
  onUpdate: (updates: Record<string, any>) => void;
  onCommit: () => void;
  onClose: () => void;
}

type ToolMode = 'paint' | 'fill' | 'move';

const PAINT_TEX_SIZE = 512;

function getUVWireframe(blockType: string): { edges: [number, number, number, number][] } {
  const geo = getBlockGeometry(blockType).clone();
  ensureUVs(geo, 1);
  const uvAttr = geo.getAttribute('uv');
  const indexAttr = geo.getIndex();
  if (!uvAttr) return { edges: [] };

  const edges: [number, number, number, number][] = [];
  const edgeSet = new Set<string>();
  const addEdge = (i1: number, i2: number) => {
    const u1 = uvAttr.getX(i1), v1 = uvAttr.getY(i1);
    const u2 = uvAttr.getX(i2), v2 = uvAttr.getY(i2);
    const key = [Math.round(u1 * 1000), Math.round(v1 * 1000), Math.round(u2 * 1000), Math.round(v2 * 1000)].sort().join(',');
    if (!edgeSet.has(key)) { edgeSet.add(key); edges.push([u1, v1, u2, v2]); }
  };

  if (indexAttr) {
    for (let i = 0; i < indexAttr.count; i += 3) {
      const a = indexAttr.getX(i), b = indexAttr.getX(i + 1), c = indexAttr.getX(i + 2);
      addEdge(a, b); addEdge(b, c); addEdge(c, a);
    }
  } else {
    for (let i = 0; i < uvAttr.count; i += 3) {
      addEdge(i, i + 1); addEdge(i + 1, i + 2); addEdge(i + 2, i);
    }
  }
  return { edges };
}

function findRegionAtUV(u: number, v: number) {
  for (const item of UV_REGION_LABELS) {
    const [uMin, vMin, uMax, vMax] = item.region;
    if (u >= uMin && u <= uMax && v >= vMin && v <= vMax) return item;
  }
  return null;
}

export default function UVEditorModal({ block, onUpdate, onCommit, onClose }: UVEditorModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isPainting = useRef(false);
  const [canvasSize, setCanvasSize] = useState(600);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<[number, number]>([0, 0]);
  const [toolMode, setToolMode] = useState<ToolMode>('move');
  const [selectedTexture, setSelectedTexture] = useState<TextureType>('none');
  const [fillColor, setFillColor] = useState(block.color);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [moveScope, setMoveScope] = useState<'single' | 'all'>('single');

  // Move mode state
  const moveRef = useRef<{
    startX: number;
    startY: number;
    mode: 'single' | 'all';
    // Single mode: one region
    regions: { key: string; region: [number, number, number, number]; imageData: ImageData }[];
    // All mode: entire canvas snapshot
    fullSnapshot: ImageData | null;
  } | null>(null);

  const paintSettings = useEditorStore((s) => s.paintSettings);

  const wireframe = useMemo(() => getUVWireframe(block.type), [block.type]);

  const previews = useMemo(() => {
    const map: Record<string, string> = {};
    for (const p of TEXTURE_PRESETS) {
      if (p.id !== 'none') map[p.id] = generateTexturePreview(p.id, fillColor, 36);
    }
    return map;
  }, [fillColor]);

  // Resize canvas to fit container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const resize = () => {
      const rect = container.getBoundingClientRect();
      const size = Math.min(rect.width - 20, rect.height - 20, 900);
      setCanvasSize(Math.max(400, size));
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Disable viewport interaction
  useEffect(() => {
    const viewport = document.querySelector('.viewport') as HTMLElement | null;
    if (viewport) {
      viewport.style.pointerEvents = 'none';
      return () => { viewport.style.pointerEvents = ''; };
    }
  }, []);

  const canvasToUV = useCallback((clientX: number, clientY: number): [number, number] | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width * canvas.width;
    const py = (clientY - rect.top) / rect.height * canvas.height;
    const u = (px - pan[0]) / (canvas.width * zoom);
    const v = 1 - (py - pan[1]) / (canvas.height * zoom);
    if (u < 0 || u > 1 || v < 0 || v > 1) return null;
    return [u, v];
  }, [zoom, pan]);

  const ensurePaintData = useCallback(() => {
    if (!block.hasPaintData) {
      onUpdate({ hasPaintData: true });
      onCommit();
    }
  }, [block.hasPaintData, onUpdate, onCommit]);

  // Move texture within a region: redraw the captured snapshot at an offset with wrapping
  const moveTextureInRegion = useCallback((dx: number, dy: number, regionData: { region: [number, number, number, number]; imageData: ImageData }) => {
    const { region, imageData } = regionData;
    const [uMin, vMin, uMax, vMax] = region;

    const paintCanvas = getPaintCanvas(block.id);
    const ctx = paintCanvas.getContext('2d')!;

    const rx = Math.floor(uMin * PAINT_TEX_SIZE);
    const ry = Math.floor((1 - vMax) * PAINT_TEX_SIZE);
    const rw = Math.floor((uMax - uMin) * PAINT_TEX_SIZE);
    const rh = Math.floor((vMax - vMin) * PAINT_TEX_SIZE);

    // Build a temp canvas from the original snapshot
    const tmp = document.createElement('canvas');
    tmp.width = rw;
    tmp.height = rh;
    const tmpCtx = tmp.getContext('2d')!;
    tmpCtx.putImageData(imageData, 0, 0);

    // Compute wrapped offset
    const ox = ((dx % rw) + rw) % rw;
    const oy = ((dy % rh) + rh) % rh;

    // Clear the region on the paint canvas
    ctx.clearRect(rx, ry, rw, rh);

    // Clip drawing to the region bounds
    ctx.save();
    ctx.beginPath();
    ctx.rect(rx, ry, rw, rh);
    ctx.clip();

    // Draw 4 copies to handle wrapping in both axes
    ctx.drawImage(tmp, rx + ox, ry + oy);
    ctx.drawImage(tmp, rx + ox - rw, ry + oy);
    ctx.drawImage(tmp, rx + ox, ry + oy - rh);
    ctx.drawImage(tmp, rx + ox - rw, ry + oy - rh);

    ctx.restore();
  }, [block.id]);

  // Capture region image data for move
  const captureRegionData = useCallback((region: [number, number, number, number]): ImageData | null => {
    const paintCanvas = getPaintCanvas(block.id);
    const ctx = paintCanvas.getContext('2d')!;
    const [uMin, vMin, uMax, vMax] = region;
    const px = Math.floor(uMin * PAINT_TEX_SIZE);
    const py = Math.floor((1 - vMax) * PAINT_TEX_SIZE);
    const pw = Math.floor((uMax - uMin) * PAINT_TEX_SIZE);
    const ph = Math.floor((vMax - vMin) * PAINT_TEX_SIZE);
    return ctx.getImageData(px, py, pw, ph);
  }, [block.id]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const uv = canvasToUV(e.clientX, e.clientY);

    if (toolMode === 'move' && block.hasPaintData) {
      if (moveScope === 'all') {
        // Capture the ENTIRE canvas as one image
        const paintCanvas = getPaintCanvas(block.id);
        const ctx = paintCanvas.getContext('2d')!;
        const fullSnapshot = ctx.getImageData(0, 0, PAINT_TEX_SIZE, PAINT_TEX_SIZE);
        moveRef.current = {
          startX: e.clientX,
          startY: e.clientY,
          mode: 'all',
          regions: [],
          fullSnapshot,
        };
      } else {
        // Single region — need valid UV
        if (!uv) return;
        const region = findRegionAtUV(uv[0], uv[1]);
        if (region) {
          const imgData = captureRegionData(region.region);
          if (imgData) {
            moveRef.current = {
              startX: e.clientX,
              startY: e.clientY,
              mode: 'single',
              regions: [{ key: region.key, region: region.region, imageData: imgData }],
              fullSnapshot: null,
            };
          }
        }
      }
      return;
    }

    if (!uv) return;

    if (toolMode === 'fill') {
      const region = findRegionAtUV(uv[0], uv[1]);
      if (region) {
        ensurePaintData();
        if (selectedTexture === 'none') {
          fillRegionWithColor(block.id, region.region, fillColor);
        } else {
          const tex = generateProceduralTexture(selectedTexture, fillColor, 1);
          if (tex) fillRegionWithImage(block.id, region.region, tex.image as HTMLCanvasElement);
        }
        if (!block.hasPaintData) { onUpdate({ hasPaintData: true }); onCommit(); }
      }
    } else if (paintSettings.enabled) {
      isPainting.current = true;
      ensurePaintData();
      paintOnCanvas(block.id, uv[0], uv[1], paintSettings.brushSize, paintSettings.brushColor, paintSettings.brushOpacity);
    }
  }, [toolMode, moveScope, paintSettings, canvasToUV, block, selectedTexture, fillColor, ensurePaintData, captureRegionData, onUpdate, onCommit]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const uv = canvasToUV(e.clientX, e.clientY);

    // Hover tracking
    if (uv && (toolMode === 'fill' || toolMode === 'move')) {
      const region = findRegionAtUV(uv[0], uv[1]);
      setHoveredRegion(region ? region.key : null);
    } else {
      setHoveredRegion(null);
    }

    // Move texture
    if (toolMode === 'move' && moveRef.current) {
      const dx = e.clientX - moveRef.current.startX;
      const dy = e.clientY - moveRef.current.startY;

      const cvs = canvasRef.current;
      if (!cvs) return;
      const rect = cvs.getBoundingClientRect();
      const texPerScreen = PAINT_TEX_SIZE / (rect.width * zoom);
      const tdx = Math.round(dx * texPerScreen);
      const tdy = Math.round(dy * texPerScreen);

      if (moveRef.current.mode === 'all' && moveRef.current.fullSnapshot) {
        // Move entire canvas as one image
        const paintCanvas = getPaintCanvas(block.id);
        const ctx = paintCanvas.getContext('2d')!;
        const snap = moveRef.current.fullSnapshot;
        const s = PAINT_TEX_SIZE;

        // Build temp canvas from snapshot
        const tmp = document.createElement('canvas');
        tmp.width = s;
        tmp.height = s;
        const tmpCtx = tmp.getContext('2d')!;
        tmpCtx.putImageData(snap, 0, 0);

        // Wrapped offset
        const ox = ((tdx % s) + s) % s;
        const oy = ((tdy % s) + s) % s;

        // Clear and redraw with offset + wrapping
        ctx.clearRect(0, 0, s, s);
        ctx.drawImage(tmp, ox, oy);
        ctx.drawImage(tmp, ox - s, oy);
        ctx.drawImage(tmp, ox, oy - s);
        ctx.drawImage(tmp, ox - s, oy - s);
      } else {
        // Move individual regions
        for (const regionData of moveRef.current.regions) {
          moveTextureInRegion(tdx, tdy, regionData);
        }
      }
      return;
    }

    // Paint
    if (isPainting.current && toolMode === 'paint' && uv) {
      paintOnCanvas(block.id, uv[0], uv[1], paintSettings.brushSize, paintSettings.brushColor, paintSettings.brushOpacity);
    }
  }, [toolMode, canvasToUV, paintSettings, block.id, zoom, moveTextureInRegion]);

  const handlePointerUp = useCallback(() => {
    isPainting.current = false;
    moveRef.current = null;
  }, []);

  // Redraw
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#12122a';
    ctx.fillRect(0, 0, w, h);

    // Checkerboard
    const cs = 12 * zoom;
    for (let y = 0; y < h; y += cs) {
      for (let x = 0; x < w; x += cs) {
        ctx.fillStyle = (Math.floor(x / cs) + Math.floor(y / cs)) % 2 === 0 ? '#1a1a38' : '#161630';
        ctx.fillRect(x, y, cs, cs);
      }
    }

    ctx.save();
    ctx.translate(pan[0], pan[1]);
    ctx.scale(zoom, zoom);

    const uvW = w / zoom;
    const uvH = h / zoom;
    const uToX = (u: number) => u * uvW;
    const vToY = (v: number) => (1 - v) * uvH;

    // Paint data
    if (block.hasPaintData) {
      const paintCanvas = getPaintCanvas(block.id);
      ctx.drawImage(paintCanvas, 0, 0, uvW, uvH);
    }

    // Region grid
    for (const { key, label, region } of UV_REGION_LABELS) {
      const [uMin, vMin, uMax, vMax] = region;
      const rx = uToX(uMin), ry = vToY(vMax);
      const rw = (uMax - uMin) * uvW, rh = (vMax - vMin) * uvH;

      const isHovered = hoveredRegion === key;

      if (isHovered) {
        ctx.fillStyle = toolMode === 'move' ? 'rgba(78, 205, 196, 0.15)' : 'rgba(233, 69, 96, 0.12)';
        ctx.fillRect(rx, ry, rw, rh);
      }

      ctx.strokeStyle = isHovered ? 'rgba(233, 69, 96, 0.9)' : 'rgba(100, 150, 255, 0.35)';
      ctx.lineWidth = (isHovered ? 2.5 : 1) / zoom;
      ctx.setLineDash([6 / zoom, 4 / zoom]);
      ctx.strokeRect(rx, ry, rw, rh);
      ctx.setLineDash([]);

      ctx.fillStyle = isHovered ? 'rgba(233, 69, 96, 0.95)' : 'rgba(100, 180, 255, 0.6)';
      ctx.font = `bold ${14 / zoom}px monospace`;
      ctx.fillText(label, rx + 8 / zoom, ry + 20 / zoom);
    }

    // Wireframe
    ctx.strokeStyle = 'rgba(233, 69, 96, 0.45)';
    ctx.lineWidth = 0.8 / zoom;
    ctx.beginPath();
    for (const [u1, v1, u2, v2] of wireframe.edges) {
      ctx.moveTo(uToX(u1), vToY(v1));
      ctx.lineTo(uToX(u2), vToY(v2));
    }
    ctx.stroke();

    // Vertices
    ctx.fillStyle = 'rgba(233, 69, 96, 0.6)';
    const dotR = 1.5 / zoom;
    const drawn = new Set<string>();
    for (const [u1, v1, u2, v2] of wireframe.edges) {
      for (const [u, v] of [[u1, v1], [u2, v2]]) {
        const k = `${Math.round(u * 100)},${Math.round(v * 100)}`;
        if (!drawn.has(k)) { drawn.add(k); ctx.beginPath(); ctx.arc(uToX(u), vToY(v), dotR, 0, Math.PI * 2); ctx.fill(); }
      }
    }

    ctx.restore();

    // Move cursor indicator
    if (toolMode === 'move' && hoveredRegion) {
      ctx.save();
      ctx.fillStyle = 'rgba(78, 205, 196, 0.8)';
      ctx.font = '11px sans-serif';
      ctx.fillText('Drag to move texture', 10, h - 10);
      ctx.restore();
    }
  }, [block.id, block.hasPaintData, wireframe, zoom, pan, toolMode, hoveredRegion]);

  useEffect(() => {
    let raf: number;
    const loop = () => { redraw(); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [redraw]);

  // Scroll to zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setZoom((z) => Math.max(0.3, Math.min(5, z + delta)));
  }, []);

  // Middle mouse to pan
  const panRef = useRef<{ startX: number; startY: number; startPan: [number, number] } | null>(null);
  const handleMiddleDown = useCallback((e: React.PointerEvent) => {
    if (e.button === 1) {
      e.preventDefault();
      panRef.current = { startX: e.clientX, startY: e.clientY, startPan: [...pan] };
    }
  }, [pan]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!panRef.current) return;
      const dx = e.clientX - panRef.current.startX;
      const dy = e.clientY - panRef.current.startY;
      setPan([panRef.current.startPan[0] + dx, panRef.current.startPan[1] + dy]);
    };
    const onUp = () => { panRef.current = null; };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
  }, []);

  const handleClear = () => { clearPaintData(block.id); onUpdate({ hasPaintData: false }); onCommit(); };

  const cursorMap: Record<ToolMode, string> = {
    paint: paintSettings.enabled ? 'crosshair' : 'default',
    fill: 'pointer',
    move: hoveredRegion ? 'grab' : 'default',
  };

  return (
    <div className="uv-modal-overlay" onClick={onClose}>
      <div className="uv-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="uv-modal-header">
          <span className="uv-modal-title">UV Editor</span>
          <button className="uv-modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="uv-modal-body">
          {/* Left: Toolbar */}
          <div className="uv-modal-sidebar">
            <div className="uv-modal-tools">
              <span className="uv-sidebar-label">Tools</span>
              <button className={`uv-modal-tool-btn ${toolMode === 'move' ? 'active' : ''}`} onClick={() => setToolMode('move')} title="Move Texture">
                <Move size={16} /> Move
              </button>
              <button className={`uv-modal-tool-btn ${toolMode === 'paint' ? 'active' : ''}`} onClick={() => setToolMode('paint')} title="Paint Brush">
                <Paintbrush size={16} /> Paint
              </button>
              <button className={`uv-modal-tool-btn ${toolMode === 'fill' ? 'active' : ''}`} onClick={() => setToolMode('fill')} title="Fill Region">
                <PaintBucket size={16} /> Fill
              </button>
            </div>

            {/* Move scope selector */}
            {toolMode === 'move' && (
              <div className="uv-modal-move-scope">
                <span className="uv-sidebar-label">Move Scope</span>
                <div className="uv-scope-btns">
                  <button
                    className={`uv-scope-btn ${moveScope === 'single' ? 'active' : ''}`}
                    onClick={() => setMoveScope('single')}
                  >
                    Single Face
                  </button>
                  <button
                    className={`uv-scope-btn ${moveScope === 'all' ? 'active' : ''}`}
                    onClick={() => setMoveScope('all')}
                  >
                    All Faces
                  </button>
                </div>
                <div className="uv-scope-hint">
                  {moveScope === 'single'
                    ? 'Drag on a face to move its texture'
                    : 'Drag anywhere to move all textures as one image'}
                </div>
              </div>
            )}

            {/* Texture Zoom & Rotate */}
            {toolMode === 'move' && block.hasPaintData && (
              <div className="uv-modal-transform-panel">
                <span className="uv-sidebar-label">Zoom Texture</span>
                <div className="uv-transform-row">
                  <button className="uv-transform-btn" title="Zoom Out" onClick={() => {
                    if (moveScope === 'all') { scaleFullCanvas(block.id, 0.9); }
                    else { for (const r of UV_REGION_LABELS) scaleRegion(block.id, r.region, 0.9); }
                  }}><ZoomOut size={14} /></button>
                  <button className="uv-transform-btn" title="Zoom In" onClick={() => {
                    if (moveScope === 'all') { scaleFullCanvas(block.id, 1.1); }
                    else { for (const r of UV_REGION_LABELS) scaleRegion(block.id, r.region, 1.1); }
                  }}><ZoomIn size={14} /></button>
                  <button className="uv-transform-btn-text" onClick={() => {
                    if (moveScope === 'all') { scaleFullCanvas(block.id, 0.5); }
                    else { for (const r of UV_REGION_LABELS) scaleRegion(block.id, r.region, 0.5); }
                  }}>50%</button>
                  <button className="uv-transform-btn-text" onClick={() => {
                    if (moveScope === 'all') { scaleFullCanvas(block.id, 2); }
                    else { for (const r of UV_REGION_LABELS) scaleRegion(block.id, r.region, 2); }
                  }}>200%</button>
                </div>

                <span className="uv-sidebar-label">Rotate Texture</span>
                <div className="uv-transform-row">
                  <button className="uv-transform-btn" title="Rotate -90°" onClick={() => {
                    if (moveScope === 'all') { rotateFullCanvas(block.id, -90); }
                    else { for (const r of UV_REGION_LABELS) rotateRegion(block.id, r.region, -90); }
                  }}><RotateCcw size={14} /></button>
                  <button className="uv-transform-btn" title="Rotate +90°" onClick={() => {
                    if (moveScope === 'all') { rotateFullCanvas(block.id, 90); }
                    else { for (const r of UV_REGION_LABELS) rotateRegion(block.id, r.region, 90); }
                  }}><RotateCw size={14} /></button>
                  <button className="uv-transform-btn-text" onClick={() => {
                    if (moveScope === 'all') { rotateFullCanvas(block.id, -15); }
                    else { for (const r of UV_REGION_LABELS) rotateRegion(block.id, r.region, -15); }
                  }}>-15°</button>
                  <button className="uv-transform-btn-text" onClick={() => {
                    if (moveScope === 'all') { rotateFullCanvas(block.id, 15); }
                    else { for (const r of UV_REGION_LABELS) rotateRegion(block.id, r.region, 15); }
                  }}>+15°</button>
                  <button className="uv-transform-btn-text" onClick={() => {
                    if (moveScope === 'all') { rotateFullCanvas(block.id, 45); }
                    else { for (const r of UV_REGION_LABELS) rotateRegion(block.id, r.region, 45); }
                  }}>+45°</button>
                </div>
              </div>
            )}

            {/* Fill texture picker */}
            {toolMode === 'fill' && (
              <div className="uv-modal-fill-panel">
                <span className="uv-sidebar-label">Fill Color</span>
                <input type="color" value={fillColor} onChange={(e) => setFillColor(e.target.value)} className="color-picker" />

                <span className="uv-sidebar-label">Texture</span>
                <div className="uv-modal-tex-grid">
                  <button className={`uv-modal-tex-btn ${selectedTexture === 'none' ? 'active' : ''}`} onClick={() => setSelectedTexture('none')}>Solid</button>
                  {TEXTURE_PRESETS.filter((p) => p.id !== 'none').map((p) => (
                    <button key={p.id} className={`uv-modal-tex-btn ${selectedTexture === p.id ? 'active' : ''}`} onClick={() => setSelectedTexture(p.id)} title={p.name}>
                      <img src={previews[p.id]} alt={p.name} className="uv-modal-tex-thumb" />
                    </button>
                  ))}
                </div>

                <button className="uv-modal-fill-all" onClick={() => {
                  ensurePaintData();
                  for (const item of UV_REGION_LABELS) {
                    if (selectedTexture === 'none') fillRegionWithColor(block.id, item.region, fillColor);
                    else { const t = generateProceduralTexture(selectedTexture, fillColor, 1); if (t) fillRegionWithImage(block.id, item.region, t.image as HTMLCanvasElement); }
                  }
                  if (!block.hasPaintData) { onUpdate({ hasPaintData: true }); onCommit(); }
                }}>
                  Fill All
                </button>
              </div>
            )}

            {/* Region list */}
            <div className="uv-modal-regions">
              <span className="uv-sidebar-label">Regions</span>
              {UV_REGION_LABELS.map(({ key, label, region }) => (
                <div key={key} className={`uv-modal-region-row ${hoveredRegion === key ? 'hovered' : ''}`}>
                  <span className="uv-modal-region-label">{label}</span>
                  <button className="uv-region-action" title={`Fill ${label}`} onClick={() => {
                    ensurePaintData();
                    if (selectedTexture === 'none') fillRegionWithColor(block.id, region, fillColor);
                    else { const t = generateProceduralTexture(selectedTexture, fillColor, 1); if (t) fillRegionWithImage(block.id, region, t.image as HTMLCanvasElement); }
                    if (!block.hasPaintData) { onUpdate({ hasPaintData: true }); onCommit(); }
                  }}><PaintBucket size={11} /></button>
                  <button className="uv-region-action" title={`Clear ${label}`} onClick={() => clearRegion(block.id, region)}>
                    <Eraser size={11} />
                  </button>
                </div>
              ))}
            </div>

            {block.hasPaintData && (
              <button className="uv-modal-clear-all" onClick={handleClear}>
                <Eraser size={14} /> Clear All
              </button>
            )}
          </div>

          {/* Center: Canvas */}
          <div className="uv-modal-canvas-area" ref={containerRef}>
            <div className="uv-modal-canvas-toolbar">
              <button className="stretch-btn" onClick={() => setZoom((z) => Math.min(5, z + 0.3))}><ZoomIn size={14} /></button>
              <button className="stretch-btn" onClick={() => setZoom((z) => Math.max(0.3, z - 0.3))}><ZoomOut size={14} /></button>
              <button className="stretch-btn" onClick={() => { setZoom(1); setPan([0, 0]); }}>1:1</button>
              <button className="stretch-btn" onClick={() => {
                const s = canvasSize / (canvasSize * 1);
                setZoom(s); setPan([0, 0]);
              }}><Maximize size={14} /></button>
              <span className="uv-modal-zoom-label">{Math.round(zoom * 100)}%</span>
            </div>
            <canvas
              ref={canvasRef}
              width={canvasSize}
              height={canvasSize}
              className="uv-modal-canvas"
              onPointerDown={(e) => { handleMiddleDown(e); if (e.button === 0) handlePointerDown(e); }}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={() => { handlePointerUp(); setHoveredRegion(null); }}
              onWheel={handleWheel}
              style={{ cursor: cursorMap[toolMode], width: canvasSize, height: canvasSize }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
