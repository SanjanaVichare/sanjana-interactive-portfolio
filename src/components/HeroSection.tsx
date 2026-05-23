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

import { motion, useMotionValue, useSpring } from "framer-motion";
import { Github, Linkedin, Download, ArrowDown, Music2 } from "lucide-react";
import { useRef, useState, useCallback, useEffect } from "react";

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
  transition: "background 0.25s, color 0.25s, border-color 0.25s, box-shadow 0.3s",
  border: "none",
  outline: "none",
};

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.55, ease: EASE_OUT_EXPO },
});

// ── Magnet ──────────────────────────────────────────────────────────────────

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
  const onMouseLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);
  return { ref, x, y, onMouseMove, onMouseLeave };
}

function MagnetWrap({ children }: { children: React.ReactNode }) {
  const { ref, x, y, onMouseMove, onMouseLeave } = useMagnet(0.3);
  return (
    <motion.div ref={ref} style={{ x, y, display: "inline-block" }} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      {children}
    </motion.div>
  );
}

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

// ── Typing code block ────────────────────────────────────────────────────────

type Token = { t: "cm" | "kw" | "str" | "plain"; v: string };
type CodeLine = { tokens: Token[] };

const CODE_LINES: CodeLine[] = [
  { tokens: [{ t: "cm", v: "// who's building this?" }] },
  { tokens: [{ t: "kw", v: "const" }, { t: "plain", v: " me = {" }] },
  { tokens: [{ t: "plain", v: "  role: " }, { t: "str", v: '"Full-Stack Developer"' }, { t: "plain", v: "," }] },
  { tokens: [{ t: "plain", v: "  loves: " }, { t: "str", v: '"turning ideas into software"' }, { t: "plain", v: "," }] },
  { tokens: [{ t: "plain", v: "  status: " }, { t: "str", v: '"always shipping 🚀"' }, { t: "plain", v: "," }] },
  { tokens: [{ t: "plain", v: "}" }] },
];

const TOKEN_COLORS: Record<string, string> = {
  cm: "#4a7a5e",
  kw: "#D3968C",
  str: "#c8a84b",
  plain: "#c8d5c0",
};

type FlatChar = { char: string; color: string; isNewline: boolean };

function buildFlat(): FlatChar[] {
  const seq: FlatChar[] = [];
  CODE_LINES.forEach((line) => {
    line.tokens.forEach((tok) => {
      tok.v.split("").forEach((ch) => {
        seq.push({ char: ch, color: TOKEN_COLORS[tok.t] ?? TOKEN_COLORS.plain, isNewline: false });
      });
    });
    seq.push({ char: "", color: "", isNewline: true });
  });
  return seq;
}

