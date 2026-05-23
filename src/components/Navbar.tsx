import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const C = {
  pageBg: "#F7F4D5",
  primaryText: "#0A3323",
  moss: "#839958",
  accent: "#105666",
  border: "rgba(10,51,35,0.13)",
};

const links = [
  { label: "Home", href: "hero-section" },
  { label: "About", href: "about-section" },
  { label: "Projects", href: "projects-section" },
  { label: "Experience", href: "experience-section" },
  { label: "Contact", href: "contact-section" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const navLinkStyle: React.CSSProperties = {
    fontSize: "0.8rem",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: C.moss,
    textDecoration: "none",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: "6px 14px",
    borderRadius: "999px",
    transition: "color 0.2s, background 0.2s",
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100% - 3rem)",
          maxWidth: 1100,
          zIndex: 100,
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 clamp(1rem, 3vw, 2rem)",
          }}
        >
          {/* Logo */}
          <button
            onClick={() => scrollTo("hero-section")}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: C.primaryText,
              letterSpacing: "-0.02em",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            SV<span style={{ color: C.accent }}>.</span>
          </button>

          {/* Desktop links */}
          <div
            className="desktop-nav"
            style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
          >
            {links.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                style={navLinkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.primaryText;
                  e.currentTarget.style.background = "rgba(10,51,35,0.07)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = C.moss;
                  e.currentTarget.style.background = "none";
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            className="mobile-toggle"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              color: C.primaryText,
              display: "none",
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: "rgba(247,244,213,0.97)",
                backdropFilter: "blur(16px)",
                borderTop: `1px solid ${C.border}`,
                overflow: "hidden",
                borderRadius: "0 0 24px 24px",
              }}
            >
              <div
                style={{
                  padding: "1rem clamp(1.5rem, 5vw, 4rem) 1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  maxWidth: 1280,
                  margin: "0 auto",
                }}
              >
                {links.map((link, i) => (
                  <motion.button
                    key={link.label}
                    onClick={() => scrollTo(link.href)}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.25 }}
                    style={{
                      ...navLinkStyle,
                      fontSize: "0.9rem",
                      textAlign: "left",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      borderBottom: `1px solid ${C.border}`,
                      width: "100%",
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
                    {link.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;