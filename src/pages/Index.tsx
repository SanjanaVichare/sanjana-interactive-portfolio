import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const SectionWrapper = ({ children, id }: { children: React.ReactNode; id?: string }) => (
  <div id={id} className="section-container py-3">
    <div className="glass-card p-5 sm:p-2">
      {children}
    </div>
  </div>
);

const HeroWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="section-container min-h-screen flex items-center">
    <div className="glass-card w-full px-6 sm:px-10 pt-0 pb-0 overflow-visible">
      {children}
    </div>
  </div>
);

const Index = () => {
  return (
    <div
      className="min-h-screen space-y-2"
      style={{
        background: "linear-gradient(to bottom, #F7F4D5 0%, #EDE9C4 30%, #DDD9AE 60%, #C8D4A8 100%)",
      }}
    >
      <style>{`
        :root {
          --color-ink:      #0A3323;
          --color-moss:     #839958;
          --color-beige:    #F7F4D5;
          --color-rosy:     #D3968C;
          --color-mid:      #105666;
          --color-plum:     #8D5F67;
          --color-beige-d:  #EDE9C4;
        }

        body {
          background: linear-gradient(to bottom, #F7F4D5, #EDE9C4 40%, #C8D4A8 100%);
          min-height: 100vh;
        }

        .glass-card {
          background: rgba(247, 244, 213, 0.72) !important;
          backdrop-filter: blur(14px) saturate(1.3) !important;
          -webkit-backdrop-filter: blur(14px) saturate(1.3) !important;
          border: 1.5px solid rgba(10, 51, 35, 0.13) !important;
          box-shadow:
            0 2px 24px rgba(10, 51, 35, 0.07),
            0 1px 4px  rgba(10, 51, 35, 0.05) !important;
          border-radius: 16px !important;
        }

        h1, h2, h3, h4, h5, h6 { color: #0A3323; }
        p, li, span, label { color: #0A3323cc; }
        a { color: #105666; }
        a:hover { color: #0A3323; }
        *:focus-visible { outline: 2px solid #105666; outline-offset: 2px; }

        .btn-primary,
        [class*="bg-primary"] {
          background-color: #0A3323 !important;
          color: #F7F4D5 !important;
        }

        .text-muted-foreground,
        [class*="text-muted"] { color: #839958 !important; }

        [class*="border-border"],
        [class*="border-input"] { border-color: rgba(10, 51, 35, 0.18) !important; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #F7F4D5; }
        ::-webkit-scrollbar-thumb { background: #839958; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #0A3323; }

        /* ── Tighten internal section padding ── */
        /* AboutSection */
        section[style*="max-width: 1100px"],
        div[style*="max-width: 1100px"] {
          padding-top: 32px !important;
          padding-bottom: 32px !important;
        }

        /* ExperienceSection & ContactSection full-height sections */
        section.w-full.min-h-screen {
          min-height: unset !important;
          padding-top: 40px !important;
          padding-bottom: 40px !important;
        }

        /* ProjectsSection */
        div[style*="padding: \"64px 28px 72px\""],
        div[style*="padding: 64px 28px 72px"] {
          padding-top: 32px !important;
          padding-bottom: 40px !important;
        }
      `}</style>

      <HeroWrapper>
        <HeroSection />
      </HeroWrapper>

      <SectionWrapper id="about">
        <AboutSection />
      </SectionWrapper>

      <SectionWrapper id="skills">
        <SkillsSection />
      </SectionWrapper>

      <SectionWrapper id="projects">
        <ProjectsSection />
      </SectionWrapper>

      <SectionWrapper id="experience">
        <ExperienceSection />
      </SectionWrapper>

      <SectionWrapper id="contact">
        <ContactSection />
      </SectionWrapper>

      <Footer />
    </div>
  );
};

export default Index;