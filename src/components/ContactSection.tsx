import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: [0.2, 0, 0, 1] as [number, number, number, number] },
};

const ContactSection = () => {
  return (
    <motion.div {...fadeUp} className="text-center">
      <h2 className="text-4xl sm:text-5xl font-display mb-4">Let's Connect</h2>
      <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
        I am always open to collaborating on interesting projects, exploring new ideas, and connecting with other developers.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="hero" size="lg" asChild>
          <a href="https://github.com/SanjanaVichare" target="_blank" rel="noopener noreferrer">
            <Github size={16} /> GitHub
          </a>
        </Button>
        <Button variant="hero-outline" size="lg" asChild>
          <a href="https://www.linkedin.com/in/sanjana-vichare" target="_blank" rel="noopener noreferrer">
            <Linkedin size={16} /> LinkedIn
          </a>
        </Button>
        <Button variant="hero-outline" size="lg" asChild>
          <a href="mailto:contact@sanjanavichare.dev">
            <Mail size={16} /> Say Hello
          </a>
        </Button>
      </div>
    </motion.div>
  );
};

export default ContactSection;
