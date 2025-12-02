"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

export default function SignupPage() {
    return (
        <div className="min-h-screen bg-[#fdfdfd] text-[#1a1a1a] font-['Virgil'] flex flex-col items-center justify-center p-6">
            <Link
                href="/"
                className="absolute top-6 left-6 flex items-center gap-2 hover:underline decoration-2 underline-offset-4"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-white border-4 border-[#1a1a1a] rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h1 className="text-3xl font-bold mb-2 text-center">Join Zen Draw</h1>
                    <p className="text-gray-600 text-center mb-8">Start your creative journey today.</p>

                    <form className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-lg font-bold" htmlFor="name">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-[#1a1a1a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:ring-offset-2 transition-all"
                                placeholder="Pablo Picasso"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-lg font-bold" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-[#1a1a1a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:ring-offset-2 transition-all"
                                placeholder="picasso@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-lg font-bold" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-[#1a1a1a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:ring-offset-2 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="button"
                            className="w-full py-4 bg-[#1a1a1a] text-white text-xl font-bold rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="mt-8 text-center text-gray-600">
                        Already have an account?{" "}
                        <Link href="/login" className="font-bold text-[#1a1a1a] hover:underline decoration-2 underline-offset-4">
                            Log in
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
