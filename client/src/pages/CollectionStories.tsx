import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Header } from '../components/Header';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Story {
  id: number;
  title: { en: string; ar: string };
  story: { en: string; ar: string };
  image: string;
  videoLoop?: string;
  year: string;
  tone: 'innovation' | 'heritage' | 'craftsmanship' | 'rarity';
}

const stories: Story[] = [
  {
    id: 1,
    title: {
      en: 'The Beginning of a Legacy',
      ar: 'بداية إرث عظيم',
    },
    story: {
      en: 'Sheikh Ammar\'s journey into horology began with a fascination for mechanical precision and artistic craftsmanship. His first acquisition, a vintage Rolex Daytona, sparked a passion that would grow into one of the world\'s most distinguished collections.',
      ar: 'بدأت رحلة الشيخ عمار في عالم الساعات بشغف للدقة الميكانيكية والحرفية الفنية. كانت أول ساعة له، رولكس دايتونا عتيقة، شرارة أشعلت شغفاً نما ليصبح واحدة من أكثر المجموعات تميزاً في العالم.',
    },
    image: '/watches/rolex-daytona.jpg',
    year: '2010',
    tone: 'heritage',
  },
  {
    id: 2,
    title: {
      en: 'The Pursuit of Innovation',
      ar: 'السعي وراء الابتكار',
    },
    story: {
      en: 'Richard Mille\'s revolutionary approach to watchmaking captivated Sheikh Ammar. The RM 26-02 "Evil Eye" represents not just a timepiece, but a statement of technological advancement and artistic vision, combining aerospace materials with traditional craftsmanship.',
      ar: 'أسلوب ريتشارد ميل الثوري في صناعة الساعات أسر الشيخ عمار. تمثل RM 26-02 "عين الشر" ليس مجرد ساعة، بل بياناً للتقدم التكنولوجي والرؤية الفنية، حيث تجمع بين مواد الطيران والحرفية التقليدية.',
    },
    image: '/watches/rm-26-02.jpg',
    year: '2018',
    tone: 'innovation',
  },
  {
    id: 3,
    title: {
      en: 'Swiss Excellence',
      ar: 'التميز السويسري',
    },
    story: {
      en: 'Patek Philippe represents the pinnacle of Swiss watchmaking. The 5470P, with its perpetual calendar and split-seconds chronograph, embodies centuries of horological expertise. For Sheikh Ammar, it symbolizes the perfect marriage of tradition and technical mastery.',
      ar: 'تمثل باتيك فيليب قمة صناعة الساعات السويسرية. تجسد 5470P، بتقويمها الدائم وكرونوغرافها المنقسم الثواني، قروناً من الخبرة في صناعة الساعات. بالنسبة للشيخ عمار، ترمز إلى الزواج المثالي بين التقليد والإتقان التقني.',
    },
    image: '/watches/patek-5470p.jpg',
    year: '2020',
    tone: 'craftsmanship',
  },
  {
    id: 4,
    title: {
      en: 'The Independent Spirit',
      ar: 'الروح المستقلة',
    },
    story: {
      en: 'F.P. Journe\'s Chronomètre à Résonance showcases the brilliance of independent watchmaking. Its unique resonance phenomenon, where two balance wheels synchronize naturally, represents innovation unbounded by corporate constraints—a philosophy Sheikh Ammar deeply appreciates.',
      ar: 'يعرض F.P. Journe Chronomètre à Résonance تألق صناعة الساعات المستقلة. ظاهرة الرنين الفريدة، حيث يتزامن عجلتا التوازن بشكل طبيعي، تمثل الابتكار غير المقيد بالقيود المؤسسية—فلسفة يقدرها الشيخ عمار بعمق.',
    },
    image: '/watches/fp-journe.jpg',
    year: '2019',
    tone: 'innovation',
  },
  {
    id: 5,
    title: {
      en: 'Rare Treasures',
      ar: 'كنوز نادرة',
    },
    story: {
      en: 'The Patek Philippe Nautilus 5711/1300A in olive green represents the ultimate in rarity. With only a handful produced, this piece exemplifies Sheikh Ammar\'s ability to acquire the most sought-after timepieces in the world, pieces that most collectors can only dream of.',
      ar: 'تمثل باتيك فيليب نوتيلوس 5711/1300A بالأخضر الزيتوني قمة الندرة. مع إنتاج حفنة فقط، تجسد هذه القطعة قدرة الشيخ عمار على اقتناء أكثر الساعات المطلوبة في العالم، قطع لا يمكن لمعظم الهواة إلا أن يحلموا بها.',
    },
    image: '/watches/nautilus-5711.jpg',
    year: '2021',
    tone: 'rarity',
  },
];

