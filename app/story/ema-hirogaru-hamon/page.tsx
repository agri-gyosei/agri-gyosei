"use client"

import { motion, type Variants } from "framer-motion"
import Link from "next/link"
import { Navigation } from "@/components/story/navigation"
import { Footer } from "@/components/story/footer"

const CHAPTERS = [
  {
    number: "第1章",
    title: "啓示は、朝のニュースで来た",
    excerpt: "イラン攻撃のニュース、崩れ落ちる石柱。エマの指が聖書を開いた時、糸は動き始めた。",
  },
  {
    number: "第2章",
    title: "煮詰まる",
    excerpt: "点が増えるほど、線が見えなくなる。調べることをやめられない夜が続いた。",
  },
  {
    number: "第3章",
    title: "奥多摩",
    excerpt: "頭を空にしに行ったはずだった。なのに山の中で、エマは何かに出会ってしまった。",
  },
  {
    number: "第4章",
    title: "痕跡",
    excerpt: "誰かがここにいた。最近ではない。でも確かにいた。その気配がエマを離さない。",
  },
  {
    number: "第5章",
    title: "透を探す",
    excerpt: "名前だけが手がかりだった。山路透。その人が残したものが、次の扉を開ける鍵だった。",
  },
  {
    number: "第6章",
    title: "二本の糸",
    excerpt: "二つの話が、全く違う方向から同じ場所へ向かっていた。偶然とは思えなかった。",
  },
  {
    number: "第7章",
    title: "形",
    excerpt: "見えないものに、形を与えようとした。言葉にした瞬間、それは現実になり始めた。",
  },
  {
    number: "第8章",
    title: "暗号",
    excerpt: "古代の石板に刻まれた記号と、現代のニュースが、同じ言葉を話していた。",
  },
  {
    number: "第9章",
    title: "その人",
    excerpt: "会うべき人間がいる。エアはそう言った。エマは、その意味をまだ知らなかった。",
  },
  {
    number: "第10章",
    title: "ユーフラテスへ",
    excerpt: "川は枯れていた。預言書に書かれた通りに。エマは現地へ向かうことを決めた。",
  },
  {
    number: "第11章",
    title: "手紙",
    excerpt: "言葉にできないことを、文字にする。届くかわからない手紙を、エマは書き続けた。",
  },
  {
    number: "第12章",
    title: "返信",
    excerpt: "届いた。それだけで十分だった。返信は、予想とは全く違う形をしていた。",
  },
  {
    number: "",
    title: "帰国",
    excerpt: "戻った場所は同じだった。でも自分が変わっていた。東京の空気が、前と違って感じた。",
  },
  {
    number: "",
    title: "奥多摩",
    excerpt: "また、あの山へ。最初に気づいた場所へ。何かを終わらせるためではなく、始めるために。",
  },
  {
    number: "エピローグ",
    title: "エピローグ",
    excerpt: "波紋は、止まらない。一つの石が水に落ちれば、端まで届く。それが始まりだった。",
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

export default function EmaHirogaruHamonPage() {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-40 pb-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(212,175,55,0.08),transparent_60%)]" />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-gold/70 text-xs tracking-[0.5em] uppercase mb-6"
        >
          五十音 百 · Literary Fiction · Mystery · 2026
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="font-serif text-[clamp(2rem,6vw,4rem)] font-light leading-[1.2] tracking-[0.05em] mb-4"
        >
          絵馬
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-paper/50 text-base md:text-lg tracking-widest mb-10"
        >
          ～広がる波紋～
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
          className="mt-10 text-paper/50 text-sm leading-relaxed max-w-xl mx-auto"
        >
          2026年、イラン攻撃のニュースをきっかけに一人の日本人女性が気づき始める。
          遺跡の破壊、ユーフラテス川、黙示録の預言——すべてが一本の糸で繋がっていた。
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
            <motion.div key={i} variants={cardVariants}>
              <Link
                href={`/story/ema-hirogaru-hamon/${i + 1}`}
                className="group block relative rounded-sm border border-paper/10 bg-white/5 backdrop-blur-sm p-4 md:p-6 transition-all duration-500 hover:border-gold/30 hover:bg-white/[0.08]"
              >
                <span className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-gold/0 to-transparent transition-all duration-500 group-hover:via-gold/40" />

                {ch.number && (
                  <p className="font-serif text-gold/40 text-[0.65rem] tracking-[0.3em] mb-4 transition-colors duration-300 group-hover:text-gold/70">
                    {ch.number}
                  </p>
                )}

                <h2 className="font-serif text-paper text-xl font-light leading-snug tracking-wide mb-3 transition-colors duration-300 group-hover:text-gold/90">
                  {ch.title}
                </h2>

                <div className="w-8 h-px bg-gold/20 mb-4 transition-all duration-500 group-hover:w-12 group-hover:bg-gold/50" />

                <p className="text-paper/40 text-sm leading-relaxed transition-colors duration-300 group-hover:text-paper/60">
                  {ch.excerpt}
                </p>

                <p className="mt-6 text-xs tracking-[0.3em] text-gold/0 transition-all duration-300 group-hover:text-gold/60">
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
