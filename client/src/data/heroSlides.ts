export type SpecItem = {
  labelEn: string;
  labelAr: string;
  valueEn: string;
  valueAr: string;
};

export type HeroSlide = {
  id: string;
  sheikhImage: string;
  watchImage: string;
  titleEn: string;
  titleAr: string;
  subtitleEn?: string;
  subtitleAr?: string;
  descriptionEn: string;
  descriptionAr: string;
  specs: SpecItem[];
  priceMinUsd?: number;
  priceMaxUsd?: number;
};

export const slides: HeroSlide[] = [
  {
    id: 'rm-26-02',
    sheikhImage: '/slideshow-sheikh-only/slide-01.webp',
    watchImage: '/slideshow-optimized/download(2).webp',
    titleEn: 'Richard Mille RM 26-02',
    titleAr: 'ريتشارد ميل RM 26-02',
    subtitleEn: 'Evil Eye Tourbillon',
    subtitleAr: 'توربيون عين الشر',
    descriptionEn: 'A masterpiece combining aerospace materials with traditional craftsmanship. The "Evil Eye" tourbillon represents the pinnacle of technical innovation and artistic vision.',
    descriptionAr: 'تحفة فنية تجمع بين مواد الطيران والحرفية التقليدية. يمثل توربيون "عين الشر" قمة الابتكار التقني والرؤية الفنية.',
    priceMinUsd: 600000,
    priceMaxUsd: 900000,
    specs: [
      {
        labelEn: 'Movement',
        labelAr: 'الحركة',
        valueEn: 'Caliber RM 26-02, Manual-winding tourbillon',
        valueAr: 'كاليبر RM 26-02، توربيون يدوي',
      },
      {
        labelEn: 'Case',
        labelAr: 'العلبة',
        valueEn: 'Titanium with Evil Eye decoration',
        valueAr: 'تيتانيوم مع زخرفة عين الشر',
      },
      {
        labelEn: 'Diameter',
        labelAr: 'القطر',
        valueEn: '38mm x 47mm',
        valueAr: '38 ملم × 47 ملم',
      },
      {
        labelEn: 'Year',
        labelAr: 'السنة',
        valueEn: '2018',
        valueAr: '2018',
      },
      {
        labelEn: 'Price',
        labelAr: 'السعر',
        valueEn: '$600,000 - $900,000',
        valueAr: '600,000 - 900,000 دولار',
      },
      {
        labelEn: 'Rarity',
        labelAr: 'الندرة',
        valueEn: 'Ultra Rare - Limited Production',
        valueAr: 'نادر للغاية - إنتاج محدود',
      },
    ],
  },
  {
    id: 'nautilus-5711',
    sheikhImage: '/slideshow-sheikh-only/slide-02.webp',
    watchImage: '/slideshow-optimized/download(3).webp',
    titleEn: 'Patek Philippe Nautilus 5711/1300A',
    titleAr: 'باتيك فيليب نوتيلوس 5711/1300A',
    subtitleEn: 'Olive Green Dial',
    subtitleAr: 'ميناء أخضر زيتوني',
    descriptionEn: 'The olive green dial Nautilus represents the ultimate in rarity. Only a handful were produced before discontinuation, making it one of the most sought-after modern Patek Philippe watches.',
    descriptionAr: 'يمثل نوتيلوس بالميناء الأخضر الزيتوني قمة الندرة. تم إنتاج حفنة فقط قبل التوقف، مما يجعلها واحدة من أكثر ساعات باتيك فيليب الحديثة المطلوبة.',
    priceMinUsd: 450000,
    priceMaxUsd: 600000,
    specs: [
      {
        labelEn: 'Movement',
        labelAr: 'الحركة',
        valueEn: 'Caliber 26-330 S C, Automatic',
        valueAr: 'كاليبر 26-330 S C، أوتوماتيكي',
      },
      {
        labelEn: 'Case',
        labelAr: 'العلبة',
        valueEn: 'Stainless Steel',
        valueAr: 'فولاذ مقاوم للصدأ',
      },
      {
        labelEn: 'Diameter',
        labelAr: 'القطر',
        valueEn: '40mm',
        valueAr: '40 ملم',
      },
      {
        labelEn: 'Year',
        labelAr: 'السنة',
        valueEn: '2021',
        valueAr: '2021',
      },
      {
        labelEn: 'Price',
        labelAr: 'السعر',
        valueEn: '$450,000 - $600,000',
        valueAr: '450,000 - 600,000 دولار',
      },
      {
        labelEn: 'Rarity',
        labelAr: 'الندرة',
        valueEn: 'Extremely Rare - Discontinued',
        valueAr: 'نادر للغاية - متوقف',
      },
    ],
  },
  {
    id: 'patek-5470p',
    sheikhImage: '/slideshow-sheikh-only/slide-03.webp',
    watchImage: '/slideshow-optimized/download(4).webp',
    titleEn: 'Patek Philippe Ref. 5470P-001',
    titleAr: 'باتيك فيليب المرجع 5470P-001',
    subtitleEn: 'Perpetual Calendar Chronograph',
    subtitleAr: 'كرونوغراف التقويم الدائم',
    descriptionEn: 'A unique 1/1 piece created for Only Watch 2019. This platinum chronograph with perpetual calendar represents the absolute pinnacle of Swiss watchmaking excellence.',
    descriptionAr: 'قطعة فريدة 1/1 تم إنشاؤها لمزاد Only Watch 2019. يمثل هذا الكرونوغراف البلاتيني مع التقويم الدائم قمة التميز السويسري المطلقة في صناعة الساعات.',
    priceMinUsd: 350000,
    priceMaxUsd: 500000,
    specs: [
      {
        labelEn: 'Movement',
        labelAr: 'الحركة',
        valueEn: 'Caliber CHR 27-525 PS Q, Manual-winding',
        valueAr: 'كاليبر CHR 27-525 PS Q، يدوي',
      },
      {
        labelEn: 'Case',
        labelAr: 'العلبة',
        valueEn: 'Platinum 950',
        valueAr: 'بلاتين 950',
      },
      {
        labelEn: 'Diameter',
        labelAr: 'القطر',
        valueEn: '41mm',
        valueAr: '41 ملم',
      },
      {
        labelEn: 'Year',
        labelAr: 'السنة',
        valueEn: '2019',
        valueAr: '2019',
      },
      {
        labelEn: 'Price',
        labelAr: 'السعر',
        valueEn: '$350,000 - $500,000',
        valueAr: '350,000 - 500,000 دولار',
      },
      {
        labelEn: 'Rarity',
        labelAr: 'الندرة',
        valueEn: 'Unique Piece - 1/1',
        valueAr: 'قطعة فريدة - 1/1',
      },
    ],
  },
  {
    id: 'patek-5959p',
    sheikhImage: '/slideshow-sheikh-only/slide-04.webp',
    watchImage: '/slideshow-optimized/download(6).webp',
    titleEn: 'Patek Philippe Ref. 5959P-001',
    titleAr: 'باتيك فيليب المرجع 5959P-001',
    subtitleEn: 'Split-Seconds Chronograph',
    subtitleAr: 'كرونوغراف الثواني المنقسمة',
    descriptionEn: 'The split-seconds chronograph in platinum represents centuries of horological expertise. A masterpiece of technical complexity and refined elegance.',
    descriptionAr: 'يمثل الكرونوغراف المنقسم الثواني من البلاتين قروناً من الخبرة في صناعة الساعات. تحفة من التعقيد التقني والأناقة الراقية.',
    priceMinUsd: 300000,
    priceMaxUsd: 450000,
    specs: [
      {
        labelEn: 'Movement',
        labelAr: 'الحركة',
        valueEn: 'Caliber CHR 27-525 PS, Manual-winding',
        valueAr: 'كاليبر CHR 27-525 PS، يدوي',
      },
      {
        labelEn: 'Case',
        labelAr: 'العلبة',
        valueEn: 'Platinum 950',
        valueAr: 'بلاتين 950',
      },
      {
        labelEn: 'Diameter',
        labelAr: 'القطر',
        valueEn: '33mm',
        valueAr: '33 ملم',
      },
      {
        labelEn: 'Year',
        labelAr: 'السنة',
        valueEn: '2020',
        valueAr: '2020',
      },
      {
        labelEn: 'Price',
        labelAr: 'السعر',
        valueEn: '$300,000 - $450,000',
        valueAr: '300,000 - 450,000 دولار',
      },
      {
        labelEn: 'Rarity',
        labelAr: 'الندرة',
        valueEn: 'Very Rare - Limited Production',
        valueAr: 'نادر جداً - إنتاج محدود',
      },
    ],
  },
  {
    id: 'ap-26579cs',
    sheikhImage: '/slideshow-sheikh-only/slide-05.webp',
    watchImage: '/slideshow-optimized/download(7).webp',
    titleEn: 'Audemars Piguet Royal Oak 26579CS',
    titleAr: 'أوديمار بيغيه رويال أوك 26579CS',
    subtitleEn: 'Perpetual Calendar',
    subtitleAr: 'التقويم الدائم',
    descriptionEn: 'The Royal Oak Perpetual Calendar in stainless steel represents the perfect balance of sportiness and haute horlogerie. A modern icon with timeless appeal.',
    descriptionAr: 'يمثل رويال أوك بالتقويم الدائم من الفولاذ المقاوم للصدأ التوازن المثالي بين الرياضة والساعات الراقية. أيقونة عصرية بجاذبية خالدة.',
    priceMinUsd: 200000,
    priceMaxUsd: 300000,
    specs: [
      {
        labelEn: 'Movement',
        labelAr: 'الحركة',
        valueEn: 'Caliber 5134, Automatic',
        valueAr: 'كاليبر 5134، أوتوماتيكي',
      },
      {
        labelEn: 'Case',
        labelAr: 'العلبة',
        valueEn: 'Stainless Steel',
        valueAr: 'فولاذ مقاوم للصدأ',
      },
      {
        labelEn: 'Diameter',
        labelAr: 'القطر',
        valueEn: '41mm',
        valueAr: '41 ملم',
      },
      {
        labelEn: 'Year',
        labelAr: 'السنة',
        valueEn: '2022',
        valueAr: '2022',
      },
      {
        labelEn: 'Price',
        labelAr: 'السعر',
        valueEn: '$200,000 - $300,000',
        valueAr: '200,000 - 300,000 دولار',
      },
      {
        labelEn: 'Rarity',
        labelAr: 'الندرة',
        valueEn: 'Rare - Limited Production',
        valueAr: 'نادر - إنتاج محدود',
      },
    ],
  },
];
