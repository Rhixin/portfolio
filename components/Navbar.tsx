"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Navbar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(true);
  const menuItems = ["About Me", "Skills", "Experience", "Projects", "Certifications", "Contact"];

  // Track active section with intersection observer
  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const projectsSection = document.querySelector("#computer-section");

    const observer = new IntersectionObserver(
      (entries) => {
        let visibleSections = entries.filter((entry) => entry.isIntersecting);

        if (visibleSections.length > 0) {
          // Get the section that's most visible
          const mostVisible = visibleSections.reduce((prev, current) => {
            return current.intersectionRatio > prev.intersectionRatio
              ? current
              : prev;
          });

          const sectionElement = mostVisible.target as HTMLElement;

          // Check if it's the projects section
          if (sectionElement.id === "computer-section") {
            setActiveIndex(3); // Projects
            return;
          }

          const sectionIndex = Array.from(sections).indexOf(sectionElement);

          // Map sections to navbar items correctly
          // Section order: 0=Hero/About, 1=Skills, 2=Experience, 3=3D Phone, 4=Certifications, 5=Contact
          if (sectionIndex === 0) {
            setActiveIndex(0); // Hero -> About Me
          } else if (sectionIndex === 1) {
            setActiveIndex(1); // Skills -> Skills
          } else if (sectionIndex === 2) {
            setActiveIndex(2); // Experience -> Experience
          } else if (sectionIndex === 3) {
            setActiveIndex(3); // 3D Phone -> Projects
          } else if (sectionIndex === 4) {
            setActiveIndex(4); // Certifications -> Certifications
          } else if (sectionIndex >= 5) {
            setActiveIndex(5); // Contact -> Contact
          }
        }
      },
      {
        threshold: [0.1, 0.25, 0.5, 0.75], // Multiple thresholds for better detection
        rootMargin: "-20% 0px -20% 0px", // Better detection area
      }
    );

    sections.forEach((section) => observer.observe(section));
    if (projectsSection) {
      observer.observe(projectsSection);
    }

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      if (projectsSection) {
        observer.unobserve(projectsSection);
      }
    };
  }, []);

  // Track scroll direction and expand/collapse navbar
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    let scrollUpDistance = 0; // Track cumulative scroll up distance
    let expandTimeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDifference = Math.abs(currentScrollY - lastScrollY);

          const isAtTop = currentScrollY < 100;
          const isScrollingUp =
            currentScrollY < lastScrollY && scrollDifference > 5;
          const isScrollingDown =
            currentScrollY > lastScrollY && scrollDifference > 5;

          // Track scroll up distance
          if (isScrollingUp) {
            scrollUpDistance += scrollDifference;
          } else if (isScrollingDown) {
            // Reset scroll up distance when scrolling down
            scrollUpDistance = 0;
            // Clear any pending expand timeout
            if (expandTimeout) {
              clearTimeout(expandTimeout);
              expandTimeout = null;
            }
          }

          // Navbar visibility and expansion
          if (isAtTop) {
            setIsVisible(true);
            setIsExpanded(true); // Expanded at top
            scrollUpDistance = 0;
          } else if (isScrollingUp) {
            setIsVisible(true); // Show when scrolling up

            // Only expand after scrolling up at least 150px
            if (scrollUpDistance >= 150) {
              // Add a small delay before expanding
              if (!expandTimeout) {
                expandTimeout = setTimeout(() => {
                  setIsExpanded(true);
                  expandTimeout = null;
                }, 200); // 200ms delay
              }
            }
          } else if (isScrollingDown) {
            setIsVisible(true); // Show when scrolling down
            setIsExpanded(false); // Collapsed when scrolling down
          }

          // Calculate opacity based on scroll position
          const maxScroll = 200;
          const opacity = isAtTop
            ? 1
            : Math.max(0.8, 1 - currentScrollY / maxScroll);
          setScrollOpacity(opacity);

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (expandTimeout) {
        clearTimeout(expandTimeout);
      }
    };
  }, []);

  const scrollToSection = (index: number) => {
    // Special handling for Projects since it's in the stacking container
    if (index === 3) {
      // Find the computer section (laptop projects)
      const projectsSection = document.querySelector('#computer-section');
      if (projectsSection) {
        projectsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        setActiveIndex(index);
        return;
      }
    }

    const sections = document.querySelectorAll("section");
    // Map navbar items to sections: About Me(0)->0, Skills(1)->1, Experience(2)->2, Projects(3)->computer, Certifications(4)->4, Contact(5)->5
    const sectionMap = [0, 1, 2, 3, 4, 5]; // navbar index -> section index
    const targetSection = sections[sectionMap[index]];
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setActiveIndex(index);
    }
  };

  // Total letters in all menu items
  const totalLetters = menuItems.reduce((sum, item) => sum + item.length, 0);

  // Get the percentage width of each item based on its letter count
  const getWidth = (item: string) => (item.length / totalLetters) * 100;

  // Get the left position based on previous items
  const getLeftPosition = (index: number) => {
    return menuItems
      .slice(0, index)
      .reduce((sum, item) => sum + getWidth(item), 0);
  };

  return (
    <div
      className={`fixed top-3 sm:top-4 md:top-6 left-0 right-0 w-full z-50 transition-all px-3 sm:px-6 md:px-12 lg:px-16 xl:px-24 duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-8 scale-95"
      }`}
    >
      {/* Navigation Bar */}
      <div
        className="rounded-full relative shadow-md sm:shadow-lg md:shadow-2xl py-2 sm:py-2.5 md:py-3"
        style={{
          opacity: scrollOpacity,
          background: "rgba(10, 10, 15, 0.95)",
          backdropFilter: "blur(40px) saturate(200%) brightness(1.1)",
          WebkitBackdropFilter: "blur(40px) saturate(200%) brightness(1.1)",
          border: "1px solid rgba(100, 100, 120, 0.3)",
          boxShadow:
            "0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          display: "grid",
          gridTemplateColumns: isExpanded ? "1fr auto 1fr" : "0fr auto 0fr",
          transition:
            "grid-template-columns 1.2s cubic-bezier(0.25, 0.1, 0.25, 1), width 1.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
          width: isExpanded ? "100%" : "fit-content",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {/* Left Navigation Menu */}
        <ul
          className="flex items-center gap-0.5 sm:gap-1 md:gap-2 lg:gap-4 overflow-hidden justify-start"
          style={{
            opacity: isExpanded ? 1 : 0,
            transition: "opacity 0.8s ease",
            paddingLeft: isExpanded ? "0.75rem" : "0",
            paddingRight: isExpanded ? "0.5rem" : "0",
          }}
        >
          {menuItems.slice(0, 3).map((item, index) => (
            <li
              key={index}
              className="relative"
              style={{
                opacity: isExpanded ? 1 : 0,
                transition: isExpanded
                  ? `opacity 0.6s ease ${0.6 + index * 0.1}s`
                  : `opacity 0.6s ease ${(1 - index) * 0.1}s`,
              }}
            >
              <button
                className={`px-2 sm:px-3 md:px-4 lg:px-6 py-1.5 sm:py-2 transition-all duration-300 font-medium cursor-pointer rounded-full relative overflow-hidden group text-[10px] sm:text-xs md:text-sm lg:text-base whitespace-nowrap ${
                  activeIndex === index
                    ? "bg-[#FF6B35] text-white font-bold shadow-lg shadow-[#FF6B35]/30"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => scrollToSection(index)}
              >
                <span className="relative z-10">{item}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Logo - Centered and Fixed */}
        <div className="flex items-center justify-center flex-shrink-0 px-2 sm:px-3 md:px-4">
          <Image
            src="/imagesv2/others/z.png"
            alt="ZCreations"
            width={120}
            height={40}
            className="h-6 sm:h-8 md:h-10 w-auto object-contain"
          />
        </div>

        {/* Right Navigation Menu */}
        <ul
          className="flex items-center gap-0.5 sm:gap-1 md:gap-2 lg:gap-4 overflow-hidden justify-end"
          style={{
            opacity: isExpanded ? 1 : 0,
            transition: "opacity 0.8s ease",
            paddingLeft: isExpanded ? "0.5rem" : "0",
            paddingRight: isExpanded ? "0.75rem" : "0",
          }}
        >
          {menuItems.slice(3).map((item, index) => {
            const actualIndex = index + 3;
            const reverseIndex = menuItems.slice(3).length - 1 - index;
            return (
              <li
                key={actualIndex}
                className="relative"
                style={{
                  opacity: isExpanded ? 1 : 0,
                  transition: isExpanded
                    ? `opacity 0.6s ease ${0.6 + index * 0.1}s`
                    : `opacity 0.6s ease ${reverseIndex * 0.1}s`,
                }}
              >
                <button
                  className={`px-2 sm:px-3 md:px-4 lg:px-6 py-1.5 sm:py-2 transition-all duration-300 font-medium cursor-pointer rounded-full relative overflow-hidden group text-[10px] sm:text-xs md:text-sm lg:text-base whitespace-nowrap ${
                    activeIndex === actualIndex
                      ? "bg-[#FF6B35] text-white font-bold shadow-lg shadow-[#FF6B35]/30"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => scrollToSection(actualIndex)}
                >
                  <span className="relative z-10">{item}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
