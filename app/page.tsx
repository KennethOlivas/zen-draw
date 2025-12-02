"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
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
    ChevronUp
} from "lucide-react"
import { useState } from "react"

// FAQ Component
function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="border-2 border-[#1a1a1a] rounded-lg overflow-hidden bg-white mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
                <span className="font-bold text-lg">{question}</span>
                {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {isOpen && (
                <div className="px-6 py-4 border-t-2 border-[#1a1a1a] bg-gray-50 text-gray-600">
                    {answer}
                </div>
            )}
        </div>
    )
}

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#fdfdfd] text-[#1a1a1a] font-['Virgil'] selection:bg-yellow-200">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 px-6 py-4 bg-[#fdfdfd]/90 backdrop-blur-sm border-b-2 border-[#1a1a1a] border-dashed">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Pencil className="w-6 h-6" />
                        <span className="text-xl font-bold">Zen Draw</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-lg">
                        <a href="#features" className="hover:underline decoration-2 underline-offset-4">Features</a>
                        <a href="#pricing" className="hover:underline decoration-2 underline-offset-4">Pricing</a>
                        <a href="#faq" className="hover:underline decoration-2 underline-offset-4">FAQ</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="hidden md:block hover:underline decoration-2 underline-offset-4">
                            Login
                        </Link>
                        <Link
                            href="/signup"
                            className="px-4 py-2 border-2 border-[#1a1a1a] rounded-lg hover:bg-[#1a1a1a] hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
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
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight"
                            >
                                A Fast, Collaborative <br />
                                <span className="relative inline-block mt-2">
                                    Online Whiteboard
                                    <svg className="absolute w-full h-4 -bottom-2 left-0 text-yellow-300 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                                    </svg>
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-xl md:text-2xl text-gray-600 max-w-2xl mb-10"
                            >
                                Real-time collaboration, infinite canvas, and simple tools.
                                Sketch, plan, and share ideas in a space that feels as natural as paper.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="flex flex-col sm:flex-row gap-4"
                            >
                                <Link
                                    href="/board"
                                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1a1a1a] text-white text-xl rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                                >
                                    Start Drawing
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <a
                                    href="#features"
                                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-[#1a1a1a] text-[#1a1a1a] text-xl rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                                >
                                    Learn More
                                </a>
                            </motion.div>
                        </div>

                        {/* Demo Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="relative max-w-5xl mx-auto"
                        >
                            <div className="absolute -inset-3 bg-[#1a1a1a] rounded-2xl rotate-1 opacity-10"></div>
                            <div className="relative border-4 border-[#1a1a1a] rounded-xl overflow-hidden bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                <div className="border-b-2 border-[#1a1a1a] bg-gray-50 px-4 py-2 flex gap-2">
                                    <div className="w-3 h-3 rounded-full border-2 border-[#1a1a1a] bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full border-2 border-[#1a1a1a] bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full border-2 border-[#1a1a1a] bg-green-400"></div>
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
                <section id="features" className="px-6 py-20 bg-gray-50 border-y-2 border-[#1a1a1a] border-dashed">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything You Need</h2>
                            <p className="text-xl text-gray-600">Powerful tools wrapped in a simple interface.</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: InfinityIcon, title: "Infinite Canvas", desc: "Never run out of space. Pan and zoom freely across an endless board." },
                                { icon: Users, title: "Real-time Collab", desc: "Work together with your team. See cursors and updates instantly." },
                                { icon: Share2, title: "Easy Sharing", desc: "Share your board with a simple link. No sign-up required for viewers." },
                                { icon: Save, title: "Local-First", desc: "Your data stays on your device. Autosaves instantly as you work." },
                                { icon: Download, title: "Export Options", desc: "Export your creations as PNG, SVG, or JSON for easy sharing." },
                                { icon: History, title: "Version History", desc: "Undo and redo your changes with ease. Never lose your progress." },
                                { icon: Zap, title: "Lightning Fast", desc: "Optimized for performance. Smooth drawing even on large boards." },
                                { icon: Pencil, title: "Smart Tools", desc: "Shapes, arrows, text, and freehand drawing at your fingertips." },
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white p-6 rounded-xl border-2 border-[#1a1a1a] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] transition-all"
                                >
                                    <feature.icon className="w-10 h-10 mb-4 text-[#1a1a1a]" />
                                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Use Cases Section */}
                <section className="px-6 py-20">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">Built for Everyone</h2>
                            <p className="text-xl text-gray-600">From classrooms to boardrooms, Zen Draw adapts to you.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { title: "Team Brainstorming", desc: "Visualize ideas, vote on concepts, and plan your next big project together." },
                                { title: "Education", desc: "Create engaging diagrams, explain complex concepts, and let students collaborate." },
                                { title: "Design & UX", desc: "Sketch wireframes, map user flows, and iterate on layouts quickly." },
                            ].map((useCase, i) => (
                                <div key={i} className="relative group">
                                    <div className="absolute inset-0 bg-[#1a1a1a] rounded-xl rotate-1 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative bg-[#fff9c4] p-8 rounded-xl border-2 border-[#1a1a1a] h-full">
                                        <h3 className="text-2xl font-bold mb-4">{useCase.title}</h3>
                                        <p className="text-lg text-gray-800">{useCase.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Integrations & Security */}
                <section className="px-6 py-20 bg-[#1a1a1a] text-white">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <Cloud className="w-8 h-8 text-yellow-300" />
                                <h2 className="text-3xl font-bold">Integrations</h2>
                            </div>
                            <ul className="space-y-4 text-lg text-gray-300">
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
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <Lock className="w-8 h-8 text-yellow-300" />
                                <h2 className="text-3xl font-bold">Security & Privacy</h2>
                            </div>
                            <ul className="space-y-4 text-lg text-gray-300">
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
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="px-6 py-20">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple Pricing</h2>
                            <p className="text-xl text-gray-600">Start for free, upgrade for power.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Free Plan */}
                            <div className="bg-white p-8 rounded-xl border-2 border-[#1a1a1a] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                                <h3 className="text-2xl font-bold mb-2">Free</h3>
                                <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
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
                                    className="block w-full py-3 text-center border-2 border-[#1a1a1a] rounded-lg hover:bg-gray-50 transition-colors font-bold"
                                >
                                    Get Started
                                </Link>
                            </div>

                            {/* Pro Plan */}
                            <div className="relative bg-[#1a1a1a] text-white p-8 rounded-xl border-2 border-[#1a1a1a] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
                                <div className="absolute top-0 right-0 bg-yellow-300 text-black text-xs font-bold px-3 py-1 rounded-bl-lg border-l-2 border-b-2 border-[#1a1a1a]">
                                    POPULAR
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                                <div className="text-4xl font-bold mb-6">$12<span className="text-lg text-gray-400 font-normal">/mo</span></div>
                                <ul className="space-y-4 mb-8 text-gray-300">
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
                <section id="faq" className="px-6 py-20 bg-gray-50 border-t-2 border-[#1a1a1a] border-dashed">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
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
            <footer className="bg-[#1a1a1a] text-white py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <Pencil className="w-6 h-6" />
                                <span className="text-xl font-bold">Zen Draw</span>
                            </div>
                            <p className="text-gray-400 max-w-sm">
                                The simplest way to sketch, plan, and collaborate. Built for creatives, developers, and dreamers.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-lg">Product</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                                <li><Link href="/board" className="hover:text-white transition-colors">Open App</Link></li>
                                <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-lg">Legal</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-gray-400">
                            © 2025 Zen Draw. All rights reserved.
                        </div>
                        <div className="flex gap-6">
                            <a href="https://github.com/KennethOlivas/zen-draw" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                <Github className="w-6 h-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter className="w-6 h-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Linkedin className="w-6 h-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Mail className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
