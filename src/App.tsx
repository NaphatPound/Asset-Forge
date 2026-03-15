import { useEffect } from 'react';
import { useEditorStore } from './store/useEditorStore';
import Header from './components/layout/Header';
import LeftPanel from './components/layout/LeftPanel';
import RightPanel from './components/layout/RightPanel';
import BottomBar from './components/layout/BottomBar';
import Viewport from './components/viewport/Viewport';
import './App.css';

export default function App() {
  const selectBlock = useEditorStore((s) => s.selectBlock);
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const blocks = useEditorStore((s) => s.blocks);
  const removeBlock = useEditorStore((s) => s.removeBlock);
  const duplicateBlock = useEditorStore((s) => s.duplicateBlock);
  const setTransformMode = useEditorStore((s) => s.setTransformMode);
  const toggleGrid = useEditorStore((s) => s.toggleGrid);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const updateBlock = useEditorStore((s) => s.updateBlock);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') return;

      switch (e.key.toLowerCase()) {
        case 'w':
          setTransformMode('translate');
          break;
        case 'e':
          setTransformMode('rotate');
          break;
        case 'r':
          setTransformMode('scale');
          break;
        case 't':
          setTransformMode('stretch');
          break;
        case 'delete':
        case 'backspace':
          if (selectedBlockId) removeBlock(selectedBlockId);
          break;
        case 'd':
          if ((e.ctrlKey || e.metaKey) && selectedBlockId) {
            e.preventDefault();
            duplicateBlock(selectedBlockId);
          }
          break;
        case 'z':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (e.shiftKey) redo();
            else undo();
          }
          break;
        case 'g':
          toggleGrid();
          break;
        case 'h':
          if (selectedBlockId) {
            const block = blocks.find((b) => b.id === selectedBlockId);
            if (block) updateBlock(selectedBlockId, { visible: !block.visible });
          }
          break;
        case 'escape':
          selectBlock(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBlockId, blocks, removeBlock, duplicateBlock, setTransformMode, toggleGrid, undo, redo, selectBlock, updateBlock]);

  return (
    <div className="app-layout">
      <Header />
      <div className="app-main">
        <LeftPanel />
        <Viewport />
        <RightPanel />
      </div>
      <BottomBar />
    </div>
  );
}
