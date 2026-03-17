import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const SectionWrapper = ({ children, id }: { children: React.ReactNode; id?: string }) => (
  <div id={id} className="section-container py-8">
    <div className="glass-card p-6 sm:p-5">
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
      className="min-h-screen space-y-5"
      style={{
        background: "linear-gradient(to bottom, #F7F4D5 0%, #EDE9C4 30%, #DDD9AE 60%, #C8D4A8 100%)",
      }}
    >
      {/* global overrides so glass-card picks up the palette */}
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

        /* page background override (replaces any Tailwind bg-* on body) */
        body {
          background: linear-gradient(to bottom, #F7F4D5, #EDE9C4 40%, #C8D4A8 100%);
          min-height: 100vh;
        }

        /* glass card — warm beige tint instead of default grey */
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

        /* Headings / strong text → dark green */
        h1, h2, h3, h4, h5, h6 {
          color: #0A3323;
        }

        /* Body text — slightly softened ink */
        p, li, span, label {
          color: #0A3323cc;
        }

        /* Primary accent links / highlights */
        a {
          color: #105666;
        }
        a:hover {
          color: #0A3323;
        }

        /* Focus ring */
        *:focus-visible {
          outline: 2px solid #105666;
          outline-offset: 2px;
        }

        /* Buttons that use bg-primary or similar utilities */
        .btn-primary,
        [class*="bg-primary"] {
          background-color: #0A3323 !important;
          color: #F7F4D5 !important;
        }

        /* Muted text */
        .text-muted-foreground,
        [class*="text-muted"] {
          color: #839958 !important;
        }

        /* Border color overrides */
        [class*="border-border"],
        [class*="border-input"] {
          border-color: rgba(10, 51, 35, 0.18) !important;
        }

        /* Scrollbar styling — subtle moss */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #F7F4D5; }
        ::-webkit-scrollbar-thumb { background: #839958; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #0A3323; }
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