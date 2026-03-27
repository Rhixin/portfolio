"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faVideo,
  faLink,
  faXmark,
  faChevronLeft,
  faChevronRight,
  faExpand,
} from "@fortawesome/free-solid-svg-icons";

export type Project = {
  id: string;
  title: string;
  category: ("mobile" | "web" | "automations" | "games")[];
  description: string;
  images: string[];
  technology: string[];
  github: string;
  demo: string;
  video: string;
};

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const isMobile = project.category.includes("mobile");

  // Close on Escape, lock body scroll
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxOpen) setLightboxOpen(false);
        else onClose();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, lightboxOpen]);

  const prev = () =>
    setActiveImage((i) => (i - 1 + project.images.length) % project.images.length);
  const next = () =>
    setActiveImage((i) => (i + 1) % project.images.length);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative bg-[#0d0d14] border border-white/10 rounded-3xl w-full max-w-5xl overflow-hidden"
          style={{ maxHeight: "90vh", overflowY: "auto" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faXmark} className="text-white text-sm" />
          </button>

          <div className="flex flex-col lg:flex-row">

            {/* ── Left: image viewer ── */}
            <div className="lg:w-[55%] p-6 sm:p-8 flex flex-col gap-4 border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-transparent">

              {/* Main image */}
              <div
                className={`relative rounded-xl overflow-hidden bg-black/40 cursor-zoom-in group ${isMobile ? "mx-auto w-[60%]" : "w-full"}`}
                style={{ aspectRatio: isMobile ? "9/16" : "16/10" }}
                onClick={() => setLightboxOpen(true)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={project.images[activeImage]}
                      alt={`${project.title} screenshot ${activeImage + 1}`}
                      fill
                      className={isMobile ? "object-contain" : "object-cover"}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Expand hint */}
                <div className="absolute top-2 left-2 w-7 h-7 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <FontAwesomeIcon icon={faExpand} className="text-white text-xs" />
                </div>

                {/* Prev / Next overlays */}
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="text-white text-xs" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10"
                >
                  <FontAwesomeIcon icon={faChevronRight} className="text-white text-xs" />
                </button>

                {/* Counter badge */}
                <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 rounded-full text-xs text-gray-300 z-10">
                  {activeImage + 1} / {project.images.length}
                </div>
              </div>

              {/* Thumbnail strip — centered */}
              <div className="flex justify-center gap-2 flex-wrap">
                {project.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${isMobile ? "w-9 h-16" : "w-16 h-11"} ${
                      activeImage === i
                        ? "ring-2 ring-[#FF6B35] opacity-100 scale-105"
                        : "opacity-50 hover:opacity-80"
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* ── Right: info ── */}
            <div className="lg:w-[45%] p-6 sm:p-8 flex flex-col gap-5">

              {/* Category + title */}
              <div>
                <span className="text-xs font-semibold text-[#FF6B35] uppercase tracking-widest">
                  {project.category.join(" · ")}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 leading-tight">
                  {project.title}
                </h2>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {project.description}
              </p>

              {/* Tech stack */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2.5">
                  Tech Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technology.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-[#FF6B35]/10 text-[#FF6B35] text-xs font-medium rounded-lg border border-[#FF6B35]/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              {(project.github || project.demo || project.video) && (
                <div className="flex flex-wrap gap-3 mt-auto pt-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105"
                    >
                      <FontAwesomeIcon icon={faGithub} />
                      GitHub
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105"
                    >
                      <FontAwesomeIcon icon={faLink} />
                      Link
                    </a>
                  )}
                  {project.video && (
                    <a
                      href={project.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105"
                    >
                      <FontAwesomeIcon icon={faVideo} />
                      Video
                    </a>
                  )}
                </div>
              )}
            </div>

          </div>
        </motion.div>
      </motion.div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.95)", backdropFilter: "blur(8px)" }}
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <FontAwesomeIcon icon={faXmark} className="text-white text-sm" />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/60 hover:bg-black/80 rounded-full transition-colors z-10"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-white text-sm" />
            </button>

            {/* Image */}
            <motion.div
              key={activeImage}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full max-w-[90vw] max-h-[90vh] mx-14"
            >
              <Image
                src={project.images[activeImage]}
                alt={`${project.title} screenshot ${activeImage + 1}`}
                fill
                className="object-contain"
              />
            </motion.div>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/60 hover:bg-black/80 rounded-full transition-colors z-10"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-white text-sm" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 rounded-full text-xs text-gray-300">
              {activeImage + 1} / {project.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
