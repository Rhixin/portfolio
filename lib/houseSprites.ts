// House sprite sheets for the experience section: six frames in a row with a
// transparent background. Frame rectangles are measured from the alpha channel.
export type HouseVariant = {
  name: string;
  src: string;
  sheet: { width: number; height: number };
  frames: { x: number; y: number; w: number; h: number }[];
};

export const HOUSE_VARIANTS: HouseVariant[] = [
  {
    name: "Bakery",
    src: "/experiences-house/house-bakery.png",
    sheet: { width: 2170, height: 725 },
    frames: [
    { x: 6, y: 217, w: 352, h: 351 },
    { x: 368, y: 217, w: 352, h: 351 },
    { x: 729, y: 217, w: 352, h: 351 },
    { x: 1091, y: 217, w: 352, h: 351 },
    { x: 1453, y: 217, w: 352, h: 351 },
    { x: 1814, y: 217, w: 352, h: 351 },
    ],
  },
  {
    name: "Florist",
    src: "/experiences-house/house-florist.png",
    sheet: { width: 2170, height: 725 },
    frames: [
    { x: 3, y: 209, w: 358, h: 371 },
    { x: 365, y: 209, w: 358, h: 371 },
    { x: 726, y: 209, w: 358, h: 371 },
    { x: 1088, y: 209, w: 358, h: 371 },
    { x: 1450, y: 209, w: 358, h: 371 },
    { x: 1811, y: 209, w: 358, h: 371 },
    ],
  },
  {
    name: "Potion Shop",
    src: "/experiences-house/house-potion.png",
    sheet: { width: 2170, height: 725 },
    frames: [
    { x: 0, y: 218, w: 362, h: 353 },
    { x: 362, y: 218, w: 362, h: 353 },
    { x: 723, y: 218, w: 362, h: 353 },
    { x: 1085, y: 218, w: 362, h: 353 },
    { x: 1447, y: 218, w: 362, h: 353 },
    { x: 1808, y: 218, w: 362, h: 353 },
    ],
  },
  {
    name: "Blacksmith",
    src: "/experiences-house/house-blacksmith.png",
    sheet: { width: 2172, height: 724 },
    frames: [
    { x: 5, y: 192, w: 353, h: 370 },
    { x: 367, y: 192, w: 353, h: 370 },
    { x: 729, y: 192, w: 353, h: 370 },
    { x: 1091, y: 192, w: 353, h: 370 },
    { x: 1453, y: 192, w: 353, h: 370 },
    { x: 1815, y: 192, w: 353, h: 370 },
    ],
  },
  {
    name: "Bookstore",
    src: "/experiences-house/house-bookstore.png",
    sheet: { width: 2170, height: 725 },
    frames: [
    { x: 5, y: 203, w: 354, h: 364 },
    { x: 367, y: 203, w: 354, h: 364 },
    { x: 728, y: 203, w: 354, h: 364 },
    { x: 1090, y: 203, w: 354, h: 364 },
    { x: 1452, y: 203, w: 354, h: 364 },
    { x: 1813, y: 203, w: 354, h: 364 },
    ],
  },
  {
    name: "Tea House",
    src: "/experiences-house/house-teahouse.png",
    sheet: { width: 2170, height: 725 },
    frames: [
    { x: 4, y: 204, w: 353, h: 368 },
    { x: 366, y: 204, w: 353, h: 368 },
    { x: 727, y: 204, w: 353, h: 368 },
    { x: 1089, y: 204, w: 353, h: 368 },
    { x: 1451, y: 204, w: 353, h: 368 },
    { x: 1812, y: 204, w: 353, h: 368 },
    ],
  },
  {
    name: "Gem Shop",
    src: "/experiences-house/house-gem.png",
    sheet: { width: 2170, height: 725 },
    frames: [
    { x: 2, y: 201, w: 357, h: 354 },
    { x: 364, y: 201, w: 357, h: 354 },
    { x: 725, y: 201, w: 357, h: 354 },
    { x: 1087, y: 201, w: 357, h: 354 },
    { x: 1449, y: 201, w: 357, h: 354 },
    { x: 1810, y: 201, w: 357, h: 354 },
    ],
  },
];
