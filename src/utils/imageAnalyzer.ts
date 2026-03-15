/**
 * Image-to-3D Analyzer v2
 * - Edge-aware segmentation (Sobel + color)
 * - Convex hull ratio for better shape classification
 * - Background auto-removal
 * - Manual region support
 */

export interface DetectedPart {
  id: number;
  label: string;
  shape: 'box' | 'cylinder' | 'sphere' | 'cone' | 'capsule';
  color: string;
  bounds: { x: number; y: number; w: number; h: number };
  position: [number, number, number];
  scale: [number, number, number];
  pixelCount: number;
  circularity: number;
  aspectRatio: number;
  convexity: number;
}

export interface ManualRegion {
  id: number;
  label: string;
  shape: DetectedPart['shape'];
  bounds: { x: number; y: number; w: number; h: number }; // normalized 0-1
}

export interface AnalysisResult {
  parts: DetectedPart[];
  width: number;
  height: number;
  segmentCanvas: HTMLCanvasElement;
  edgeCanvas: HTMLCanvasElement;
}

const MIN_REGION_PIXELS = 150;
const COLOR_THRESHOLD = 35;

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('');
}

// ---- Edge Detection (Sobel) ----

function sobelEdges(imgData: ImageData, w: number, h: number): Uint8Array {
  const src = imgData.data;
  const gray = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const j = i * 4;
    gray[i] = src[j] * 0.299 + src[j + 1] * 0.587 + src[j + 2] * 0.114;
  }

  const edges = new Uint8Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      const gx =
        -gray[(y - 1) * w + x - 1] + gray[(y - 1) * w + x + 1] +
        -2 * gray[y * w + x - 1] + 2 * gray[y * w + x + 1] +
        -gray[(y + 1) * w + x - 1] + gray[(y + 1) * w + x + 1];
      const gy =
        -gray[(y - 1) * w + x - 1] - 2 * gray[(y - 1) * w + x] - gray[(y - 1) * w + x + 1] +
        gray[(y + 1) * w + x - 1] + 2 * gray[(y + 1) * w + x] + gray[(y + 1) * w + x + 1];
      const mag = Math.sqrt(gx * gx + gy * gy);
      edges[idx] = mag > 30 ? 255 : 0;
    }
  }
  return edges;
}

// ---- Background Detection ----

function detectBackground(imgData: ImageData, w: number, h: number): [number, number, number] {
  const src = imgData.data;
  // Sample border pixels to find background color
  const colors: [number, number, number][] = [];

  for (let x = 0; x < w; x++) {
    const i1 = x * 4;
    const i2 = ((h - 1) * w + x) * 4;
    if (src[i1 + 3] > 128) colors.push([src[i1], src[i1 + 1], src[i1 + 2]]);
    if (src[i2 + 3] > 128) colors.push([src[i2], src[i2 + 1], src[i2 + 2]]);
  }
  for (let y = 0; y < h; y++) {
    const i1 = (y * w) * 4;
    const i2 = (y * w + w - 1) * 4;
    if (src[i1 + 3] > 128) colors.push([src[i1], src[i1 + 1], src[i1 + 2]]);
    if (src[i2 + 3] > 128) colors.push([src[i2], src[i2 + 1], src[i2 + 2]]);
  }

  if (colors.length === 0) return [255, 255, 255];

  // Average border color
  let tr = 0, tg = 0, tb = 0;
  for (const [r, g, b] of colors) { tr += r; tg += g; tb += b; }
  return [tr / colors.length, tg / colors.length, tb / colors.length];
}

// ---- Edge-Aware Segmentation ----

