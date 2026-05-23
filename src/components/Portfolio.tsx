import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface Project {
    emoji: string;
    title: string;
    desc: string;
    tech: string[];
    accent: string;
}

interface Stat {
    label: string;
    value: number;
    color: string;
}

interface SkillGroup {
    icon: string;
    title: string;
    chips: string[];
    rotate: string;
    accent: string;
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const PROJECTS: Project[] = [
    {
        emoji: "🤟",
        title: "AI Indian Sign Language",
        desc: "Recognizes hand gestures in real time and converts them to text and speech using computer vision and NLP pipelines.",
        tech: ["Python", "Computer Vision", "NLP", "OpenCV"],
        accent: "#FFD84D",
    },
    {
        emoji: "🚗",
        title: "SV Enterprises App",
        desc: "Employee & vehicle tracking application with an admin dashboard, real-time sync, and rich reporting features.",
        tech: ["Flutter", "SQLite", "Flask API", "Dart"],
        accent: "#FF7DAE",
    },
    {
        emoji: "🔐",
        title: "HashDrop",
        desc: "Secure document sharing platform with 2-step verification, encrypted hashing, and clean access controls.",
        tech: ["Flask", "MongoDB", "JavaScript", "JWT"],
        accent: "#6ED3CF",
    },
    {
        emoji: "💰",
        title: "Finance Manager",
        desc: "Salary management and ID card generation system with an intuitive admin interface and PDF export.",
        tech: ["Flask", "HTML/CSS", "JavaScript", "SQL"],
        accent: "#FFD84D",
    },
    {
        emoji: "🕵️",
        title: "Dataective",
        desc: "A crime investigation game where players solve mysteries by writing SQL queries and applying logical deduction.",
        tech: ["React", "TypeScript", "SQLite", "Game Design"],
        accent: "#FF7DAE",
    },
    {
        emoji: "🏢",
        title: "Facility Management",
        desc: "End-to-end cleaning service management with scheduling, staff tracking, and reporting dashboards.",
        tech: ["Flask", "SQL", "TypeScript", "REST API"],
        accent: "#6ED3CF",
    },
];

const STATS: Stat[] = [
    { label: "Problem Solving", value: 92, color: "#FFD84D" },
    { label: "System Design", value: 84, color: "#FF7DAE" },
    { label: "Code Quality", value: 88, color: "#6ED3CF" },
    { label: "Debugging", value: 90, color: "#FFD84D" },
    { label: "UI Craftsmanship", value: 83, color: "#FF7DAE" },
    { label: "Learning Velocity", value: 95, color: "#6ED3CF" },
    { label: "Late Night Vibe Coding 🌙", value: 95, color: "#FFD84D" },
    { label: "Game Development", value: 89, color: "#FF7DAE" },
];

const SKILLS: SkillGroup[] = [
    {
        icon: "📝",
        title: "LANGUAGES",
        chips: ["Python", "JavaScript", "TypeScript", "Dart", "SQL", "HTML/CSS"],
        rotate: "-1.5deg",
        accent: "#FFD84D",
    },
    {
        icon: "⚛️",
        title: "FRAMEWORKS",
        chips: ["React", "Flutter", "Flask", "Express", "Tailwind CSS"],
        rotate: "1.2deg",
        accent: "#FF7DAE",
    },
    {
        icon: "🛠️",
        title: "TOOLS",
        chips: ["Git", "MongoDB", "SQLite", "Firebase", "Figma", "Postman"],
        rotate: "-0.8deg",
        accent: "#6ED3CF",
    },
    {
        icon: "🎮",
        title: "DEVELOPMENT",
        chips: ["Game Dev", "Mobile Apps", "REST APIs", "Full-Stack", "CV / NLP"],
        rotate: "1deg",
        accent: "#FFD84D",
    },
];

const TERMINAL_LINES = [
    { type: "prompt", text: "whoami" },
    { type: "output", text: "sanjana_vichare — developer & game dev 🎮" },
    { type: "prompt", text: "cat skills.txt" },
    { type: "highlight", text: "Python · Flutter · React · Flask · TypeScript · SQL" },
    { type: "prompt", text: "echo $PASSION" },
    { type: "output", text: '"Building things that matter" ✨' },
    { type: "prompt", text: "ls ./projects" },
    { type: "highlight", text: "ai-sign-lang  sv-enterprises  hashdrop  dataective  facility-mgmt" },
    { type: "prompt", text: "_" },
];

/* ─────────────────────────────────────────────
   STYLE CONSTANTS
───────────────────────────────────────────── */
const C = {
    bg: "#F7F4D5",
    white: "#FFFFFF",
    text: "#0A3323",
    sub: "#839958",
    accent: "#105666",
    yellow: "#FFD84D",
    pink: "#FF7DAE",
    blue: "#6ED3CF",
    border: "2.5px solid #0A3323",
    shadow: "4px 4px 0 #0A3323",
    shadowLg: "7px 7px 0 #0A3323",
};

/* ─────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────── */
function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, visible };
}

