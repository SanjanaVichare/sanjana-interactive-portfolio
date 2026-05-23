/**
 * PortfolioPage.tsx  — with 3-state scroll-driven character
 *
 * STATE MACHINE
 *   "idle"      → on load / scroll = 0   → wave-loop (frames 0–17)
 *   "scrolling" → scroll > 12 px         → scroll drives frame + position
 *   "landed"    → progress >= 92 %       → sit-bob loop (last 8 frames)
 */

import {
    motion,
    AnimatePresence,
    useMotionValue,
    useSpring,
    useScroll,
    useTransform,
} from "framer-motion";
import {
    Github,
    Linkedin,
    Mail,
    Download,
    ArrowDown,
    Gamepad2,
    Brain,
    Palette,
    Database,
    Code,
    Info,
    ExternalLink,
    Music2,
} from "lucide-react";
import {
    useRef,
    useState,
    useEffect,
    useCallback,
    ReactNode,
    CSSProperties,
} from "react";
import ProjectsSection from "./ProjectsSection";
import SkillsSection from "./SkillsSection";

// ─── Bulk-load all frames ─────────────────────────────────────────────────────
const frameModules = import.meta.glob<{ default: string }>(
    "/src/assets/img/_MConverter.eu_veo-video-*.png",
    { eager: true }
);

const FRAMES: string[] = Object.entries(frameModules)
    .sort(([a], [b]) => {
        const numA = parseInt(a.match(/-(\d+)\.png$/)?.[1] ?? "0", 10);
        const numB = parseInt(b.match(/-(\d+)\.png$/)?.[1] ?? "0", 10);
        return numA - numB;
    })
    .map(([, mod]) => mod.default);

// ─── Frame / timing constants ─────────────────────────────────────────────────
const IDLE_WAVE_FRAMES = 18;
const IDLE_WAVE_FPS = 10;
const IDLE_SIT_FRAMES = 8;
const IDLE_SIT_FPS = 7;
const SCROLL_THRESHOLD = 12;
const LAND_THRESHOLD = 0.92;

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
    pageBg: "#F7F4D5",
    primaryText: "#0A3323",
    moss: "#839958",
    accent: "#105666",
    rose: "#D3968C",
    forest: "#063C2B",
    border: "rgba(10,51,35,0.13)",
} as const;

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

const pill: CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: "8px",
    padding: "12px 24px", borderRadius: "999px", fontSize: "0.86rem",
    fontWeight: 700, letterSpacing: "0.04em",
    fontFamily: "'DM Sans', sans-serif", textDecoration: "none",
    cursor: "pointer", border: "none", outline: "none",
    transition: "background 0.25s, color 0.25s, border-color 0.25s, box-shadow 0.3s, transform 0.2s",
};

const smoothstep = (t: number) =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.55, ease: EASE_OUT_EXPO },
});

const scrollFadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.55, delay, ease: EASE_OUT_EXPO },
});

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

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

function useTyping(lines: string[], typeMs = 68, eraseMs = 32, pauseMs = 1400) {
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
        setIdx((i) => (i + 1) % lines.length);
        setPhase("type");
    }, [text, phase, idx, lines, typeMs, eraseMs, pauseMs]);

    return { text, idx };
}

// ═══════════════════════════════════════════════════════════════════════════════
// TYPING CODE BLOCK
// ═══════════════════════════════════════════════════════════════════════════════

type Token = { t: "cm" | "kw" | "str" | "plain"; v: string };
type CodeLine = { tokens: Token[] };

