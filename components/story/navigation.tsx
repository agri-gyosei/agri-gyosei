"use client"

import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { useState } from "react"
import Link from "next/link"

export function Navigation() {
  const [hidden, setHidden] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    
    // Hide when scrolling down, show when scrolling up
    if (latest > previous && latest > 150) {
      setHidden(true)
    } else {
      setHidden(false)
    }
    
    // Check if at top
    setAtTop(latest < 50)
  })

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        atTop ? "bg-transparent" : "bg-background/80 backdrop-blur-md"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/story">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center gap-3 cursor-pointer"
        >
          <span className={`font-serif text-sm tracking-[0.3em] transition-colors duration-500 ${
            atTop ? "text-gold/80" : "text-gold"
          }`}>
            時の杜
          </span>
          <span className={`text-xs tracking-[0.15em] uppercase transition-colors duration-500 ${
            atTop ? "text-paper/60" : "text-foreground/60"
          }`}>
            Toki no Mori
          </span>
        </motion.span>
        </Link>

        {/* Navigation links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="hidden md:flex items-center gap-12"
        >
          <Link
            href="/story#featured"
            className={`text-xs tracking-[0.2em] uppercase transition-colors duration-300 hover:text-gold ${
              atTop ? "text-paper/70 hover:text-gold" : "text-foreground/70 hover:text-gold"
            }`}
          >
            Catalogue
          </Link>
          <Link
            href="/story#author"
            className={`text-xs tracking-[0.2em] uppercase transition-colors duration-300 hover:text-gold ${
              atTop ? "text-paper/70 hover:text-gold" : "text-foreground/70 hover:text-gold"
            }`}
          >
            Authors
          </Link>
          <span
            className={`text-xs tracking-[0.2em] uppercase cursor-default select-none ${
              atTop ? "text-paper/30" : "text-foreground/30"
            }`}
          >
            About
          </span>
        </motion.div>

        {/* Mobile menu button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="md:hidden flex flex-col gap-1.5"
          aria-label="Open menu"
        >
          <span className={`w-5 h-px transition-colors duration-500 ${
            atTop ? "bg-paper" : "bg-foreground"
          }`} />
          <span className={`w-5 h-px transition-colors duration-500 ${
            atTop ? "bg-paper" : "bg-foreground"
          }`} />
        </motion.button>
      </nav>
    </motion.header>
  )
}