/* ─────────────────────────────────────────────
   SMALL ATOMS
───────────────────────────────────────────── */
function SectionTag({ children, bg = C.yellow }: { children: React.ReactNode; bg?: string }) {
    const { ref, visible } = useInView();
    return (
        <div ref={ref} style={{
            display: "inline-block",
            background: bg,
            border: C.border,
            borderRadius: 8,
            padding: "6px 20px",
            fontWeight: 900,
            fontSize: "1.05rem",
            boxShadow: C.shadow,
            marginBottom: 40,
            letterSpacing: "0.06em",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
        }}>
            {children}
        </div>
    );
}

function Chip({ label }: { label: string }) {
    const [hov, setHov] = useState(false);
    return (
        <span
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                padding: "5px 13px",
                border: C.border,
                borderRadius: 999,
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                background: hov ? C.yellow : C.bg,
                cursor: "default",
                display: "inline-block",
                transform: hov ? "scale(1.1) rotate(-2deg)" : "scale(1) rotate(0deg)",
                transition: "background 0.15s, transform 0.2s cubic-bezier(.34,1.56,.64,1)",
                userSelect: "none",
            }}
        >
            {label}
        </span>
    );
}

function TechTag({ label }: { label: string }) {
    return (
        <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            padding: "3px 10px",
            background: C.bg,
            border: "1.5px solid " + C.text,
            borderRadius: 4,
        }}>
            {label}
        </span>
    );
}

function Reveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
    const { ref, visible } = useInView();
    return (
        <div ref={ref} style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
            transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
            ...style,
        }}>
            {children}
        </div>
    );
}

/* ─────────────────────────────────────────────
   NAV
───────────────────────────────────────────── */
function Nav() {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", h);
        return () => window.removeEventListener("scroll", h);
    }, []);
    const links = ["About", "Skills", "Projects", "Stats", "Contact"];
    return (
        <nav style={{
            position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
            zIndex: 900,
            background: C.white,
            border: C.border,
            borderRadius: 999,
            boxShadow: scrolled ? C.shadowLg : C.shadow,
            padding: "10px 28px",
            display: "flex", alignItems: "center", gap: 32,
            transition: "box-shadow 0.3s",
        }}>
            <a href="#hero" style={{ fontFamily: "'Caveat',cursive", fontWeight: 700, fontSize: "1.3rem", color: C.text, textDecoration: "none" }}>
                SV ✦
            </a>
            <ul style={{ display: "flex", gap: 4, listStyle: "none", margin: 0, padding: 0 }}>
                {links.map(l => <NavLink key={l} label={l} />)}
            </ul>
        </nav>
    );
}

function NavLink({ label }: { label: string }) {
    const [hov, setHov] = useState(false);
    return (
        <li>
            <a
                href={`#${label.toLowerCase()}`}
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
                style={{
                    fontSize: "0.85rem", fontWeight: 700, color: C.text,
                    textDecoration: "none", padding: "4px 11px",
                    borderRadius: 999,
                    background: hov ? C.yellow : "transparent",
                    transition: "background 0.2s",
                    display: "block",
                }}
            >{label}</a>
        </li>
    );
}

