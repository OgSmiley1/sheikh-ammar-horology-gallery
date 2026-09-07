import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Link } from 'wouter';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface Room {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  image: string;
  highlights: string[];
  highlightsAr: string[];
}

const rooms: Room[] = [
  {
    id: '1',
    name: 'Grand Entrance Hall',
    nameAr: 'قاعة الدخول الكبرى',
    description: 'Welcome to an editorial virtual tour of the archive. This entrance hall sets the tone for a journey through published watch appearances, maison craft, and Arabian design heritage.',
    descriptionAr: 'مرحباً بك في جولة افتراضية تحريرية للأرشيف. تهيئ هذه القاعة بداية الرحلة عبر ظهور الساعات المنشور، وحرفية الدور، وتراث التصميم العربي.',
    image: '/sheikh-examining-watches.webp',
    highlights: ['Welcoming atmosphere', 'Premium ambiance', 'Heritage design'],
    highlightsAr: ['أجواء ترحيبية', 'أجواء فاخرة', 'تصميم تراثي'],
  },
  {
    id: '2',
    name: 'Vintage Collection Wing',
    nameAr: 'جناح المجموعة الكلاسيكية',
    description: 'Explore timeless designs that provide context for the archive. From iconic Rolex models to vintage references, each room considers the precision and craftsmanship that span decades.',
    descriptionAr: 'استكشف التصاميم الخالدة التي تمنح الأرشيف سياقه. من طرازات رولكس الأيقونية إلى المراجع الكلاسيكية، يتناول كل جناح الدقة والحرفية عبر العقود.',
    image: '/watches/278694984_1021506258792161_7433008742422839721_n-1681913736827_800x.webp',
    highlights: ['Vintage treasures', 'Iconic models', 'Historical significance'],
    highlightsAr: ['كنوز كلاسيكية', 'طرازات أيقونية', 'أهمية تاريخية'],
  },
  {
    id: '3',
    name: 'Contemporary Masterpieces',
    nameAr: 'تحف معاصرة',
    description: 'Consider modern watchmaking through published models from maisons such as Richard Mille, Audemars Piguet, and Patek Philippe. This wing frames technical innovation as editorial context, not an inventory claim.',
    descriptionAr: 'تأمل صناعة الساعات الحديثة عبر طرازات منشورة من دور مثل ريتشارد ميل وأوديمارس بيجيه وباتيك فيليب. يقدم هذا الجناح الابتكار التقني كسياق تحريري لا كادعاء جرد.',
    image: '/watches/rm26-02-1674211731885_800x.webp',
    highlights: ['Modern innovation', 'Luxury brands', 'Future of horology'],
    highlightsAr: ['ابتكار حديث', 'علامات تجارية فاخرة', 'مستقبل الساعات'],
  },
  {
    id: '4',
    name: 'Heritage & Legacy',
    nameAr: 'التراث والإرث',
    description: 'Discover the editorial themes behind the featured appearances. This reflective space connects Arabian heritage with global horological craft while respecting the archive\'s published-source boundary.',
    descriptionAr: 'اكتشف الموضوعات التحريرية وراء الظهورات المختارة. يربط هذا الفضاء التأملي التراث العربي بحرفية صناعة الساعات عالمياً، مع احترام حدود المصادر المنشورة للأرشيف.',
    image: '/sheikh-portrait-1.jpeg',
    highlights: ['Personal stories', 'Cultural connection', 'Global excellence'],
    highlightsAr: ['قصص شخصية', 'الاتصال الثقافي', 'التميز العالمي'],
  },
];

export default function VirtualTour() {
  const { language, isRTL } = useLanguage();
  const [currentRoom, setCurrentRoom] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const room = rooms[currentRoom];

  const handlePrevious = () => {
    setCurrentRoom((prev) => (prev === 0 ? rooms.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentRoom((prev) => (prev === rooms.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />

      <main className="container px-4 pb-12 pt-32">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <h1 className="text-4xl font-serif font-bold text-center mb-2">
            {language === 'ar' ? 'جولة المتحف الافتراضية' : 'Virtual Museum Tour'}
          </h1>
          <p className="text-center text-muted-foreground mb-12">
            {language === 'ar'
              ? 'استكشف أجنحة المجموعة الملكية'
              : 'Explore the wings of the Royal Collection'}
          </p>

          {/* Room Display */}
          <div className="mb-12">
            {/* Room Image */}
            <div className="relative mb-8 rounded-lg overflow-hidden bg-muted aspect-video">
              <img
                src={room.image}
                alt={language === 'ar' ? room.nameAr : room.name}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="gallery-overlay-button absolute right-4 top-4 rounded-lg p-2 transition-colors"
                aria-label={isRTL ? 'عرض بملء الشاشة' : 'Fullscreen'}
              >
                <Maximize2 className="h-5 w-5" />
              </button>
            </div>

            {/* Room Info */}
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-3xl font-serif font-bold text-accent mb-4">
                {language === 'ar' ? room.nameAr : room.name}
              </h2>

              <p className="text-foreground/80 leading-relaxed mb-6">
                {language === 'ar' ? room.descriptionAr : room.description}
              </p>

              {/* Highlights */}
              <div>
                <h3 className="text-sm font-semibold text-accent mb-3">
                  {language === 'ar' ? 'النقاط البارزة' : 'Highlights'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(language === 'ar' ? room.highlightsAr : room.highlights).map(
                    (highlight, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                      >
                        {highlight}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-8 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  className="flex items-center gap-2"
                >
                  {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  {language === 'ar' ? 'السابق' : 'Previous'}
                </Button>

                <div className="flex gap-2">
                  {rooms.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentRoom(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentRoom ? 'bg-accent w-8' : 'bg-border'
                      }`}
                      aria-label={isRTL ? `الانتقال إلى القاعة ${index + 1}` : `Go to room ${index + 1}`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  {language === 'ar' ? 'التالي' : 'Next'}
                  {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </div>

              {/* Room Counter */}
              <div className="text-center mt-6 text-sm text-muted-foreground">
                {currentRoom + 1} / {rooms.length}
              </div>
            </div>
          </div>

          {/* Back to Collection */}
          <div className="text-center">
            <Link href="/collection" className="inline-flex items-center gap-2 text-accent hover:underline">
              {language === 'ar' ? '← العودة إلى المجموعة' : '← Back to Collection'}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
