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
