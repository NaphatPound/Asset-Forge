import * as THREE from 'three';

export type TextureType =
  | 'none'
  | 'wood'
  | 'metal-brushed'
  | 'metal-plate'
  | 'stone'
  | 'brick'
  | 'carbon-fiber'
  | 'camo'
  | 'rust'
  | 'fabric'
  | 'concrete'
  | 'diamond-plate'
  | 'circuit';

export interface TexturePreset {
  id: TextureType;
  name: string;
  category: string;
}

export const TEXTURE_PRESETS: TexturePreset[] = [
  { id: 'none', name: 'None', category: 'Basic' },
  { id: 'wood', name: 'Wood', category: 'Natural' },
  { id: 'stone', name: 'Stone', category: 'Natural' },
  { id: 'brick', name: 'Brick', category: 'Natural' },
  { id: 'concrete', name: 'Concrete', category: 'Natural' },
  { id: 'metal-brushed', name: 'Brushed Metal', category: 'Metal' },
  { id: 'metal-plate', name: 'Metal Plate', category: 'Metal' },
  { id: 'diamond-plate', name: 'Diamond Plate', category: 'Metal' },
  { id: 'rust', name: 'Rust', category: 'Metal' },
  { id: 'carbon-fiber', name: 'Carbon Fiber', category: 'Synthetic' },
  { id: 'fabric', name: 'Fabric', category: 'Synthetic' },
  { id: 'camo', name: 'Camo', category: 'Pattern' },
  { id: 'circuit', name: 'Circuit Board', category: 'Pattern' },
];

const TEX_SIZE = 512;

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function noise2D(x: number, y: number, seed: number = 0): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed) * 43758.5453;
  return n - Math.floor(n);
}

