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
    <>
      {/* ABOUT ME SECTION */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row items-center justify-center h-auto md:h-[50vh] p-5 font-sans m-auto mt-16"
      >
        <div className="md:pr-5 mr-4">
          <p className="text-lg text-[#1b1b1e] mb-2">Hello, I'm</p>
          <h1 className="text-6xl md:text-7xl font-bold mb-2 tracking-tight leading-tight text-[#373f51]">
            Zhazted Rhixin
          </h1>
          <div className="h-10 relative">
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentTitle}
                className="absolute w-full text-3xl md:text-4xl font-bold text-[#373f51]"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5 }}
              >
                {currentTitle}
              </motion.h1>
            </AnimatePresence>
          </div>

          <p className="mb-3 mt-8 max-w-[500px] text-[#1b1b1e] text-justify">
            I'm Zhazted Rhixin V. Valles, a 3rd-year Computer Science student
            and I have a deep passion for programming, especially when it comes
            to developing solutions that address real-world problems.
          </p>

          <p className="mb-3 mt-8 max-w-[500px] text-[#1b1b1e] text-justify">
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
            className="rounded-full transition-transform transform hover:scale-105 duration-300 bg-[#a9bcd0]"
          />
        </div>
      </motion.div>

      {/* SKILLS SECTION */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-col h-auto md:h-[50vh] font-sans m-auto items-start justify-start w-full max-w-[830px]"
      >
        {/* Technical Skills Section */}
        <div className="mt-10 w-full">
          <h2 className="text-3xl font-bold mb-6 text-start text-[#373f51]">
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
                className="cursor-pointer px-4 py-2 shadow-sm rounded-full bg-[#a9bcd0] text-[#1b1b1e] text-sm font-medium transition-transform duration-300 ease-in-out hover:scale-110"
              >
                {skill}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Soft Skills Section */}
        <div className="mt-10 w-full">
          <h2 className="text-3xl font-bold mb-6 text-start text-[#373f51]">
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
                className=" cursor-pointer px-4 shadow-sm py-2 rounded-full bg-[#a9bcd0] text-[#1b1b1e] text-sm font-medium transition-transform duration-300 ease-in-out hover:scale-110"
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
        className="flex flex-col h-auto font-sans m-auto items-start justify-start w-full max-w-[830px] mt-10"
      >
        <h2 className="text-3xl font-bold mb-6 text-start text-[#373f51]">
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
                <p className="text-lg font-medium text-[#1b1b1e]">{edu.name}</p>
                <p className="text-md text-[#373f51]">{edu.additional}</p>
              </div>
            </div>

            {/* Right: Graduation Year (Responsive Alignment) */}
            <div className="w-full md:flex-1 md:text-right">
              <p className="text-md font-medium text-[#1b1b1e]">{edu.year}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
