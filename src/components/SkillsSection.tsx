import { useState } from "react";
import { motion } from "framer-motion";
import { Code, Terminal, Smartphone, Palette } from "lucide-react";

const skillCategories = [
  {
    title: "Languages",
    icon: <Code size={16} />,
    skills: ["Python", "Dart", "JavaScript", "Kotlin", "SQL"],
    bg: "#0A3323",
    text: "#F7F4D5",
    chipStyle: { background: "rgba(247,244,213,0.14)", color: "#F7F4D5" },
    iconBg: "rgba(247,244,213,0.1)",
  },
  {
    title: "Frameworks",
    icon: <Terminal size={16} />,
    skills: ["Flutter", "Flask", "Tkinter", "SQLite", "MySQL"],
    bg: "#839958",
    text: "#0A3323",
    chipStyle: { background: "rgba(10,51,35,0.16)", color: "#0A3323" },
    iconBg: "rgba(10,51,35,0.1)",
  },
  {
    title: "Development",
    icon: <Smartphone size={16} />,
    skills: ["Mobile Apps", "Game Dev", "Backend", "API Integration", "Database", "UI/UX"],
    bg: "#F7F4D5",
    text: "#0A3323",
    chipStyle: { background: "#105666", color: "#F7F4D5" },
    iconBg: "rgba(10,51,35,0.07)",
  },
  {
    title: "Tools",
    icon: <Palette size={16} />,
    skills: ["Git", "GitHub", "VS Code", "Figma", "Excel"],
    bg: "#D3968C",
    text: "#F7F4D5",
    chipStyle: { background: "rgba(247,244,213,0.2)", color: "#F7F4D5" },
    iconBg: "rgba(247,244,213,0.18)",
  },
];

const SkillsSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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

      <div
        className="flex h-56 rounded-[18px] overflow-hidden mx-auto max-w-4xl w-full"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
        onMouseLeave={() => setActiveIndex(null)}
      >
        {skillCategories.map((category, i) => {
          const isOpen = activeIndex === i;

          return (
            <motion.div
              key={category.title}
              animate={{
                flexGrow: isOpen ? 3.5 : activeIndex !== null ? 0.6 : 1,
              }}
              initial={{ flexGrow: 1 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              onMouseEnter={() => setActiveIndex(i)}
              className="relative flex flex-col overflow-hidden cursor-default"
              style={{
                background: category.bg,
                flexShrink: 0,
                flexBasis: 0,
                minWidth: 0,
              }}
            >
              <div className="flex flex-col h-full p-5 overflow-hidden">
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 mb-3"
                  style={{ background: category.iconBg, color: category.text }}
                >
                  {category.icon}
                </div>

                {/* Title */}
                <div className="flex-1 overflow-hidden">
                  {isOpen ? (
                    <motion.span
                      key="horizontal"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                      className="font-display leading-tight block"
                      style={{ color: category.text, fontSize: "22px" }}
                    >
                      {category.title}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="vertical"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15 }}
                      className="font-display leading-none block whitespace-nowrap"
                      style={{
                        color: category.text,
                        fontSize: "17px",
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                      }}
                    >
                      {category.title}
                    </motion.span>
                  )}
                </div>

                {/* Chips — only rendered when open */}
                {isOpen && (
                  <motion.div
                    className="flex flex-wrap gap-1.5 mt-2"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.18 }}
                  >
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[11px] tracking-[0.4px] px-3 py-1 rounded-full font-mono whitespace-nowrap"
                        style={category.chipStyle}
                      >
                        {skill}
                      </span>
                    ))}
                  </motion.div>
                )}

                {/* Skill count */}
                <span
                  className="font-mono text-[10.5px] tracking-wide opacity-50 mt-auto pt-2 flex-shrink-0"
                  style={{ color: category.text }}
                >
                  {category.skills.length} skills
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillsSection;