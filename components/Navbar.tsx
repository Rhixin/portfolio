"use client";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const menuItems = ["About Me", "Skills", "Education", "Projects", "Contact"];

  // Track active section with intersection observer
  useEffect(() => {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver(
      (entries) => {
        let visibleSections = entries.filter(entry => entry.isIntersecting);
        
        if (visibleSections.length > 0) {
          // Get the section that's most visible
          const mostVisible = visibleSections.reduce((prev, current) => {
            return current.intersectionRatio > prev.intersectionRatio ? current : prev;
          });
          
          const sectionElement = mostVisible.target as HTMLElement;
          const sectionIndex = Array.from(sections).indexOf(sectionElement);
          
          // Map sections to navbar items correctly
          if (sectionIndex === 0) {
            setActiveIndex(0); // Hero -> About Me
          } else if (sectionIndex === 1) {
            setActiveIndex(0); // About Me -> About Me
          } else if (sectionIndex === 2) {
            setActiveIndex(1); // Skills -> Skills
          } else if (sectionIndex === 3) {
            setActiveIndex(2); // Education -> Education
          } else if (sectionIndex === 4) {
            setActiveIndex(3); // Projects -> Projects
          } else if (sectionIndex === 5) {
            setActiveIndex(4); // Contact -> Contact
          }
        }
      },
      {
        threshold: [0.1, 0.25, 0.5, 0.75], // Multiple thresholds for better detection
        rootMargin: '-20% 0px -20% 0px' // Better detection area
      }
    );

    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  // Track scroll direction - hide on scroll up
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDifference = Math.abs(currentScrollY - lastScrollY);
          
          // Hide navbar when scrolling up by more than 5px
          // Show navbar when scrolling down or at top
          const isAtTop = currentScrollY < 100;
          const isScrollingUp = currentScrollY < lastScrollY && scrollDifference > 5;
          const isScrollingDown = currentScrollY > lastScrollY && scrollDifference > 5;
          
          if (isAtTop) {
            setIsVisible(true);
          } else if (isScrollingUp) {
            setIsVisible(false); // Hide when scrolling up
          } else if (isScrollingDown) {
            setIsVisible(true); // Show when scrolling down
          }
          
          // Calculate opacity based on scroll position
          const maxScroll = 200;
          const opacity = isAtTop ? 1 : Math.max(0.8, 1 - (currentScrollY / maxScroll));
          setScrollOpacity(opacity);
          
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    const sections = document.querySelectorAll('section');
    if (sections[index + 1]) { // +1 because we skip the hero section for navbar
      sections[index + 1].scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      setActiveIndex(index);
    }
  };

  // Total letters in all menu items
  const totalLetters = menuItems.reduce((sum, item) => sum + item.length, 0);

  // Get the percentage width of each item based on its letter count
  const getWidth = (item) => (item.length / totalLetters) * 100;

  // Get the left position based on previous items
  const getLeftPosition = (index) => {
    return menuItems
      .slice(0, index)
      .reduce((sum, item) => sum + getWidth(item), 0);
  };

  return (
    <div
      className={`sticky top-7 w-full z-50 transition-all max-w-6xl m-auto duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-8 scale-95"
      }`}
    >
      {/* Navigation Bar */}
      <div 
        className="rounded-full relative w-full transition-all duration-300 shadow-lg md:shadow-2xl hover:shadow-cyan-500/25"
        style={{ 
          opacity: scrollOpacity,
          background: 'rgba(10, 10, 15, 0.95)',
          backdropFilter: 'blur(40px) saturate(200%) brightness(1.1)',
          WebkitBackdropFilter: 'blur(40px) saturate(200%) brightness(1.1)',
          border: '1px solid rgba(0, 245, 255, 0.4)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 245, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        <ul className="flex w-full justify-between relative">
          {/* Moving Background Indicator */}
          <div
            className="absolute bottom-0 h-full bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 transition-all duration-500 rounded-full shadow-lg glow-border"
            style={{
              width: `calc(${getWidth(menuItems[activeIndex])}%)`,
              left: `calc(${getLeftPosition(activeIndex)}%)`,
            }}
          />

          {menuItems.map((item, index) => (
            <li
              key={index}
              className="relative text-center z-10"
              style={{ width: `calc(${getWidth(item)}%)` }}
            >
              <button
                className={`w-full py-3 md:py-4 transition-all duration-300 font-medium px-2 sm:px-4 md:px-8 cursor-pointer rounded-full relative overflow-hidden group text-xs sm:text-sm md:text-base ${
                  activeIndex === index
                    ? "text-white font-bold"
                    : "text-gray-300 hover:text-cyan-400"
                }`}
                onClick={() => scrollToSection(index)}
              >
                {/* Hover effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
                <span className="relative z-10">{item}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
