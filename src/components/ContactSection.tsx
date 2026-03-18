import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

/* ─── Design tokens ─── */
const C = {
  pageBg: "#F7F4D5",
  border: "rgba(10,51,35,0.15)",
  primaryText: "#0A3323",
  secondaryText: "#839958",
  accent: "#105666",
  highlight: "#D3968C",
};

/* ─── Magnetic button ─── */
function MagneticLink({
  href,
  icon,
  label,
  variant = "filled",
  delay = 0,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  variant?: "filled" | "outline";
  delay?: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tx = useSpring(mx, { stiffness: 260, damping: 22 });
  const ty = useSpring(my, { stiffness: 260, damping: 22 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mx.set((e.clientX - cx) * 0.28);
      my.set((e.clientY - cy) * 0.28);
    },
    [mx, my]
  );

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
    setHovered(false);
  };

  const isFilled = variant === "filled";

  return (
    <motion.a
      ref={ref}
      href={href}
      target={href.startsWith("mailto") ? undefined : "_blank"}
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        x: tx,
        y: ty,
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "13px 28px",
        borderRadius: "999px",
        fontSize: "0.88rem",
        fontWeight: 700,
        letterSpacing: "0.04em",
        fontFamily: "'DM Sans', sans-serif",
        textDecoration: "none",
        cursor: "pointer",
        border: isFilled ? "none" : `1.5px solid ${hovered ? C.accent : C.border}`,
        background: isFilled
          ? hovered
            ? C.primaryText
            : C.accent
          : hovered
            ? `rgba(16,86,102,0.07)`
            : "transparent",
        color: isFilled ? C.pageBg : C.accent,
        boxShadow: isFilled
          ? hovered
            ? `0 12px 32px rgba(10,51,35,0.22)`
            : `0 6px 18px rgba(10,51,35,0.14)`
          : "none",
        transition: "background 0.25s, color 0.25s, border-color 0.25s, box-shadow 0.3s",
      }}
      initial={{ opacity: 0, y: 20, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        animate={{ rotate: hovered ? 8 : 0, scale: hovered ? 1.15 : 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 18 }}
        style={{ display: "flex" }}
      >
        {icon}
      </motion.span>
      {label}
    </motion.a>
  );
}

/* ─── Floating decorative orb ─── */
function Orb({ style }: { style: React.CSSProperties }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ ...style, filter: "blur(48px)" }}
      animate={{ scale: [1, 1.1, 1], opacity: [0.55, 0.75, 0.55] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ─── Section ─── */
const ContactSection = () => {
  return (
    <section
      className="relative w-full flex flex-col items-center justify-center px-6 py-24 overflow-hidden"
      style={{ background: C.pageBg }}
    >
      {/* Ambient orbs */}
      <Orb
        style={{
          width: 320,
          height: 320,
          background: `radial-gradient(circle, rgba(16,86,102,0.18) 0%, transparent 70%)`,
          top: "-60px",
          left: "10%",
        }}
      />
      <Orb
        style={{
          width: 240,
          height: 240,
          background: `radial-gradient(circle, rgba(211,150,140,0.2) 0%, transparent 70%)`,
          bottom: "-40px",
          right: "12%",
          animationDelay: "2s",
        }}
      />

      {/* Heading */}
      <motion.div
        className="text-center mb-3 relative z-10"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p
          className="text-xs tracking-[0.22em] uppercase font-semibold mb-3"
          style={{ color: C.secondaryText, fontFamily: "'DM Sans', sans-serif" }}
        >
          Get in touch
        </p>
        <h2
          className="text-4xl sm:text-5xl font-bold leading-tight"
          style={{
            color: C.primaryText,
            fontFamily: "'Playfair Display', Georgia, serif",
          }}
        >
          Let's{" "}
          <span
            style={{
              background: `linear-gradient(135deg, ${C.accent} 0%, ${C.highlight} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Connect
          </span>
        </h2>
      </motion.div>

      {/* Animated underline */}
      <motion.div
        className="rounded-full mb-8 relative z-10"
        style={{
          height: "2px",
          background: `linear-gradient(90deg, ${C.accent}, ${C.highlight})`,
        }}
        initial={{ width: 0 }}
        whileInView={{ width: "72px" }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Body copy */}
      <motion.p
        className="text-base sm:text-lg text-center max-w-md mb-11 relative z-10 leading-relaxed"
        style={{
          color: C.accent,
          opacity: 0.82,
          fontFamily: "'DM Sans', sans-serif",
        }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 0.82, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        Always open to collaborating on interesting projects, exploring new ideas,
        and connecting with fellow developers.
      </motion.p>

      {/* CTA buttons */}
      <div className="flex flex-wrap justify-center gap-4 relative z-10">
        <MagneticLink
          href="https://github.com/SanjanaVichare"
          icon={<Github size={17} />}
          label="GitHub"
          variant="filled"
          delay={0.25}
        />
        <MagneticLink
          href="https://www.linkedin.com/in/sanjana-vichare"
          icon={<Linkedin size={17} />}
          label="LinkedIn"
          variant="outline"
          delay={0.33}
        />
        <MagneticLink
          href="mailto:sanjanastudys@gmail.com "
          icon={<Mail size={17} />}
          label="Say Hello"
          variant="outline"
          delay={0.41}
        />
      </div>

      {/* Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;600;700&display=swap');`}</style>
    </section>
  );
};

export default ContactSection;