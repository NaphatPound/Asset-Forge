import { useEditorStore } from '../../store/useEditorStore';
import { Eye, EyeOff, Lock, Unlock, Trash2, FolderOpen, Folder, ChevronRight, ChevronDown, Ungroup, FolderPlus } from 'lucide-react';
import './SceneTree.css';

export default function SceneTree() {
  const blocks = useEditorStore((s) => s.blocks);
  const groups = useEditorStore((s) => s.groups);
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const selectedGroupId = useEditorStore((s) => s.selectedGroupId);
  const selectBlock = useEditorStore((s) => s.selectBlock);
  const selectGroup = useEditorStore((s) => s.selectGroup);
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const removeBlock = useEditorStore((s) => s.removeBlock);
  const createGroup = useEditorStore((s) => s.createGroup);
  const removeGroup = useEditorStore((s) => s.removeGroup);
  const renameGroup = useEditorStore((s) => s.renameGroup);
  const toggleGroupCollapsed = useEditorStore((s) => s.toggleGroupCollapsed);
  const addToGroup = useEditorStore((s) => s.addToGroup);
  const removeFromGroup = useEditorStore((s) => s.removeFromGroup);
  const ungroupBlocks = useEditorStore((s) => s.ungroupBlocks);

  const ungroupedBlocks = blocks.filter((b) => !b.groupId);

  const handleCreateGroup = () => {
    const groupId = createGroup(`Group ${groups.length + 1}`);
    // Add selected block to the new group
    if (selectedBlockId) {
      addToGroup(selectedBlockId, groupId);
    }
  };

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    e.dataTransfer.setData('blockId', blockId);
  };

  const handleDropOnGroup = (e: React.DragEvent, groupId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const blockId = e.dataTransfer.getData('blockId');
    if (blockId) addToGroup(blockId, groupId);
  };

  const handleDropOutside = (e: React.DragEvent) => {
    e.preventDefault();
    const blockId = e.dataTransfer.getData('blockId');
    if (blockId) removeFromGroup(blockId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="scene-tree">
      <div className="panel-header">
        <span>Scene</span>
        <div className="scene-header-actions">
          <button className="tree-action-btn" title="New Group" onClick={handleCreateGroup}>
            <FolderPlus size={13} />
          </button>
          <span className="scene-count">{blocks.length}</span>
        </div>
      </div>
      <div className="scene-tree-list" onDrop={handleDropOutside} onDragOver={handleDragOver}>
        {blocks.length === 0 && groups.length === 0 && (
          <div className="scene-tree-empty">No blocks in scene</div>
        )}

        {/* Groups */}
        {groups.map((group) => {
          const groupBlocks = blocks.filter((b) => b.groupId === group.id);
          const isSelected = selectedGroupId === group.id;

          return (
            <div key={group.id} className="scene-tree-group">
              <div
                className={`scene-tree-group-header ${isSelected ? 'selected' : ''}`}
                onClick={() => selectGroup(group.id)}
                onDrop={(e) => handleDropOnGroup(e, group.id)}
                onDragOver={handleDragOver}
              >
                <button
                  className="tree-collapse-btn"
                  onClick={(e) => { e.stopPropagation(); toggleGroupCollapsed(group.id); }}
                >
                  {group.collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                </button>
                {group.collapsed ? <Folder size={13} /> : <FolderOpen size={13} />}
                <input
                  className="tree-group-name"
                  value={group.name}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => renameGroup(group.id, e.target.value)}
                />
                <span className="tree-group-count">{groupBlocks.length}</span>
                <div className="tree-item-actions">
                  <button
                    className="tree-action-btn"
                    title="Ungroup"
                    onClick={(e) => { e.stopPropagation(); ungroupBlocks(group.id); }}
                  >
                    <Ungroup size={12} />
                  </button>
                  <button
                    className="tree-action-btn danger"
                    title="Delete Group & Blocks"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Remove all blocks in group then remove group
                      groupBlocks.forEach((b) => removeBlock(b.id));
                      removeGroup(group.id);
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {!group.collapsed && (
                <div className="scene-tree-group-children">
                  {groupBlocks.map((block) => (
                    <div
                      key={block.id}
                      className={`scene-tree-item grouped ${selectedBlockId === block.id ? 'selected' : ''}`}
                      onClick={() => selectBlock(block.id)}
                      draggable
                      onDragStart={(e) => handleDragStart(e, block.id)}
                    >
                      <span className="tree-item-name">{block.name}</span>
                      <div className="tree-item-actions">
                        <button className="tree-action-btn" onClick={(e) => { e.stopPropagation(); updateBlock(block.id, { visible: !block.visible }); }}>
                          {block.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                        </button>
                        <button className="tree-action-btn" onClick={(e) => { e.stopPropagation(); updateBlock(block.id, { locked: !block.locked }); }}>
                          {block.locked ? <Lock size={12} /> : <Unlock size={12} />}
                        </button>
                        <button className="tree-action-btn danger" onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Ungrouped blocks */}
        {ungroupedBlocks.map((block) => (
          <div
            key={block.id}
            className={`scene-tree-item ${selectedBlockId === block.id ? 'selected' : ''}`}
            onClick={() => selectBlock(block.id)}
            draggable
            onDragStart={(e) => handleDragStart(e, block.id)}
          >
            <span className="tree-item-name">{block.name}</span>
            <div className="tree-item-actions">
              <button className="tree-action-btn" onClick={(e) => { e.stopPropagation(); updateBlock(block.id, { visible: !block.visible }); }}>
                {block.visible ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>
              <button className="tree-action-btn" onClick={(e) => { e.stopPropagation(); updateBlock(block.id, { locked: !block.locked }); }}>
                {block.locked ? <Lock size={12} /> : <Unlock size={12} />}
              </button>
              <button className="tree-action-btn danger" onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}>
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
