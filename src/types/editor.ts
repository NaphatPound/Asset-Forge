export interface Block {
  id: string;
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  metalness: number;
  roughness: number;
  visible: boolean;
  locked: boolean;
  name: string;
}

export interface BlockDefinition {
  id: string;
  name: string;
  category: string;
  geometry: 'box' | 'cylinder' | 'sphere' | 'cone' | 'torus' | 'capsule' | 'extrude' | 'lathe' | 'composed';
  params: Record<string, number>;
  thumbnail?: string;
}

export interface TemplatePart {
  type: string;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  metalness: number;
  roughness: number;
}

export interface MechTemplate {
  id: string;
  name: string;
  description: string;
  mechType: string;
  parts: TemplatePart[];
}

export type TransformMode = 'translate' | 'rotate' | 'scale';
export type GridType = 'square' | 'hexagonal';

export interface EditorState {
  blocks: Block[];
  selectedBlockId: string | null;
  transformMode: TransformMode;
  gridType: GridType;
  gridSize: number;
  gridSnap: boolean;
  showGrid: boolean;
  history: Block[][];
  historyIndex: number;

  // Actions
  addBlock: (type: string, name: string) => void;
  removeBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  selectBlock: (id: string | null) => void;
  clearSelection: () => void;
  setTransformMode: (mode: TransformMode) => void;
  setGridType: (type: GridType) => void;
  setGridSize: (size: number) => void;
  toggleGridSnap: () => void;
  toggleGrid: () => void;
  undo: () => void;
  redo: () => void;
  saveSnapshot: () => void;
  clearScene: () => void;
  loadScene: (blocks: Block[]) => void;
  loadTemplate: (templateId: string) => void;
  getSelectedBlock: () => Block | undefined;
}
