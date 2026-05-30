"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"

export function FeaturedNovel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100])
  const textY = useTransform(scrollYProgress, [0, 1], [50, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full bg-background py-32 md:py-48"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section label */}
        <motion.p
          style={{ opacity }}
          className="text-gold text-xs tracking-[0.5em] uppercase mb-24 md:mb-32"
        >
          Featured
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Book cover */}
          <motion.div
            style={{ y: imageY }}
            className="relative aspect-[2/3] w-full max-w-md mx-auto lg:mx-0"
          >
            {/* Shadow */}
            <div className="absolute -bottom-8 left-8 right-8 h-32 bg-gradient-to-t from-ink/20 to-transparent blur-2xl" />
            
            {/* Cover image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative w-full h-full"
            >
              <Image
                src="/images/goshiki-cover.png"
                alt="五色の詩 ～ムーの子供たちへ～ by 五十音 百"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                unoptimized
              />
              
              {/* Subtle border overlay */}
              <div className="absolute inset-0 border border-gold/10" />
            </motion.div>

            {/* Gold accent line */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute -left-6 top-0 w-px h-full bg-gradient-to-b from-transparent via-gold/40 to-transparent origin-top"
            />
          </motion.div>

          {/* Book details */}
          <motion.div
            style={{ y: textY }}
            className="relative"
          >
            {/* Category */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gold text-xs tracking-[0.4em] uppercase mb-6"
            >
              Literary Fiction · Mystery · 2026
            </motion.p>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-ink text-[clamp(1.8rem,5vw,3.5rem)] font-serif leading-[1.2] tracking-[0.02em] mb-4"
            >
              五色の詩
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-foreground/50 text-base md:text-lg tracking-wide mb-8"
            >
              ～ムーの子供たちへ～
            </motion.p>

            {/* Author */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mb-12"
            >
              <p className="text-foreground text-lg tracking-wide">
                五十音 百
              </p>
              <p className="text-muted-foreground text-sm tracking-wide mt-1">
                Isone Momo
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-foreground/70 text-base md:text-lg leading-relaxed max-w-lg mb-16"
            >
              古代ムー大陸の記憶を継ぐ子供たちの物語。五つの色に秘められた謎が、
              現代と太古の世界を繋ぎ、失われた真実へと導く。
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link href="/story/goshiki-no-uta" className="group relative inline-block overflow-hidden border border-[#c9a84c] px-8 py-4 text-[#c9a84c] text-sm tracking-[0.3em] uppercase transition-colors duration-500 hover:text-ink">
                <span className="relative z-10">読む</span>
                <span className="absolute inset-0 bg-[#c9a84c] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
