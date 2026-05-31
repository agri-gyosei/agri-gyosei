"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"

function NovelEntry({
  id,
  coverSrc,
  coverAlt,
  genre,
  title,
  subtitle,
  author,
  authorRoman,
  description,
  href,
  reverse = false,
}: {
  id?: string
  coverSrc: string
  coverAlt: string
  genre: string
  title: string
  subtitle: string
  author: string
  authorRoman: string
  description: string
  href: string
  reverse?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100])
  const textY = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <div ref={containerRef} id={id} className="relative w-full py-32 md:py-48">
      <div className="mx-auto max-w-7xl px-6">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center ${reverse ? "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1" : ""}`}>
          {/* Book cover */}
          <motion.div
            style={{ y: imageY }}
            className="relative aspect-[2/3] w-full max-w-md mx-auto lg:mx-0"
          >
            <div className="absolute -bottom-8 left-8 right-8 h-32 bg-gradient-to-t from-ink/20 to-transparent blur-2xl" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative w-full h-full"
            >
              <Image
                src={coverSrc}
                alt={coverAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
              />
              <div className="absolute inset-0 border border-gold/10" />
            </motion.div>
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute -left-6 top-0 w-px h-full bg-gradient-to-b from-transparent via-gold/40 to-transparent origin-top"
            />
          </motion.div>

          {/* Book details */}
          <motion.div style={{ y: textY }} className="relative">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gold text-xs tracking-[0.4em] uppercase mb-6"
            >
              {genre}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-ink text-[clamp(1.8rem,5vw,3.5rem)] font-serif leading-[1.2] tracking-[0.02em] mb-4"
            >
              {title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-foreground/50 text-base md:text-lg tracking-wide mb-8"
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mb-12"
            >
              <p className="text-foreground text-lg tracking-wide">{author}</p>
              <p className="text-muted-foreground text-sm tracking-wide mt-1">{authorRoman}</p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-foreground/70 text-base md:text-lg leading-relaxed max-w-lg mb-16"
            >
              {description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link href={href} className="group relative inline-block overflow-hidden border border-[#c9a84c] px-8 py-4 text-[#c9a84c] text-sm tracking-[0.3em] uppercase transition-colors duration-500 hover:text-ink">
                <span className="relative z-10">読む</span>
                <span className="absolute inset-0 bg-[#c9a84c] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export function FeaturedNovel() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])

  return (
    <section ref={sectionRef} id="featured" className="relative w-full bg-background">
      <div className="mx-auto max-w-7xl px-6 pt-32 md:pt-48">
        <motion.p
          style={{ opacity }}
          className="text-gold text-xs tracking-[0.5em] uppercase mb-0"
        >
          Featured
        </motion.p>
      </div>

      <NovelEntry
        coverSrc="/images/goshiki-cover.png"
        coverAlt="五色の詩 ～ムーの子供たちへ～ by 五十音 百"
        genre="Literary Fiction · Mystery · 2026"
        title="五色の詩"
        subtitle="～ムーの子供たちへ～"
        author="五十音 百"
        authorRoman="Isone Momo"
        description="古代ムー大陸の記憶を継ぐ子供たちの物語。五つの色に秘められた謎が、現代と太古の世界を繋ぎ、失われた真実へと導く。"
        href="/story/goshiki-no-uta"
      />

      <div className="mx-auto max-w-7xl px-6">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>

      <NovelEntry
        coverSrc="/images/ema-cover.png"
        coverAlt="絵馬 ～広がる波紋～ by 五十音 百"
        genre="Literary Fiction · Mystery · 2026"
        title="絵馬"
        subtitle="～広がる波紋～"
        author="五十音 百"
        authorRoman="Isone Momo"
        description="2026年、イラン攻撃のニュースをきっかけに一人の日本人女性が気づき始める。遺跡の破壊、ユーフラテス川、黙示録の預言——すべてが一本の糸で繋がっていた。"
        href="/story/ema-hirogaru-hamon"
        reverse
      />
    </section>
  )
}
