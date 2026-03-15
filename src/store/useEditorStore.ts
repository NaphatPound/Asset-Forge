import { create } from 'zustand';
import type { Block, BlockGroup, EditorState, TransformMode, GridType, PaintSettings } from '../types/editor';
import { mechTemplates } from '../blocks/mechTemplates';

const MAX_HISTORY = 50;

let idCounter = 0;
const generateId = () => `block_${++idCounter}_${Date.now()}`;
let groupCounter = 0;
const generateGroupId = () => `group_${++groupCounter}_${Date.now()}`;

export const useEditorStore = create<EditorState>((set, get) => ({
  blocks: [],
  groups: [],
  selectedBlockId: null,
  selectedGroupId: null,
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
      groupId: null,
    };
    set((state) => {
      const blocks = [...state.blocks, newBlock];
      const history = state.history.slice(0, state.historyIndex + 1);
      history.push(blocks);
      if (history.length > MAX_HISTORY) history.shift();
      return {
        blocks,
        selectedBlockId: id,
        selectedGroupId: null,
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

  selectBlock: (id: string | null) => set({ selectedBlockId: id, selectedGroupId: null }),

  clearSelection: () => set({ selectedBlockId: null, selectedGroupId: null }),

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
      return { blocks: state.history[newIndex], historyIndex: newIndex, selectedBlockId: null, selectedGroupId: null };
    });
  },

  redo: () => {
    set((state) => {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      return { blocks: state.history[newIndex], historyIndex: newIndex, selectedBlockId: null, selectedGroupId: null };
    });
  },

  saveSnapshot: () => {
    set((state) => {
      const history = state.history.slice(0, state.historyIndex + 1);
      history.push([...state.blocks]);
      if (history.length > MAX_HISTORY) history.shift();
      return { history, historyIndex: Math.min(history.length - 1, state.historyIndex + 1) };
    });
  },

  clearScene: () => {
    set((state) => {
      const history = state.history.slice(0, state.historyIndex + 1);
      history.push([]);
      if (history.length > MAX_HISTORY) history.shift();
      return {
        blocks: [], groups: [], selectedBlockId: null, selectedGroupId: null,
        history, historyIndex: Math.min(history.length - 1, state.historyIndex + 1),
      };
    });
  },

  loadScene: (blocks: Block[]) => {
    set((state) => {
      const history = state.history.slice(0, state.historyIndex + 1);
      history.push(blocks);
      if (history.length > MAX_HISTORY) history.shift();
      return {
        blocks, selectedBlockId: null, selectedGroupId: null,
        history, historyIndex: Math.min(history.length - 1, state.historyIndex + 1),
      };
    });
  },

  loadTemplate: (templateId: string) => {
    const template = mechTemplates.find((t) => t.id === templateId);
    if (!template) return;

    const groupId = generateGroupId();
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
      groupId,
    }));

    set((state) => {
      const blocks = [...state.blocks, ...newBlocks];
      const groups = [...state.groups, { id: groupId, name: template.name, collapsed: false }];
      const history = state.history.slice(0, state.historyIndex + 1);
      history.push(blocks);
      if (history.length > MAX_HISTORY) history.shift();
      return {
        blocks, groups, selectedBlockId: null,
        history, historyIndex: Math.min(history.length - 1, state.historyIndex + 1),
      };
    });
  },

  getSelectedBlock: () => {
    const state = get();
    return state.blocks.find((b) => b.id === state.selectedBlockId);
  },

  // ---- Group Actions ----

  createGroup: (name: string) => {
    const id = generateGroupId();
    set((state) => ({
      groups: [...state.groups, { id, name, collapsed: false }],
    }));
    return id;
  },

  removeGroup: (groupId: string) => {
    set((state) => ({
      groups: state.groups.filter((g) => g.id !== groupId),
      blocks: state.blocks.map((b) => b.groupId === groupId ? { ...b, groupId: null } : b),
      selectedGroupId: state.selectedGroupId === groupId ? null : state.selectedGroupId,
    }));
  },

  renameGroup: (groupId: string, name: string) => {
    set((state) => ({
      groups: state.groups.map((g) => g.id === groupId ? { ...g, name } : g),
    }));
  },

  toggleGroupCollapsed: (groupId: string) => {
    set((state) => ({
      groups: state.groups.map((g) => g.id === groupId ? { ...g, collapsed: !g.collapsed } : g),
    }));
  },

  addToGroup: (blockId: string, groupId: string) => {
    set((state) => ({
      blocks: state.blocks.map((b) => b.id === blockId ? { ...b, groupId } : b),
    }));
  },

  removeFromGroup: (blockId: string) => {
    set((state) => ({
      blocks: state.blocks.map((b) => b.id === blockId ? { ...b, groupId: null } : b),
    }));
  },

  selectGroup: (groupId: string | null) => {
    set({ selectedGroupId: groupId, selectedBlockId: null });
  },

  groupSelectedBlocks: () => {
    // Group all blocks that are currently selected or in the scene (if only 1 selected, group all ungrouped)
    const state = get();
    if (state.blocks.length === 0) return;

    const id = generateGroupId();
    const ungrouped = state.blocks.filter((b) => !b.groupId);
    if (ungrouped.length < 2) return;

    set((s) => ({
      groups: [...s.groups, { id, name: `Group ${s.groups.length + 1}`, collapsed: false }],
      blocks: s.blocks.map((b) => !b.groupId ? { ...b, groupId: id } : b),
      selectedGroupId: id,
      selectedBlockId: null,
    }));
  },

  ungroupBlocks: (groupId: string) => {
    set((state) => ({
      blocks: state.blocks.map((b) => b.groupId === groupId ? { ...b, groupId: null } : b),
      groups: state.groups.filter((g) => g.id !== groupId),
      selectedGroupId: null,
    }));
  },

  transformGroup: (groupId: string, deltaPos?: [number, number, number], deltaRot?: [number, number, number], scaleFactor?: [number, number, number]) => {
    set((state) => {
      const groupBlocks = state.blocks.filter((b) => b.groupId === groupId);
      if (groupBlocks.length === 0) return state;

      // Compute group center
      let cx = 0, cy = 0, cz = 0;
      for (const b of groupBlocks) { cx += b.position[0]; cy += b.position[1]; cz += b.position[2]; }
      cx /= groupBlocks.length; cy /= groupBlocks.length; cz /= groupBlocks.length;

      const updatedBlocks = state.blocks.map((b) => {
        if (b.groupId !== groupId) return b;
        const updated = { ...b };

        if (deltaPos) {
          updated.position = [
            b.position[0] + deltaPos[0],
            b.position[1] + deltaPos[1],
            b.position[2] + deltaPos[2],
          ];
        }

        if (deltaRot) {
          updated.rotation = [
            b.rotation[0] + deltaRot[0],
            b.rotation[1] + deltaRot[1],
            b.rotation[2] + deltaRot[2],
          ];
        }

        if (scaleFactor) {
          // Scale position relative to group center + scale the block itself
          const dx = b.position[0] - cx;
          const dy = b.position[1] - cy;
          const dz = b.position[2] - cz;
          updated.position = [
            cx + dx * scaleFactor[0] + (deltaPos ? deltaPos[0] : 0),
            cy + dy * scaleFactor[1] + (deltaPos ? deltaPos[1] : 0),
            cz + dz * scaleFactor[2] + (deltaPos ? deltaPos[2] : 0),
          ];
          updated.scale = [
            b.scale[0] * scaleFactor[0],
            b.scale[1] * scaleFactor[1],
            b.scale[2] * scaleFactor[2],
          ];
        }

        return updated;
      });

      return { blocks: updatedBlocks };
    });
  },
}));
