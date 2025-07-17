"use client";

import { motion } from "framer-motion";
import Carousel from "@/components/Carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";

export default function Project({
  title,
  description,
  images,
  technology,
  weblink,
  github,
  video,
}: {
  title: string;
  description: string;
  images: string[];
  technology: string[];
  weblink: string;
  github: string;
  video: string;
}) {
  // Animation Variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <>
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-col items-center justify-center h-auto p-4 md:p-8 font-sans m-auto max-w-6xl glass-effect rounded-3xl border border-cyan-400/20 shadow-2xl mb-8 md:mb-12 will-change-transform"
      >
        <div className="md:pr-5 flex-2 max-w-[740px]">
          <div className="flex flex-row md:mt-0 flex-1 text-justify h-full">
            <h1 className="text-xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              {title}
            </h1>

            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto"
            >
              <FontAwesomeIcon
                icon={faGithub}
                size="lg"
                className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
              />
            </a>

            {video && (
              <a href={video} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon
                  icon={faVideo}
                  size="lg"
                  className="text-purple-400 hover:text-purple-300 transition-colors duration-200 ml-4"
                />
              </a>
            )}

            {weblink && (
              <a href={weblink} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon
                  icon={faLink}
                  size="lg"
                  className="text-pink-400 hover:text-pink-300 transition-colors duration-200 ml-4"
                />
              </a>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {technology.map((skill, index) => (
              <div
                key={index}
                className="cursor-pointer px-4 py-2 shadow-sm rounded-full glass-effect text-cyan-400 text-sm font-medium transition-all duration-200 ease-out hover:scale-105 border border-cyan-400/30 hover:text-white hover:glow-border inline-block will-change-transform"
              >
                {skill}
              </div>
            ))}
          </div>

          <Carousel images={images} />

          <p className="text-justify mt-8 text-gray-300 leading-relaxed">{description}</p>
        </div>
      </motion.div>
    </>
  );
}
