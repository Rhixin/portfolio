"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function About() {
  const titles = [
    "Frontend Developer",
    "Backend Developer",
    "Data Analyst",
    "Fullstack Developer",
  ];
  const [currentTitle, setCurrentTitle] = useState(titles[0]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % titles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentTitle(titles[index]);
  }, [index]);

  const technicalSkills = [
    "C",
    "C++",
    "C#",
    "Java",
    "PHP",
    "JavaScript",
    "SQL",
    "Python",
    "Pandas",
    "TensorFlow",
    "Keras",
    "Seaborn",
    "Matplotlib",
    "Next.js",
    "Bootstrap",
    "ASP.NET",
    "Django",
    "Cloud Firestore",
    "MySQL",
    "Firebase Storage",
    "Nodejs",
    "React",
    "jQuery",
    "libGDX",
    "PyGame",
    "PyTurtle",
  ];

  const softSkills = [
    "Adaptability",
    "Critical Thinking",
    "Project Management",
    "Time Management",
    "Accountability",
  ];

  // Animation Variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const skillVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 1 },
    }),
  };

  const education = [
    {
      logo: "/images/dost.jpg",
      name: "DOST JLSS Scholar",
      additional: "",
      year: "August 2024 - Present",
    },
    {
      logo: "/images/CIT.png",
      name: "Cebu Institute of Technogloy - University",
      additional: "Bachelor of Science in Computer Science",
      year: "August 2022 - Present",
    },
    {
      logo: "/images/MNSTS_logo.jpg",
      name: "Medellin National Science and Technology School",
      additional: "Graduated as Batch Salutatorian",
      year: "June 2016 - June 2022",
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* ABOUT ME SECTION */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row items-center justify-center h-auto p-4 md:p-8 font-sans m-auto glass-effect rounded-3xl border border-cyan-400/20 shadow-2xl max-w-6xl mb-8 md:mb-12"
      >
        <div className="md:pr-5 mr-4">
          <p className="text-lg text-cyan-400 mb-2">Hello, I'm</p>
          <h1 className="text-6xl md:text-7xl font-bold mb-2 tracking-tight leading-tight bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Zhazted Rhixin
          </h1>
          <div className="h-10 relative">
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentTitle}
                className="absolute w-full text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5 }}
              >
                {currentTitle}
              </motion.h1>
            </AnimatePresence>
          </div>

          <p className="mb-3 mt-8 max-w-[500px] text-gray-300 text-justify">
            I'm Zhazted Rhixin V. Valles, a 3rd-year Computer Science student
            and I have a deep passion for programming, especially when it comes
            to developing solutions that address real-world problems.
          </p>

          <p className="mb-3 mt-8 max-w-[500px] text-gray-300 text-justify">
            I find fulfillment in creating solutions that make a difference. For
            me, programming isn't just a skill—it's a way to innovate, improve
            lives, and shape the future through technology.
          </p>
        </div>
        <div className="flex justify-center mt-5 md:mt-0">
          <Image
            src="/images/profile_picture.jpeg"
            alt="Zhazted"
            width={300}
            height={300}
            className="rounded-full transition-transform transform hover:scale-105 duration-300 border-4 border-cyan-400/50 glow-border"
          />
        </div>
      </motion.div>

      {/* SKILLS SECTION */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col h-auto font-sans m-auto items-start justify-start w-full max-w-6xl glass-effect rounded-3xl p-4 md:p-8 border border-purple-400/20 shadow-2xl mb-8 md:mb-12"
      >
        {/* Technical Skills Section */}
        <div className="mt-10 w-full">
          <h2 className="text-3xl font-bold mb-6 text-start bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Technical Skills
          </h2>
          <motion.div className="flex flex-wrap justify-start gap-2">
            {technicalSkills.map((skill, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={skillVariants}
                initial="hidden"
                animate="visible"
                className="cursor-pointer px-4 py-2 shadow-sm rounded-full glass-effect text-cyan-400 text-sm font-medium transition-all duration-300 ease-in-out hover:scale-110 hover:glow-border border border-cyan-400/30 hover:text-white"
              >
                {skill}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Soft Skills Section */}
        <div className="mt-10 w-full">
          <h2 className="text-3xl font-bold mb-6 text-start bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Soft Skills
          </h2>
          <motion.div className="flex flex-wrap justify-start gap-2">
            {softSkills.map((skill, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={skillVariants}
                initial="hidden"
                animate="visible"
                className="cursor-pointer px-4 shadow-sm py-2 rounded-full glass-effect text-purple-400 text-sm font-medium transition-all duration-300 ease-in-out hover:scale-110 hover:glow-border border border-purple-400/30 hover:text-white"
              >
                {skill}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* EDUCATION SECTION */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-col h-auto font-sans m-auto items-start justify-start w-full max-w-6xl glass-effect rounded-3xl p-4 md:p-8 border border-pink-400/20 shadow-2xl mb-8 md:mb-12"
      >
        <h2 className="text-3xl font-bold mb-6 text-start bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Education
        </h2>

        {education.map((edu, index) => (
          <motion.div
            key={index}
            className="flex flex-col md:flex-row md:items-center gap-4 mb-6 w-full"
            variants={sectionVariants}
          >
            {/* Left: School Logo & Name */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Image
                src={edu.logo}
                alt="School Logo"
                width={50}
                height={50}
                className="rounded-full"
              />
              <div>
                <p className="text-lg font-medium text-gray-200">{edu.name}</p>
                <p className="text-md text-gray-400">{edu.additional}</p>
              </div>
            </div>

            {/* Right: Graduation Year (Responsive Alignment) */}
            <div className="w-full md:flex-1 md:text-right">
              <p className="text-md font-medium text-cyan-400">{edu.year}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
