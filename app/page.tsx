"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Pencil } from "lucide-react"

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#fdfdfd] text-[#1a1a1a] font-['Virgil'] selection:bg-yellow-200">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 px-6 py-4 bg-[#fdfdfd]/80 backdrop-blur-sm border-b-2 border-[#1a1a1a] border-dashed">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Pencil className="w-6 h-6" />
                        <span className="text-xl font-bold">Zen Draw</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/login" className="hover:underline decoration-2 underline-offset-4">
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

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="flex flex-col items-center text-center mb-20">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-6xl md:text-8xl font-bold mb-6 tracking-tight"
                        >
                            Unleash Your <br />
                            <span className="relative inline-block">
                                Creativity
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-300 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
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
                            A simple, infinite canvas for your ideas. Sketch, plan, and collaborate in a space that feels as natural as paper.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Link
                                href="/board"
                                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#1a1a1a] text-white text-xl rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                            >
                                Start Drawing
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Demo Image Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="relative max-w-5xl mx-auto"
                    >
                        <div className="absolute -inset-2 bg-[#1a1a1a] rounded-2xl rotate-1 opacity-10"></div>
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
            </main>
        </div>
    )
}
