"use client"

import { motion, type Variants } from "framer-motion"
import Link from "next/link"
import { Navigation } from "@/components/story/navigation"
import { Footer } from "@/components/story/footer"

const CHAPTERS = [
  {
    number: "第1章",
    slug: "chapter-01",
    title: "サンカの血",
    excerpt: "山を渡り、川を渡り、記録されなかった民の血が少女の中で目を覚ます。",
  },
  {
    number: "第2章",
    slug: "chapter-02",
    title: "奥多摩の接触",
    excerpt: "霧深い山中で出会った老人は、百の名を呼ばずに「お前が来た」と言った。",
  },
  {
    number: "第3章",
    slug: "chapter-03",
    title: "本当の歴史",
    excerpt: "教科書に載らない歴史がある。それは滅ぼされたのではなく、隠されたのだ。",
  },
  {
    number: "第4章",
    slug: "chapter-04",
    title: "火の前の歴史",
    excerpt: "焚書の炎に消えたはずの写本が、山の祠の奥で眠り続けていた。",
  },
  {
    number: "第5章",
    slug: "chapter-05",
    title: "二つの視線",
    excerpt: "彼女を守ろうとする者と、利用しようとする者。両者の目的は驚くほど近かった。",
  },
  {
    number: "第6章",
    slug: "chapter-06",
    title: "監視と覚醒の訓練",
    excerpt: "見られていると気づいた瞬間、百の感覚は別の次元へと跳躍した。",
  },
  {
    number: "第7章",
    slug: "chapter-07",
    title: "青い血の記憶",
    excerpt: "ムーの末裔は血の中に地図を持つ。それは体温より低く、海より深い場所にある。",
  },
  {
    number: "第8章",
    slug: "chapter-08",
    title: "青い血の記憶・後編",
    excerpt: "記憶の奥に眠る儀式の光景。五色が初めて一堂に会した、太古の夜。",
  },
  {
    number: "第9章",
    slug: "chapter-09",
    title: "前夜",
    excerpt: "全てが収束する前夜、五人は初めて同じ夢を見た。夢の中に、答えがあった。",
  },
  {
    number: "第10章",
    slug: "chapter-10",
    title: "実行",
    excerpt: "言葉ではなく、行動だけが真実を変える。子供たちは山へ向かった。",
  },
  {
    number: "最終章",
    slug: "chapter-final",
    title: "夜明け",
    excerpt: "失われた大陸の記憶が解放されるとき、世界はわずかに、しかし確実に変わった。",
  },
  {
    number: "エピローグ",
    slug: "epilogue",
    title: "それぞれの朝",
    excerpt: "物語は終わらない——最後のページを閉じた後も、あなたの中で続いている。",
  },
]

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

export default function GoshikiNoUtaPage() {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-24 md:pt-40 pb-10 md:pb-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(212,175,55,0.08),transparent_60%)]" />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-gold/70 text-xs tracking-[0.5em] uppercase mb-6"
        >
          五十音 百 · Literary Fiction · 2026
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="font-serif text-[clamp(2rem,6vw,4rem)] font-light leading-[1.2] tracking-[0.05em] mb-4"
        >
          五色の詩
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-paper/50 text-base md:text-lg tracking-widest mb-6 md:mb-10"
        >
          ～ムーの子供たちへ～
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="w-24 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto"
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-6 md:mt-10 text-paper/50 text-sm leading-relaxed max-w-xl mx-auto"
        >
          古代ムー大陸の記憶を継ぐ子供たちの物語。五つの色に秘められた謎が、
          現代と太古の世界を繋ぎ、失われた真実へと導く。
        </motion.p>
      </section>

      {/* Chapter grid */}
      <section className="max-w-6xl mx-auto px-6 pb-16 md:pb-32">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-gold text-xs tracking-[0.5em] uppercase mb-6 md:mb-12"
        >
          Chapters
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
        >
          {CHAPTERS.map((ch, i) => (
            <motion.div key={ch.slug} variants={cardVariants}>
              <Link
                href={`/story/goshiki-no-uta/${i + 1}`}
                className="group block relative rounded-sm border border-paper/10 bg-white/5 backdrop-blur-sm p-4 md:p-6 transition-all duration-500 hover:border-gold/30 hover:bg-white/[0.08]"
              >
                {/* Gold accent line */}
                <span className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-gold/0 to-transparent transition-all duration-500 group-hover:via-gold/40" />

                {/* Chapter number */}
                <p className="font-serif text-gold/40 text-[0.65rem] tracking-[0.3em] mb-2 md:mb-4 transition-colors duration-300 group-hover:text-gold/70">
                  {ch.number}
                </p>

                {/* Title */}
                <h2 className="font-serif text-paper text-xl font-light leading-snug tracking-wide mb-3 transition-colors duration-300 group-hover:text-gold/90">
                  {ch.title}
                </h2>

                {/* Divider */}
                <div className="w-8 h-px bg-gold/20 mb-3 md:mb-4 transition-all duration-500 group-hover:w-12 group-hover:bg-gold/50" />

                {/* Excerpt */}
                <p className="text-paper/40 text-sm leading-relaxed transition-colors duration-300 group-hover:text-paper/60">
                  {ch.excerpt}
                </p>

                {/* Arrow */}
                <p className="mt-3 md:mt-6 text-xs tracking-[0.3em] text-gold/0 transition-all duration-300 group-hover:text-gold/60">
                  Read →
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Back link */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <Link
          href="/story"
          className="text-paper/30 text-xs tracking-[0.3em] uppercase hover:text-gold/70 transition-colors duration-300"
        >
          ← 時の杜 TOP
        </Link>
      </div>

      <Footer />
    </div>
  )
}
