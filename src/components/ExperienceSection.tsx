import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.2, 0, 0, 1] as [number, number, number, number] },
};

const ExperienceSection = () => {
  return (
    <div>
      <motion.h2 {...fadeUp} className="text-4xl sm:text-5xl font-display text-center mb-12">
        Experience & Education
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="rounded-xl border border-border/50 bg-background/50 p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Briefcase size={20} />
            </span>
            <h3 className="font-display text-xl">Freelance Developer</h3>
          </div>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Worked as part of a development team building mobile and web applications with features like employee management systems, real-time tracking, and database-driven platforms.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Flutter Apps", "Backend APIs", "Database Management", "UI Design", "Application Logic"].map((r) => (
              <span key={r} className="skill-chip text-xs">{r}</span>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }} className="rounded-xl border border-border/50 bg-background/50 p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-secondary-foreground">
              <GraduationCap size={20} />
            </span>
            <div>
              <h3 className="font-display text-xl">Computer Engineering</h3>
              <p className="text-sm text-muted-foreground">Bachelor's Degree (Currently Pursuing)</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {["Software Development", "Artificial Intelligence", "Mobile App Development"].map((area) => (
              <span key={area} className="skill-chip text-xs">{area}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExperienceSection;
