"use client"

import { motion, type Variants } from "framer-motion"
import Link from "next/link"
import { Navigation } from "@/components/story/navigation"
import { Footer } from "@/components/story/footer"

const CHAPTERS = [
  {
    number: "第1章",
    title: "奥多摩の午後",
    excerpt: "地図に載っていない場所に、体が勝手に来た。そこで出会った男が、三時間話し続けた。",
  },
  {
    number: "第2章",
    title: "東京",
    excerpt: "帰った夜、いつものニュースが違って見えた。スマートフォンを置いて、窓の外を見た。",
  },
  {
    number: "第3章",
    title: "二度目の奥多摩",
    excerpt: "また来てしまった。観測者という言葉が、頭から離れなかった。",
  },
  {
    number: "第4章",
    title: "日常",
    excerpt: "電車の中で、向かいのサラリーマンを見た。一週間前の自分と、同じ目をしていた。",
  },
  {
    number: "第5章",
    title: "友人",
    excerpt: "田中に、ヒーロー映画の話をした。田中は気づいていなかった。自分が言ったことの意味に。",
  },
  {
    number: "第6章",
    title: "問い",
    excerpt: "深夜、ノートを開いた。ソクラテス、釈迦、イエス。三人が同じことを言っていた。",
  },
  {
    number: "第7章",
    title: "母",
    excerpt: "実家に帰った。母の背中が、小さくなっていた。",
  },
  {
    number: "第8章",
    title: "観測者",
    excerpt: "石を投げると、波紋が広がる。波紋は消えても、水の分子は動き続ける。",
  },
  {
    number: "第9章",
    title: "選択",
    excerpt: "大きなことは、何もしていない。ただ、意図的に選択していた。",
  },
  {
    number: "エピローグ",
    title: "波紋の先に",
    excerpt: "春の奥多摩で、一人座っていた。波紋は、続いていた。",
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

export default function TakumiPage() {
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
          五十音 百 · Literary Fiction · Mystery · 2027
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="font-serif text-[clamp(2rem,6vw,4rem)] font-light leading-[1.2] tracking-[0.05em] mb-4"
        >
          拓海
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-paper/50 text-base md:text-lg tracking-widest mb-10"
        >
          ～救世主はあなた自身～
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
          普通の若者・山下拓海は、ある日奥多摩の山で一人の男に出会う。
          ヒーローが世界を救うと信じていた拓海が、気づき始める。
          救世主は、ずっと自分の内側にいたと。
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
                href={`/story/takumi-kyuseishu-wa-anata-jishin/${i + 1}`}
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
