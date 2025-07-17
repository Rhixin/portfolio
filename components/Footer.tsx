"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faFacebook,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          
          // Show footer when:
          // 1. Near the bottom (within 300px of bottom)
          // 2. At the very bottom of the page
          const distanceFromBottom = documentHeight - (scrollY + windowHeight);
          const isNearBottom = distanceFromBottom < 300;
          const isAtBottom = distanceFromBottom < 50;
          
          setIsVisible(isNearBottom || isAtBottom);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <footer className={`sticky bottom-7 w-full z-40 transition-all max-w-6xl m-auto duration-700 ease-out flex justify-center items-center py-4 glass-effect neon-border rounded-full shadow-2xl hover:shadow-cyan-500/25 ${
      isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
    }`}>
      <div className="flex space-x-10 h-[20px]">
        <a
          href="https://github.com/Rhixin"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer w-[20px] group transition-all duration-300 hover:scale-110"
        >
          <FontAwesomeIcon 
            icon={faGithub} 
            size="lg" 
            className="text-gray-300 group-hover:text-cyan-400 transition-colors duration-300 group-hover:glow-text" 
          />
        </a>

        <a
          href="https://www.facebook.com/zhaztedrhixin.valles/"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer w-[20px] group transition-all duration-300 hover:scale-110"
        >
          <FontAwesomeIcon 
            icon={faFacebook} 
            size="lg" 
            className="text-gray-300 group-hover:text-purple-400 transition-colors duration-300 group-hover:glow-text" 
          />
        </a>

        <a
          href="https://www.linkedin.com/in/rhixin-valles-051152258/"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer w-[20px] group transition-all duration-300 hover:scale-110"
        >
          <FontAwesomeIcon 
            icon={faLinkedin} 
            size="lg" 
            className="text-gray-300 group-hover:text-pink-400 transition-colors duration-300 group-hover:glow-text" 
          />
        </a>
      </div>
    </footer>
  );
}
