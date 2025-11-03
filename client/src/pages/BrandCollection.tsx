import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/Header";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, Eye, TrendingUp } from "lucide-react";

export default function BrandCollection() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();

  const { data: brand, isLoading: brandLoading } = trpc.brands.getBySlug.useQuery({ slug: slug! });
  const { data: watches, isLoading: watchesLoading } = trpc.watches.getByBrand.useQuery(
    { brandId: brand?.id! },
    { enabled: !!brand?.id }
  );

  if (brandLoading || watchesLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gold-500 text-2xl">
            {language === "ar" ? "جاري التحميل..." : "Loading..."}
          </div>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <div className="text-gold-500 text-2xl">
            {language === "ar" ? "المجموعة غير موجودة" : "Collection not found"}
          </div>
          <Link href="/collections">
            <a className="text-gray-400 hover:text-gold-500 transition-colors">
              {language === "ar" ? "العودة للمجموعات" : "Back to Collections"}
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number | null) => {
    if (!price) return language === "ar" ? "السعر عند الطلب" : "Price on Request";
    return new Intl.NumberFormat(language === "ar" ? "ar-AE" : "en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Brand Hero Section */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-black via-gray-900 to-black border-b border-gold-500/20">
        <div className="container max-w-6xl mx-auto">
          {/* Back Button */}
          <Link href="/collections">
            <a className="inline-flex items-center gap-2 text-gray-400 hover:text-gold-500 transition-colors mb-8">
              {language === "ar" ? (
                <>
                  <ArrowRight className="w-5 h-5" />
                  <span>العودة للمجموعات</span>
                </>
              ) : (
                <>
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Collections</span>
                </>
              )}
            </a>
          </Link>

          {/* Brand Info */}
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gold-500 mb-6">
              {language === "ar" ? brand.nameAr : brand.nameEn}
            </h1>
            <div className="flex items-center justify-center gap-6 text-gray-400 mb-8">
              <span>
                {language === "ar" ? "تأسست" : "Founded"} {brand.foundedYear}
              </span>
              <span>•</span>
              <span>{brand.country}</span>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {language === "ar" ? brand.descriptionAr : brand.descriptionEn}
            </p>
          </div>
        </div>
      </section>

      {/* Watches Grid */}
      <section className="py-20 px-4">
        <div className="container max-w-7xl mx-auto">
          {watches && watches.length > 0 ? (
            <>
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gold-500 mb-2">
                  {language === "ar" ? "الساعات في هذه المجموعة" : "Watches in this Collection"}
                </h2>
                <p className="text-gray-400">
                  {watches.length} {language === "ar" ? "ساعة" : watches.length === 1 ? "watch" : "watches"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {watches.map((watch) => (
                  <Link key={watch.id} href={`/watch/${watch.slug}`}>
                    <div className="group relative bg-gradient-to-br from-gray-900 to-black border border-gold-500/20 rounded-lg overflow-hidden hover:border-gold-500/60 transition-all duration-500 cursor-pointer h-full">
                      {/* Watch Image */}
                      <div className="relative aspect-square bg-gray-800 overflow-hidden">
                        {watch.mainImageUrl ? (
                          <img
                            src={watch.mainImageUrl}
                            alt={language === "ar" ? watch.nameAr : watch.nameEn}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            <Eye className="w-16 h-16" />
                          </div>
                        )}

                        {/* Rarity Badge */}
                        {watch.rarity && (
                          <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gold-500/30">
                            <span className="text-gold-500 text-xs font-medium">{watch.rarity}</span>
                          </div>
                        )}

                        {/* Featured Badge */}
                        {watch.isFeatured && (
                          <div className="absolute top-4 left-4 bg-gold-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-gold-500">
                            <span className="text-gold-500 text-xs font-bold">
                              {language === "ar" ? "مميزة" : "Featured"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Watch Info */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gold-500 mb-2 group-hover:text-gold-400 transition-colors line-clamp-2">
                          {language === "ar" ? watch.nameAr : watch.nameEn}
                        </h3>

                        {watch.referenceNumber && (
                          <p className="text-sm text-gray-500 mb-4">
                            {language === "ar" ? "المرجع" : "Ref."} {watch.referenceNumber}
                          </p>
                        )}

                        {watch.descriptionEn && (
                          <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                            {language === "ar" ? watch.descriptionAr : watch.descriptionEn}
                          </p>
                        )}

                        {/* Specs */}
                        <div className="space-y-2 mb-4 text-sm">
                          {watch.material && (
                            <div className="flex justify-between text-gray-500">
                              <span>{language === "ar" ? "المادة" : "Material"}</span>
                              <span className="text-gray-300">{watch.material}</span>
                            </div>
                          )}
                          {watch.caseSize && (
                            <div className="flex justify-between text-gray-500">
                              <span>{language === "ar" ? "الحجم" : "Size"}</span>
                              <span className="text-gray-300">{watch.caseSize}</span>
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between pt-4 border-t border-gold-500/20">
                          <div className="flex items-center gap-2 text-gold-500">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-bold">{formatPrice(watch.marketValue)}</span>
                          </div>
                          {language === "ar" ? (
                            <ArrowLeft className="w-5 h-5 text-gold-500 group-hover:-translate-x-1 transition-transform" />
                          ) : (
                            <ArrowRight className="w-5 h-5 text-gold-500 group-hover:translate-x-1 transition-transform" />
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl">
                {language === "ar"
                  ? "لا توجد ساعات في هذه المجموعة حالياً"
                  : "No watches in this collection yet"}
              </p>
            </div>
          )}
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
