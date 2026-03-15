import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// ── Types ──────────────────────────────────────────────────────────────────
interface Chip {
  id: string;
  icon: ReactNode;
  label: string;
}

interface Stat {
  label: string;
  value: number;
  tooltip?: string;
}

interface SocBtn {
  icon: ReactNode;
  label: string;
  url: string;
  preview?: ReactNode;
}

// ── Data ───────────────────────────────────────────────────────────────────
const chips: Chip[] = [
  { id: "game", icon: <Gamepad2 size={13} />, label: "Game Development" },
  { id: "ai", icon: <Brain size={13} />, label: "Artificial Intelligence" },
  { id: "ui", icon: <Palette size={13} />, label: "Creative UI Design" },
  { id: "puzzle", icon: <Database size={13} />, label: "Puzzle Solving" },
  { id: "extra", icon: <Code size={13} />, label: "Experimental Apps" },
];

const stats: Stat[] = [
  {
    label: "Problem Solving",
    value: 92,
    tooltip: "Breaking complex problems into logical steps and finding efficient solutions.",
  },
  {
    label: "System Design",
    value: 84,
    tooltip: "Planning how different parts of an application work together — backend, frontend, and data.",
  },
  {
    label: "Code Quality",
    value: 88,
    tooltip: "Writing clean, readable, and maintainable code that other developers can understand.",
  },
  {
    label: "Debugging",
    value: 90,
    tooltip: "Finding bugs quickly and fixing them without breaking everything else.",
  },
  {
    label: "UI Craftsmanship",
    value: 83,
    tooltip: "Attention to detail in interfaces — spacing, animation, and overall user experience.",
  },
  {
    label: "Learning Velocity",
    value: 95,
    tooltip: "Picking up new technologies and frameworks quickly when needed.",
  },
  {
    label: "Late Night Vibe Coding",
    value: 95,
    tooltip: "Peak productivity hours usually happen after midnight.",
  },
  {
    label: "Game Development",
    value: 89,
    tooltip: "Building interactive mechanics, gameplay systems, and fun user experiences.",
  },
];

const LINES = [
  "> building Flutter apps",
  "> designing interactive UI",
  "> creating experimental tools",
  "> developing AI systems",
];

// ── Typing hook ────────────────────────────────────────────────────────────
function useTyping(
  lines: string[],
  typeMs = 70,
  eraseMs = 35,
  pauseMs = 1400,
) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"type" | "erase">("type");

  useEffect(() => {
    const target = lines[idx];

    if (phase === "type") {
      if (text.length < target.length) {
        const t = setTimeout(
          () => setText(target.slice(0, text.length + 1)),
          typeMs,
        );
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("erase"), pauseMs);
      return () => clearTimeout(t);
    }

    // phase === "erase"
    if (text.length > 0) {
      const t = setTimeout(() => setText(text.slice(0, -1)), eraseMs);
      return () => clearTimeout(t);
    }
    setIdx(i => (i + 1) % lines.length);
    setPhase("type");
  }, [text, phase, idx, lines, typeMs, eraseMs, pauseMs]);

  return { text, idx };
}

// ── HoverCard ──────────────────────────────────────────────────────────────
const HoverCard = ({
  children,
  delay = 0,
  style,
}: {
  children: ReactNode;
  delay?: number;
  style?: CSSProperties;
}) => (
  <motion.div
    {...fadeUp(delay)}
    whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(10,51,35,0.18)" }}
    transition={{ duration: 0.25, ease: EASE }}
    style={{
      borderRadius: "18px",
      padding: "26px",
      boxSizing: "border-box",
      height: "100%",
      ...style,
    }}
  >
    {children}
  </motion.div>
);

// ── Section label ──────────────────────────────────────────────────────────
const Label = ({
  text,
  color = "rgba(247,244,213,0.5)",
}: {
  text: string;
  color?: string;
}) => (
  <div
    style={{
      fontSize: "10px",
      fontWeight: 600,
      letterSpacing: "1.8px",
      textTransform: "uppercase",
      color,
      marginBottom: "18px",
    }}
  >
    {text}
  </div>
);

