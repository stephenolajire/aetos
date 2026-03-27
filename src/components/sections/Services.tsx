import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Globe,
  Smartphone,
  Bot,
  Shield,
  Search,
  Database,
  Cloud,
  Palette,
  BarChart3,
  Lock,
  Code2,
  Layers,
  Zap,
  Wifi,
  Mail,
  ShoppingCart,
  Video,
  Cpu,
  GitBranch,
  LineChart,
} from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

const services = [
  { id: "web", icon: Globe, label: "Web Development" },
  { id: "mobile", icon: Smartphone, label: "Mobile Apps" },
  { id: "ai", icon: Bot, label: "AI / ML Integration" },
  { id: "qa", icon: Shield, label: "QA Testing" },
  { id: "seo", icon: Search, label: "SEO" },
  { id: "cloud", icon: Cloud, label: "Cloud & DevOps" },
  { id: "design", icon: Palette, label: "UI/UX Design" },
  { id: "data", icon: BarChart3, label: "Data & Analytics" },
  { id: "security", icon: Lock, label: "Cybersecurity" },
  { id: "backend", icon: Code2, label: "Backend Engineering" },
  { id: "db", icon: Database, label: "Database Architecture" },
  { id: "systems", icon: Layers, label: "Systems Design" },
  { id: "perf", icon: Zap, label: "Performance Tuning" },
  { id: "iot", icon: Wifi, label: "IoT Solutions" },
  { id: "email", icon: Mail, label: "Email Automation" },
  { id: "ecom", icon: ShoppingCart, label: "E-Commerce" },
  { id: "video", icon: Video, label: "Video Streaming" },
  { id: "embedded", icon: Cpu, label: "Embedded Systems" },
  { id: "devops", icon: GitBranch, label: "Git & Version Control" },
  { id: "bi", icon: LineChart, label: "Business Intelligence" },
];

// Duplicate for seamless loop
const track = [...services, ...services];

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { isDark } = useTheme();

  return (
    <section
      ref={ref}
      id="services"
      className={`section-pad overflow-hidden ${isDark ? "bg-[#0d0d0d]" : "bg-light-card"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 lg:mb-14"
        >
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-primary mb-4">
            Our <span className="text-[#9174DC]">Services</span>
          </h2>
          <p className="text-secondary font-body max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            From design to deployment — we cover the full stack of what it takes
            to build and grow exceptional digital products.
          </p>
        </motion.div>
      </div>

      {/* Marquee — full-bleed so pills can scroll edge-to-edge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative w-full"
      >
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none"
          style={{
            background: isDark
              ? "linear-gradient(to right, #0d0d0d, transparent)"
              : "linear-gradient(to right, #e8e8e6, transparent)",
          }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none"
          style={{
            background: isDark
              ? "linear-gradient(to left, #0d0d0d, transparent)"
              : "linear-gradient(to left, #e8e8e6, transparent)",
          }}
        />

        {/* Scrolling track */}
        <div className="flex overflow-hidden py-2">
          <div
            className="flex gap-3 shrink-0"
            style={{
              animation: "marqueeScroll 40s linear infinite",
              willChange: "transform",
            }}
          >
            {track.map((service, i) => {
              const Icon = service.icon;
              return (
                <div
                  key={`${service.id}-${i}`}
                  className={`flex items-center gap-2.5 w-auto px-4 py-4 rounded-xl border whitespace-nowrap cursor-default select-none transition-colors duration-200 group
                    ${
                      isDark
                        ? "border-white/10 bg-white/5 hover:bg-brand/10 hover:border-brand/30"
                        : "border-gray-200 bg-white hover:bg-brand/5 hover:border-brand/30"
                    }`}
                >
                  <span className="w-10 relative h-10 border-gray-700 rounded-full bg-black/65 flex items-center justify-center">
                    <Icon
                      size={16}
                      className="text-primary shrink-0 group-hover:scale-110 transition-transform duration-200"
                    />
                  </span>
                  <span className="text-lg font-display font-semibold text-primary">
                    {service.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
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
