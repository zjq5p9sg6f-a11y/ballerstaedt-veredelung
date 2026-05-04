// @ts-nocheck
import * as THREE from "three";

export interface NormalMapOptions {
  strength?: number;
  invert?: boolean;
}

export function imageToNormalMap(
  source: HTMLImageElement | HTMLCanvasElement,
  options: NormalMapOptions = {}
): THREE.CanvasTexture {
  const strength = options.strength ?? 2.0;
  const sign = options.invert ? -1 : 1;

  const w = source.width;
  const h = source.height;

  const reader = document.createElement("canvas");
  reader.width = w;
  reader.height = h;
  const rctx = reader.getContext("2d");
  rctx.drawImage(source, 0, 0);
  const src = rctx.getImageData(0, 0, w, h).data;

  const height = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const r = src[i * 4];
    const g = src[i * 4 + 1];
    const b = src[i * 4 + 2];
    const a = src[i * 4 + 3] / 255;
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    height[i] = lum * a;
  }

  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const octx = out.getContext("2d");
  const img = octx.createImageData(w, h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const x0 = x === 0 ? 0 : x - 1;
      const x1 = x === w - 1 ? w - 1 : x + 1;
      const y0 = y === 0 ? 0 : y - 1;
      const y1 = y === h - 1 ? h - 1 : y + 1;

      const tl = height[y0 * w + x0];
      const tc = height[y0 * w + x];
      const tr = height[y0 * w + x1];
      const ml = height[y * w + x0];
      const mr = height[y * w + x1];
      const bl = height[y1 * w + x0];
      const bc = height[y1 * w + x];
      const br = height[y1 * w + x1];

      const dx = tr + 2 * mr + br - (tl + 2 * ml + bl);
      const dy = bl + 2 * bc + br - (tl + 2 * tc + tr);

      const nx = -dx * strength * sign;
      const ny = -dy * strength * sign;
      const nz = 1;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;

      const o = i * 4;
      img.data[o] = Math.round(((nx / len) * 0.5 + 0.5) * 255);
      img.data[o + 1] = Math.round(((ny / len) * 0.5 + 0.5) * 255);
      img.data[o + 2] = Math.round(((nz / len) * 0.5 + 0.5) * 255);
      img.data[o + 3] = 255;
    }
  }

  octx.putImageData(img, 0, 0);

  const texture = new THREE.CanvasTexture(out);
  texture.colorSpace = THREE.NoColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function dataUrlToImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

export async function dataUrlToNormalMap(
  dataUrl: string,
  options: NormalMapOptions = {}
): Promise<THREE.CanvasTexture> {
  const img = await dataUrlToImage(dataUrl);
  return imageToNormalMap(img, options);
}

export async function dataUrlToDiffuseTexture(
  dataUrl: string
): Promise<THREE.CanvasTexture> {
  const img = await dataUrlToImage(dataUrl);
  const c = document.createElement("canvas");
  c.width = img.width;
  c.height = img.height;
  c.getContext("2d").drawImage(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export async function dataUrlToAlphaMask(
  dataUrl: string,
  threshold: number = 0.5
): Promise<THREE.CanvasTexture> {
  const img = await dataUrlToImage(dataUrl);
  const c = document.createElement("canvas");
  c.width = img.width;
  c.height = img.height;
  const ctx = c.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const id = ctx.getImageData(0, 0, c.width, c.height);
  for (let i = 0; i < id.data.length; i += 4) {
    const lum =
      (0.299 * id.data[i] +
        0.587 * id.data[i + 1] +
        0.114 * id.data[i + 2]) /
      255;
    const a = id.data[i + 3] / 255;
    const v = lum * a < threshold ? 255 : 0;
    id.data[i] = v;
    id.data[i + 1] = v;
    id.data[i + 2] = v;
    id.data[i + 3] = 255;
  }
  ctx.putImageData(id, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.NoColorSpace;
  tex.needsUpdate = true;
  return tex;
}
