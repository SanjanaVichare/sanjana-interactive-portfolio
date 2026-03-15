/**
 * HeroSection.tsx — Doodley Interactive Envelope Portfolio
 * Sanjana Vichare · hand-drawn doodle UI + scroll-driven envelope reveal
 *
 * Scroll stage map (700vh, sticky):
 *   Stage 1  page_load       Envelope spring-drops from top (y: -200→0, bounce)
 *   Stage 2  0.02–0.10       Envelope sketch-wobbles on first scroll
 *   Stage 3  0.28–0.44       Flap rotates open (rotateX 0→-120°)
 *   Stage 4  0.44–0.64       Letter pulls upward easeOutBack (-220px)
 *   Stage 5  0.62–0.72       Envelope fades out
 *   Stage 6  0.64–0.82       Letter resets to center (slow settle)
 *   Stage 7  0.68–0.82       Paper physics: bend, shadow, width stretch, scale expand, wiggle
 *   Stage 8  0.76–0.88       Paper bloom overlay fills screen
 *   Stage 9  0.88–0.97       Hero text draws in (staggered fade-up)
 *   Stage 10 0.95–1.00       Avatar floats in from right + continuous bob
 *
 * Paper physics:
 *   Trick 1  0.55–0.68       Paper bends (rotateX 8→0°, perspective 1200px)
 *   Trick 2  0.55–0.72       Dynamic shadow deepens as paper lifts
 *   Trick 3  0.68–0.82       Width stretches first, then scale expands
 *   Trick 4  0.55–0.70       Tiny paper wiggle rotate (-3→1°)
 *   Bonus    fold crease      SVG crease fades as paper expands
 *
 * Decorations : floating stars, arrows, sparkles, code brackets, game controller
 * Particles   : 14 doodle-star bursts on letter pull
 * Micro       : envelope hover shake, button squishy bounce, avatar wave on hover
 */

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  animate,
  AnimatePresence,
} from "framer-motion";
import { Github, Linkedin, Download, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Suspense,
  useRef,
  useState,
  useEffect,
  useCallback,
  memo,
} from "react";
import Avatar3D from "@/components/Avatar3D";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const ENVELOPE_PATHS = {
  top: "M4,4 Q160,7 320,3 Q480,0 636,4",
  right: "M636,4 Q640,65 638,130 Q637,195 636,256",
  bottom: "M636,256 Q480,253 320,257 Q160,260 4,256",
  left: "M4,256 Q2,192 3,128 Q4,64 4,4",
  foldL: "M4,256 Q158,222 320,148",
  foldR: "M636,256 Q482,220 320,148",
  foldTL: "M4,4 Q160,74 320,148",
  foldTR: "M636,4 Q482,72 320,148",
  flapL: "M4,4 Q160,56 320,160",
  flapR: "M636,4 Q482,58 320,160",
};

// ─────────────────────────────────────────────────────────────────────────────
// Particle Burst
// ─────────────────────────────────────────────────────────────────────────────

interface StarParticle {
  id: number; x: number; y: number;
  vx: number; vy: number;
  opacity: number; size: number; rotation: number; rotV: number;
}

