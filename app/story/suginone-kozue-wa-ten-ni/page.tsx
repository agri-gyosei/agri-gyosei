"use client"

import { motion, type Variants } from "framer-motion"
import Link from "next/link"
import { Navigation } from "@/components/story/navigation"
import { Footer } from "@/components/story/footer"

const CHAPTERS = [
  {
    number: "第1章",
    title: "設計図",
    excerpt: "三十年間、世界の裏側で設計図を描いてきた男。エレズは初めて、その全体図を疑った。",
  },
  {
    number: "第2章",
    title: "亀裂",
    excerpt: "完璧なはずのシステムに、小さな亀裂が入った。見て見ぬふりをするには、大きすぎた。",
  },
  {
    number: "第3章",
    title: "内側から",
    excerpt: "支配する側から世界を見てきた。その目で見ると、地上の人々がどれほど自由かわかった。",
  },
  {
    number: "第4章",
    title: "杉の根",
    excerpt: "杉は根で語る。梢がどれだけ高くても、根がなければ立てない。エレズはそれを知らなかった。",
  },
  {
    number: "第5章",
    title: "日本へ",
    excerpt: "オベリスクのない国。支配の網の外にある島。エレズは理由を探しに、日本へ向かった。",
  },
  {
    number: "第6章",
    title: "三人",
    excerpt: "三人が同じ場所にいた。設計者と、気づいた者と、守る者。三つの視点が交差した。",
  },
  {
    number: "第7章",
    title: "計画の全体",
    excerpt: "全体図を初めて見た時、エレズは笑えなかった。自分が何十年も奉仕してきた計画の、全体を。",
  },
  {
    number: "第8章",
    title: "文書",
    excerpt: "証拠は文書の中にあった。消されるはずだった文書が、なぜか残っていた。",
  },
  {
    number: "第9章",
    title: "根",
    excerpt: "根を張ると決めた。どこに張るか。それが問いだった。エレズは初めて、自分で決めた。",
  },
  {
    number: "第10章",
    title: "放つ",
    excerpt: "手放すとは、失うことではない。植えることだ。エレズは生まれて初めて、何かを植えた。",
  },
  {
    number: "第11章",
    title: "波紋",
    excerpt: "波紋は止まらない。エレズが投げた石が、どこまで届くか、エレズ自身も知らなかった。",
  },
  {
    number: "エピローグ",
    title: "杉の木の下で",
    excerpt: "杉の木の下で、男は座っていた。梢は天に届いていた。根は、地に深く。",
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

export default function SuginoneKozuePage() {
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
          杉の根
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-paper/50 text-base md:text-lg tracking-widest mb-10"
        >
          ～梢は天に、根は地に～
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
          三十年間、計画の内側にいた男が、初めて地上を見た。
          イスラエルの諜報機関員・エレズ。「絵馬」と同時代を、内側から描く物語。
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
                href={`/story/suginone-kozue-wa-ten-ni/${i + 1}`}
                className="group block relative rounded-sm border border-paper/10 bg-white/5 backdrop-blur-sm p-4 md:p-6 transition-all duration-500 hover:border-gold/30 hover:bg-white/[0.08]"
              >
                <span className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-gold/0 to-transparent transition-all duration-500 group-hover:via-gold/40" />

                <p className="font-serif text-gold/40 text-[0.65rem] tracking-[0.3em] mb-4 transition-colors duration-300 group-hover:text-gold/70">
                  {ch.number}
                </p>

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
