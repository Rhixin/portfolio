import { readFileSync, writeFileSync } from "fs";

const filePath = "D:/3RD YEAR/cv/portfolio/app/page.tsx";
const content = readFileSync(filePath, "utf-8");
const lines = content.split("\n");

const startIdx = lines.findIndex(l => l.includes("3D Phone Showcase Section"));
const endIdx   = lines.findIndex(l => l.includes("End of Stacking Sections Container"));
console.log(`Replacing lines ${startIdx+1}–${endIdx+1} (${endIdx-startIdx+1} lines)`);

const newSection = `      {/* Projects Section */}
      <section
        ref={(el) => { sectionsRef.current[3] = el; }}
        id="projects-section"
        className="min-h-screen py-20 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
              Projects
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl">
              A collection of things I&apos;ve built — from mobile apps and web platforms to automations and games.
            </p>
          </motion.div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-10">
            {(
              [
                { id: "mobile", label: "Mobile" },
                { id: "web", label: "Web" },
                { id: "automations", label: "Automations" },
                { id: "games", label: "Games" },
              ] as const
            ).map((cat) => {
              const count = allProjects.filter((p) => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveProjectCategory(cat.id)}
                  className={\`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-semibold text-sm transition-all duration-300 flex items-center gap-2 \${
                    activeProjectCategory === cat.id
                      ? "bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white shadow-lg shadow-[#FF6B35]/30"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                  }\`}
                >
                  {cat.label}
                  <span
                    className={\`text-xs px-1.5 py-0.5 rounded-full \${
                      activeProjectCategory === cat.id
                        ? "bg-white/20 text-white"
                        : "bg-white/10 text-gray-500"
                    }\`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Cards Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProjectCategory}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            >
              {allProjects
                .filter((p) => p.category === activeProjectCategory)
                .map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.07 }}
                    className="group flex flex-col bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-[#FF6B35]/40 hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#FF6B35]/10"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 overflow-hidden bg-black/40 flex-shrink-0">
                      <Image
                        src={project.images[0]}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    </div>

                    {/* Body */}
                    <div className="p-5 flex flex-col flex-1 gap-3">
                      <h3 className="text-white font-bold text-base sm:text-lg leading-tight group-hover:text-[#FF8C5A] transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 flex-1">
                        {project.description}
                      </p>

                      {/* Tech badges */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.technology.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 bg-[#FF6B35]/10 text-[#FF6B35] text-xs font-medium rounded-md border border-[#FF6B35]/20"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technology.length > 4 && (
                          <span className="px-2 py-0.5 bg-white/5 text-gray-500 text-xs rounded-md">
                            +{project.technology.length - 4}
                          </span>
                        )}
                      </div>

                      {/* Links */}
                      {(project.github || project.demo || project.video) && (
                        <div className="flex gap-2 pt-1">
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-all duration-200 hover:scale-105"
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
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6B35]/20 hover:bg-[#FF6B35]/30 text-[#FF8C5A] text-xs font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                            >
                              <FontAwesomeIcon icon={faLink} />
                              Demo
                            </a>
                          )}
                          {project.video && (
                            <a
                              href={project.video}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                            >
                              <FontAwesomeIcon icon={faVideo} />
                              Video
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>`;

const result = [...lines.slice(0, startIdx), newSection, ...lines.slice(endIdx + 1)].join("\n");
writeFileSync(filePath, result, "utf-8");
console.log("Done.");