const DoodleParticleBurst = memo(({ active }: { active: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<StarParticle[]>([]);
  const rafRef = useRef<number>(0);
  const firedRef = useRef(false);

  const drawStar = (
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    size: number, rotation: number, opacity: number
  ) => {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = "#1F3D32";
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.translate(x, y);
    ctx.rotate(rotation);
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(0, size);
      ctx.stroke();
      ctx.rotate(Math.PI / 4);
    }
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
    ctx.fillStyle = "#2F6F55";
    ctx.fill();
    ctx.restore();
  };

  const fire = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.42;

    starsRef.current = Array.from({ length: 14 }, (_, i) => {
      const angle = (i / 14) * Math.PI * 2 - Math.PI / 2;
      const speed = 2.5 + Math.random() * 3.2;
      return {
        id: i, x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        opacity: 1,
        size: 7 + Math.random() * 9,
        rotation: Math.random() * Math.PI,
        rotV: (Math.random() - 0.5) * 0.13,
      };
    });

    const tick = () => {
      const c = canvasRef.current;
      if (!c) return;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, c.width, c.height);
      starsRef.current = starsRef.current
        .map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.07,
          opacity: p.opacity - 0.016,
          rotation: p.rotation + p.rotV,
        }))
        .filter(p => p.opacity > 0);
      starsRef.current.forEach(p =>
        drawStar(ctx, p.x, p.y, p.size, p.rotation, p.opacity)
      );
      if (starsRef.current.length > 0)
        rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (active && !firedRef.current) { firedRef.current = true; fire(); }
    if (!active) {
      firedRef.current = false;
      cancelAnimationFrame(rafRef.current);
      starsRef.current = [];
      const c = canvasRef.current;
      c?.getContext("2d")?.clearRect(0, 0, c.width, c.height);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, fire]);

  return (
    <canvas
      ref={canvasRef} width={900} height={500}
      style={{
        position: "absolute", inset: 0, margin: "auto",
        pointerEvents: "none", zIndex: 25,
        top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 900, height: 500,
      }}
    />
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Background Doodles
// ─────────────────────────────────────────────────────────────────────────────

const BG_DOODLES = [
  { type: "star", x: "8%", y: "12%", delay: 0, dur: 4.2, rot: 15 },
  { type: "star", x: "88%", y: "18%", delay: 1.1, dur: 3.8, rot: -20 },
  { type: "star", x: "15%", y: "78%", delay: 0.6, dur: 5.0, rot: 8 },
  { type: "star", x: "82%", y: "72%", delay: 1.7, dur: 4.5, rot: -12 },
  { type: "star", x: "50%", y: "8%", delay: 2.3, dur: 3.5, rot: 30 },
  { type: "arrow", x: "72%", y: "42%", delay: 0.4, dur: 4.8, rot: -35 },
  { type: "arrow", x: "22%", y: "55%", delay: 1.9, dur: 5.2, rot: 20 },
  { type: "sparkle", x: "92%", y: "50%", delay: 0.8, dur: 4.0, rot: 0 },
  { type: "sparkle", x: "6%", y: "45%", delay: 2.1, dur: 3.6, rot: 45 },
  { type: "sparkle", x: "55%", y: "90%", delay: 0.3, dur: 4.4, rot: -15 },
  { type: "code", x: "10%", y: "30%", delay: 1.4, dur: 5.5, rot: 0 },
  { type: "code", x: "85%", y: "85%", delay: 0.9, dur: 4.9, rot: -8 },
];

const DoodleStar = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <line x1="10" y1="1" x2="10" y2="19" stroke="#1F3D32" strokeWidth="2" strokeLinecap="round" />
    <line x1="1" y1="10" x2="19" y2="10" stroke="#1F3D32" strokeWidth="2" strokeLinecap="round" />
    <line x1="3.5" y1="3.5" x2="16.5" y2="16.5" stroke="#1F3D32" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="16.5" y1="3.5" x2="3.5" y2="16.5" stroke="#1F3D32" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="10" cy="10" r="1.5" fill="#2F6F55" />
  </svg>
);

const DoodleArrow = () => (
  <svg width="36" height="28" viewBox="0 0 36 28" fill="none">
    <path d="M2,14 Q10,11 22,13 Q28,14 32,10" stroke="#1F3D32" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M27,6 Q32,10 28,15" stroke="#1F3D32" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

const DoodleSparkle = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M11,2 Q11.5,11 11,20" stroke="#2F6F55" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M2,11 Q11,11.5 20,11" stroke="#2F6F55" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M4.5,4.5 Q11,11 17.5,17.5" stroke="#A8C9B6" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M17.5,4.5 Q11,11 4.5,17.5" stroke="#A8C9B6" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="11" cy="11" r="2" fill="#2F6F55" />
  </svg>
);