function segmentWithEdges(
  imgData: ImageData,
  edges: Uint8Array,
  bgColor: [number, number, number],
  w: number,
  h: number,
  threshold: number,
  bgThreshold: number
): { labels: Int32Array; regionCount: number } {
  const src = imgData.data;
  const total = w * h;
  const labels = new Int32Array(total).fill(-1);
  let regionId = 0;

  const colorDist = (i: number, r: number, g: number, b: number) => {
    const j = i * 4;
    return Math.sqrt((src[j] - r) ** 2 + (src[j + 1] - g) ** 2 + (src[j + 2] - b) ** 2);
  };

  const colorDistIdx = (i1: number, i2: number) => {
    const j1 = i1 * 4, j2 = i2 * 4;
    return Math.sqrt((src[j1] - src[j2]) ** 2 + (src[j1 + 1] - src[j2 + 1]) ** 2 + (src[j1 + 2] - src[j2 + 2]) ** 2);
  };

  for (let startIdx = 0; startIdx < total; startIdx++) {
    if (labels[startIdx] !== -1) continue;

    const j = startIdx * 4;
    // Skip transparent
    if (src[j + 3] < 30) { labels[startIdx] = -2; continue; }
    // Skip background
    if (colorDist(startIdx, bgColor[0], bgColor[1], bgColor[2]) < bgThreshold) {
      labels[startIdx] = -2;
      continue;
    }

    const queue: number[] = [startIdx];
    labels[startIdx] = regionId;

    while (queue.length > 0) {
      const idx = queue.pop()!;
      const x = idx % w;
      const y = Math.floor(idx / w);

      const neighbors = [
        y > 0 ? idx - w : -1,
        y < h - 1 ? idx + w : -1,
        x > 0 ? idx - 1 : -1,
        x < w - 1 ? idx + 1 : -1,
      ];

      for (const nIdx of neighbors) {
        if (nIdx < 0 || labels[nIdx] !== -1) continue;
        if (src[nIdx * 4 + 3] < 30) { labels[nIdx] = -2; continue; }
        if (colorDist(nIdx, bgColor[0], bgColor[1], bgColor[2]) < bgThreshold) {
          labels[nIdx] = -2;
          continue;
        }
        // Don't cross strong edges unless colors are very similar
        if (edges[nIdx] > 0 && colorDistIdx(idx, nIdx) > threshold * 0.5) continue;
        // Color similarity check
        if (colorDistIdx(startIdx, nIdx) < threshold) {
          labels[nIdx] = regionId;
          queue.push(nIdx);
        }
      }
    }
    regionId++;
  }

  return { labels, regionCount: regionId };
}

// ---- Merge Small Regions ----

function mergeSmallRegions(
  labels: Int32Array, w: number, h: number, regionCount: number, minPx: number
): { labels: Int32Array; regionCount: number } {
  const counts = new Int32Array(regionCount);
  for (const l of labels) if (l >= 0) counts[l]++;

  const mergeMap = new Int32Array(regionCount);
  for (let i = 0; i < regionCount; i++) mergeMap[i] = i;

  for (let i = 0; i < regionCount; i++) {
    if (counts[i] >= minPx) continue;
    const neighborCounts = new Map<number, number>();
    for (let idx = 0; idx < labels.length; idx++) {
      if (labels[idx] !== i) continue;
      const x = idx % w, y = Math.floor(idx / w);
      for (const nIdx of [y > 0 ? idx - w : -1, y < h - 1 ? idx + w : -1, x > 0 ? idx - 1 : -1, x < w - 1 ? idx + 1 : -1]) {
        if (nIdx < 0) continue;
        const nl = labels[nIdx];
        if (nl >= 0 && nl !== i && counts[nl] >= minPx)
          neighborCounts.set(nl, (neighborCounts.get(nl) || 0) + 1);
      }
    }
    let best = -1, bestC = 0;
    for (const [l, c] of neighborCounts) if (c > bestC) { bestC = c; best = l; }
    if (best >= 0) mergeMap[i] = best;
  }

  for (let i = 0; i < labels.length; i++) if (labels[i] >= 0) labels[i] = mergeMap[labels[i]];

  // Compact IDs
  const finalCounts = new Map<number, number>();
  for (const l of labels) if (l >= 0) finalCounts.set(l, (finalCounts.get(l) || 0) + 1);
  const idMap = new Map<number, number>();
  let newId = 0;
  for (const [old, c] of finalCounts) if (c >= minPx) idMap.set(old, newId++);
  for (let i = 0; i < labels.length; i++) if (labels[i] >= 0) labels[i] = idMap.get(labels[i]) ?? -2;

  return { labels, regionCount: newId };
}

