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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.5, ease: "easeOut" },
    },
  };

  return (
    <>
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-col md:flex-row items-center justify-center h-auto mt-10 mb-14 p-5 font-sans m-auto max-w-[840px]"
      >
        <div className="md:pr-5 flex-2 max-w-[740px]">
          <div className="flex flex-row md:mt-0 flex-1 text-justify h-full">
            <h1 className="text-xl md:text-3xl font-bold mb-2 text-[#373f51]">
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
                className="text-[#373f51]"
              />
            </a>

            {video && (
              <a href={video} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon
                  icon={faVideo}
                  size="lg"
                  className="text-[#373f51] ml-4"
                />
              </a>
            )}

            {weblink && (
              <a href={weblink} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon
                  icon={faLink}
                  size="lg"
                  className="text-[#373f51] ml-4"
                />
              </a>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {technology.map((skill, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                animate="visible"
                className="cursor-pointer px-4 py-2 shadow-sm rounded-full bg-[#373f51] text-white text-sm font-medium transition-transform duration-300 ease-in-out hover:scale-110 inline-block"
              >
                {skill}
              </motion.div>
            ))}
          </div>

          <Carousel images={images} />

          <p className="text-justify mt-20">{description}</p>
        </div>
      </motion.div>
    </>
  );
}
