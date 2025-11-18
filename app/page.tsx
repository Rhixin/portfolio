"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faFacebook,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faVideo, faLink } from "@fortawesome/free-solid-svg-icons";
import Project from "@/components/Project";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";

// Website projects data for tabs
const websiteProjects = [
  {
    name: "Room Radar",
    description:
      "A room reservation and management system with real-time availability tracking and booking functionality",
    tech: ["React", "Node.js", "MongoDB", "Express"],
    screenshots: 8,
    folder: "roomradarweb",
  },
  {
    name: "Sinehan",
    description:
      "A cinema ticketing and movie booking platform with seat selection and payment integration",
    tech: ["PHP", "MySQL", "JavaScript", "Bootstrap"],
    screenshots: 8,
    folder: "sinehan",
  },
  {
    name: "IMS - MNSTS",
    description:
      "Inventory Management System for Medellin National Science and Technology School with stock tracking and reporting",
    tech: ["PHP", "MySQL", "JavaScript", "Chart.js"],
    screenshots: 10,
    folder: "ims",
  },
  {
    name: "MNSTS Website",
    description:
      "Official school website for publications, news, announcements, and school information",
    tech: ["WordPress", "PHP", "MySQL", "JavaScript"],
    screenshots: 7,
    folder: "mnsts",
  },
];

