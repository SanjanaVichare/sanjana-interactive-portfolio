import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

import projectAiSign from "@/assets/project-ai-sign.jpg";
import projectSvEnterprises from "@/assets/project-sv-enterprises.jpg";
import projectAlienEscape from "@/assets/project-alien-escape.jpg";
import projectHashdrop from "@/assets/project-hashdrop.jpg";
import projectFinance from "@/assets/project-finance.jpg";
import projectDressmeup from "@/assets/project-dressmeup.jpg";

const projects = [
  {
    title: "AI Sign Language",
    description: "An AI-powered system designed to recognize sign language gestures and convert them into text or speech for real-time accessibility.",
    tech: ["Python", "Computer Vision", "NLP"],
    image: projectAiSign,
  },
  {
    title: "SV Enterprises App",
    description: "Mobile application for managing employees and vehicle records with admin dashboard, Excel uploads, and location tracking.",
    tech: ["Flutter", "SQLite", "Flask API"],
    image: projectSvEnterprises,
  },
  {
    title: "HashDrop",
    description: "A secure document sharing platform with two-step verification and controlled file modification.",
    tech: ["Flask", "MongoDB", "JavaScript"],
    image: projectHashdrop,
  },
  {
    title: "Finance Manager",
    description: "Web application for managing employee salary records and generating employee ID cards for a finance company.",
    tech: ["Flask", "HTML/CSS", "JavaScript"],
    image: projectFinance,
  },
  {
    title: "Alien Escape",
    description: "A side-scrolling mobile game where a cartoon alien escapes a sci-fi lab, avoiding obstacles and collecting coins.",
    tech: ["Flutter", "Flame Engine", "Dart"],
    image: projectAlienEscape,
  },
  {
    title: "Dress Me Up",
    description: "A fun desktop application where users dress up characters with various clothing and accessories.",
    tech: ["Python", "Tkinter", "Pillow"],
    image: projectDressmeup,
  },
];

const ProjectsSection = () => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl sm:text-5xl font-display mb-4">Selected Works</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          A collection of projects spanning AI, mobile apps, games, and web platforms.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -6 }}
            className="rounded-xl border border-border/50 bg-background/50 overflow-hidden group cursor-pointer"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300 flex items-center justify-center">
                <ExternalLink className="text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={24} />
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-display text-xl mb-2">{project.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span key={t} className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;
