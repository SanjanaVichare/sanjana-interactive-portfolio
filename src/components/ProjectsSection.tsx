import { motion } from "framer-motion";

import projectAiSign from "@/assets/project-ai-sign.png";
import projectSvEnterprises from "@/assets/imageopy.png";
import projectHashdrop from "@/assets/project-hashdrop.jpg";
import projectFinance from "@/assets/project-finance.jpg";
import projectDressmeup from "@/assets/project-dressmeup.png";
import image from "@/assets/image.png";

const C = {
  dark: "#0A3323",
  moss: "#839958",
  beige: "#F7F4D5",
  rose: "#D3968C",
  accent: "#105666",
  forest: "#063C2B",
  border: "rgba(10,51,35,0.13)",
} as const;

const EASE: [number, number, number, number] = [0.2, 0, 0, 1];

interface Project {
  title: string;
  desc: string;
  tech: string[];
  accent: string;
  image: string;
  url: string;
  featured?: boolean;
  tag: string;
}

const projects: Project[] = [
  {
    title: "AI Indian Sign Language",
    desc: "Real-time sign language recognition system that converts Indian sign language gestures into text and speech — built for accessibility using computer vision and NLP.",
    tech: ["Python", "Computer Vision", "NLP"],
    accent: C.accent,
    image: projectAiSign,
    url: "https://github.com/SanjanaVichare",
    featured: true,
    tag: "AI · Accessibility",
  },
  {
    title: "SV Enterprises App",
    desc: "Flutter mobile app for employee and vehicle management with admin dashboard, Excel uploads, and live location tracking.",
    tech: ["Flutter", "SQLite", "Flask API"],
    accent: C.dark,
    image: projectSvEnterprises,
    url: "https://www.svfs.info/",
    tag: "Mobile App",
  },
  {
    title: "HashDrop",
    desc: "Secure document sharing platform with two-step verification and controlled file modification.",
    tech: ["Flask", "MongoDB", "JavaScript"],
    accent: "#8D5F67",
    image: projectHashdrop,
    url: "https://github.com/SanjanaVichare",
    tag: "Web · Security",
  },
  {
    title: "Finance Manager",
    desc: "Web app for managing employee salary records and generating ID cards for a finance company.",
    tech: ["Flask", "HTML/CSS", "JavaScript"],
    accent: C.moss,
    image: projectFinance,
    url: "https://www.svfs.info/",
    tag: "Web · Finance",
  },
  {
    title: "Facility Management",
    desc: "Cleaning facility management website to streamline operations and improve service efficiency.",
    tech: ["Flask", "SQL", "TypeScript"],
    accent: C.rose,
    image: projectDressmeup,
    url: "https://www.hometaskfm.in",
    tag: "Web · Operations",
  },
  {
    title: "ACE Sports Organization",
    desc: "Official website for a sports organization — event listings, team info, and announcements built for a real client.",
    tech: ["TypeScript"],
    accent: C.moss,
    image: image,
    url: "https://www.acesports.org.in/",
    tag: "Web · Sports",
  },
  {
    title: "ACFC Football Club",
    desc: "Dedicated website for the football section — fixtures, player profiles, and club news for a real football club.",
    tech: ["TypeScript"],
    accent: C.dark,
    image: image, // swap with actual image when ready
    url: "https://www.acexifc.com/",
    tag: "Web · Football",
  },
];