// ---- Shape Analysis with Convex Hull ----

function analyzeRegion(
  labels: Int32Array, imgData: ImageData, w: number, h: number, regionId: number
): DetectedPart | null {
  const src = imgData.data;
  let minX = w, minY = h, maxX = 0, maxY = 0;
  let tR = 0, tG = 0, tB = 0, pixelCount = 0, perimeterCount = 0;
  const boundaryPoints: [number, number][] = [];

  for (let idx = 0; idx < labels.length; idx++) {
    if (labels[idx] !== regionId) continue;
    const x = idx % w, y = Math.floor(idx / w);
    const j = idx * 4;
    minX = Math.min(minX, x); minY = Math.min(minY, y);
    maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
    tR += src[j]; tG += src[j + 1]; tB += src[j + 2];
    pixelCount++;

    // Boundary pixel?
    let isBoundary = false;
    for (const nIdx of [y > 0 ? idx - w : -1, y < h - 1 ? idx + w : -1, x > 0 ? idx - 1 : -1, x < w - 1 ? idx + 1 : -1]) {
      if (nIdx < 0 || labels[nIdx] !== regionId) { isBoundary = true; break; }
    }
    if (isBoundary) {
      perimeterCount++;
      boundaryPoints.push([x, y]);
    }
  }

  if (pixelCount < MIN_REGION_PIXELS) return null;

  const bw = maxX - minX + 1, bh = maxY - minY + 1;
  const aspectRatio = bw / (bh || 1);
  const boundingArea = bw * bh;
  const fillRatio = pixelCount / (boundingArea || 1);
  const circularity = perimeterCount > 0 ? (4 * Math.PI * pixelCount) / (perimeterCount ** 2) : 0;

  // Convex hull ratio (area / convex hull area)
  const hull = convexHull(boundaryPoints);
  const hullArea = polygonArea(hull);
  const convexity = hullArea > 0 ? pixelCount / hullArea : 1;

  // Count corners via polygon approximation
  const corners = approximatePolygonCorners(hull);

  // Improved shape classification
  let shape: DetectedPart['shape'] = 'box';

  if (circularity > 0.65 && convexity > 0.85 && aspectRatio > 0.65 && aspectRatio < 1.5) {
    shape = 'sphere';
  } else if (circularity > 0.5 && convexity > 0.8 && (aspectRatio < 0.45 || aspectRatio > 2.2)) {
    shape = 'capsule';
  } else if (corners <= 4 && fillRatio > 0.75 && convexity > 0.85) {
    shape = 'box';
  } else if (corners === 3 || (fillRatio < 0.55 && convexity > 0.7)) {
    shape = 'cone';
  } else if (convexity > 0.85 && (aspectRatio < 0.45 || aspectRatio > 2.2)) {
    shape = 'cylinder';
  } else if (circularity > 0.45 && fillRatio > 0.7) {
    shape = 'cylinder';
  }

  const bounds = { x: minX / w, y: minY / h, w: bw / w, h: bh / h };

  const sm = 5;
  const cx = (bounds.x + bounds.w / 2 - 0.5) * sm;
  const cy = (0.5 - (bounds.y + bounds.h / 2)) * sm;
  const sx = bounds.w * sm;
  const sy = bounds.h * sm;
  const sz = Math.min(sx, sy) * 0.5;

  return {
    id: regionId,
    label: `Part ${regionId + 1}`,
    shape,
    color: rgbToHex(tR / pixelCount, tG / pixelCount, tB / pixelCount),
    bounds,
    position: [cx, cy, 0],
    scale: [Math.max(0.2, sx), Math.max(0.2, sy), Math.max(0.2, sz)],
    pixelCount,
    circularity,
    aspectRatio,
    convexity,
  };
}

// ---- Convex Hull (Graham Scan) ----