function TypingCode() {
  const flat = useRef<FlatChar[]>(buildFlat());
  const [chars, setChars] = useState<FlatChar[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    function tick() {
      if (i >= flat.current.length) { setDone(true); return; }
      setChars((prev) => [...prev, flat.current[i]]);
      i++;
      setTimeout(tick, Math.random() * 38 + 14);
    }
    const t = setTimeout(tick, 700);
    return () => clearTimeout(t);
  }, []);

  const lines: { char: string; color: string }[][] = [[]];
  chars.forEach((c) => {
    if (c.isNewline) lines.push([]);
    else lines[lines.length - 1].push({ char: c.char, color: c.color });
  });

  return (
    <div style={{
      background: "#0d2b1e",
      borderRadius: "14px",
      padding: "18px 20px",
      fontFamily: "'DM Mono', 'Fira Code', monospace",
      fontSize: "0.8rem",
      lineHeight: 1.85,
      border: "1px solid rgba(255,255,255,0.06)",
    }}>
      <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((bg) => (
          <div key={bg} style={{ width: 10, height: 10, borderRadius: "50%", background: bg }} />
        ))}
      </div>
      {lines.map((line, li) => (
        <div key={li} style={{ minHeight: "1.6em" }}>
          {line.map((c, ci) => (
            <span key={ci} style={{ color: c.color }}>{c.char}</span>
          ))}
          {li === lines.length - 1 && !done && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.65, ease: "linear" }}
              style={{ display: "inline-block", width: 2, height: "0.9em", background: "#D3968C", verticalAlign: "middle", marginLeft: 1 }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Now Playing ──────────────────────────────────────────────────────────────

const SONGS = [
  { title: "Ditto", artist: "NewJeans", album: "OMG", duration: 185 },
  { title: "Gone", artist: "ROSÉ", album: "rosie", duration: 197 },
  { title: "7 rings", artist: "Ariana Grande", album: "thank u, next", duration: 178 },
  { title: "Stitches", artist: "Shawn Mendes", album: "Handwritten", duration: 207 },
  { title: "TGIF", artist: "Katy Perry", album: "143", duration: 177 },
  { title: "Youngblood", artist: "5 Seconds of Summer", album: "Youngblood", duration: 222 },
  { title: "On the Floor", artist: "Jennifer Lopez", album: "Love?", duration: 234 },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SHUFFLED = shuffle(SONGS);

function NowPlaying() {
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(true);

  const SONG = SHUFFLED[idx];

  useEffect(() => { setProgress(0); }, [idx]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= SONG.duration) {
          setIdx((i) => (i + 1) % SHUFFLED.length);
          return 0;
        }
        return p + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [playing, SONG]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const pct = Math.round((progress / SONG.duration) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.55, ease: EASE_OUT_EXPO }}
      style={{
        background: "rgba(211,150,140,0.10)",
        border: "1px solid rgba(211,150,140,0.22)",
        borderRadius: "14px",
        padding: "18px 20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "12px" }}>
        <motion.div
          animate={playing ? { rotate: 360 } : {}}
          transition={playing ? { repeat: Infinity, duration: 4, ease: "linear" } : {}}
        >
          <Music2 size={13} color={C.highlight} />
        </motion.div>
        <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.highlight, fontFamily: "'DM Sans', sans-serif" }}>
          Now coding to
        </span>
      </div>

      <div style={{ marginBottom: "14px" }}>
        <div style={{ fontSize: "1rem", fontWeight: 700, color: C.primaryText, fontFamily: "'Crimson Pro', Georgia, serif", lineHeight: 1.2 }}>
          {SONG.title}
        </div>
        <div style={{ fontSize: "0.8rem", color: C.secondaryText, fontFamily: "'DM Sans', sans-serif", marginTop: "3px" }}>
          {SONG.artist} · {SONG.album}
        </div>
      </div>

      <div
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setProgress(Math.round(((e.clientX - rect.left) / rect.width) * SONG.duration));
        }}
        style={{ background: "rgba(10,51,35,0.12)", borderRadius: "4px", height: "4px", cursor: "pointer", marginBottom: "8px" }}
      >
        <div style={{ width: `${pct}%`, height: "100%", background: C.highlight, borderRadius: "4px", transition: "width 1s linear" }} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.72rem", color: C.secondaryText, fontFamily: "'DM Sans', sans-serif" }}>{fmt(progress)}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button onClick={() => setIdx((i) => (i - 1 + SHUFFLED.length) % SHUFFLED.length)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={C.accent}><polygon points="19,3 5,12 19,21" /><rect x="3" y="3" width="3" height="18" rx="1" /></svg>
          </button>
          <button onClick={() => setPlaying((p) => !p)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
            {playing ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill={C.accent}><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill={C.accent}><polygon points="5,3 19,12 5,21" /></svg>
            )}
          </button>
          <button onClick={() => setIdx((i) => (i + 1) % SHUFFLED.length)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={C.accent}><polygon points="5,3 19,12 5,21" /><rect x="18" y="3" width="3" height="18" rx="1" /></svg>
          </button>
        </div>
        <span style={{ fontSize: "0.72rem", color: C.secondaryText, fontFamily: "'DM Sans', sans-serif" }}>{fmt(SONG.duration)}</span>
      </div>
    </motion.div>
  );
}

// ── HeroSection ──────────────────────────────────────────────────────────────

const HeroSection = () => {
  const [hovView, setHovView] = useState(false);
  const [hovGH, setHovGH] = useState(false);
  const [hovLI, setHovLI] = useState(false);
  const [hovDL, setHovDL] = useState(false);

  return (
    <div style={{
      position: "relative",
      width: "100%",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      background: C.pageBg,
    }}>
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(circle at 70% 50%, rgba(16,86,102,0.12), transparent 60%),
          radial-gradient(circle at 40% 60%, rgba(211,150,140,0.15), transparent 70%)
        `,
      }} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "relative", zIndex: 10,
          width: "100%", maxWidth: "1280px",
          padding: "0 clamp(1.5rem, 4vw, 3rem)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          gap: "clamp(2rem, 5vw, 5rem)",
        }}
      >
        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          <motion.p {...fadeUp(0.15)} style={{
            fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.2em",
            textTransform: "uppercase", color: C.secondaryText, fontFamily: "'DM Sans', sans-serif",
          }}>
            Web Developer · App Developer · Hobbyist Game Dev
          </motion.p>

          <motion.h1 {...fadeUp(0.28)} style={{
            fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: 700, lineHeight: 1.08,
            color: C.primaryText, fontFamily: "'Crimson Pro', Georgia, serif", margin: 0,
          }}>
            Sanjana<br />
            <em style={{ fontStyle: "italic", color: C.accent }}>Vichare</em>
          </motion.h1>

          <motion.p {...fadeUp(0.46)} style={{
            fontSize: "1.05rem", color: C.accent, opacity: 0.82,
            maxWidth: "480px", lineHeight: 1.75, fontFamily: "'DM Sans', sans-serif",
          }}>
            I&apos;m a college student and developer passionate about crafting
            interactive, human-centred technology — from Flutter mobile apps and
            full-stack systems to experimental game projects. I love turning ideas
            into polished, living software.
          </motion.p>

          <motion.div {...fadeUp(0.56)} style={{ display: "flex", flexWrap: "nowrap", gap: "0.75rem", paddingTop: "0.25rem" }}>
            <MagnetWrap>
              <motion.button
                onMouseEnter={() => setHovView(true)} onMouseLeave={() => setHovView(false)}
                onClick={() => document.getElementById("projects-section")?.scrollIntoView({ behavior: "smooth" })}
                whileTap={{ scale: 0.95 }}
                style={{
                  ...pill, background: hovView ? C.primaryText : C.accent, color: C.pageBg,
                  boxShadow: hovView ? "0 14px 36px rgba(10,51,35,0.24)" : "0 6px 18px rgba(10,51,35,0.14)"
                }}
              >
                <Icon hov={hovView}><ArrowDown size={16} /></Icon>
                View Projects
              </motion.button>
            </MagnetWrap>

            <MagnetWrap>
              <motion.a href="https://www.linkedin.com/in/sanjana-vichare" target="_blank" rel="noopener noreferrer"
                onMouseEnter={() => setHovLI(true)} onMouseLeave={() => setHovLI(false)}
                whileTap={{ scale: 0.95 }}
                style={{
                  ...pill, background: hovLI ? "rgba(131,153,88,0.12)" : "transparent",
                  color: hovLI ? C.primaryText : C.secondaryText, border: "1.5px solid transparent"
                }}
              >
                <Icon hov={hovLI}><Linkedin size={16} /></Icon>LinkedIn
              </motion.a>
            </MagnetWrap>

            <MagnetWrap>
              <motion.button
                onMouseEnter={() => setHovDL(true)} onMouseLeave={() => setHovDL(false)}
                whileTap={{ scale: 0.95 }}
                style={{
                  ...pill, background: hovDL ? "rgba(131,153,88,0.12)" : "transparent",
                  color: hovDL ? C.primaryText : C.secondaryText, border: "1.5px solid transparent"
                }}
              >
                <Icon hov={hovDL}><Download size={16} /></Icon>Resume
              </motion.button>
            </MagnetWrap>
          </motion.div>
        </div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45, duration: 0.65, ease: EASE_OUT_EXPO }}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <TypingCode />
          <NowPlaying />
        </motion.div>
      </motion.div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,600;0,700;1,600;1,700&family=DM+Sans:wght@400;600;700&family=DM+Mono:wght@400&display=swap');`}</style>
    </div>
  );
};

export default HeroSection;