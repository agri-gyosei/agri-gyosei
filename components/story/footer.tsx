"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="relative bg-ink py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-col items-center text-center mb-16"
        >
          <Link href="/story" className="font-serif text-gold text-lg tracking-[0.3em] mb-4 hover:text-gold/70 transition-colors duration-300">
            時の杜
          </Link>
          <p className="text-paper/40 text-xs tracking-[0.2em] uppercase">
            Toki no Mori
          </p>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="pt-12 border-t border-paper/10"
        >
          <p className="text-paper/30 text-xs tracking-wider text-center">
            © 2026 時の杜 All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
