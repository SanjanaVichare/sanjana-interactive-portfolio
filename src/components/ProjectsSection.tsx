import { motion } from "framer-motion";

import projectAiSign from "@/assets/project-ai-sign.png";
import projectSvEnterprises from "@/assets/project-sv-enterprises.jpg";
import projectAlienEscape from "@/assets/project-alien-escape.png";
import projectHashdrop from "@/assets/project-hashdrop.jpg";
import projectFinance from "@/assets/project-finance.jpg";
import projectDressmeup from "@/assets/project-dressmeup.png";

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  dark: "#0A3323",
  moss: "#839958",
  beige: "#F7F4D5",
  rosy: "#D3968C",
  mid: "#105666",
  mauve: "#8D5F67",
} as const;

const EASE: [number, number, number, number] = [0.2, 0, 0, 1];

// ── Types ────────────────────────────────────────────────────────────────────
interface Project {
  title: string;
  desc: string;
  tech: string[];
  span: string;          // Tailwind / inline grid-column span label
  colSpan: number;       // numeric span for inline style
  accent: string;
  tagBg: string;
  tagColor: string;
  chipBg: string;
  chipColor: string;
  image: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────
const projects: Project[] = [
  {
    title: "AI Indian Sign Language",
    desc: "Recognizes Indian sign language gestures and converts them into text or speech for real-time accessibility.",
    tech: ["Python", "Computer Vision", "NLP"],
    span: "span-7",
    colSpan: 7,
    accent: C.mid,
    tagBg: "rgba(16,86,102,0.10)",
    tagColor: C.mid,
    chipBg: C.mid,
    chipColor: C.beige,
    image: projectAiSign,
  },
  {
    title: "SV Enterprises App",
    desc: "Mobile app for employees and vehicles with admin dashboard, Excel uploads, and location tracking.",
    tech: ["Flutter", "SQLite", "Flask API"],
    span: "span-5",
    colSpan: 5,
    accent: C.dark,
    tagBg: "rgba(10,51,35,0.10)",
    tagColor: C.dark,
    chipBg: C.dark,
    chipColor: C.beige,
    image: projectSvEnterprises,
  },
  {
    title: "HashDrop",
    desc: "A secure document sharing platform with two-step verification and controlled file modification.",
    tech: ["Flask", "MongoDB", "JavaScript"],
    span: "span-4",
    colSpan: 4,
    accent: C.mauve,
    tagBg: "rgba(141,95,103,0.12)",
    tagColor: "#6b3a42",
    chipBg: C.mauve,
    chipColor: C.beige,
    image: projectHashdrop,
  },
  {
    title: "Finance Manager",
    desc: "Web app for managing employee salary records and generating ID cards for a finance company.",
    tech: ["Flask", "HTML/CSS", "JavaScript"],
    span: "span-8",
    colSpan: 8,
    accent: C.moss,
    tagBg: "rgba(131,153,88,0.12)",
    tagColor: "#4a5e20",
    chipBg: C.moss,
    chipColor: C.beige,
    image: projectFinance,
  },
  {
    title: "Dataective",
    desc: "An intelligent crime investigation game where detectives use data, SQL, and visual clues to identify suspects.",
    tech: ["React", "TypeScript", "SQLite"],
    span: "span-6",
    colSpan: 6,
    accent: C.mid,
    tagBg: "rgba(16,86,102,0.10)",
    tagColor: C.mid,
    chipBg: C.mid,
    chipColor: C.beige,
    image: projectAlienEscape,
  },
  {
    title: "Facility Management",
    desc: "A cleaning facility management website to streamline operations and improve service efficiency.",
    tech: ["Flask", "SQL", "TypeScript"],
    span: "span-6",
    colSpan: 6,
    accent: C.rosy,
    tagBg: "rgba(211,150,140,0.15)",
    tagColor: "#7a3e36",
    chipBg: C.rosy,
    chipColor: "#3a1a16",
    image: projectDressmeup,
  },
];

// ── Image heights by colSpan ──────────────────────────────────────────────────
function imgHeight(colSpan: number): number {
  if (colSpan >= 8) return 224;
  if (colSpan >= 6) return 210;
  if (colSpan >= 5) return 204;
  return 196;
}

// ── Arrow SVG ────────────────────────────────────────────────────────────────
const ArrowIcon = ({ color = C.dark }: { color?: string }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path
      d="M7 17L17 7M17 7H7M17 7V17"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── ProjectCard ───────────────────────────────────────────────────────────────
interface CardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project: p, index }: CardProps) => {
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: EASE }}
      whileHover={{ y: -7, boxShadow: "0 22px 52px rgba(10,51,35,0.15)" }}
      style={{
        gridColumn: `span ${p.colSpan}`,
        borderRadius: 20,
        overflow: "hidden",
        background: C.beige,
        border: "1px solid rgba(10,51,35,0.10)",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {/* ── Image ── */}
      <div style={{ position: "relative", overflow: "hidden", flexShrink: 0, height: imgHeight(p.colSpan) }}>
        <motion.img
          src={p.image}
          alt={p.title}
          loading="lazy"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.55, ease: EASE }}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.28 }}
          style={{
            position: "absolute",
            inset: 0,
            background: `${p.accent}CC`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              background: C.beige,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowIcon color={p.accent} />
          </div>
        </motion.div>

        {/* Accent strip */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: p.accent }} />
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "18px 20px 20px", flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Ghost number */}
        <span
          style={{
            position: "absolute",
            right: 16,
            bottom: 14,
            fontFamily: "'DM Serif Display', serif",
            fontSize: 52,
            lineHeight: 1,
            color: C.dark,
            opacity: 0.04,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {num}
        </span>

        {/* Tag */}
        <div style={{ marginBottom: 9 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              padding: "3px 9px",
              borderRadius: 999,
              background: p.tagBg,
              color: p.tagColor,
            }}
          >
            {p.tech[0]}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: 15.5,
            fontWeight: 600,
            color: C.dark,
            marginBottom: 7,
            letterSpacing: "-0.2px",
            lineHeight: 1.3,
          }}
        >
          {p.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: 12.5,
            color: "#3d5c48",
            lineHeight: 1.8,
            flex: 1,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {p.desc}
        </p>

        {/* Footer: chips + arrow */}
        <div style={{ marginTop: 15, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {p.tech.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  padding: "3px 9px",
                  borderRadius: 999,
                  background: p.chipBg,
                  color: p.chipColor,
                }}
              >
                {t}
              </span>
            ))}
          </div>

          <motion.div
            whileHover={{ background: C.dark, borderColor: C.dark }}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "1px solid rgba(10,51,35,0.18)",
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ArrowIcon />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// ── Section ───────────────────────────────────────────────────────────────────
const ProjectsSection = () => (
  <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 28px 72px" }}>

    {/* Header */}
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: EASE }}
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 20,
        marginBottom: 52,
      }}
    >
      <div>
        <p
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: C.moss,
            marginBottom: 10,
          }}
        >
          Portfolio
        </p>
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(36px, 5vw, 54px)",
            color: C.dark,
            lineHeight: 1.05,
          }}
        >
          Selected
          <br />
          <em style={{ fontStyle: "italic", color: C.mid }}>Works</em>
        </h2>
        <p style={{ fontSize: 13.5, color: "#4a6a58", lineHeight: 1.75, maxWidth: 320, marginTop: 14 }}>
          A collection spanning AI, mobile apps, games, and web platforms.
        </p>
      </div>

      {/* Ghost counter */}
      <span
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 72,
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: `1.5px ${C.moss}`,
          opacity: 0.35,
        }}
      >
        06
      </span>
    </motion.div>

    {/* Grid — 12-column asymmetric layout */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: 18,
      }}
    >
      {projects.map((project, i) => (
        <ProjectCard key={project.title} project={project} index={i} />
      ))}
    </div>
  </div>
);

export default ProjectsSection;