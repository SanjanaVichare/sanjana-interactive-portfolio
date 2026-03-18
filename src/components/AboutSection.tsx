import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  Gamepad2,
  Brain,
  Palette,
  Database,
  Code,
  ExternalLink,
  Info,
} from "lucide-react";
import { ReactNode, CSSProperties } from "react";
import girlPeek from "@/assets/peeking.png";

// ── Palette ────────────────────────────────────────────────────────────────
const C = {
  darkGreen: "#0A3323",
  forestGreen: "#063C2B",
  mossGreen: "#879C5F",
  beige: "#F7F4D5",
  rosyBrown: "#D3968C",
  midnightGreen: "#105666",
};

// ── Ease ───────────────────────────────────────────────────────────────────
const EASE = [0.2, 0, 0, 1] as [number, number, number, number];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, delay, ease: EASE },
});

interface Chip { id: string; icon: ReactNode; label: string; }
interface Stat { label: string; value: number; tooltip?: string; }
interface SocBtn { icon: ReactNode; label: string; url: string; preview?: ReactNode; }

const chips: Chip[] = [
  { id: "game", icon: <Gamepad2 size={13} />, label: "Game Development" },
  { id: "ai", icon: <Brain size={13} />, label: "Artificial Intelligence" },
  { id: "ui", icon: <Palette size={13} />, label: "Creative UI Design" },
  { id: "puzzle", icon: <Database size={13} />, label: "Puzzle Solving" },
  { id: "extra", icon: <Code size={13} />, label: "Experimental Apps" },
];

const stats: Stat[] = [
  { label: "Problem Solving", value: 92, tooltip: "Breaking complex problems into logical steps and finding efficient solutions." },
  { label: "System Design", value: 84, tooltip: "Planning how different parts of an application work together." },
  { label: "Code Quality", value: 88, tooltip: "Writing clean, readable, and maintainable code." },
  { label: "Debugging", value: 90, tooltip: "Finding bugs quickly and fixing them without breaking everything else." },
  { label: "UI Craftsmanship", value: 83, tooltip: "Attention to detail in interfaces — spacing, animation, and overall UX." },
  { label: "Learning Velocity", value: 95, tooltip: "Picking up new technologies and frameworks quickly when needed." },
  { label: "Late Night Vibe Coding", value: 95, tooltip: "Peak productivity hours usually happen after midnight." },
  { label: "Game Development", value: 89, tooltip: "Building interactive mechanics, gameplay systems, and fun user experiences." },
];

const LINES = [
  "> building Flutter apps",
  "> designing interactive UI",
  "> creating experimental tools",
  "> developing AI systems",
];

// ── useMagnet hook ─────────────────────────────────────────────────────────
function useMagnet(strength = 0.32) {
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

// ── MagnetWrap ─────────────────────────────────────────────────────────────
function MagnetWrap({ children }: { children: ReactNode }) {
  const { ref, x, y, onMouseMove, onMouseLeave } = useMagnet();
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

function useTyping(lines: string[], typeMs = 70, eraseMs = 35, pauseMs = 1400) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"type" | "erase">("type");
  useEffect(() => {
    const target = lines[idx];
    if (phase === "type") {
      if (text.length < target.length) {
        const t = setTimeout(() => setText(target.slice(0, text.length + 1)), typeMs);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("erase"), pauseMs);
      return () => clearTimeout(t);
    }
    if (text.length > 0) {
      const t = setTimeout(() => setText(text.slice(0, -1)), eraseMs);
      return () => clearTimeout(t);
    }
    setIdx(i => (i + 1) % lines.length);
    setPhase("type");
  }, [text, phase, idx, lines, typeMs, eraseMs, pauseMs]);
  return { text, idx };
}

const HoverCard = ({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: CSSProperties; }) => (
  <motion.div
    {...fadeUp(delay)}
    whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(10,51,35,0.18)" }}
    transition={{ duration: 0.25, ease: EASE }}
    style={{ borderRadius: "18px", padding: "26px", boxSizing: "border-box", height: "100%", ...style }}
  >
    {children}
  </motion.div>
);

const Label = ({ text, color = "rgba(247,244,213,0.5)" }: { text: string; color?: string; }) => (
  <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1.8px", textTransform: "uppercase", color, marginBottom: "18px" }}>
    {text}
  </div>
);

const DragChip = ({ chip }: { chip: Chip }) => (
  <motion.div
    drag dragElastic={0.5} dragMomentum={false}
    whileHover={{ scale: 1.08 }} whileDrag={{ scale: 1.12, zIndex: 50, cursor: "grabbing" }}
    style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: C.midnightGreen, color: C.beige, borderRadius: "999px", padding: "7px 13px", fontSize: "12.5px", cursor: "grab", userSelect: "none", touchAction: "none", boxShadow: "0 2px 10px rgba(0,0,0,0.25)", whiteSpace: "nowrap", position: "relative" }}
  >
    {chip.icon}{chip.label}
  </motion.div>
);

