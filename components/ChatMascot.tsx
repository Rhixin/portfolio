"use client";
import { pixelTitle } from "@/lib/fonts";
import { CHAT_FRAMES } from "@/lib/spriteSheet";
import SpriteAnimator from "@/components/SpriteAnimator";

export default function ChatMascot() {
  return (
    <div className="relative">
      <SpriteAnimator
        frames={CHAT_FRAMES}
        frameMs={260}
        boxWidth={160}
        boxHeight={224}
        className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
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
