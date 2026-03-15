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
    <div className="min-h-screen bg-background space-y-5 ">
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