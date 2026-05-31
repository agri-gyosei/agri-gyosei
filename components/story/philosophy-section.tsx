"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export function PhilosophySection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0.1, 0.3], [50, 0])

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-background flex items-center justify-center py-16 md:py-48"
    >
      {/* Background texture */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.03),transparent_50%)]" />
      </div>

      <motion.div
        style={{ opacity, y }}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
      >
        {/* Main quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="text-ink text-[clamp(1.5rem,4vw,2.5rem)] font-serif leading-[1.5] tracking-[0.02em]">
            物語は終わらない
          </p>
          <p className="text-ink text-[clamp(1.5rem,4vw,2.5rem)] font-serif leading-[1.5] tracking-[0.02em] mt-2">
            最後のページを閉じた後も
          </p>
          <p className="text-ink text-[clamp(1.5rem,4vw,2.5rem)] font-serif leading-[1.5] tracking-[0.02em] mt-6">
            あなたの物語はあなたが創造する
          </p>
        </motion.blockquote>

        {/* Attribution */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 md:mt-16"
        >
          <div className="w-12 h-px bg-gold/40 mx-auto mb-6" />
          <p className="text-gold/70 text-sm tracking-[0.3em]">
            ― 時の杜
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
