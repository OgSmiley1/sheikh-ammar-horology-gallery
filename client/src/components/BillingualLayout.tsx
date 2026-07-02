import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface BillingualLayoutProps {
  /** Image shown on the leading side (left in EN / right in AR). */
  imageSrc: string;
  imageAlt: string;
  /** Extra classes for the <img> element (e.g. aspect ratio / object-fit). */
  imageClassName?: string;
  /** Width utility for the image column. Default: lg:w-5/12 */
  imageColumnClassName?: string;
  /** Text/content column — rendered as children so callers keep full control. */
  children: ReactNode;
}

/**
 * BillingualLayout — RTL-aware image + content split section.
 *
 * In English the image sits on the left and content on the right; in Arabic
 * the order flips (`lg:flex-row-reverse`) and content is right-aligned. The
 * image is framed with gold corner-accent decorators and slides in from the
 * leading edge. All page-specific content (headings, stats, CTAs, …) is passed
 * as `children`, so this component owns only the shared bilingual shell.
 */
export function BillingualLayout({
  imageSrc,
  imageAlt,
  imageClassName = "w-full aspect-[3/4] object-cover object-top",
  imageColumnClassName = "w-full lg:w-5/12",
  children,
}: BillingualLayoutProps) {
  const { isRTL } = useLanguage();

  return (
    <div
      className={`flex flex-col ${isRTL ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-16 lg:gap-24`}
    >
      {/* Image */}
      <motion.div
        className={`relative flex-shrink-0 ${imageColumnClassName}`}
        initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        viewport={{ once: true }}
      >
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.12)" }}
        >
          <img src={imageSrc} alt={imageAlt} className={imageClassName} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          {/* Corner accent decorators */}
          <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-[#d4af37]/60 pointer-events-none" />
          <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-[#d4af37]/60 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-[#d4af37]/60 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-[#d4af37]/60 pointer-events-none" />
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}
        initial={{ opacity: 0, x: isRTL ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        viewport={{ once: true }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default BillingualLayout;
