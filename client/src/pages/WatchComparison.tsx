import { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/Header";
import { Link } from "wouter";
import {
  X,
  Plus,
  GitCompare,
  Printer,
  ChevronDown,
  ChevronUp,
  Search,
  Award,
  TrendingUp,
  Clock,
  Zap,
  Layers,
  Droplets,
  Battery,
  Calendar,
  Star,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface WatchRow {
  id: number;
  brandId: number;
  nameEn: string;
  nameAr: string | null;
  slug: string;
  referenceNumber: string;
  material: string | null;
  dialColor: string | null;
  caseSize: string | null;
  movement: string | null;
  complications: string | null;
  waterResistance: string | null;
  powerReserve: string | null;
  yearReleased: number | null;
  retailPrice: number | null;
  marketValue: number | null;
  rarity: string | null;
  limitedEdition: boolean;
  productionQuantity: number | null;
  mainImageUrl: string | null;
  isFeatured: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const formatPrice = (price: number | null, lang: string) => {
  if (!price) return lang === "ar" ? "السعر عند الطلب" : "Price on Request";
  return new Intl.NumberFormat(lang === "ar" ? "ar-AE" : "en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const rarityColor = (rarity: string | null) => {
  if (!rarity) return "text-gray-400";
  const r = rarity.toLowerCase();
  if (r.includes("ultra")) return "text-purple-400";
  if (r.includes("extremely")) return "text-red-400";
  if (r.includes("very")) return "text-orange-400";
  if (r.includes("rare")) return "text-yellow-400";
  return "text-green-400";
};

// ─────────────────────────────────────────────────────────────────────────────
// Spec row definition
// ─────────────────────────────────────────────────────────────────────────────

const SPEC_ROWS = [
  {
    icon: <Layers className="w-4 h-4" />,
    labelEn: "Case Material",
    labelAr: "مادة العلبة",
    key: "material",
  },
  {
    icon: <Clock className="w-4 h-4" />,
    labelEn: "Case Size",
    labelAr: "حجم العلبة",
    key: "caseSize",
  },
  {
    icon: <Zap className="w-4 h-4" />,
    labelEn: "Movement",
    labelAr: "الحركة",
    key: "movement",
  },
  {
    icon: <Star className="w-4 h-4" />,
    labelEn: "Dial Color",
    labelAr: "لون الميناء",
    key: "dialColor",
  },
  {
    icon: <Award className="w-4 h-4" />,
    labelEn: "Complications",
    labelAr: "التعقيدات",
    key: "complications",
  },
  {
    icon: <Droplets className="w-4 h-4" />,
    labelEn: "Water Resistance",
    labelAr: "مقاومة الماء",
    key: "waterResistance",
  },
  {
    icon: <Battery className="w-4 h-4" />,
    labelEn: "Power Reserve",
    labelAr: "احتياطي الطاقة",
    key: "powerReserve",
  },
  {
    icon: <Calendar className="w-4 h-4" />,
    labelEn: "Year Released",
    labelAr: "سنة الإصدار",
    key: "yearReleased",
  },
  {
    icon: <TrendingUp className="w-4 h-4" />,
    labelEn: "Retail Price",
    labelAr: "سعر التجزئة",
    key: "retailPrice",
    isPrice: true,
  },
  {
    icon: <TrendingUp className="w-4 h-4" />,
    labelEn: "Market Value",
    labelAr: "القيمة السوقية",
    key: "marketValue",
    isPrice: true,
    isHighlight: true,
  },
  {
    icon: <Award className="w-4 h-4" />,
    labelEn: "Rarity",
    labelAr: "الندرة",
    key: "rarity",
    isRarity: true,
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Watch Selector Card
// ─────────────────────────────────────────────────────────────────────────────

function WatchSelectorCard({
  index,
  selected,
  allWatches,
  brandMap,
  onSelect,
  onRemove,
  language,
}: {
  index: number;
  selected: WatchRow | null;
  allWatches: WatchRow[];
  brandMap: Record<number, string>;
  onSelect: (w: WatchRow) => void;
  onRemove: () => void;
  language: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = allWatches.filter((w) => {
    const q = query.toLowerCase();
    return (
      w.nameEn.toLowerCase().includes(q) ||
      (w.nameAr || "").includes(q) ||
      w.referenceNumber.toLowerCase().includes(q) ||
      (brandMap[w.brandId] || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="relative flex-1 min-w-0">
      {selected ? (
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gold-500/40 rounded-xl overflow-hidden">
          {/* Watch Image */}
          <div className="relative h-48 bg-gray-800 overflow-hidden">
            {selected.mainImageUrl ? (
              <img
                src={selected.mainImageUrl}
                alt={language === "ar" ? selected.nameAr || selected.nameEn : selected.nameEn}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Clock className="w-16 h-16 text-gold-500/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <button
              onClick={onRemove}
              className="absolute top-2 right-2 w-7 h-7 bg-black/70 hover:bg-red-500/80 border border-white/20 hover:border-red-400 rounded-full flex items-center justify-center text-white transition-all"
              aria-label="Remove watch"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="absolute bottom-2 left-3 right-3">
              <p className="text-gold-500 text-xs font-semibold tracking-widest uppercase truncate">
                {brandMap[selected.brandId] || ""}
              </p>
            </div>
          </div>

          {/* Watch Name */}
          <div className="p-4">
            <Link href={`/watch/${selected.slug}`}>
              <h3 className="text-white font-bold text-sm leading-snug hover:text-gold-400 transition-colors line-clamp-2">
                {language === "ar" ? (selected.nameAr || selected.nameEn) : selected.nameEn}
              </h3>
            </Link>
            <p className="text-gray-500 text-xs mt-1">{selected.referenceNumber}</p>
            {selected.rarity && (
              <span className={`text-xs font-semibold mt-2 block ${rarityColor(selected.rarity)}`}>
                {selected.rarity}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="w-full h-48 border-2 border-dashed border-gold-500/30 hover:border-gold-500/60 rounded-xl flex flex-col items-center justify-center gap-3 transition-all group bg-gradient-to-br from-gray-900/50 to-black"
          >
            <div className="w-12 h-12 rounded-full bg-gold-500/10 group-hover:bg-gold-500/20 border border-gold-500/30 group-hover:border-gold-500/60 flex items-center justify-center transition-all">
              <Plus className="w-6 h-6 text-gold-500" />
            </div>
            <span className="text-gold-500/70 text-sm font-medium">
              {language === "ar" ? `اختر الساعة ${index + 1}` : `Select Watch ${index + 1}`}
            </span>
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gold-500/30 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="p-3 border-b border-gold-500/20">
                <div className="flex items-center gap-2 bg-black rounded-lg px-3 py-2 border border-gold-500/20">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={language === "ar" ? "البحث عن ساعة..." : "Search watches..."}
                    className="bg-transparent text-white text-sm outline-none flex-1 placeholder:text-gray-500"
                    autoFocus
                  />
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-6">
                    {language === "ar" ? "لا توجد نتائج" : "No results"}
                  </p>
                ) : (
                  filtered.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => {
                        onSelect(w);
                        setOpen(false);
                        setQuery("");
                      }}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gold-500/10 transition-colors text-left border-b border-gold-500/10 last:border-0"
                    >
                      <div className="shrink-0 w-10 h-10 bg-gray-800 rounded overflow-hidden">
                        {w.mainImageUrl ? (
                          <img src={w.mainImageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Clock className="w-5 h-5 text-gold-500/30" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {language === "ar" ? (w.nameAr || w.nameEn) : w.nameEn}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {brandMap[w.brandId]} · {w.referenceNumber}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
              <div className="p-2 border-t border-gold-500/20">
                <button
                  onClick={() => setOpen(false)}
                  className="w-full text-xs text-gray-500 hover:text-gray-300 py-1 transition-colors"
                >
                  {language === "ar" ? "إغلاق" : "Close"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function WatchComparison() {
  const { language } = useLanguage();
  const { data: allWatches = [] } = trpc.watches.getAll.useQuery();
  const { data: allBrands = [] } = trpc.brands.getAll.useQuery();

  const brandMap: Record<number, string> = {};
  allBrands.forEach((b) => {
    brandMap[b.id] = language === "ar" ? b.nameAr || b.nameEn : b.nameEn;
  });

  const MAX_COMPARE = 3;
  const [selectedWatches, setSelectedWatches] = useState<(WatchRow | null)[]>([null, null, null]);

  const selectWatch = useCallback(
    (index: number, watch: WatchRow) => {
      setSelectedWatches((prev) => {
        const next = [...prev];
        next[index] = watch;
        return next;
      });
    },
    []
  );

  const removeWatch = useCallback((index: number) => {
    setSelectedWatches((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  }, []);

  const activeWatches = selectedWatches.filter(Boolean) as WatchRow[];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-10 px-4 bg-gradient-to-b from-black via-gray-900/40 to-black text-center">
        <div className="container max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/30 rounded-full px-4 py-1.5 mb-6">
            <GitCompare className="w-4 h-4 text-gold-500" />
            <span className="text-gold-500 text-sm font-semibold tracking-widest uppercase">
              {language === "ar" ? "أداة المقارنة" : "Comparison Tool"}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {language === "ar" ? "قارن بين الساعات" : "Compare Watches"}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {language === "ar"
              ? "اختر حتى 3 ساعات من المجموعة الملكية وقارن مواصفاتها جنبًا إلى جنب"
              : "Select up to 3 timepieces from the Royal Collection and compare their specifications side by side"}
          </p>
        </div>
      </section>

      {/* Watch Selectors */}
      <section className="py-8 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-gold-500 text-sm font-semibold tracking-widest uppercase">
              {language === "ar" ? "اختر الساعات" : "Select Timepieces"}
            </h2>
            <div className="flex-1 h-px bg-gold-500/20" />
            {activeWatches.length >= 2 && (
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 text-sm font-medium text-gold-500 hover:text-gold-400 bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 hover:border-gold-500/60 px-4 py-2 rounded-lg transition-all print:hidden"
              >
                <Printer className="w-4 h-4" />
                {language === "ar" ? "طباعة المقارنة" : "Print Comparison"}
              </button>
            )}
          </div>

          <div className="flex gap-4 flex-wrap md:flex-nowrap">
            {Array.from({ length: MAX_COMPARE }).map((_, i) => (
              <WatchSelectorCard
                key={i}
                index={i}
                selected={selectedWatches[i]}
                allWatches={allWatches as WatchRow[]}
                brandMap={brandMap}
                onSelect={(w) => selectWatch(i, w)}
                onRemove={() => removeWatch(i)}
                language={language}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      {activeWatches.length >= 1 && (
        <section className="py-8 px-4 print:py-2">
          <div className="container max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-gold-500 text-sm font-semibold tracking-widest uppercase">
                {language === "ar" ? "المواصفات التقنية" : "Technical Specifications"}
              </h2>
              <div className="flex-1 h-px bg-gold-500/20" />
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gold-500/20">
              <table className="w-full text-sm">
                {/* Column Headers */}
                <thead>
                  <tr className="border-b border-gold-500/20 bg-gradient-to-r from-gray-900 to-black">
                    <th className="text-left px-5 py-4 text-gold-500 font-semibold text-xs uppercase tracking-widest w-40">
                      {language === "ar" ? "المواصفة" : "Specification"}
                    </th>
                    {selectedWatches.map((w, i) =>
                      w ? (
                        <th key={i} className="px-5 py-4 text-center min-w-[200px]">
                          <div>
                            <p className="text-gold-500 text-xs font-semibold uppercase tracking-widest mb-1">
                              {brandMap[w.brandId]}
                            </p>
                            <p className="text-white font-bold text-sm leading-snug line-clamp-2">
                              {language === "ar" ? (w.nameAr || w.nameEn) : w.nameEn}
                            </p>
                            <p className="text-gray-500 text-xs mt-0.5">{w.referenceNumber}</p>
                          </div>
                        </th>
                      ) : null
                    )}
                  </tr>
                </thead>

                <tbody>
                  {SPEC_ROWS.map((row, rowIdx) => (
                    <tr
                      key={row.key}
                      className={`border-b border-gold-500/10 transition-colors hover:bg-gold-500/5 ${
                        rowIdx % 2 === 0 ? "bg-black" : "bg-gray-900/30"
                      } ${row.isHighlight ? "bg-gold-500/5 hover:bg-gold-500/10" : ""}`}
                    >
                      {/* Label */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-gray-400">
                          <span className="text-gold-500/60">{row.icon}</span>
                          <span className="text-xs font-medium uppercase tracking-wider">
                            {language === "ar" ? row.labelAr : row.labelEn}
                          </span>
                        </div>
                      </td>

                      {/* Values */}
                      {selectedWatches.map((w, i) =>
                        w ? (
                          <td key={i} className="px-5 py-4 text-center">
                            {row.isPrice ? (
                              <span className={`font-bold ${row.isHighlight ? "text-gold-500 text-base" : "text-white"}`}>
                                {formatPrice(w[row.key] as number | null, language)}
                              </span>
                            ) : row.isRarity ? (
                              <span className={`font-semibold text-sm ${rarityColor(w[row.key] as string | null)}`}>
                                {(w[row.key] as string | null) || "—"}
                              </span>
                            ) : (
                              <span className="text-gray-200 text-sm">
                                {w[row.key] != null && w[row.key] !== ""
                                  ? String(w[row.key])
                                  : <span className="text-gray-600">—</span>}
                              </span>
                            )}
                          </td>
                        ) : null
                      )}
                    </tr>
                  ))}

                  {/* Limited Edition Row */}
                  <tr className="border-b border-gold-500/10 bg-black hover:bg-gold-500/5 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <span className="text-gold-500/60"><Award className="w-4 h-4" /></span>
                        <span className="text-xs font-medium uppercase tracking-wider">
                          {language === "ar" ? "إصدار محدود" : "Limited Edition"}
                        </span>
                      </div>
                    </td>
                    {selectedWatches.map((w, i) =>
                      w ? (
                        <td key={i} className="px-5 py-4 text-center">
                          {w.limitedEdition ? (
                            <div>
                              <span className="inline-block bg-gold-500/20 text-gold-500 border border-gold-500/40 text-xs font-semibold px-3 py-1 rounded-full">
                                {language === "ar" ? "نعم" : "Yes"}
                              </span>
                              {w.productionQuantity && (
                                <p className="text-gray-400 text-xs mt-1">
                                  {language === "ar" ? `${w.productionQuantity} قطعة` : `${w.productionQuantity} pieces`}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">
                              {language === "ar" ? "لا" : "No"}
                            </span>
                          )}
                        </td>
                      ) : null
                    )}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Value Appreciation */}
            {activeWatches.some((w) => w.retailPrice && w.marketValue && w.marketValue > w.retailPrice) && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedWatches.map((w, i) =>
                  w && w.retailPrice && w.marketValue && w.marketValue > w.retailPrice ? (
                    <div key={i} className="bg-gradient-to-br from-gray-900 to-black border border-gold-500/20 rounded-xl p-5 hover:border-gold-500/40 transition-all">
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
                        {language === "ar" ? "تقدير القيمة" : "Value Appreciation"}
                      </p>
                      <p className="text-white font-semibold text-sm mb-3 line-clamp-1">
                        {language === "ar" ? (w.nameAr || w.nameEn) : w.nameEn}
                      </p>
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <div
                            className="bg-gold-500/30 rounded-full h-2 mb-1"
                            style={{
                              width: `${Math.min(100, (w.retailPrice / w.marketValue) * 100)}%`,
                            }}
                          />
                          <div className="bg-gold-500 rounded-full h-2" />
                        </div>
                        <span className="text-gold-500 font-bold text-lg">
                          +{Math.round(((w.marketValue - w.retailPrice) / w.retailPrice) * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>{language === "ar" ? "التجزئة" : "Retail"}: {formatPrice(w.retailPrice, language)}</span>
                        <span>{language === "ar" ? "السوق" : "Market"}: {formatPrice(w.marketValue, language)}</span>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Empty state */}
      {activeWatches.length === 0 && (
        <section className="py-20 px-4 text-center">
          <div className="container max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <GitCompare className="w-10 h-10 text-gold-500/40" />
            </div>
            <h3 className="text-gray-300 text-xl font-semibold mb-3">
              {language === "ar" ? "ابدأ المقارنة" : "Start Comparing"}
            </h3>
            <p className="text-gray-500 leading-relaxed">
              {language === "ar"
                ? "اختر ساعتين أو ثلاث ساعات من المجموعة الملكية لمقارنة مواصفاتها التقنية وقيمتها السوقية"
                : "Choose two or three timepieces from the Royal Collection to compare their technical specifications and market values"}
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 mt-6 text-gold-500 hover:text-gold-400 border border-gold-500/30 hover:border-gold-500/60 px-6 py-3 rounded-lg transition-all text-sm font-semibold"
            >
              {language === "ar" ? "استعرض المجموعة" : "Browse Collection"}
            </Link>
          </div>
        </section>
      )}

      {/* Disclaimer */}
      {activeWatches.length > 0 && (
        <section className="py-6 px-4 print:hidden">
          <div className="container max-w-6xl mx-auto">
            <p className="text-gray-600 text-xs text-center">
              {language === "ar"
                ? "* قيم السوق تقديرية وتخضع للتغيير. تواصل مع خبراء الساعات للحصول على تقييمات دقيقة."
                : "* Market values are estimates and subject to change. Consult watch experts for accurate valuations."}
            </p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-gold-500/20 py-8 px-4 mt-8 print:hidden">
        <div className="container max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p className="mb-2">
            {language === "ar" ? "الشيخ عمار بن حميد النعيمي" : "Sheikh Ammar bin Humaid Al Nuaimi"}
          </p>
          <p>{language === "ar" ? "ولي عهد إمارة عجمان" : "Crown Prince of Ajman"}</p>
          <p className="mt-4 text-xs">
            © 2025 {language === "ar" ? "جميع الحقوق محفوظة" : "All Rights Reserved"}
          </p>
        </div>
      </footer>

      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .print\\:hidden { display: none !important; }
          table { border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px 12px; }
          th { background: #f5f5f5; }
        }
      `}</style>
    </div>
  );
}
