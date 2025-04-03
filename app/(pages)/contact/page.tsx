"use client";
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
import { motion } from "framer-motion";

export default function Contact() {
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      className="rounded-lg p-8 max-w-[740px] "
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <h1 className="text-xl md:text-5xl font-bold mb-8 text-[#373f51]">
        Contact Me
      </h1>
      <div className="space-y-4">
        {contactInfo.map((info, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 * index }}
            className="flex items-center"
          >
            <div className="mr-4 text-[#373f51]">
              <FontAwesomeIcon icon={info.icon} size="lg" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{info.label}:</p>
              {info.link ? (
                <a
                  href={info.link}
                  className="text-blue-500 hover:text-[#1b1b1e]"
                  target={info.label !== "Address" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                >
                  {info.value}
                </a>
              ) : (
                <p className="text-gray-600">{info.value}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
