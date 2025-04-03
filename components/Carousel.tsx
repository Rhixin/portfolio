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
    <div className="bg-[#a9bcd0] rounded-2xl max-h-[40vh]">
      <div className="relative flex items-center justify-center overflow-hidden w-full mx-auto mt-2">
        {/* Slides Container */}
        <div
          className="flex transition-transform duration-500 ease-in-out w-full"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((item, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 flex justify-center items-center px-2 sm:px-4 min-h-[38vh]"
            >
              <Image
                src={item}
                alt={item}
                width={500}
                height={200}
                layout="intrinsic" // Ensures responsive scaling
                objectFit="cover" // Ensures images fill the container without distortion
                className="transition-transform transform hover:scale-105 duration-300"
              />
            </div>
          ))}
        </div>

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="absolute left-0 sm:left-2 bg-[#373f51] hover:bg-[#1b1b1e] text-white cursor-pointer p-1 sm:p-2 rounded-full transition transform -translate-y-1/2 top-1/2 focus:outline-none focus:ring-2 focus:ring-[rgb(14,175,103)]"
          aria-label="Previous"
        >
          <ChevronLeft size={20} className="sm:h-6 sm:w-6" />
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="absolute right-0 sm:right-2 bg-[#373f51] hover:bg-[#1b1b1e] text-white cursor-pointer p-1 sm:p-2 rounded-full transition transform -translate-y-1/2 top-1/2 focus:outline-none focus:ring-2 focus:ring-[rgb(14,175,103)]"
          aria-label="Next"
        >
          <ChevronRight size={20} className="sm:h-6 sm:w-6" />
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center mt-8 sm:mt-8">
        {images.map((_, i) => (
          <button
            key={i}
            className={`h-2 w-2 sm:h-2.5 sm:w-2.5 mx-1 sm:mx-1.5 rounded-full transition-all duration-300 cursor-pointer ${
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
      <div className="text-center mt-2 sm:mt-4 text-[#373f51] text-sm sm:text-base">
        {index + 1} of {images.length}
      </div>
    </div>
  );
}
