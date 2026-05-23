import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";

const C = {
  pageBg: "#F7F4D5",
  border: "rgba(10,51,35,0.15)",
  primaryText: "#0A3323",
  secondaryText: "#839958",
  accent: "#105666",
  highlight: "#D3968C",
};

function Card({
  index,
  icon,
  title,
  subtitle,
  subtitle2,
  body,
  chips,
  accentColor,
}: {
  index: number;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  subtitle2?: string;
  body?: React.ReactNode;
  chips: string[];
  accentColor: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
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

  const rotX = useTransform(gy, [0, 320], [4, -4]);
  const rotY = useTransform(gx, [0, 480], [-4, 4]);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      custom={index}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        rotateX: hovered ? rotX : 0,
        rotateY: hovered ? rotY : 0,
        transformPerspective: 900,
        position: "relative",
        borderRadius: "1rem",
        overflow: "hidden",
        cursor: "default",
      }}
      whileHover={{ y: -6 }}
    >
      {/* Ambient glow */}
      <motion.div
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          borderRadius: "1rem",
          background: `radial-gradient(260px circle at ${gx}px ${gy}px, rgba(131,153,88,0.13) 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s",
          zIndex: 0,
        }}
      />

      {/* Card shell */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "2rem",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          background: C.pageBg,
          border: `1px solid ${hovered ? C.secondaryText : C.border}`,
          borderRadius: "1rem",
          boxShadow: hovered
            ? "0 18px 48px rgba(10,51,35,0.16), 0 4px 12px rgba(10,51,35,0.08)"
            : "0 8px 24px rgba(10,51,35,0.07)",
          transition: "border-color 0.3s, box-shadow 0.4s",
        }}
      >
        {/* Icon rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* First entry */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <motion.span
              style={{
                flexShrink: 0, width: 44, height: 44, borderRadius: "0.75rem",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: accentColor,
              }}
              whileHover={{ scale: 1.12, rotate: 6 }}
              transition={{ type: "spring", stiffness: 380, damping: 18 }}
            >
              <span style={{ color: C.pageBg }}>{icon}</span>
            </motion.span>
            <div style={{ paddingTop: "2px" }}>
              <h3 style={{
                fontWeight: 700, fontSize: "1.2rem", lineHeight: 1.3,
                color: C.primaryText, fontFamily: "'Crimson Pro', Georgia, serif",
                margin: 0,
              }}>
                {title}
              </h3>
              {subtitle && (
                <p style={{ fontSize: "0.875rem", marginTop: "2px", color: C.secondaryText, margin: 0 }}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Second entry (subtitle2) */}
          {subtitle2 && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
              <motion.span
                style={{
                  flexShrink: 0, width: 44, height: 44, borderRadius: "0.75rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: C.secondaryText,
                }}
                whileHover={{ scale: 1.12, rotate: 6 }}
                transition={{ type: "spring", stiffness: 380, damping: 18 }}
              >
                <span style={{ color: C.pageBg }}>{icon}</span>
              </motion.span>
              <div style={{ paddingTop: "2px" }}>
                <h3 style={{
                  fontWeight: 700, fontSize: "1.2rem", lineHeight: 1.3,
                  color: C.primaryText, fontFamily: "'Crimson Pro', Georgia, serif",
                  margin: 0,
                }}>
                  Diploma in Computer Engineering
                </h3>
                <p style={{ fontSize: "0.875rem", marginTop: "2px", color: C.secondaryText, margin: 0 }}>
                  {subtitle2}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        {body && (
          <div style={{ color: C.accent, opacity: 0.82, fontSize: "0.93rem", lineHeight: 1.6 }}>
            {body}
          </div>
        )}

        {/* Chips */}
        {chips.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "auto", paddingTop: "0.25rem" }}>
            {chips.map((chip, ci) => (
              <motion.span
                key={chip}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + ci * 0.04 + 0.3, duration: 0.3 }}
                whileHover={{ scale: 1.08, backgroundColor: C.primaryText }}
                style={{
                  background: C.accent, color: C.pageBg, borderRadius: "999px",
                  fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.03em",
                  padding: "4px 12px", display: "inline-block",
                  cursor: "default", transition: "background 0.2s",
                }}
              >
                {chip}
              </motion.span>
            ))}
          </div>
        )}

        {/* Bottom accent bar */}
        <motion.div
          style={{
            position: "absolute", bottom: 0, left: 0,
            height: "3px", borderRadius: "0 0 1rem 1rem",
            background: `linear-gradient(90deg, ${accentColor}, ${C.highlight})`,
          }}
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 + 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  );
}

const ExperienceSection = () => {
  return (
    <section
      id="experience-section"
      style={{
        width: "100%", minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "5rem 1.5rem", background: C.pageBg,
      }}
    >
      {/* Heading */}
      <motion.div
        style={{ textAlign: "center", marginBottom: "3.5rem" }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p style={{
          fontSize: "0.75rem", letterSpacing: "0.22em", textTransform: "uppercase",
          marginBottom: "0.75rem", fontWeight: 600, color: C.secondaryText,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Background
        </p>
        <h2 style={{
          fontSize: "clamp(2rem, 4.5vw, 3rem)", fontWeight: 700,
          color: C.primaryText, fontFamily: "'Crimson Pro', Georgia, serif",
          margin: 0,
        }}>
          Experience &amp; Education
        </h2>
        <motion.div
          style={{
            margin: "1rem auto 0",
            height: "2px", borderRadius: "999px",
            background: `linear-gradient(90deg, ${C.accent}, ${C.highlight})`,
          }}
          initial={{ width: 0 }}
          whileInView={{ width: "72px" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>

      {/* Cards */}
      <div style={{
        width: "100%", maxWidth: "56rem",
        display: "grid", gap: "1.75rem",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      }}>
        <Card
          index={0}
          accentColor={C.accent}
          icon={<Briefcase size={20} />}
          title="Freelance Developer"
          body={
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <span style={{ fontWeight: 700, color: C.primaryText }}>SV Enterprises</span>
                <span style={{ fontSize: "0.75rem", color: C.secondaryText, marginLeft: "8px" }}>Apr – Dec 2025</span>
                <p style={{ margin: "3px 0 0", fontSize: "0.88rem", opacity: 0.85 }}>Flutter mobile app for employee and vehicle management with admin dashboard and location tracking.</p>
              </div>
              <div>
                <span style={{ fontWeight: 700, color: C.primaryText }}>Hometask</span>
                <span style={{ fontSize: "0.75rem", color: C.secondaryText, marginLeft: "8px" }}>Jan 2026</span>
                <p style={{ margin: "3px 0 0", fontSize: "0.88rem", opacity: 0.85 }}>Facility management website for a cleaning operations company.</p>
              </div>
              <div>
                <span style={{ fontWeight: 700, color: C.primaryText }}>ACE</span>
                <span style={{ fontSize: "0.75rem", color: C.secondaryText, marginLeft: "8px" }}>Apr – May 2026</span>
                <p style={{ margin: "3px 0 0", fontSize: "0.88rem", opacity: 0.85 }}>Websites for a sports organization and their football club.</p>
              </div>
            </div>
          }
          chips={[]}
        />

        <Card
          index={1}
          accentColor={C.highlight}
          icon={<GraduationCap size={20} />}
          title="Computer Engineering"
          subtitle="B.E. · Datta Meghe College of Engineering — Pursuing"
          subtitle2="Vidyalankar Polytechnic · 2025"
          chips={["Software Development", "Computer Engineering"]}
        />
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,600;0,700;1,600;1,700&family=DM+Sans:wght@400;600;700&display=swap');`}</style>
    </section>
  );
};

export default ExperienceSection;