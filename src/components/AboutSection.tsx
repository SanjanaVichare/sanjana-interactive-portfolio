import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Gamepad2, Brain, Palette, Database, Code } from "lucide-react";

const interests = [
  { icon: <Gamepad2 size={18} />, label: "Game Development" },
  { icon: <Brain size={18} />, label: "Artificial Intelligence" },
  { icon: <Palette size={18} />, label: "Creative UI Design" },
  { icon: <Database size={18} />, label: "Puzzle Solving" },
  { icon: <Code size={18} />, label: "Experimental Apps" },
];

const socials = [
  { icon: <Github size={18} />, href: "https://github.com/SanjanaVichare", label: "GitHub" },
  { icon: <Linkedin size={18} />, href: "https://www.linkedin.com/in/sanjana-vichare", label: "LinkedIn" },
  { icon: <Mail size={18} />, href: "mailto:contact@sanjanavichare.dev", label: "Email" },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.2, 0, 0, 1] as [number, number, number, number] },
};

const AboutSection = () => {
  return (
    <div>
      <motion.h2 {...fadeUp} className="text-4xl sm:text-5xl font-display text-center mb-12">
        About Me
      </motion.h2>

      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div {...fadeUp} className="lg:col-span-2 space-y-4">
          <p className="text-lg leading-relaxed text-muted-foreground">
            Sanjana Vichare is a developer who enjoys creating innovative digital experiences through software development, AI-based systems, and interactive applications.
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            She has experience building mobile apps, backend systems, and desktop applications. Her work often focuses on combining functionality with creativity, especially in projects related to accessibility, game development, and real-world problem solving.
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            She enjoys exploring new technologies, solving challenging problems, and building projects that make technology more engaging and useful.
          </p>
        </motion.div>

        <div className="space-y-6">
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
            <h3 className="font-display text-lg mb-4">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <span key={interest.label} className="skill-chip flex items-center gap-1.5">
                  {interest.icon}
                  {interest.label}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
            <h3 className="font-display text-lg mb-4">Connect</h3>
            <div className="flex gap-3">
              {socials.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