// 3D Computer Model Component
function ComputerModel({ currentProject }: { currentProject: number }) {
  const { scene } = useGLTF("/3dmodels/desktop_computer.glb");
  const [monitorTexture, setMonitorTexture] = useState<THREE.Texture | null>(
    null
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(1);

  // Auto-transition through images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const maxImages = websiteProjects[currentProject].screenshots;
        return prev >= maxImages ? 1 : prev + 1;
      });
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [currentProject]);

  useEffect(() => {
    if (currentProject !== null) {
      const textureLoader = new THREE.TextureLoader();
      const imagePath = `/imagesv2/${websiteProjects[currentProject].folder}/${currentImageIndex}.png`;
      textureLoader.load(imagePath, (texture) => {
        texture.flipY = false;
        setMonitorTexture(texture);
      });
    }
  }, [currentProject, currentImageIndex]);

  // Auto-transition monitor textures
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev >= 8 ? 1 : prev + 1));
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scene) {
      const textureLoader = new THREE.TextureLoader();

      // Load the replacement texture based on current image index
      const imagePath = `/imagesv2/roomradartexture/${currentImageIndex}.png`;
      textureLoader.load(imagePath, (newTexture) => {
        let allTextures: any[] = [];

        scene.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            const material = child.material as any;

            // Collect all baseColor textures
            if (material.map) {
              allTextures.push({
                material: material,
                texture: material.map,
                materialName: material.name,
              });
            }
          }
        });

        // Replace the texture at index 4 (5th texture, corresponding to texture ID 12)
        if (allTextures.length > 4) {
          const targetMaterial = allTextures[4].material;
          const oldTexture = allTextures[4].texture;

          // Copy properties from old texture to new texture to match original settings
          newTexture.flipY = oldTexture.flipY;
          newTexture.wrapS = oldTexture.wrapS;
          newTexture.wrapT = oldTexture.wrapT;
          newTexture.encoding = oldTexture.encoding;
          newTexture.minFilter = oldTexture.minFilter;
          newTexture.magFilter = oldTexture.magFilter;
          newTexture.anisotropy = oldTexture.anisotropy;

          // Apply the new texture
          targetMaterial.map = newTexture;
          targetMaterial.needsUpdate = true;
        }
      });
    }
  }, [scene, currentImageIndex]);

  return <primitive object={scene} scale={0.011} />;
}

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [roadmapProgress, setRoadmapProgress] = useState(0);
  const [activeEducationIndex, setActiveEducationIndex] = useState(-1);
  const [activeProjectIndex, setActiveProjectIndex] = useState(-1);
  const [projectHoverIndex, setProjectHoverIndex] = useState(-1);
  const [expandedProjects, setExpandedProjects] = useState<number[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([
    {
      role: "assistant",
      content:
        "Hello! I'm Rhixin's AI assistant. Feel free to ask me anything about my skills, projects, or experience!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const [chatPosition, setChatPosition] = useState({ x: 0, y: 0 });
  const [isDraggingChat, setIsDraggingChat] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const [heroScrollProgress, setHeroScrollProgress] = useState(0);
  const [phoneRotation, setPhoneRotation] = useState({ x: -10, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1); // 1 for next, -1 for prev
  const phoneResetTimeout = useRef<NodeJS.Timeout | null>(null);
  const [laptopRotation, setLaptopRotation] = useState({ x: -5, y: 15 });
  const [isLaptopDragging, setIsLaptopDragging] = useState(false);
  const laptopResetTimeout = useRef<NodeJS.Timeout | null>(null);
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [currentWebsiteScreenshot, setCurrentWebsiteScreenshot] = useState(0);
  const [showRoomRadarImages, setShowRoomRadarImages] = useState(false);
  const [currentRoomRadarImage, setCurrentRoomRadarImage] = useState(0);
  const [isHoveringRoomRadarImage, setIsHoveringRoomRadarImage] =
    useState(false);
  const [computerSectionOpacity, setComputerSectionOpacity] = useState(1);

  // Scroll transition progress (0 = Room Radar, 1 = Sinehan)
  const [projectTransitionProgress, setProjectTransitionProgress] = useState(0);
  const laptopSectionRef = useRef<HTMLElement>(null);

  // Game console section state
  const [gameTransitionProgress, setGameTransitionProgress] = useState(0);
  const consoleSectionRef = useRef<HTMLElement>(null);
  const [showGameImages, setShowGameImages] = useState(false);
  const [currentGameImage, setCurrentGameImage] = useState(0);
  const [isHoveringGameImage, setIsHoveringGameImage] = useState(false);
  const [consoleRotation, setConsoleRotation] = useState({ x: -5, y: -15 });
  const [isConsoleDragging, setIsConsoleDragging] = useState(false);
  const consoleResetTimeout = useRef<NodeJS.Timeout | null>(null);

  const [currentPowerSystemsImage, setCurrentPowerSystemsImage] = useState(0);
  const [isHoveringPowerSystemsImage, setIsHoveringPowerSystemsImage] =
    useState(false);
  const [currentSinehanImage, setCurrentSinehanImage] = useState(0);
  const [isHoveringSinehanImage, setIsHoveringSinehanImage] = useState(false);
  const [currentIMSImage, setCurrentIMSImage] = useState(0);
  const [isHoveringIMSImage, setIsHoveringIMSImage] = useState(false);
  const [currentMNSTSImage, setCurrentMNSTSImage] = useState(0);
  const [isHoveringMNSTSImage, setIsHoveringMNSTSImage] = useState(false);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const educationRefs = useRef<(HTMLDivElement | null)[]>([]);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Auto-advance screenshots
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideDirection(1);
      setCurrentScreenshot((prev) => (prev + 1) % 11);
    }, 3000); // Change screenshot every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Reset website screenshot when tab changes
  useEffect(() => {
    setCurrentWebsiteScreenshot(0);
  }, [activeTab]);

  // Auto-advance website screenshots
  useEffect(() => {
    if (activeTab === null) return;

    const interval = setInterval(() => {
      setCurrentWebsiteScreenshot(
        (prev) => (prev + 1) % websiteProjects[activeTab].screenshots
      );
    }, 4000); // Change screenshot every 4 seconds

    return () => clearInterval(interval);
  }, [activeTab, websiteProjects]);

  // Auto-advance Room Radar screenshots
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoomRadarImage((prev) => (prev < 7 ? prev + 1 : 0));
    }, 4000); // Change screenshot every 4 seconds

    return () => clearInterval(interval);
  }, []);

  // Track scroll progress for 5 projects (0-10)
  // Each project gets 2 viewport heights: hold time + transition time
  useEffect(() => {
    const handleScroll = () => {
      if (!laptopSectionRef.current) return;

      const section = laptopSectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Progress from 0 to 10 for 5 projects (2vh per project)
      // More scrolling time per project before transitioning
      if (rect.top <= 0 && rect.bottom > windowHeight) {
        const progress = Math.min(
          Math.max((-rect.top / windowHeight) * 1, 0),
          10
        );
        setProjectTransitionProgress(progress);
      } else if (rect.top > 0) {
        setProjectTransitionProgress(0);
      } else if (rect.bottom <= windowHeight) {
        setProjectTransitionProgress(10);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track scroll progress for 2 games (0-4)
  // Each game gets 2 viewport heights
  useEffect(() => {
    const handleScroll = () => {
      if (!consoleSectionRef.current) return;

      const section = consoleSectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Progress from 0 to 4 for 2 games (2vh per game)
      if (rect.top <= 0 && rect.bottom > windowHeight) {
        const progress = Math.min(
          Math.max((-rect.top / windowHeight) * 1, 0),
          4
        );
        setGameTransitionProgress(progress);
      } else if (rect.top > 0) {
        setGameTransitionProgress(0);
      } else if (rect.bottom <= windowHeight) {
        setGameTransitionProgress(4);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-advance Power Systems Inc screenshots
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPowerSystemsImage((prev) => (prev < 8 ? prev + 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto-advance Sinehan screenshots
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSinehanImage((prev) => (prev < 7 ? prev + 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto-advance IMS screenshots
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIMSImage((prev) => (prev < 9 ? prev + 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto-advance MNSTS screenshots
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMNSTSImage((prev) => (prev < 6 ? prev + 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto-advance Game screenshots
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGameImage((prev) => {
        // For Maze Horror Game (0-1.6 progress) - 5 photos
        if (gameTransitionProgress <= 1.6) {
          return prev < 4 ? prev + 1 : 0;
        }
        // For CITerraria (2-4 progress) - 3 photos
        else if (gameTransitionProgress >= 2) {
          return prev < 2 ? prev + 1 : 0;
        }
        return prev;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [gameTransitionProgress]);

  // Handle hero section scroll animations
  useEffect(() => {
    const handleHeroScroll = () => {
      const heroSection = sectionsRef.current[0];
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate scroll progress (0 to 1)
        // When section is fully visible: progress = 0
        // When section is scrolled out: progress = 1
        let progress = 0;

        if (rect.top <= 0 && rect.bottom >= 0) {
          // Scrolling down - section is being scrolled out of view
          progress = Math.min(1, Math.abs(rect.top) / windowHeight);
        } else if (rect.top > 0) {
          // Section is below viewport - fully reset
          progress = 0;
        } else if (rect.bottom < 0) {
          // Section is completely above viewport
          progress = 1;
        }

        setHeroScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleHeroScroll);
    handleHeroScroll(); // Initial call
    return () => window.removeEventListener("scroll", handleHeroScroll);
  }, []);

  // Handle roadmap progress on scroll
  useEffect(() => {
    const handleScroll = () => {
      const educationSection = sectionsRef.current[2];
      if (educationSection) {
        const rect = educationSection.getBoundingClientRect();
        const sectionHeight = rect.height;
        const windowHeight = window.innerHeight;

        // Calculate progress based on how much of the section is visible
        const visibleTop = Math.max(0, windowHeight - rect.top);
        const visibleBottom = Math.min(
          windowHeight,
          windowHeight - rect.bottom
        );
        const visibleHeight = visibleTop + visibleBottom;

        // Progress from 0 to 100 based on scroll position in the section
        const progress = Math.min(
          100,
          Math.max(0, (visibleHeight / windowHeight) * 100)
        );
        setRoadmapProgress(progress);

        // Check which education item is currently active
        let currentActive = -1;
        educationRefs.current.forEach((ref, index) => {
          if (ref) {
            const itemRect = ref.getBoundingClientRect();
            const itemCenter = itemRect.top + itemRect.height / 2;
            const screenCenter = windowHeight / 2;

            // If item center is within the middle 40% of the screen
            if (
              itemCenter >= screenCenter - windowHeight * 0.2 &&
              itemCenter <= screenCenter + windowHeight * 0.2
            ) {
              currentActive = index;
            }
          }
        });

        setActiveEducationIndex(currentActive);

        // Check which project is currently active
        const projectSection = sectionsRef.current[3];
        if (projectSection) {
          let currentActiveProject = -1;
          projectRefs.current.forEach((ref, index) => {
            if (ref) {
              const itemRect = ref.getBoundingClientRect();
              const itemCenter = itemRect.top + itemRect.height / 2;
              const screenCenter = windowHeight / 2;

              // If item center is within the middle 50% of the screen
              if (
                itemCenter >= screenCenter - windowHeight * 0.25 &&
                itemCenter <= screenCenter + windowHeight * 0.25
              ) {
                currentActiveProject = index;
              }
            }
          });

          setActiveProjectIndex(currentActiveProject);
        }

        // Keep computer section always visible for project transitions
        setComputerSectionOpacity(1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    sectionsRef.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setCurrentSection(index);
  };

  const toggleProjectExpansion = (index: number) => {
    setExpandedProjects((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const truncateText = (text: string, maxLength?: number) => {
    const defaultLength =
      typeof window !== "undefined" && window.innerWidth < 768 ? 100 : 150;
    const length = maxLength || defaultLength;
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
  };

  // About Me data
  const titles = ["Fullstack Developer", "Data Analyst", "AI Developer"];
  const [currentTitle, setCurrentTitle] = useState(titles[0]);
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prevIndex) => (prevIndex + 1) % titles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentTitle(titles[titleIndex]);
  }, [titleIndex]);

  // Scroll chat to bottom when messages change
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Handle sending chat messages
  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = { role: "user" as const, content: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const assistantMessage = {
        role: "assistant" as const,
        content: data.message,
      };

      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        role: "assistant" as const,
        content:
          "Sorry, I'm having trouble connecting right now. Please try again later.",
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Drag handlers for chatbox
  const handleChatMouseDown = (e: React.MouseEvent) => {
    if (!chatBoxRef.current) return;
    const rect = chatBoxRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDraggingChat(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingChat) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Get window dimensions
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const chatWidth = 384; // w-96 = 384px
      const chatHeight = 550; // approximate height

      // Constrain to window bounds
      const constrainedX = Math.max(
        0,
        Math.min(newX, windowWidth - chatWidth)
      );
      const constrainedY = Math.max(
        0,
        Math.min(newY, windowHeight - chatHeight)
      );

      setChatPosition({ x: constrainedX, y: constrainedY });
    };

    const handleMouseUp = () => {
      setIsDraggingChat(false);
    };

    if (isDraggingChat) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingChat, dragOffset]);

  const technicalSkills = [
    {
      name: "React",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    },
    {
      name: "Next.js",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    },
    {
      name: "JavaScript",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    },
    {
      name: "TypeScript",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    },
    {
      name: "Python",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    },
    {
      name: "Node.js",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    },
    {
      name: "TensorFlow",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
    },
    {
      name: "MySQL",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    },
    {
      name: "MongoDB",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    },
    {
      name: "Firebase",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
    },
    {
      name: "Django",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
    },
    {
      name: "PHP",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
    },
    {
      name: "Java",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    },
    {
      name: "C++",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    },
    {
      name: "Git",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    },
    {
      name: "Docker",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    },
    {
      name: "AWS",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
    },
    {
      name: "Bootstrap",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
    },
    {
      name: "Tailwind",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
    },
    {
      name: "jQuery",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-original.svg",
    },
    {
      name: "Pandas",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
    },
    {
      name: "ASP.NET",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg",
    },
    {
      name: "SQL",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    },
    {
      name: "C#",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
    },
  ];

  const softSkills = [
    "Adaptability",
    "Critical Thinking",
    "Project Management",
    "Time Management",
    "Accountability",
    "Communication",
    "Leadership",
    "Problem Solving",
    "Teamwork",
    "Creativity",
    "Innovation",
    "Attention to Detail",
  ];

  const experience = [
    {
      logo: "/images/sunasterisk.png",
      name: "Sun Asterisk Philippines",
      additional: "Software Developer Intern",
      year: "Apr 2025 - May 2025",
    },
    {
      logo: "/images/fullscale.png",
      name: "Full Scale",
      additional: "Fullstack Software Developer Intern",
      year: "Jun 2025 - Sep 2025",
    },
    {
      logo: "/images/freelance.png",
      name: "Freelance",
      additional: "Web Developer",
      year: "Jan 2022 - Present",
    },
  ];

  // Contact data
  const contactInfo = [
    {
      label: "Gmail",
      value: "vallestedted@gmail.com",
      icon: faEnvelope,
      link: "vallestedted@gmail.com",
    },
    {
      label: "Number",
      value: "09271935386",
      icon: faPhone,
      link: "tel:+11234567890",
    },
    {
      label: "Address",
      value: "Tres De Abril, Labangon, Cebu City, Cebu",
      icon: faMapMarkerAlt,
      link: "#",
    },
    {
      label: "Facebook",
      value: "Zhazted Rhixin Valles",
      icon: faFacebook,
      link: "https://www.facebook.com/zhaztedrhixin.valles/",
    },
    {
      label: "GitHub",
      value: "Rhixin",
      icon: faGithub,
      link: "https://github.com/Rhixin",
    },
    {
      label: "LinkedIn",
      value: "Rhixin Valles",
      icon: faLinkedin,
      link: "https://www.linkedin.com/in/rhixin-valles-051152258/",
    },
  ];

  // Projects data
  const projectsData = [
    {
      title: "Real-Time Sign Language Recognition",
      description:
        "Built a real-time sign language recognition system leveraging computer vision and deep learning. Integrated TensorFlow and Keras for model training, achieving 98.6% accuracy in gesture classification. Used Flask and Socket.IO for real-time backend communication, and a React-based frontend for live hand tracking and gesture detection. Implemented a responsive UI with Tailwind and deployed the model through a Python-based API. Focused on seamless real-time video processing and improving accessibility for sign language users.",
      images: ["/images/asl/1.png", "/images/asl/2.png", "/images/asl/3.png"],
      technology: [
        "React",
        "Next.js",
        "Tailwind",
        "Tensorflow",
        "Keras",
        "Flask",
        "SocketIo",
        "Python",
        "Numpy",
        "Matplotlib",
      ],
      weblink: "",
      github: "https://github.com/Rhixin/GesturbeeCamera",
      video: "",
    },
    {
      title: "RoomRadar Website",
      description:
        "Developed a landlord-tenant platform that streamlines the process of finding and listing boarding houses, integrating Google Maps API for interactive property listings and advanced search filters for tenants. Built an interactive landlord dashboard for managing listings and a tenant search system with filters for proximity, price range, and availability.",
      images: [
        "/images/roomradarweb/1.png",
        "/images/roomradarweb/2.png",
        "/images/roomradarweb/3.png",
        "/images/roomradarweb/4.png",
        "/images/roomradarweb/5.png",
        "/images/roomradarweb/6.png",
        "/images/roomradarweb/7.png",
        "/images/roomradarweb/8.png",
      ],
      technology: [
        "React",
        "Next.js",
        "Bootstrap",
        "ASP.NET",
        "MySQL",
        "Google Maps API",
      ],
      weblink: "",
      github: "https://github.com/Rhixin/RoomRadarWeb",
      video:
        "https://drive.google.com/file/d/1DF99Y3fcrSaBvUIVIAv3vX1_3yNsSvDV/view?usp=sharing",
    },
    {
      title: "MNSTS School Website",
      description:
        "Developed and deployed a school website on my own using MongoDB for the backend and Next.js for the frontend. The website enables students to access news, announcements, events, organizations, and school achievements while featuring an admin dashboard for managing displayed content. Additionally, it includes an automated email notification system that informs subscribed students about newly added news, announcements, and events.",
      images: [
        "/images/mnsts/1.png",
        "/images/mnsts/2.png",
        "/images/mnsts/3.png",
        "/images/mnsts/4.png",
        "/images/mnsts/5.png",
        "/images/mnsts/6.png",
        "/images/mnsts/7.png",
      ],
      technology: ["Next.js", "Tailwind", "MongoDB", "Cloudinary"],
      weblink: "https://mnsts.vercel.app/home",
      github: "https://github.com/Rhixin/MNSTS",
      video:
        "https://drive.google.com/file/d/1jUZ5zXoWPSDYqGhEWfjZdQjqx3Bz9p-w/view?usp=sharing",
    },
    {
      title: "Cinema System with Reserved Seating",
      description:
        "Developed a cinema ticketing website with an admin panel for listing movies, using SQLite as the database. Implemented a reserved seating feature that allows users to select seats based on their preferences.",
      images: [
        "/images/sinehan/1.png",
        "/images/sinehan/2.png",
        "/images/sinehan/3.png",
        "/images/sinehan/4.png",
        "/images/sinehan/5.png",
        "/images/sinehan/6.png",
        "/images/sinehan/7.png",
        "/images/sinehan/8.png",
      ],
      technology: ["HTML", "CSS", "Javascript", "Python Django", "SQLite"],
      weblink: "",
      github: "https://github.com/elib00/sinehan",
      video:
        "https://drive.google.com/file/d/1e6CuNI87NsXNQK-vW9J3zvgkvF6M5bA_/view?usp=sharing",
    },
    {
      title: "Terraria Game Duplicate",
      description:
        "Developed a 2D game inspired by Terraria, where players mine resources and craft materials to survive. Independently designed and implemented all aspects of the game, except for the graphics. Integrated boss battles as a core mechanic, making victory achievable only by defeating the final boss.",
      images: [
        "/images/terraria/1.png",
        "/images/terraria/2.png",
        "/images/terraria/3.png",
      ],
      technology: ["Java", "libGDX"],
      weblink: "",
      github: "https://github.com/Rhixin/TERRARIA",
      video:
        "https://drive.google.com/file/d/1tJHA7ckE2qhamNhosbw1WbB9_P3gRNBa/view?usp=sharing",
    },
    {
      title: "3D Horror Maze",
      description:
        "I developed a 3D game out of 2D materials using a technique called Raycasting. Raycasting is a rendering technique where virtual rays are cast from the camera into the game world to determine what objects are visible in the scene. It essentially simulates how light rays travel in the real world, allowing a 2D engine to display 3D-like environments. By tracing these rays to detect intersections with objects, I was able to create the illusion of depth and perspective, transforming flat 2D assets into a dynamic 3D experience.",
      images: [
        "/images/maze/1.png",
        "/images/maze/2.png",
        "/images/maze/3.png",
        "/images/maze/4.png",
        "/images/maze/5.png",
      ],
      technology: ["Java", "Raycasting", "JavaFx"],
      weblink: "",
      github: "https://github.com/Rhixin/EscapeSerato",
      video:
        "https://drive.google.com/file/d/12972LaKNp6Q0kfXUXT4n-uHyKxs9-N5r/view?usp=sharing",
    },
    {
      title: "Disease Symptoms Analysis",
      description:
        "I collected and preprocessed a dataset of diseases, symptoms, and side effects, then implemented the Apriori algorithm to identify frequent symptom sets and disease associations. I analyzed relationships between diseases based on shared symptoms to uncover potential correlations, and utilized Seaborn and Matplotlib for visualizations, including heatmaps and network graphs.",
      images: [
        "/images/disease/1.png",
        "/images/disease/2.png",
        "/images/disease/3.png",
        "/images/disease/4.png",
      ],
      technology: ["Python", "Matplotlib", "Pandas", "Seaborn", "Apriori"],
      weblink: "",
      github: "https://github.com/Rhixin/SymptomsDiseaseAnalysis",
      video: "",
    },
  ];

  const AnimatedBackground = () => {
    return (
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-ping"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 245, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 245, 255, 0.15) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>
    );
  };

  return (
    <div className="relative">
      <AnimatedBackground />

      {/* Hero Section - Combined */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        className="min-h-screen flex flex-col items-center justify-center relative px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 py-16"
      >
        {/* Floating Stats Badges - Creative Layout Around Profile */}

        {/* Experience Badge - Top Right */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute top-[20%] right-[2%] sm:right-[5%] md:right-[12%] lg:right-[18%] z-20"
        >
          <div
            className="rounded-full px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 hover:scale-105 transition-all duration-300"
            style={{
              background: "rgba(255, 107, 53, 0.05)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",

              boxShadow:
                "0 4px 12px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm md:text-lg">4+</span>
              </div>
              <div>
                <p className="text-white font-bold text-xs sm:text-sm">Years</p>
                <p className="text-gray-400 text-[10px] sm:text-xs">Experience</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Projects Badge - Right Side Middle */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="absolute top-[50%] right-[1%] sm:right-[4%] md:right-[10%] lg:right-[16%] z-20 -translate-y-1/2"
        >
          <div
            className="rounded-xl px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4 hover:scale-105 transition-all duration-300"
            style={{
              background: "rgba(255, 107, 53, 0.08)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",

              boxShadow:
                "0 4px 12px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] bg-clip-text mb-0.5 sm:mb-1 text-white">
                100+
              </div>
              <p className="text-white font-semibold text-[10px] sm:text-xs">Projects</p>
              <p className="text-gray-400 text-[10px] sm:text-xs">Completed</p>
            </div>
          </div>
        </motion.div>

        {/* Clients Badge - Bottom Right */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="absolute top-[30%] right-[1%] sm:right-[3%] md:right-[6%] lg:right-[11%] z-20"
        >
          <div
            className="rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 hover:scale-105 transition-all duration-300"
            style={{
              background: "rgba(255, 107, 53, 0.06)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              boxShadow:
                "0 4px 12px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#FF6B35]"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#FF8C5A]"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#FFB088]"></div>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white">10+</h3>
              <p className="text-white font-semibold text-[10px] sm:text-xs">
                Clients Satisfied
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="relative z-10 w-full"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1, delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-0 relative overflow-visible">
            {/* Centered Titles overlapping with profile */}
            <div className="text-center relative z-20 md:mr-[-150px] lg:mr-[-200px] xl:mr-[-250px] mb-8 md:mb-0">
              <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-6">
                <span className="text-gray-200">I'm </span>
                <span className="text-[#FF6B35]">Zhazted</span>
                <span className="text-gray-200">,</span>
              </h1>

              <div className="h-20 relative mb-12 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={currentTitle}
                    className="absolute w-full text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-200"
                    initial={{
                      opacity: 0,
                      y: 20,
                      scale: 0.95,
                      filter: "blur(4px)",
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      filter: "blur(0px)",
                      transition: {
                        duration: 0.6,
                        ease: [0.25, 0.1, 0.25, 1],
                        opacity: { duration: 0.4 },
                        scale: { duration: 0.5 },
                      },
                    }}
                    exit={{
                      opacity: 0,
                      y: -20,
                      scale: 0.95,
                      filter: "blur(4px)",
                      transition: {
                        duration: 0.4,
                        ease: [0.25, 0.1, 0.25, 1],
                      },
                    }}
                  >
                    {currentTitle}
                  </motion.h2>
                </AnimatePresence>
              </div>

              {/* CTA Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => scrollToSection(2)}
                  className="group relative px-8 py-4 rounded-full transition-all duration-300 overflow-hidden hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255, 107, 53, 0.8) 0%, rgba(255, 107, 53, 0.6) 100%)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    boxShadow:
                      "0 4px 12px 0 rgba(0, 0, 0, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <span className="relative z-10 text-white font-semibold">
                    Portfolio
                  </span>
                </button>

                <button
                  onClick={() => scrollToSection(1)}
                  className="group relative px-8 py-4 rounded-full transition-all duration-300 overflow-hidden hover:scale-105"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    boxShadow:
                      "0 4px 12px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <span className="relative z-10 text-gray-200 font-semibold group-hover:text-white transition-colors duration-300">
                    Hire me
                  </span>
                </button>
              </div>
            </div>

            {/* Profile image - BIGGER with half orange circle behind */}
            <div className="relative z-10">
              <div className="relative w-[450px] h-[450px] sm:w-[550px] sm:h-[550px] md:w-[650px] md:h-[650px] lg:w-[750px] lg:h-[750px]">
                {/* Half Orange circle behind profile - only top half visible with fade */}
                <div
                  className="absolute bottom-[0%] left-1/2 transform -translate-x-1/2 overflow-hidden"
                  style={{
                    width: "120%",
                    height: "100%",
                    maskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
                  }}
                >
                  <div
                    className="absolute left-1/2 transform -translate-x-1/2 w-[360px] h-[420px] sm:w-[440px] sm:h-[500px] md:w-[520px] md:h-[600px] lg:w-[600px] lg:h-[700px] bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] rounded-full opacity-40 blur-2xl"
                    style={{ bottom: "-180px" }}
                  ></div>
                </div>

                {/* Main image container with fade at bottom */}
                <div
                  className="relative w-full h-full flex items-end justify-center overflow-visible z-10"
                  style={{
                    maskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
                  }}
                >
                  <Image
                    src="/imagesv2/others/profile2.png"
                    alt="Rhixin"
                    width={750}
                    height={750}
                    className="object-contain w-full h-full relative z-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section
        ref={(el) => (sectionsRef.current[1] = el)}
        className="min-h-screen flex flex-col items-center justify-center px-4 py-24 overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full max-w-[95vw]"
        >
          {/* Diagonal Title */}
          <div className="mb-20 relative">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-center relative inline-block w-full">
              <span
                className="bg-gradient-to-r from-[#FF6B35] via-[#FF8C5A] to-[#FFB088] bg-clip-text text-transparent transform -rotate-2 inline-block relative"
                style={{
                  textShadow: "0 0 40px rgba(255, 107, 53, 0.5)",
                  letterSpacing: "0.05em",
                }}
              >
                TECHNICAL SKILLS
              </span>
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-16 h-16 border-4 border-[#FF6B35] opacity-30 transform rotate-12"></div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 border-4 border-[#FF6B35] opacity-20 transform -rotate-12"></div>
            </h2>
          </div>

          <div className="space-y-10">
            {/* First diagonal row - moving down-right (Cyan) */}
            <div className="skills-container-diagonal">
              <div className="flex gap-8 slide-diagonal-right whitespace-nowrap">
                {[
                  ...technicalSkills.slice(0, 7),
                  ...technicalSkills.slice(0, 7),
                ].map((skill, index) => (
                  <div
                    key={`tech-row1-${index}`}
                    className="flex items-center gap-4 px-8 py-6 glass-effect text-cyan-400 text-lg font-semibold rounded-2xl border-2 border-cyan-400/40 hover:border-cyan-400/80 hover:text-white hover:shadow-xl hover:shadow-cyan-400/30 transition-all duration-300 cursor-pointer hover:scale-110 flex-shrink-0 min-w-[220px]"
                  >
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className="w-10 h-10"
                    />
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Second diagonal row - moving down-left (Purple) */}
            <div className="skills-container-diagonal">
              <div className="flex gap-8 slide-diagonal-left whitespace-nowrap">
                {[
                  ...technicalSkills.slice(7, 14),
                  ...technicalSkills.slice(7, 14),
                ].map((skill, index) => (
                  <div
                    key={`tech-row2-${index}`}
                    className="flex items-center gap-4 px-8 py-6 glass-effect text-purple-400 text-lg font-semibold rounded-2xl border-2 border-purple-400/40 hover:border-purple-400/80 hover:text-white hover:shadow-xl hover:shadow-purple-400/30 transition-all duration-300 cursor-pointer hover:scale-110 flex-shrink-0 min-w-[220px]"
                  >
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className="w-10 h-10"
                    />
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Third diagonal row - moving down-right (Orange) */}
            <div className="skills-container-diagonal">
              <div className="flex gap-8 slide-diagonal-right whitespace-nowrap">
                {[
                  ...technicalSkills.slice(14),
                  ...technicalSkills.slice(14),
                ].map((skill, index) => (
                  <div
                    key={`tech-row3-${index}`}
                    className="flex items-center gap-4 px-8 py-6 glass-effect text-[#FF6B35] text-lg font-semibold rounded-2xl border-2 border-[#FF6B35]/40 hover:border-[#FF6B35]/80 hover:text-white hover:shadow-xl hover:shadow-[#FF6B35]/30 transition-all duration-300 cursor-pointer hover:scale-110 flex-shrink-0 min-w-[220px]"
                  >
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className="w-10 h-10"
                    />
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Experience Section - Platformer Style */}
      <section
        ref={(el) => {
          sectionsRef.current[2] = el;
          let lastScrollTime = Date.now();
          let isScrolling = false;
          let scrollTimeout: NodeJS.Timeout;

          const handleScroll = () => {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const sectionHeight = el.offsetHeight;
            const viewportHeight = window.innerHeight;

            // Calculate scroll progress within this section
            const scrollStart = -rect.top;
            const scrollEnd = sectionHeight - viewportHeight;
            const scrollProgress = Math.max(
              0,
              Math.min(1, scrollStart / scrollEnd)
            );

            // Move background (platforms) instead of avatar
            const backgroundElement = document.getElementById(
              "experience-background"
            );
            if (backgroundElement) {
              // Move from right to left as user scrolls
              const translateX = -scrollProgress * 120; // Move 120% of width
              backgroundElement.style.transform = `translateX(${translateX}%)`;
            }

            // Update experience bar
            const expBarFill = document.getElementById("exp-bar-fill");
            const expLevel = document.getElementById("exp-level");
            const expText = document.getElementById("exp-text");
            const levelUpNotification = document.getElementById(
              "level-up-notification"
            );

            if (expBarFill && expLevel && expText) {
              // Calculate progress (0-100%)
              const barProgress = scrollProgress * 100;
              expBarFill.style.width = `${barProgress}%`;
              expText.textContent = `${Math.floor(barProgress)} / 100 EXP`;

              // Track previous level to detect level ups
              if (!window.previousLevel) window.previousLevel = 1;

              // Calculate when each platform reaches the center (where avatar is at 50%)
              // Platforms are now at 40%, 90%, 140% of the 250% wide background
              // Background moves from 0% to -150% (translateX = -scrollProgress * 150)
              // Platform reaches center when: platformPos - (scrollProgress * 150) = 50
              // scrollProgress = (platformPos - 50) / 150

              // Platform 1 (40%): starts left of center but close
              // Platform 2 (90%): starts right of center
              // Platform 3 (140%): starts right of center

              // Platform 1 at 40% reaches center at: (40-50)/150 = -0.067 (never reaches naturally)
              // Since it starts just left of center, let's trigger early in scroll
              // Platform 2 at 90% reaches center at: (90-50)/150 = 0.267
              // Platform 3 at 140% reaches center at: (140-50)/150 = 0.6

              let currentLevel = 1;
              if (scrollProgress >= 0.6) {
                currentLevel = 4;
                expLevel.textContent = "LV.4 MAX";
              } else if (scrollProgress >= 0.267) {
                currentLevel = 3;
                expLevel.textContent = "LV.3";
              } else if (scrollProgress >= 0.04) {
                currentLevel = 2;
                expLevel.textContent = "LV.2";
              } else {
                currentLevel = 1;
                expLevel.textContent = "LV.1";
              }

              // Show level up notification
              if (currentLevel > window.previousLevel && levelUpNotification) {
                levelUpNotification.style.opacity = "1";
                levelUpNotification.style.transform = "translate(-50%, -20px)";

                setTimeout(() => {
                  levelUpNotification.style.opacity = "0";
                  levelUpNotification.style.transform = "translate(-50%, 0px)";
                }, 1500);
              }

              window.previousLevel = currentLevel;
            }

            // Update sprite based on scroll state
            const spriteElement = document.getElementById("experience-sprite");
            const avatarElement = document.getElementById("experience-avatar");

            if (spriteElement && avatarElement) {
              const currentTime = Date.now();

              // Switch to running sprite when scrolling
              if (!isScrolling) {
                isScrolling = true;
                avatarElement.classList.add("running");
                avatarElement.classList.remove("idle");

                // Switch to running sprite sheet (484x86, still 7 frames)
                spriteElement.style.backgroundImage =
                  "url(/imagesv2/games/knightrun.png)";
                spriteElement.style.backgroundSize = "700% 100%";
                spriteElement.style.backgroundPosition = "0% 0";
              }

              lastScrollTime = currentTime;

              // Reset to idle after scrolling stops
              clearTimeout(scrollTimeout);
              scrollTimeout = setTimeout(() => {
                isScrolling = false;
                avatarElement.classList.remove("running");
                avatarElement.classList.add("idle");

                // Switch to idle sprite with animation
                spriteElement.style.backgroundImage =
                  "url(/imagesv2/games/knightidle.png)";
                spriteElement.style.backgroundSize = "400% 100%";
              }, 150);
            }
          };

          window.addEventListener("scroll", handleScroll);
          return () => window.removeEventListener("scroll", handleScroll);
        }}
        className="relative"
        style={{ height: "400vh" }}
      >
        {/* Sticky container */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Experience Bar */}
          <motion.div
            className="absolute top-28 left-20 w-96 z-20"
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Profile Picture and EXP Bar */}
            <div className="flex items-center gap-4 mb-3">
              {/* Profile Picture - Game Style */}
              <div className="relative w-20 h-20 flex-shrink-0">
                {/* Main frame */}
                <div className="relative w-full h-full rounded-full border-4 border-[#FF6B35] bg-gradient-to-br from-[#1a1a2e] to-[#0f1419] p-0.5">
                  {/* Inner border */}
                  <div className="w-full h-full rounded-full border-2 border-[#FF8C5A]/50 overflow-hidden relative">
                    <Image
                      src="/imagesv2/others/profile.png"
                      alt="Profile"
                      width={72}
                      height={72}
                      className="rounded-full w-full h-full object-cover"
                      style={{ imageRendering: "auto" }}
                    />
                    {/* Scan line effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent animate-scan pointer-events-none"></div>
                  </div>
                </div>

                {/* Rotating hexagon effect */}
                <div className="absolute inset-0 animate-spin-slow opacity-30 pointer-events-none">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <polygon
                      points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
                      fill="none"
                      stroke="url(#grad)"
                      strokeWidth="2"
                      className="drop-shadow-[0_0_8px_rgba(255,107,53,0.8)]"
                    />
                    <defs>
                      <linearGradient
                        id="grad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          style={{ stopColor: "#FF6B35", stopOpacity: 1 }}
                        />
                        <stop
                          offset="50%"
                          style={{ stopColor: "#FF8C5A", stopOpacity: 1 }}
                        />
                        <stop
                          offset="100%"
                          style={{ stopColor: "#FFB088", stopOpacity: 1 }}
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Level and Progress Label */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span
                    className="text-xs font-mono font-bold text-gray-300 tracking-wider"
                    style={{
                      fontFamily: "monospace",
                      imageRendering: "pixelated",
                    }}
                  >
                    EXP PROGRESS
                  </span>
                  <span
                    className="text-xs font-mono font-bold text-[#FF6B35] tracking-wider"
                    id="exp-level"
                    style={{
                      fontFamily: "monospace",
                      imageRendering: "pixelated",
                    }}
                  >
                    LV.1
                  </span>
                </div>
              </div>
            </div>

            {/* Pixel-style container */}
            <div className="relative">
              {/* Outer pixel border */}
              <div className="relative bg-black p-1">
                <div className="relative h-10 bg-[#1a1a2e] border-4 border-[#374151] overflow-hidden">
                  {/* Progress bar fill */}
                  <div
                    id="exp-bar-fill"
                    className="absolute top-0 left-0 h-full transition-all duration-300 ease-out relative"
                    style={{
                      width: "0%",
                      background:
                        "repeating-linear-gradient(90deg, #FF6B35 0px, #FF6B35 2px, #FF8C5A 2px, #FF8C5A 4px)",
                    }}
                  >
                    {/* Animated scan line */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/4 animate-scan"></div>
                  </div>

                  {/* Pixel grid overlay */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
                      backgroundSize: "4px 4px",
                    }}
                  ></div>

                  {/* Milestone markers - pixel style */}
                  <div className="absolute top-0 left-[33.33%] w-1 h-full bg-white/30"></div>
                  <div className="absolute top-0 left-[66.66%] w-1 h-full bg-white/30"></div>

                  {/* EXP text inside bar */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-xs font-mono font-bold text-white/80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                      id="exp-text"
                      style={{ fontFamily: "monospace" }}
                    >
                      0 / 100 EXP
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Game Container */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          >
            {/* Scrolling Background with Platforms */}
            <div
              id="experience-background"
              className="absolute top-0 bottom-0 left-0 transition-transform duration-100 ease-linear"
              style={{ width: "250%", transform: "translateX(0%)" }}
            >
              {/* Continuous Ground Platform - Spans entire background */}
              <div className="absolute bottom-0 left-0 w-full flex flex-col">
                {/* Row 1 (Top) - [0,0], [0,1] repeated, [0,3] */}
                <div className="flex w-full">
                  {/* Left corner [0,0] */}
                  <div
                    className="w-16 h-16 flex-shrink-0"
                    style={{
                      backgroundImage: "url(/imagesv2/games/tileset.png)",
                      backgroundSize: "400% 400%",
                      backgroundPosition: "0% 0%",
                      imageRendering: "pixelated",
                    }}
                  ></div>
                  {/* Middle tiles [0,1] - repeat many times to fill width */}
                  {[...Array(120)].map((_, i) => (
                    <div
                      key={`ground-top-${i}`}
                      className="w-16 h-16 flex-shrink-0"
                      style={{
                        backgroundImage: "url(/imagesv2/games/tileset.png)",
                        backgroundSize: "400% 400%",
                        backgroundPosition: "33.33% 0%",
                        imageRendering: "pixelated",
                      }}
                    ></div>
                  ))}
                  {/* Right corner [0,3] */}
                  <div
                    className="w-16 h-16 flex-shrink-0"
                    style={{
                      backgroundImage: "url(/imagesv2/games/tileset.png)",
                      backgroundSize: "400% 400%",
                      backgroundPosition: "100% 0%",
                      imageRendering: "pixelated",
                    }}
                  ></div>
                </div>

                {/* Row 2 (Bottom) - [1,0], [1,1] repeated, [1,3] */}
                <div className="flex w-full relative">
                  <div className="w-16 h-16 flex-shrink-0 relative">
                    <div
                      style={{
                        backgroundImage: "url(/imagesv2/games/tileset.png)",
                        backgroundSize: "400% 400%",
                        backgroundPosition: "0% 33.33%",
                        imageRendering: "pixelated",
                        width: "100%",
                        height: "100%",
                      }}
                    ></div>
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to bottom, transparent 0%, transparent 20%, rgba(10, 10, 15, 0.95) 100%)",
                      }}
                    ></div>
                  </div>
                  {[...Array(120)].map((_, i) => (
                    <div
                      key={`ground-mid-${i}`}
                      className="w-16 h-16 flex-shrink-0 relative"
                    >
                      <div
                        style={{
                          backgroundImage: "url(/imagesv2/games/tileset.png)",
                          backgroundSize: "400% 400%",
                          backgroundPosition: "33.33% 33.33%",
                          imageRendering: "pixelated",
                          width: "100%",
                          height: "100%",
                        }}
                      ></div>
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(to bottom, transparent 0%, rgba(10, 10, 15, 0.7) 100%)",
                        }}
                      ></div>
                    </div>
                  ))}
                  <div className="w-16 h-16 flex-shrink-0 relative">
                    <div
                      style={{
                        backgroundImage: "url(/imagesv2/games/tileset.png)",
                        backgroundSize: "400% 400%",
                        backgroundPosition: "100% 33.33%",
                        imageRendering: "pixelated",
                        width: "100%",
                        height: "100%",
                      }}
                    ></div>
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to bottom, transparent 0%, transparent 20%, rgba(10, 10, 15, 0.95) 100%)",
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Experience Shops - Positioned across the scrolling background */}
              {experience.map((exp, index) => {
                const positions = [35, 60, 90];
                const logos = [
                  "/imagesv2/others/sun.png",
                  "/imagesv2/others/fullscale.png",
                  "/imagesv2/others/zv2.png",
                ];
                const links = [
                  "https://en.sun-asterisk.com/about/",
                  "https://fullscale.io/",
                  "www.linkedin.com/in/zhazted-rhixin-valles-051152258",
                ];
                return (
                  <div
                    key={index}
                    className="absolute bottom-32"
                    style={{
                      left: `${positions[index]}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    {/* Company Info Above Shop */}
                    <div className="absolute -top-36 left-1/2 -translate-x-1/2 text-center w-64">
                      {/* Logo */}
                      <div className="flex justify-center">
                        <Image
                          src={logos[index]}
                          alt={exp.name}
                          width={160}
                          height={160}
                        />
                      </div>
                      {/* Company Name */}
                      <div className="flex justify-center items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-white drop-shadow-lg">
                          {exp.name}
                        </h3>
                        {/* Clients count for Freelance */}
                        {index === 2 && (
                          <p className="text-[#00f5ff] text-xs font-bold">
                            15+ Clients
                          </p>
                        )}
                      </div>

                      {/* Position */}
                      <p className="text-[#FF8C5A] text-sm font-semibold mb-1">
                        {exp.additional}
                      </p>
                      {/* Duration */}
                      <p className="text-gray-300 text-sm">
                        {index === 2 ? "Jan 2022 - Present" : exp.year}
                      </p>
                    </div>

                    {/* Shop - 8 tiles wide (384px) with hover effects */}
                    <a
                      href={links[index]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative transition-all duration-300 hover:scale-102 cursor-pointer"
                      style={{
                        filter: "drop-shadow(0 0 0 transparent)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter =
                          "drop-shadow(0 0 8px #FF6B35) drop-shadow(0 0 16px #FF6B35)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter =
                          "drop-shadow(0 0 0 transparent)";
                      }}
                    >
                      <div
                        className="shop-sprite"
                        style={{
                          width: "300px",
                          height: "300px",
                          backgroundImage: "url(/imagesv2/games/shop_anim.png)",
                          backgroundSize: "600% 100%",
                          imageRendering: "pixelated",
                        }}
                      ></div>
                    </a>
                  </div>
                );
              })}

              {/* Decorative Elements */}
              {/* Fences - 2 tiles wide (256px) */}
              <Image
                src="/imagesv2/games/fence_1.png"
                alt="fence"
                width={256}
                height={256}
                className="absolute bottom-32"
                style={{ left: "20%", imageRendering: "pixelated" }}
              />
              <Image
                src="/imagesv2/games/fence_1.png"
                alt="fence"
                width={256}
                height={256}
                className="absolute bottom-32"
                style={{ left: "70%", imageRendering: "pixelated" }}
              />

              {/* Grass - 1 tile wide (64px) */}
              <Image
                src="/imagesv2/games/grass_1.png"
                alt="grass"
                width={64}
                height={64}
                className="absolute bottom-32"
                style={{ left: "15%", imageRendering: "pixelated" }}
              />
              <Image
                src="/imagesv2/games/grass_2.png"
                alt="grass"
                width={64}
                height={64}
                className="absolute bottom-32"
                style={{ left: "55%", imageRendering: "pixelated" }}
              />
              <Image
                src="/imagesv2/games/grass_3.png"
                alt="grass"
                width={64}
                height={64}
                className="absolute bottom-32"
                style={{ left: "110%", imageRendering: "pixelated" }}
              />

              {/* Rocks - 1 tile wide (64px) */}
              <Image
                src="/imagesv2/games/rock_1.png"
                alt="rock"
                width={64}
                height={64}
                className="absolute bottom-32"
                style={{ left: "25%", imageRendering: "pixelated" }}
              />
              <Image
                src="/imagesv2/games/rock_2.png"
                alt="rock"
                width={64}
                height={64}
                className="absolute bottom-32"
                style={{ left: "80%", imageRendering: "pixelated" }}
              />
              <Image
                src="/imagesv2/games/rock_3.png"
                alt="rock"
                width={64}
                height={64}
                className="absolute bottom-32"
                style={{ left: "125%", imageRendering: "pixelated" }}
              />

              {/* Lamp - 1 tile wide (64px) */}
              <Image
                src="/imagesv2/games/lamp.png"
                alt="lamp"
                width={64}
                height={96}
                className="absolute bottom-32"
                style={{ left: "45%", imageRendering: "pixelated" }}
              />

              {/* Sign - 1 tile wide (64px) */}
              <Image
                src="/imagesv2/games/sign.png"
                alt="sign"
                width={64}
                height={96}
                className="absolute bottom-32"
                style={{ left: "95%", imageRendering: "pixelated" }}
              />
            </div>

            {/* Avatar - Center, Running in Place */}
            <div
              id="experience-avatar"
              className="absolute left-1/2 bottom-30 -translate-x-1/2 z-10 idle"
            >
              <div className="relative">
                {/* Level up notification - Above character */}
                <div
                  id="level-up-notification"
                  className="absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 pointer-events-none transition-all duration-500 z-20"
                >
                  <div className="bg-[#FF6B35] border-2 border-white px-3 py-1 shadow-2xl">
                    <span
                      className="text-white font-bold text-sm tracking-wider"
                      style={{
                        fontFamily: "monospace",
                        imageRendering: "pixelated",
                      }}
                    >
                      +100 EXP
                    </span>
                  </div>
                </div>

                {/* Avatar character - Sprite Sheet */}
                <div className="w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 overflow-hidden relative">
                  <div
                    id="experience-sprite"
                    className="absolute top-0 left-0"
                    style={{
                      backgroundImage: "url(/imagesv2/games/knightidle.png)",
                      backgroundSize: "400% 100%",
                      backgroundPosition: "0% 0",
                      width: "100%",
                      height: "100%",
                      imageRendering: "pixelated",
                    }}
                  ></div>
                </div>

                {/* Shadow */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-black/40 rounded-full blur-lg"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3D Phone Showcase Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-24 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl w-full"
        >
          {/* Section Title */}
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-center mb-32"
          >
            <span className="bg-gradient-to-r from-[#FF6B35] via-[#FF8C5A] to-[#FFB088] bg-clip-text text-transparent">
              Project Arsenal
            </span>
          </motion.h2>

          {/* 3D Phone Container */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
            {/* Phone 3D Model */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative perspective-[2000px]"
            >
              <div
                className={`relative w-[300px] h-[600px] cursor-grab active:cursor-grabbing ${
                  !isDragging &&
                  phoneRotation.x === -10 &&
                  phoneRotation.y === 20
                    ? "phone-idle"
                    : ""
                }`}
                style={{
                  transformStyle: "preserve-3d",
                  transform:
                    isDragging ||
                    phoneRotation.x !== -10 ||
                    phoneRotation.y !== 20
                      ? `rotateX(${phoneRotation.x}deg) rotateY(${phoneRotation.y}deg)`
                      : undefined,
                  transition: isDragging ? "none" : "transform 0.3s ease-out",
                }}
                onMouseDown={(e) => {
                  setIsDragging(true);

                  // Clear any existing reset timeout
                  if (phoneResetTimeout.current) {
                    clearTimeout(phoneResetTimeout.current);
                  }

                  const startX = e.clientX;
                  const startY = e.clientY;
                  const startRotation = { ...phoneRotation };

                  const handleMouseMove = (moveEvent: MouseEvent) => {
                    const deltaX = moveEvent.clientX - startX;
                    const deltaY = moveEvent.clientY - startY;
                    setPhoneRotation({
                      x: Math.max(
                        -45,
                        Math.min(45, startRotation.x - deltaY * 0.5)
                      ),
                      y: Math.max(
                        -45,
                        Math.min(45, startRotation.y + deltaX * 0.5)
                      ),
                    });
                  };

                  const handleMouseUp = () => {
                    setIsDragging(false);
                    document.removeEventListener("mousemove", handleMouseMove);
                    document.removeEventListener("mouseup", handleMouseUp);

                    // Reset phone to idle position after 3 seconds of inactivity
                    phoneResetTimeout.current = setTimeout(() => {
                      setPhoneRotation({ x: -10, y: 20 });
                    }, 3000);
                  };

                  document.addEventListener("mousemove", handleMouseMove);
                  document.addEventListener("mouseup", handleMouseUp);
                }}
              >
                {/* Phone Body */}
                <div
                  className="absolute inset-0 rounded-[40px] border-8 border-gray-900"
                  style={{
                    background:
                      "linear-gradient(145deg, #1a1a2e 0%, #0f1419 100%)",
                    boxShadow:
                      "0 25px 50px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.1)",
                    transformStyle: "preserve-3d",
                    transform: "translateZ(10px)",
                  }}
                >
                  {/* Screen */}
                  <div className="absolute inset-4 rounded-[32px] overflow-hidden bg-black">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>

                    {/* Screen Content - Screenshot Carousel */}
                    <div className="w-full h-full relative">
                      <AnimatePresence initial={false} custom={slideDirection}>
                        <motion.div
                          key={currentScreenshot}
                          custom={slideDirection}
                          initial={{ x: "100%", opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: "-100%", opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="w-full h-full absolute inset-0"
                        >
                          <Image
                            src={`/imagesv2/gesturbee/${
                              currentScreenshot + 1
                            }.png`}
                            alt={`GesturBee Screenshot ${
                              currentScreenshot + 1
                            }`}
                            fill
                            className="object-cover"
                            style={{ objectFit: "cover" }}
                          />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Side Button */}
                  <div
                    className="absolute right-0 top-32 w-1 h-16 bg-gray-800 rounded-l"
                    style={{ transform: "translateZ(12px)" }}
                  ></div>

                  {/* Volume Buttons */}
                  <div
                    className="absolute left-0 top-28 w-1 h-10 bg-gray-800 rounded-r"
                    style={{ transform: "translateZ(12px)" }}
                  ></div>
                  <div
                    className="absolute left-0 top-40 w-1 h-10 bg-gray-800 rounded-r"
                    style={{ transform: "translateZ(12px)" }}
                  ></div>
                </div>

                {/* Glow Effect */}
                <div
                  className="absolute inset-0 rounded-[40px] opacity-50 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, rgba(255, 107, 53, 0.3), transparent 70%)",
                    filter: "blur(20px)",
                    transform: "translateZ(-10px)",
                  }}
                ></div>
              </div>
            </motion.div>

            {/* Project Details */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-xl"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                GesturBee
              </h3>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed text-justify">
                GesturBee is a{" "}
                <span className="text-[#FF6B35]">
                  gamified e-learning mobile app
                </span>{" "}
                designed to make learning{" "}
                <span className="text-[#FF6B35]">
                  Filipino Sign Language (FSL)
                </span>{" "}
                fun, accessible, and engaging. It features progressive learning
                stages such as{" "}
                <span className="text-[#FF6B35]">
                  Alphabets, Numbers, Greetings, and Common Phrases
                </span>{" "}
                , along with <span className="text-[#FF6B35]">mini-games</span>{" "}
                , quizzes, and performance tracking.
              </p>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed text-justify">
                The app is powered by a{" "}
                <span className="text-[#FF6B35]">
                  custom-built AI model developed by my team
                </span>{" "}
                from scratch to recognize FSL gestures in real time. It analyzes
                hand shape, orientation, and movement, providing instant{" "}
                <span className="text-[#FF6B35]">
                  feedback on sign accuracy
                </span>{" "}
                to ensure proper execution.
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-3 mb-8">
                {["React Native", "TypeScript", "Firebase", "Redux"].map(
                  (tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 bg-gradient-to-r from-[#FF6B35]/10 to-[#FF8C5A]/10  rounded-lg text-[#FF6B35] text-sm font-semibold"
                    >
                      {tech}
                    </span>
                  )
                )}
              </div>

              {/* Project Links */}
              <div className="flex gap-4">
                <a
                  href="https://github.com/Rhixin/GesturbeeCamera"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] rounded-lg text-white font-semibold hover:scale-105 transition-transform duration-300 shadow-lg shadow-[#FF6B35]/50"
                >
                  <FontAwesomeIcon icon={faGithub} className="text-xl" />
                  <span>GitHub</span>
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stacking Sections Container */}
      <div className="relative">
        {/* 3D Computer Model Showcase Section */}
        <section
          ref={laptopSectionRef}
          id="computer-section"
          className="min-h-[1000vh] relative bg-transparent"
        >
          <div
            className="h-screen w-full sticky top-0 flex items-center justify-center"
            style={{ zIndex: 10 }}
          >
            <div
              className="w-full h-full grid grid-cols-1 lg:grid-cols-2 transition-opacity duration-500"
              style={{ opacity: computerSectionOpacity }}
            >
              {/* 3D Computer Model - Left Side */}
              <div className="w-full h-full flex items-center justify-center">
                <div
                  className={`relative w-[638px] h-[433px] cursor-grab active:cursor-grabbing ${
                    !isLaptopDragging &&
                    laptopRotation.x === -5 &&
                    laptopRotation.y === 15
                      ? "laptop-idle"
                      : ""
                  }`}
                  style={{
                    transformStyle: "preserve-3d",
                    transform:
                      isLaptopDragging ||
                      laptopRotation.x !== -5 ||
                      laptopRotation.y !== 15
                        ? `rotateX(${laptopRotation.x}deg) rotateY(${laptopRotation.y}deg)`
                        : undefined,
                    transition: isLaptopDragging
                      ? "none"
                      : "transform 0.3s ease-out",
                  }}
                  onMouseDown={(e) => {
                    setIsLaptopDragging(true);

                    if (laptopResetTimeout.current) {
                      clearTimeout(laptopResetTimeout.current);
                    }

                    const startX = e.clientX;
                    const startY = e.clientY;
                    const startRotation = { ...laptopRotation };

                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      const deltaX = moveEvent.clientX - startX;
                      const deltaY = moveEvent.clientY - startY;
                      setLaptopRotation({
                        x: Math.max(
                          -30,
                          Math.min(30, startRotation.x - deltaY * 0.3)
                        ),
                        y: Math.max(
                          -30,
                          Math.min(30, startRotation.y + deltaX * 0.3)
                        ),
                      });
                    };

                    const handleMouseUp = () => {
                      setIsLaptopDragging(false);
                      document.removeEventListener(
                        "mousemove",
                        handleMouseMove
                      );
                      document.removeEventListener("mouseup", handleMouseUp);

                      laptopResetTimeout.current = setTimeout(() => {
                        setLaptopRotation({ x: -5, y: 15 });
                      }, 3000);
                    };

                    document.addEventListener("mousemove", handleMouseMove);
                    document.addEventListener("mouseup", handleMouseUp);
                  }}
                >
                  {/* Screen/Monitor Part */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[80%]"
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div
                      className="absolute inset-0 rounded-t-lg"
                      style={{
                        background:
                          "linear-gradient(145deg, #2a2a2e 0%, #1a1a1e 100%)",
                        boxShadow:
                          "0 15px 30px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.05)",
                        transformStyle: "preserve-3d",
                        transform: "translateZ(5px) rotateX(8deg)",
                        transformOrigin: "bottom center",
                      }}
                    >
                      {/* Screen */}
                      <div className="absolute inset-4 rounded-md overflow-hidden bg-black">
                        {/* Bezel */}
                        <div className="absolute inset-0 border-4 border-gray-900 rounded-md z-10 pointer-events-none"></div>

                        {/* Screen Content - Transitioning Screenshots */}
                        <div className="w-full h-full relative bg-black">
                          {/* Room Radar - Project 0 (0-2) */}
                          <div
                            className="w-full h-full absolute inset-0 transition-opacity duration-700"
                            style={{
                              opacity:
                                projectTransitionProgress <= 1.6
                                  ? 1
                                  : projectTransitionProgress <= 2
                                  ? 1 - (projectTransitionProgress - 1.6) / 0.4
                                  : 0,
                            }}
                          >
                            <Image
                              src={`/imagesv2/roomradarweb/${
                                currentRoomRadarImage + 1
                              }.png`}
                              alt="Room Radar Screenshot"
                              fill
                              className="object-cover"
                              style={{ objectFit: "cover" }}
                            />
                          </div>

                          {/* Sinehan - Project 1 (2-4) */}
                          <div
                            className="w-full h-full absolute inset-0 transition-opacity duration-700"
                            style={{
                              opacity:
                                projectTransitionProgress < 2
                                  ? 0
                                  : projectTransitionProgress <= 2.4
                                  ? (projectTransitionProgress - 2) / 0.4
                                  : projectTransitionProgress <= 3.6
                                  ? 1
                                  : projectTransitionProgress <= 4
                                  ? 1 - (projectTransitionProgress - 3.6) / 0.4
                                  : 0,
                            }}
                          >
                            <Image
                              src={`/imagesv2/sinehan/${
                                currentRoomRadarImage + 1
                              }.png`}
                              alt="Sinehan Screenshot"
                              fill
                              className="object-cover"
                              style={{ objectFit: "cover" }}
                            />
                          </div>

                          {/* Power Systems Inc - Project 2 (4-6) */}
                          <div
                            className="w-full h-full absolute inset-0 transition-opacity duration-700"
                            style={{
                              opacity:
                                projectTransitionProgress < 4
                                  ? 0
                                  : projectTransitionProgress <= 4.4
                                  ? (projectTransitionProgress - 4) / 0.4
                                  : projectTransitionProgress <= 5.6
                                  ? 1
                                  : projectTransitionProgress <= 6
                                  ? 1 - (projectTransitionProgress - 5.6) / 0.4
                                  : 0,
                            }}
                          >
                            <Image
                              src={`/imagesv2/powersystemsinc/${Math.min(
                                currentRoomRadarImage + 1,
                                9
                              )}.png`}
                              alt="Power Systems Inc Screenshot"
                              fill
                              className="object-cover"
                              style={{ objectFit: "cover" }}
                            />
                          </div>

                          {/* MNSTS IMS - Project 3 (6-8) */}
                          <div
                            className="w-full h-full absolute inset-0 transition-opacity duration-700"
                            style={{
                              opacity:
                                projectTransitionProgress < 6
                                  ? 0
                                  : projectTransitionProgress <= 6.4
                                  ? (projectTransitionProgress - 6) / 0.4
                                  : projectTransitionProgress <= 7.6
                                  ? 1
                                  : projectTransitionProgress <= 8
                                  ? 1 - (projectTransitionProgress - 7.6) / 0.4
                                  : 0,
                            }}
                          >
                            <Image
                              src={`/imagesv2/ims/${Math.min(
                                currentRoomRadarImage + 1,
                                10
                              )}.png`}
                              alt="MNSTS IMS Screenshot"
                              fill
                              className="object-cover"
                              style={{ objectFit: "cover" }}
                            />
                          </div>

                          {/* MNSTS Website - Project 4 (8-10) */}
                          <div
                            className="w-full h-full absolute inset-0 transition-opacity duration-700"
                            style={{
                              opacity:
                                projectTransitionProgress < 8
                                  ? 0
                                  : projectTransitionProgress <= 8.4
                                  ? (projectTransitionProgress - 8) / 0.4
                                  : 1,
                            }}
                          >
                            <Image
                              src={`/imagesv2/mnsts/${Math.min(
                                currentRoomRadarImage + 1,
                                7
                              )}.png`}
                              alt="MNSTS Website Screenshot"
                              fill
                              className="object-cover"
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hinge */}
                  <div
                    className="absolute left-0 right-0 h-[3%]"
                    style={{
                      top: "72%",
                      background:
                        "linear-gradient(180deg, #1a1a1e 0%, #0f0f12 50%, #1a1a1e 100%)",
                      transformStyle: "preserve-3d",
                      transform: "translateZ(8px)",
                      boxShadow:
                        "0 2px 4px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.1), inset 0 -1px 1px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    {/* Hinge details - small circular elements */}
                    <div className="absolute inset-0 flex items-center justify-center gap-8">
                      <div
                        className="w-2 h-2 rounded-full bg-gray-800 border border-gray-900"
                        style={{
                          boxShadow:
                            "inset 0 1px 1px rgba(0, 0, 0, 0.8), 0 1px 1px rgba(255, 255, 255, 0.1)",
                        }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-800 border border-gray-900"
                        style={{
                          boxShadow:
                            "inset 0 1px 1px rgba(0, 0, 0, 0.8), 0 1px 1px rgba(255, 255, 255, 0.1)",
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Keyboard Base Part */}
                  <div
                    className="absolute left-0 right-0 h-[60%] rounded-b-lg"
                    style={{
                      top: "75%",
                      background:
                        "linear-gradient(145deg, #3a3a3e 0%, #2a2a2e 100%)",
                      transformStyle: "preserve-3d",
                      transform: "translateZ(10px) rotateX(-15deg)",
                      transformOrigin: "top center",
                      boxShadow:
                        "inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.4)",
                    }}
                  >
                    {/* Keyboard Keys */}
                    <div className="absolute top-7 left-3 right-3 flex flex-col gap-1.5">
                      {/* Row 1 - Function keys */}
                      <div className="flex gap-1.5 justify-center">
                        {[...Array(16)].map((_, i) => (
                          <div
                            key={`k1-${i}`}
                            className="w-8 h-4 bg-gray-700 rounded-sm"
                            style={{
                              boxShadow:
                                "inset 0 -1px 1px rgba(0, 0, 0, 0.5), 0 1px 1px rgba(255, 255, 255, 0.05)",
                            }}
                          ></div>
                        ))}
                      </div>
                      {/* Row 2 - Number row */}
                      <div className="flex gap-1.5 justify-center">
                        {[...Array(16)].map((_, i) => (
                          <div
                            key={`k2-${i}`}
                            className="w-8 h-4 bg-gray-700 rounded-sm"
                            style={{
                              boxShadow:
                                "inset 0 -1px 1px rgba(0, 0, 0, 0.5), 0 1px 1px rgba(255, 255, 255, 0.05)",
                            }}
                          ></div>
                        ))}
                      </div>
                      {/* Row 3 - Top letter row */}
                      <div className="flex gap-1.5 justify-center">
                        {[...Array(15)].map((_, i) => (
                          <div
                            key={`k3-${i}`}
                            className="w-8 h-4 bg-gray-700 rounded-sm"
                            style={{
                              boxShadow:
                                "inset 0 -1px 1px rgba(0, 0, 0, 0.5), 0 1px 1px rgba(255, 255, 255, 0.05)",
                            }}
                          ></div>
                        ))}
                      </div>
                      {/* Row 4 - Middle row */}
                      <div className="flex gap-1.5 justify-center">
                        {[...Array(14)].map((_, i) => (
                          <div
                            key={`k4-${i}`}
                            className="w-8 h-4 bg-gray-700 rounded-sm"
                            style={{
                              boxShadow:
                                "inset 0 -1px 1px rgba(0, 0, 0, 0.5), 0 1px 1px rgba(255, 255, 255, 0.05)",
                            }}
                          ></div>
                        ))}
                      </div>
                      {/* Row 5 - Bottom letter row */}
                      <div className="flex gap-1.5 justify-center">
                        {[...Array(13)].map((_, i) => (
                          <div
                            key={`k5-${i}`}
                            className="w-8 h-4 bg-gray-700 rounded-sm"
                            style={{
                              boxShadow:
                                "inset 0 -1px 1px rgba(0, 0, 0, 0.5), 0 1px 1px rgba(255, 255, 255, 0.05)",
                            }}
                          ></div>
                        ))}
                      </div>
                      {/* Row 6 - Space bar row */}
                      <div className="flex gap-1.5 justify-center items-center">
                        <div
                          className="w-10 h-4 bg-gray-700 rounded-sm"
                          style={{
                            boxShadow:
                              "inset 0 -1px 1px rgba(0, 0, 0, 0.5), 0 1px 1px rgba(255, 255, 255, 0.05)",
                          }}
                        ></div>
                        <div
                          className="w-10 h-4 bg-gray-700 rounded-sm"
                          style={{
                            boxShadow:
                              "inset 0 -1px 1px rgba(0, 0, 0, 0.5), 0 1px 1px rgba(255, 255, 255, 0.05)",
                          }}
                        ></div>
                        <div
                          className="w-10 h-4 bg-gray-700 rounded-sm"
                          style={{
                            boxShadow:
                              "inset 0 -1px 1px rgba(0, 0, 0, 0.5), 0 1px 1px rgba(255, 255, 255, 0.05)",
                          }}
                        ></div>
                        <div
                          className="w-48 h-4 bg-gray-700 rounded-sm"
                          style={{
                            boxShadow:
                              "inset 0 -1px 1px rgba(0, 0, 0, 0.5), 0 1px 1px rgba(255, 255, 255, 0.05)",
                          }}
                        ></div>
                        <div
                          className="w-7 h-4 bg-gray-700 rounded-sm"
                          style={{
                            boxShadow:
                              "inset 0 -1px 1px rgba(0, 0, 0, 0.5), 0 1px 1px rgba(255, 255, 255, 0.05)",
                          }}
                        ></div>

                        <div
                          className="w-7 h-4 bg-gray-700 rounded-sm"
                          style={{
                            boxShadow:
                              "inset 0 -1px 1px rgba(0, 0, 0, 0.5), 0 1px 1px rgba(255, 255, 255, 0.05)",
                          }}
                        ></div>
                        <div
                          className="w-7 h-4 bg-gray-700 rounded-sm"
                          style={{
                            boxShadow:
                              "inset 0 -1px 1px rgba(0, 0, 0, 0.5), 0 1px 1px rgba(255, 255, 255, 0.05)",
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Trackpad */}
                    <div
                      className="absolute bottom-3 left-1/2 -translate-x-1/2 w-28 h-14 bg-gray-800 rounded border border-gray-700"
                      style={{
                        boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.4)",
                      }}
                    ></div>
                  </div>

                  {/* Glow Effect */}
                  <div
                    className="absolute inset-0 rounded-lg opacity-40 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 50%, rgba(100, 181, 246, 0.3), transparent 70%)",
                      filter: "blur(20px)",
                      transform: "translateZ(-10px)",
                    }}
                  ></div>
                </div>
              </div>

              {/* Room Radar Info - Right Side */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="w-full h-full flex flex-col justify-center"
              >
                {/* Toggle Button - At top */}
                <div className="mb-12">
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-full p-1 w-fit grid grid-cols-2">
                    {/* Sliding Background */}
                    <div
                      className={`absolute top-1 bottom-1 w-[calc(50%-0.25rem)] bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] rounded-full transition-transform duration-300 ease-out ${
                        showRoomRadarImages
                          ? "translate-x-[calc(100%+0.5rem)]"
                          : "translate-x-0"
                      }`}
                      style={{ left: "0.25rem" }}
                    ></div>

                    {/* Toggle Options */}
                    <button
                      onClick={() => setShowRoomRadarImages(false)}
                      className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 flex items-center justify-center relative z-10 ${
                        !showRoomRadarImages ? "text-white" : "text-gray-400"
                      }`}
                    >
                      Description
                    </button>
                    <button
                      onClick={() => setShowRoomRadarImages(true)}
                      className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 flex items-center justify-center relative z-10 ${
                        showRoomRadarImages ? "text-white" : "text-gray-400"
                      }`}
                    >
                      Images
                    </button>
                  </div>
                </div>

                {/* Description View - Transitioning Content */}
                {!showRoomRadarImages && (
                  <div
                    className="relative flex flex-col max-w-3xl min-h-[350px]"
                    style={{
                      perspective: "1000px",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Room Radar Content - Project 0 (0-2) */}
                    <div
                      className="absolute inset-0 flex flex-col will-change-transform"
                      style={{
                        opacity:
                          projectTransitionProgress <= 1.6
                            ? 1
                            : projectTransitionProgress <= 2
                            ? 1 - (projectTransitionProgress - 1.6) / 0.4
                            : 0,
                        transform:
                          projectTransitionProgress <= 1.6
                            ? "rotateY(0deg)"
                            : projectTransitionProgress <= 2
                            ? `rotateY(${
                                ((projectTransitionProgress - 1.6) / 0.4) * 90
                              }deg)`
                            : "rotateY(90deg)",
                        transformStyle: "preserve-3d",
                        transition: "transform 0.7s ease, opacity 0.7s ease",
                        pointerEvents:
                          projectTransitionProgress < 1 ? "auto" : "none",
                        zIndex: projectTransitionProgress < 1 ? 2 : 1,
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xl">
                            1
                          </span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-white">
                          RoomRadar
                        </h3>
                      </div>
                      <p className="text-gray-300 text-lg mb-6 leading-relaxed text-justify">
                        Developed a web platform that helps users easily{" "}
                        <span className="text-[#FF6B35]">
                          find nearby boarding houses
                        </span>{" "}
                        through real-time listings integrated with{" "}
                        <span className="text-[#FF6B35]">Google Maps</span> .
                        The system allows landlords to post property details
                        while tenants can{" "}
                        <span className="text-[#FF6B35]">
                          browse available rooms
                        </span>{" "}
                        , view monthly prices, check amenities, and filter
                        results based on budget, proximity, and personal needs.
                        Users can see property reviews,{" "}
                        <span className="text-[#FF6B35]">
                          chat directly with landlords for inquiries
                        </span>{" "}
                        , and explore listings through an{" "}
                        <span className="text-[#FF6B35]">
                          intuitive map-based interface
                        </span>{" "}
                        . Built with modern web technologies ensuring a smooth,
                        responsive, and user-friendly experience.
                      </p>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-3 mb-8">
                        {[
                          "React",
                          "Next.js",
                          "ASP.NET",
                          "MySQL",
                          "Google Maps API",
                          "Bootstrap",
                        ].map((tech) => (
                          <span
                            key={tech}
                            className="px-4 py-2 bg-gradient-to-r from-[#FF6B35]/10 to-[#FF8C5A]/10  rounded-lg text-[#FF6B35] text-sm font-semibold"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Project Links */}
                      <div className="flex gap-4">
                        <a
                          href="https://github.com/Rhixin/RoomRadarWeb"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-lg text-white font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20"
                        >
                          <FontAwesomeIcon icon={faGithub} className="text-xl" />
                          <span>GitHub</span>
                        </a>
                        <a
                          href="https://drive.google.com/file/d/1DF99Y3fcrSaBvUIVIAv3vX1_3yNsSvDV/view?usp=sharing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-lg text-white font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20"
                        >
                          <FontAwesomeIcon icon={faVideo} className="text-xl" />
                          <span>Video</span>
                        </a>
                      </div>
                    </div>

                    {/* Sinehan Content - Project 1 (2-4) */}
                    <div
                      className="absolute inset-0 flex flex-col will-change-transform"
                      style={{
                        opacity:
                          projectTransitionProgress < 2
                            ? 0
                            : projectTransitionProgress <= 2.4
                            ? (projectTransitionProgress - 2) / 0.4
                            : projectTransitionProgress <= 3.6
                            ? 1
                            : projectTransitionProgress <= 4
                            ? 1 - (projectTransitionProgress - 3.6) / 0.4
                            : 0,
                        transform:
                          projectTransitionProgress < 2
                            ? "rotateY(-90deg)"
                            : projectTransitionProgress <= 2.4
                            ? `rotateY(${
                                -90 +
                                ((projectTransitionProgress - 2) / 0.4) * 90
                              }deg)`
                            : projectTransitionProgress <= 3.6
                            ? "rotateY(0deg)"
                            : projectTransitionProgress <= 4
                            ? `rotateY(${
                                ((projectTransitionProgress - 3.6) / 0.4) * 90
                              }deg)`
                            : "rotateY(90deg)",
                        transformStyle: "preserve-3d",
                        transition: "transform 0.7s ease, opacity 0.7s ease",
                        pointerEvents:
                          projectTransitionProgress >= 2 &&
                          projectTransitionProgress < 4
                            ? "auto"
                            : "none",
                        zIndex:
                          projectTransitionProgress >= 2 &&
                          projectTransitionProgress < 4
                            ? 2
                            : 1,
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xl">
                            2
                          </span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-white">
                          Sinehan
                        </h3>
                      </div>
                      <p className="text-gray-300 text-lg mb-6 leading-relaxed text-justify">
                        Developed an{" "}
                        <span className="text-[#FF6B35]">
                          online cinema ticketing system
                        </span>{" "}
                        that lets users browse real-time movie schedules, choose
                        their preferred screening time, and{" "}
                        <span className="text-[#FF6B35]">
                          reserve specific seats
                        </span>{" "}
                        through an{" "}
                        <span className="text-[#FF6B35]">
                          interactive seating layout
                        </span>{" "}
                        . The platform streamlines the entire booking process
                        from movie selection to payment confirmation. It also
                        includes a full{" "}
                        <span className="text-[#FF6B35]">admin dashboard</span>{" "}
                        where cinema staff can manage movies, add or edit
                        screening schedules, update seat availability, and
                        oversee all system operations. Built with a focus on
                        usability, accuracy, and a seamless ticketing
                        experience.
                      </p>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-3 mb-8">
                        {["HTML", "CSS", "Javascript", "Python Django"].map(
                          (tech) => (
                            <span
                              key={tech}
                              className="px-4 py-2 bg-gradient-to-r from-[#FF6B35]/10 to-[#FF8C5A]/10  rounded-lg text-[#FF6B35] text-sm font-semibold"
                            >
                              {tech}
                            </span>
                          )
                        )}
                      </div>

                      {/* Project Links */}
                      <div className="flex gap-4">
                        <a
                          href="https://github.com/elib00/sinehan"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-lg text-white font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20"
                        >
                          <FontAwesomeIcon icon={faGithub} className="text-xl" />
                          <span>GitHub</span>
                        </a>
                        <a
                          href="https://drive.google.com/file/d/1e6CuNI87NsXNQK-vW9J3zvgkvF6M5bA_/view?usp=sharing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-lg text-white font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20"
                        >
                          <FontAwesomeIcon icon={faVideo} className="text-xl" />
                          <span>Video</span>
                        </a>
                      </div>
                    </div>

                    {/* Power Systems Inc - Project 2 (4-6) */}
                    <div
                      className="absolute inset-0 flex flex-col will-change-transform"
                      style={{
                        opacity:
                          projectTransitionProgress < 4
                            ? 0
                            : projectTransitionProgress <= 4.4
                            ? (projectTransitionProgress - 4) / 0.4
                            : projectTransitionProgress <= 5.6
                            ? 1
                            : projectTransitionProgress <= 6
                            ? 1 - (projectTransitionProgress - 5.6) / 0.4
                            : 0,
                        pointerEvents:
                          projectTransitionProgress >= 4 &&
                          projectTransitionProgress < 6
                            ? "auto"
                            : "none",
                        zIndex:
                          projectTransitionProgress >= 4 &&
                          projectTransitionProgress < 6
                            ? 2
                            : 1,
                        transform:
                          projectTransitionProgress < 4
                            ? "rotateY(-90deg)"
                            : projectTransitionProgress <= 4.4
                            ? `rotateY(${
                                -90 +
                                ((projectTransitionProgress - 4) / 0.4) * 90
                              }deg)`
                            : projectTransitionProgress <= 5.6
                            ? "rotateY(0deg)"
                            : projectTransitionProgress <= 6
                            ? `rotateY(${
                                ((projectTransitionProgress - 5.6) / 0.4) * 90
                              }deg)`
                            : "rotateY(90deg)",
                        transformStyle: "preserve-3d",
                        transition: "transform 0.7s ease, opacity 0.7s ease",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xl">
                            3
                          </span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-white">
                          Power Systems Inc.
                        </h3>
                      </div>
                      <p className="text-gray-300 text-lg mb-6 leading-relaxed text-justify">
                        Developed an{" "}
                        <span className="text-[#FF6B35]">
                          internal company website
                        </span>{" "}
                        for Power Systems Inc. as part of a freelance project,
                        transitioning their paper-based forms into a fully
                        digital system. The platform{" "}
                        <span className="text-[#FF6B35]">
                          centralizes all company forms
                        </span>{" "}
                        related to services, job orders, and operational
                        workflows, allowing staff to easily submit, track, and
                        browse records. It features a searchable data management
                        dashboard and an integrated{" "}
                        <span className="text-[#FF6B35]">
                          AI-powered chatbot that can
                        </span>{" "}
                        answer queries about existing data, helping employees
                        quickly retrieve information without manually going
                        through files. Built with a focus on accessibility,
                        efficiency, and improving the company’s internal
                        processes.
                      </p>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-3 mb-8">
                        {[
                          "Next.js",
                          "PostgreSQL",
                          "NestJS",
                          "Render",
                          "Tailwind",
                        ].map((tech) => (
                          <span
                            key={tech}
                            className="px-4 py-2 bg-gradient-to-r from-[#FF6B35]/10 to-[#FF8C5A]/10  rounded-lg text-[#FF6B35] text-sm font-semibold"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Project Links */}
                      <div className="flex gap-4 flex-wrap">
                        <a
                          href="https://powersystemsinc.vercel.app/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-lg text-white font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20"
                        >
                          <FontAwesomeIcon icon={faLink} className="text-xl" />
                          <span>Website</span>
                        </a>
                        <a
                          href="https://github.com/Rhixin/powersystemsinc"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-lg text-white font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20"
                        >
                          <FontAwesomeIcon icon={faGithub} className="text-xl" />
                          <span>GitHub</span>
                        </a>
                      </div>
                    </div>

                    {/* MNSTS IMS - Project 3 (6-8) */}
                    <div
                      className="absolute inset-0 flex flex-col will-change-transform"
                      style={{
                        opacity:
                          projectTransitionProgress < 6
                            ? 0
                            : projectTransitionProgress <= 6.4
                            ? (projectTransitionProgress - 6) / 0.4
                            : projectTransitionProgress <= 7.6
                            ? 1
                            : projectTransitionProgress <= 8
                            ? 1 - (projectTransitionProgress - 7.6) / 0.4
                            : 0,
                        pointerEvents:
                          projectTransitionProgress >= 6 &&
                          projectTransitionProgress < 8
                            ? "auto"
                            : "none",
                        zIndex:
                          projectTransitionProgress >= 6 &&
                          projectTransitionProgress < 8
                            ? 2
                            : 1,
                        transform:
                          projectTransitionProgress < 6
                            ? "rotateY(-90deg)"
                            : projectTransitionProgress <= 6.4
                            ? `rotateY(${
                                -90 +
                                ((projectTransitionProgress - 6) / 0.4) * 90
                              }deg)`
                            : projectTransitionProgress <= 7.6
                            ? "rotateY(0deg)"
                            : projectTransitionProgress <= 8
                            ? `rotateY(${
                                ((projectTransitionProgress - 7.6) / 0.4) * 90
                              }deg)`
                            : "rotateY(90deg)",
                        transformStyle: "preserve-3d",
                        transition: "transform 0.7s ease, opacity 0.7s ease",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xl">
                            4
                          </span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-white">
                          MNSTS IMS
                        </h3>
                      </div>
                      <p className="text-gray-300 text-lg mb-6 leading-relaxed text-justify">
                        Developed an{" "}
                        <span className="text-[#FF6B35]">
                          Inventory Management System (IMS)
                        </span>{" "}
                        for MNSTS as part of a{" "}
                        <span className="text-[#FF6B35]">
                          freelance project
                        </span>{" "}
                        , designed to help the school efficiently track all
                        inventory items such as books, equipment, and sports
                        materials. The platform allows staff to record, monitor,
                        and update item quantities while generating automated
                        reports for easier administration. It includes an{" "}
                        <span className="text-[#FF6B35]">
                          AI-powered chatbot
                        </span>{" "}
                        that can answer queries about the current inventory
                        status and assist in retrieving information quickly. The
                        system also features{" "}
                        <span className="text-[#FF6B35]">
                          automated email alerts via Gmail
                        </span>{" "}
                        for low-stock items, ensuring timely restocking and
                        smoother school operations.
                      </p>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-3 mb-8">
                        {[
                          "Next.js",
                          "PostgreSQL",
                          "Tailwind",
                          "Cloudinary",
                        ].map((tech) => (
                          <span
                            key={tech}
                            className="px-4 py-2 bg-gradient-to-r from-[#FF6B35]/10 to-[#FF8C5A]/10  rounded-lg text-[#FF6B35] text-sm font-semibold"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Project Links */}
                      <div className="flex gap-4 flex-wrap">
                        <a
                          href="https://mnsts-ims.vercel.app/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-lg text-white font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20"
                        >
                          <FontAwesomeIcon icon={faLink} className="text-xl" />
                          <span>Website</span>
                        </a>
                        <a
                          href="https://github.com/Rhixin/MNSTS-IMS"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-lg text-white font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20"
                        >
                          <FontAwesomeIcon icon={faGithub} className="text-xl" />
                          <span>GitHub</span>
                        </a>
                      </div>
                    </div>

                    {/* MNSTS Website - Project 4 (8-10) */}
                    <div
                      className="absolute inset-0 flex flex-col will-change-transform"
                      style={{
                        opacity:
                          projectTransitionProgress < 8
                            ? 0
                            : projectTransitionProgress <= 8.4
                            ? (projectTransitionProgress - 8) / 0.4
                            : 1,
                        pointerEvents:
                          projectTransitionProgress >= 8 ? "auto" : "none",
                        zIndex: projectTransitionProgress >= 8 ? 2 : 1,
                        transform:
                          projectTransitionProgress < 8
                            ? "rotateY(-90deg)"
                            : projectTransitionProgress <= 8.4
                            ? `rotateY(${
                                -90 +
                                ((projectTransitionProgress - 8) / 0.4) * 90
                              }deg)`
                            : "rotateY(0deg)",
                        transformStyle: "preserve-3d",
                        transition: "transform 0.7s ease, opacity 0.7s ease",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xl">
                            5
                          </span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-white">
                          MNSTS School Website
                        </h3>
                      </div>
                      <p className="text-gray-300 text-lg mb-6 leading-relaxed text-justify">
                        Developed a full-featured school website for MNSTS as a{" "}
                        <span className="text-[#FF6B35]">
                          freelance project
                        </span>{" "}
                        , designed to centralize news articles, announcements,
                        event calendars, and school achievements in one
                        accessible platform. The website includes an{" "}
                        <span className="text-[#FF6B35]">admin dashboard</span>{" "}
                        where school staff can easily publish and manage all
                        content. It also supports{" "}
                        <span className="text-[#FF6B35]">
                          automated Gmail notifications
                        </span>{" "}
                        for important announcements , ensuring that students and
                        parents stay updated. Built to enhance the school’s
                        online presence and streamline communication across the
                        community.
                      </p>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-3 mb-8">
                        {["Next.js", "Tailwind", "MongoDB", "Cloudinary"].map(
                          (tech) => (
                            <span
                              key={tech}
                              className="px-4 py-2 bg-gradient-to-r from-[#FF6B35]/10 to-[#FF8C5A]/10  rounded-lg text-[#FF6B35] text-sm font-semibold"
                            >
                              {tech}
                            </span>
                          )
                        )}
                      </div>

                      {/* Project Links */}
                      <div className="flex gap-4 flex-wrap">
                        <a
                          href="https://mnsts.vercel.app/home"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-lg text-white font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20"
                        >
                          <FontAwesomeIcon icon={faLink} className="text-xl" />
                          <span>Website</span>
                        </a>
                        <a
                          href="https://github.com/Rhixin/MNSTS"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-lg text-white font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20"
                        >
                          <FontAwesomeIcon icon={faGithub} className="text-xl" />
                          <span>GitHub</span>
                        </a>
                        <a
                          href="https://drive.google.com/file/d/1jUZ5zXoWPSDYqGhEWfjZdQjqx3Bz9p-w/view?usp=sharing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-lg text-white font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20"
                        >
                          <FontAwesomeIcon icon={faVideo} className="text-xl" />
                          <span>Video</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Images View */}
                {showRoomRadarImages && (
                  <div
                    className="flex flex-col max-w-2xl relative h-[50vh]"
                    style={{
                      perspective: "1000px",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Room Radar Images - Project 0 (0-2) */}
                    <div
                      className="h-[50vh] w-full absolute inset-0 rounded-lg overflow-hidden group"
                      style={{
                        opacity:
                          projectTransitionProgress <= 1.6
                            ? 1
                            : projectTransitionProgress <= 2
                            ? 1 - (projectTransitionProgress - 1.6) / 0.4
                            : 0,
                        pointerEvents:
                          projectTransitionProgress < 1 ? "auto" : "none",
                        zIndex: projectTransitionProgress < 1 ? 2 : 1,
                        transform:
                          projectTransitionProgress <= 1.6
                            ? "rotateY(0deg)"
                            : projectTransitionProgress <= 2
                            ? `rotateY(${
                                ((projectTransitionProgress - 1.6) / 0.4) * 90
                              }deg)`
                            : "rotateY(90deg)",
                        transformStyle: "preserve-3d",
                        transition: "transform 0.7s ease, opacity 0.7s ease",
                        backfaceVisibility: "hidden",
                      }}
                      onMouseEnter={() => setIsHoveringRoomRadarImage(true)}
                      onMouseLeave={() => setIsHoveringRoomRadarImage(false)}
                    >
                      <Image
                        src={`/imagesv2/roomradarweb/${
                          currentRoomRadarImage + 1
                        }.png`}
                        alt="Background"
                        fill
                        className="object-cover blur-2xl scale-110"
                      />
                      <div className="absolute inset-0">
                        <Image
                          src={`/imagesv2/roomradarweb/${
                            currentRoomRadarImage + 1
                          }.png`}
                          alt={`Room Radar Screenshot ${
                            currentRoomRadarImage + 1
                          }`}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div
                        className={`absolute inset-0 flex items-center justify-between px-6 z-30 transition-opacity duration-300 ${
                          isHoveringRoomRadarImage ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <button
                          onClick={() =>
                            setCurrentRoomRadarImage((prev) =>
                              prev > 0 ? prev - 1 : 7
                            )
                          }
                          className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-xl   hover:bg-white/20 text-white rounded-full transition-all shadow-lg hover:scale-110"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                            boxShadow:
                              "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)",
                          }}
                        >
                          <IoChevronBack size={24} />
                        </button>
                        <button
                          onClick={() =>
                            setCurrentRoomRadarImage((prev) =>
                              prev < 7 ? prev + 1 : 0
                            )
                          }
                          className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-xl   hover:bg-white/20 text-white rounded-full transition-all shadow-lg hover:scale-110"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                            boxShadow:
                              "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)",
                          }}
                        >
                          <IoChevronForward size={24} />
                        </button>
                      </div>
                      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3 z-30">
                        <span className="text-white bg-black/30 backdrop-blur-md px-4 py-1 rounded-full text-sm font-medium border border-white/10 pointer-events-none">
                          {currentRoomRadarImage + 1} / 8
                        </span>
                        <div
                          className="flex gap-2 px-4"
                          style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                          }}
                        >
                          {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentRoomRadarImage(index)}
                              className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                currentRoomRadarImage === index
                                  ? "border-[#FF6B35] scale-110 shadow-lg shadow-[#FF6B35]/50"
                                  : "border-white/30 hover:border-white/60 hover:scale-105"
                              }`}
                            >
                              <Image
                                src={`/imagesv2/roomradarweb/${index + 1}.png`}
                                alt={`Thumbnail ${index + 1}`}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover pointer-events-none"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Sinehan Images - Project 1 (2-4) */}
                    <div
                      className="h-[50vh] w-full absolute inset-0 rounded-lg overflow-hidden group"
                      style={{
                        opacity:
                          projectTransitionProgress < 2
                            ? 0
                            : projectTransitionProgress <= 2.4
                            ? (projectTransitionProgress - 2) / 0.4
                            : projectTransitionProgress <= 3.6
                            ? 1
                            : projectTransitionProgress <= 4
                            ? 1 - (projectTransitionProgress - 3.6) / 0.4
                            : 0,
                        pointerEvents:
                          projectTransitionProgress >= 2 &&
                          projectTransitionProgress < 4
                            ? "auto"
                            : "none",
                        zIndex:
                          projectTransitionProgress >= 2 &&
                          projectTransitionProgress < 4
                            ? 2
                            : 1,
                        transform:
                          projectTransitionProgress < 2
                            ? "rotateY(-90deg)"
                            : projectTransitionProgress <= 2.4
                            ? `rotateY(${
                                -90 +
                                ((projectTransitionProgress - 2) / 0.4) * 90
                              }deg)`
                            : projectTransitionProgress <= 3.6
                            ? "rotateY(0deg)"
                            : projectTransitionProgress <= 4
                            ? `rotateY(${
                                ((projectTransitionProgress - 3.6) / 0.4) * 90
                              }deg)`
                            : "rotateY(90deg)",
                        transformStyle: "preserve-3d",
                        transition: "transform 0.7s ease, opacity 0.7s ease",
                        backfaceVisibility: "hidden",
                      }}
                      onMouseEnter={() => setIsHoveringRoomRadarImage(true)}
                      onMouseLeave={() => setIsHoveringRoomRadarImage(false)}
                    >
                      <Image
                        src={`/imagesv2/sinehan/${
                          currentRoomRadarImage + 1
                        }.png`}
                        alt="Background"
                        fill
                        className="object-cover blur-2xl scale-110"
                      />
                      <div className="absolute inset-0">
                        <Image
                          src={`/imagesv2/sinehan/${
                            currentRoomRadarImage + 1
                          }.png`}
                          alt={`Sinehan Screenshot ${
                            currentRoomRadarImage + 1
                          }`}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div
                        className={`absolute inset-0 flex items-center justify-between px-6 z-30 transition-opacity duration-300 ${
                          isHoveringRoomRadarImage ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <button
                          onClick={() =>
                            setCurrentRoomRadarImage((prev) =>
                              prev > 0 ? prev - 1 : 7
                            )
                          }
                          className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-xl   hover:bg-white/20 text-white rounded-full transition-all shadow-lg hover:scale-110"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                            boxShadow:
                              "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)",
                          }}
                        >
                          <IoChevronBack size={24} />
                        </button>
                        <button
                          onClick={() =>
                            setCurrentRoomRadarImage((prev) =>
                              prev < 7 ? prev + 1 : 0
                            )
                          }
                          className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-xl   hover:bg-white/20 text-white rounded-full transition-all shadow-lg hover:scale-110"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                            boxShadow:
                              "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)",
                          }}
                        >
                          <IoChevronForward size={24} />
                        </button>
                      </div>
                      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3 z-30">
                        <span className="text-white bg-black/30 backdrop-blur-md px-4 py-1 rounded-full text-sm font-medium border border-white/10 pointer-events-none">
                          {currentRoomRadarImage + 1} / 8
                        </span>
                        <div
                          className="flex gap-2 px-4"
                          style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                          }}
                        >
                          {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentRoomRadarImage(index)}
                              className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                currentRoomRadarImage === index
                                  ? "border-[#8B5CF6] scale-110 shadow-lg shadow-[#8B5CF6]/50"
                                  : "border-white/30 hover:border-white/60 hover:scale-105"
                              }`}
                            >
                              <Image
                                src={`/imagesv2/sinehan/${index + 1}.png`}
                                alt={`Thumbnail ${index + 1}`}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover pointer-events-none"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Power Systems Inc Images - Project 2 (4-6) */}
                    <div
                      className="h-[50vh] w-full absolute inset-0 rounded-lg overflow-hidden group transition-opacity duration-700"
                      style={{
                        opacity:
                          projectTransitionProgress < 4
                            ? 0
                            : projectTransitionProgress <= 4.4
                            ? (projectTransitionProgress - 4) / 0.4
                            : projectTransitionProgress <= 5.6
                            ? 1
                            : projectTransitionProgress <= 6
                            ? 1 - (projectTransitionProgress - 5.6) / 0.4
                            : 0,
                        pointerEvents:
                          projectTransitionProgress >= 4 &&
                          projectTransitionProgress < 6
                            ? "auto"
                            : "none",
                        zIndex:
                          projectTransitionProgress >= 4 &&
                          projectTransitionProgress < 6
                            ? 2
                            : 1,
                      }}
                      onMouseEnter={() => setIsHoveringRoomRadarImage(true)}
                      onMouseLeave={() => setIsHoveringRoomRadarImage(false)}
                    >
                      <Image
                        src={`/imagesv2/powersystemsinc/${Math.min(
                          currentRoomRadarImage + 1,
                          9
                        )}.png`}
                        alt="Background"
                        fill
                        className="object-cover blur-2xl scale-110"
                      />
                      <div className="absolute inset-0">
                        <Image
                          src={`/imagesv2/powersystemsinc/${Math.min(
                            currentRoomRadarImage + 1,
                            9
                          )}.png`}
                          alt={`Power Systems Inc Screenshot ${
                            currentRoomRadarImage + 1
                          }`}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div
                        className={`absolute inset-0 flex items-center justify-between px-6 z-30 transition-opacity duration-300 ${
                          isHoveringRoomRadarImage ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <button
                          onClick={() =>
                            setCurrentRoomRadarImage((prev) =>
                              prev > 0 ? prev - 1 : 8
                            )
                          }
                          className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-xl   hover:bg-white/20 text-white rounded-full transition-all shadow-lg hover:scale-110"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                            boxShadow:
                              "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)",
                          }}
                        >
                          <IoChevronBack size={24} />
                        </button>
                        <button
                          onClick={() =>
                            setCurrentRoomRadarImage((prev) =>
                              prev < 8 ? prev + 1 : 0
                            )
                          }
                          className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-xl   hover:bg-white/20 text-white rounded-full transition-all shadow-lg hover:scale-110"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                            boxShadow:
                              "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)",
                          }}
                        >
                          <IoChevronForward size={24} />
                        </button>
                      </div>
                      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3 z-30">
                        <span className="text-white bg-black/30 backdrop-blur-md px-4 py-1 rounded-full text-sm font-medium border border-white/10 pointer-events-none">
                          {currentRoomRadarImage + 1} / 9
                        </span>
                        <div
                          className="flex gap-2 px-4"
                          style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                          }}
                        >
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentRoomRadarImage(index)}
                              className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                currentRoomRadarImage === index
                                  ? "border-[#F59E0B] scale-110 shadow-lg shadow-[#F59E0B]/50"
                                  : "border-white/30 hover:border-white/60 hover:scale-105"
                              }`}
                            >
                              <Image
                                src={`/imagesv2/powersystemsinc/${
                                  index + 1
                                }.png`}
                                alt={`Thumbnail ${index + 1}`}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover pointer-events-none"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* MNSTS IMS Images - Project 3 (6-8) */}
                    <div
                      className="h-[50vh] w-full absolute inset-0 rounded-lg overflow-hidden group transition-opacity duration-700"
                      style={{
                        opacity:
                          projectTransitionProgress < 6
                            ? 0
                            : projectTransitionProgress <= 6.4
                            ? (projectTransitionProgress - 6) / 0.4
                            : projectTransitionProgress <= 7.6
                            ? 1
                            : projectTransitionProgress <= 8
                            ? 1 - (projectTransitionProgress - 7.6) / 0.4
                            : 0,
                        pointerEvents:
                          projectTransitionProgress >= 6 &&
                          projectTransitionProgress < 8
                            ? "auto"
                            : "none",
                        zIndex:
                          projectTransitionProgress >= 6 &&
                          projectTransitionProgress < 8
                            ? 2
                            : 1,
                      }}
                      onMouseEnter={() => setIsHoveringRoomRadarImage(true)}
                      onMouseLeave={() => setIsHoveringRoomRadarImage(false)}
                    >
                      <Image
                        src={`/imagesv2/ims/${Math.min(
                          currentRoomRadarImage + 1,
                          10
                        )}.png`}
                        alt="Background"
                        fill
                        className="object-cover blur-2xl scale-110"
                      />
                      <div className="absolute inset-0">
                        <Image
                          src={`/imagesv2/ims/${Math.min(
                            currentRoomRadarImage + 1,
                            10
                          )}.png`}
                          alt={`MNSTS IMS Screenshot ${
                            currentRoomRadarImage + 1
                          }`}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div
                        className={`absolute inset-0 flex items-center justify-between px-6 z-30 transition-opacity duration-300 ${
                          isHoveringRoomRadarImage ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <button
                          onClick={() =>
                            setCurrentRoomRadarImage((prev) =>
                              prev > 0 ? prev - 1 : 9
                            )
                          }
                          className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-xl   hover:bg-white/20 text-white rounded-full transition-all shadow-lg hover:scale-110"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                            boxShadow:
                              "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)",
                          }}
                        >
                          <IoChevronBack size={24} />
                        </button>
                        <button
                          onClick={() =>
                            setCurrentRoomRadarImage((prev) =>
                              prev < 9 ? prev + 1 : 0
                            )
                          }
                          className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-xl   hover:bg-white/20 text-white rounded-full transition-all shadow-lg hover:scale-110"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                            boxShadow:
                              "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)",
                          }}
                        >
                          <IoChevronForward size={24} />
                        </button>
                      </div>
                      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3 z-30">
                        <span className="text-white bg-black/30 backdrop-blur-md px-4 py-1 rounded-full text-sm font-medium border border-white/10 pointer-events-none">
                          {currentRoomRadarImage + 1} / 10
                        </span>
                        <div
                          className="flex gap-2 px-4"
                          style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                          }}
                        >
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentRoomRadarImage(index)}
                              className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                currentRoomRadarImage === index
                                  ? "border-[#10B981] scale-110 shadow-lg shadow-[#10B981]/50"
                                  : "border-white/30 hover:border-white/60 hover:scale-105"
                              }`}
                            >
                              <Image
                                src={`/imagesv2/ims/${index + 1}.png`}
                                alt={`Thumbnail ${index + 1}`}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover pointer-events-none"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* MNSTS Website Images - Project 4 (8-10) */}
                    <div
                      className="h-[50vh] w-full absolute inset-0 rounded-lg overflow-hidden group transition-opacity duration-700"
                      style={{
                        opacity:
                          projectTransitionProgress < 8
                            ? 0
                            : projectTransitionProgress <= 8.4
                            ? (projectTransitionProgress - 8) / 0.4
                            : 1,
                        pointerEvents:
                          projectTransitionProgress >= 8 ? "auto" : "none",
                        zIndex: projectTransitionProgress >= 8 ? 2 : 1,
                      }}
                      onMouseEnter={() => setIsHoveringRoomRadarImage(true)}
                      onMouseLeave={() => setIsHoveringRoomRadarImage(false)}
                    >
                      <Image
                        src={`/imagesv2/mnsts/${Math.min(
                          currentRoomRadarImage + 1,
                          7
                        )}.png`}
                        alt="Background"
                        fill
                        className="object-cover blur-2xl scale-110"
                      />
                      <div className="absolute inset-0">
                        <Image
                          src={`/imagesv2/mnsts/${Math.min(
                            currentRoomRadarImage + 1,
                            7
                          )}.png`}
                          alt={`MNSTS Website Screenshot ${
                            currentRoomRadarImage + 1
                          }`}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div
                        className={`absolute inset-0 flex items-center justify-between px-6 z-30 transition-opacity duration-300 ${
                          isHoveringRoomRadarImage ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <button
                          onClick={() =>
                            setCurrentRoomRadarImage((prev) =>
                              prev > 0 ? prev - 1 : 6
                            )
                          }
                          className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-xl   hover:bg-white/20 text-white rounded-full transition-all shadow-lg hover:scale-110"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                            boxShadow:
                              "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)",
                          }}
                        >
                          <IoChevronBack size={24} />
                        </button>
                        <button
                          onClick={() =>
                            setCurrentRoomRadarImage((prev) =>
                              prev < 6 ? prev + 1 : 0
                            )
                          }
                          className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-xl   hover:bg-white/20 text-white rounded-full transition-all shadow-lg hover:scale-110"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                            boxShadow:
                              "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)",
                          }}
                        >
                          <IoChevronForward size={24} />
                        </button>
                      </div>
                      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3 z-30">
                        <span className="text-white bg-black/30 backdrop-blur-md px-4 py-1 rounded-full text-sm font-medium border border-white/10 pointer-events-none">
                          {currentRoomRadarImage + 1} / 7
                        </span>
                        <div
                          className="flex gap-2 px-4"
                          style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                          }}
                        >
                          {[0, 1, 2, 3, 4, 5, 6].map((index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentRoomRadarImage(index)}
                              className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                currentRoomRadarImage === index
                                  ? "border-[#3B82F6] scale-110 shadow-lg shadow-[#3B82F6]/50"
                                  : "border-white/30 hover:border-white/60 hover:scale-105"
                              }`}
                            >
                              <Image
                                src={`/imagesv2/mnsts/${index + 1}.png`}
                                alt={`Thumbnail ${index + 1}`}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover pointer-events-none"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* 3D Console Game Development Section */}
        <section
          ref={consoleSectionRef}
          id="console-section"
          className="min-h-[400vh] relative bg-transparent"
        >
          <div
            className="h-screen w-full sticky top-0 flex items-center justify-center"
            style={{ zIndex: 10 }}
          >
            <div
              className="w-full h-full grid grid-cols-1 lg:grid-cols-2 transition-opacity duration-500"
              style={{ opacity: 1 }}
            >
              {/* Description/Images Content - Left Side */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="w-full h-full flex flex-col justify-center items-end "
              >
                {/* Toggle Button */}
                <div className="mb-12 min-w-[650px] ">
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-full p-1 w-fit grid grid-cols-2">
                    <div
                      className={`absolute top-1 bottom-1 w-[calc(50%-0.25rem)] bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] rounded-full transition-transform duration-300 ease-out ${
                        showGameImages
                          ? "translate-x-[calc(100%+0.5rem)]"
                          : "translate-x-0"
                      }`}
                      style={{ left: "0.25rem" }}
                    ></div>

                    <button
                      onClick={() => setShowGameImages(false)}
                      className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 flex items-center justify-center relative z-10 ${
                        !showGameImages ? "text-white" : "text-gray-400"
                      }`}
                    >
                      Description
                    </button>
                    <button
                      onClick={() => setShowGameImages(true)}
                      className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 flex items-center justify-center relative z-10 ${
                        showGameImages ? "text-white" : "text-gray-400"
                      }`}
                    >
                      Images
                    </button>
                  </div>
                </div>

                {/* Description View */}
                {!showGameImages && (
                  <div
                    className="relative flex flex-col min-w-[650px] min-h-[350px]"
                    style={{
                      perspective: "1000px",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Maze Horror Game - Game 0 (0-2) */}
                    <div
                      className="absolute inset-0 flex flex-col will-change-transform"
                      style={{
                        opacity:
                          gameTransitionProgress <= 1.6
                            ? 1
                            : gameTransitionProgress <= 2
                            ? 1 - (gameTransitionProgress - 1.6) / 0.4
                            : 0,
                        transform:
                          gameTransitionProgress <= 1.6
                            ? "rotateY(0deg)"
                            : gameTransitionProgress <= 2
                            ? `rotateY(${
                                ((gameTransitionProgress - 1.6) / 0.4) * 90
                              }deg)`
                            : "rotateY(90deg)",
                        transformStyle: "preserve-3d",
                        transition: "transform 0.7s ease, opacity 0.7s ease",
                        pointerEvents:
                          gameTransitionProgress < 1 ? "auto" : "none",
                        zIndex: gameTransitionProgress < 1 ? 2 : 1,
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xl">
                            1
                          </span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-white">
                          Maze Horror Game
                        </h3>
                      </div>
                      <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                        A thrilling{" "}
                        <span className="text-[#FF6B35]">
                          first-person horror experience
                        </span>{" "}
                        where players navigate through dark mazes while avoiding
                        terrifying creatures. Built with immersive 3D graphics
                        and atmospheric sound design.
                      </p>

                      <div className="flex flex-wrap gap-3 mb-8">
                        {["Java", "Raycasting", "3D Graphics", "JDBC"].map(
                          (tech) => (
                            <span
                              key={tech}
                              className="px-4 py-2 bg-gradient-to-r from-[#FF6B35]/10 to-[#FF8C5A]/10  rounded-lg text-[#FF6B35] text-sm font-semibold"
                            >
                              {tech}
                            </span>
                          )
                        )}
                      </div>

                      {/* Project Links */}
                      <div className="flex gap-4">
                        <a
                          href="https://github.com/Rhixin/EscapeSerato"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-lg text-white font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20"
                        >
                          <FontAwesomeIcon icon={faGithub} className="text-xl" />
                          <span>GitHub</span>
                        </a>
                        <a
                          href="https://drive.google.com/file/d/12972LaKNp6Q0kfXUXT4n-uHyKxs9-N5r/view?usp=sharing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-lg text-white font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20"
                        >
                          <FontAwesomeIcon icon={faVideo} className="text-xl" />
                          <span>Video</span>
                        </a>
                      </div>
                    </div>

                    {/* CITerraria - Game 1 (2-4) */}
                    <div
                      className="absolute inset-0 flex flex-col will-change-transform"
                      style={{
                        opacity:
                          gameTransitionProgress < 2
                            ? 0
                            : gameTransitionProgress <= 2.4
                            ? (gameTransitionProgress - 2) / 0.4
                            : gameTransitionProgress <= 3.6
                            ? 1
                            : gameTransitionProgress <= 4
                            ? 1 - (gameTransitionProgress - 3.6) / 0.4
                            : 0,
                        transform:
                          gameTransitionProgress < 2
                            ? "rotateY(-90deg)"
                            : gameTransitionProgress <= 2.4
                            ? `rotateY(${
                                -90 + ((gameTransitionProgress - 2) / 0.4) * 90
                              }deg)`
                            : gameTransitionProgress <= 3.6
                            ? "rotateY(0deg)"
                            : gameTransitionProgress <= 4
                            ? `rotateY(${
                                ((gameTransitionProgress - 3.6) / 0.4) * 90
                              }deg)`
                            : "rotateY(90deg)",
                        transformStyle: "preserve-3d",
                        transition: "transform 0.7s ease, opacity 0.7s ease",
                        pointerEvents:
                          gameTransitionProgress >= 2 &&
                          gameTransitionProgress < 4
                            ? "auto"
                            : "none",
                        zIndex:
                          gameTransitionProgress >= 2 &&
                          gameTransitionProgress < 4
                            ? 2
                            : 1,
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xl">
                            2
                          </span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-white">
                          CITerraria
                        </h3>
                      </div>
                      <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                        A 2D sandbox adventure game inspired by{" "}
                        <span className="text-[#FF6B35]">Terraria</span> ,
                        featuring exploration, crafting, and building mechanics.
                        Players can{" "}
                        <span className="text-[#FF6B35]">
                          mine resources, craft items, and build
                        </span>{" "}
                        structures in a procedurally generated world.
                      </p>

                      <div className="flex flex-wrap gap-3 mb-8">
                        {["Java", "JDBC", "2D Graphics", "OpenGL"].map(
                          (tech) => (
                            <span
                              key={tech}
                              className="px-4 py-2 bg-gradient-to-r from-[#FF6B35]/10 to-[#FF8C5A]/10  rounded-lg text-[#FF6B35] text-sm font-semibold"
                            >
                              {tech}
                            </span>
                          )
                        )}
                      </div>

                      {/* Project Links */}
                      <div className="flex gap-4">
                        <a
                          href="https://github.com/Rhixin/TERRARIA"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-lg text-white font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20"
                        >
                          <FontAwesomeIcon icon={faGithub} className="text-xl" />
                          <span>GitHub</span>
                        </a>
                        <a
                          href="https://drive.google.com/file/d/1tJHA7ckE2qhamNhosbw1WbB9_P3gRNBa/view?usp=sharing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-lg text-white font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20"
                        >
                          <FontAwesomeIcon icon={faVideo} className="text-xl" />
                          <span>Video</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Images View - Game Images */}
                {showGameImages && (
                  <div
                    className="flex flex-col min-w-[650px] relative h-[50vh]"
                    style={{
                      perspective: "1000px",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Maze Horror Game Images (0-2) */}
                    <div
                      className="h-[50vh] w-full absolute inset-0 rounded-lg overflow-hidden group"
                      style={{
                        opacity:
                          gameTransitionProgress <= 1.6
                            ? 1
                            : gameTransitionProgress <= 2
                            ? 1 - (gameTransitionProgress - 1.6) / 0.4
                            : 0,
                        pointerEvents:
                          gameTransitionProgress < 1 ? "auto" : "none",
                        zIndex: gameTransitionProgress < 1 ? 2 : 1,
                        transform:
                          gameTransitionProgress <= 1.6
                            ? "rotateY(0deg)"
                            : gameTransitionProgress <= 2
                            ? `rotateY(${
                                ((gameTransitionProgress - 1.6) / 0.4) * 90
                              }deg)`
                            : "rotateY(90deg)",
                        transformStyle: "preserve-3d",
                        transition: "transform 0.7s ease, opacity 0.7s ease",
                        backfaceVisibility: "hidden",
                      }}
                      onMouseEnter={() => setIsHoveringGameImage(true)}
                      onMouseLeave={() => setIsHoveringGameImage(false)}
                    >
                      <Image
                        src={`/imagesv2/maze/${Math.min(
                          currentGameImage + 1,
                          5
                        )}.png`}
                        alt="Background"
                        fill
                        className="object-cover blur-2xl scale-110"
                      />
                      <div className="absolute inset-0">
                        <Image
                          src={`/imagesv2/maze/${Math.min(
                            currentGameImage + 1,
                            5
                          )}.png`}
                          alt={`Maze Horror Game Screenshot ${
                            currentGameImage + 1
                          }`}
                          fill
                          className="object-contain"
                        />
                      </div>
                      {/* Navigation Arrows */}
                      <div
                        className={`absolute inset-0 flex items-center justify-between px-6 z-30 transition-opacity duration-300 ${
                          isHoveringGameImage ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <button
                          onClick={() =>
                            setCurrentGameImage((prev) =>
                              prev > 0 ? prev - 1 : 4
                            )
                          }
                          className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white rounded-full transition-all shadow-lg hover:scale-110"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                            boxShadow:
                              "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)",
                          }}
                        >
                          <IoChevronBack size={24} />
                        </button>
                        <button
                          onClick={() =>
                            setCurrentGameImage((prev) =>
                              prev < 4 ? prev + 1 : 0
                            )
                          }
                          className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white rounded-full transition-all shadow-lg hover:scale-110"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                            boxShadow:
                              "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)",
                          }}
                        >
                          <IoChevronForward size={24} />
                        </button>
                      </div>
                      {/* Image Counter and Thumbnails */}
                      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3 z-30">
                        <span className="text-white bg-black/30 backdrop-blur-md px-4 py-1 rounded-full text-sm font-medium border border-white/10 pointer-events-none">
                          {currentGameImage + 1} / 5
                        </span>
                        <div
                          className="flex gap-2 px-4"
                          style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                          }}
                        >
                          {[0, 1, 2, 3, 4].map((index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentGameImage(index)}
                              className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                currentGameImage === index
                                  ? "border-[#FF6B35] scale-110 shadow-lg shadow-[#FF6B35]/50"
                                  : "border-white/30 hover:border-white/60 hover:scale-105"
                              }`}
                            >
                              <Image
                                src={`/imagesv2/maze/${index + 1}.png`}
                                alt={`Thumbnail ${index + 1}`}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover pointer-events-none"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* CITerraria Images (2-4) */}
                    <div
                      className="h-[50vh] w-full absolute inset-0 rounded-lg overflow-hidden group"
                      style={{
                        opacity:
                          gameTransitionProgress < 2
                            ? 0
                            : gameTransitionProgress <= 2.4
                            ? (gameTransitionProgress - 2) / 0.4
                            : gameTransitionProgress <= 3.6
                            ? 1
                            : gameTransitionProgress <= 4
                            ? 1 - (gameTransitionProgress - 3.6) / 0.4
                            : 0,
                        pointerEvents:
                          gameTransitionProgress >= 2 &&
                          gameTransitionProgress < 4
                            ? "auto"
                            : "none",
                        zIndex:
                          gameTransitionProgress >= 2 &&
                          gameTransitionProgress < 4
                            ? 2
                            : 1,
                        transform:
                          gameTransitionProgress < 2
                            ? "rotateY(-90deg)"
                            : gameTransitionProgress <= 2.4
                            ? `rotateY(${
                                -90 + ((gameTransitionProgress - 2) / 0.4) * 90
                              }deg)`
                            : gameTransitionProgress <= 3.6
                            ? "rotateY(0deg)"
                            : gameTransitionProgress <= 4
                            ? `rotateY(${
                                ((gameTransitionProgress - 3.6) / 0.4) * 90
                              }deg)`
                            : "rotateY(90deg)",
                        transformStyle: "preserve-3d",
                        transition: "transform 0.7s ease, opacity 0.7s ease",
                        backfaceVisibility: "hidden",
                      }}
                      onMouseEnter={() => setIsHoveringGameImage(true)}
                      onMouseLeave={() => setIsHoveringGameImage(false)}
                    >
                      <Image
                        src={`/imagesv2/terraria/${Math.min(
                          currentGameImage + 1,
                          3
                        )}.png`}
                        alt="Background"
                        fill
                        className="object-cover blur-2xl scale-110"
                      />
                      <div className="absolute inset-0">
                        <Image
                          src={`/imagesv2/terraria/${Math.min(
                            currentGameImage + 1,
                            3
                          )}.png`}
                          alt={`CITerraria Screenshot ${currentGameImage + 1}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                      {/* Navigation Arrows */}
                      <div
                        className={`absolute inset-0 flex items-center justify-between px-6 z-30 transition-opacity duration-300 ${
                          isHoveringGameImage ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <button
                          onClick={() =>
                            setCurrentGameImage((prev) =>
                              prev > 0 ? prev - 1 : 2
                            )
                          }
                          className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white rounded-full transition-all shadow-lg hover:scale-110"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                            boxShadow:
                              "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)",
                          }}
                        >
                          <IoChevronBack size={24} />
                        </button>
                        <button
                          onClick={() =>
                            setCurrentGameImage((prev) =>
                              prev < 2 ? prev + 1 : 0
                            )
                          }
                          className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white rounded-full transition-all shadow-lg hover:scale-110"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                            boxShadow:
                              "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)",
                          }}
                        >
                          <IoChevronForward size={24} />
                        </button>
                      </div>
                      {/* Image Counter and Thumbnails */}
                      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3 z-30">
                        <span className="text-white bg-black/30 backdrop-blur-md px-4 py-1 rounded-full text-sm font-medium border border-white/10 pointer-events-none">
                          {currentGameImage + 1} / 3
                        </span>
                        <div
                          className="flex gap-2 px-4"
                          style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                          }}
                        >
                          {[0, 1, 2].map((index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentGameImage(index)}
                              className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                currentGameImage === index
                                  ? "border-[#8B5CF6] scale-110 shadow-lg shadow-[#8B5CF6]/50"
                                  : "border-white/30 hover:border-white/60 hover:scale-105"
                              }`}
                            >
                              <Image
                                src={`/imagesv2/terraria/${index + 1}.png`}
                                alt={`Thumbnail ${index + 1}`}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover pointer-events-none"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* 3D Console Device - Right Side */}
              <div className="w-full h-full flex items-center justify-center">
                <div
                  className={`relative w-[600px] h-[420px] cursor-grab active:cursor-grabbing ${
                    !isConsoleDragging &&
                    consoleRotation.x === -5 &&
                    consoleRotation.y === -15
                      ? "console-idle"
                      : ""
                  }`}
                  style={{
                    transformStyle: "preserve-3d",
                    transform:
                      isConsoleDragging ||
                      consoleRotation.x !== -5 ||
                      consoleRotation.y !== -15
                        ? `rotateX(${consoleRotation.x}deg) rotateY(${consoleRotation.y}deg)`
                        : undefined,
                    transition: isConsoleDragging
                      ? "none"
                      : "transform 0.3s ease-out",
                  }}
                  onMouseDown={(e) => {
                    setIsConsoleDragging(true);

                    if (consoleResetTimeout.current) {
                      clearTimeout(consoleResetTimeout.current);
                    }

                    const startX = e.clientX;
                    const startY = e.clientY;
                    const startRotation = { ...consoleRotation };

                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      const deltaX = moveEvent.clientX - startX;
                      const deltaY = moveEvent.clientY - startY;

                      const newRotationY = startRotation.y + deltaX * 0.3;
                      const newRotationX = Math.max(
                        -30,
                        Math.min(30, startRotation.x - deltaY * 0.3)
                      );

                      setConsoleRotation({
                        x: newRotationX,
                        y: newRotationY,
                      });
                    };

                    const handleMouseUp = () => {
                      setIsConsoleDragging(false);
                      document.removeEventListener(
                        "mousemove",
                        handleMouseMove
                      );
                      document.removeEventListener("mouseup", handleMouseUp);

                      consoleResetTimeout.current = setTimeout(() => {
                        setConsoleRotation({ x: -5, y: -15 });
                      }, 2000);
                    };

                    document.addEventListener("mousemove", handleMouseMove);
                    document.addEventListener("mouseup", handleMouseUp);
                  }}
                >
                  {/* Main Console Body */}
                  <div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background:
                        "linear-gradient(135deg, #1a1a1e 0%, #0f0f12 100%)",
                      boxShadow:
                        "0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 2px 4px rgba(255, 255, 255, 0.1)",
                      transform: "translateZ(0px)",
                      border: "2px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    {/* Screen Area */}
                    <div
                      className="absolute top-4 left-16 right-16 h-[280px] rounded-lg overflow-hidden"
                      style={{
                        background: "#000",
                        boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.8)",
                        border: "3px solid #0a0a0f",
                      }}
                    >
                      {/* Screen Bezel */}
                      <div className="absolute inset-0 border-4 border-gray-900 rounded-lg z-10 pointer-events-none"></div>

                      {/* Game Screenshots - Transitioning */}
                      <div className="w-full h-full relative bg-black">
                        {/* Maze Horror Game Screen */}
                        <div
                          className="w-full h-full absolute inset-0 transition-opacity duration-700"
                          style={{
                            opacity:
                              gameTransitionProgress <= 1.6
                                ? 1
                                : gameTransitionProgress <= 2
                                ? 1 - (gameTransitionProgress - 1.6) / 0.4
                                : 0,
                          }}
                        >
                          <Image
                            src={`/imagesv2/maze/${Math.min(
                              currentGameImage + 1,
                              5
                            )}.png`}
                            alt="Maze Horror Game"
                            fill
                            className="object-cover"
                            style={{ objectFit: "cover" }}
                          />
                        </div>

                        {/* CITerraria Screen */}
                        <div
                          className="w-full h-full absolute inset-0 transition-opacity duration-700"
                          style={{
                            opacity:
                              gameTransitionProgress < 2
                                ? 0
                                : gameTransitionProgress <= 2.4
                                ? (gameTransitionProgress - 2) / 0.4
                                : gameTransitionProgress <= 3.6
                                ? 1
                                : gameTransitionProgress <= 4
                                ? 1 - (gameTransitionProgress - 3.6) / 0.4
                                : 0,
                          }}
                        >
                          <Image
                            src={`/imagesv2/terraria/${Math.min(
                              currentGameImage + 1,
                              3
                            )}.png`}
                            alt="CITerraria"
                            fill
                            className="object-cover"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Left D-Pad Area */}
                    <div className="absolute bottom-8 left-8 w-16 h-16">
                      {/* D-Pad Cross */}
                      <div className="relative w-full h-full">
                        {/* Up */}
                        <div
                          className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-6 rounded-t"
                          style={{
                            background:
                              "linear-gradient(135deg, #2a2a2e 0%, #1a1a1e 100%)",
                            boxShadow:
                              "inset 0 -1px 2px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(255, 255, 255, 0.1)",
                          }}
                        ></div>
                        {/* Down */}
                        <div
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-6 rounded-b"
                          style={{
                            background:
                              "linear-gradient(135deg, #2a2a2e 0%, #1a1a1e 100%)",
                            boxShadow:
                              "inset 0 -1px 2px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(255, 255, 255, 0.1)",
                          }}
                        ></div>
                        {/* Left */}
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-5 rounded-l"
                          style={{
                            background:
                              "linear-gradient(135deg, #2a2a2e 0%, #1a1a1e 100%)",
                            boxShadow:
                              "inset 0 -1px 2px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(255, 255, 255, 0.1)",
                          }}
                        ></div>
                        {/* Right */}
                        <div
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-5 rounded-r"
                          style={{
                            background:
                              "linear-gradient(135deg, #2a2a2e 0%, #1a1a1e 100%)",
                            boxShadow:
                              "inset 0 -1px 2px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(255, 255, 255, 0.1)",
                          }}
                        ></div>
                        {/* Center */}
                        <div
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded"
                          style={{
                            background:
                              "linear-gradient(135deg, #1a1a1e 0%, #0f0f12 100%)",
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Right Action Buttons */}
                    <div className="absolute bottom-8 right-8 w-16 h-16">
                      <div className="relative w-full h-full">
                        {/* Triangle (Top) */}
                        <div
                          className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full"
                          style={{
                            background:
                              "linear-gradient(135deg, #2a2a2e 0%, #1a1a1e 100%)",
                            boxShadow:
                              "inset 0 -1px 2px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(255, 255, 255, 0.1)",
                          }}
                        ></div>
                        {/* Cross (Bottom) */}
                        <div
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full"
                          style={{
                            background:
                              "linear-gradient(135deg, #2a2a2e 0%, #1a1a1e 100%)",
                            boxShadow:
                              "inset 0 -1px 2px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(255, 255, 255, 0.1)",
                          }}
                        ></div>
                        {/* Square (Left) */}
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
                          style={{
                            background:
                              "linear-gradient(135deg, #2a2a2e 0%, #1a1a1e 100%)",
                            boxShadow:
                              "inset 0 -1px 2px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(255, 255, 255, 0.1)",
                          }}
                        ></div>
                        {/* Circle (Right) */}
                        <div
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
                          style={{
                            background:
                              "linear-gradient(135deg, #2a2a2e 0%, #1a1a1e 100%)",
                            boxShadow:
                              "inset 0 -1px 2px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(255, 255, 255, 0.1)",
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Shoulder Buttons (L/R) */}
                    <div
                      className="absolute -top-2 left-12 w-16 h-3 rounded-t-lg"
                      style={{
                        background:
                          "linear-gradient(135deg, #2a2a2e 0%, #1a1a1e 100%)",
                        boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.5)",
                        transform: "translateZ(2px)",
                      }}
                    ></div>
                    <div
                      className="absolute -top-2 right-12 w-16 h-3 rounded-t-lg"
                      style={{
                        background:
                          "linear-gradient(135deg, #2a2a2e 0%, #1a1a1e 100%)",
                        boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.5)",
                        transform: "translateZ(2px)",
                      }}
                    ></div>

                    {/* Start/Select Buttons */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-4">
                      <div
                        className="w-8 h-2 rounded-full"
                        style={{
                          background:
                            "linear-gradient(135deg, #2a2a2e 0%, #1a1a1e 100%)",
                          boxShadow: "inset 0 -1px 1px rgba(0, 0, 0, 0.5)",
                        }}
                      ></div>
                      <div
                        className="w-8 h-2 rounded-full"
                        style={{
                          background:
                            "linear-gradient(135deg, #2a2a2e 0%, #1a1a1e 100%)",
                          boxShadow: "inset 0 -1px 1px rgba(0, 0, 0, 0.5)",
                        }}
                      ></div>
                    </div>

                    {/* Speakers */}
                    <div className="absolute top-2 left-4 right-4 flex justify-between">
                      <div className="flex gap-0.5">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={`speaker-l-${i}`}
                            className="w-1 h-8 rounded-full bg-black/50"
                          ></div>
                        ))}
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={`speaker-r-${i}`}
                            className="w-1 h-8 rounded-full bg-black/50"
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* End of Stacking Sections Container */}

      {/* 3D Picture Frame Certifications Gallery */}
      <section className="min-h-screen bg-[#0a0a0f] py-20 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            {/* Section Title */}
            <motion.h2
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-center mb-4"
            >
              <span className="bg-gradient-to-r from-[#FF6B35] via-[#FF8C5A] to-[#FFB088] bg-clip-text text-transparent">
                Certifications
              </span>
            </motion.h2>
            <p className="text-xl text-gray-400">
              Professional achievements and credentials
            </p>
          </motion.div>

          {/* Picture Frames Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Frame 1: AWS Academy - Classic Wooden Frame */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <div
                className="relative w-full aspect-[4/3] cursor-pointer"
                style={{
                  perspective: "2000px",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="w-full h-full relative transition-all duration-500 group-hover:rotateY(0deg) group-hover:rotateX(0deg) group-hover:scale-110"
                  style={{
                    transform: "rotateY(-8deg) rotateX(6deg) translateZ(0px)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Outer Frame - Creates 3D depth */}
                  <div
                    className="absolute inset-0"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    {/* Frame Border with beveled edges */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 rounded-sm">
                      {/* Top highlight bevel */}
                      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-amber-300/60 to-transparent rounded-t-sm"></div>
                      {/* Left highlight bevel */}
                      <div className="absolute top-0 left-0 bottom-0 w-4 bg-gradient-to-r from-amber-300/60 to-transparent rounded-l-sm"></div>
                      {/* Bottom shadow bevel */}
                      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/60 to-transparent rounded-b-sm"></div>
                      {/* Right shadow bevel */}
                      <div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-l from-black/60 to-transparent rounded-r-sm"></div>
                      {/* Wood grain */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "repeating-linear-gradient(90deg, rgba(0,0,0,0.15) 0px, transparent 3px, transparent 6px, rgba(0,0,0,0.15) 9px)",
                          opacity: 0.4,
                        }}
                      ></div>
                    </div>

                    {/* Inner frame ridge */}
                    <div className="absolute inset-4 bg-gradient-to-br from-amber-900 to-amber-950 rounded-sm shadow-lg">
                      {/* Matting layer */}
                      <div className="absolute inset-2 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
                        {/* Certificate holder */}
                        <div className="absolute inset-4 bg-white shadow-2xl shadow-black/40 overflow-hidden">
                          <Image
                            src="/imagesv2/certifications/aws.png"
                            alt="AWS Academy Graduate - Cloud Foundations"
                            fill
                            className="object-contain p-3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Multi-layer wall shadow for depth */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Primary shadow */}
                    <div
                      className="absolute top-3 left-5 right-0 bottom-0 bg-black/30 blur-2xl rounded-sm"
                      style={{ transform: "translateZ(-10px) scale(0.98)" }}
                    ></div>
                    {/* Secondary softer shadow */}
                    <div
                      className="absolute top-5 left-8 right-0 bottom-0 bg-black/15 blur-3xl rounded-sm"
                      style={{ transform: "translateZ(-20px) scale(0.95)" }}
                    ></div>
                  </div>
                </div>
              </div>
              <p className="text-center mt-4 text-gray-300 font-medium">
                AWS Academy Graduate
              </p>
            </motion.div>

            {/* Frame 2: C Programming - Modern Metal Frame */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div
                className="relative w-full aspect-[4/3] cursor-pointer"
                style={{
                  perspective: "2000px",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="w-full h-full relative transition-all duration-500 group-hover:rotateY(0deg) group-hover:rotateX(0deg) group-hover:scale-110"
                  style={{
                    transform: "rotateY(7deg) rotateX(-5deg) translateZ(0px)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Outer Frame - Creates 3D depth */}
                  <div
                    className="absolute inset-0"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    {/* Frame Border with beveled edges */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-700 rounded-sm">
                      {/* Top highlight bevel */}
                      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/70 to-transparent rounded-t-sm"></div>
                      {/* Left highlight bevel */}
                      <div className="absolute top-0 left-0 bottom-0 w-4 bg-gradient-to-r from-white/70 to-transparent rounded-l-sm"></div>
                      {/* Bottom shadow bevel */}
                      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/70 to-transparent rounded-b-sm"></div>
                      {/* Right shadow bevel */}
                      <div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-l from-black/70 to-transparent rounded-r-sm"></div>
                      {/* Metal shine */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50"></div>
                    </div>

                    {/* Inner frame ridge */}
                    <div className="absolute inset-4 bg-gradient-to-br from-gray-700 to-gray-900 rounded-sm shadow-lg">
                      {/* Matting layer */}
                      <div className="absolute inset-2 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
                        {/* Certificate holder */}
                        <div className="absolute inset-4 bg-white shadow-2xl shadow-black/40 overflow-hidden">
                          <Image
                            src="/imagesv2/certifications/c.png"
                            alt="C Programming"
                            fill
                            className="object-contain p-3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Multi-layer wall shadow for depth */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div
                      className="absolute top-3 left-0 right-5 bottom-0 bg-black/30 blur-2xl rounded-sm"
                      style={{ transform: "translateZ(-10px) scale(0.98)" }}
                    ></div>
                    <div
                      className="absolute top-5 left-0 right-8 bottom-0 bg-black/15 blur-3xl rounded-sm"
                      style={{ transform: "translateZ(-20px) scale(0.95)" }}
                    ></div>
                  </div>
                </div>
              </div>
              <p className="text-center mt-4 text-gray-300 font-medium">
                C Programming
              </p>
            </motion.div>

            {/* Frame 3: Java - Gold Ornate Frame */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <div
                className="relative w-full aspect-[4/3] cursor-pointer"
                style={{
                  perspective: "2000px",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="w-full h-full relative transition-all duration-500 group-hover:rotateY(0deg) group-hover:rotateX(0deg) group-hover:scale-110"
                  style={{
                    transform: "rotateY(-6deg) rotateX(7deg) translateZ(0px)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Outer Frame - Creates 3D depth */}
                  <div
                    className="absolute inset-0"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    {/* Gold Ornate Frame Border with beveled edges */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-800 rounded-sm border-4 border-yellow-400/60">
                      {/* Top highlight bevel */}
                      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-yellow-200/80 to-transparent rounded-t-sm"></div>
                      {/* Left highlight bevel */}
                      <div className="absolute top-0 left-0 bottom-0 w-4 bg-gradient-to-r from-yellow-200/80 to-transparent rounded-l-sm"></div>
                      {/* Bottom shadow bevel */}
                      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/60 to-transparent rounded-b-sm"></div>
                      {/* Right shadow bevel */}
                      <div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-l from-black/60 to-transparent rounded-r-sm"></div>
                      {/* Gold shine */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
                    </div>

                    {/* Inner frame ridge */}
                    <div className="absolute inset-4 bg-gradient-to-br from-yellow-800 to-yellow-950 rounded-sm shadow-lg">
                      {/* Matting layer */}
                      <div className="absolute inset-2 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
                        {/* Certificate holder */}
                        <div className="absolute inset-4 bg-white shadow-2xl shadow-black/40 overflow-hidden">
                          <Image
                            src="/imagesv2/certifications/java.png"
                            alt="Java"
                            fill
                            className="object-contain p-3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Multi-layer wall shadow for depth */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div
                      className="absolute top-3 left-5 right-0 bottom-0 bg-black/30 blur-2xl rounded-sm"
                      style={{ transform: "translateZ(-10px) scale(0.98)" }}
                    ></div>
                    <div
                      className="absolute top-5 left-8 right-0 bottom-0 bg-black/15 blur-3xl rounded-sm"
                      style={{ transform: "translateZ(-20px) scale(0.95)" }}
                    ></div>
                  </div>
                </div>
              </div>
              <p className="text-center mt-4 text-gray-300 font-medium">
                Java Certification
              </p>
            </motion.div>

            {/* Frame 4: JavaScript - Dark Wood Frame */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="group"
            >
              <div
                className="relative w-full aspect-[4/3] cursor-pointer"
                style={{
                  perspective: "2000px",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="w-full h-full relative transition-all duration-500 group-hover:rotateY(0deg) group-hover:rotateX(0deg) group-hover:scale-110"
                  style={{
                    transform: "rotateY(5deg) rotateX(-8deg) translateZ(0px)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Outer Frame - Creates 3D depth */}
                  <div
                    className="absolute inset-0"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    {/* Dark Wood Frame Border with beveled edges */}
                    <div className="absolute inset-0 bg-gradient-to-br from-stone-700 via-stone-900 to-black rounded-sm">
                      {/* Top highlight bevel */}
                      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-stone-500/50 to-transparent rounded-t-sm"></div>
                      {/* Left highlight bevel */}
                      <div className="absolute top-0 left-0 bottom-0 w-4 bg-gradient-to-r from-stone-500/50 to-transparent rounded-l-sm"></div>
                      {/* Bottom shadow bevel */}
                      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-sm"></div>
                      {/* Right shadow bevel */}
                      <div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-l from-black/80 to-transparent rounded-r-sm"></div>
                      {/* Wood grain */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, transparent 1px, transparent 3px, rgba(255,255,255,0.05) 4px)",
                          opacity: 0.3,
                        }}
                      ></div>
                    </div>

                    {/* Inner frame ridge */}
                    <div className="absolute inset-4 bg-gradient-to-br from-stone-950 to-black rounded-sm shadow-lg">
                      {/* Matting layer */}
                      <div className="absolute inset-2 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
                        {/* Certificate holder */}
                        <div className="absolute inset-4 bg-white shadow-2xl shadow-black/40 overflow-hidden">
                          <Image
                            src="/imagesv2/certifications/javascript.jpg"
                            alt="JavaScript"
                            fill
                            className="object-contain p-3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Multi-layer wall shadow for depth */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div
                      className="absolute top-3 left-0 right-5 bottom-0 bg-black/30 blur-2xl rounded-sm"
                      style={{ transform: "translateZ(-10px) scale(0.98)" }}
                    ></div>
                    <div
                      className="absolute top-5 left-0 right-8 bottom-0 bg-black/15 blur-3xl rounded-sm"
                      style={{ transform: "translateZ(-20px) scale(0.95)" }}
                    ></div>
                  </div>
                </div>
              </div>
              <p className="text-center mt-4 text-gray-300 font-medium">
                JavaScript
              </p>
            </motion.div>

            {/* Frame 5: PhilNITS - Silver Modern Frame */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="group"
            >
              <div
                className="relative w-full aspect-[4/3] cursor-pointer"
                style={{
                  perspective: "2000px",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="w-full h-full relative transition-all duration-500 group-hover:rotateY(0deg) group-hover:rotateX(0deg) group-hover:scale-110"
                  style={{
                    transform: "rotateY(-7deg) rotateX(6deg) translateZ(0px)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Outer Frame - Creates 3D depth */}
                  <div
                    className="absolute inset-0"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    {/* Frame Border with beveled edges */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-300 via-slate-400 to-slate-600 rounded-sm">
                      {/* Top highlight bevel */}
                      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/70 to-transparent rounded-t-sm"></div>
                      {/* Left highlight bevel */}
                      <div className="absolute top-0 left-0 bottom-0 w-4 bg-gradient-to-r from-white/70 to-transparent rounded-l-sm"></div>
                      {/* Bottom shadow bevel */}
                      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/70 to-transparent rounded-b-sm"></div>
                      {/* Right shadow bevel */}
                      <div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-l from-black/70 to-transparent rounded-r-sm"></div>
                      {/* Silver shine */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50"></div>
                    </div>

                    {/* Inner frame ridge */}
                    <div className="absolute inset-4 bg-gradient-to-br from-slate-500 to-slate-700 rounded-sm shadow-lg">
                      {/* Matting layer */}
                      <div className="absolute inset-2 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
                        {/* Certificate holder */}
                        <div className="absolute inset-4 bg-white shadow-2xl shadow-black/40 overflow-hidden">
                          <Image
                            src="/imagesv2/certifications/philnits.jpeg"
                            alt="PhilNITS Passer"
                            fill
                            className="object-contain p-3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Multi-layer wall shadow for depth */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Primary shadow */}
                    <div
                      className="absolute top-3 left-5 right-0 bottom-0 bg-black/30 blur-2xl rounded-sm"
                      style={{ transform: "translateZ(-10px) scale(0.98)" }}
                    ></div>
                    {/* Secondary softer shadow */}
                    <div
                      className="absolute top-5 left-8 right-0 bottom-0 bg-black/15 blur-3xl rounded-sm"
                      style={{ transform: "translateZ(-20px) scale(0.95)" }}
                    ></div>
                  </div>
                </div>
              </div>
              <p className="text-center mt-4 text-gray-300 font-medium">
                PhilNITS Passer
              </p>
            </motion.div>

            {/* Frame 6: React - Minimalist White Frame */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="group"
            >
              <div
                className="relative w-full aspect-[4/3] cursor-pointer"
                style={{
                  perspective: "2000px",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="w-full h-full relative transition-all duration-500 group-hover:rotateY(0deg) group-hover:rotateX(0deg) group-hover:scale-110"
                  style={{
                    transform: "rotateY(8deg) rotateX(-6deg) translateZ(0px)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Outer Frame - Creates 3D depth */}
                  <div
                    className="absolute inset-0"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    {/* Frame Border with beveled edges */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-gray-300 rounded-sm">
                      {/* Top highlight bevel */}
                      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/90 to-transparent rounded-t-sm"></div>
                      {/* Left highlight bevel */}
                      <div className="absolute top-0 left-0 bottom-0 w-4 bg-gradient-to-r from-white/90 to-transparent rounded-l-sm"></div>
                      {/* Bottom shadow bevel */}
                      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-400/60 to-transparent rounded-b-sm"></div>
                      {/* Right shadow bevel */}
                      <div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-l from-gray-400/60 to-transparent rounded-r-sm"></div>
                      {/* White shine */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-50"></div>
                    </div>

                    {/* Inner frame ridge */}
                    <div className="absolute inset-4 bg-gradient-to-br from-gray-200 to-gray-400 rounded-sm shadow-lg">
                      {/* Matting layer */}
                      <div className="absolute inset-2 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
                        {/* Certificate holder */}
                        <div className="absolute inset-4 bg-white shadow-2xl shadow-black/40 overflow-hidden">
                          <Image
                            src="/imagesv2/certifications/react.jpg"
                            alt="React"
                            fill
                            className="object-contain p-3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Multi-layer wall shadow for depth */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Primary shadow */}
                    <div
                      className="absolute top-3 left-0 right-5 bottom-0 bg-black/30 blur-2xl rounded-sm"
                      style={{ transform: "translateZ(-10px) scale(0.98)" }}
                    ></div>
                    {/* Secondary softer shadow */}
                    <div
                      className="absolute top-5 left-0 right-8 bottom-0 bg-black/15 blur-3xl rounded-sm"
                      style={{ transform: "translateZ(-20px) scale(0.95)" }}
                    ></div>
                  </div>
                </div>
              </div>
              <p className="text-center mt-4 text-gray-300 font-medium">
                React Certification
              </p>
            </motion.div>

            {/* Frame 7: STTP - Bronze Classic Frame */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <div
                className="relative w-full aspect-[4/3] cursor-pointer"
                style={{
                  perspective: "2000px",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="w-full h-full relative transition-all duration-500 group-hover:rotateY(0deg) group-hover:rotateX(0deg) group-hover:scale-110"
                  style={{
                    transform: "rotateY(-5deg) rotateX(-7deg) translateZ(0px)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Outer Frame - Creates 3D depth */}
                  <div
                    className="absolute inset-0"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    {/* Frame Border with beveled edges */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-700 to-orange-900 rounded-sm">
                      {/* Top highlight bevel */}
                      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-orange-400/70 to-transparent rounded-t-sm"></div>
                      {/* Left highlight bevel */}
                      <div className="absolute top-0 left-0 bottom-0 w-4 bg-gradient-to-r from-orange-400/70 to-transparent rounded-l-sm"></div>
                      {/* Bottom shadow bevel */}
                      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/70 to-transparent rounded-b-sm"></div>
                      {/* Right shadow bevel */}
                      <div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-l from-black/70 to-transparent rounded-r-sm"></div>
                      {/* Bronze shine */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-300/40 to-transparent opacity-50"></div>
                    </div>

                    {/* Inner frame ridge */}
                    <div className="absolute inset-4 bg-gradient-to-br from-orange-800 to-orange-950 rounded-sm shadow-lg">
                      {/* Matting layer */}
                      <div className="absolute inset-2 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
                        {/* Certificate holder */}
                        <div className="absolute inset-4 bg-white shadow-2xl shadow-black/40 overflow-hidden">
                          <Image
                            src="/imagesv2/certifications/sttp.jpeg"
                            alt="Scholars Technopreneurship Training Program"
                            fill
                            className="object-contain p-3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Multi-layer wall shadow for depth */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Primary shadow */}
                    <div
                      className="absolute top-3 left-5 right-0 bottom-0 bg-black/30 blur-2xl rounded-sm"
                      style={{ transform: "translateZ(-10px) scale(0.98)" }}
                    ></div>
                    {/* Secondary softer shadow */}
                    <div
                      className="absolute top-5 left-8 right-0 bottom-0 bg-black/15 blur-3xl rounded-sm"
                      style={{ transform: "translateZ(-20px) scale(0.95)" }}
                    ></div>
                  </div>
                </div>
              </div>
              <p className="text-center mt-4 text-gray-300 font-medium">STTP</p>
            </motion.div>

            {/* Frame 8: TopCIT - Black Luxury Frame */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: true }}
              className="group"
            >
              <div
                className="relative w-full aspect-[4/3] cursor-pointer"
                style={{
                  perspective: "2000px",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="w-full h-full relative transition-all duration-500 group-hover:rotateY(0deg) group-hover:rotateX(0deg) group-hover:scale-110"
                  style={{
                    transform: "rotateY(6deg) rotateX(8deg) translateZ(0px)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Outer Frame - Creates 3D depth */}
                  <div
                    className="absolute inset-0"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    {/* Frame Border with beveled edges */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-black to-gray-900 rounded-sm">
                      {/* Top highlight bevel */}
                      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-gray-600/60 to-transparent rounded-t-sm"></div>
                      {/* Left highlight bevel */}
                      <div className="absolute top-0 left-0 bottom-0 w-4 bg-gradient-to-r from-gray-600/60 to-transparent rounded-l-sm"></div>
                      {/* Bottom shadow bevel */}
                      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-sm"></div>
                      {/* Right shadow bevel */}
                      <div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-l from-black/80 to-transparent rounded-r-sm"></div>
                      {/* Luxury shine */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                    </div>

                    {/* Inner frame ridge */}
                    <div className="absolute inset-4 bg-gradient-to-br from-black to-gray-900 rounded-sm shadow-lg border border-gray-700">
                      {/* Matting layer */}
                      <div className="absolute inset-2 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
                        {/* Certificate holder */}
                        <div className="absolute inset-4 bg-white shadow-2xl shadow-black/40 overflow-hidden">
                          <Image
                            src="/imagesv2/certifications/topcit.jpeg"
                            alt="TopCIT Level III"
                            fill
                            className="object-contain p-3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Multi-layer wall shadow for depth */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Primary shadow */}
                    <div
                      className="absolute top-3 left-0 right-5 bottom-0 bg-black/40 blur-2xl rounded-sm"
                      style={{ transform: "translateZ(-10px) scale(0.98)" }}
                    ></div>
                    {/* Secondary softer shadow */}
                    <div
                      className="absolute top-5 left-0 right-8 bottom-0 bg-black/20 blur-3xl rounded-sm"
                      style={{ transform: "translateZ(-20px) scale(0.95)" }}
                    ></div>
                  </div>
                </div>
              </div>
              <p className="text-center mt-4 text-gray-300 font-medium">
                TopCIT Level III
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="min-h-screen relative overflow-hidden flex items-center justify-center py-20 px-8">
        {/* Background gradient effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6B35]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl w-full mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#FF6B35] via-[#FF8C5A] to-[#FFB088] bg-clip-text text-transparent mb-4">
              Get In Touch
            </h2>
            <p className="text-lg md:text-xl text-gray-400">
              Let's connect and create something amazing together!
            </p>
          </motion.div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Email Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10  transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#FF6B35]/20 flex items-center justify-center mb-4">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-3xl text-[#FF6B35]"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Email</h3>
                <a
                  href="mailto:your.email@example.com"
                  className="text-gray-400 hover:text-[#FF6B35] transition-colors"
                >
                  vallestedted@gmail.com
                </a>
              </div>
            </motion.div>

            {/* Phone Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10  transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#FF6B35]/20 flex items-center justify-center mb-4">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="text-3xl text-[#FF6B35]"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Phone</h3>
                <a
                  href="tel:+1234567890"
                  className="text-gray-400 hover:text-[#FF6B35] transition-colors"
                >
                  +63 927 193 5386
                </a>
              </div>
            </motion.div>

            {/* Location Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10  transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#FF6B35]/20 flex items-center justify-center mb-4">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="text-3xl text-[#FF6B35]"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Location</h3>
                <p className="text-gray-400">Cebu City, Philippines</p>
              </div>
            </motion.div>
          </div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Connect With Me
            </h3>
            <div className="flex justify-center gap-6">
              <a
                href="https://github.com/Rhixin"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FF6B35]/20 hover:border-[#FF6B35]/50 transition-all duration-300 hover:scale-110"
              >
                <FontAwesomeIcon
                  icon={faGithub}
                  className="text-2xl text-gray-400 hover:text-[#FF6B35]"
                />
              </a>
              <a
                href="www.linkedin.com/in/zhazted-rhixin-valles-051152258"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FF6B35]/20 hover:border-[#FF6B35]/50 transition-all duration-300 hover:scale-110"
              >
                <FontAwesomeIcon
                  icon={faLinkedin}
                  className="text-2xl text-gray-400 hover:text-[#FF6B35]"
                />
              </a>
              <a
                href="https://facebook.com/zhaztedrhixin.valles"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FF6B35]/20 hover:border-[#FF6B35]/50 transition-all duration-300 hover:scale-110"
              >
                <FontAwesomeIcon
                  icon={faFacebook}
                  className="text-2xl text-gray-400 hover:text-[#FF6B35]"
                />
              </a>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-16 pt-8 border-t border-white/10"
          >
            <p className="text-gray-500">
              © {new Date().getFullYear()} Zhazted Rhixin Valles. All rights
              reserved.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Fixed Chat Icon Button - Lower Right within content space */}
      <div className="fixed bottom-12 right-8 md:right-16 lg:right-24 z-50">
        <motion.button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 rounded-full transition-all duration-300 hover:scale-110 group"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 107, 53, 0.9) 0%, rgba(255, 107, 53, 0.7) 100%)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            boxShadow:
              "0 4px 12px 0 rgba(255, 107, 53, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)",
            border: "2px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <div className="flex items-center justify-center">
            {isChatOpen ? (
              <svg
                className="w-6 h-6 text-white transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            )}
          </div>
          {/* Pulse animation when closed */}
          {!isChatOpen && (
            <span className="absolute inset-0 rounded-full bg-[#FF6B35] opacity-75 animate-ping"></span>
          )}
        </motion.button>
      </div>

      {/* Chat Conversation UI */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            ref={chatBoxRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed z-50 w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: "rgba(10, 10, 15, 0.95)",
              backdropFilter: "blur(40px) saturate(180%)",
              WebkitBackdropFilter: "blur(40px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.4)",
              left: chatPosition.x || "auto",
              top: chatPosition.y || "auto",
              right: chatPosition.x ? "auto" : "2rem",
              bottom: chatPosition.y ? "auto" : "8rem",
              cursor: isDraggingChat ? "grabbing" : "default",
            }}
          >
            {/* Chat Header - Draggable */}
            <div
              onMouseDown={handleChatMouseDown}
              className="px-4 py-3 border-b border-gray-700/50 flex items-center justify-between cursor-grab active:cursor-grabbing"
            >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FF6B35] flex items-center justify-center">
                      <span className="text-white font-bold text-sm">R</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">
                        Rhixin
                      </h3>
                      <p className="text-gray-400 text-xs">AI Assistant</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="h-96 overflow-y-auto p-4 space-y-4 chatbox-scrollbar">
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-2 ${
                        message.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-cyan-400 to-purple-500"
                            : "bg-[#FF6B35]"
                        }`}
                      >
                        <span className="text-white font-bold text-xs">
                          {message.role === "user" ? "U" : "R"}
                        </span>
                      </div>
                      <div
                        className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                          message.role === "user"
                            ? "rounded-tr-none"
                            : "rounded-tl-none"
                        }`}
                        style={{
                          background:
                            message.role === "user"
                              ? "rgba(0, 245, 255, 0.1)"
                              : "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <p className="text-gray-200 text-sm">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isChatLoading && (
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs">R</span>
                      </div>
                      <div
                        className="px-4 py-2 rounded-2xl rounded-tl-none"
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={chatMessagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-gray-700/50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      disabled={isChatLoading}
                      className="flex-1 px-4 py-2 rounded-full text-sm text-white placeholder-gray-400 outline-none disabled:opacity-50"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || isChatLoading}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255, 107, 53, 0.9) 0%, rgba(255, 107, 53, 0.7) 100%)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                      }}
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