const CODE_LINES: CodeLine[] = [
    { tokens: [{ t: "cm", v: "// who's building this?" }] },
    { tokens: [{ t: "kw", v: "const" }, { t: "plain", v: " me = {" }] },
    { tokens: [{ t: "plain", v: "  role: " }, { t: "str", v: '"Full-Stack Developer"' }, { t: "plain", v: "," }] },
    { tokens: [{ t: "plain", v: "  loves: " }, { t: "str", v: '"turning ideas into software"' }, { t: "plain", v: "," }] },
    { tokens: [{ t: "plain", v: "  status: " }, { t: "str", v: '"always shipping"' }, { t: "plain", v: "," }] },
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
    const [chars, setChars] = useState<FlatChar[]>([]);
    const [done, setDone] = useState(false);

    useEffect(() => {
        const flat = buildFlat();
        let i = 0;
        let timer: ReturnType<typeof setTimeout>;
        function tick() {
            if (i >= flat.length) { setDone(true); return; }
            const item = flat[i];
            if (item) setChars((prev) => [...prev, item]);
            i++;
            timer = setTimeout(tick, Math.random() * 38 + 14);
        }
        const t = setTimeout(tick, 900);
        return () => { clearTimeout(t); clearTimeout(timer); };
    }, []);

    const lines: { char: string; color: string }[][] = [[]];
    chars.forEach((c) => {
        if (c.isNewline) lines.push([]);
        else lines[lines.length - 1].push({ char: c.char, color: c.color });
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.55, ease: EASE_OUT_EXPO }}
            style={{
                background: "#0d2b1e",
                borderRadius: "14px",
                padding: "16px 18px",
                fontFamily: "'DM Mono', 'Fira Code', monospace",
                fontSize: "0.75rem",
                lineHeight: 1.85,
                border: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
                {["#ff5f57", "#febc2e", "#28c840"].map((bg) => (
                    <div key={bg} style={{ width: 9, height: 9, borderRadius: "50%", background: bg }} />
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
                            style={{ display: "inline-block", width: 2, height: "0.85em", background: "#D3968C", verticalAlign: "middle", marginLeft: 1 }}
                        />
                    )}
                </div>
            ))}
        </motion.div>
    );
}

const SONGS = [
    { title: "Ditto", artist: "NewJeans", album: "OMG", duration: 185 },
    { title: "Gone", artist: "ROSÉ", album: "rosie", duration: 197 },
    { title: "7 rings", artist: "Ariana Grande", album: "thank u, next", duration: 178 },
    { title: "Stitches", artist: "Shawn Mendes", album: "Handwritten", duration: 207 },
    { title: "TGIF", artist: "Katy Perry", album: "143", duration: 177 },
    { title: "Youngblood", artist: "5 Seconds of Summer", album: "Youngblood", duration: 222 },
    { title: "On the Floor", artist: "Jennifer Lopez", album: "Love?", duration: 234 }
];

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const SHUFFLED = shuffle(SONGS);

// ═══════════════════════════════════════════════════════════════════════════════
// NOW PLAYING
// ═══════════════════════════════════════════════════════════════════════════════