/* ─────────────────────────────────────────────
   PROGRESS BAR
───────────────────────────────────────────── */
function ProgressBar() {
    const [pct, setPct] = useState(0);
    useEffect(() => {
        const h = () => {
            const p = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            setPct(p);
        };
        window.addEventListener("scroll", h);
        return () => window.removeEventListener("scroll", h);
    }, []);
    return (
        <div style={{
            position: "fixed", top: 0, left: 0, height: 4, zIndex: 9999,
            width: pct + "%",
            background: "linear-gradient(90deg, #FFD84D, #FF7DAE, #6ED3CF)",
            borderRadius: "0 4px 4px 0",
            transition: "width 0.08s linear",
        }} />
    );
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
function Hero() {
    return (
        <section id="hero" style={{
            maxWidth: 1100, margin: "0 auto", padding: "130px 24px 100px",
            display: "flex", alignItems: "center", gap: 48, minHeight: "100vh",
        }}>
            <div style={{ flex: 1 }}>
                <Reveal>
                    <div style={{ fontFamily: "'Caveat',cursive", fontSize: "2.2rem", color: C.sub, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                        Hi there! <WaveEmoji />
                    </div>
                </Reveal>
                <Reveal delay={80}>
                    <h1 style={{ fontSize: "clamp(2.8rem,6vw,4.5rem)", fontWeight: 900, lineHeight: 1.05, marginBottom: 14 }}>
                        I'm Sanjana<br />Vichare.
                    </h1>
                </Reveal>
                <Reveal delay={160}>
                    <span style={{
                        fontFamily: "'DM Mono',monospace", fontSize: "0.95rem", color: C.accent,
                        background: C.blue, display: "inline-block",
                        padding: "4px 16px", border: C.border, borderRadius: 6,
                        boxShadow: "2px 2px 0 " + C.text, marginBottom: 22, letterSpacing: "0.02em",
                    }}>
                        Developer · Student · Game Developer
                    </span>
                </Reveal>
                <Reveal delay={240}>
                    <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: C.sub, maxWidth: 480, marginBottom: 32 }}>
                        I'm a college student and developer passionate about crafting interactive, human-centred technology — from Flutter mobile apps and full-stack systems to experimental game projects. I love turning ideas into polished, living software.
                    </p>
                </Reveal>
                <Reveal delay={320}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                        <Btn href="#projects" bg={C.yellow}>🚀 View Projects</Btn>
                        <Btn href="https://github.com" bg={C.white}>⌥ GitHub</Btn>
                        <Btn href="https://linkedin.com" bg={C.pink}>💼 LinkedIn</Btn>
                    </div>
                </Reveal>
            </div>

            <Reveal delay={200} style={{ flex: "0 0 300px", position: "relative" }}>
                <FloatIcon emoji="⚡" top="-30px" left="55px" delay={0} />
                <FloatIcon emoji="🎮" top="30px" right="-20px" delay={0.5} />
                <FloatIcon emoji="📱" bottom="60px" left="-20px" delay={1} />
                <FloatIcon emoji="🛠️" bottom="-15px" right="55px" delay={1.5} />
                <div style={{
                    width: 280, height: 320,
                    background: C.blue, border: C.border, borderRadius: 16,
                    boxShadow: C.shadowLg,
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", textAlign: "center", padding: 20,
                    rotate: "2deg", position: "relative", overflow: "hidden",
                    fontFamily: "'Caveat',cursive", color: C.accent,
                }}>
                    <div style={{ fontSize: "4.5rem", marginBottom: 8 }}>👩‍💻</div>
                    <div style={{ fontSize: "1.05rem", fontWeight: 600 }}>Your photo goes here ✨</div>
                    <div style={{ fontSize: "0.8rem", opacity: 0.65, marginTop: 4 }}>Replace with &lt;img /&gt;</div>
                    <div style={{
                        position: "absolute", bottom: -10, right: -10,
                        background: C.yellow, border: C.border, borderRadius: 8,
                        padding: "5px 12px", fontWeight: 700, fontSize: "0.95rem",
                        boxShadow: C.shadow, rotate: "-4deg",
                    }}>
                        Full-Stack Ninja 🥷
                    </div>
                </div>
            </Reveal>
        </section>
    );
}

function WaveEmoji() {
    return (
        <span style={{
            display: "inline-block",
            animation: "wave 2s infinite",
            transformOrigin: "70% 70%",
        }}>👋</span>
    );
}

function FloatIcon({ emoji, top, left, right, bottom, delay }: {
    emoji: string; top?: string; left?: string; right?: string; bottom?: string; delay: number;
}) {
    return (
        <span style={{
            position: "absolute", fontSize: "1.6rem",
            top, left, right, bottom,
            animation: `floatY 3s ${delay}s ease-in-out infinite`,
            userSelect: "none", zIndex: 2,
        }}>{emoji}</span>
    );
}

function Btn({ href, bg, children }: { href: string; bg: string; children: React.ReactNode }) {
    const [hov, setHov] = useState(false);
    return (
        <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                padding: "11px 22px", border: C.border, borderRadius: 8,
                fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "0.9rem",
                cursor: "pointer", textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 8,
                background: bg, color: C.text,
                boxShadow: hov ? C.shadowLg : C.shadow,
                transform: hov ? "translate(-2px,-2px)" : "translate(0,0)",
                transition: "transform 0.15s, box-shadow 0.15s",
            }}
        >{children}</a>
    );
}

