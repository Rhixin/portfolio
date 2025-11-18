"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function Carousel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-[#a9bcd0] rounded-xl sm:rounded-2xl max-h-[40vh]">
      <div className="relative flex items-center justify-center overflow-hidden w-full mx-auto mt-2">
        {/* Slides Container */}
        <div
          className="flex w-full will-change-transform"
          style={{
            transform: `translate3d(-${index * 100}%, 0, 0)`,
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {images.map((item, imgIndex) => (
            <div
              key={imgIndex}
              className="w-full flex-shrink-0 flex justify-center items-center px-1 sm:px-2 md:px-4 min-h-[30vh] sm:min-h-[35vh] md:min-h-[38vh]"
            >
              <Image
                src={item}
                alt={item}
                width={500}
                height={200}
                className="w-full h-auto max-h-[28vh] sm:max-h-[32vh] md:max-h-[35vh] object-cover transition-transform duration-200 ease-out hover:scale-[1.02] will-change-transform"
                priority={imgIndex === 0}
                loading={imgIndex === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="absolute left-0.5 sm:left-1 md:left-2 bg-[#373f51] hover:bg-[#1b1b1e] text-white cursor-pointer p-1 sm:p-1.5 md:p-2 rounded-full transition transform -translate-y-1/2 top-1/2 focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-[rgb(14,175,103)]"
          aria-label="Previous"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="absolute right-0.5 sm:right-1 md:right-2 bg-[#373f51] hover:bg-[#1b1b1e] text-white cursor-pointer p-1 sm:p-1.5 md:p-2 rounded-full transition transform -translate-y-1/2 top-1/2 focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-[rgb(14,175,103)]"
          aria-label="Next"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center mt-4 sm:mt-6 md:mt-8">
        {images.map((_, i) => (
          <button
            key={i}
            className={`h-1.5 w-1.5 sm:h-2 sm:w-2 md:h-2.5 md:w-2.5 mx-0.5 sm:mx-1 md:mx-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              index === i
                ? "bg-[#1b1b1e] scale-110"
                : "bg-[#a9bcd0] hover:bg-[#58a4b0]"
            }`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="text-center mt-2 sm:mt-3 md:mt-4 pb-2 text-[#373f51] text-xs sm:text-sm md:text-base">
        {index + 1} of {images.length}
      </div>
    </div>
  );
}
