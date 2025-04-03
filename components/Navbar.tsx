"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const menuItems = ["About Me", "Projects", "Resume", "Contact"];

  // Track scroll direction
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      setIsVisible(window.scrollY < lastScrollY);
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //Route handler
  useEffect(() => {
    const currentPath = pathname.replace("/", "").replace(/-/g, " ");
    const index = menuItems.findIndex(
      (item) => item.toLowerCase() === currentPath
    );
    if (index !== -1) {
      setActiveIndex(index);
    }
  }, [pathname]);

  const handleNavigation = (index, name) => {
    setActiveIndex(index);
    router.push(`/${name.toLowerCase().replace(/\s+/g, "-")}`);
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
      className={`sticky top-7 w-full z-10 transition-opacity max-w-[840px] m-auto duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Navigation Bar */}
      <div className="rounded-full relative w-full bg-[#a9bcd0] transition-colors duration-300 shadow-md">
        <ul className="flex w-full justify-between relative">
          {/* Moving Background Indicator */}
          <div
            className="absolute bottom-0 h-full bg-gradient-to-r from-[#373f51] to-[#1b1b1e] transition-all duration-300 rounded-full shadow-md"
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
                className={`w-full py-3 transition-colors duration-300 font-medium md:px-8 px-4 cursor-pointer ${
                  activeIndex === index
                    ? "text-white font-bold"
                    : "text-[#373f51] hover:text-[#1b1b1e]"
                }`}
                onClick={() => handleNavigation(index, item)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