function convexHull(points: [number, number][]): [number, number][] {
  if (points.length < 3) return points;

  // Sample if too many points
  let pts = points;
  if (pts.length > 500) {
    const step = Math.floor(pts.length / 500);
    pts = pts.filter((_, i) => i % step === 0);
  }

  // Find lowest-rightmost point
  let pivot = 0;
  for (let i = 1; i < pts.length; i++) {
    if (pts[i][1] > pts[pivot][1] || (pts[i][1] === pts[pivot][1] && pts[i][0] < pts[pivot][0]))
      pivot = i;
  }
  [pts[0], pts[pivot]] = [pts[pivot], pts[0]];
  const p0 = pts[0];

  pts.sort((a, b) => {
    const angleA = Math.atan2(a[1] - p0[1], a[0] - p0[0]);
    const angleB = Math.atan2(b[1] - p0[1], b[0] - p0[0]);
    return angleA - angleB;
  });

  const stack: [number, number][] = [pts[0], pts[1]];
  for (let i = 2; i < pts.length; i++) {
    while (stack.length > 1) {
      const a = stack[stack.length - 2];
      const b = stack[stack.length - 1];
      const c = pts[i];
      const cross = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
      if (cross <= 0) stack.pop();
      else break;
    }
    stack.push(pts[i]);
  }
  return stack;
}

function polygonArea(pts: [number, number][]): number {
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    area += pts[i][0] * pts[j][1];
    area -= pts[j][0] * pts[i][1];
  }
  return Math.abs(area) / 2;
}

function approximatePolygonCorners(hull: [number, number][]): number {
  if (hull.length < 3) return hull.length;
  // Douglas-Peucker simplification
  const epsilon = Math.sqrt(polygonArea(hull)) * 0.05;
  const simplified = douglasPeucker(hull, epsilon);
  return simplified.length;
}

function douglasPeucker(points: [number, number][], epsilon: number): [number, number][] {
  if (points.length <= 2) return points;
  let maxDist = 0, maxIdx = 0;
  const [start, end] = [points[0], points[points.length - 1]];

  for (let i = 1; i < points.length - 1; i++) {
    const d = pointLineDistance(points[i], start, end);
    if (d > maxDist) { maxDist = d; maxIdx = i; }
  }

  if (maxDist > epsilon) {
    const left = douglasPeucker(points.slice(0, maxIdx + 1), epsilon);
    const right = douglasPeucker(points.slice(maxIdx), epsilon);
    return [...left.slice(0, -1), ...right];
  }
  return [start, end];
}

function pointLineDistance(p: [number, number], a: [number, number], b: [number, number]): number {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return Math.sqrt((p[0] - a[0]) ** 2 + (p[1] - a[1]) ** 2);
  return Math.abs(dx * (a[1] - p[1]) - dy * (a[0] - p[0])) / len;
}

// ---- Visualization ----

function createVisualization(
  labels: Int32Array, parts: DetectedPart[], w: number, h: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(w, h);
  const d = imgData.data;

  const colorMap = new Map<number, [number, number, number]>();
  for (const p of parts) {
    const hex = p.color;
    colorMap.set(p.id, [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]);
  }

  for (let i = 0; i < labels.length; i++) {
    const j = i * 4;
    const c = colorMap.get(labels[i]);
    if (c) { d[j] = c[0]; d[j + 1] = c[1]; d[j + 2] = c[2]; d[j + 3] = 220; }
    else { d[j] = 20; d[j + 1] = 20; d[j + 2] = 40; d[j + 3] = 255; }
  }
  ctx.putImageData(imgData, 0, 0);

  // Bounding boxes + labels
  for (const p of parts) {
    const bx = p.bounds.x * w, by = p.bounds.y * h;
    const bw = p.bounds.w * w, bh = p.bounds.h * h;

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    // Shape icon in corner
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(bx, by - 20, Math.max(bw, 90), 20);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`${p.label} [${p.shape}]`, bx + 3, by - 6);
  }

  return canvas;
}