const toneGradients = {
  innovation: 'from-blue-900/20 via-cyan-900/20 to-blue-900/20',
  heritage: 'from-amber-900/20 via-yellow-900/20 to-amber-900/20',
  craftsmanship: 'from-purple-900/20 via-pink-900/20 to-purple-900/20',
  rarity: 'from-emerald-900/20 via-teal-900/20 to-emerald-900/20',
};

export default function CollectionStories() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!timelineRef.current) return;

    const cards = timelineRef.current.querySelectorAll('.story-card');
    
    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 100,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            end: 'top 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />

      {/* Hero section */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a]" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-4"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-serif text-[#f5f2e8] mb-6"
            style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '0.05em' }}
          >
            {language === 'ar' ? 'قصص المجموعة' : 'Collection Stories'}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xl text-[#d4af37] font-light max-w-2xl mx-auto"
          >
            {language === 'ar'
              ? 'رحلة عبر الزمن والحرفية والشغف'
              : 'A journey through time, craftsmanship, and passion'}
          </motion.p>
        </motion.div>
      </div>

      {/* Timeline */}
      <div ref={timelineRef} className="relative max-w-7xl mx-auto px-4 py-20">
        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#d4af37]/0 via-[#d4af37]/50 to-[#d4af37]/0" />

        {/* Stories */}
        <div className="space-y-32">
          {stories.map((story, index) => {
            const isLeft = index % 2 === 0;
            
            return (
              <motion.div
                key={story.id}
                className={`story-card relative flex items-center ${
                  isLeft ? 'justify-start' : 'justify-end'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#d4af37] border-4 border-[#0a0a0a] z-10" />

                {/* Year badge */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-8 px-4 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37] text-sm">
                  {story.year}
                </div>

                {/* Story card */}
                <div
                  className={`w-full md:w-[45%] ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}
                >
                  <div
                    className={`relative rounded-lg overflow-hidden bg-gradient-to-br ${toneGradients[story.tone]}`}
                    style={{
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                    }}
                  >
                    {/* Video loop background (if available) */}
                    {story.videoLoop && (
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover opacity-20"
                      >
                        <source src={story.videoLoop} type="video/mp4" />
                      </video>
                    )}

                    <div className="relative p-8">
                      {/* Watch image */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="mb-6"
                      >
                        <img
                          src={story.image}
                          alt={isRTL ? story.title.ar : story.title.en}
                          className="w-full h-64 object-cover rounded-lg"
                          style={{
                            filter: 'contrast(1.1) brightness(1.05) saturate(0.9)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                          }}
                        />
                      </motion.div>

                      {/* Title */}
                      <h3
                        className="text-3xl font-serif text-[#f5f2e8] mb-4"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                      >
                        {isRTL ? story.title.ar : story.title.en}
                      </h3>

                      {/* Story text */}
                      <p className="text-[#f5f2e8]/80 leading-relaxed">
                        {isRTL ? story.story.ar : story.story.en}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="relative py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-2xl mx-auto px-4"
        >
          <p className="text-2xl text-[#d4af37] font-light italic mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
            {language === 'ar'
              ? '"كل ساعة تحكي قصة من الدقة والصبر والشغف"'
              : '"Every watch tells a story of precision, patience, and passion"'}
          </p>
          
          <p className="text-[#f5f2e8]/60">
            {language === 'ar' ? '— الشيخ عمار بن حميد النعيمي' : '— Sheikh Ammar bin Humaid Al Nuaimi'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
