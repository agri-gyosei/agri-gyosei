export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-emerald-700" />

      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 bg-white -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10 bg-white translate-y-1/2 -translate-x-1/3" />

      <div className="relative z-10 text-center px-8 max-w-xl w-full">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl bg-amber-400">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
              <line x1="22" y1="38" x2="22" y2="10" stroke="#1c3d1c" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="22" cy="9" rx="4.5" ry="7" fill="#1c3d1c" />
              <ellipse cx="15" cy="16" rx="3.5" ry="6" fill="#1c3d1c" transform="rotate(-35 15 16)" />
              <ellipse cx="29" cy="16" rx="3.5" ry="6" fill="#1c3d1c" transform="rotate(35 29 16)" />
              <ellipse cx="13" cy="25" rx="3" ry="5" fill="#1c3d1c" opacity="0.8" transform="rotate(-20 13 25)" />
              <ellipse cx="31" cy="25" rx="3" ry="5" fill="#1c3d1c" opacity="0.8" transform="rotate(20 31 25)" />
            </svg>
          </div>
        </div>

        <span className="inline-block text-xs font-bold px-5 py-1.5 rounded-full mb-6 tracking-widest bg-amber-400 text-green-950">
          COMING SOON ／ 準備中
        </span>

        <h1 className="font-bold leading-snug mb-6 text-white">
          <span className="block text-xl md:text-2xl text-amber-300 mb-2 font-medium tracking-widest">
            兼業農家を支える
          </span>
          <span className="block text-4xl md:text-5xl tracking-wide">
            行政書士
          </span>
        </h1>

        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-14 bg-green-500" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <div className="h-px w-14 bg-green-500" />
        </div>

        <p className="text-green-100 text-base md:text-lg leading-relaxed mb-10">
          農業経営と行政手続きの橋渡し。<br />
          兼業農家の方々を全力でサポートします。
        </p>

        <a
          href="mailto:agri.gyosei@gmail.com"
          className="inline-block border border-green-400 text-green-200 text-sm px-6 py-2.5 rounded-full hover:bg-green-700 transition-colors duration-200 mb-10"
        >
          お問い合わせ: agri.gyosei@gmail.com
        </a>

        <p className="text-green-400 text-xs tracking-[0.35em]">
          agri-gyosei.com
        </p>
      </div>
    </div>
  );
}