function smoothNoise(x: number, y: number, scale: number, seed: number = 0): number {
  const sx = x / scale;
  const sy = y / scale;
  const ix = Math.floor(sx);
  const iy = Math.floor(sy);
  const fx = sx - ix;
  const fy = sy - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = noise2D(ix, iy, seed);
  const b = noise2D(ix + 1, iy, seed);
  const c = noise2D(ix, iy + 1, seed);
  const d = noise2D(ix + 1, iy + 1, seed);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function fbm(x: number, y: number, octaves: number, scale: number, seed: number = 0): number {
  let value = 0;
  let amplitude = 0.5;
  let s = scale;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * smoothNoise(x, y, s, seed + i * 100);
    s *= 0.5;
    amplitude *= 0.5;
  }
  return value;
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function generateWood(ctx: CanvasRenderingContext2D, baseColor: string) {
  const [br, bg, bb] = hexToRgb(baseColor);
  const imgData = ctx.createImageData(TEX_SIZE, TEX_SIZE);
  const d = imgData.data;

  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const i = (y * TEX_SIZE + x) * 4;
      const nx = x + fbm(x, y, 3, 80) * 40;
      const ring = Math.sin((nx * 0.05) + fbm(x, y, 4, 120) * 6) * 0.5 + 0.5;
      const grain = fbm(x, y, 6, 30, 42) * 0.15;
      const v = ring * 0.7 + grain;
      const dark = [br * 0.4, bg * 0.3, bb * 0.2];
      const light = [Math.min(255, br * 1.2), Math.min(255, bg * 1.1), Math.min(255, bb * 0.9)];
      d[i] = dark[0] + (light[0] - dark[0]) * v;
      d[i + 1] = dark[1] + (light[1] - dark[1]) * v;
      d[i + 2] = dark[2] + (light[2] - dark[2]) * v;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function generateBrushedMetal(ctx: CanvasRenderingContext2D, baseColor: string) {
  const [br, bg, bb] = hexToRgb(baseColor);
  const imgData = ctx.createImageData(TEX_SIZE, TEX_SIZE);
  const d = imgData.data;
  const rand = seededRandom(123);

  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const i = (y * TEX_SIZE + x) * 4;
      const brushLine = (rand() * 0.3 + smoothNoise(x, y * 0.1, 200) * 0.4 + smoothNoise(x, y, 10) * 0.1);
      const spec = fbm(x, y, 3, 60, 77) * 0.15;
      const v = 0.6 + brushLine * 0.3 + spec;
      d[i] = Math.min(255, br * v);
      d[i + 1] = Math.min(255, bg * v);
      d[i + 2] = Math.min(255, bb * v);
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function generateMetalPlate(ctx: CanvasRenderingContext2D, baseColor: string) {
  const [br, bg, bb] = hexToRgb(baseColor);
  const imgData = ctx.createImageData(TEX_SIZE, TEX_SIZE);
  const d = imgData.data;
  const plateSize = 128;
  const boltSize = 8;

  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const i = (y * TEX_SIZE + x) * 4;
      const px = x % plateSize;
      const py = y % plateSize;
      const edgeDist = Math.min(px, py, plateSize - px, plateSize - py);
      const edge = edgeDist < 3 ? 0.5 : 1.0;
      const scratches = fbm(x, y, 4, 40, 33) * 0.08;
      const v = edge + scratches;

      // Bolts at corners
      const bx = px < plateSize / 2 ? px : plateSize - px;
      const by = py < plateSize / 2 ? py : plateSize - py;
      const boltDist = Math.sqrt((bx - 10) ** 2 + (by - 10) ** 2);
      const isBolt = boltDist < boltSize;

      if (isBolt) {
        const bv = 0.4 + (1 - boltDist / boltSize) * 0.2;
        d[i] = Math.min(255, br * bv);
        d[i + 1] = Math.min(255, bg * bv);
        d[i + 2] = Math.min(255, bb * bv);
      } else {
        d[i] = Math.min(255, br * v);
        d[i + 1] = Math.min(255, bg * v);
        d[i + 2] = Math.min(255, bb * v);
      }
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function generateStone(ctx: CanvasRenderingContext2D, baseColor: string) {
  const [br, bg, bb] = hexToRgb(baseColor);
  const imgData = ctx.createImageData(TEX_SIZE, TEX_SIZE);
  const d = imgData.data;

  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const i = (y * TEX_SIZE + x) * 4;
      const n1 = fbm(x, y, 6, 100, 10);
      const n2 = fbm(x + 500, y + 500, 4, 40, 20) * 0.3;
      const speckle = noise2D(x * 3, y * 3, 30) > 0.85 ? 0.1 : 0;
      const v = 0.5 + n1 * 0.4 + n2 - speckle;
      d[i] = Math.min(255, br * v);
      d[i + 1] = Math.min(255, bg * v);
      d[i + 2] = Math.min(255, bb * v);
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function generateBrick(ctx: CanvasRenderingContext2D, baseColor: string) {
  const [br, bg, bb] = hexToRgb(baseColor);
  const imgData = ctx.createImageData(TEX_SIZE, TEX_SIZE);
  const d = imgData.data;
  const brickW = 64;
  const brickH = 32;
  const mortarW = 4;

  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const i = (y * TEX_SIZE + x) * 4;
      const row = Math.floor(y / brickH);
      const offset = (row % 2) * (brickW / 2);
      const bx = (x + offset) % brickW;
      const by = y % brickH;
      const isMortar = bx < mortarW || by < mortarW;

      if (isMortar) {
        const mv = 0.45 + fbm(x, y, 3, 20, 55) * 0.15;
        d[i] = Math.min(255, 180 * mv);
        d[i + 1] = Math.min(255, 170 * mv);
        d[i + 2] = Math.min(255, 160 * mv);
      } else {
        const brickNoise = fbm(x, y, 4, 30, row * 17 + Math.floor((x + offset) / brickW) * 7) * 0.25;
        const v = 0.7 + brickNoise;
        d[i] = Math.min(255, br * v);
        d[i + 1] = Math.min(255, bg * v);
        d[i + 2] = Math.min(255, bb * v);
      }
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function generateCarbonFiber(ctx: CanvasRenderingContext2D, baseColor: string) {
  const [br, bg, bb] = hexToRgb(baseColor);
  const imgData = ctx.createImageData(TEX_SIZE, TEX_SIZE);
  const d = imgData.data;
  const weaveSize = 16;

  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const i = (y * TEX_SIZE + x) * 4;
      const wx = x % weaveSize;
      const wy = y % weaveSize;
      const half = weaveSize / 2;
      const isOver = (wx < half) !== (wy < half);
      const edgeX = Math.min(wx, weaveSize - wx) / half;
      const edgeY = Math.min(wy, weaveSize - wy) / half;
      const edge = Math.min(edgeX, edgeY);
      const base = isOver ? 0.85 : 0.55;
      const v = base * (0.85 + edge * 0.15);
      const spec = fbm(x, y, 2, 30, 88) * 0.05;
      d[i] = Math.min(255, br * (v + spec));
      d[i + 1] = Math.min(255, bg * (v + spec));
      d[i + 2] = Math.min(255, bb * (v + spec));
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function generateCamo(ctx: CanvasRenderingContext2D, baseColor: string) {
  const [br, bg, bb] = hexToRgb(baseColor);
  const imgData = ctx.createImageData(TEX_SIZE, TEX_SIZE);
  const d = imgData.data;
  const colors: [number, number, number][] = [
    [br * 0.4, bg * 0.5, bb * 0.3],
    [br * 0.7, bg * 0.8, bb * 0.5],
    [br * 1.0, bg * 1.0, bb * 0.7],
    [br * 0.5, bg * 0.4, bb * 0.3],
  ];

  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const i = (y * TEX_SIZE + x) * 4;
      const n1 = fbm(x, y, 4, 120, 1);
      const n2 = fbm(x + 300, y + 300, 4, 90, 2);
      const idx = Math.floor((n1 + n2) * 2) % colors.length;
      const c = colors[Math.abs(idx)];
      d[i] = Math.min(255, c[0]);
      d[i + 1] = Math.min(255, c[1]);
      d[i + 2] = Math.min(255, c[2]);
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function generateRust(ctx: CanvasRenderingContext2D, baseColor: string) {
  const [br, bg, bb] = hexToRgb(baseColor);
  const imgData = ctx.createImageData(TEX_SIZE, TEX_SIZE);
  const d = imgData.data;

  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const i = (y * TEX_SIZE + x) * 4;
      const rustAmount = fbm(x, y, 5, 80, 15);
      const detail = fbm(x, y, 6, 20, 25) * 0.2;
      const pitting = noise2D(x * 5, y * 5, 35) > 0.9 ? -0.15 : 0;
      const isRust = rustAmount > 0.45;

      if (isRust) {
        const rv = 0.6 + detail + pitting;
        const rustR = 180 * rv;
        const rustG = 80 * rv;
        const rustB = 30 * rv;
        const blend = Math.min(1, (rustAmount - 0.45) * 4);
        d[i] = Math.min(255, br * (1 - blend) + rustR * blend);
        d[i + 1] = Math.min(255, bg * (1 - blend) + rustG * blend);
        d[i + 2] = Math.min(255, bb * (1 - blend) + rustB * blend);
      } else {
        const v = 0.8 + detail;
        d[i] = Math.min(255, br * v);
        d[i + 1] = Math.min(255, bg * v);
        d[i + 2] = Math.min(255, bb * v);
      }
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function generateFabric(ctx: CanvasRenderingContext2D, baseColor: string) {
  const [br, bg, bb] = hexToRgb(baseColor);
  const imgData = ctx.createImageData(TEX_SIZE, TEX_SIZE);
  const d = imgData.data;

  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const i = (y * TEX_SIZE + x) * 4;
      const threadX = Math.sin(x * 0.8) * 0.03;
      const threadY = Math.sin(y * 0.8) * 0.03;
      const weave = (Math.sin(x * 1.5) * Math.sin(y * 1.5)) * 0.06;
      const fuzz = fbm(x, y, 4, 15, 44) * 0.12;
      const v = 0.75 + threadX + threadY + weave + fuzz;
      d[i] = Math.min(255, br * v);
      d[i + 1] = Math.min(255, bg * v);
      d[i + 2] = Math.min(255, bb * v);
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function generateConcrete(ctx: CanvasRenderingContext2D, baseColor: string) {
  const [br, bg, bb] = hexToRgb(baseColor);
  const imgData = ctx.createImageData(TEX_SIZE, TEX_SIZE);
  const d = imgData.data;

  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const i = (y * TEX_SIZE + x) * 4;
      const base = fbm(x, y, 5, 100, 60) * 0.3;
      const fine = fbm(x, y, 4, 20, 70) * 0.15;
      const aggregate = noise2D(x * 2, y * 2, 80) > 0.88 ? 0.08 : 0;
      const v = 0.65 + base + fine + aggregate;
      d[i] = Math.min(255, br * v);
      d[i + 1] = Math.min(255, bg * v);
      d[i + 2] = Math.min(255, bb * v);
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function generateDiamondPlate(ctx: CanvasRenderingContext2D, baseColor: string) {
  const [br, bg, bb] = hexToRgb(baseColor);
  const imgData = ctx.createImageData(TEX_SIZE, TEX_SIZE);
  const d = imgData.data;
  const patSize = 32;

  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const i = (y * TEX_SIZE + x) * 4;
      const px = x % patSize;
      const py = y % patSize;
      const cx = patSize / 2;
      const cy = patSize / 2;
      const diamond = Math.abs(px - cx) + Math.abs(py - cy);
      const isRaised = diamond < patSize * 0.35;
      const v = isRaised ? 0.95 : 0.7 + fbm(x, y, 3, 30, 90) * 0.1;
      d[i] = Math.min(255, br * v);
      d[i + 1] = Math.min(255, bg * v);
      d[i + 2] = Math.min(255, bb * v);
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function generateCircuit(ctx: CanvasRenderingContext2D, baseColor: string) {
  const [br, bg, bb] = hexToRgb(baseColor);
  const imgData = ctx.createImageData(TEX_SIZE, TEX_SIZE);
  const d = imgData.data;
  const gridSize = 32;
  const traceWidth = 3;
  const rand = seededRandom(42);

  // Fill base
  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const i = (y * TEX_SIZE + x) * 4;
      const v = 0.25 + fbm(x, y, 2, 100, 99) * 0.05;
      d[i] = Math.min(255, br * v);
      d[i + 1] = Math.min(255, bg * v);
      d[i + 2] = Math.min(255, bb * v);
      d[i + 3] = 255;
    }
  }

  // Draw traces
  for (let gy = 0; gy < TEX_SIZE / gridSize; gy++) {
    for (let gx = 0; gx < TEX_SIZE / gridSize; gx++) {
      if (rand() > 0.6) {
        // Horizontal trace
        const ty = gy * gridSize + Math.floor(gridSize / 2);
        const sx = gx * gridSize;
        for (let tx = sx; tx < sx + gridSize && tx < TEX_SIZE; tx++) {
          for (let tw = -traceWidth; tw <= traceWidth; tw++) {
            const py = ty + tw;
            if (py >= 0 && py < TEX_SIZE) {
              const i = (py * TEX_SIZE + tx) * 4;
              d[i] = Math.min(255, br * 1.3);
              d[i + 1] = Math.min(255, bg * 1.3);
              d[i + 2] = Math.min(255, bb * 1.3);
            }
          }
        }
      }
      if (rand() > 0.6) {
        // Vertical trace
        const tx = gx * gridSize + Math.floor(gridSize / 2);
        const sy = gy * gridSize;
        for (let ty = sy; ty < sy + gridSize && ty < TEX_SIZE; ty++) {
          for (let tw = -traceWidth; tw <= traceWidth; tw++) {
            const px = tx + tw;
            if (px >= 0 && px < TEX_SIZE) {
              const i = (ty * TEX_SIZE + px) * 4;
              d[i] = Math.min(255, br * 1.3);
              d[i + 1] = Math.min(255, bg * 1.3);
              d[i + 2] = Math.min(255, bb * 1.3);
            }
          }
        }
      }
      // Pad at intersection
      if (rand() > 0.5) {
        const padX = gx * gridSize + Math.floor(gridSize / 2);
        const padY = gy * gridSize + Math.floor(gridSize / 2);
        const padR = 5;
        for (let py = padY - padR; py <= padY + padR; py++) {
          for (let px = padX - padR; px <= padX + padR; px++) {
            if (px >= 0 && px < TEX_SIZE && py >= 0 && py < TEX_SIZE) {
              const dist = Math.sqrt((px - padX) ** 2 + (py - padY) ** 2);
              if (dist <= padR) {
                const i = (py * TEX_SIZE + px) * 4;
                d[i] = Math.min(255, br * 1.5);
                d[i + 1] = Math.min(255, bg * 1.5);
                d[i + 2] = Math.min(255, bb * 1.5);
              }
            }
          }
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

const textureGenerators: Record<string, (ctx: CanvasRenderingContext2D, baseColor: string) => void> = {
  'wood': generateWood,
  'metal-brushed': generateBrushedMetal,
  'metal-plate': generateMetalPlate,
  'stone': generateStone,
  'brick': generateBrick,
  'carbon-fiber': generateCarbonFiber,
  'camo': generateCamo,
  'rust': generateRust,
  'fabric': generateFabric,
  'concrete': generateConcrete,
  'diamond-plate': generateDiamondPlate,
  'circuit': generateCircuit,
};

// Cache generated textures by type+color+scale key
const textureCache = new Map<string, THREE.CanvasTexture>();

export function generateProceduralTexture(
  type: TextureType,
  baseColor: string,
  scale: number = 1
): THREE.CanvasTexture | null {
  if (type === 'none') return null;

  const key = `${type}_${baseColor}_${scale}`;
  if (textureCache.has(key)) {
    return textureCache.get(key)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = TEX_SIZE;
  canvas.height = TEX_SIZE;
  const ctx = canvas.getContext('2d')!;

  const generator = textureGenerators[type];
  if (!generator) return null;

  generator(ctx, baseColor);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(scale, scale);
  texture.needsUpdate = true;

  textureCache.set(key, texture);
  return texture;
}

// Generate a small preview thumbnail for the UI
export function generateTexturePreview(type: TextureType, baseColor: string, size: number = 48): string {
  if (type === 'none') return '';

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Generate at small size for preview
  const fullCanvas = document.createElement('canvas');
  fullCanvas.width = TEX_SIZE;
  fullCanvas.height = TEX_SIZE;
  const fullCtx = fullCanvas.getContext('2d')!;

  const generator = textureGenerators[type];
  if (!generator) return '';

  generator(fullCtx, baseColor);
  ctx.drawImage(fullCanvas, 0, 0, size, size);

  return canvas.toDataURL('image/png');
}

export function clearTextureCache() {
  textureCache.forEach((tex) => tex.dispose());
  textureCache.clear();
}
