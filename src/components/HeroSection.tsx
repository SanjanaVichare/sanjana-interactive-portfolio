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

import { motion, animate } from "framer-motion";
import { Github, Linkedin, Download, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense, useRef, useState, useEffect } from "react";

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
// HeroSection
// ─────────────────────────────────────────────────────────────────────────────

const HeroSection = () => {
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
    return () => { bobRef.current?.stop(); };
  }, []);

  return (
    <div style={{
      position: "relative",
      width: "100%",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    }}>
      {/* Radial background */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(circle at 70% 50%, rgba(16,86,102,0.12), transparent 60%),
          radial-gradient(circle at 40% 60%, rgba(211,150,140,0.15), transparent 70%)
        `,
      }} />

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
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(2rem, 5vw, 6rem)",
          alignItems: "center",
        }}>
          {/* ── Left: text ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            <motion.p
              {...fadeUp(0.15)}
              className="text-sm font-medium tracking-widest uppercase text-muted-foreground"
            >
              Mobile Developer • Flutter • Game Dev
            </motion.p>

            <motion.h1
              {...fadeUp(0.28)}
              className="text-5xl sm:text-6xl lg:text-7xl font-display leading-tight"
            >
              Sanjana<br />Vichare
            </motion.h1>

            <motion.p
              {...fadeUp(0.46)}
              className="text-lg text-muted-foreground max-w-lg leading-relaxed text-justify"
            >
              I&apos;m a college student and developer passionate about crafting interactive,
              human-centred technology — from Flutter mobile apps and full-stack systems
              to experimental game projects. I love turning ideas into polished, living software.
            </motion.p>

            <motion.div
              {...fadeUp(0.56)}
              className="flex flex-wrap gap-3 pt-1"
            >
              <Button
                variant="hero"
                size="lg"
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              >
                <ArrowDown className="mr-2 h-4 w-4" />
                View Projects
              </Button>

              <Button variant="hero-outline" size="lg" asChild>
                <a href="https://github.com/SanjanaVichare" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>

              <Button variant="hero-ghost" size="lg" asChild>
                <a href="https://www.linkedin.com/in/sanjana-vichare" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </a>
              </Button>

              <Button variant="hero-ghost" size="lg">
                <Download className="mr-2 h-4 w-4" />
                Resume
              </Button>
            </motion.div>
          </div>

          {/* ── Right: avatar ── */}
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
            <div style={{
              width: "100%",
              maxWidth: "520px",
              height: "clamp(380px, 48vh, 560px)",
            }}>
              <Suspense fallback={
                <div style={{
                  width: "100%", height: "100%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#105666", fontSize: "13px", opacity: 0.4,
                }}>
                  Loading 3D…
                </div>
              }>
              </Suspense>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;