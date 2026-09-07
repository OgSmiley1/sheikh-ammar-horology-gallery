import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

interface Story {
  id: string;
  watchModel: string;
  brand: string;
  year: string;
  story: string;
  storyAr: string;
  culturalSignificance: string;
  culturalSignificanceAr: string;
  image?: string;
}

const stories: Story[] = [
  {
    id: '1',
    watchModel: 'Rolex Daytona Paul Newman',
    brand: 'Rolex',
    year: '1960s',
    story: 'This iconic Daytona represents the pinnacle of racing chronographs. The Paul Newman dial, named after the legendary actor and race car driver, embodies the spirit of precision and adventure that resonates with collectors worldwide.',
    storyAr: 'يمثل هذا الديتونا الأيقوني ذروة الكرونوغرافات الرياضية. يجسد قرص بول نيومان، المسمى على اسم الممثل الأسطوري وسائق سباق السيارات، روح الدقة والمغامرة التي تتردد مع المجمعين في جميع أنحاء العالم.',
    culturalSignificance: 'In the UAE, watches like this represent the fusion of Western precision engineering with Eastern appreciation for craftsmanship and heritage.',
    culturalSignificanceAr: 'في الإمارات، تمثل الساعات مثل هذه اندماج الهندسة الدقيقة الغربية مع التقدير الشرقي للحرفية والتراث.',
  },
  {
    id: '2',
    watchModel: 'Patek Philippe Nautilus',
    brand: 'Patek Philippe',
    year: '2021',
    story: 'The Nautilus is a masterpiece of integrated design, created by the legendary designer Gérald Genta. Its distinctive porthole case and integrated bracelet have made it one of the most coveted watches in the world.',
    storyAr: 'ناتيلوس هو تحفة من التصميم المتكامل، من تصميم المصمم الأسطوري جيرالد جينتا. جعلت حالتها المميزة وسوارها المدمج واحدة من أكثر الساعات المرغوبة في العالم.',
    culturalSignificance: 'Patek Philippe watches are symbols of timeless elegance and are passed down through generations, reflecting the UAE\'s values of heritage and continuity.',
    culturalSignificanceAr: 'ساعات باتيك فيليب هي رموز الأناقة الخالدة وتنتقل عبر الأجيال، مما يعكس قيم الإمارات للتراث والاستمرارية.',
  },
  {
    id: '3',
    watchModel: 'Richard Mille RM 26-02',
    brand: 'Richard Mille',
    year: '2018',
    story: 'Richard Mille watches represent the cutting edge of horological innovation. The RM 26-02 features a tourbillon and is a testament to modern watchmaking excellence.',
    storyAr: 'تمثل ساعات ريتشارد ميل طليعة الابتكار الساعاتي. يتميز RM 26-02 بتوربيون وهو شهادة على التميز في صناعة الساعات الحديثة.',
    culturalSignificance: 'Modern collectors in the UAE appreciate both traditional craftsmanship and contemporary innovation, making Richard Mille a perfect representation of this duality.',
    culturalSignificanceAr: 'يقدر المجمعون الحديثون في الإمارات كلا من الحرفية التقليدية والابتكار المعاصر، مما يجعل ريتشارد ميل تمثيلاً مثالياً لهذه الثنائية.',
  },
];

export default function Stories() {
  const [currentStory, setCurrentStory] = useState(0);
  const { language, isRTL } = useLanguage();
  const isArabic = language === 'ar';

  const story = stories[currentStory];

  const handlePrevious = () => {
    setCurrentStory((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentStory((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />

      {/* Main Content */}
      <main className="container px-4 py-32">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="text-4xl font-serif font-bold text-center mb-2">
            {isArabic ? 'ملاحظات ساعاتية' : 'Horological Notes'}
          </h1>
          <p className="text-center text-muted-foreground mb-12">
            {isArabic
              ? 'سياق تحريري حول نماذج بارزة وفن صناعة الساعات'
              : 'Editorial context for notable models and the craft of watchmaking'}
          </p>

          <div className={`mb-8 border-s-2 border-primary/60 bg-card/40 p-5 text-sm leading-7 text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
            {isArabic
              ? 'تقدم هذه الملاحظات سياقاً ثقافياً وتصميمياً حول النماذج المذكورة. وهي ليست إثباتاً لملكية أي ساعة أو جرداً كاملاً لأي مجموعة خاصة.'
              : 'These notes provide cultural and design context for the referenced models. They are not proof of ownership of any timepiece or a complete inventory of any private collection.'}
          </div>

          {/* Story Card */}
          <div className="bg-card border border-border rounded-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-serif font-bold text-accent">
                {story.brand}
              </h2>
              <span className="text-sm text-muted-foreground">{story.year}</span>
            </div>

            <h3 className="text-2xl font-bold mb-6">{story.watchModel}</h3>

            {/* Story Text */}
            <div className="mb-8 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-accent mb-2">
                  {isArabic ? 'ملاحظة تحريرية' : 'Editorial Note'}
                </h4>
                <p className="text-foreground/80 leading-relaxed">
                  {isArabic ? story.storyAr : story.story}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-accent mb-2">
                  {isArabic ? 'سياق ثقافي' : 'Cultural Context'}
                </h4>
                <p className="text-foreground/80 leading-relaxed">
                  {isArabic ? story.culturalSignificanceAr : story.culturalSignificance}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                {isArabic ? 'السابق' : 'Previous'}
              </Button>

              <div className="flex gap-2">
                {stories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStory(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentStory ? 'bg-accent w-8' : 'bg-border'
                    }`}
                    aria-label={isArabic ? `الانتقال إلى القصة ${index + 1}` : `Go to story ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                {isArabic ? 'التالي' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Story Counter */}
            <div className="text-center mt-6 text-sm text-muted-foreground">
              {currentStory + 1} / {stories.length}
            </div>
          </div>

          {/* Back to Collection */}
          <div className="text-center">
            <Link href="/collection" className="inline-flex items-center gap-2 text-accent hover:underline">
              {isArabic ? 'العودة إلى المجموعة ←' : '← Back to Collection'}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
