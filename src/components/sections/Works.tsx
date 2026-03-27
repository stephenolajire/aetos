import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { projects } from "../../data/projects";

// ── Helper to normalize image src (string path or imported module object) ──
function resolveImageSrc(image: unknown): string {
  if (!image) return "";
  if (typeof image === "object" && image !== null && "src" in image) {
    return (image as { src: string }).src;
  }
  return image as string;
}

// ── Individual card with its own imgError state ──
function WorkCard({
  project,
  index,
  inView,
  isDark,
}: {
  project: (typeof projects)[0];
  index: number;
  inView: boolean;
  isDark: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const imageSrc = resolveImageSrc(project.image);
  const hasImage = !!imageSrc && !imgError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        to="/projects"
        className="group block relative rounded-2xl overflow-hidden"
        style={{
          border: `1px solid ${isDark ? "#222" : "#e0e0e0"}`,
        }}
      >
        {/* Image area */}
        <div
          className="relative h-52 sm:h-64 flex items-center justify-center overflow-hidden"
          style={{ background: project.heroGradient }}
        >
          {/* Noise texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            }}
          />

          {/* Image — shown when available */}
          {hasImage && (
            <img
              src={imageSrc}
              alt={project.title}
              onError={() => setImgError(true)}
              className="absolute inset-0 w-full h-full object-cover z-10"
            />
          )}

          {/* Logo text fallback — shown only when no image */}
          {!hasImage && (
            <span
              className="font-display font-bold text-3xl sm:text-4xl relative z-10 tracking-tight"
              style={{
                color: project.id === "mycliq" ? "#1a0a00" : "#ffffff",
              }}
            >
              {project.logoText}
            </span>
          )}

          {/* Hover overlay — always on top */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center z-20">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-black font-display font-bold text-sm">
              View Project Details <ArrowUpRight size={14} />
            </span>
          </div>
        </div>

        {/* Info */}
        <div
          className={`p-5 ${isDark ? "bg-dark-surface" : "bg-white"} border-t border-subtle`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display font-bold text-2xl text-primary mb-1">
                {project.title}
              </h3>
              <p className="text-gray-400 text-lg font-body mb-2">
                Category: {project.tags[0]}
              </p>
              <p className="text-secondary text-base font-body leading-relaxed line-clamp-2">
                {project.description}
              </p>
            </div>
            <ArrowUpRight
              size={18}
              className="text-muted group-hover:text-brand transition-colors shrink-0 mt-0.5"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Works section ──
export default function Works() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { isDark } = useTheme();

  const featured = projects.slice(0, 4);

  return (
    <section ref={ref} id="works" className="section-pad">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-primary mb-4">
            Our <span className="text-brand">Works</span>
          </h2>
          <p className="text-secondary font-body max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Aetos is the lifeblood of our previous projects. Our portfolio
            showcases the successful collaborations we've had with diverse
            clients across various industries. Let our work speak for itself.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          {featured.map((project, i) => (
            <WorkCard
              key={project.id}
              project={project}
              index={i}
              inView={inView}
              isDark={isDark}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-subtle text-secondary hover:border-brand hover:text-brand font-display font-semibold text-sm transition-all duration-200"
          >
            View All Projects <ArrowUpRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
