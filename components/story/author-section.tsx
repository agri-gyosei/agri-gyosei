"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"

export function AuthorSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1.1, 1])
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1])

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-ink overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-ink to-ink" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Image side */}
        <div className="relative h-[60vh] lg:h-auto overflow-hidden">
          <motion.div
            style={{ scale: imageScale }}
            className="absolute inset-0"
          >
            <Image
              src="/images/author-isone.png"
              alt="五十音 百"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-ink" />
          </motion.div>
        </div>

        {/* Content side */}
        <div className="relative flex items-center px-6 py-24 lg:py-32 lg:px-16 xl:px-24">
          <motion.div
            style={{ opacity: textOpacity }}
            className="max-w-xl"
          >
            {/* Section label */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gold text-xs tracking-[0.5em] uppercase mb-12"
            >
              The Author
            </motion.p>

            {/* Name */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-paper text-[clamp(2rem,5vw,3.5rem)] font-serif leading-[1.2] tracking-[0.05em] mb-4"
            >
              五十音 百
            </motion.h2>

            {/* Romaji name */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-gold/60 text-sm tracking-widest mb-12"
            >
              Isone Momo
            </motion.p>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-paper/60 text-base md:text-lg leading-relaxed mb-8"
            >
              言葉の奥に潜む真実を紡ぐ作家。現代と古代、現実と幻想の狭間を行き来する
              独自の世界観で、読者を未知の物語へと誘う。
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-paper/60 text-base md:text-lg leading-relaxed mb-16"
            >
              デビュー作『五色の詩』は、失われた文明の記憶と現代を生きる子供たちの
              成長を描いた意欲作として注目を集めている。
            </motion.p>

            {/* Decorative element */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-24 h-px bg-gradient-to-r from-gold/60 to-transparent origin-left"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
