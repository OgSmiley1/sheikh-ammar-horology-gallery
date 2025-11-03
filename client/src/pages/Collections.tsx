import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/Header";
import { Link } from "wouter";
import { Crown, ArrowRight, ArrowLeft } from "lucide-react";

export default function Collections() {
  const { language, t } = useLanguage();
  const { data: brands, isLoading } = trpc.brands.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gold-500 text-2xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="relative py-32 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="container max-w-6xl mx-auto text-center">
          <Crown className="w-16 h-16 text-gold-500 mx-auto mb-6" />
          <h1 className="text-5xl md:text-7xl font-bold text-gold-500 mb-6">
            {language === "ar" ? "المجموعات الفاخرة" : "Luxury Collections"}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {language === "ar"
              ? "استكشف مجموعة استثنائية من أرقى دور الساعات السويسرية، كل منها يمثل قمة الحرفية والتراث في صناعة الساعات الفاخرة."
              : "Explore an exceptional collection from the finest Swiss watch houses, each representing the pinnacle of craftsmanship and heritage in haute horlogerie."}
          </p>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="py-20 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brands?.map((brand) => (
              <Link key={brand.id} href={`/collection/${brand.slug}`}>
                <div className="group relative bg-gradient-to-br from-gray-900 to-black border border-gold-500/20 rounded-lg overflow-hidden hover:border-gold-500/60 transition-all duration-500 cursor-pointer">
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative p-8">
                    {/* Brand Name */}
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold text-gold-500 mb-2 group-hover:text-gold-400 transition-colors">
                        {language === "ar" ? brand.nameAr : brand.nameEn}
                      </h2>
                      <div className="h-1 w-16 bg-gold-500/50 group-hover:w-24 transition-all duration-500" />
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                      {language === "ar" ? brand.descriptionAr : brand.descriptionEn}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                      <span>
                        {language === "ar" ? "تأسست" : "Founded"} {brand.foundedYear}
                      </span>
                      <span>{brand.country}</span>
                    </div>

                    {/* View Collection Button */}
                    <div className="flex items-center gap-2 text-gold-500 group-hover:text-gold-400 transition-colors">
                      <span className="font-medium">
                        {language === "ar" ? "استكشف المجموعة" : "Explore Collection"}
                      </span>
                      {language === "ar" ? (
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                      ) : (
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      )}
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gold-500/20 py-8 px-4 mt-20">
        <div className="container max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p className="mb-2">
            {language === "ar"
              ? "الشيخ عمار بن حميد النعيمي"
              : "Sheikh Ammar bin Humaid Al Nuaimi"}
          </p>
          <p>
            {language === "ar" ? "ولي عهد إمارة عجمان" : "Crown Prince of Ajman"}
          </p>
          <p className="mt-4 text-xs">
            © 2025 {language === "ar" ? "جميع الحقوق محفوظة" : "All Rights Reserved"}
          </p>
        </div>
      </footer>
    </div>
  );
}