function createEdgeVisualization(edges: Uint8Array, w: number, h: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(w, h);
  const d = imgData.data;
  for (let i = 0; i < edges.length; i++) {
    const j = i * 4;
    d[j] = d[j + 1] = d[j + 2] = edges[i];
    d[j + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

// ---- Main Analysis ----

export function analyzeImage(
  image: HTMLImageElement | HTMLCanvasElement,
  options?: { threshold?: number; minPixels?: number; maxParts?: number; bgThreshold?: number }
): AnalysisResult {
  const threshold = options?.threshold ?? COLOR_THRESHOLD;
  const minPixels = options?.minPixels ?? MIN_REGION_PIXELS;
  const maxParts = options?.maxParts ?? 30;
  const bgThreshold = options?.bgThreshold ?? 30;

  const canvas = document.createElement('canvas');
  const maxDim = 512;
  const scale = Math.min(maxDim / image.width, maxDim / image.height, 1);
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const w = canvas.width, h = canvas.height;
  const imgData = ctx.getImageData(0, 0, w, h);

  // Edge detection
  const edges = sobelEdges(imgData, w, h);

  // Background color
  const bgColor = detectBackground(imgData, w, h);

  // Edge-aware segmentation
  let { labels, regionCount } = segmentWithEdges(imgData, edges, bgColor, w, h, threshold, bgThreshold);

  // Merge small regions
  ({ labels, regionCount } = mergeSmallRegions(labels, w, h, regionCount, minPixels));

  // Analyze each region
  const parts: DetectedPart[] = [];
  for (let i = 0; i < regionCount && parts.length < maxParts; i++) {
    const p = analyzeRegion(labels, imgData, w, h, i);
    if (p) parts.push(p);
  }
  parts.sort((a, b) => b.pixelCount - a.pixelCount);
  parts.forEach((p, i) => { p.label = `Part ${i + 1}`; });

  const segmentCanvas = createVisualization(labels, parts, w, h);
  const edgeCanvas = createEdgeVisualization(edges, w, h);

  return { parts, width: w, height: h, segmentCanvas, edgeCanvas };
}

// ---- Manual Region → Part ----

export function manualRegionToPart(
  region: ManualRegion,
  image: HTMLImageElement | HTMLCanvasElement
): DetectedPart {
  // Sample average color from the image region
  const canvas = document.createElement('canvas');
  const maxDim = 512;
  const scale = Math.min(maxDim / image.width, maxDim / image.height, 1);
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const w = canvas.width, h = canvas.height;
  const rx = Math.floor(region.bounds.x * w);
  const ry = Math.floor(region.bounds.y * h);
  const rw = Math.max(1, Math.floor(region.bounds.w * w));
  const rh = Math.max(1, Math.floor(region.bounds.h * h));

  const imgData = ctx.getImageData(rx, ry, rw, rh);
  const src = imgData.data;
  let tR = 0, tG = 0, tB = 0, count = 0;
  for (let i = 0; i < src.length; i += 4) {
    if (src[i + 3] > 30) { tR += src[i]; tG += src[i + 1]; tB += src[i + 2]; count++; }
  }
  const color = count > 0 ? rgbToHex(tR / count, tG / count, tB / count) : '#888888';

  const sm = 5;
  const cx = (region.bounds.x + region.bounds.w / 2 - 0.5) * sm;
  const cy = (0.5 - (region.bounds.y + region.bounds.h / 2)) * sm;
  const sx = region.bounds.w * sm;
  const sy = region.bounds.h * sm;
  const sz = Math.min(sx, sy) * 0.5;

  return {
    id: region.id,
    label: region.label,
    shape: region.shape,
    color,
    bounds: region.bounds,
    position: [cx, cy, 0],
    scale: [Math.max(0.2, sx), Math.max(0.2, sy), Math.max(0.2, sz)],
    pixelCount: rw * rh,
    circularity: 0,
    aspectRatio: rw / (rh || 1),
    convexity: 1,
  };
}

export function shapeToBlockType(shape: DetectedPart['shape']): string {
  switch (shape) {
    case 'box': return 'box';
    case 'cylinder': return 'cylinder';
    case 'sphere': return 'sphere';
    case 'cone': return 'cone';
    case 'capsule': return 'capsule';
    default: return 'box';
  }
}