/* ─────────────────────────────────────────────
   ABOUT
───────────────────────────────────────────── */
function About() {
    return (
        <section id="about" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
            <SectionTag>ABOUT ME</SectionTag>
            <Reveal>
                <div style={{
                    background: C.white, border: C.border, borderRadius: 16,
                    padding: "36px 40px", boxShadow: C.shadowLg,
                    fontSize: "1.05rem", lineHeight: 1.95, maxWidth: 760,
                    rotate: "-0.5deg",
                }}>
                    <p>
                        I'm a{" "}
                        <Tag bg={C.yellow}>creative developer</Tag>{" "}
                        who builds{" "}
                        <Tag bg={C.pink}>apps</Tag>,{" "}
                        <Tag bg={C.blue}>games</Tag>, and{" "}
                        <Tag bg={C.yellow}>experimental systems</Tag>{" "}
                        combining technology with creativity. I've worked across{" "}
                        <Tag bg={C.pink}>mobile development</Tag>,{" "}
                        <Tag bg={C.blue}>full-stack web</Tag>, and{" "}
                        <Tag bg={C.yellow}>game development</Tag>.
                    </p>
                    <br />
                    <p>
                        My passion for{" "}
                        <Tag bg={C.blue}>continuous learning</Tag>{" "}
                        shows in how I approach every problem — with fresh eyes and genuine curiosity. I bring{" "}
                        <Tag bg={C.yellow}>technical depth</Tag>,{" "}
                        <Tag bg={C.pink}>design sensibility</Tag>, and an enthusiasm for building{" "}
                        <Tag bg={C.blue}>impactful software solutions</Tag>.
                    </p>
                </div>
            </Reveal>
        </section>
    );
}

function Tag({ children, bg }: { children: React.ReactNode; bg: string }) {
    return (
        <span style={{
            display: "inline-block", background: bg,
            padding: "1px 9px", borderRadius: 4,
            fontWeight: 700, margin: "1px 2px", fontSize: "0.97em",
        }}>{children}</span>
    );
}

/* ─────────────────────────────────────────────
   SKILLS
───────────────────────────────────────────── */
function Skills() {
    return (
        <section id="skills" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
            <SectionTag bg={C.pink}>SKILLS</SectionTag>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}>
                {SKILLS.map((g, i) => <SkillCard key={g.title} group={g} delay={i * 80} />)}
            </div>
        </section>
    );
}

function SkillCard({ group, delay }: { group: SkillGroup; delay: number }) {
    const [hov, setHov] = useState(false);
    return (
        <Reveal delay={delay}>
            <div
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
                style={{
                    background: C.white, border: C.border, borderRadius: 14,
                    padding: 24, boxShadow: hov ? C.shadowLg : C.shadow,
                    transform: hov ? `rotate(0deg) translate(-3px,-3px)` : `rotate(${group.rotate})`,
                    transition: "transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s",
                }}
            >
                <div style={{
                    fontWeight: 900, fontSize: "0.85rem", letterSpacing: "0.08em",
                    marginBottom: 14, display: "flex", alignItems: "center", gap: 8,
                    borderBottom: "2px dashed " + group.accent, paddingBottom: 10,
                }}>
                    <span style={{ fontSize: "1.2rem" }}>{group.icon}</span>
                    {group.title}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {group.chips.map(c => <Chip key={c} label={c} />)}
                </div>
            </div>
        </Reveal>
    );
}