const DoodleCode = () => (
  <svg width="36" height="20" viewBox="0 0 36 20" fill="none">
    <path d="M10,4 Q5,10 10,16" stroke="#1F3D32" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M26,4 Q31,10 26,16" stroke="#1F3D32" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M15,2 Q17,10 15,18" stroke="#A8C9B6" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M21,2 Q19,10 21,18" stroke="#A8C9B6" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

const BackgroundDoodles = memo(({ visible }: { visible: boolean }) => (
  <AnimatePresence>
    {visible && (
      <>
        {BG_DOODLES.map((d, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{
              opacity: [0, 0.55, 0.45, 0.55],
              scale: 1,
              y: [0, -8, 0, -5, 0],
              rotate: [d.rot, d.rot + 5, d.rot - 3, d.rot],
            }}
            transition={{
              opacity: { delay: d.delay + 0.3, duration: 0.6 },
              scale: { delay: d.delay + 0.3, duration: 0.5, type: "spring", stiffness: 200 },
              y: { delay: d.delay, duration: d.dur, repeat: Infinity, ease: "easeInOut" },
              rotate: { delay: d.delay, duration: d.dur * 1.3, repeat: Infinity, ease: "easeInOut" },
            }}
            style={{
              position: "absolute",
              left: d.x, top: d.y,
              pointerEvents: "none", zIndex: 1,
            }}
          >
            {d.type === "star" && <DoodleStar size={16} />}
            {d.type === "arrow" && <DoodleArrow />}
            {d.type === "sparkle" && <DoodleSparkle />}
            {d.type === "code" && <DoodleCode />}
          </motion.div>
        ))}
      </>
    )}
  </AnimatePresence>
));

// ─────────────────────────────────────────────────────────────────────────────
// Envelope SVGs
// ─────────────────────────────────────────────────────────────────────────────

const DoodleEnvelopeBody = () => (
  <svg viewBox="0 0 640 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", display: "block" }}>
    <path d="M8,8 Q320,5 632,8 Q636,130 632,252 Q320,256 8,252 Q4,130 8,8Z" fill="#E9F2EC" />
    <path d={ENVELOPE_PATHS.top} stroke="#1F3D32" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d={ENVELOPE_PATHS.right} stroke="#1F3D32" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d={ENVELOPE_PATHS.bottom} stroke="#1F3D32" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d={ENVELOPE_PATHS.left} stroke="#1F3D32" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d={ENVELOPE_PATHS.foldL} stroke="#A8C9B6" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="5 4" fill="none" opacity="0.7" />
    <path d={ENVELOPE_PATHS.foldR} stroke="#A8C9B6" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="5 4" fill="none" opacity="0.7" />
    <path d={ENVELOPE_PATHS.foldTL} stroke="#CFE0D8" strokeWidth="1" strokeLinecap="round" strokeDasharray="4 5" fill="none" opacity="0.5" />
    <path d={ENVELOPE_PATHS.foldTR} stroke="#CFE0D8" strokeWidth="1" strokeLinecap="round" strokeDasharray="4 5" fill="none" opacity="0.5" />
    {/* Wax seal */}
    <circle cx="320" cy="148" r="22" fill="#E9F2EC" stroke="#1F3D32" strokeWidth="2.2" />
    <circle cx="320" cy="148" r="13" fill="#2F6F55" opacity="0.18" stroke="#2F6F55" strokeWidth="1.5" />
    <path d="M313,141 Q320,148 327,155" stroke="#1F3D32" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M327,141 Q320,148 313,155" stroke="#1F3D32" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M12,258 Q320,262 632,258 Q634,264 320,268 Q6,264 12,258Z" fill="#1F3D32" opacity="0.07" />
  </svg>
);