function NowPlaying() {
    const [idx, setIdx] = useState(0);
    const [progress, setProgress] = useState(0);
    const [playing, setPlaying] = useState(true);

    const SONG = SHUFFLED[idx];

    useEffect(() => {
        setProgress(0);
    }, [idx]);

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

    const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    const pct = Math.round((progress / SONG.duration) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.55, ease: EASE_OUT_EXPO }}
            style={{
                background: "rgba(211,150,140,0.10)",
                border: "1px solid rgba(211,150,140,0.22)",
                borderRadius: "14px",
                padding: "14px 16px",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px" }}>
                <motion.div
                    animate={playing ? { rotate: 360 } : {}}
                    transition={playing ? { repeat: Infinity, duration: 4, ease: "linear" } : {}}
                >
                    <Music2 size={12} color={C.rose} />
                </motion.div>
                <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.rose, fontFamily: "'DM Sans', sans-serif" }}>
                    Now coding to
                </span>
            </div>

            <div style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "0.92rem", fontWeight: 700, color: C.primaryText, fontFamily: "'Cormorant Garamond', Georgia, serif", lineHeight: 1.2 }}>
                    {SONG.title}
                </div>
                <div style={{ fontSize: "0.75rem", color: C.moss, fontFamily: "'DM Sans', sans-serif", marginTop: "3px" }}>
                    {SONG.artist} · {SONG.album}
                </div>
            </div>

            <div
                onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setProgress(Math.round(((e.clientX - rect.left) / rect.width) * SONG.duration));
                }}
                style={{ background: "rgba(10,51,35,0.12)", borderRadius: "4px", height: "3px", cursor: "pointer", marginBottom: "7px" }}
            >
                <div style={{ width: `${pct}%`, height: "100%", background: C.rose, borderRadius: "4px", transition: "width 1s linear" }} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.68rem", color: C.moss, fontFamily: "'DM Sans', sans-serif" }}>{fmt(progress)}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button onClick={() => setIdx((i) => (i - 1 + SHUFFLED.length) % SHUFFLED.length)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={C.accent}><polygon points="19,3 5,12 19,21" /><rect x="3" y="3" width="3" height="18" rx="1" /></svg>
                    </button>
                    <button onClick={() => setPlaying((p) => !p)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                        {playing ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill={C.accent}><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill={C.accent}><polygon points="5,3 19,12 5,21" /></svg>
                        )}
                    </button>
                    <button onClick={() => setIdx((i) => (i + 1) % SHUFFLED.length)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={C.accent}><polygon points="5,3 19,12 5,21" /><rect x="18" y="3" width="3" height="18" rx="1" /></svg>
                    </button>
                </div>
                <span style={{ fontSize: "0.68rem", color: C.moss, fontFamily: "'DM Sans', sans-serif" }}>{fmt(SONG.duration)}</span>
            </div>
        </motion.div>
    );
}
// ═══════════════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function MagnetWrap({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
    const { ref, x, y, onMouseMove, onMouseLeave } = useMagnet(strength);
    return (
        <motion.div ref={ref} style={{ x, y, display: "inline-block" }} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
            {children}
        </motion.div>
    );
}

function HoverIcon({ children, active }: { children: ReactNode; active: boolean }) {
    return (
        <motion.span animate={{ rotate: active ? 8 : 0, scale: active ? 1.15 : 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 18 }} style={{ display: "flex" }}>
            {children}
        </motion.span>
    );
}

function Card({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: CSSProperties }) {
    return (
        <motion.div {...scrollFadeUp(delay)}
            whileHover={{ y: -5, boxShadow: "0 18px 48px rgba(10,51,35,0.16)" }}
            style={{ borderRadius: 20, padding: 26, boxSizing: "border-box", boxShadow: "0 4px 24px rgba(10,51,35,0.08)", ...style }}>
            {children}
        </motion.div>
    );
}

function CardLabel({ text, color = "rgba(247,244,213,0.45)" }: { text: string; color?: string }) {
    return (
        <div style={{ fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color, marginBottom: 18 }}>{text}</div>
    );
}

function DragChip({ icon, label }: { icon: ReactNode; label: string }) {
    return (
        <motion.div drag dragElastic={0.5} dragMomentum={false}
            whileHover={{ scale: 1.08 }} whileDrag={{ scale: 1.12, zIndex: 50, cursor: "grabbing" }}
            style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: C.accent, color: C.pageBg, borderRadius: 999,
                padding: "7px 14px", fontSize: 12, fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif", cursor: "grab",
                userSelect: "none", touchAction: "none",
                boxShadow: "0 2px 10px rgba(0,0,0,0.22)", whiteSpace: "nowrap", position: "relative",
            }}>
            {icon}{label}
        </motion.div>
    );
}

interface StatItem { label: string; value: number; tooltip?: string }

