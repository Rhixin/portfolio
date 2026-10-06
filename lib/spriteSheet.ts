// Measured from the alpha channel of public/imagesv2/others/z-character.png.
// The sheet is not an even grid, so each sprite has its own pixel rectangle.
export const SHEET_URL = "/imagesv2/others/z-character.png";
export const SHEET_WIDTH = 1632;
export const SHEET_HEIGHT = 2596;

export type SpriteRect = { x: number; y: number; w: number; h: number };

// Chat icon loop: arms-crossed smile, open palm, glasses adjust, hand gesture
export const CHAT_FRAMES: SpriteRect[] = [
  { x: 24, y: 43, w: 282, h: 417 },
  { x: 11, y: 468, w: 287, h: 385 },
  { x: 334, y: 468, w: 302, h: 385 },
  { x: 667, y: 468, w: 292, h: 385 },
  { x: 998, y: 468, w: 303, h: 385 },
  { x: 1332, y: 43, w: 279, h: 417 },
];

// Last row: close-up face frames for the experience profile
export const CLOSEUP_FRAMES: SpriteRect[] = [
  { x: 15, y: 2193, w: 378, h: 403 },
  { x: 423, y: 2193, w: 377, h: 403 },
  { x: 832, y: 2193, w: 378, h: 403 },
  { x: 1241, y: 2193, w: 375, h: 403 },
];

// Scroll unroll sheet: 12 frames in a 4x3 grid, played left to right, top to
// bottom, then held on the last (open) frame. Measured from the alpha channel.
export const SCROLL_SHEET_URL = "/imagesv2/others/scroll-unroll.png";
export const SCROLL_SHEET_WIDTH = 1448;
export const SCROLL_SHEET_HEIGHT = 1086;

export const SCROLL_UNROLL_FRAMES: SpriteRect[] = [
  { x: 39, y: 125, w: 282, h: 137 },
  { x: 402, y: 111, w: 282, h: 156 },
  { x: 764, y: 104, w: 281, h: 170 },
  { x: 1126, y: 89, w: 282, h: 191 },
  { x: 40, y: 413, w: 281, h: 222 },
  { x: 402, y: 399, w: 282, h: 245 },
  { x: 763, y: 389, w: 282, h: 262 },
  { x: 1126, y: 376, w: 282, h: 283 },
  { x: 39, y: 729, w: 282, h: 298 },
  { x: 402, y: 720, w: 282, h: 316 },
  { x: 763, y: 713, w: 283, h: 328 },
  { x: 1126, y: 712, w: 282, h: 328 },
];
