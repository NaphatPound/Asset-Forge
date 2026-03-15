import { create } from 'zustand';
import type { Block, EditorState, TransformMode, GridType, PaintSettings } from '../types/editor';
import { mechTemplates } from '../blocks/mechTemplates';

const MAX_HISTORY = 50;

let idCounter = 0;
const generateId = () => `block_${++idCounter}_${Date.now()}`;

export const useEditorStore = create<EditorState>((set, get) => ({
  blocks: [],
  selectedBlockId: null,
  transformMode: 'translate',
  gridType: 'square',
  gridSize: 0.5,
  gridSnap: true,
  showGrid: true,
  history: [[]],
  historyIndex: 0,
  paintSettings: {
    enabled: false,
    brushSize: 5,
    brushColor: '#ff0000',
    brushOpacity: 1,
  },

  addBlock: (type: string, name: string) => {
    const id = generateId();
    const newBlock: Block = {
      id,
      type,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: '#e94560',
      metalness: 0.1,
      roughness: 0.7,
      visible: true,
      locked: false,
      name: name || type,
      textureType: 'none',
      textureScale: 1,
      hasPaintData: false,
    };
    set((state) => {
      const blocks = [...state.blocks, newBlock];
      const history = state.history.slice(0, state.historyIndex + 1);
      history.push(blocks);
      if (history.length > MAX_HISTORY) history.shift();
      return {
        blocks,
        selectedBlockId: id,
        history,
        historyIndex: Math.min(history.length - 1, state.historyIndex + 1),
      };
    });
  },

  removeBlock: (id: string) => {
    set((state) => {
      const blocks = state.blocks.filter((b) => b.id !== id);
      const history = state.history.slice(0, state.historyIndex + 1);
      history.push(blocks);
      if (history.length > MAX_HISTORY) history.shift();
      return {
        blocks,
        selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
        history,
        historyIndex: Math.min(history.length - 1, state.historyIndex + 1),
      };
    });
  },

  duplicateBlock: (id: string) => {
    const state = get();
    const block = state.blocks.find((b) => b.id === id);
    if (!block) return;
    const newId = generateId();
    const duplicate: Block = {
      ...block,
      id: newId,
      name: `${block.name} Copy`,
      position: [block.position[0] + 0.5, block.position[1], block.position[2] + 0.5],
    };
    set((state) => {
      const blocks = [...state.blocks, duplicate];
      const history = state.history.slice(0, state.historyIndex + 1);
      history.push(blocks);
      if (history.length > MAX_HISTORY) history.shift();
      return {
        blocks,
        selectedBlockId: newId,
        history,
        historyIndex: Math.min(history.length - 1, state.historyIndex + 1),
      };
    });
  },

  updateBlock: (id: string, updates: Partial<Block>) => {
    set((state) => ({
      blocks: state.blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }));
  },

  selectBlock: (id: string | null) => set({ selectedBlockId: id }),

  clearSelection: () => set({ selectedBlockId: null }),

  setTransformMode: (mode: TransformMode) => set({ transformMode: mode }),

  setGridType: (type: GridType) => set({ gridType: type }),

  setGridSize: (size: number) => set({ gridSize: size }),

  toggleGridSnap: () => set((state) => ({ gridSnap: !state.gridSnap })),

  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),

  togglePaintMode: () => set((state) => ({
    paintSettings: { ...state.paintSettings, enabled: !state.paintSettings.enabled },
  })),

  updatePaintSettings: (updates: Partial<PaintSettings>) => set((state) => ({
    paintSettings: { ...state.paintSettings, ...updates },
  })),

  undo: () => {
    set((state) => {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      return {
        blocks: state.history[newIndex],
        historyIndex: newIndex,
        selectedBlockId: null,
      };
    });
  },

  redo: () => {
    set((state) => {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      return {
        blocks: state.history[newIndex],
        historyIndex: newIndex,
        selectedBlockId: null,
      };
    });
  },

  saveSnapshot: () => {
    set((state) => {
      const history = state.history.slice(0, state.historyIndex + 1);
      history.push([...state.blocks]);
      if (history.length > MAX_HISTORY) history.shift();
      return {
        history,
        historyIndex: Math.min(history.length - 1, state.historyIndex + 1),
      };
    });
  },

  clearScene: () => {
    set((state) => {
      const history = state.history.slice(0, state.historyIndex + 1);
      history.push([]);
      if (history.length > MAX_HISTORY) history.shift();
      return {
        blocks: [],
        selectedBlockId: null,
        history,
        historyIndex: Math.min(history.length - 1, state.historyIndex + 1),
      };
    });
  },

  loadScene: (blocks: Block[]) => {
    set((state) => {
      const history = state.history.slice(0, state.historyIndex + 1);
      history.push(blocks);
      if (history.length > MAX_HISTORY) history.shift();
      return {
        blocks,
        selectedBlockId: null,
        history,
        historyIndex: Math.min(history.length - 1, state.historyIndex + 1),
      };
    });
  },

  loadTemplate: (templateId: string) => {
    const template = mechTemplates.find((t) => t.id === templateId);
    if (!template) return;

    const newBlocks: Block[] = template.parts.map((part) => ({
      id: generateId(),
      type: part.type,
      position: [...part.position] as [number, number, number],
      rotation: [...part.rotation] as [number, number, number],
      scale: [...part.scale] as [number, number, number],
      color: part.color,
      metalness: part.metalness,
      roughness: part.roughness,
      visible: true,
      locked: false,
      name: part.name,
      textureType: part.textureType || 'none',
      textureScale: part.textureScale || 1,
      hasPaintData: false,
    }));

    set((state) => {
      const blocks = [...state.blocks, ...newBlocks];
      const history = state.history.slice(0, state.historyIndex + 1);
      history.push(blocks);
      if (history.length > MAX_HISTORY) history.shift();
      return {
        blocks,
        selectedBlockId: null,
        history,
        historyIndex: Math.min(history.length - 1, state.historyIndex + 1),
      };
    });
  },

  getSelectedBlock: () => {
    const state = get();
    return state.blocks.find((b) => b.id === state.selectedBlockId);
  },
}));
