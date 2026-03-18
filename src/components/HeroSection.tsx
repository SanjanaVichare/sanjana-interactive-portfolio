/**
 * HeroSection.tsx
 * Sanjana Vichare · Portfolio
 * COLOR SCHEME: Lotus pond palette
 *   #0A3323  Dark green   — primary text
 *   #839958  Moss green   — secondary text
 *   #F7F4D5  Beige        — card backgrounds
 *   #D3968C  Rosy brown   — accents
 *   #105666  Midnight green — highlights
 */

import { motion, animate, useMotionValue, useSpring } from "framer-motion";
import { Github, Linkedin, Download, ArrowDown } from "lucide-react";
import { Suspense, useRef, useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  pageBg: "#F7F4D5",
  border: "rgba(10,51,35,0.15)",
  primaryText: "#0A3323",
  secondaryText: "#839958",
  accent: "#105666",
  highlight: "#D3968C",
};

const pill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "13px 26px",
  borderRadius: "999px",
  fontSize: "0.88rem",
  fontWeight: 700,
  letterSpacing: "0.04em",
  fontFamily: "'DM Sans', sans-serif",
  textDecoration: "none",
  cursor: "pointer",
  transition:
    "background 0.25s, color 0.25s, border-color 0.25s, box-shadow 0.3s",
  border: "none",
  outline: "none",
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.55, ease: EASE_OUT_EXPO },
});

// ─────────────────────────────────────────────────────────────────────────────
// Magnet hook
// ─────────────────────────────────────────────────────────────────────────────

function useMagnet(strength = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 280, damping: 20 });
  const y = useSpring(my, { stiffness: 280, damping: 20 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      mx.set((e.clientX - (rect.left + rect.width / 2)) * strength);
      my.set((e.clientY - (rect.top + rect.height / 2)) * strength);
    },
    [mx, my, strength]
  );

  const onMouseLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return { ref, x, y, onMouseMove, onMouseLeave };
}

// ─────────────────────────────────────────────────────────────────────────────
// MagnetWrap
// ─────────────────────────────────────────────────────────────────────────────

function MagnetWrap({ children }: { children: React.ReactNode }) {
  const { ref, x, y, onMouseMove, onMouseLeave } = useMagnet(0.3);
  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: "inline-block" }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Icon (pop + rotate on hover)
// ─────────────────────────────────────────────────────────────────────────────

