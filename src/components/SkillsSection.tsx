import { motion } from "framer-motion";
import { Code, Terminal, Smartphone, Palette } from "lucide-react";

const skillCategories = [
  {
    title: "Languages",
    icon: <Code size={18} />,
    skills: ["Python", "Dart", "JavaScript", "Kotlin", "SQL"],
  },
  {
    title: "Frameworks",
    icon: <Terminal size={18} />,
    skills: ["Flutter", "Flask", "Tkinter", "SQLite", "MySQL"],
  },
  {
    title: "Development",
    icon: <Smartphone size={18} />,
    skills: ["Mobile Apps", "Game Dev", "Backend", "API Integration", "Database", "UI/UX"],
  },
  {
    title: "Tools",
    icon: <Palette size={18} />,
    skills: ["Git", "GitHub", "VS Code", "Figma", "Excel"],
  },
];

const SkillsSection = () => {
  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-4xl sm:text-5xl font-display text-center mb-12"
      >
        Technical Arsenal
      </motion.h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {skillCategories.map((category, catIndex) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: catIndex * 0.1 }}
            className="rounded-xl border border-border/50 bg-background/50 p-6 hover:shadow-elevated transition-shadow duration-300"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                {category.icon}
              </span>
              <h3 className="font-display text-lg">{category.title}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span key={skill} className="skill-chip text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;
