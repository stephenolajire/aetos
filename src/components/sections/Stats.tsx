import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";

const stats = [
  {
    value: "50+",
    label: "Completed Projects",
    description: "Across fintech, retail, healthcare, and enterprise systems.",
  },
  {
    value: "20+",
    label: "Satisfied Clients",
    description:
      "Building long-lasting, trust-based partnerships and performative work.",
  },
  {
    value: "5+ Years",
    label: "Industry Experience",
    description: "Building, designing, and supporting digital solutions.",
  },
  {
    value: "90%",
    label: "Client Retention Rate",
    description: "Most clients come back — and stay with us for years to come.",
  },
  {
    value: "5+",
    label: "Industries Served",
    description: "From healthcare to logistics and beyond.",
  },
];

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { isDark } = useTheme();

  const cardClass = `flex flex-col gap-2 p-6 border border-gray-600 ${
    isDark ? "bg-[#0d0d0d]" : "bg-white"
  }`;

  return (
    <section
      ref={ref}
      className={`py-16  ${isDark ? "bg-[#0d0d0d]" : "bg-white"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
        {/* Row 1: 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3">
          {stats.slice(0, 3).map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cardClass}
            >
              <span className="font-display font-bold text-3xl sm:text-4xl text-primary leading-none">
                {stat.value}
              </span>
              <span className="font-display font-semibold text-sm text-primary leading-tight">
                {stat.label}
              </span>
              <p className="text-gray-400 text-xs font-body leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Row 2: 2 cards centered with space on left and right */}
        <div className="flex flex-col items-center sm:flex-row sm:justify-center">
          {stats.slice(3).map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: (i + 3) * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`w-full sm:w-1/3 ${cardClass}`}
            >
              <span className="font-display font-bold text-3xl sm:text-4xl text-primary leading-none">
                {stat.value}
              </span>
              <span className="font-display font-semibold text-sm text-primary leading-tight">
                {stat.label}
              </span>
              <p className="text-gray-400 text-xs font-body leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
