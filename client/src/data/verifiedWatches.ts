export interface VerifiedWatch {
  id: number;
  brand: string;
  title: string;
  titleAr: string;
  reference: string;
  description: string;
  descriptionAr: string;
  sheikhImage: string;
  watchImage: string;
  specs: {
    material: string;
    materialAr: string;
    caseSize: string;
    caseSizeAr: string;
    movement: string;
    movementAr: string;
    year: string;
    yearAr: string;
    price: string;
    priceAr: string;
    rarity: string;
    rarityAr: string;
  };
}

export const verifiedHeroWatches: VerifiedWatch[] = [
  {
    id: 1,
    brand: "AUDEMARS PIGUET",
    title: "Royal Oak Perpetual Calendar",
    titleAr: "رويال أوك بربتشوال كالندر",
    reference: "26579CS",
    description: "Entirely dressed in blue, the 41mm Royal Oak Perpetual Calendar presents a case and bracelet fully crafted in blue ceramic for the first time. The blue dial features a Grande Tapisserie pattern with blue counters, white gold applied hour-markers and Royal Oak hands with luminescent coating.",
    descriptionAr: "مصنوع بالكامل من السيراميك الأزرق، يقدم رويال أوك بربتشوال كالندر عيار ٤١ ملم علبة وسوار مصنوعان بالكامل من السيراميك الأزرق لأول مرة. يتميز القرص الأزرق بنمط غراند تابيسري مع عدادات زرقاء.",
    sheikhImage: "/sheikh-photos/sheikh-portrait-1.webp",
    watchImage: "/collection/royal-oak-white-1674201595442_800x.webp",
    specs: {
      material: "Blue Ceramic",
      materialAr: "سيراميك أزرق",
      caseSize: "41mm × 9.5mm",
      caseSizeAr: "٤١ ملم × ٩.٥ ملم",
      movement: "Perpetual Calendar",
      movementAr: "تقويم دائم",
      year: "2022",
      yearAr: "٢٠٢٢",
      price: "$400,000",
      priceAr: "٤٠٠,٠٠٠ دولار",
      rarity: "Ultra Rare - First Full Blue Ceramic",
      rarityAr: "نادر للغاية - أول سيراميك أزرق كامل"
    }
  },
  {
    id: 2,
    brand: "RICHARD MILLE",
    title: "RM 26-02 Evil Eye Tourbillon",
    titleAr: "آر إم ٢٦-٠٢ توربيون عين الشر",
    reference: "RM 26-02",
    description: "Inspired by the Eye of Sauron from Lord of the Rings, this Richard Mille RM26-02 Tourbillon Evil Eye is a masterpiece of horological art. Limited to only 25 pieces worldwide, it has been spotted on Ed Sheeran's wrist.",
    descriptionAr: "مستوحى من عين ساورون من سيد الخواتم، هذا ريتشارد ميل آر إم ٢٦-٠٢ توربيون عين الشر هو تحفة فنية ساعاتية. محدود بـ ٢٥ قطعة فقط في جميع أنحاء العالم.",
    sheikhImage: "/sheikh-photos/sheikh-portrait-2.jpg",
    watchImage: "/collection/rm26-02-1674211731885_800x.webp",
    specs: {
      material: "Titanium with Evil Eye",
      materialAr: "تيتانيوم مع عين الشر",
      caseSize: "38mm × 47mm",
      caseSizeAr: "٣٨ ملم × ٤٧ ملم",
      movement: "Manual Tourbillon",
      movementAr: "توربيون يدوي",
      year: "Limited Edition",
      yearAr: "إصدار محدود",
      price: "$600,000",
      priceAr: "٦٠٠,٠٠٠ دولار",
      rarity: "Ultra Rare - 25 Pieces Worldwide",
      rarityAr: "نادر للغاية - ٢٥ قطعة عالمياً"
    }
  },
  {
    id: 3,
    brand: "ROLEX",
    title: "Daytona Quraysh Hawk Dial",
    titleAr: "دايتونا قرص صقر قريش",
    reference: "6263",
    description: "The legendary Rolex Daytona Chronograph 6263 in stainless steel with the rare Quraysh Hawk Dial, originally commissioned for the late ruler of Dubai, Mohammed Bin Rashid Al Maktoum. The hawk's feet are perched on top of the signature on this distinctive dial.",
    descriptionAr: "رولكس دايتونا كرونوغراف ٦٢٦٣ الأسطورية من الفولاذ المقاوم للصدأ مع قرص صقر قريش النادر، تم تكليفها في الأصل لحاكم دبي الراحل محمد بن راشد آل مكتوم.",
    sheikhImage: "/sheikh-photos/sheikh-with-watches.jpg",
    watchImage: "/collection/rolex-daytona-6263-quraysh-1674202164605_800x.webp",
    specs: {
      material: "Stainless Steel",
      materialAr: "فولاذ مقاوم للصدأ",
      caseSize: "37.5mm",
      caseSizeAr: "٣٧.٥ ملم",
      movement: "Manual Chronograph",
      movementAr: "كرونوغراف يدوي",
      year: "1970s",
      yearAr: "السبعينيات",
      price: "$700,000",
      priceAr: "٧٠٠,٠٠٠ دولار",
      rarity: "Museum-Grade - Royal Provenance",
      rarityAr: "مستوى متحف - أصل ملكي"
    }
  },
  {
    id: 4,
    brand: "AUDEMARS PIGUET",
    title: "Royal Oak Flying Tourbillon",
    titleAr: "رويال أوك فلاينج توربيون",
    reference: "Middle East Edition",
    description: "The very special 25 pieces limited Middle East Edition 41mm Audemars Piguet Royal Oak Tourbillon Extra-Thin in stainless steel. The salmon-colored dial features white gold Eastern-Arabic numerals and displays the Evolution Tapisserie pattern emanating from the center of the tourbillon.",
    descriptionAr: "نسخة الشرق الأوسط المحدودة بـ ٢٥ قطعة من أوديمار بيغيه رويال أوك توربيون إكسترا-ثين عيار ٤١ ملم من الفولاذ المقاوم للصدأ. يتميز القرص بلون السلمون بأرقام عربية شرقية من الذهب الأبيض.",
    sheikhImage: "/sheikh-photos/sheikh-portrait-1.webp",
    watchImage: "/collection/royal-oak-salmon-dial-tourbillon-1674208549211_800x.webp",
    specs: {
      material: "Stainless Steel",
      materialAr: "فولاذ مقاوم للصدأ",
      caseSize: "41mm",
      caseSizeAr: "٤١ ملم",
      movement: "Flying Tourbillon",
      movementAr: "توربيون طائر",
      year: "Middle East Edition",
      yearAr: "نسخة الشرق الأوسط",
      price: "$170,000",
      priceAr: "١٧٠,٠٠٠ دولار",
      rarity: "Ultra Rare - 25 Pieces Middle East",
      rarityAr: "نادر للغاية - ٢٥ قطعة الشرق الأوسط"
    }
  },
  {
    id: 5,
    brand: "RICHARD MILLE",
    title: "RM 68-01 Cyril Kongo",
    titleAr: "آر إم ٦٨-٠١ سيريل كونغو",
    reference: "RM 68-01",
    description: "Released in 2016, Richard Mille created this rainbow masterpiece in collaboration with graffiti/street artist Cyril Kongo. The RM 68-01 Tourbillon features micro-painting technology that allowed the artist to apply intricate flourishes to the microscopic canvas.",
    descriptionAr: "صدر في ٢٠١٦، أنشأ ريتشارد ميل هذه التحفة الفنية قوس قزح بالتعاون مع فنان الغرافيتي سيريل كونغو. يتميز آر إم ٦٨-٠١ توربيون بتقنية الرسم المجهري.",
    sheikhImage: "/sheikh-photos/sheikh-portrait-2.jpg",
    watchImage: "/collection/rm-cyril-kongo-1674216610713_800x.webp",
    specs: {
      material: "Titanium with Graffiti Art",
      materialAr: "تيتانيوم مع فن الغرافيتي",
      caseSize: "42mm",
      caseSizeAr: "٤٢ ملم",
      movement: "Tourbillon",
      movementAr: "توربيون",
      year: "2016",
      yearAr: "٢٠١٦",
      price: "$685,000",
      priceAr: "٦٨٥,٠٠٠ دولار",
      rarity: "Ultra Rare - 30 Hand-Painted Pieces",
      rarityAr: "نادر للغاية - ٣٠ قطعة مرسومة يدوياً"
    }
  }
];