function StatBar({ stat, delay }: { stat: StatItem; delay: number }) {
    const [current, setCurrent] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [showTip, setShowTip] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const t = setTimeout(() => setCurrent(stat.value), delay * 1000 + 100);
        return () => clearTimeout(t);
    }, [stat.value, delay]);

    const getPercent = (clientX: number) => {
        if (!trackRef.current) return 0;
        const rect = trackRef.current.getBoundingClientRect();
        return Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)));
    };

    const startDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        setIsDragging(true);
        setCurrent(getPercent("touches" in e ? e.touches[0].clientX : e.clientX));
        const move = (ev: MouseEvent | TouchEvent) => setCurrent(getPercent("touches" in ev ? ev.touches[0].clientX : ev.clientX));
        const end = () => {
            setIsDragging(false); setCurrent(stat.value);
            window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", end);
            window.removeEventListener("touchmove", move); window.removeEventListener("touchend", end);
        };
        window.addEventListener("mousemove", move); window.addEventListener("mouseup", end);
        window.addEventListener("touchmove", move); window.addEventListener("touchend", end);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stat.value]);

    return (
        <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5, gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontSize: 12, color: C.pageBg, whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif" }}>{stat.label}</span>
                    {stat.tooltip && (
                        <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
                            onMouseEnter={() => setShowTip(true)} onMouseLeave={() => setShowTip(false)}>
                            <Info size={11} style={{ color: C.pageBg, opacity: 0.4, cursor: "help" }} />
                            <AnimatePresence>
                                {showTip && (
                                    <motion.div initial={{ opacity: 0, y: 4, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 4, scale: 0.95 }} transition={{ duration: 0.15 }}
                                        style={{
                                            position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
                                            zIndex: 400, width: 180, background: C.primaryText, color: C.pageBg,
                                            borderRadius: 10, padding: "9px 11px", fontSize: 11.5, lineHeight: 1.5,
                                            boxShadow: "0 8px 24px rgba(0,0,0,0.32)", pointerEvents: "none",
                                            border: `1px solid rgba(131,153,88,0.25)`, fontFamily: "'DM Sans', sans-serif",
                                        }}>
                                        {stat.tooltip}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
                <span style={{ fontSize: 11, color: C.pageBg, opacity: 0.6, flexShrink: 0, fontFamily: "'DM Sans', sans-serif" }}>{current}%</span>
            </div>
            <div ref={trackRef} onMouseDown={startDrag} onTouchStart={startDrag}
                style={{ height: 5, background: "rgba(10,51,35,0.25)", borderRadius: 99, position: "relative", cursor: "ew-resize" }}>
                <div style={{
                    height: "100%", width: `${current}%`, background: C.pageBg, borderRadius: 99,
                    transition: isDragging ? "none" : "width 0.7s cubic-bezier(0.34,1.56,0.64,1)", position: "relative",
                }}>
                    <div style={{
                        position: "absolute", right: -5, top: "50%", transform: "translateY(-50%)",
                        width: 11, height: 11, borderRadius: "50%", background: C.pageBg,
                        border: `2px solid ${C.primaryText}`, opacity: isDragging ? 1 : 0, transition: "opacity 0.2s",
                    }} />
                </div>
            </div>
        </div>
    );
}

interface SocBtnDef { icon: ReactNode; label: string; url: string; preview?: ReactNode }

function Popup({ title, items }: { title: string; items: string[] }) {
    return (
        <div style={{
            background: C.forest, border: "1px solid rgba(131,153,88,0.4)", borderRadius: 14,
            padding: "14px 16px", minWidth: 190, boxShadow: "0 12px 36px rgba(0,0,0,0.32)",
            color: C.pageBg, fontFamily: "'DM Sans', sans-serif",
        }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, opacity: 0.7 }}>{title}</div>
            {items.map((item, i) => (
                <div key={i} style={{ fontSize: 12.5, padding: "5px 0", borderTop: i > 0 ? "1px solid rgba(247,244,213,0.08)" : "none" }}>{item}</div>
            ))}
        </div>
    );
}

function SocButton({ btn }: { btn: SocBtnDef }) {
    const [open, setOpen] = useState(false);
    const [hovered, setHovered] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout>>();
    const { ref, x, y, onMouseMove, onMouseLeave: magnetLeave } = useMagnet(0.35);
    const enter = () => { clearTimeout(timer.current); setOpen(true); setHovered(true); };
    const leave = () => { timer.current = setTimeout(() => setOpen(false), 120); setHovered(false); magnetLeave(); };
    return (
        <div style={{ position: "relative", display: "inline-block" }}>
            <motion.div ref={ref} style={{ x, y, display: "inline-block" }} onMouseMove={onMouseMove} onMouseLeave={leave}>
                <motion.a href={btn.url} target="_blank" rel="noopener noreferrer"
                    onHoverStart={enter} onHoverEnd={leave} whileTap={{ scale: 0.94 }}
                    style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        background: hovered && btn.preview ? C.accent : C.rose,
                        color: C.pageBg, borderRadius: 999, padding: "9px 17px",
                        fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                        textDecoration: "none", cursor: "pointer",
                        boxShadow: hovered ? "0 10px 28px rgba(10,51,35,0.22)" : "0 3px 10px rgba(10,51,35,0.12)",
                        transition: "background 0.2s, box-shadow 0.25s",
                    }}>
                    <motion.span animate={{ scale: hovered ? 1.18 : 1, rotate: hovered ? 8 : 0 }}
                        transition={{ type: "spring", stiffness: 380, damping: 18 }} style={{ display: "flex" }}>
                        {btn.icon}
                    </motion.span>
                    {btn.label}
                    {btn.preview && <ExternalLink size={10} style={{ opacity: 0.45 }} />}
                </motion.a>
            </motion.div>
            <AnimatePresence>
                {open && btn.preview && (
                    <motion.div initial={{ opacity: 0, y: 6, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.95 }} transition={{ duration: 0.15 }}
                        onMouseEnter={enter} onMouseLeave={leave}
                        style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", zIndex: 300, pointerEvents: "auto" }}>
                        {btn.preview}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════════════════════════

function HeroSection({ heroSlotRef }: { heroSlotRef: React.RefObject<HTMLDivElement> }) {
    const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
    const h = (name: string) => ({
        onMouseEnter: () => setHoveredBtn(name),
        onMouseLeave: () => setHoveredBtn(null),
    });

    return (
        <div id="hero-section" style={{
            position: "relative", width: "100%", minHeight: "100vh",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", background: C.pageBg,
        }}>
            <div style={{
                position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
                background: `
                    radial-gradient(ellipse 60% 70% at 74% 55%, rgba(16,86,102,0.10) 0%, transparent 68%),
                    radial-gradient(ellipse 50% 60% at 34% 64%, rgba(211,150,140,0.13) 0%, transparent 64%),
                    radial-gradient(ellipse 80% 50% at 50%  0%, rgba(131,153,88,0.06) 0%, transparent 58%)
                `,
            }} />

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
                style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 1280, padding: "0 clamp(1.5rem, 5vw, 4rem)" }}>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem, 5vw, 7rem)", alignItems: "center" }}>

                    {/* ── Left column ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                        <motion.p {...fadeUp(0.15)} style={{
                            fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.22em",
                            textTransform: "uppercase", color: C.moss,
                            fontFamily: "'DM Sans', sans-serif", margin: 0,
                        }}>
                            Web Developer · App Developer · Hobbyist Game Dev
                        </motion.p>

                        <motion.h1 {...fadeUp(0.28)} style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: "clamp(3.2rem, 6.5vw, 5.5rem)",
                            fontWeight: 800, lineHeight: 1.04,
                            letterSpacing: "-0.02em", color: C.primaryText, margin: 0,
                        }}>
                            Sanjana<br></br>Vichare
                        </motion.h1>

                        <motion.p {...fadeUp(0.42)} style={{
                            fontSize: "1.02rem", color: C.accent, opacity: 0.85,
                            maxWidth: 460, lineHeight: 1.8,
                            fontFamily: "'DM Sans', sans-serif", margin: 0,
                        }}>
                            I'm a college student and developer passionate about crafting interactive,
                            human-centred technology — from Flutter mobile apps and full-stack systems
                            to experimental game projects. I love turning ideas into polished, living software.
                        </motion.p>

                        <motion.div {...fadeUp(0.54)} style={{ display: "flex", flexWrap: "nowrap", gap: "0.7rem", paddingTop: "0.25rem" }}>                            <MagnetWrap>
                            <motion.button {...h("projects")}
                                onClick={() => document.getElementById("projects-section")?.scrollIntoView({ behavior: "smooth" })}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    ...pill,
                                    background: hoveredBtn === "projects" ? C.primaryText : C.accent,
                                    color: C.pageBg,
                                    boxShadow: hoveredBtn === "projects" ? "0 14px 36px rgba(10,51,35,0.24)" : "0 6px 20px rgba(16,86,102,0.25)",
                                }}>
                                <HoverIcon active={hoveredBtn === "projects"}><ArrowDown size={15} /></HoverIcon>
                                View Projects
                            </motion.button>
                        </MagnetWrap>

                            <MagnetWrap>
                                <motion.a href="https://linkedin.com/in/sanjana-vichare" target="_blank" rel="noopener noreferrer"
                                    {...h("li")} whileTap={{ scale: 0.95 }}
                                    style={{
                                        ...pill,
                                        background: hoveredBtn === "li" ? "rgba(131,153,88,0.1)" : "transparent",
                                        color: hoveredBtn === "li" ? C.primaryText : C.moss,
                                        border: "1.5px solid transparent",
                                    }}>
                                    <HoverIcon active={hoveredBtn === "li"}><Linkedin size={15} /></HoverIcon>
                                    LinkedIn
                                </motion.a>
                            </MagnetWrap>

                            <MagnetWrap>
                                <motion.button {...h("dl")} whileTap={{ scale: 0.95 }}
                                    style={{
                                        ...pill,
                                        background: hoveredBtn === "dl" ? "rgba(131,153,88,0.1)" : "transparent",
                                        color: hoveredBtn === "dl" ? C.primaryText : C.moss,
                                        border: "1.5px solid transparent",
                                    }}>
                                    <HoverIcon active={hoveredBtn === "dl"}><Download size={15} /></HoverIcon>
                                    Resume
                                </motion.button>
                            </MagnetWrap>
                        </motion.div>
                    </div>

                    {/* ── Right column: character slot + code + now playing ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.7, ease: EASE_OUT_EXPO }}
                        style={{ display: "flex", flexDirection: "column", gap: 16 }}
                    >

                        {/* Code snippet */}
                        <TypingCode />

                        {/* Now playing */}
                        <NowPlaying />
                    </motion.div>

                </div>
            </motion.div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ABOUT SECTION
// ═══════════════════════════════════════════════════════════════════════════════

const CHIPS: { icon: ReactNode; label: string }[] = [
    { icon: <Brain size={12} />, label: "AI & Computer Vision" },
    { icon: <Code size={12} />, label: "Full-Stack Web" },
    { icon: <Palette size={12} />, label: "Mobile Apps" },
    { icon: <Database size={12} />, label: "Data & SQL" },
    { icon: <Gamepad2 size={12} />, label: "Game Dev" },
];

const STATS: StatItem[] = [
    { label: "Problem Solving", value: 92, tooltip: "Breaking complex problems into clean, working systems." },
    { label: "Full-Stack Development", value: 88, tooltip: "Flask, React, Flutter — comfortable across the whole stack." },
    { label: "Database Design", value: 85, tooltip: "SQLite, MongoDB, SQL — structuring and querying data efficiently." },
    { label: "UI & UX Craft", value: 83, tooltip: "Building interfaces people actually enjoy using." },
    { label: "AI & Computer Vision", value: 80, tooltip: "Built a real-time Indian Sign Language recognition system using Python and CV." },
    { label: "Mobile Development", value: 86, tooltip: "Flutter apps with real clients — location tracking, admin dashboards, Excel uploads." },
    { label: "Shipping Under Pressure", value: 91, tooltip: "Delivered for real clients including a sports org and a finance company." },
    { label: "Late Night Vibe Coding", value: 95, tooltip: "Peak productivity hours usually happen after midnight." },
];

const gridBase: CSSProperties = { display: "grid", gap: 18, marginBottom: 18 };

function AboutSection({ profileCardRef }: { profileCardRef: React.RefObject<HTMLDivElement> }) {
    const { text: typed, idx: lineIdx } = useTyping([
        "> building full-stack web apps",
        "> shipping Flutter mobile apps",
        "> training computer vision models",
        "> designing data-driven systems",
    ]);

    const socials: SocBtnDef[] = [
        {
            icon: <Github size={14} />, label: "GitHub",
            url: "https://github.com/SanjanaVichare",
            preview: <Popup title="GitHub" items={["Projects & experiments", "Indian Sign Language AI", "HashDrop"]} />,
        },
        {
            icon: <Linkedin size={14} />, label: "LinkedIn",
            url: "https://linkedin.com/in/sanjana-vichare",
            preview: <Popup title="LinkedIn" items={["Software Developer", "Flutter · AI · Games"]} />,
        },
        { icon: <Mail size={14} />, label: "Email", url: "mailto:sanjanastudys@gmail.com" },
    ];

    return (
        <section id="about-section" style={{ background: C.pageBg, padding: "0 clamp(1.5rem, 5vw, 4rem) clamp(3rem, 8vw, 6rem)" }}>
            <div style={{ maxWidth: 1120, margin: "0 auto" }}>
                <motion.h2 {...scrollFadeUp(0)} style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)", fontWeight: 700,
                    color: C.primaryText, textAlign: "center",
                    letterSpacing: "-0.025em", marginBottom: "3rem",
                }}>
                    About Me
                </motion.h2>

                <div style={{ ...gridBase, gridTemplateColumns: "1fr 1fr 1fr" }}>
                    <Card delay={0.05} style={{ background: C.pageBg, border: `1.5px solid ${C.border}`, position: "relative", paddingTop: 26, overflow: "visible" }}>                        <div ref={profileCardRef} style={{ position: "absolute", top: -10, left: 0, right: 0, height: 1, pointerEvents: "none" }} />
                        <div style={{ position: "absolute", bottom: -30, right: -20, width: 110, height: 110, borderRadius: "50%", background: "radial-gradient(circle, rgba(211,150,140,0.18), transparent 70%)", pointerEvents: "none" }} />
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                            style={{ width: 52, height: 52, borderRadius: "50%", background: C.accent, color: C.pageBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, marginBottom: 18, fontFamily: "'DM Sans', sans-serif" }}>
                            SV
                        </motion.div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: C.primaryText, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>Sanjana Vichare</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.moss, marginBottom: 14, fontFamily: "'DM Sans', sans-serif" }}>Creative Software Developer</div>
                        <p style={{ fontSize: 13, lineHeight: 1.85, color: "#2d4a3a", margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                            Full-stack developer with real shipped projects — from AI accessibility tools and Flutter apps to secure web platforms and an investigation game. I build things that actually get used.
                        </p>
                    </Card>

                    <Card delay={0.1} style={{ background: C.forest }}>
                        <CardLabel text="Interests" />
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {CHIPS.map((c) => <DragChip key={c.label} icon={c.icon} label={c.label} />)}
                        </div>
                        <p style={{ fontSize: 10, color: "rgba(247,244,213,0.3)", marginTop: 16, marginBottom: 0, fontFamily: "'DM Sans', sans-serif" }}>drag the chips around</p>
                    </Card>

                    <Card delay={0.15} style={{ background: C.moss }}>
                        <CardLabel text="What I Build" color="rgba(10,51,35,0.5)" />
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "clamp(15px, 1.9vw, 19px)", fontWeight: 500, color: C.primaryText, minHeight: 80, lineHeight: 1.45, display: "flex", alignItems: "flex-start", flexWrap: "wrap" }}>
                            <span>{typed}</span>
                            <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.75, repeat: Infinity }}
                                style={{ display: "inline-block", width: 2, height: "1.1em", background: C.primaryText, marginLeft: 2, borderRadius: 1, flexShrink: 0 }} />
                        </div>
                        <div style={{ display: "flex", gap: 6, marginTop: 20 }}>
                            {[0, 1, 2, 3].map((i) => (
                                <motion.div key={i} animate={{ width: i === lineIdx ? 22 : 7, opacity: i === lineIdx ? 1 : 0.3 }}
                                    transition={{ duration: 0.3 }} style={{ height: 3, borderRadius: 2, background: C.primaryText }} />
                            ))}
                        </div>
                    </Card>
                </div>

                <div style={{ ...gridBase, gridTemplateColumns: "1fr 2fr", marginBottom: 0 }}>
                    <Card delay={0.2} style={{ background: C.pageBg, border: "1.5px solid rgba(211,150,140,0.35)" }}>
                        <CardLabel text="Connect" color={C.moss} />
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
                            {socials.map((btn) => <SocButton key={btn.label} btn={btn} />)}
                        </div>
                        <p style={{ fontSize: 10, color: C.moss, opacity: 0.5, marginTop: 14, marginBottom: 0, fontFamily: "'DM Sans', sans-serif" }}>hover GitHub &amp; LinkedIn to preview</p>
                    </Card>

                    <Card delay={0.25} style={{ background: C.moss }}>
                        <CardLabel text="Developer Stats" color="rgba(10,51,35,0.5)" />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 38px" }}>
                            {STATS.map((s, i) => <StatBar key={s.label} stat={s} delay={0.35 + i * 0.08} />)}
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAV + SCROLLBAR
// ═══════════════════════════════════════════════════════════════════════════════

