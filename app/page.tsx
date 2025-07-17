"use client";
import { useState, useEffect, useRef } from "react";
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

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [roadmapProgress, setRoadmapProgress] = useState(0);
  const [activeEducationIndex, setActiveEducationIndex] = useState(-1);
  const [activeProjectIndex, setActiveProjectIndex] = useState(-1);
  const [projectHoverIndex, setProjectHoverIndex] = useState(-1);
  const [expandedProjects, setExpandedProjects] = useState<number[]>([]);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const educationRefs = useRef<(HTMLDivElement | null)[]>([]);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Handle roadmap progress on scroll
  useEffect(() => {
    const handleScroll = () => {
      const educationSection = sectionsRef.current[3];
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
        const projectSection = sectionsRef.current[4];
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
  const titles = [
    "Frontend Developer",
    "Backend Developer",
    "Data Analyst",
    "Fullstack Developer",
  ];
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

  const education = [
    {
      logo: "/images/MNSTS_logo.jpg",
      name: "Medellin National Science and Technology School",
      additional: "Graduated as Batch Salutatorian",
      year: "June 2016 - June 2022",
    },
    {
      logo: "/images/CIT.png",
      name: "Cebu Institute of Technology - University",
      additional: "Bachelor of Science in Computer Science",
      year: "August 2022 - Present",
    },
    {
      logo: "/images/dost.jpg",
      name: "DOST JLSS Scholar",
      additional: "",
      year: "August 2024 - Present",
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

  const AnimatedBackground = () => (
    <div className="fixed inset-0 opacity-20 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-ping"></div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
          linear-gradient(rgba(0, 245, 255, 0.15) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 245, 255, 0.15) 1px, transparent 1px)
        `,
          backgroundSize: "60px 60px",
        }}
      ></div>
    </div>
  );

  return (
    <div className="relative">
      <AnimatedBackground />

      {/* Hero Section */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        className="min-h-screen flex flex-col items-center justify-center relative px-4"
      >
        <motion.div
          className={`relative z-10 text-center space-y-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
            RHIXIN VALLES
          </h1>

          <div className="text-xl md:text-2xl text-gray-300 font-mono">
            <span className="text-cyan-400">{"> Full Stack Developer"}</span>
            <span className="animate-ping text-cyan-400">_</span>
          </div>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Crafting digital experiences with cutting-edge technology.
            Specializing in modern web development, AI integration, and
            innovative solutions.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <button
              onClick={() => scrollToSection(1)}
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 glass-effect rounded-lg hover:from-cyan-500/30 hover:to-purple-500/30 transition-all duration-300 glow-border float-animation"
            >
              <span className="text-cyan-400 font-semibold">EXPLORE</span>
            </button>

            <button
              onClick={() => scrollToSection(2)}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 glass-effect rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 glow-border float-animation delay-200"
            >
              <span className="text-purple-400 font-semibold">PROJECTS</span>
            </button>

            <button
              onClick={() => scrollToSection(3)}
              className="group relative px-8 py-4 bg-gradient-to-r from-pink-500/20 to-cyan-500/20 glass-effect rounded-lg hover:from-pink-500/30 hover:to-cyan-500/30 transition-all duration-300 glow-border float-animation delay-400"
            >
              <span className="text-pink-400 font-semibold">CONNECT</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* About Section - Hello I'm */}
      <section
        ref={(el) => (sectionsRef.current[1] = el)}
        className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl w-full"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 max-w-2xl">
              <p className="text-lg text-cyan-400 mb-2">Hello, I'm</p>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Zhazted Rhixin
              </h1>
              <div className="h-10 relative mb-8">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={currentTitle}
                    className="absolute w-full text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.5 }}
                  >
                    {currentTitle}
                  </motion.h2>
                </AnimatePresence>
              </div>

              <p className="text-gray-300 leading-relaxed mb-4">
                I'm Zhazted Rhixin V. Valles, a 3rd-year Computer Science
                student and I have a deep passion for programming, especially
                when it comes to developing solutions that address real-world
                problems.
              </p>

              <p className="text-gray-300 leading-relaxed">
                I find fulfillment in creating solutions that make a difference.
                For me, programming isn't just a skill—it's a way to innovate,
                improve lives, and shape the future through technology.
              </p>
            </div>

            <div className="flex-shrink-0 md:ml-8">
              <div className="relative w-56 h-56 md:w-72 md:h-72">
                {/* Outer rotating ring */}
                <div
                  className="absolute inset-0 rounded-full border-2 border-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-60 animate-spin"
                  style={{ animationDuration: "20s" }}
                ></div>

                {/* Middle hexagonal frame */}
                <div
                  className="absolute inset-4 bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-pink-500/20 transform rotate-45 animate-pulse"
                  style={{
                    clipPath:
                      "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                  }}
                ></div>

                {/* Inner pulsing glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full blur-xl opacity-30 animate-pulse"></div>

                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  <div
                    className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-ping"
                    style={{ top: "20%", left: "80%", animationDelay: "0s" }}
                  ></div>
                  <div
                    className="absolute w-1 h-1 bg-purple-400 rounded-full animate-ping"
                    style={{ top: "70%", left: "20%", animationDelay: "1s" }}
                  ></div>
                  <div
                    className="absolute w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping"
                    style={{ top: "40%", left: "10%", animationDelay: "2s" }}
                  ></div>
                  <div
                    className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping"
                    style={{ top: "80%", left: "70%", animationDelay: "3s" }}
                  ></div>
                </div>

                {/* Holographic overlay */}
                <div className="absolute inset-6 rounded-full bg-gradient-to-tr from-transparent via-cyan-400/10 to-transparent animate-pulse"></div>

                {/* Main image container with futuristic frame */}
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-cyan-400/50 glass-effect shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-purple-500/10 z-10"></div>
                  <Image
                    src="/images/profile_picture.jpeg"
                    alt="Zhazted"
                    fill
                    className="object-cover transition-transform hover:scale-110 duration-500 filter brightness-110 contrast-110"
                  />

                  {/* Scan line effect */}
                  <div className="absolute inset-0 z-20 opacity-20">
                    <div
                      className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"
                      style={{ top: "30%", animationDelay: "0s" }}
                    ></div>
                    <div
                      className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse"
                      style={{ top: "60%", animationDelay: "1s" }}
                    ></div>
                  </div>
                </div>

                {/* Corner accents */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400 opacity-70"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-purple-400 opacity-70"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-pink-400 opacity-70"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400 opacity-70"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section
        ref={(el) => (sectionsRef.current[2] = el)}
        className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl w-full space-y-16"
        >
          {/* Technical Skills */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent text-center">
              Technical Skills
            </h2>

            {/* First sliding row - right to left */}
            <div className="skills-container mb-6">
              <div className="flex gap-4 slide-right whitespace-nowrap">
                {[
                  ...technicalSkills.slice(0, 12),
                  ...technicalSkills.slice(0, 12),
                ].map((skill, index) => (
                  <div
                    key={`tech-row1-${index}`}
                    className="flex items-center gap-3 px-6 py-3 glass-effect text-cyan-400 text-sm font-medium rounded-full border border-cyan-400/30 hover:border-cyan-400/60 hover:text-white transition-all duration-300 cursor-pointer hover:scale-105 flex-shrink-0"
                  >
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className="w-5 h-5"
                    />
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Second sliding row - left to right */}
            <div className="skills-container">
              <div className="flex gap-4 slide-left whitespace-nowrap">
                {[
                  ...technicalSkills.slice(12),
                  ...technicalSkills.slice(12),
                ].map((skill, index) => (
                  <div
                    key={`tech-row2-${index}`}
                    className="flex items-center gap-3 px-6 py-3 glass-effect text-purple-400 text-sm font-medium rounded-full border border-purple-400/30 hover:border-purple-400/60 hover:text-white transition-all duration-300 cursor-pointer hover:scale-105 flex-shrink-0"
                  >
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className="w-5 h-5"
                    />
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Soft Skills */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent text-center">
              Soft Skills
            </h2>

            {/* First soft skills row - right to left */}
            <div className="skills-container mb-6">
              <div className="flex gap-4 slide-right whitespace-nowrap">
                {[...softSkills.slice(0, 6), ...softSkills.slice(0, 6)].map(
                  (skill, index) => (
                    <div
                      key={`soft-row1-${index}`}
                      className="px-6 py-3 glass-effect text-pink-400 text-sm font-medium rounded-full border border-pink-400/30 hover:border-pink-400/60 hover:text-white transition-all duration-300 cursor-pointer hover:scale-105 flex-shrink-0"
                    >
                      {skill}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Second soft skills row - left to right */}
            <div className="skills-container">
              <div className="flex gap-4 slide-left whitespace-nowrap">
                {[...softSkills.slice(6), ...softSkills.slice(6)].map(
                  (skill, index) => (
                    <div
                      key={`soft-row2-${index}`}
                      className="px-6 py-3 glass-effect text-purple-400 text-sm font-medium rounded-full border border-purple-400/30 hover:border-purple-400/60 hover:text-white transition-all duration-300 cursor-pointer hover:scale-105 flex-shrink-0"
                    >
                      {skill}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Education Section */}
      <section
        ref={(el) => (sectionsRef.current[3] = el)}
        className="min-h-[200vh] flex flex-col items-center justify-start px-4 py-32"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl w-full"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-16 bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent text-center">
            Education Roadmap
          </h2>

          <div className="relative">
            {/* Timeline background line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-600/30 rounded-full"></div>

            {/* Progressive timeline line */}
            <div
              className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
              style={{ height: `${roadmapProgress}%` }}
            ></div>

            {education.map((edu, index) => (
              <motion.div
                key={index}
                ref={(el) => (educationRefs.current[index] = el)}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.3, duration: 0.8 }}
                viewport={{ once: true }}
                className={`relative flex items-center ${
                  index === education.length - 1 ? "mb-32" : "mb-64"
                } ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                {/* Content Card */}
                <div
                  className={`w-5/12 ${
                    index % 2 === 0 ? "pr-8" : "pl-8"
                  } relative z-20`}
                >
                  <div
                    className={`glass-effect rounded-2xl p-8 border transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-400/20 ${
                      activeEducationIndex === index
                        ? "border-cyan-400/60 shadow-xl shadow-cyan-400/30 scale-105"
                        : "border-pink-400/20 hover:border-cyan-400/30"
                    }`}
                  >
                    <div className="flex items-center gap-6 mb-6">
                      <div className="relative">
                        <Image
                          src={edu.logo}
                          alt="School Logo"
                          width={80}
                          height={80}
                          className={`rounded-full border-2 transition-all duration-500 ${
                            activeEducationIndex === index
                              ? "border-cyan-400/80 scale-110"
                              : "border-cyan-400/30"
                          }`}
                        />
                        {/* Enhanced glow effect for active item */}
                        <div
                          className={`absolute inset-0 rounded-full blur-md animate-pulse transition-all duration-500 ${
                            activeEducationIndex === index
                              ? "bg-gradient-to-r from-cyan-400/40 to-purple-500/40"
                              : "bg-gradient-to-r from-cyan-400/20 to-purple-500/20"
                          }`}
                        ></div>
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`text-xl font-bold mb-2 transition-all duration-500 ${
                            activeEducationIndex === index
                              ? "text-cyan-400"
                              : "text-gray-200"
                          }`}
                        >
                          {edu.name}
                        </h3>
                        {edu.additional && (
                          <p
                            className={`text-base font-medium transition-all duration-500 ${
                              activeEducationIndex === index
                                ? "text-purple-300"
                                : "text-purple-400"
                            }`}
                          >
                            {edu.additional}
                          </p>
                        )}
                      </div>
                    </div>
                    <div
                      className={`font-medium text-base transition-all duration-500 ${
                        activeEducationIndex === index
                          ? "text-cyan-300"
                          : "text-cyan-400"
                      }`}
                    >
                      {edu.year}
                    </div>
                  </div>
                </div>

                {/* Timeline Node with enhanced active state */}
                <div
                  className={`absolute left-1/2 transform -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 border-4 border-gray-900 shadow-lg z-30 transition-all duration-500 ${
                    activeEducationIndex === index
                      ? "w-12 h-12 shadow-2xl shadow-cyan-400/50"
                      : "w-8 h-8"
                  }`}
                >
                  <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 blur-sm animate-pulse transition-all duration-500 ${
                      activeEducationIndex === index
                        ? "opacity-80"
                        : "opacity-60"
                    }`}
                  ></div>
                </div>

                {/* Progress indicator positioned on opposite side */}
                <div
                  className={`w-5/12 ${
                    index % 2 === 0 ? "pl-8" : "pr-8"
                  } flex ${
                    index % 2 === 0 ? "justify-end" : "justify-start"
                  } relative z-40`}
                >
                  <div
                    className={`flex items-center gap-3 text-base ${
                      index % 2 === 0 ? "mr-4" : "ml-4"
                    } px-4 py-2 rounded-full backdrop-blur-sm border transition-all duration-500 ${
                      activeEducationIndex === index
                        ? "bg-cyan-900/90 border-cyan-400/60 text-cyan-300 shadow-lg shadow-cyan-400/30 scale-110"
                        : "bg-gray-900/90 border-gray-700/50 text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full animate-pulse transition-all duration-500 ${
                        activeEducationIndex === index
                          ? index === 0
                            ? "bg-pink-300 scale-125"
                            : index === 1
                            ? "bg-purple-300 scale-125"
                            : "bg-cyan-300 scale-125"
                          : index === 0
                          ? "bg-pink-400"
                          : index === 1
                          ? "bg-purple-400"
                          : "bg-cyan-400"
                      }`}
                    ></div>
                    <span className="font-medium">
                      {index === 0
                        ? "Foundation"
                        : index === 1
                        ? "Higher Education"
                        : "Scholarship"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Timeline end indicator */}
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-cyan-400 border-4 border-gray-900 shadow-lg z-30">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-cyan-400 blur-sm opacity-60 animate-pulse"></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Projects Section */}
      <section
        ref={(el) => (sectionsRef.current[4] = el)}
        className="min-h-screen flex flex-col items-center justify-start px-2 sm:px-4 py-16 md:py-24 lg:py-32"
      >
        <div className="max-w-7xl w-full">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-12 md:mb-20 lg:mb-32 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
          >
            Project Arsenal
          </motion.h1>

          {/* Floating particles background */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-cyan-400/20 rounded-full animate-ping"
                style={{
                  left: `${(i * 17.3 + 23) % 100}%`,
                  top: `${(i * 13.7 + 41) % 100}%`,
                  animationDelay: `${(i * 0.3) % 3}s`,
                  animationDuration: `${2 + ((i * 0.2) % 2)}s`,
                }}
              />
            ))}
          </div>

          <div className="space-y-12 md:space-y-20 lg:space-y-32">
            {projectsData.map((project, index) => (
              <motion.div
                key={index}
                ref={(el) => (projectRefs.current[index] = el)}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: index * 0.2 }}
                viewport={{ once: true }}
                onMouseEnter={() => setProjectHoverIndex(index)}
                onMouseLeave={() => setProjectHoverIndex(-1)}
                className={`relative overflow-hidden transition-all duration-700 ${
                  index % 2 === 0 ? "lg:ml-0" : "lg:ml-auto lg:mr-0"
                } ${activeProjectIndex === index ? "scale-105" : ""}`}
                className="w-full max-w-6xl mx-auto"
              >
                {/* Project hologram effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-purple-500/5 to-pink-500/5 rounded-3xl transition-all duration-700 ${
                    activeProjectIndex === index ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* Scan line effect */}
                <div
                  className={`absolute inset-0 overflow-hidden rounded-3xl transition-all duration-700 ${
                    activeProjectIndex === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div
                    className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-pulse"
                    style={{
                      top: "20%",
                      animationDelay: "0s",
                      animationDuration: "3s",
                    }}
                  />
                  <div
                    className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400/60 to-transparent animate-pulse"
                    style={{
                      top: "60%",
                      animationDelay: "1s",
                      animationDuration: "3s",
                    }}
                  />
                  <div
                    className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-pink-400/60 to-transparent animate-pulse"
                    style={{
                      top: "80%",
                      animationDelay: "2s",
                      animationDuration: "3s",
                    }}
                  />
                </div>

                {/* Glitch effect border */}
                <div
                  className={`absolute inset-0 rounded-3xl transition-all duration-300 ${
                    activeProjectIndex === index
                      ? "border-cyan-400/50 shadow-2xl shadow-cyan-400/20"
                      : projectHoverIndex === index
                      ? "border-purple-400/40 shadow-xl shadow-purple-400/10"
                      : "border-cyan-400/20"
                  }`}
                />

                {/* Main content */}
                <div
                  className={`glass-effect rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 transition-all duration-700 ${
                    activeProjectIndex === index
                      ? "bg-cyan-900/10"
                      : "bg-black/20"
                  }`}
                >
                  <div
                    className={`flex flex-col gap-6 md:gap-8 lg:gap-12 ${
                      index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                    }`}
                  >
                    {/* Content Side */}
                    <div className="flex-1 space-y-4 md:space-y-6 lg:space-y-8">
                      {/* Project Number */}
                      <div className="flex items-center gap-2 md:gap-4">
                        <div
                          className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent opacity-20 transition-all duration-500 ${
                            activeProjectIndex === index
                              ? "opacity-40 scale-110"
                              : ""
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-cyan-400/50 to-transparent" />
                      </div>

                      {/* Title with enhanced effects */}
                      <div className="relative">
                        <h2
                          className={`text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 transition-all duration-500 ${
                            activeProjectIndex === index
                              ? "text-cyan-400 drop-shadow-lg"
                              : "bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
                          }`}
                        >
                          {project.title}
                        </h2>
                      </div>

                      {/* Links with enhanced styling */}
                      <div className="flex gap-3 md:gap-4 lg:gap-6">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group relative p-2 md:p-3 rounded-full transition-all duration-300 ${
                            activeProjectIndex === index
                              ? "bg-cyan-400/20 text-cyan-400 shadow-md shadow-cyan-400/15"
                              : "bg-gray-800/50 text-gray-400 hover:bg-cyan-400/10 hover:text-cyan-400"
                          }`}
                        >
                          <FontAwesomeIcon
                            icon={faGithub}
                            className="text-base md:text-lg group-hover:scale-110 transition-transform"
                          />
                          <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>

                        {project.video && (
                          <a
                            href={project.video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group relative p-2 md:p-3 rounded-full transition-all duration-300 ${
                              activeProjectIndex === index
                                ? "bg-purple-400/20 text-purple-400 shadow-md shadow-purple-400/15"
                                : "bg-gray-800/50 text-gray-400 hover:bg-purple-400/10 hover:text-purple-400"
                            }`}
                          >
                            <FontAwesomeIcon
                              icon={faVideo}
                              className="text-base md:text-lg group-hover:scale-110 transition-transform"
                            />
                            <div className="absolute inset-0 rounded-full bg-purple-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        )}

                        {project.weblink && (
                          <a
                            href={project.weblink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group relative p-2 md:p-3 rounded-full transition-all duration-300 ${
                              activeProjectIndex === index
                                ? "bg-pink-400/20 text-pink-400 shadow-md shadow-pink-400/15"
                                : "bg-gray-800/50 text-gray-400 hover:bg-pink-400/10 hover:text-pink-400"
                            }`}
                          >
                            <FontAwesomeIcon
                              icon={faLink}
                              className="text-base md:text-lg group-hover:scale-110 transition-transform"
                            />
                            <div className="absolute inset-0 rounded-full bg-pink-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        )}
                      </div>

                      {/* Technology tags with logos */}
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        {project.technology.map((tech, techIndex) => {
                          const getTechIcon = (techName: string) => {
                            const techIcons: { [key: string]: string } = {
                              React:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
                              "Next.js":
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
                              JavaScript:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
                              TypeScript:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
                              Python:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
                              "Node.js":
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
                              TensorFlow:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
                              Tensorflow:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
                              MySQL:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
                              MongoDB:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
                              Firebase:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
                              Django:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
                              PHP: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
                              Java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
                              "C++":
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
                              Git: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
                              Docker:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
                              AWS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
                              Bootstrap:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
                              Tailwind:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
                              jQuery:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-original.svg",
                              Pandas:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
                              "ASP.NET":
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg",
                              SQL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
                              "C#": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
                              HTML: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
                              CSS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
                              Javascript:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
                              "Python Django":
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
                              SQLite:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
                              Matplotlib:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matplotlib/matplotlib-original.svg",
                              Seaborn:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
                              Numpy:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg",
                              Keras:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
                              Flask:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
                              SocketIo:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg",
                              "Google Maps API":
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg",
                              Cloudinary:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
                              libGDX:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
                              Raycasting:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
                              JavaFx:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
                              Apriori:
                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
                            };
                            return (
                              techIcons[techName] ||
                              "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg"
                            );
                          };

                          return (
                            <span
                              key={techIndex}
                              className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm font-medium rounded-full border transition-all duration-300 cursor-pointer ${
                                activeProjectIndex === index
                                  ? "bg-cyan-400/20 text-cyan-300 border-cyan-400/40 shadow-sm shadow-cyan-400/10"
                                  : "glass-effect text-cyan-400 border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300 hover:border-cyan-400/50"
                              }`}
                              style={{
                                animationDelay: `${techIndex * 0.1}s`,
                              }}
                            >
                              <img
                                src={getTechIcon(tech)}
                                alt={tech}
                                className="w-3 h-3 md:w-4 md:h-4"
                              />
                              <span className="hidden sm:inline">{tech}</span>
                            </span>
                          );
                        })}
                      </div>

                      {/* Description with expand/collapse */}
                      <div className="relative">
                        <div className="transition-all duration-500">
                          <p
                            className={`text-gray-300 leading-relaxed text-sm md:text-base transition-all duration-500 ${
                              activeProjectIndex === index
                                ? "text-gray-200"
                                : ""
                            }`}
                          >
                            {expandedProjects.includes(index)
                              ? project.description
                              : truncateText(project.description)}
                          </p>

                          {project.description.length >
                            (typeof window !== "undefined" &&
                            window.innerWidth < 768
                              ? 100
                              : 150) && (
                            <button
                              onClick={() => toggleProjectExpansion(index)}
                              className={`mt-2 md:mt-3 text-xs md:text-sm font-medium transition-all duration-300 hover:scale-105 ${
                                activeProjectIndex === index
                                  ? "text-cyan-300 hover:text-cyan-200"
                                  : "text-cyan-400 hover:text-cyan-300"
                              }`}
                            >
                              {expandedProjects.includes(index)
                                ? "← Show less"
                                : "Read more →"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Image Side with sliding carousel */}
                    <div className="flex-shrink-0 w-full lg:w-96">
                      <div
                        className={`relative group transition-all duration-700 ${
                          activeProjectIndex === index ? "scale-105" : ""
                        }`}
                      >
                        {/* Holographic frame */}
                        <div
                          className={`absolute -inset-2 md:-inset-4 bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-lg transition-all duration-700 ${
                            activeProjectIndex === index
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />

                        {/* Image container with enhanced effects */}
                        <div
                          className={`relative glass-effect rounded-2xl p-3 md:p-4 lg:p-6 border transition-all duration-700 ${
                            activeProjectIndex === index
                              ? "border-cyan-400/50 shadow-lg shadow-cyan-400/10"
                              : "border-purple-400/20 hover:border-purple-400/40"
                          }`}
                        >
                          <div className="relative overflow-hidden rounded-xl h-48 md:h-56 lg:h-64">
                            {/* Sliding images container */}
                            <div className="relative w-full h-full">
                              <div className="absolute inset-0 overflow-hidden">
                                <div
                                  className={`flex gap-2 md:gap-4 transition-transform duration-700 ${
                                    activeProjectIndex === index
                                      ? "animate-slide-images"
                                      : ""
                                  }`}
                                  style={{
                                    width: `${project.images.length * 100}%`,
                                    transform:
                                      activeProjectIndex === index
                                        ? "translateX(0)"
                                        : "translateX(0)",
                                    animation:
                                      activeProjectIndex === index
                                        ? `slideImages ${
                                            project.images.length * 3
                                          }s linear infinite`
                                        : "none",
                                  }}
                                >
                                  {/* Duplicate images for seamless loop */}
                                  {[...project.images, ...project.images].map(
                                    (img, imgIndex) => (
                                      <div
                                        key={imgIndex}
                                        className="flex-shrink-0 relative"
                                        style={{
                                          width: `${
                                            100 / project.images.length
                                          }%`,
                                        }}
                                      >
                                        <Image
                                          src={img}
                                          alt={`${project.title} ${
                                            imgIndex + 1
                                          }`}
                                          width={400}
                                          height={300}
                                          className={`w-full h-48 md:h-56 lg:h-64 object-contain transition-all duration-700 ${
                                            activeProjectIndex === index
                                              ? "brightness-110 contrast-110"
                                              : "hover:scale-105"
                                          }`}
                                        />
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Overlay effects */}
                            <div
                              className={`absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-purple-500/10 transition-all duration-700 ${
                                activeProjectIndex === index
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />

                            {/* Image counter */}
                            <div
                              className={`absolute bottom-2 md:bottom-4 right-2 md:right-4 px-2 md:px-3 py-1 rounded-full bg-black/60 text-cyan-400 text-xs md:text-sm font-medium transition-all duration-300 ${
                                activeProjectIndex === index
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            >
                              {project.images.length} Images
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        ref={(el) => (sectionsRef.current[5] = el)}
        className="min-h-screen flex flex-col items-center justify-start px-2 sm:px-4 py-16 md:py-24 lg:py-32 relative overflow-hidden"
      >
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 245, 255, 0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
            animation: 'moveGrid 20s linear infinite'
          }}></div>
        </div>

        {/* Floating Particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-60"
            style={{
              left: `${(i * 23.7 + 15) % 90}%`,
              top: `${(i * 17.3 + 25) % 80}%`,
              animation: `floatParticle ${8 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${i * 0.8}s`
            }}
          ></div>
        ))}

        <div className="max-w-6xl w-full relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16 lg:mb-20"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
              Contact Me
            </h1>
            <p className="text-lg md:text-xl text-gray-400 font-mono tracking-wider">
              Let's connect and collaborate
            </p>
          </motion.div>

          {/* Contact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="group relative"
              >
                {/* Hexagonal border animation */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/15 via-purple-500/15 to-pink-500/15 p-[2px] group-hover:from-cyan-400/40 group-hover:via-purple-500/40 group-hover:to-pink-500/40 transition-all duration-500">
                  <div className="h-full w-full rounded-2xl bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl"></div>
                </div>

                {/* Contact card content */}
                <div className="relative p-4 md:p-5 h-full flex flex-col">
                  {/* Icon with holographic effect */}
                  <div className="relative mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400/15 to-purple-500/15 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300 relative overflow-hidden">
                      {/* Animated background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 animate-pulse"></div>
                      <FontAwesomeIcon 
                        icon={info.icon} 
                        className="text-lg text-cyan-400 relative z-10 group-hover:text-white transition-colors duration-300" 
                      />
                      {/* Hologram lines */}
                      <div className="absolute inset-0 opacity-30">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                            style={{
                              top: `${30 + i * 20}%`,
                              animation: `slideHologram ${2 + i * 0.5}s ease-in-out infinite`,
                              animationDelay: `${i * 0.3}s`
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Label */}
                  <div className="relative mb-3">
                    <h3 className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:from-pink-400 group-hover:to-cyan-400 transition-all duration-300">
                      {info.label.toUpperCase()}
                    </h3>
                  </div>

                  {/* Value */}
                  <div className="flex-1 relative">
                    {info.link ? (
                      <a
                        href={info.link}
                        className="block text-gray-300 hover:text-cyan-400 transition-all duration-300 break-words text-sm md:text-base group-hover:tracking-wider relative"
                        target={info.label !== "Address" ? "_blank" : undefined}
                        rel="noopener noreferrer"
                      >
                        <span className="relative z-10">{info.value}</span>
                        {/* Highlight effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                      </a>
                    ) : (
                      <p className="text-gray-300 break-words text-sm md:text-base group-hover:text-cyan-400 group-hover:tracking-wider transition-all duration-300 relative">
                        <span className="relative z-10">{info.value}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                      </p>
                    )}
                  </div>

                  {/* Status indicator */}
                  <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 group-hover:text-cyan-400 transition-colors duration-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="font-mono">ACTIVE</span>
                  </div>
                </div>

                {/* Scanning line effect */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                  animation: 'none'
                }} onMouseEnter={(e) => e.currentTarget.style.animation = 'scanHorizontal 2s ease-in-out infinite'} onMouseLeave={(e) => e.currentTarget.style.animation = 'none'}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
