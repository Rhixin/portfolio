// Certificate frame sheets: each is a 2x2 grid of frames (left to right, top to
// bottom) with a transparent centre. Measured from the alpha channel.
export const CERT_FRAME_SHEET = { width: 1536, height: 1024 };

export type CertFrameVariant = {
  src: string;
  // Frame outline inside a sheet cell (cell is half the sheet in each direction)
  box: { x: number; y: number; w: number; h: number };
  // Transparent opening inside the box, inclusive pixel edges
  inner: { l: number; r: number; t: number; b: number };
};

export const CERT_FRAME_VARIANTS: CertFrameVariant[] = [
  {
    src: "/frames/cert-frame-gold.png",
    box: { x: 50, y: 47, w: 670, h: 399 },
    inner: { l: 43, r: 628, t: 44, b: 354 },
  },
  {
    src: "/frames/cert-frame-silver.png",
    box: { x: 46, y: 51, w: 678, h: 410 },
    inner: { l: 38, r: 638, t: 41, b: 369 },
  },
  {
    src: "/frames/cert-frame-walnut.png",
    box: { x: 41, y: 42, w: 688, h: 431 },
    inner: { l: 70, r: 623, t: 69, b: 369 },
  },
  {
    src: "/frames/cert-frame-emerald.png",
    box: { x: 41, y: 49, w: 686, h: 414 },
    inner: { l: 44, r: 642, t: 46, b: 367 },
  },
  {
    src: "/frames/cert-frame-violet.png",
    box: { x: 30, y: 29, w: 708, h: 452 },
    inner: { l: 68, r: 640, t: 72, b: 377 },
  },
];
