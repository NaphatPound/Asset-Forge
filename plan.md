# Asset Forge Clone — Web App Implementation Plan

> **Goal**: Build a web-based 3D model kit-bashing tool inspired by [Asset Forge](https://kenney.itch.io/assetforge-deluxe). Users assemble 3D models from pre-made blocks, apply colors/materials, and export to 3D files (glTF) or 2D PNG sprites. Built with **React + TypeScript + Three.js (React Three Fiber)**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript (Vite) |
| 3D Engine | Three.js via `@react-three/fiber` |
| 3D Helpers | `@react-three/drei` (OrbitControls, TransformControls, Grid, etc.) |
| State Management | Zustand |
| UI Components | Radix UI Primitives + custom CSS |
| Icons | Lucide React |
| 3D Export | `three-gltf-exporter`, `three-obj-exporter` (built-in Three.js exporters) |
| 2D Export | Offscreen WebGL canvas → PNG via `toDataURL` |
| Styling | Vanilla CSS with CSS custom properties (dark theme) |

---

## Project Structure

```
G:\project\Asset Forge\
├── public/
│   └── blocks/              # Pre-made block GLB/JSON definitions
├── src/
│   ├── main.tsx             # Entry point
│   ├── App.tsx              # Root layout
│   ├── App.css              # Global styles
│   ├── index.css            # Design tokens & reset
│   │
│   ├── store/
│   │   └── useEditorStore.ts    # Zustand store (scene state, selection, history)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx           # Top toolbar (file, edit, view, export)
│   │   │   ├── Header.css
│   │   │   ├── LeftPanel.tsx        # Block library browser
│   │   │   ├── LeftPanel.css
│   │   │   ├── RightPanel.tsx       # Properties & materials panel
│   │   │   ├── RightPanel.css
│   │   │   ├── BottomBar.tsx        # Status bar (block count, grid info)
│   │   │   └── BottomBar.css
│   │   │
│   │   ├── viewport/
│   │   │   ├── Viewport.tsx         # R3F Canvas wrapper
│   │   │   ├── Viewport.css
│   │   │   ├── SceneGrid.tsx        # Configurable grid (square/hex)
│   │   │   ├── BlockMesh.tsx        # Individual block renderer
│   │   │   ├── GizmoControls.tsx    # Transform gizmo (move/rotate/scale)
│   │   │   ├── CameraController.tsx # Orbit camera with presets
│   │   │   └── SceneLighting.tsx    # Ambient + directional lights
│   │   │
│   │   ├── blocks/
│   │   │   ├── BlockLibrary.tsx     # Categorized block browser
│   │   │   ├── BlockLibrary.css
│   │   │   ├── BlockCard.tsx        # Thumbnail card for each block
│   │   │   ├── BlockCard.css
│   │   │   └── BlockSearch.tsx      # Search/filter blocks
│   │   │
│   │   ├── properties/
│   │   │   ├── PropertiesPanel.tsx  # Selected block properties
│   │   │   ├── PropertiesPanel.css
│   │   │   ├── TransformInputs.tsx  # Position/rotation/scale number inputs
│   │   │   ├── MaterialEditor.tsx   # Color picker, material settings
│   │   │   └── MaterialEditor.css
│   │   │
│   │   ├── hierarchy/
│   │   │   ├── SceneTree.tsx        # Scene object tree view
│   │   │   └── SceneTree.css
│   │   │
│   │   └── export/
│   │       ├── ExportDialog.tsx     # Export options modal
│   │       ├── ExportDialog.css
│   │       └── SpritePreview.tsx    # 2D sprite render preview
│   │
│   ├── blocks/
│   │   └── blockDefinitions.ts     # Block geometry definitions (procedural)
│   │
│   ├── utils/
│   │   ├── exportGLTF.ts           # glTF export logic
│   │   ├── exportOBJ.ts            # OBJ export logic
│   │   ├── exportPNG.ts            # 2D sprite capture logic
│   │   ├── gridSnap.ts             # Grid snapping utilities
│   │   └── history.ts              # Undo/redo manager
│   │
│   └── types/
│       └── editor.ts               # TypeScript type definitions
│
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Implementation Phases

### Phase 1: Project Setup & Core Viewport

**Steps for Claude Code:**

1. **Initialize project**
   ```bash
   cd "G:\project\Asset Forge"
   npx -y create-vite@latest ./ --template react-ts
   npm install
   npm install three @react-three/fiber @react-three/drei zustand lucide-react
   npm install -D @types/three
   ```

2. **Create `src/index.css`** — Design system with CSS custom properties
   - Dark theme color tokens (background: `#1a1a2e`, surfaces: `#16213e`, accents: `#0f3460`, primary: `#e94560`)
   - Import Google Font "Inter"
   - CSS reset + base styles
   - Utility classes for panels, scrollbars, glass effects

3. **Create `src/types/editor.ts`** — Core type definitions
   ```typescript
   interface Block {
     id: string;
     type: string;           // block definition key
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

   interface BlockDefinition {
     id: string;
     name: string;
     category: string;
     geometry: 'box' | 'cylinder' | 'sphere' | 'cone' | 'torus' | 'custom';
     params: Record<string, number>;  // geometry parameters
     thumbnail?: string;
   }

   type TransformMode = 'translate' | 'rotate' | 'scale';
   type GridType = 'square' | 'hexagonal';

   interface EditorState {
     blocks: Block[];
     selectedBlockId: string | null;
     transformMode: TransformMode;
     gridType: GridType;
     gridSize: number;
     gridSnap: boolean;
     showGrid: boolean;
     // ... actions
   }
   ```

4. **Create `src/store/useEditorStore.ts`** — Zustand store
   - Scene blocks array with CRUD operations
   - Selection state
   - Transform mode (translate/rotate/scale)
   - Grid settings (type, size, snap, visibility)
   - Undo/redo history stack (store snapshots)
   - Camera preset state
   - Actions: addBlock, removeBlock, duplicateBlock, updateBlock, selectBlock, clearSelection, undo, redo

5. **Create `src/components/viewport/Viewport.tsx`** — R3F Canvas
   - `<Canvas>` with shadows, antialiasing, proper camera defaults
   - Orbit controls (right-click rotate, middle-click pan, scroll zoom)
   - Render all blocks from store
   - Click-to-select blocks (raycasting)
   - Background color matching dark theme

6. **Create `src/components/viewport/SceneGrid.tsx`** — Grid plane
   - Use `@react-three/drei` `<Grid>` component
   - Configurable size, divisions, colors
   - Toggle visibility

7. **Create `src/components/viewport/SceneLighting.tsx`** — Lighting setup
   - Ambient light (soft fill)
   - Directional light with shadows
   - Optional hemisphere light for sky/ground

8. **Create `src/App.tsx`** & **`src/App.css`** — Main layout
   - CSS Grid layout: header top, left panel, viewport center, right panel, bottom bar
   - Responsive panel sizing with CSS `grid-template-columns`

---

### Phase 2: Block Library System

**Steps for Claude Code:**

9. **Create `src/blocks/blockDefinitions.ts`** — Procedural block definitions
   - Categories with blocks:
     - **Primitives**: Box, Cylinder, Sphere, Cone, Torus, Plane, Capsule, Wedge
     - **Buildings**: Wall, Floor, Roof, Door, Window, Stairs, Pillar, Arch
     - **Vehicles**: Wheel, Chassis, Cockpit, Wing, Engine, Bumper
     - **Furniture**: Table, Chair, Shelf, Lamp, Bed, Cabinet
     - **Characters**: Head, Torso, Arm, Leg, Hand, Foot (simple geometric)
     - **Foliage**: Tree trunk, Tree crown, Bush, Rock, Grass patch
     - **Mechanical**: Gear, Pipe, Valve, Lever, Piston, Bolt
     - **City**: Road, Sidewalk, Streetlight, Bench, Hydrant, Mailbox
   - Each block defined as Three.js `BufferGeometry` factory using:
     - `BoxGeometry`, `CylinderGeometry`, `SphereGeometry` for simple shapes
     - `ExtrudeGeometry` with `Shape` for complex profiles (roofs, arches, wedges)
     - `LatheGeometry` for revolution shapes
     - CSG (Constructive Solid Geometry) using `three-bvh-csg` for boolean operations (windows in walls, etc.)

10. **Create `src/components/blocks/BlockLibrary.tsx`** — Block browser panel
    - Category tabs/accordion (collapsible sections)
    - Grid of block thumbnails per category
    - Click to place block in scene at origin
    - Count badge per category

11. **Create `src/components/blocks/BlockCard.tsx`** — Block thumbnail
    - Render a small preview of each block using a tiny off-screen `<Canvas>`
    - OR render using a pre-rendered SVG/icon representation
    - Block name label
    - Hover effect with scale animation

12. **Create `src/components/blocks/BlockSearch.tsx`** — Search bar
    - Filter blocks by name across all categories
    - Debounced input
    - Results update BlockLibrary display

---

### Phase 3: Block Manipulation & Transform Gizmo

**Steps for Claude Code:**

13. **Create `src/components/viewport/BlockMesh.tsx`** — Block renderer
    - Renders a block's geometry with material (color, metalness, roughness)
    - Outline/highlight effect when selected (using `<Outlines>` from drei)
    - Click handler for selection
    - Hover cursor change

14. **Create `src/components/viewport/GizmoControls.tsx`** — Transform gizmo
    - Use `<TransformControls>` from `@react-three/drei`
    - Mode switching: translate (W), rotate (E), scale (R)
    - Snap to grid when enabled
    - Attach to selected block
    - Update store on drag end

15. **Create `src/components/viewport/CameraController.tsx`** — Camera
    - Orbit controls with configurable limits
    - Camera preset buttons: Front, Back, Left, Right, Top, Isometric
    - Smooth transitions between presets using lerp
    - Focus on selected block (F key)

16. **Create `src/utils/gridSnap.ts`** — Grid snapping
    - Snap position to nearest grid point
    - Snap rotation to configurable degrees (15°, 30°, 45°, 90°)
    - Configurable snap size

17. **Add keyboard shortcuts** to `App.tsx`
    - `W` → translate mode
    - `E` → rotate mode
    - `R` → scale mode
    - `Delete` → delete selected block
    - `Ctrl+D` → duplicate selected block
    - `Ctrl+Z` → undo
    - `Ctrl+Shift+Z` → redo
    - `G` → toggle grid
    - `F` → focus on selected
    - `M` → mirror selected block
    - `H` → hide/show selected block

---

### Phase 4: Properties & Materials Panel

**Steps for Claude Code:**

18. **Create `src/components/properties/TransformInputs.tsx`** — Number inputs
    - X, Y, Z inputs for position, rotation (degrees), scale
    - Step buttons (▲▼)
    - Sync with store and gizmo

19. **Create `src/components/properties/MaterialEditor.tsx`** — Material controls
    - Color picker (HSL wheel + hex input)
    - Metalness slider (0–1)
    - Roughness slider (0–1)
    - Preset material buttons (Wood, Metal, Plastic, Stone, Glass)
    - Color palette with recent colors

20. **Create `src/components/properties/PropertiesPanel.tsx`** — Combined panel
    - Shows when a block is selected
    - Block name (editable)
    - Transform section (position, rotation, scale)
    - Material section
    - Visibility toggle
    - Lock toggle
    - "Empty selection" placeholder when nothing selected

21. **Create `src/components/hierarchy/SceneTree.tsx`** — Scene tree
    - List all blocks in scene
    - Click to select
    - Visibility eye icon toggle
    - Lock icon toggle
    - Drag to reorder (optional)
    - Delete button per item
    - Block count in header

---

### Phase 5: Header Toolbar & Actions

**Steps for Claude Code:**

22. **Create `src/components/layout/Header.tsx`** — Top toolbar
    - Logo/app name "Asset Forge Web"
    - File menu: New Scene, Save Project (JSON download), Load Project (JSON upload)
    - Edit menu: Undo, Redo, Duplicate, Delete, Select All
    - View menu: Toggle Grid, Grid Type, Reset Camera
    - Transform mode buttons (Move/Rotate/Scale) with active indicator
    - Mirror button (flip on X/Y/Z axis)
    - Grid snap toggle

23. **Create `src/components/layout/BottomBar.tsx`** — Status bar
    - Block count in scene
    - Selected block info
    - Grid type & snap status
    - Camera position/zoom info

---

### Phase 6: Export System

**Steps for Claude Code:**

24. **Create `src/utils/exportGLTF.ts`** — glTF/GLB export
    - Use `THREE.GLTFExporter`
    - Merge scene blocks into exportable scene
    - Option: merge geometries (remove hidden faces)
    - Download as `.glb` file

25. **Create `src/utils/exportOBJ.ts`** — OBJ export
    - Use `THREE.OBJExporter`
    - Export with MTL material file
    - Download as `.obj` + `.mtl` files

26. **Create `src/utils/exportPNG.ts`** — 2D sprite capture
    - Create offscreen WebGL renderer
    - Configurable resolution (256×256 up to 2048×2048)
    - Transparent or solid background option
    - Camera angle presets (front, side, top, isometric)
    - Batch export: render from 4/8/16 angles automatically
    - Anti-aliasing + supersampling for crisp output
    - Download as `.png`

27. **Create `src/components/export/ExportDialog.tsx`** — Export modal
    - Tab: 3D Export (glTF, OBJ format selection + options)
    - Tab: 2D Sprite (resolution, background, angle, batch mode)
    - Preview thumbnail
    - Export button with progress indicator

28. **Create `src/components/export/SpritePreview.tsx`** — Sprite preview
    - Small canvas showing 2D render preview
    - Angle selector (dropdown or rotation slider)
    - Resolution display

---

### Phase 7: Polish & Advanced Features

**Steps for Claude Code:**

29. **Create `src/utils/history.ts`** — Undo/Redo system
    - Snapshot-based history (store block array states)
    - Maximum history depth (50 states)
    - Integrated with zustand store

30. **Save/Load project**
    - Serialize scene to JSON (blocks array + settings)
    - Download as `.assetforge.json`
    - Upload & parse to restore scene
    - Auto-save to localStorage

31. **UI Polish**
    - Glassmorphism panel backgrounds
    - Smooth panel animations (slide in/out)
    - Tooltips on all icon buttons
    - Loading spinner during exports
    - Toast notifications for actions (saved, exported, etc.)
    - Responsive: hide panels below certain breakpoints
    - Custom scrollbar styling

32. **Material presets library**
    - Pre-defined materials: Wood, Metal, Plastic, Stone, Glass, Concrete, Gold, Silver
    - Each with tuned color, metalness, roughness values
    - Click to apply to selected block

---

## Key Implementation Details

### Block Geometry Generation (Procedural)
Since we can't use Asset Forge's actual block library, we generate all blocks procedurally using Three.js geometry primitives. Complex shapes use combinations:

- **Wall with window**: `BoxGeometry` with `CSG.subtract` a smaller box
- **Roof**: `ExtrudeGeometry` from triangular `Shape`
- **Arch**: `LatheGeometry` from half-circle profile
- **Stairs**: Multiple thin `BoxGeometry` stacked
- **Tree**: `CylinderGeometry` trunk + `SphereGeometry`/`ConeGeometry` crown

### Grid Snapping
- Position snaps to grid units (default 0.5)
- Rotation snaps to 15° increments
- Scale snaps to 0.25 increments
- All configurable in settings

### 2D Sprite Export
The sprite export creates an offscreen Three.js renderer, renders the assembled model from the desired angle with orthographic camera, and captures as PNG. Supports:
- Transparent background (alpha channel)
- Multiple angles batch export
- Configurable resolution
- Anti-aliasing via supersampling (render at 2× then downscale)

---

## Verification Plan

### Automated (Dev Server)
```bash
cd "G:\project\Asset Forge"
npm run dev
```
Open browser at `http://localhost:5173` and verify:
1. App loads without console errors
2. 3D viewport renders with grid
3. Dark themed UI with panels visible

### Browser Testing (Phase by Phase)
After each phase, verify in browser:

1. **Phase 1**: Canvas renders, orbit controls work, grid visible
2. **Phase 2**: Block library shows categories, clicking block adds it to scene
3. **Phase 3**: Gizmo appears on selected block, transform modes work, keyboard shortcuts function
4. **Phase 4**: Properties panel shows block data, color picker changes block color, material sliders work
5. **Phase 5**: Toolbar buttons functional, file save/load works
6. **Phase 6**: Export downloads valid glTF file (open in [glTF Viewer](https://gltf-viewer.donmccurdy.com/)), PNG export produces correct sprite image
7. **Phase 7**: Undo/redo works across all operations, UI animations smooth

### Manual Verification
- Export a glTF model → import into Three.js glTF viewer online → verify geometry and colors
- Export a PNG sprite → open in image viewer → verify correct rendering angle and transparency
- Save project → reload page → load project → verify scene restored correctly
