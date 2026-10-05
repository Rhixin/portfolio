"use client";
import { pixelTitle } from "@/lib/fonts";
import SpriteAnimator from "@/components/SpriteAnimator";

// Friendly idle loop from the upper rows of the spritesheet (last row is reserved for the profile picture)
const CHAT_FRAMES = [0, 5, 6, 7, 8, 4];

export default function ChatMascot() {
  return (
    <div className="relative w-24 h-32">
      <SpriteAnimator
        frames={CHAT_FRAMES}
        frameMs={260}
        cellWidth={96}
        cellHeight={128}
        className="absolute inset-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
      />
      <div
        className={`${pixelTitle.className} absolute -top-12 right-0 whitespace-nowrap bg-white text-[#3b2412] text-[9px] px-2 py-1.5 border-2 border-[#3b2412] shadow-md`}
      >
        Ask me anything!
        <span className="absolute -bottom-2 right-6 w-2 h-2 bg-white border-r-2 border-b-2 border-[#3b2412] rotate-45" />
      </div>
    </div>
  );
}
