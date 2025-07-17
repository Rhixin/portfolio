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
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <motion.div
        className="glass-effect rounded-3xl p-8 md:p-12 max-w-4xl w-full border border-cyan-400/20 shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Contact Me
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 * index }}
              className="glass-effect rounded-2xl p-8 border border-purple-400/20 hover:border-cyan-400/30 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-center space-x-6">
                <div className="text-cyan-400 flex-shrink-0">
                  <FontAwesomeIcon icon={info.icon} size="xl" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-200 mb-3 text-lg">{info.label}</p>
                  {info.link ? (
                    <a
                      href={info.link}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 break-words"
                      target={info.label !== "Address" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-gray-400 break-words">{info.value}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
