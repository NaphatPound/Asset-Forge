export type FilterType = 'none' | 'pixelate' | 'outline' | 'grayscale' | 'sepia' | 'invert' | 'posterize';

export const FILTER_LABELS: Record<FilterType, string> = {
  none: 'None',
  pixelate: 'Pixelate',
  outline: 'Outline',
  grayscale: 'Grayscale',
  sepia: 'Sepia',
  invert: 'Invert',
  posterize: 'Posterize',
};

export function applyFilter(canvas: HTMLCanvasElement, filter: FilterType): void {
  if (filter === 'none') return;

  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  switch (filter) {
    case 'pixelate':
      applyPixelate(ctx, w, h);
      return; // pixelate uses drawImage, not putImageData
    case 'outline':
      applyOutline(data, w, h);
      break;
    case 'grayscale':
      applyGrayscale(data);
      break;
    case 'sepia':
      applySepia(data);
      break;
    case 'invert':
      applyInvert(data);
      break;
    case 'posterize':
      applyPosterize(data);
      break;
  }

  ctx.putImageData(imageData, 0, 0);
}

function applyPixelate(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const blockSize = Math.max(2, Math.floor(Math.max(w, h) / 48));
  // Downscale then upscale with nearest-neighbor
  const smallW = Math.ceil(w / blockSize);
  const smallH = Math.ceil(h / blockSize);

  const tmpCanvas = document.createElement('canvas');
  tmpCanvas.width = smallW;
  tmpCanvas.height = smallH;
  const tmpCtx = tmpCanvas.getContext('2d')!;
  tmpCtx.drawImage(ctx.canvas, 0, 0, smallW, smallH);

  ctx.clearRect(0, 0, w, h);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tmpCanvas, 0, 0, w, h);
  ctx.imageSmoothingEnabled = true;
}

function applyOutline(data: Uint8ClampedArray, w: number, h: number): void {
  const src = new Uint8ClampedArray(data);
  const threshold = 20;
  const outlineR = 20, outlineG = 20, outlineB = 30;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const alpha = src[i + 3];

      if (alpha > threshold) {
        // Check if any neighbor is transparent (edge pixel)
        let isEdge = false;
        for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || nx >= w || ny < 0 || ny >= h) {
            isEdge = true;
            break;
          }
          const ni = (ny * w + nx) * 4;
          if (src[ni + 3] <= threshold) {
            isEdge = true;
            break;
          }
        }
        if (isEdge) {
          data[i] = outlineR;
          data[i + 1] = outlineG;
          data[i + 2] = outlineB;
          data[i + 3] = 255;
        }
      }
    }
  }
}

function applyGrayscale(data: Uint8ClampedArray): void {
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }
}

function applySepia(data: Uint8ClampedArray): void {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
    data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
    data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
  }
}

function applyInvert(data: Uint8ClampedArray): void {
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
}

function applyPosterize(data: Uint8ClampedArray): void {
  const levels = 4;
  const step = 255 / (levels - 1);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(Math.round(data[i] / step) * step);
    data[i + 1] = Math.round(Math.round(data[i + 1] / step) * step);
    data[i + 2] = Math.round(Math.round(data[i + 2] / step) * step);
  }
}
