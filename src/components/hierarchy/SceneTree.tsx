import { useEditorStore } from '../../store/useEditorStore';
import { Eye, EyeOff, Lock, Unlock, Trash2 } from 'lucide-react';
import './SceneTree.css';

export default function SceneTree() {
  const blocks = useEditorStore((s) => s.blocks);
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const selectBlock = useEditorStore((s) => s.selectBlock);
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const removeBlock = useEditorStore((s) => s.removeBlock);

  return (
    <div className="scene-tree">
      <div className="panel-header">
        <span>Scene</span>
        <span className="scene-count">{blocks.length}</span>
      </div>
      <div className="scene-tree-list">
        {blocks.length === 0 && (
          <div className="scene-tree-empty">No blocks in scene</div>
        )}
        {blocks.map((block) => (
          <div
            key={block.id}
            className={`scene-tree-item ${selectedBlockId === block.id ? 'selected' : ''}`}
            onClick={() => selectBlock(block.id)}
          >
            <span className="tree-item-name">{block.name}</span>
            <div className="tree-item-actions">
              <button
                className="tree-action-btn"
                onClick={(e) => { e.stopPropagation(); updateBlock(block.id, { visible: !block.visible }); }}
              >
                {block.visible ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>
              <button
                className="tree-action-btn"
                onClick={(e) => { e.stopPropagation(); updateBlock(block.id, { locked: !block.locked }); }}
              >
                {block.locked ? <Lock size={12} /> : <Unlock size={12} />}
              </button>
              <button
                className="tree-action-btn danger"
                onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
