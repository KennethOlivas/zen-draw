"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Pencil,
  Infinity as InfinityIcon,
  Users,
  Share2,
  Save,
  Download,
  History,
  Zap,
  Cloud,
  Lock,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { Highlighter } from "@/components/ui/highlighter";
import { ModeToggle } from "@/components/mode-toggle";

// FAQ Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-2 border-foreground rounded-lg overflow-hidden bg-card mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-muted/50 transition-colors"
      >
        <span className="font-bold text-lg">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 py-4 border-t-2 border-foreground bg-muted/50 text-muted-foreground">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const TypingAnimation = ({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) => {
  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 1 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: delay,
            staggerChildren: 0.05,
          },
        },
      }}
      className={className}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-['Virgil'] selection:bg-yellow-200">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 bg-background/90 backdrop-blur-sm border-b-2 border-foreground border-dashed">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Pencil className="w-6 h-6" />
            <span className="text-xl font-bold">Zen Draw</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-lg">
            <a
              href="#features"
              className="hover:underline decoration-2 underline-offset-4"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="hover:underline decoration-2 underline-offset-4"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="hover:underline decoration-2 underline-offset-4"
            >
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link
              href="/login"
              className="hidden md:block hover:underline decoration-2 underline-offset-4"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 border-2 border-foreground rounded-lg hover:bg-foreground hover:text-background transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="px-6 mb-32">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center mb-20">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight">
                <TypingAnimation text="A Fast, Collaborative" /> <br />
                <span className="relative inline-block mt-2">
                  <Highlighter color="#fde047" isView={true}>
                    <TypingAnimation text="Online Whiteboard" delay={0.3} />
                  </Highlighter>
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10"
              >
                Real-time collaboration, infinite canvas, and simple tools.
                Sketch, plan, and share ideas in a space that feels as natural
                as paper.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/board"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-foreground text-background text-xl rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                >
                  <Highlighter color="#fde047" action="underline">
                    Start Drawing
                  </Highlighter>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-background border-2 border-foreground text-foreground text-xl rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                >
                  Learn More
                </a>
              </motion.div>
            </div>

            {/* Demo Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="relative max-w-5xl mx-auto"
            >
              <div className="absolute -inset-3 bg-foreground rounded-2xl rotate-1 opacity-10"></div>
              <div className="relative border-4 border-foreground rounded-xl overflow-hidden bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                <div className="border-b-2 border-foreground bg-muted px-4 py-2 flex gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-foreground bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full border-2 border-foreground bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full border-2 border-foreground bg-green-400"></div>
                </div>
                <Image
                  src="/images/demo.png"
                  alt="Zen Draw Demo"
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Key Features Section */}
        <section
          id="features"
          className="px-6 py-20 bg-muted/30 border-y-2 border-foreground border-dashed"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Everything You Need
              </h2>
              <p className="text-xl text-muted-foreground">
                Powerful tools wrapped in a&nbsp;
                <Highlighter color="#a5b4fc" action="underline" isView={true}>
                  simple interface.
                </Highlighter>
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: InfinityIcon,
                  title: "Infinite Canvas",
                  desc: "Never run out of space. Pan and zoom freely across an endless board.",
                },
                {
                  icon: Users,
                  title: "Real-time Collab",
                  desc: "Work together with your team. See cursors and updates instantly.",
                },
                {
                  icon: Share2,
                  title: "Easy Sharing",
                  desc: "Share your board with a simple link. No sign-up required for viewers.",
                },
                {
                  icon: Save,
                  title: "Local-First",
                  desc: "Your data stays on your device. Autosaves instantly as you work.",
                },
                {
                  icon: Download,
                  title: "Export Options",
                  desc: "Export your creations as PNG, SVG, or JSON for easy sharing.",
                },
                {
                  icon: History,
                  title: "Version History",
                  desc: "Undo and redo your changes with ease. Never lose your progress.",
                },
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  desc: "Optimized for performance. Smooth drawing even on large boards.",
                },
                {
                  icon: Pencil,
                  title: "Smart Tools",
                  desc: "Shapes, arrows, text, and freehand drawing at your fingertips.",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card p-6 rounded-xl border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] transition-all"
                >
                  <feature.icon className="w-10 h-10 mb-4 text-foreground" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Highlighter action="highlight" color="#fda0d0">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Built for Everyone
                </h2>
              </Highlighter>
              <p className="text-xl text-gray-600">
                From classrooms to boardrooms, Zen Draw adapts to you.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Team Brainstorming",
                  desc: "Visualize ideas, vote on concepts, and plan your next big project together.",
                },
                {
                  title: "Education",
                  desc: "Create engaging diagrams, explain complex concepts, and let students collaborate.",
                },
                {
                  title: "Design & UX",
                  desc: "Sketch wireframes, map user flows, and iterate on layouts quickly.",
                },
              ].map((useCase, i) => (
                <div key={i} className="relative group">
                  <div className="absolute inset-0 bg-foreground rounded-xl rotate-1 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-[#fff9c4] dark:bg-yellow-950 p-8 rounded-xl border-2 border-foreground h-full">
                    <h3 className="text-2xl font-bold mb-4 text-foreground">
                      {useCase.title}
                    </h3>
                    <p className="text-lg text-foreground">{useCase.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations & Security */}
        <section className="px-6 py-20 bg-zinc-800 dark:bg-zinc-950 text-white">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
            <Highlighter action="circle" color="#fda0d0">
              <div className="p-24">
                <div className="flex items-center gap-3 mb-6">
                  <Cloud className="w-8 h-8 text-yellow-300" />
                  <h2 className="text-3xl font-bold">Integrations</h2>
                </div>
                <ul className="space-y-4 text-lg text-zinc-400">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    Cloud sync across devices
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    Export to Notion & Figma (Coming Soon)
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    GitHub Gist integration
                  </li>
                </ul>
              </div>
            </Highlighter>

            <Highlighter action="circle" color="#a5b4fc">
              <div className="p-24">
                <div className="flex items-center gap-3 mb-6">
                  <Lock className="w-8 h-8 text-yellow-300" />
                  <h2 className="text-3xl font-bold">Security & Privacy</h2>
                </div>
                <ul className="space-y-4 text-lg text-zinc-400">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    End-to-end encryption for private boards
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    No tracking or ads
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    Local-first data storage
                  </li>
                </ul>
              </div>
            </Highlighter>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Simple Pricing
              </h2>
              <p className="text-xl text-gray-600">
                Start for free, upgrade for power.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <div className="bg-card p-8 rounded-xl border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="text-4xl font-bold mb-6">
                  $0
                  <span className="text-lg text-muted-foreground font-normal">
                    /mo
                  </span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5" />
                    Unlimited public boards
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5" />
                    Real-time collaboration
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5" />
                    Export to PNG/SVG
                  </li>
                </ul>
                <Link
                  href="/board"
                  className="block w-full py-3 text-center border-2 border-foreground rounded-lg hover:bg-muted transition-colors font-bold"
                >
                  Get Started
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="relative bg-foreground text-background p-8 rounded-xl border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
                <div className="absolute top-0 right-0 bg-yellow-300 text-black text-xs font-bold px-3 py-1 rounded-bl-lg border-l-2 border-b-2 border-foreground">
                  POPULAR
                </div>
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-6">
                  $12
                  <span className="text-lg text-background/70 font-normal">
                    /mo
                  </span>
                </div>
                <ul className="space-y-4 mb-8 text-background/80">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-yellow-300" />
                    Unlimited private boards
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-yellow-300" />
                    Advanced export options
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-yellow-300" />
                    Priority support
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-yellow-300" />
                    Team management
                  </li>
                </ul>
                <Link
                  href="/signup"
                  className="block w-full py-3 text-center bg-yellow-300 text-black rounded-lg hover:bg-yellow-400 transition-colors font-bold"
                >
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id="faq"
          className="px-6 py-20 bg-muted/50 border-t-2 border-foreground border-dashed"
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <FAQItem
              question="Do I need an account to use Zen Draw?"
              answer="No! You can start drawing immediately without an account. However, creating an account allows you to save your boards to the cloud and access them from anywhere."
            />
            <FAQItem
              question="Is my data secure?"
              answer="Yes. We use a local-first approach, meaning your data is stored on your device first. When you choose to sync, we use industry-standard encryption to protect your work."
            />
            <FAQItem
              question="Can I collaborate with others?"
              answer="Absolutely. Just share the link to your board, and others can join in real-time. You can see their cursors and edits as they happen."
            />
            <FAQItem
              question="What formats can I export to?"
              answer="We currently support exporting to PNG, SVG, and JSON (for backups). We're working on adding PDF and other formats soon."
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 dark:bg-zinc-950 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Pencil className="w-6 h-6" />
                <span className="text-xl font-bold">Zen Draw</span>
              </div>
              <p className="text-zinc-400 max-w-sm">
                The simplest way to sketch, plan, and collaborate. Built for
                creatives, developers, and dreamers.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Product</h4>
              <ul className="space-y-2 text-zinc-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <Link
                    href="/board"
                    className="hover:text-white transition-colors"
                  >
                    Open App
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Legal</h4>
              <ul className="space-y-2 text-zinc-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-zinc-400">
              © 2025 Zen Draw. All rights reserved. Created by{" "}
              <a
                href="https://kennetholivas.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Kenneth Olivas
              </a>
              .
            </div>
            <div className="flex gap-6">
              <Link
                href="https://github.com/KennethOlivas/zen-draw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <Github className="w-6 h-6" />
              </Link>

              <Link
                href="https://www.linkedin.com/in/kenneth-olivas/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
