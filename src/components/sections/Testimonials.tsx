import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Twitter, Linkedin, Instagram } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

// i.pravatar.cc serves consistent real face photos by numeric ID (1-70)
// Picked varied IDs for diversity across genders/ethnicities
const testimonials = [
  {
    id: "1",
    quote:
      "Vitae id enim massa urna aenean nulla morbi nunc faucibus. Facilisi a nisi risus placerat risus morbi turpis adipiscing.",
    author: "John Doe",
    role: "Founder of Needz",
    avatar: "https://i.pravatar.cc/80?img=11",
    platform: "twitter" as const,
  },
  {
    id: "2",
    quote:
      "Lorem ipsum dolor sit amet consectetur. Vitae elementum at nisi leo nulla mollis. Feugiat fringilla risus at leo nulla .",
    author: "Sarah Kim",
    role: "CEO, TechVentures",
    avatar: "https://i.pravatar.cc/80?img=47",
    platform: "linkedin" as const,
  },
  {
    id: "3",
    quote:
      "Vitae elementum at nisi leo nulla mollis. Feugiat fringilla risus at nisi leo nulla per. May to elementum at nisi leo n.",
    author: "Jane Doe",
    role: "Product Manager",
    avatar: "https://i.pravatar.cc/80?img=23",
    platform: "instagram" as const,
  },
  {
    id: "4",
    quote:
      "Excepteur sint occaecat cupidatat non proident. Sunt in culpa qui officia deserunt mollit anim id est laborum consectet.",
    author: "Marcus Webb",
    role: "CTO, Launchpad",
    avatar: "https://i.pravatar.cc/80?img=52",
    platform: "twitter" as const,
  },
  {
    id: "5",
    quote:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint.",
    author: "Priya Nair",
    role: "Head of Design",
    avatar: "https://i.pravatar.cc/80?img=44",
    platform: "linkedin" as const,
  },
  {
    id: "6",
    quote:
      "Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure.",
    author: "Leo Strauss",
    role: "Engineering Lead",
    avatar: "https://i.pravatar.cc/80?img=67",
    platform: "instagram" as const,
  },
  {
    id: "7",
    quote:
      "Consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis nostrud exercitatio.",
    author: "Amara Osei",
    role: "Founder, Gridline",
    avatar: "https://i.pravatar.cc/80?img=39",
    platform: "twitter" as const,
  },
  {
    id: "8",
    quote:
      "Nulla facilisi morbi tempus iaculis urna. Id cursus metus aliquam eleifend mi in nulla posuere. Viverra orci sagittis.",
    author: "Tom Reeves",
    role: "VP Product, Stackr",
    avatar: "https://i.pravatar.cc/80?img=59",
    platform: "linkedin" as const,
  },
];

const track = [...testimonials, ...testimonials];

const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case "twitter":
      return <Twitter size={15} />;
    case "linkedin":
      return <Linkedin size={15} />;
    case "instagram":
      return <Instagram size={15} />;
    default:
      return null;
  }
};

function TestimonialCard({
  t,
  isDark,
}: {
  t: (typeof testimonials)[0];
  isDark: boolean;
}) {
  return (
    <div className="shrink-0 w-72 sm:w-80 flex flex-col gap-3">
      {/* ── Bordered card: icon + quote ONLY ── */}
      <div
        className={`rounded-2xl border p-5 flex flex-col gap-4
          ${
            isDark ? "bg-[#141414] border-white/8" : "bg-white border-gray-200"
          }`}
        style={{
          boxShadow: isDark
            ? "0 2px 20px rgba(0,0,0,0.4)"
            : "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        {/* Platform icon badge */}
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-primary
            ${
              isDark
                ? "bg-white/6 border border-white/8"
                : "bg-gray-100 border border-gray-200"
            }`}
        >
          <PlatformIcon platform={t.platform} />
        </div>

        {/* Quote */}
        <p
          className={`font-body text-sm leading-relaxed
            ${isDark ? "text-white/70" : "text-gray-600"}`}
        >
          {t.quote}
        </p>
      </div>

      {/* ── Author row — outside the card ── */}
      <div className="flex items-center gap-3 px-1">
        <img
          src={t.avatar}
          alt={t.author}
          className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-brand/20"
          loading="lazy"
          onError={(e) => {
            // Fallback to initial if image fails
            const target = e.currentTarget;
            target.style.display = "none";
            const sibling = target.nextElementSibling as HTMLElement;
            if (sibling) sibling.style.display = "flex";
          }}
        />
        {/* Fallback initial (hidden by default) */}
        <div className="w-10 h-10 rounded-full bg-brand/20 items-center justify-center font-display font-bold text-brand text-sm shrink-0 hidden">
          {t.author.charAt(0)}
        </div>

        <div>
          <p
            className={`font-display font-semibold text-sm
              ${isDark ? "text-white" : "text-gray-900"}`}
          >
            {t.author}
          </p>
          <p
            className={`text-xs font-body
              ${isDark ? "text-white/40" : "text-gray-400"}`}
          >
            {t.role}
          </p>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({
  track,
  duration,
  isDark,
}: {
  track: typeof testimonials;
  duration: number;
  isDark: boolean;
}) {
  return (
    <div className="flex overflow-hidden py-1">
      <div
        className="flex gap-5 shrink-0"
        style={{
          animation: `marqueeScroll ${duration}s linear infinite`,
          willChange: "transform",
        }}
      >
        {track.map((t, i) => (
          <TestimonialCard key={`${t.id}-${i}`} t={t} isDark={isDark} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { isDark } = useTheme();

  return (
    <section
      ref={ref}
      id="testimonials"
      className={`section-pad overflow-hidden ${isDark ? "bg-[#0d0d0d]" : "bg-light-card"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#DBB078] mb-4">
            Testimonials
          </h2>
          <p className="text-secondary font-body max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Don't just take our word for it. Hear what our satisfied clients
            have to say about their experience with us.
          </p>
        </motion.div>
      </div>

      {/* Marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative w-full"
      >
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 h-full w-28 z-10 pointer-events-none"
          style={{
            background: isDark
              ? "linear-gradient(to right, #0d0d0d, transparent)"
              : "linear-gradient(to right, #f0f0ee, transparent)",
          }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 h-full w-28 z-10 pointer-events-none"
          style={{
            background: isDark
              ? "linear-gradient(to left, #0d0d0d, transparent)"
              : "linear-gradient(to left, #f0f0ee, transparent)",
          }}
        />

        <MarqueeRow track={track} duration={50} isDark={isDark} />
      </motion.div>

      <style>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
