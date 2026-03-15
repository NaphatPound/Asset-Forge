import { useState, useRef } from 'react';
import {
  Move, RotateCw, Maximize2, Grid3x3, Magnet,
  Undo2, Redo2, FilePlus, Save, Upload, Download,
  Trash2, Copy, FlipHorizontal, Expand,
} from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';
import type { Block, TransformMode } from '../../types/editor';
import ExportDialog from '../export/ExportDialog';
import './Header.css';

export default function Header() {
  const transformMode = useEditorStore((s) => s.transformMode);
  const setTransformMode = useEditorStore((s) => s.setTransformMode);
  const gridSnap = useEditorStore((s) => s.gridSnap);
  const toggleGridSnap = useEditorStore((s) => s.toggleGridSnap);
  const showGrid = useEditorStore((s) => s.showGrid);
  const toggleGrid = useEditorStore((s) => s.toggleGrid);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const clearScene = useEditorStore((s) => s.clearScene);
  const blocks = useEditorStore((s) => s.blocks);
  const loadScene = useEditorStore((s) => s.loadScene);
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const duplicateBlock = useEditorStore((s) => s.duplicateBlock);
  const removeBlock = useEditorStore((s) => s.removeBlock);
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showExport, setShowExport] = useState(false);

  const handleSave = () => {
    const data = JSON.stringify({ version: 1, blocks }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scene.assetforge.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.blocks) loadScene(data.blocks as Block[]);
      } catch { /* invalid file */ }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleMirror = () => {
    if (!selectedBlockId) return;
    const block = useEditorStore.getState().blocks.find((b) => b.id === selectedBlockId);
    if (block) {
      updateBlock(selectedBlockId, { scale: [-block.scale[0], block.scale[1], block.scale[2]] });
    }
  };

  const modeBtn = (mode: TransformMode, Icon: typeof Move, label: string, shortcut: string) => (
    <button
      className={`icon-btn tooltip ${transformMode === mode ? 'active' : ''}`}
      data-tooltip={`${label} (${shortcut})`}
      onClick={() => setTransformMode(mode)}
    >
      <Icon size={16} />
    </button>
  );

  return (
    <>
      <header className="header">
        <div className="header-left">
          <span className="header-logo">Asset Forge</span>
          <div className="header-divider" />
          <button className="icon-btn tooltip" data-tooltip="New Scene" onClick={clearScene}>
            <FilePlus size={16} />
          </button>
          <button className="icon-btn tooltip" data-tooltip="Save Project" onClick={handleSave}>
            <Save size={16} />
          </button>
          <button className="icon-btn tooltip" data-tooltip="Load Project" onClick={() => fileInputRef.current?.click()}>
            <Upload size={16} />
          </button>
          <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleLoad} />
          <div className="header-divider" />
          <button className="icon-btn tooltip" data-tooltip="Undo (Ctrl+Z)" onClick={undo}>
            <Undo2 size={16} />
          </button>
          <button className="icon-btn tooltip" data-tooltip="Redo (Ctrl+Shift+Z)" onClick={redo}>
            <Redo2 size={16} />
          </button>
        </div>

        <div className="header-center">
          {modeBtn('translate', Move, 'Move', 'W')}
          {modeBtn('rotate', RotateCw, 'Rotate', 'E')}
          {modeBtn('scale', Maximize2, 'Scale', 'R')}
          {modeBtn('stretch', Expand, 'Stretch', 'T')}
          <div className="header-divider" />
          <button
            className={`icon-btn tooltip ${showGrid ? 'active' : ''}`}
            data-tooltip="Toggle Grid (G)"
            onClick={toggleGrid}
          >
            <Grid3x3 size={16} />
          </button>
          <button
            className={`icon-btn tooltip ${gridSnap ? 'active' : ''}`}
            data-tooltip="Snap to Grid"
            onClick={toggleGridSnap}
          >
            <Magnet size={16} />
          </button>
          <div className="header-divider" />
          <button
            className="icon-btn tooltip"
            data-tooltip="Mirror (X)"
            onClick={handleMirror}
            disabled={!selectedBlockId}
          >
            <FlipHorizontal size={16} />
          </button>
          <button
            className="icon-btn tooltip"
            data-tooltip="Duplicate (Ctrl+D)"
            onClick={() => selectedBlockId && duplicateBlock(selectedBlockId)}
            disabled={!selectedBlockId}
          >
            <Copy size={16} />
          </button>
          <button
            className="icon-btn tooltip"
            data-tooltip="Delete (Del)"
            onClick={() => selectedBlockId && removeBlock(selectedBlockId)}
            disabled={!selectedBlockId}
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="header-right">
          <button className="btn btn-primary" onClick={() => setShowExport(true)}>
            <Download size={14} />
            Export
          </button>
        </div>
      </header>
      {showExport && <ExportDialog onClose={() => setShowExport(false)} />}
    </>
  );
}