const StatTooltip = ({ text }: { text?: string }) => {
  const [hovered, setHovered] = useState(false);
  if (!text) return null;
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Info size={12} style={{ color: C.beige, opacity: 0.45, cursor: "help" }} />
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{ position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", zIndex: 400, width: "180px", background: C.darkGreen, color: C.beige, borderRadius: "10px", padding: "9px 11px", fontSize: "11.5px", lineHeight: 1.5, boxShadow: "0 8px 24px rgba(0,0,0,0.35)", pointerEvents: "none", border: "1px solid rgba(135,156,95,0.25)" }}
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatBar = ({ stat, delay }: { stat: Stat; delay: number }) => {
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => { const t = setTimeout(() => setCurrent(stat.value), delay * 1000 + 100); return () => clearTimeout(t); }, [stat.value, delay]);
  const getPercent = (clientX: number) => { if (!trackRef.current) return 0; const rect = trackRef.current.getBoundingClientRect(); return Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100))); };
  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setCurrent(getPercent(clientX));
    const move = (ev: MouseEvent | TouchEvent) => { const x = "touches" in ev ? ev.touches[0].clientX : ev.clientX; setCurrent(getPercent(x)); };
    const end = () => { setIsDragging(false); setCurrent(stat.value); window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", end); window.removeEventListener("touchmove", move); window.removeEventListener("touchend", end); };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", end); window.addEventListener("touchmove", move); window.addEventListener("touchend", end);
  };
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px", gap: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", minWidth: 0 }}>
          <span style={{ fontSize: "12px", color: C.beige, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{stat.label}</span>
          <StatTooltip text={stat.tooltip} />
        </div>
        <span style={{ fontSize: "11px", color: C.beige, opacity: 0.6, flexShrink: 0 }}>{current}%</span>
      </div>
      <div ref={trackRef} onMouseDown={startDrag} onTouchStart={startDrag} style={{ height: "5px", background: "rgba(10,51,35,0.28)", borderRadius: "99px", overflow: "visible", position: "relative", cursor: "ew-resize" }}>
        <div style={{ height: "100%", width: `${current}%`, background: C.beige, borderRadius: "99px", transition: isDragging ? "none" : "width 0.65s cubic-bezier(0.34,1.56,0.64,1)", position: "relative" }}>
          <div style={{ position: "absolute", right: "-5px", top: "50%", transform: "translateY(-50%)", width: "11px", height: "11px", borderRadius: "50%", background: C.beige, border: `2px solid ${C.darkGreen}`, opacity: isDragging ? 1 : 0, transition: "opacity 0.2s" }} />
        </div>
      </div>
    </div>
  );
};

