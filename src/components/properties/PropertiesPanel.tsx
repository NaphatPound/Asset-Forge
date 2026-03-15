import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useEditorStore } from '../../store/useEditorStore';
import TransformInputs from './TransformInputs';
import MaterialEditor from './MaterialEditor';
import TextureEditor from './TextureEditor';
import UVEditor from './UVEditor';
import UVEditorModal from './UVEditorModal';
import { Eye, EyeOff, Lock, Unlock, Maximize2 } from 'lucide-react';
import './PropertiesPanel.css';

export default function PropertiesPanel() {
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const blocks = useEditorStore((s) => s.blocks);
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const saveSnapshot = useEditorStore((s) => s.saveSnapshot);
  const [showUVModal, setShowUVModal] = useState(false);

  const block = blocks.find((b) => b.id === selectedBlockId);

  if (!block) {
    return (
      <div className="properties-panel">
        <div className="panel-header">Properties</div>
        <div className="properties-empty">
          Select a block to edit its properties
        </div>
      </div>
    );
  }

  const handleUpdate = (updates: Record<string, any>) => {
    updateBlock(block.id, updates);
  };

  const handleCommit = () => {
    saveSnapshot();
  };

  return (
    <>
      <div className="properties-panel">
        <div className="panel-header">Properties</div>
        <div className="properties-content">
          <div className="properties-section">
            <div className="property-row">
              <input
                className="property-name-input"
                value={block.name}
                onChange={(e) => handleUpdate({ name: e.target.value })}
              />
              <button
                className="icon-btn tooltip"
                data-tooltip={block.visible ? 'Hide (H)' : 'Show (H)'}
                onClick={() => { handleUpdate({ visible: !block.visible }); handleCommit(); }}
              >
                {block.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <button
                className="icon-btn tooltip"
                data-tooltip={block.locked ? 'Unlock' : 'Lock'}
                onClick={() => { handleUpdate({ locked: !block.locked }); handleCommit(); }}
              >
                {block.locked ? <Lock size={14} /> : <Unlock size={14} />}
              </button>
            </div>
          </div>

          <div className="properties-section">
            <div className="section-label">Transform</div>
            <TransformInputs block={block} onUpdate={handleUpdate} onCommit={handleCommit} />
          </div>

          <div className="properties-section">
            <div className="section-label">Material</div>
            <MaterialEditor block={block} onUpdate={handleUpdate} onCommit={handleCommit} />
          </div>

          <div className="properties-section">
            <div className="section-label">Texture</div>
            <TextureEditor block={block} onUpdate={handleUpdate} onCommit={handleCommit} />
          </div>

          <div className="properties-section">
            <div className="section-label-row">
              <span className="section-label">UV / Paint Canvas</span>
              <button
                className="uv-fullscreen-btn"
                onClick={() => setShowUVModal(true)}
                title="Open fullscreen UV Editor"
              >
                <Maximize2 size={12} />
                Fullscreen
              </button>
            </div>
            <UVEditor block={block} onUpdate={handleUpdate} onCommit={handleCommit} />
          </div>
        </div>
      </div>
      {showUVModal && createPortal(
        <UVEditorModal
          block={block}
          onUpdate={handleUpdate}
          onCommit={handleCommit}
          onClose={() => setShowUVModal(false)}
        />,
        document.body
      )}
    </>
  );
}