const DoodleFlapSVG = () => (
  <svg viewBox="0 0 640 165" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", display: "block" }}>
    <path d="M6,2 Q320,0 634,2 L320,160 Z" fill="#DDE8E2" />
    <path d={ENVELOPE_PATHS.flapL} stroke="#1F3D32" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <path d={ENVELOPE_PATHS.flapR} stroke="#1F3D32" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <path d="M4,2 Q320,0 636,2" stroke="#1F3D32" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <path d="M80,2 Q200,56 320,160" stroke="#A8C9B6" strokeWidth="0.8" strokeLinecap="round" strokeDasharray="4 5" fill="none" opacity="0.5" />
    <path d="M560,2 Q440,56 320,160" stroke="#A8C9B6" strokeWidth="0.8" strokeLinecap="round" strokeDasharray="4 5" fill="none" opacity="0.5" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// Letter Preview
// ─────────────────────────────────────────────────────────────────────────────

const DoodleLetterPreview = ({ creaseOpacity = 0 }: { creaseOpacity?: number }) => (
  <div style={{
    width: "100%", height: "100%",
    background: "#F5FAF7",
    borderRadius: "6px",
    border: "2.5px solid #1F3D32",
    padding: "24px 28px",
    boxSizing: "border-box",
    display: "flex", flexDirection: "column", gap: "11px",
    position: "relative",
    boxShadow: "4px 4px 0px #1F3D32",
  }}>
    {/* Torn paper edge */}
    <svg viewBox="0 0 300 10" style={{ position: "absolute", top: -2, left: 0, width: "100%", pointerEvents: "none" }}>
      <path
        d="M0,5 Q20,2 40,6 Q60,9 80,4 Q100,1 120,7 Q140,10 160,4 Q180,0 200,6 Q220,9 240,3 Q260,0 280,5 Q290,7 300,4"
        stroke="#1F3D32" strokeWidth="2.5" fill="none" strokeLinecap="round"
      />
    </svg>

    {/*
      Bonus — paper fold crease line.
      Appears during the pull stage, fades to 0 as the paper fully expands.
      Simulates a horizontal fold crease from being inside the envelope.
    */}
    {creaseOpacity > 0.01 && (
      <svg
        viewBox="0 0 400 6"
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: "100%",
          opacity: creaseOpacity,
          pointerEvents: "none",
          zIndex: 2,
          transform: "translateY(-50%)",
        }}
      >
        <path
          d="M4,3 Q60,1 120,3.5 Q180,5 240,2.5 Q300,1 360,3.5 Q385,4.5 400,3"
          stroke="#A8C9B6"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="6 5"
          fill="none"
        />
      </svg>
    )}

    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <DoodleStar size={12} />
      <span style={{ fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#2F6F55", fontWeight: 700 }}>
        Portfolio · 2025
      </span>
    </div>

    <div style={{ fontSize: "9px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#2F6F55", fontWeight: 600, opacity: 0.85 }}>
      Mobile Developer · Flutter · Game Dev
    </div>

    <div style={{
      fontSize: "30px", fontWeight: 800, color: "#1F3D32",
      lineHeight: 1.08,
      fontFamily: "'Caveat', 'Patrick Hand', cursive, Georgia, serif",
      letterSpacing: "0.5px",
    }}>
      Sanjana<br />Vichare
    </div>

    <svg viewBox="0 0 140 8" style={{ width: "140px", height: "8px" }}>
      <path d="M2,5 Q35,2 70,5 Q105,8 138,4" stroke="#2F6F55" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>

    <div style={{ fontSize: "10px", color: "#2F6F55", opacity: 0.7, lineHeight: 1.6 }}>
      Building creative &amp; interactive<br />technology that people love ✦
    </div>

    <div style={{ display: "flex", gap: "6px", marginTop: "2px" }}>
      {(["#2F6F55", "#A8C9B6", "#CFE0D8"] as const).map((c, i) => (
        <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: c, border: "1.5px solid #1F3D32" }} />
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Doodle Button Wrapper
// ─────────────────────────────────────────────────────────────────────────────

const DoodleButtonWrap = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    whileHover={{ scale: 1.08, rotate: -1.5, y: -3 }}
    whileTap={{ scale: 0.93, rotate: 1 }}
    transition={{ type: "spring", stiffness: 420, damping: 14 }}
    style={{ display: "inline-block" }}
  >
    {children}
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Game Controller
// ─────────────────────────────────────────────────────────────────────────────

const DoodleController = ({ visible }: { visible: boolean }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 24, rotate: -12 }}
        animate={{ opacity: 0.6, y: 0, rotate: -10 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.2 }}
        whileHover={{ rotate: 12, opacity: 1, scale: 1.12, transition: { type: "spring", stiffness: 300, damping: 12 } }}
        style={{
          position: "absolute",
          bottom: "clamp(1.5rem, 4vh, 3.5rem)",
          right: "clamp(1rem, 3vw, 3rem)",
          zIndex: 9, cursor: "default",
        }}
      >
        <svg width="58" height="40" viewBox="0 0 58 40" fill="none">
          <path d="M6,14 Q2,20 4,28 Q6,36 14,37 Q20,38 24,32 Q26,28 29,28 Q32,28 34,32 Q38,38 44,37 Q52,36 54,28 Q56,20 52,14 Q46,6 38,8 Q34,10 29,10 Q24,10 20,8 Q12,6 6,14Z"
            fill="#E9F2EC" stroke="#1F3D32" strokeWidth="2.2" strokeLinejoin="round" />
          <rect x="11" y="18" width="4" height="10" rx="1" fill="#A8C9B6" stroke="#1F3D32" strokeWidth="1.5" />
          <rect x="8" y="21" width="10" height="4" rx="1" fill="#A8C9B6" stroke="#1F3D32" strokeWidth="1.5" />
          <circle cx="42" cy="20" r="2.5" fill="#2F6F55" stroke="#1F3D32" strokeWidth="1.5" />
          <circle cx="47" cy="25" r="2.5" fill="#A8C9B6" stroke="#1F3D32" strokeWidth="1.5" />
          <circle cx="42" cy="30" r="2.5" fill="#CFE0D8" stroke="#1F3D32" strokeWidth="1.5" />
          <circle cx="37" cy="25" r="2.5" fill="#E9F2EC" stroke="#1F3D32" strokeWidth="1.5" />
          <rect x="24" y="21" width="5" height="3" rx="1.5" fill="#A8C9B6" stroke="#1F3D32" strokeWidth="1.2" />
          <path d="M8,38 Q29,42 50,38" stroke="#1F3D32" strokeWidth="1.5" strokeLinecap="round" opacity="0.15" />
        </svg>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─────────────────────────────────────────────────────────────────────────────
// Pointing Arrow
// ─────────────────────────────────────────────────────────────────────────────

const PointingArrow = ({ visible }: { visible: boolean }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 0.7, x: 0 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={{ position: "absolute", right: "calc(50% - 20px)", top: "38%", zIndex: 8, pointerEvents: "none" }}
      >
        <svg width="60" height="30" viewBox="0 0 60 30" fill="none">
          <path d="M4,15 Q20,10 40,14 Q50,15 54,10" stroke="#2F6F55" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M48,6 Q54,10 50,16" stroke="#2F6F55" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
        <div style={{
          fontSize: "9px", color: "#2F6F55", fontWeight: 600,
          letterSpacing: "0.1em", textTransform: "uppercase",
          fontFamily: "'Caveat', cursive, sans-serif",
          opacity: 0.8, marginTop: "2px", textAlign: "center",
        }}>
          that&apos;s me!
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main HeroSection
// ─────────────────────────────────────────────────────────────────────────────

const HeroSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  // ─────────────────────────────────────────────────────────────────────
  // All scroll-driven MotionValues — driven directly into motion.div style,
  // NO useState subscribers. Springs added on key values for smoothness.
  // ─────────────────────────────────────────────────────────────────────

  // ── Flap (0.28–0.44) ──
  const flapRotate = useTransform(scrollYProgress, [0.28, 0.44], [0, -120]);
  const flapRotateSp = useSpring(flapRotate, { stiffness: 80, damping: 18 });

  // ── Letter opacity: fades in as it emerges (0.44–0.56) ──
  const letterOpacity = useTransform(scrollYProgress, [0.44, 0.56], [0, 1]);

  // ── Letter pull Y: eased via spring so motion is silky (0.44–0.64) ──
  // Raw 0→1, converted to px in the MotionValue chain via useTransform
  const letterPullRaw = useTransform(scrollYProgress, [0.44, 0.64], [0, 1]);
  const letterPullPx = useTransform(letterPullRaw, [0, 1], [0, -220], {
    ease: (t) => {
      // easeOutBack inline
      const c1 = 1.70158, c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
  });

  // ── Settle Y: after pull, letter floats down to center (0.64–0.82) ──
  // Multiplier goes 1→0, so composedY = pullPx * multiplier → 0
  const settleMult = useTransform(scrollYProgress, [0.64, 0.82], [1, 0]);
  const settleMultSp = useSpring(settleMult, { stiffness: 40, damping: 18 });

  // ── Envelope exit (0.60–0.70) ──
  const envExit = useTransform(scrollYProgress, [0.60, 0.70], [1, 0]);
  const envExitScale = useTransform(scrollYProgress, [0.60, 0.70], [1, 0.88]);

  // ── Letter fill: numeric scale drives expansion (0.78–0.90) ──
  // We scale the letter card up rather than animating width/height strings
  const letterFillSc = useTransform(scrollYProgress, [0.78, 0.90], [1, 14]);
  const letterFillScSp = useSpring(letterFillSc, { stiffness: 50, damping: 20 });
  const letterFillR = useTransform(scrollYProgress, [0.78, 0.87], [8, 0]);
  const letterFillOp = useTransform(scrollYProgress, [0.85, 0.93], [1, 0]);

  // ── Paper physics during pull ──
  const paperWiggle = useTransform(scrollYProgress, [0.50, 0.68], [-2.5, 1]);
  const paperBendX = useTransform(scrollYProgress, [0.50, 0.68], [6, 0]);
  const creaseOp = useTransform(scrollYProgress, [0.50, 0.76], [0.5, 0]);

  // ── Hero text: staggered fade-up (0.90–0.98) ──
  const heroOpacity = useTransform(scrollYProgress, [0.90, 0.97], [0, 1]);
  const heroScale = useTransform(scrollYProgress, [0.90, 0.97], [0.96, 1.0]);
  const subtitleOp = useTransform(scrollYProgress, [0.90, 0.94], [0, 1]);
  const subtitleY = useTransform(scrollYProgress, [0.90, 0.94], [16, 0]);
  const titleOp = useTransform(scrollYProgress, [0.91, 0.96], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.91, 0.96], [28, 0]);
  const descOp = useTransform(scrollYProgress, [0.93, 0.97], [0, 1]);
  const descY = useTransform(scrollYProgress, [0.93, 0.97], [16, 0]);
  const btnsOp = useTransform(scrollYProgress, [0.94, 0.98], [0, 1]);
  const btnsY = useTransform(scrollYProgress, [0.94, 0.98], [12, 0]);

  // ── Avatar (0.96–1.00) ──
  const avatarOp = useTransform(scrollYProgress, [0.96, 1.00], [0, 1]);
  const avatarX = useTransform(scrollYProgress, [0.96, 1.00], [60, 0]);
  const avatarScale = useTransform(scrollYProgress, [0.96, 1.00], [0.85, 1]);
  const avatarXSp = useSpring(avatarX, { stiffness: 68, damping: 15 });
  const avatarScSp = useSpring(avatarScale, { stiffness: 68, damping: 15 });

  // ── Minimal state — only for side-effects, NOT for driving styles ──
  const [flapVal, setFlapVal] = useState(0);   // z-index toggle only
  const [envExitVal, setEnvExitVal] = useState(1);   // showEnvelope gate
  const [letterOpVal, setLetterOpVal] = useState(0);   // showLetter gate
  const [heroOpVal, setHeroOpVal] = useState(0);   // showHero gate
  const [avatarOpVal, setAvatarOpVal] = useState(0);   // avatar bob gate
  const [particleActive, setParticles] = useState(false);
  const [showController, setController] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const [wobbling, setWobbling] = useState(false);
  const [bobY, setBobY] = useState(0);
  const bobRef = useRef<ReturnType<typeof animate> | null>(null);
  const wobbleRef = useRef(false);

  useEffect(() => {
    const unsubs = [
      flapRotate.on("change", setFlapVal),
      envExit.on("change", setEnvExitVal),
      letterOpacity.on("change", setLetterOpVal),
      heroOpacity.on("change", setHeroOpVal),

      letterOpacity.on("change", (v) => {
        if (v > 0.25 && v < 0.95) setParticles(true);
        else if (v <= 0.05) setParticles(false);
      }),

      scrollYProgress.on("change", (v) => {
        if (v > 0.02 && v < 0.10 && !wobbleRef.current) {
          wobbleRef.current = true;
          setWobbling(true);
          setTimeout(() => setWobbling(false), 700);
        }
        if (v < 0.015) wobbleRef.current = false;
      }),

      avatarOp.on("change", (v) => {
        setAvatarOpVal(v);
        if (v > 0.5) { setController(true); setShowArrow(true); }
        else { setController(false); setShowArrow(false); }
        if (v >= 0.85 && !bobRef.current) {
          const ctrl = animate(0, 1, {
            duration: 3, repeat: Infinity, ease: "easeInOut",
            onUpdate: (t) => {
              const phase = t <= 0.5 ? t * 2 : (1 - t) * 2;
              setBobY(-10 + phase * 20);
            },
          });
          bobRef.current = ctrl;
        } else if (v < 0.80 && bobRef.current) {
          bobRef.current.stop(); bobRef.current = null; setBobY(0);
        }
      }),
    ];
    return () => { unsubs.forEach(u => u()); bobRef.current?.stop(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Derived show flags
  const showEnvelope = envExitVal > 0.01;
  const showLetter = letterOpVal > 0.01;
  const showHero = heroOpVal > 0.01;
  const showAvatar = avatarOpVal > 0.01;

  // Composed letter Y — MotionValue multiplication: pullPx * settleMult spring
  // As settleMult spring goes 1→0, the letter eases from -220px back to 0
  const composedLetterY = useTransform(
    [letterPullPx, settleMultSp] as const,
    ([pull, mult]: [number, number]) => pull * mult
  );

  return (
    <div ref={scrollRef} style={{ height: "700vh", position: "relative" }}>

      {/* Sticky viewport */}
      <div style={{
        position: "sticky", top: 0, height: "100vh",
        overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {/* Soft radial bg */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 75% 65% at 50% 52%, rgba(168,201,182,0.25) 0%, transparent 78%)",
        }} />

        <BackgroundDoodles visible={true} />

        {/* ── ENVELOPE (stages 1–5) — fades out once letter is free ── */}
        {showEnvelope && (
          <motion.div
            initial={{ y: -220, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 160, damping: 18, duration: 0.9 }}
            style={{
              position: "absolute",
              width: "min(760px, 88vw)",
              opacity: envExit,
              scale: envExitScale,
              zIndex: 12,
              overflow: "visible",
            }}
          >
            <motion.div
              animate={wobbling
                ? { rotate: [0, -4, 4, -3, 3, -1, 0], scale: [1, 1.03, 0.98, 1.02, 1] }
                : { rotate: 0, scale: 1 }
              }
              transition={{ duration: 0.6, ease: "easeInOut" }}
              whileHover={{ rotate: [0, -2, 2, -2, 2, 0], transition: { duration: 0.4 } }}
              style={{ position: "relative", width: "100%" }}
            >
              <DoodleParticleBurst active={particleActive} />
              <DoodleEnvelopeBody />

              {/* Flap */}
              <motion.div style={{
                position: "absolute", top: 0, left: 0,
                width: "100%", height: "62%",
                transformStyle: "preserve-3d" as const,
                transformOrigin: "top center",
                rotateX: flapRotateSp,
                perspective: 1000,
                zIndex: flapVal < -58 ? 2 : 10,
              }}>
                <DoodleFlapSVG />
              </motion.div>

              {/* Shadow */}
              <div style={{
                position: "absolute", bottom: "-18px",
                left: "6%", right: "6%", height: "18px",
                background: "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(31,61,50,0.14), transparent)",
                zIndex: -1,
              }} />
            </motion.div>
          </motion.div>
        )}

        {/*
          ── LETTER CARD ─────────────────────────────────────────────────────
          Exists independently of the envelope so it can travel anywhere.

          Stage A (0.44–0.64): pulls up out of envelope (letterYPx goes to -220px)
          Stage B (0.64–0.78): settles down to viewport center (composedLetterY → 0)
          Stage C (0.78–0.88): width + height expand to fill full viewport
          Stage D (0.85–0.92): fades out as hero content appears on top
        */}
        {showLetter && (
          <motion.div
            style={{
              position: "absolute",
              // Fixed card size — scale drives the fill expansion, not width/height strings
              width: "min(760px, 88vw)",
              height: "clamp(220px, 32vh, 320px)",
              y: composedLetterY,
              rotate: paperWiggle,
              rotateX: paperBendX,
              // Scale: 1 during pull/settle, then springs up to 14× to fill screen
              scale: letterFillScSp,
              borderRadius: letterFillR,
              opacity: letterFillOp,
              transformPerspective: 1200,
              transformOrigin: "center center",
              zIndex: 18,
              overflow: "hidden",
              background: "#F5FAF7",
              border: "2.5px solid #1F3D32",
            }}
          >
            <DoodleLetterPreview creaseOpacity={0} />
          </motion.div>
        )}

        {/* ── HERO CARD (stage D) ── */}
        {showHero && (
          <motion.div style={{
            opacity: heroOpacity,
            scale: heroScale,
            position: "absolute",
            width: "100%", maxWidth: "1280px",
            padding: "0 clamp(1.5rem, 4vw, 3rem)",
            zIndex: 22,
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(2rem, 5vw, 6rem)",
              alignItems: "center",
            }}>

              {/* Left: text */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>

                <motion.p
                  style={{ opacity: subtitleOp, y: subtitleY }}
                  className="text-sm font-medium tracking-widest uppercase text-muted-foreground"
                >
                  Mobile Developer • Flutter • Game Dev
                </motion.p>

                <motion.h1
                  style={{ opacity: titleOp, y: titleY }}
                  className="text-5xl sm:text-6xl lg:text-7xl font-display leading-tight"
                >
                  Sanjana<br />Vichare
                </motion.h1>

                <motion.div style={{ opacity: descOp }}>
                  <svg viewBox="0 0 220 10" style={{ width: "220px", height: "10px", display: "block" }}>
                    <path d="M2,6 Q55,2 110,6 Q165,9 218,5" stroke="#2F6F55" strokeWidth="2.8" fill="none" strokeLinecap="round" />
                  </svg>
                </motion.div>

                <motion.p
                  style={{ opacity: descOp, y: descY }}
                  className="text-lg text-muted-foreground max-w-lg leading-relaxed text-justify"
                >
                  I&apos;m a college student and developer passionate about crafting interactive,
                  human-centred technology — from Flutter mobile apps and full-stack systems
                  to experimental game projects. I love turning ideas into polished, living software.
                </motion.p>

                <motion.div
                  style={{ opacity: btnsOp, y: btnsY }}
                  className="flex flex-wrap gap-3 pt-1"
                >
                  <DoodleButtonWrap>
                    <Button variant="hero" size="lg"
                      onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
                      <ArrowDown className="mr-2 h-4 w-4" />
                      View Projects
                    </Button>
                  </DoodleButtonWrap>

                  <DoodleButtonWrap>
                    <Button variant="hero-outline" size="lg" asChild>
                      <a href="https://github.com/SanjanaVichare" target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                      </a>
                    </Button>
                  </DoodleButtonWrap>

                  <DoodleButtonWrap>
                    <Button variant="hero-ghost" size="lg" asChild>
                      <a href="https://www.linkedin.com/in/sanjana-vichare" target="_blank" rel="noopener noreferrer">
                        <Linkedin className="mr-2 h-4 w-4" />
                        LinkedIn
                      </a>
                    </Button>
                  </DoodleButtonWrap>

                  <DoodleButtonWrap>
                    <Button variant="hero-ghost" size="lg">
                      <Download className="mr-2 h-4 w-4" />
                      Resume
                    </Button>
                  </DoodleButtonWrap>
                </motion.div>
              </div>

              {/* Right: Avatar */}
              {showAvatar && (
                <motion.div
                  style={{
                    opacity: avatarOp,
                    x: avatarXSp,
                    scale: avatarScSp,
                    y: bobY,
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    position: "relative",
                  }}
                  whileHover={{
                    rotate: [0, -3, 3, -2, 0],
                    transition: { duration: 0.5, ease: "easeInOut" },
                  }}
                >
                  <PointingArrow visible={showArrow} />
                  <div style={{
                    width: "100%",
                    maxWidth: "520px",
                    height: "clamp(380px, 48vh, 560px)",
                  }}>
                    <Suspense fallback={
                      <div style={{
                        width: "100%", height: "100%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#2F6F55", fontSize: "13px", opacity: 0.4,
                      }}>
                        Loading 3D…
                      </div>
                    }>
                      <Avatar3D />
                    </Suspense>
                  </div>
                </motion.div>
              )}

            </div>
          </motion.div>
        )}

        <DoodleController visible={showController} />
      </div>
    </div>
  );
};

export default HeroSection;