// ── Draggable chip ─────────────────────────────────────────────────────────
const DragChip = ({ chip }: { chip: Chip }) => (
  <motion.div
    drag
    dragElastic={0.5}
    dragMomentum={false}
    whileHover={{ scale: 1.08 }}
    whileDrag={{ scale: 1.12, zIndex: 50, cursor: "grabbing" }}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      background: C.midnightGreen,
      color: C.beige,
      borderRadius: "999px",
      padding: "7px 13px",
      fontSize: "12.5px",
      cursor: "grab",
      userSelect: "none",
      touchAction: "none",
      boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
      whiteSpace: "nowrap",
      position: "relative",
    }}
  >
    {chip.icon}
    {chip.label}
  </motion.div>
);

// ── Stat tooltip ───────────────────────────────────────────────────────────
const StatTooltip = ({ text }: { text?: string }) => {
  const [hovered, setHovered] = useState(false);

  if (!text) return null;

  return (
    <div
      style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Info size={12} style={{ color: C.beige, opacity: 0.45, cursor: "help" }} />

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              bottom: "calc(100% + 6px)",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 400,
              width: "180px",
              background: C.darkGreen,
              color: C.beige,
              borderRadius: "10px",
              padding: "9px 11px",
              fontSize: "11.5px",
              lineHeight: 1.5,
              boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
              pointerEvents: "none",
              border: "1px solid rgba(135,156,95,0.25)",
            }}
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Stat bar ───────────────────────────────────────────────────────────────
const StatBar = ({ stat, delay }: { stat: Stat; delay: number }) => (
  <div style={{ marginBottom: "12px" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "5px",
        gap: "6px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "5px", minWidth: 0 }}>
        <span
          style={{
            fontSize: "12px",
            color: C.beige,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {stat.label}
        </span>
        <StatTooltip text={stat.tooltip} />
      </div>
      <span style={{ fontSize: "11px", color: C.beige, opacity: 0.6, flexShrink: 0 }}>
        {stat.value}%
      </span>
    </div>

    <div
      style={{
        height: "5px",
        background: "rgba(10,51,35,0.28)",
        borderRadius: "99px",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${stat.value}%` }}
        viewport={{ once: true }}
        transition={{
          duration: 1.0,
          delay,
          ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
        }}
        style={{ height: "100%", background: C.beige, borderRadius: "99px" }}
      />
    </div>
  </div>
);

// ── Hover preview popup ────────────────────────────────────────────────────
const Popup = ({ title, items }: { title: string; items: string[] }) => (
  <div
    style={{
      background: C.forestGreen,
      border: "1px solid rgba(135,156,95,0.4)",
      borderRadius: "14px",
      padding: "14px 16px",
      minWidth: "190px",
      boxShadow: "0 12px 36px rgba(0,0,0,0.32)",
      color: C.beige,
    }}
  >
    <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "10px", opacity: 0.7 }}>
      {title}
    </div>
    {items.map((item, i) => (
      <div
        key={i}
        style={{
          fontSize: "12.5px",
          padding: "5px 0",
          borderTop: i > 0 ? "1px solid rgba(247,244,213,0.08)" : "none",
        }}
      >
        {item}
      </div>
    ))}
  </div>
);

// ── Social button ──────────────────────────────────────────────────────────
const SocButton = ({ btn }: { btn: SocBtn }) => {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const enter = () => { clearTimeout(timer.current); setOpen(true); };
  const leave = () => { timer.current = setTimeout(() => setOpen(false), 120); };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <motion.a
        href={btn.url}
        target="_blank"
        rel="noopener noreferrer"
        onHoverStart={enter}
        onHoverEnd={leave}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.95 }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "7px",
          background: open && btn.preview ? C.midnightGreen : C.rosyBrown,
          color: C.beige,
          borderRadius: "999px",
          padding: "9px 17px",
          fontSize: "13px",
          fontWeight: 500,
          textDecoration: "none",
          transition: "background 0.2s ease",
          cursor: "pointer",
        }}
      >
        {btn.icon}
        {btn.label}
        {btn.preview && <ExternalLink size={10} style={{ opacity: 0.45 }} />}
      </motion.a>

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
    {
      icon: <Github size={14} />,
      label: "GitHub",
      url: "https://github.com/SanjanaVichare",
      preview: <Popup title="GitHub" items={["Projects & experiments", "Indian Sign Language Recognition", "HashDrop"]} />,
    },
    {
      icon: <Linkedin size={14} />,
      label: "LinkedIn",
      url: "https://linkedin.com/in/sanjana-vichare",
      preview: <Popup title="LinkedIn" items={["Software Developer", "Flutter • AI • Games"]} />,
    },
    {
      icon: <Mail size={14} />,
      label: "Email",
      url: "mailto:sanjanastudys@gmail.com",
    },
  ];

  return (
    <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "56px 24px" }}>

      {/* Title */}
      <motion.h2
        {...fadeUp(0)}
        style={{
          fontSize: "clamp(32px, 4.5vw, 48px)",
          fontWeight: 700,
          textAlign: "center",
          color: C.darkGreen,
          marginBottom: "40px",
          letterSpacing: "-0.4px",
        }}
      >
        About Me
      </motion.h2>

      {/* Row 1 — 3 equal columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {/* Profile */}
        <HoverCard delay={0.05} style={{ background: C.beige, border: "1px solid rgba(10,51,35,0.15)" }}>
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: C.midnightGreen,
              color: C.beige,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: 700,
              marginBottom: "18px",
            }}
          >
            SV
          </motion.div>

          <div style={{ fontSize: "19px", fontWeight: 700, color: C.darkGreen, marginBottom: "3px" }}>
            Sanjana Vichare
          </div>
          <div
            style={{
              fontSize: "9.5px",
              fontWeight: 600,
              color: C.mossGreen,
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "13px",
            }}
          >
            Creative Software Developer
          </div>
          <p style={{ fontSize: "13.5px", lineHeight: 1.8, color: "#2d4a3a", margin: 0 }}>
            Creative developer who builds apps, games, and experimental systems
            combining technology with creativity.
          </p>
        </HoverCard>

        {/* Draggable Interests */}
        <HoverCard delay={0.1} style={{ background: C.forestGreen }}>
          <Label text="Interests" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignContent: "flex-start" }}>
            {chips.map(chip => <DragChip key={chip.id} chip={chip} />)}
          </div>
          <p style={{ fontSize: "10px", color: "rgba(247,244,213,0.35)", marginTop: "16px", marginBottom: 0 }}>
            drag the chips around
          </p>
        </HoverCard>

        {/* Typing */}
        <HoverCard delay={0.15} style={{ background: C.mossGreen }}>
          <Label text="What I Build" color="rgba(10,51,35,0.55)" />

          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "clamp(15px, 1.8vw, 19px)",
              fontWeight: 600,
              color: C.darkGreen,
              minHeight: "80px",
              lineHeight: 1.4,
              display: "flex",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <span>{typed}</span>
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.75, repeat: Infinity }}
              style={{
                display: "inline-block",
                width: "2px",
                height: "1em",
                background: C.darkGreen,
                marginLeft: "2px",
                borderRadius: "1px",
                flexShrink: 0,
              }}
            />
          </div>

          {/* progress dots */}
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

      {/* Row 2 — Connect (1fr) + Stats (2fr) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px" }}>

        {/* Connect */}
        <HoverCard delay={0.2} style={{ background: C.beige, border: "1px solid rgba(211,150,140,0.4)" }}>
          <Label text="Connect" color={C.mossGreen} />
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start" }}>
            {socials.map(btn => <SocButton key={btn.label} btn={btn} />)}
          </div>
          <p style={{ fontSize: "10px", color: C.mossGreen, opacity: 0.5, marginTop: "14px", marginBottom: 0 }}>
            hover GitHub &amp; LinkedIn to preview
          </p>
        </HoverCard>

        {/* Stats */}
        <HoverCard delay={0.25} style={{ background: C.mossGreen }}>
          <Label text="Developer Stats" color="rgba(10,51,35,0.55)" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 36px" }}>
            {stats.map((s, i) => (
              <StatBar key={s.label} stat={s} delay={0.35 + i * 0.08} />
            ))}
          </div>
        </HoverCard>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 860px) {
          .about-row1 { grid-template-columns: 1fr 1fr !important; }
          .about-row2 { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 540px) {
          .about-row1 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}