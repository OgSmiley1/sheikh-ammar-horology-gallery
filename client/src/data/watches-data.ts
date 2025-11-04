// Enhanced watches data combining both old and new structures
// This file bridges version 07bde086 data with current mobile-responsive features

export interface Watch {
  id: number;
  rank?: number;
  brand: { en: string; ar: string };
  model: { en: string; ar: string };
  reference: string;
  price: { min: number; max: number };
  priceRange?: string;
  story: { en: string; ar: string };
  movement: string;
  case: string;
  diameter: string;
  thickness?: string;
  complications: string[];
  sheikhImage: string;
  watchImage: string;
  rarity: string;
  year: string;
  limitedEdition?: string;
}

export const watchesData: Watch[] = [
  {
    id: 1,
    rank: 1,
    brand: { en: "Richard Mille", ar: "ريتشارد ميل" },
    model: { en: "RM 26-02 Tourbillon 'Evil Eye'", ar: "RM 26-02 توربيون 'عين الشر'" },
    reference: "RM 26-02",
    price: { min: 600000, max: 900000 },
    priceRange: "$600,000 - $900,000",
    story: {
      en: "The Richard Mille RM 26-02 'Evil Eye' is one of the most extraordinary timepieces in Sheikh Ammar's collection. This masterpiece features a stunning hand-painted enamel dial depicting the traditional 'Evil Eye' talisman. Limited to only 30 pieces worldwide, this watch combines Richard Mille's signature ultra-light tonneau case with exquisite artistic craftsmanship.",
      ar: "تعتبر ساعة ريتشارد ميل RM 26-02 'عين الشر' واحدة من أكثر القطع استثنائية في مجموعة الشيخ عمار. تتميز هذه التحفة بميناء مطلي بالمينا يدوياً يصور تميمة 'العين الشريرة' التقليدية. محدودة بـ 30 قطعة فقط في جميع أنحاء العالم."
    },
    movement: "Manual-winding tourbillon",
    case: "Titanium tonneau case",
    diameter: "45.66mm x 39.70mm",
    thickness: "13.84mm",
    complications: ["Tourbillon", "Hand-painted enamel dial"],
    sheikhImage: "/yVNK9XEJjhnf.jpg",
    watchImage: "/yVNK9XEJjhnf.jpg",
    rarity: "Ultra Rare",
    year: "2016",
    limitedEdition: "30 pieces"
  },
  {
    id: 2,
    rank: 2,
    brand: { en: "Patek Philippe", ar: "باتيك فيليب" },
    model: { en: "Nautilus Ref. 5711/1300A-001", ar: "نوتيلوس 5711/1300A-001" },
    reference: "5711/1300A-001",
    price: { min: 450000, max: 600000 },
    priceRange: "$450,000 - $600,000+",
    story: {
      en: "The Patek Philippe Nautilus 5711/1300A represents the pinnacle of sports luxury watchmaking. This extraordinary piece features a stunning olive-green dial paired with a bezel set with 32 baguette-cut diamonds. As the final iteration of the legendary 5711 reference, this watch has become one of the most sought-after timepieces in the world.",
      ar: "تمثل ساعة باتيك فيليب نوتيلوس 5711/1300A قمة صناعة الساعات الرياضية الفاخرة. تتميز هذه القطعة الاستثنائية بميناء أخضر زيتوني مذهل مقترن بإطار مرصع بـ 32 ماسة مقطوعة على شكل باغيت."
    },
    movement: "Caliber 26-330 S C, Self-winding",
    case: "Stainless steel with diamond bezel",
    diameter: "40mm",
    thickness: "8.3mm",
    complications: ["Self-winding", "Date window"],
    sheikhImage: "/5pjvibVYiluG.jpg",
    watchImage: "/5pjvibVYiluG.jpg",
    rarity: "Extremely Rare",
    year: "2023"
  },
  {
    id: 3,
    rank: 3,
    brand: { en: "Patek Philippe", ar: "باتيك فيليب" },
    model: { en: "Perpetual Calendar Chronograph Ref. 5470P-001", ar: "الكرونوغراف بالتقويم الدائم 5470P-001" },
    reference: "5470P-001",
    price: { min: 350000, max: 500000 },
    priceRange: "$350,000 - $500,000",
    story: {
      en: "Unique Piece - 1/1 created for Only Watch 2019. This platinum chronograph with perpetual calendar represents the absolute pinnacle of Swiss watchmaking excellence. The combination of technical complexity and timeless elegance makes this one of the most valuable pieces in Sheikh Ammar's collection.",
      ar: "قطعة فريدة 1/1 تم إنشاؤها لمزاد Only Watch 2019. يمثل هذا الكرونوغراف البلاتيني مع التقويم الدائم قمة التميز السويسري المطلقة في صناعة الساعات."
    },
    movement: "Caliber CHR 27-525 PS, Manual-winding",
    case: "Platinum",
    diameter: "42.8mm",
    thickness: "14.65mm",
    complications: ["Perpetual Calendar", "Chronograph", "Moon phase"],
    sheikhImage: "/69CnLLFZVaiA.jpg",
    watchImage: "/69CnLLFZVaiA.jpg",
    rarity: "Unique Piece",
    year: "2019",
    limitedEdition: "1/1"
  },
  {
    id: 4,
    rank: 4,
    brand: { en: "Audemars Piguet", ar: "أوديمار بيغيه" },
    model: { en: "Royal Oak Perpetual Calendar Ref. 26574ST.OO.1220ST.01", ar: "رويال أوك بالتقويم الدائم" },
    reference: "26574ST.OO.1220ST.01",
    price: { min: 300000, max: 450000 },
    priceRange: "$300,000 - $450,000",
    story: {
      en: "The Royal Oak Perpetual Calendar combines Audemars Piguet's iconic integrated bracelet design with one of horology's most complex complications. This stainless steel masterpiece showcases the brand's commitment to innovation and craftsmanship. Sheikh Ammar's example represents a perfect balance between sports elegance and technical sophistication.",
      ar: "يجمع رويال أوك بالتقويم الدائم بين التصميم المتكامل الأيقوني من أوديمار بيغيه مع واحدة من أعقد المضاعفات في علم الساعات. تعرض هذه التحفة من الفولاذ المقاوم للصدأ التزام العلامة التجارية بالابتكار والحرفية."
    },
    movement: "Caliber 5135, Self-winding",
    case: "Stainless steel",
    diameter: "41mm",
    thickness: "11.6mm",
    complications: ["Perpetual Calendar", "Moon phase", "Leap year indicator"],
    sheikhImage: "/7Z9tksdSGNDq.jpg",
    watchImage: "/7Z9tksdSGNDq.jpg",
    rarity: "Very Rare",
    year: "2020"
  },
  {
    id: 5,
    rank: 5,
    brand: { en: "F.P. Journe", ar: "إف بي جورن" },
    model: { en: "Chronomètre Bleu Ref. 40", ar: "كرونومتر بلو" },
    reference: "Chronomètre Bleu",
    price: { min: 250000, max: 350000 },
    priceRange: "$250,000 - $350,000",
    story: {
      en: "F.P. Journe's Chronomètre Bleu represents independent watchmaking at its finest. With its distinctive blue dial and exceptional chronometric precision, this timepiece showcases François-Paul Journe's uncompromising approach to horological excellence. Each watch is hand-assembled and tested to achieve chronometer-level accuracy.",
      ar: "يمثل كرونومتر بلو من إف بي جورن صناعة الساعات المستقلة في أفضل حالاتها. مع ميناءه الأزرق المميز والدقة الكرونومترية الاستثنائية، تعرض هذه الساعة نهج فرانسوا بول جورن الذي لا يتنازل عن التميز الساعاتي."
    },
    movement: "Manual-winding, Chronometer precision",
    case: "Titanium",
    diameter: "40mm",
    thickness: "9.5mm",
    complications: ["Chronometer", "Power reserve indicator"],
    sheikhImage: "/HSuEGKsPzlgw.jpg",
    watchImage: "/HSuEGKsPzlgw.jpg",
    rarity: "Limited Production",
    year: "2021"
  }
];