const ArrowIcon = ({ color = C.dark }: { color?: string }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path d="M7 17L17 7M17 7H7M17 7V17" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Featured card ─────────────────────────────────────────────────────────────
const FeaturedCard = ({ p }: { p: Project }) => (
  <motion.div
    initial={{ opacity: 0, y: 36 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.6, ease: EASE }}
    onClick={() => window.open(p.url, "_blank")}
    style={{
      borderRadius: 24,
      overflow: "hidden",
      background: C.beige,
      border: `1px solid ${C.border}`,
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      cursor: "pointer",
      marginBottom: 20,
      minHeight: 360,
    }}
  >
    {/* Left: text */}
    <div style={{ padding: "44px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "1.6px", textTransform: "uppercase",
            padding: "4px 12px", borderRadius: 999,
            background: `${p.accent}18`, color: p.accent,
          }}>{p.tag}</span>
          <span style={{ fontSize: 10, color: C.moss, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Featured</span>
        </div>
        <h3 style={{
          fontFamily: "'Ciimss rP,egia, serif",
          fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700,
          color: C.dark, lineHeight: 1.15, marginBottom: 16, letterSpacing: "-0.3px",
        }}>{p.title}</h3>
        <p style={{ fontSize: 14, color: "#3d5c48", lineHeight: 1.85, maxWidth: 380 }}>{p.desc}</p>
      </div>

      <div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 28 }}>
          {p.tech.map(t => (
            <span key={t} style={{
              fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 999,
              background: p.accent, color: C.beige,
            }}>{t}</span>
          ))}
        </div>
        <motion.div
          whileHover={{ gap: "12px" }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: p.accent, fontFamily: "'DM Sans', sans-serif" }}
        >
          View project <ArrowIcon color={p.accent} />
        </motion.div>
      </div>
    </div>

    {/* Right: image */}
    <div style={{ position: "relative", overflow: "hidden" }}>
      <motion.img
        src={p.image} alt={p.title}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.55, ease: EASE }}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${p.accent}22, transparent 60%)` }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: p.accent }} />
    </div>
  </motion.div>
);

// ── Small card ────────────────────────────────────────────────────────────────
const SmallCard = ({ p, index }: { p: Project; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
    whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(10,51,35,0.13)" }}
    onClick={() => window.open(p.url, "_blank")}
    style={{
      borderRadius: 20,
      overflow: "hidden",
      background: C.beige,
      border: `1px solid ${C.border}`,
      display: "flex",
      flexDirection: "column",
      cursor: "pointer",
    }}
  >
    {/* Image */}
    <div style={{ position: "relative", overflow: "hidden", height: 200, flexShrink: 0 }}>
      <motion.img
        src={p.image} alt={p.title}
        whileHover={{ scale: 1.06 }}
        transition={{ duration: 0.5, ease: EASE }}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      <motion.div
        initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        style={{
          position: "absolute", inset: 0,
          background: `${p.accent}CC`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: C.beige, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <ArrowIcon color={p.accent} />
        </div>
      </motion.div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: p.accent }} />
    </div>

    {/* Body */}
    <div style={{ padding: "18px 20px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
      <span style={{
        fontSize: 9.5, fontWeight: 700, letterSpacing: "1.4px", textTransform: "uppercase",
        padding: "3px 10px", borderRadius: 999, marginBottom: 10, alignSelf: "flex-start",
        background: `${p.accent}18`, color: p.accent,
      }}>{p.tag}</span>

      <h3 style={{
        fontSize: 15, fontWeight: 700, color: C.dark,
        marginBottom: 8, letterSpacing: "-0.2px", lineHeight: 1.3,
        fontFamily: "'DM Sans', sans-serif",
      }}>{p.title}</h3>

      <p style={{
        fontSize: 12.5, color: "#3d5c48", lineHeight: 1.75, flex: 1,
        overflow: "hidden", display: "-webkit-box",
        WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
      }}>{p.desc}</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 14 }}>
        {p.tech.map(t => (
          <span key={t} style={{
            fontSize: 10, fontWeight: 600, padding: "3px 9px",
            borderRadius: 999, background: p.accent, color: C.beige,
          }}>{t}</span>
        ))}
      </div>
    </div>
  </motion.div>
);

// ── Section ───────────────────────────────────────────────────────────────────
const ProjectsSection = () => {
  const featured = projects.find(p => p.featured)!;
  const rest = projects.filter(p => !p.featured);

  return (
    <div id="projects-section" style={{ background: C.beige, borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 28px 80px" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ marginBottom: 52 }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <h2 style={{
              fontFamily: "'Ciimss rP,egia, serif",
              fontSize: "clamp(36px, 5vw, 54px)",
              color: C.dark, lineHeight: 1.05, margin: 0,
            }}>
              Selected Works
            </h2>
          </div>
        </motion.div>

        {/* Featured */}
        <FeaturedCard p={featured} />

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
          {rest.map((p, i) => <SmallCard key={p.title} p={p} index={i} />)}
        </div>

      </div>
    </div>
  );
};

export default ProjectsSection;