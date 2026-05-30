"use client"

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion"
import { useState } from "react"
import Link from "next/link"

export function Navigation() {
  const [hidden, setHidden] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    if (latest > previous && latest > 150) {
      setHidden(true)
    } else {
      setHidden(false)
    }
    setAtTop(latest < 50)
  })

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          atTop && !menuOpen ? "bg-transparent" : "bg-background/80 backdrop-blur-md"
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
                atTop && !menuOpen ? "text-gold/80" : "text-gold"
              }`}>
                時の杜
              </span>
              <span className={`text-xs tracking-[0.15em] uppercase transition-colors duration-500 ${
                atTop && !menuOpen ? "text-paper/60" : "text-foreground/60"
              }`}>
                Toki no Mori
              </span>
            </motion.span>
          </Link>

          {/* Desktop navigation links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hidden md:flex items-center gap-12"
          >
            <Link
              href="/story#featured"
              className={`text-xs tracking-[0.2em] uppercase transition-colors duration-300 hover:text-gold ${
                atTop ? "text-paper/70" : "text-foreground/70"
              }`}
            >
              Catalogue
            </Link>
            <Link
              href="/story#author"
              className={`text-xs tracking-[0.2em] uppercase transition-colors duration-300 hover:text-gold ${
                atTop ? "text-paper/70" : "text-foreground/70"
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
            className="md:hidden flex flex-col gap-1.5 p-1"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              className="block w-5 h-px bg-paper origin-center"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              className="block w-5 h-px bg-paper origin-center"
            />
          </motion.button>
        </nav>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center md:hidden"
            style={{ background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)' }}
            onClick={() => setMenuOpen(false)}
          >
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="flex flex-col items-center gap-10"
              onClick={(e) => e.stopPropagation()}
            >
              <Link
                href="/story#featured"
                onClick={() => setMenuOpen(false)}
                className="text-paper/80 text-sm tracking-[0.4em] uppercase hover:text-gold transition-colors duration-300"
              >
                Catalogue
              </Link>
              <Link
                href="/story#author"
                onClick={() => setMenuOpen(false)}
                className="text-paper/80 text-sm tracking-[0.4em] uppercase hover:text-gold transition-colors duration-300"
              >
                Authors
              </Link>
              <span className="text-paper/25 text-sm tracking-[0.4em] uppercase cursor-default select-none">
                About
              </span>
            </motion.nav>

            {/* Close button */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute bottom-12 text-paper/40 text-xs tracking-[0.3em] uppercase hover:text-paper/70 transition-colors duration-300"
            >
              × Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