function Icon({ children, hov }: { children: React.ReactNode; hov: boolean }) {
  return (
    <motion.span
      animate={{ rotate: hov ? 8 : 0, scale: hov ? 1.15 : 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 18 }}
      style={{ display: "flex" }}
    >
      {children}
    </motion.span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HeroSection
// ─────────────────────────────────────────────────────────────────────────────

const HeroSection = () => {
  // Bobbing avatar
  const bobRef = useRef<ReturnType<typeof animate> | null>(null);
  const [bobY, setBobY] = useState(0);

  useEffect(() => {
    const ctrl = animate(0, 1, {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
      onUpdate: (t) => {
        const phase = t <= 0.5 ? t * 2 : (1 - t) * 2;
        setBobY(-10 + phase * 20);
      },
    });
    bobRef.current = ctrl;
    return () => {
      bobRef.current?.stop();
    };
  }, []);

  // Button hover states
  const [hovView, setHovView] = useState(false);
  const [hovGH, setHovGH] = useState(false);
  const [hovLI, setHovLI] = useState(false);
  const [hovDL, setHovDL] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: C.pageBg,
      }}
    >
      {/* Radial background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: `
            radial-gradient(circle at 70% 50%, rgba(16,86,102,0.12), transparent 60%),
            radial-gradient(circle at 40% 60%, rgba(211,150,140,0.15), transparent 70%)
          `,
        }}
      />

      {/* Content grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "1280px",
          padding: "0 clamp(1.5rem, 4vw, 3rem)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(2rem, 5vw, 6rem)",
            alignItems: "center",
          }}
        >
          {/* ── Left: text ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            <motion.p
              {...fadeUp(0.15)}
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: C.secondaryText,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Mobile Developer • Flutter • Game Dev
            </motion.p>

            <motion.h1
              {...fadeUp(0.28)}
              style={{
                fontSize: "clamp(3rem, 6vw, 5rem)",
                fontWeight: 700,
                lineHeight: 1.08,
                color: C.primaryText,
                fontFamily: "'Playfair Display', Georgia, serif",
                margin: 0,
              }}
            >
              Sanjana
              <br />
              Vichare
            </motion.h1>

            <motion.p
              {...fadeUp(0.46)}
              style={{
                fontSize: "1.05rem",
                color: C.accent,
                opacity: 0.82,
                maxWidth: "480px",
                lineHeight: 1.75,
                fontFamily: "'DM Sans', sans-serif",
                textAlign: "justify",
              }}
            >
              I&apos;m a college student and developer passionate about crafting
              interactive, human-centred technology — from Flutter mobile apps and
              full-stack systems to experimental game projects. I love turning ideas
              into polished, living software.
            </motion.p>

            {/* ── Magnetic buttons ── */}
            <motion.div
              {...fadeUp(0.56)}
              style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", paddingTop: "0.25rem" }}
            >
              {/* View Projects */}
              <MagnetWrap>
                <motion.button
                  onMouseEnter={() => setHovView(true)}
                  onMouseLeave={() => setHovView(false)}
                  onClick={() =>
                    document
                      .getElementById("projects")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  whileTap={{ scale: 0.95 }}
                  style={{
                    ...pill,
                    background: hovView ? C.primaryText : C.accent,
                    color: C.pageBg,
                    boxShadow: hovView
                      ? "0 14px 36px rgba(10,51,35,0.24)"
                      : "0 6px 18px rgba(10,51,35,0.14)",
                  }}
                >
                  <Icon hov={hovView}>
                    <ArrowDown size={16} />
                  </Icon>
                  View Projects
                </motion.button>
              </MagnetWrap>

              {/* GitHub */}
              <MagnetWrap>
                <motion.a
                  href="https://github.com/SanjanaVichare"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHovGH(true)}
                  onMouseLeave={() => setHovGH(false)}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    ...pill,
                    border: `1.5px solid ${hovGH ? C.accent : C.border}`,
                    background: hovGH ? "rgba(16,86,102,0.07)" : "transparent",
                    color: C.accent,
                  }}
                >
                  <Icon hov={hovGH}>
                    <Github size={16} />
                  </Icon>
                  GitHub
                </motion.a>
              </MagnetWrap>

              {/* LinkedIn */}
              <MagnetWrap>
                <motion.a
                  href="https://www.linkedin.com/in/sanjana-vichare"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHovLI(true)}
                  onMouseLeave={() => setHovLI(false)}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    ...pill,
                    background: hovLI ? "rgba(131,153,88,0.12)" : "transparent",
                    color: hovLI ? C.primaryText : C.secondaryText,
                    border: "1.5px solid transparent",
                  }}
                >
                  <Icon hov={hovLI}>
                    <Linkedin size={16} />
                  </Icon>
                  LinkedIn
                </motion.a>
              </MagnetWrap>

              {/* Resume */}
              <MagnetWrap>
                <motion.button
                  onMouseEnter={() => setHovDL(true)}
                  onMouseLeave={() => setHovDL(false)}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    ...pill,
                    background: hovDL ? "rgba(131,153,88,0.12)" : "transparent",
                    color: hovDL ? C.primaryText : C.secondaryText,
                    border: "1.5px solid transparent",
                  }}
                >
                  <Icon hov={hovDL}>
                    <Download size={16} />
                  </Icon>
                  Resume
                </motion.button>
              </MagnetWrap>
            </motion.div>
          </div>

          {/* ── Right: avatar / 3D slot ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: EASE_OUT_EXPO }}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              position: "relative",
              y: bobY,
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "520px",
                height: "clamp(380px, 48vh, 560px)",
              }}
            >
              <Suspense
                fallback={
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: C.accent,
                      fontSize: "13px",
                      opacity: 0.4,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Loading 3D…
                  </div>
                }
              >
                {/* Drop your 3D component here */}
              </Suspense>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;600;700&display=swap');`}</style>
    </div>
  );
};

export default HeroSection;