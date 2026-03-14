import { useState, useEffect, useRef, useCallback } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';
import { exportGLTF } from '../../utils/exportGLTF';
import { exportOBJ } from '../../utils/exportOBJ';
import { exportPNG, exportPNGBatch, renderPreview, CAMERA_PRESETS, type CameraSettings } from '../../utils/exportPNG';
import { FILTER_LABELS, type FilterType } from '../../utils/imageFilters';
import './ExportDialog.css';

interface ExportDialogProps {
  onClose: () => void;
}

const PRESET_LABELS: Record<string, string> = {
  front: 'Front',
  back: 'Back',
  left: 'Left',
  right: 'Right',
  top: 'Top',
  isometric: 'Iso',
};

interface ScreenSize {
  label: string;
  width: number;
  height: number;
}

const SCREEN_SIZES: ScreenSize[] = [
  { label: '1:1', width: 256, height: 256 },
  { label: '16:9', width: 320, height: 180 },
  { label: '4:3', width: 280, height: 210 },
  { label: '9:16', width: 180, height: 320 },
  { label: '3:2', width: 300, height: 200 },
  { label: '21:9', width: 336, height: 144 },
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function ExportDialog({ onClose }: ExportDialogProps) {
  const blocks = useEditorStore((s) => s.blocks);
  const [tab, setTab] = useState<'3d' | '2d'>('3d');
  const [format3D, setFormat3D] = useState<'glb' | 'gltf' | 'obj'>('glb');
  const [resolution, setResolution] = useState(512);
  const [transparent, setTransparent] = useState(true);
  const [batchMode, setBatchMode] = useState(false);
  const [filter, setFilter] = useState<FilterType>('none');
  const [exporting, setExporting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [camera, setCamera] = useState<CameraSettings>({ ...CAMERA_PRESETS.isometric });
  const [activePreset, setActivePreset] = useState<string | null>('isometric');
  const [screenSize, setScreenSize] = useState<ScreenSize>(SCREEN_SIZES[0]);
  const previewGenRef = useRef(0);
  const previewElRef = useRef<HTMLDivElement | null>(null);
  const wheelCleanupRef = useRef<(() => void) | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; startAz: number; startEl: number } | null>(null);
  const animRef = useRef<number | null>(null);

  // Preview rendering
  useEffect(() => {
    if (tab !== '2d' || blocks.length === 0 || batchMode) {
      setPreviewUrl(null);
      return;
    }

    const gen = ++previewGenRef.current;
    const timer = setTimeout(() => {
      try {
        const canvas = renderPreview(blocks, {
          width: resolution,
          height: resolution,
          transparent,
          camera,
          supersample: 1,
          filter,
        });
        if (gen === previewGenRef.current) {
          setPreviewUrl(canvas.toDataURL());
        }
      } catch {
        if (gen === previewGenRef.current) {
          setPreviewUrl(null);
        }
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [tab, blocks, resolution, transparent, camera, batchMode, filter]);

  // Smooth camera animation
  const animateCamera = useCallback((target: CameraSettings) => {
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const start = { ...camera };
    const startTime = performance.now();
    const duration = 400;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const rawT = Math.min(elapsed / duration, 1);
      const t = easeOutCubic(rawT);

      const next: CameraSettings = {
        azimuth: lerp(start.azimuth, target.azimuth, t),
        elevation: lerp(start.elevation, target.elevation, t),
        distance: lerp(start.distance, target.distance, t),
      };
      setCamera(next);

      if (rawT < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        animRef.current = null;
      }
    };

    animRef.current = requestAnimationFrame(tick);
  }, [camera]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  // Drag-to-orbit handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null; }
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startAz: camera.azimuth,
      startEl: camera.elevation,
    };
  }, [camera]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    const newAz = dragRef.current.startAz + dx * 0.8;
    const newEl = Math.max(-89, Math.min(89, dragRef.current.startEl - dy * 0.5));
    setCamera((prev) => ({ ...prev, azimuth: newAz, elevation: newEl }));
    setActivePreset(null);
  }, []);

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  // Callback ref for preview div — attaches non-passive wheel listener on mount
  const previewRef = useCallback((el: HTMLDivElement | null) => {
    if (wheelCleanupRef.current) {
      wheelCleanupRef.current();
      wheelCleanupRef.current = null;
    }
    previewElRef.current = el;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null; }
      setCamera((prev) => ({
        ...prev,
        distance: Math.max(2, Math.min(30, prev.distance + e.deltaY * 0.01)),
      }));
      setActivePreset(null);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    wheelCleanupRef.current = () => el.removeEventListener('wheel', onWheel);
  }, []);

  const handlePresetClick = (key: string) => {
    animateCamera({ ...CAMERA_PRESETS[key] });
    setActivePreset(key);
  };

  const handleResetCamera = () => {
    animateCamera({ ...CAMERA_PRESETS.isometric });
    setActivePreset('isometric');
  };

  const handleExport3D = async () => {
    setExporting(true);
    try {
      if (format3D === 'obj') {
        await exportOBJ(blocks);
      } else {
        await exportGLTF(blocks, format3D === 'glb');
      }
    } finally {
      setExporting(false);
    }
  };

  const handleExport2D = () => {
    setExporting(true);
    try {
      if (batchMode) {
        exportPNGBatch(blocks, { width: resolution, height: resolution, transparent, supersample: 2, filter }, [
          'front', 'back', 'left', 'right', 'top', 'isometric',
        ]);
      } else {
        exportPNG(blocks, {
          width: resolution,
          height: resolution,
          transparent,
          camera,
          supersample: 2,
          filter,
        });
      }
    } finally {
      setExporting(false);
    }
  };

  // Disable main viewport interaction while dialog is open
  useEffect(() => {
    const viewport = document.querySelector('.viewport') as HTMLElement | null;
    if (viewport) {
      viewport.style.pointerEvents = 'none';
      return () => { viewport.style.pointerEvents = ''; };
    }
  }, []);

  return (
    <div className="export-overlay" onClick={onClose}>
      <div className={`export-dialog ${tab === '2d' ? 'export-dialog--wide' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="export-header">
          <span>Export</span>
          <button className="icon-btn" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="export-tabs">
          <button className={`export-tab ${tab === '3d' ? 'active' : ''}`} onClick={() => setTab('3d')}>
            3D Model
          </button>
          <button className={`export-tab ${tab === '2d' ? 'active' : ''}`} onClick={() => setTab('2d')}>
            2D Sprite
          </button>
        </div>

        <div className="export-body">
          {tab === '3d' ? (
            <div className="export-options">
              <label className="export-label">
                Format
                <select value={format3D} onChange={(e) => setFormat3D(e.target.value as any)}>
                  <option value="glb">GLB (Binary)</option>
                  <option value="gltf">glTF (JSON)</option>
                  <option value="obj">OBJ</option>
                </select>
              </label>
              <div className="export-info">
                {blocks.filter((b) => b.visible).length} visible blocks will be exported
              </div>
              <button className="btn btn-primary export-btn" onClick={handleExport3D} disabled={exporting || blocks.length === 0}>
                {exporting ? 'Exporting...' : 'Export 3D'}
              </button>
            </div>
          ) : (
            <div className="export-2d-layout">
              <div className="export-preview-col">
                <div className="export-screen-sizes">
                  {SCREEN_SIZES.map((s) => (
                    <button
                      key={s.label}
                      className={`export-screen-btn ${screenSize.label === s.label ? 'active' : ''}`}
                      onClick={() => setScreenSize(s)}
                      title={`${s.width} x ${s.height}`}
                    >
                      <span
                        className="export-screen-icon"
                        style={{
                          width: Math.round(s.width / s.height * 14),
                          height: Math.round(s.height / s.width > 1 ? 14 : 14 * s.height / s.width),
                        }}
                      />
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
                <div
                  className="export-preview"
                  ref={previewRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  style={{
                    width: screenSize.width,
                    height: screenSize.height,
                  }}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Export preview" draggable={false} />
                  ) : (
                    <span className="export-preview-placeholder">
                      {blocks.length === 0 ? 'No blocks in scene' : batchMode ? 'Preview N/A\nin batch mode' : 'Generating...'}
                    </span>
                  )}
                </div>
                <div className="export-preview-hint">Drag to orbit / Scroll to zoom</div>
                <div className="export-camera-presets">
                  {Object.keys(PRESET_LABELS).map((key) => (
                    <button
                      key={key}
                      className={`export-preset-btn ${activePreset === key ? 'active' : ''}`}
                      onClick={() => handlePresetClick(key)}
                    >
                      {PRESET_LABELS[key]}
                    </button>
                  ))}
                  <button className="export-preset-btn" onClick={handleResetCamera} title="Reset camera">
                    <RotateCcw size={12} />
                  </button>
                </div>
              </div>
              <div className="export-options">
                <label className="export-label">
                  Resolution
                  <select value={resolution} onChange={(e) => setResolution(Number(e.target.value))}>
                    <option value={128}>128 x 128</option>
                    <option value={256}>256 x 256</option>
                    <option value={512}>512 x 512</option>
                    <option value={1024}>1024 x 1024</option>
                    <option value={2048}>2048 x 2048</option>
                  </select>
                </label>
                <label className="export-label">
                  Filter
                  <select value={filter} onChange={(e) => setFilter(e.target.value as FilterType)}>
                    {(Object.keys(FILTER_LABELS) as FilterType[]).map((f) => (
                      <option key={f} value={f}>{FILTER_LABELS[f]}</option>
                    ))}
                  </select>
                </label>
                <label className="export-checkbox">
                  <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} />
                  Transparent background
                </label>
                <label className="export-checkbox">
                  <input type="checkbox" checked={batchMode} onChange={(e) => setBatchMode(e.target.checked)} />
                  Batch export (all angles)
                </label>
                <div className="export-camera-info">
                  Az: {Math.round(camera.azimuth)}° / El: {Math.round(camera.elevation)}° / Dist: {camera.distance.toFixed(1)}
                </div>
                <button className="btn btn-primary export-btn" onClick={handleExport2D} disabled={exporting || blocks.length === 0}>
                  {exporting ? 'Exporting...' : 'Export PNG'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