function Nav() {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", h, { passive: true });
        return () => window.removeEventListener("scroll", h);
    }, []);

    const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

    const navLinkStyle: CSSProperties = {
        fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em",
        textTransform: "uppercase", color: C.moss, textDecoration: "none",
        fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
        background: "none", border: "none",
        padding: "6px 14px", borderRadius: "999px",
        transition: "color 0.2s, background 0.2s",
    };

    return (
        <motion.nav
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            style={{
                position: "fixed",
                top: 8,
                left: "1.5rem",
                right: "1.5rem",
                width: "auto",
                maxWidth: 2000,
                marginLeft: "auto",
                marginRight: "auto",
                zIndex: 100,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0 clamp(1rem, 3vw, 2rem)",
                height: "64px",
                background: scrolled ? "rgba(247,244,213,0.92)" : "rgba(247,244,213,0.6)",
                backdropFilter: "blur(16px)",
                boxShadow: scrolled
                    ? `0 4px 24px rgba(10,51,35,0.12), 0 1px 0 ${C.border}`
                    : `0 2px 12px rgba(10,51,35,0.06)`,
                borderRadius: "999px",
                border: `1px solid ${C.border}`,
                transition: "background 0.4s, box-shadow 0.4s",
            }}
        >
            <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.1rem", fontWeight: 700,
                color: C.primaryText, letterSpacing: "-0.02em",
            }}>
                SV<span style={{ color: C.accent }}>.</span>
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                {(["Home", "About", "Projects", "Contact"] as const).map((link) => (

                    <a key={link}
                        href="#"
                        style={navLinkStyle}
                        onClick={(e) => {
                            e.preventDefault();
                            if (link === "Home") scrollTo("hero-section");
                            if (link === "About") scrollTo("about-section");
                            if (link === "Projects") scrollTo("projects-section");
                            if (link === "Contact") scrollTo("contact-section");
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = C.primaryText;
                            e.currentTarget.style.background = "rgba(10,51,35,0.07)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = C.moss;
                            e.currentTarget.style.background = "none";
                        }}
                    >
                        {link}
                    </a>
                ))}
            </div>
        </motion.nav>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function PortfolioPage() {
    const heroSlotRef = useRef<HTMLDivElement>(null);
    const profileCardRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,600;0,700;1,600;1,700&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
                *, *::before, *::after { box-sizing: border-box; }
                html { scroll-behavior: smooth; }
                body { margin: 0; background: #F7F4D5; }
            `}</style>
            <Nav />
            <main>
                <HeroSection heroSlotRef={heroSlotRef} />
                <AboutSection profileCardRef={profileCardRef} />
                <SkillsSection />
                <ProjectsSection />
            </main>
        </>
    );
}