const Popup = ({ title, items }: { title: string; items: string[] }) => (
  <div style={{ background: C.forestGreen, border: "1px solid rgba(135,156,95,0.4)", borderRadius: "14px", padding: "14px 16px", minWidth: "190px", boxShadow: "0 12px 36px rgba(0,0,0,0.32)", color: C.beige }}>
    <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "10px", opacity: 0.7 }}>{title}</div>
    {items.map((item, i) => (
      <div key={i} style={{ fontSize: "12.5px", padding: "5px 0", borderTop: i > 0 ? "1px solid rgba(247,244,213,0.08)" : "none" }}>{item}</div>
    ))}
  </div>
);

// ── Magnetic Social Button ─────────────────────────────────────────────────
const SocButton = ({ btn }: { btn: SocBtn }) => {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const { ref, x, y, onMouseMove, onMouseLeave: magnetLeave } = useMagnet(0.35);

  const enter = () => { clearTimeout(timer.current); setOpen(true); setHovered(true); };
  const leave = () => {
    timer.current = setTimeout(() => setOpen(false), 120);
    setHovered(false);
    magnetLeave();
  };

  // Icon pop on hover
  const iconScale = hovered ? 1.18 : 1;
  const iconRotate = hovered ? 8 : 0;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <motion.div
        ref={ref}
        style={{ x, y, display: "inline-block" }}
        onMouseMove={onMouseMove}
        onMouseLeave={leave}
      >
        <motion.a
          href={btn.url}
          target="_blank"
          rel="noopener noreferrer"
          onHoverStart={enter}
          onHoverEnd={leave}
          whileTap={{ scale: 0.94 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            background: hovered && btn.preview ? C.midnightGreen : C.rosyBrown,
            color: C.beige,
            borderRadius: "999px",
            padding: "9px 17px",
            fontSize: "13px",
            fontWeight: 600,
            textDecoration: "none",
            cursor: "pointer",
            boxShadow: hovered
              ? "0 10px 28px rgba(10,51,35,0.22)"
              : "0 3px 10px rgba(10,51,35,0.12)",
            transition: "background 0.2s ease, box-shadow 0.25s ease",
          }}
        >
          {/* Animated icon */}
          <motion.span
            animate={{ scale: iconScale, rotate: iconRotate }}
            transition={{ type: "spring", stiffness: 380, damping: 18 }}
            style={{ display: "flex" }}
          >
            {btn.icon}
          </motion.span>

          {btn.label}

          {btn.preview && (
            <ExternalLink size={10} style={{ opacity: 0.45 }} />
          )}
        </motion.a>
      </motion.div>

      {/* Preview popup — rendered outside the magnet div so it stays put */}
      <AnimatePresence>
        {open && btn.preview && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onMouseEnter={enter}
            onMouseLeave={leave}
            style={{
              position: "absolute",
              bottom: "calc(100% + 8px)",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 300,
              pointerEvents: "auto",
            }}
          >
            {btn.preview}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Main ───────────────────────────────────────────────────────────────────
export default function AboutSection() {
  const { text: typed, idx: lineIdx } = useTyping(LINES);

  const socials: SocBtn[] = [
    { icon: <Github size={14} />, label: "GitHub", url: "https://github.com/SanjanaVichare", preview: <Popup title="GitHub" items={["Projects & experiments", "Indian Sign Language Recognition", "HashDrop"]} /> },
    { icon: <Linkedin size={14} />, label: "LinkedIn", url: "https://linkedin.com/in/sanjana-vichare", preview: <Popup title="LinkedIn" items={["Software Developer", "Flutter • AI • Games"]} /> },
    { icon: <Mail size={14} />, label: "Email", url: "mailto:sanjanastudys@gmail.com" },
  ];

  return (
    <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "56px 24px" }}>
      <motion.h2
        {...fadeUp(0)}
        style={{ fontSize: "clamp(32px, 4.5vw, 48px)", fontWeight: 700, textAlign: "center", color: C.darkGreen, marginBottom: "40px", letterSpacing: "-0.4px" }}
      >
        About Me
      </motion.h2>

      {/* Row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "20px" }}>

        <motion.div
          {...fadeUp(0.05)}
          whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(10,51,35,0.18)" }}
          transition={{ duration: 0.25, ease: EASE }}
          style={{
            borderRadius: "18px",
            padding: "26px",
            boxSizing: "border-box",
            height: "100%",
            background: C.beige,
            border: "1px solid rgba(10,51,35,0.15)",
            position: "relative",
            overflow: "visible",
          }}
        >
          <motion.img
            src={girlPeek}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            animate={{ y: [0, -6, 0] }}
            transition={{
              y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 0.4 }
            }}
            style={{
              position: "absolute",
              top: "-70px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "160px",
              zIndex: 20,
              pointerEvents: "none",
              filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.18))"
            }}
          />

          <div style={{ position: "relative", zIndex: 2 }}>
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: "50px", height: "50px", borderRadius: "50%",
                background: C.midnightGreen, color: C.beige,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px", fontWeight: 700, marginBottom: "18px",
              }}
            >
              SV
            </motion.div>

            <div style={{ fontSize: "19px", fontWeight: 700, color: C.darkGreen, marginBottom: "3px" }}>
              Sanjana Vichare
            </div>

            <div style={{ fontSize: "9.5px", fontWeight: 600, color: C.mossGreen, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "13px" }}>
              Creative Software Developer
            </div>

            <p style={{ fontSize: "13.5px", lineHeight: 1.8, color: "#2d4a3a", margin: 0, paddingBottom: "80px" }}>
              Creative developer who builds apps, games, and experimental systems combining technology with creativity.
            </p>
          </div>
        </motion.div>

        {/* Draggable Interests */}
        <HoverCard delay={0.1} style={{ background: C.forestGreen }}>
          <Label text="Interests" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignContent: "flex-start" }}>
            {chips.map(chip => <DragChip key={chip.id} chip={chip} />)}
          </div>
          <p style={{ fontSize: "10px", color: "rgba(247,244,213,0.35)", marginTop: "16px", marginBottom: 0 }}>drag the chips around</p>
        </HoverCard>

        {/* Typing */}
        <HoverCard delay={0.15} style={{ background: C.mossGreen }}>
          <Label text="What I Build" color="rgba(10,51,35,0.55)" />
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(15px, 1.8vw, 19px)", fontWeight: 600, color: C.darkGreen, minHeight: "80px", lineHeight: 1.4, display: "flex", alignItems: "flex-start", flexWrap: "wrap" }}>
            <span>{typed}</span>
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.75, repeat: Infinity }}
              style={{ display: "inline-block", width: "2px", height: "1em", background: C.darkGreen, marginLeft: "2px", borderRadius: "1px", flexShrink: 0 }}
            />
          </div>
          <div style={{ display: "flex", gap: "6px", marginTop: "18px" }}>
            {LINES.map((_, i) => (
              <motion.div
                key={i}
                animate={{ width: i === lineIdx ? "22px" : "7px", opacity: i === lineIdx ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}
                style={{ height: "3px", borderRadius: "2px", background: C.darkGreen }}
              />
            ))}
          </div>
        </HoverCard>
      </div>

      {/* Row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px" }}>
        <HoverCard delay={0.2} style={{ background: C.beige, border: "1px solid rgba(211,150,140,0.4)" }}>
          <Label text="Connect" color={C.mossGreen} />
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start" }}>
            {socials.map(btn => <SocButton key={btn.label} btn={btn} />)}
          </div>
          <p style={{ fontSize: "10px", color: C.mossGreen, opacity: 0.5, marginTop: "14px", marginBottom: 0 }}>hover GitHub &amp; LinkedIn to preview</p>
        </HoverCard>

        <HoverCard delay={0.25} style={{ background: C.mossGreen }}>
          <Label text="Developer Stats" color="rgba(10,51,35,0.55)" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 36px" }}>
            {stats.map((s, i) => <StatBar key={s.label} stat={s} delay={0.35 + i * 0.08} />)}
          </div>
        </HoverCard>
      </div>
    </section>
  );
}