/* ─────────────────────────────────────────────
   PROJECTS
───────────────────────────────────────────── */
function Projects() {
    return (
        <section id="projects" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
            <SectionTag bg={C.blue}>PROJECTS</SectionTag>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 24 }}>
                {PROJECTS.map((p, i) => <ProjectCard key={p.title} project={p} delay={i * 80} />)}
            </div>
        </section>
    );
}

function ProjectCard({ project, delay }: { project: Project; delay: number }) {
    const [hov, setHov] = useState(false);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 18;
        const y = ((e.clientY - rect.top - rect.height / 2) / rect.height) * 18;
        setTilt({ x, y });
    }, []);

    return (
        <Reveal delay={delay}>
            <div
                ref={cardRef}
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => { setHov(false); setTilt({ x: 0, y: 0 }); }}
                onMouseMove={handleMove}
                style={{
                    background: C.white, border: C.border, borderRadius: 14,
                    padding: 24, boxShadow: hov ? C.shadowLg : C.shadow,
                    position: "relative", overflow: "hidden",
                    transform: hov
                        ? `translateY(-6px) rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)`
                        : "translateY(0) rotateY(0) rotateX(0)",
                    transition: hov ? "transform 0.1s, box-shadow 0.2s" : "transform 0.4s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s",
                    transformStyle: "preserve-3d",
                    perspective: "800px",
                }}
            >
                {/* top accent bar */}
                <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 5,
                    background: project.accent,
                }} />
                <div style={{ fontSize: "2rem", marginBottom: 12, marginTop: 4 }}>{project.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: "1.08rem", marginBottom: 6 }}>{project.title}</div>
                <p style={{ fontSize: "0.9rem", color: C.sub, lineHeight: 1.65, marginBottom: 14 }}>{project.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {project.tech.map(t => <TechTag key={t} label={t} />)}
                </div>
            </div>
        </Reveal>
    );
}

