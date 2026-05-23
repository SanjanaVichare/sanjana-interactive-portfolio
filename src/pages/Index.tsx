import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import PortfolioPage from "@/components/PortfolioPage";

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

        section[style*="max-width: 1100px"],
        div[style*="max-width: 1100px"] {
          padding-top: 32px !important;
          padding-bottom: 32px !important;
        }

        section.w-full.min-h-screen {
          min-height: unset !important;
          padding-top: 40px !important;
          padding-bottom: 40px !important;
        }

        div[style*="padding: \"64px 28px 72px\""],
        div[style*="padding: 64px 28px 72px"] {
          padding-top: 32px !important;
          padding-bottom: 40px !important;
        }
      `}</style>

      <PortfolioPage />

      <div id="experience" className="py-3">
        <ExperienceSection />
      </div>

      <div id="contact" className="py-3">
        <ContactSection />
      </div>

      <Footer />
    </div>
  );
};

export default Index;