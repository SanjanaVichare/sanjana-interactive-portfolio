import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";

/* ─── Design tokens ─── */
const C = {
  pageBg: "#F7F4D5",
  cardBg: "#FFFFFF",
  border: "rgba(10,51,35,0.15)",
  primaryText: "#0A3323",
  secondaryText: "#839958",
  accent: "#105666",
  highlight: "#D3968C",
};

/* ─── Fade-up variant ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── Interactive card ─── */
function Card({
  index,
  icon,
  title,
  subtitle,
  body,
  chips,
  accentColor,
}: {
  index: number;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  body?: string;
  chips: string[];
  accentColor: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  /* Mouse-glow position */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const gx = useSpring(mx, { stiffness: 180, damping: 24 });
  const gy = useSpring(my, { stiffness: 180, damping: 24 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      mx.set(e.clientX - rect.left);
      my.set(e.clientY - rect.top);
    },
    [mx, my]
  );

  /* 3-D tilt */
  const rotX = useTransform(gy, [0, 320], [4, -4]);
  const rotY = useTransform(gx, [0, 480], [-4, 4]);

  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      custom={index}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        rotateX: hovered ? rotX : 0,
        rotateY: hovered ? rotY : 0,
        transformPerspective: 900,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="relative rounded-2xl overflow-hidden cursor-default"
      whileHover={{ y: -6 }}
    >
      {/* Ambient glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(260px circle at ${gx}px ${gy}px, rgba(131,153,88,0.13) 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s",
          zIndex: 0,
        }}
      />

      {/* Card shell */}
      <div
        className="relative z-10 p-8 h-full flex flex-col gap-5"
        style={{
          background: C.pageBg,
          border: `1px solid ${hovered ? C.secondaryText : C.border}`,
          borderRadius: "1rem",
          boxShadow: hovered
            ? `0 18px 48px rgba(10,51,35,0.16), 0 4px 12px rgba(10,51,35,0.08)`
            : `0 8px 24px rgba(10,51,35,0.07)`,
          transition: "border-color 0.3s, box-shadow 0.4s",
        }}
      >
        {/* Icon row */}
        <div className="flex items-start gap-4">
          <motion.span
            className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: accentColor }}
            whileHover={{ scale: 1.12, rotate: 6 }}
            transition={{ type: "spring", stiffness: 380, damping: 18 }}
          >
            <span style={{ color: C.pageBg }}>{icon}</span>
          </motion.span>

          <div className="pt-0.5">
            <h3
              className="font-bold text-xl leading-snug"
              style={{
                color: C.primaryText,
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              {title}
            </h3>
            {subtitle && (
              <p
                className="text-sm mt-0.5"
                style={{ color: C.secondaryText, fontFamily: "inherit" }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Body */}
        {body && (
          <p
            className="text-[0.93rem] leading-relaxed"
            style={{ color: C.accent, opacity: 0.82 }}
          >
            {body}
          </p>
        )}

        {/* Chips */}
        <div className="flex flex-wrap gap-2 mt-auto pt-1">
          {chips.map((chip, ci) => (
            <motion.span
              key={chip}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + ci * 0.04 + 0.3, duration: 0.3 }}
              whileHover={{ scale: 1.08, backgroundColor: C.primaryText }}
              style={{
                background: C.accent,
                color: C.pageBg,
                borderRadius: "999px",
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.03em",
                padding: "4px 12px",
                display: "inline-block",
                cursor: "default",
                transition: "background 0.2s",
              }}
            >
              {chip}
            </motion.span>
          ))}
        </div>

        {/* Bottom accent bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[3px] rounded-b-2xl"
          style={{ background: `linear-gradient(90deg, ${accentColor}, ${C.highlight})` }}
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 + 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  );
}

/* ─── Section ─── */
const ExperienceSection = () => {
  return (
    <section
      className="w-full min-h-screen flex flex-col items-center justify-center px-6 py-20"
      style={{ background: C.pageBg }}
    >
      {/* Section heading */}
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p
          className="text-xs tracking-[0.22em] uppercase mb-3 font-semibold"
          style={{ color: C.secondaryText }}
        >
          Background
        </p>
        <h2
          className="text-4xl sm:text-5xl font-bold"
          style={{
            color: C.primaryText,
            fontFamily: "'Playfair Display', Georgia, serif",
          }}
        >
          Experience &amp; Education
        </h2>
        {/* decorative underline */}
        <motion.div
          className="mx-auto mt-4 h-[2px] rounded-full"
          style={{ background: `linear-gradient(90deg, ${C.accent}, ${C.highlight})` }}
          initial={{ width: 0 }}
          whileInView={{ width: "72px" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>

      {/* Cards grid */}
      <div
        className="w-full max-w-4xl grid gap-7"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
      >
        <Card
          index={0}
          accentColor={C.accent}
          icon={<Briefcase size={20} />}
          title="Freelance Developer"
          body="Worked as part of a development team building mobile and web applications with features like employee management systems, real-time tracking, and database-driven platforms."
          chips={["Flutter Apps", "Backend APIs", "Database Management", "UI Design", "Application Logic"]}
        />

        <Card
          index={1}
          accentColor={C.highlight}
          icon={<GraduationCap size={20} />}
          title="Computer Engineering"
          subtitle="Bachelor's Degree — Currently Pursuing"
          chips={["Software Development", "Artificial Intelligence", "Mobile App Development"]}
        />
      </div>

      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap');`}</style>
    </section>
  );
};

export default ExperienceSection;