/* ─────────────────────────────────────────────
   STATS
───────────────────────────────────────────── */
function Stats() {
    const { ref, visible } = useInView(0.3);
    return (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
            <div ref={ref} style={{
                background: C.text, color: C.bg, borderRadius: 20,
                padding: "60px 48px", position: "relative", overflow: "hidden",
            }}>
                {/* grid overlay */}
                <div style={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    backgroundImage: `linear-gradient(rgba(247,244,213,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(247,244,213,.05) 1px,transparent 1px)`,
                    backgroundSize: "32px 32px",
                }} />
                <div id="stats" style={{ position: "relative", zIndex: 1 }}>
                    <div style={{
                        display: "inline-block", background: C.yellow, border: C.border,
                        borderRadius: 8, padding: "6px 20px", fontWeight: 900,
                        fontSize: "1.05rem", boxShadow: C.shadow, marginBottom: 40,
                        letterSpacing: "0.06em", color: C.text,
                    }}>DEV STATS 📊</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 60px" }}>
                        {STATS.map((s, i) => (
                            <StatBar key={s.label} stat={s} index={i} visible={visible} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatBar({ stat, index, visible }: { stat: Stat; index: number; visible: boolean }) {
    return (
        <div style={{ marginBottom: 20 }}>
            <div style={{
                display: "flex", justifyContent: "space-between",
                fontFamily: "'DM Mono',monospace", fontSize: "0.82rem",
                marginBottom: 8, color: "rgba(247,244,213,0.85)",
            }}>
                <span>{stat.label}</span>
                <span style={{ color: stat.color, fontWeight: 700 }}>{stat.value}%</span>
            </div>
            <div style={{
                height: 14, background: "rgba(247,244,213,0.1)",
                border: "1.5px solid rgba(247,244,213,0.15)", borderRadius: 999, overflow: "hidden",
            }}>
                <div style={{
                    height: "100%", borderRadius: 999,
                    background: stat.color,
                    width: visible ? stat.value + "%" : "0%",
                    transition: `width 1.2s cubic-bezier(.4,0,.2,1) ${index * 80}ms`,
                }} />
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   EXPERIENCE & EDUCATION
───────────────────────────────────────────── */
function Experience() {
    return (
        <section id="experience" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
            <SectionTag>EXPERIENCE & EDUCATION</SectionTag>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

                <Reveal delay={0}>
                    <ExpCard bg={C.white} rotate="-1deg">
                        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.75rem", opacity: 0.5, marginBottom: 6, letterSpacing: "0.1em" }}>WORK</div>
                        <div style={{ fontWeight: 800, fontSize: "1.15rem", marginBottom: 4 }}>Freelance Developer</div>
                        <div style={{ fontSize: "0.88rem", color: C.sub, marginBottom: 12 }}>Self-Employed · Remote</div>
                        <div style={{ fontSize: "0.9rem", lineHeight: 1.65, marginBottom: 16 }}>
                            Built mobile and web systems for clients. Specialized in Flutter apps, REST API design, database architecture, and polished UI implementation.
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {["Flutter", "APIs", "DB Design", "UI/UX", "Logic"].map(t => <TechTag key={t} label={t} />)}
                        </div>
                    </ExpCard>
                </Reveal>

                <Reveal delay={120}>
                    <ExpCard bg={C.yellow} rotate="1deg">
                        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.75rem", opacity: 0.5, marginBottom: 6, letterSpacing: "0.1em" }}>EDUCATION</div>
                        <div style={{ fontWeight: 800, fontSize: "1.15rem", marginBottom: 4 }}>Bachelor's in Computer Engineering</div>
                        <div style={{ fontSize: "0.88rem", color: C.accent, marginBottom: 12 }}>Ongoing · Present</div>
                        <div style={{ fontSize: "0.9rem", lineHeight: 1.65 }}>
                            Studying core CS fundamentals alongside building real-world projects. Passionate about combining academic knowledge with hands-on development and creative problem solving.
                        </div>
                    </ExpCard>
                </Reveal>

            </div>
        </section>
    );
}

function ExpCard({ children, bg, rotate }: { children: React.ReactNode; bg: string; rotate: string }) {
    const [hov, setHov] = useState(false);
    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: bg, border: C.border, borderRadius: 14, padding: 28,
                boxShadow: hov ? C.shadowLg : C.shadow,
                rotate: hov ? "0deg" : rotate,
                transform: hov ? "translate(-3px,-3px)" : "translate(0,0)",
                transition: "transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s, rotate 0.3s",
                height: "100%",
            }}
        >{children}</div>
    );
}

/* ─────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────── */
function Contact() {
    return (
        <section id="contact" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 60px", textAlign: "center" }}>
            <SectionTag bg={C.pink}>GET IN TOUCH</SectionTag>
            <Reveal>
                <h2 style={{ fontFamily: "'Caveat',cursive", fontSize: "2.6rem", marginBottom: 10 }}>
                    Let's build something<br />amazing together 🚀
                </h2>
            </Reveal>
            <Reveal delay={80}>
                <p style={{ color: C.sub, marginBottom: 44, fontSize: "1rem" }}>
                    Open for collaborations, freelance projects, or just a friendly chat.
                </p>
            </Reveal>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
                <ContactCard href="https://linkedin.com" emoji="💼" label="LinkedIn" bg={C.blue} rotate="-2deg" />
                <ContactCard href="https://github.com" emoji="⌥" label="GitHub" bg={C.yellow} rotate="1.5deg" />
                <ContactCard href="mailto:sanjana@example.com" emoji="✉️" label="Email" bg={C.pink} rotate="-1deg" />
            </div>
        </section>
    );
}

function ContactCard({ href, emoji, label, bg, rotate }: {
    href: string; emoji: string; label: string; bg: string; rotate: string;
}) {
    const [hov, setHov] = useState(false);
    return (
        <Reveal>
            <a
                href={href} target="_blank" rel="noreferrer"
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
                style={{
                    width: 170, height: 170, border: C.border, borderRadius: 14,
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", gap: 12,
                    boxShadow: hov ? C.shadowLg : C.shadow,
                    fontWeight: 800, fontSize: "1rem", textDecoration: "none", color: C.text,
                    background: bg,
                    rotate: hov ? "0deg" : rotate,
                    transform: hov ? "translateY(-8px)" : "translateY(0)",
                    transition: "transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s, rotate 0.3s",
                }}
            >
                <span style={{ fontSize: "2.4rem" }}>{emoji}</span>
                {label}
            </a>
        </Reveal>
    );
}

/* ─────────────────────────────────────────────
   TERMINAL MODAL
───────────────────────────────────────────── */
function Terminal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [lines, setLines] = useState<typeof TERMINAL_LINES>([]);

    useEffect(() => {
        if (!open) { setLines([]); return; }
        let i = 0;
        const id = setInterval(() => {
            setLines(prev => [...prev, TERMINAL_LINES[i]]);
            i++;
            if (i >= TERMINAL_LINES.length) clearInterval(id);
        }, 420);
        return () => clearInterval(id);
    }, [open]);

    if (!open) return null;

    const colorMap: Record<string, string> = {
        prompt: "#28c840",
        output: "#ccc",
        highlight: "#FFD84D",
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
                zIndex: 9990, display: "flex", alignItems: "center", justifyContent: "center",
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: "#0e1117", border: "2px solid #333", borderRadius: 12,
                    width: "min(520px,90vw)", overflow: "hidden",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                    animation: "termPop 0.3s cubic-bezier(.34,1.56,.64,1)",
                }}
            >
                <div style={{
                    background: "#1c1f26", padding: "10px 16px",
                    display: "flex", alignItems: "center", gap: 8,
                }}>
                    {[["#ff5f57", ""], ["#febc2e", ""], ["#28c840", ""]].map(([c], i) => (
                        <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
                    ))}
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.8rem", color: "#666", marginLeft: 8 }}>
                        sanjana@portfolio ~
                    </span>
                    <button onClick={onClose} style={{
                        marginLeft: "auto", background: "none", border: "none",
                        color: "#666", fontSize: "1.1rem", cursor: "pointer",
                    }}>✕</button>
                </div>
                <div style={{ padding: 20, fontFamily: "'DM Mono',monospace", fontSize: "0.85rem", minHeight: 200, lineHeight: 1.85 }}>
                    {lines.map((l, i) => (
                        <div key={i} style={{ color: colorMap[l.type] || "#ccc" }}>
                            {l.type === "prompt" ? <><span style={{ color: "#28c840" }}>$ </span>{l.text}</> : l.text}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer({ onTerminal }: { onTerminal: () => void }) {
    return (
        <footer style={{
            textAlign: "center", padding: "32px 24px",
            fontFamily: "'DM Mono',monospace", fontSize: "0.8rem", color: C.sub,
            borderTop: "1.5px solid rgba(10,51,35,0.15)",
        }}>
            <div><strong style={{ color: C.text }}>SANJANA VICHARE</strong> · Developer · Student · Game Developer</div>
            <div style={{ marginTop: 4 }}>© 2025 Sanjana Vichare · Built with ♥ and lots of ☕</div>
            <button
                onClick={onTerminal}
                style={{
                    marginTop: 14, display: "inline-flex", alignItems: "center", gap: 8,
                    background: C.text, color: C.yellow, padding: "8px 16px",
                    borderRadius: 8, fontFamily: "'DM Mono',monospace", fontSize: "0.8rem",
                    cursor: "pointer", border: "none",
                }}
            >
                {">"}_Terminal
            </button>
        </footer>
    );
}

/* ─────────────────────────────────────────────
   GLOBAL STYLES (injected once)
───────────────────────────────────────────── */
const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=DM+Mono:ital,wght@0,400;0,500;1,400&family=Nunito:wght@400;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    font-family: 'Nunito', sans-serif;
    background-color: #F7F4D5;
    color: #0A3323;
    overflow-x: hidden;
  }
  body::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(10,51,35,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(10,51,35,0.07) 1px, transparent 1px);
    background-size: 32px 32px;
    z-index: -1;
    pointer-events: none;
  }
  @keyframes wave {
    0%,100% { transform: rotate(0deg); }
    15% { transform: rotate(20deg); }
    30% { transform: rotate(-8deg); }
    45% { transform: rotate(16deg); }
  }
  @keyframes floatY {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
  @keyframes termPop {
    from { transform: scale(0.8); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }
  @media (max-width: 768px) {
    #hero { flex-direction: column !important; text-align: center; }
    .hero-right { display: none; }
  }
`;

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
export default function Portfolio() {
    const [termOpen, setTermOpen] = useState(false);

    return (
        <>
            <style>{GLOBAL_STYLE}</style>

            <Nav />
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Stats />
            <Experience />
            <Contact />
            <Footer onTerminal={() => setTermOpen(true)} />
            <Terminal open={termOpen} onClose={() => setTermOpen(false)} />
        </>
    );
}