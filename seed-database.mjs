import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./drizzle/schema.ts";
import * as bcrypt from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection, { schema, mode: "default" });

console.log("🌱 Starting database seeding...");

// ============================================================================
// SEED BRANDS
// ============================================================================

console.log("📦 Seeding brands...");

const brandsData = [
  {
    nameEn: "Patek Philippe",
    nameAr: "باتيك فيليب",
    slug: "patek-philippe",
    descriptionEn:
      "Founded in 1839, Patek Philippe is renowned for creating some of the world's most complicated and prestigious timepieces. The Geneva-based manufacturer is the last family-owned independent watch manufacturer in Geneva.",
    descriptionAr:
      "تأسست باتيك فيليب عام 1839، وهي مشهورة بإنشاء بعض من أكثر الساعات تعقيداً وهيبة في العالم. الشركة المصنعة في جنيف هي آخر شركة مستقلة مملوكة لعائلة في جنيف.",
    foundedYear: 1839,
    country: "Switzerland",
    websiteUrl: "https://www.patek.com",
    displayOrder: 1,
    isActive: true,
  },
  {
    nameEn: "Richard Mille",
    nameAr: "ريتشارد ميل",
    slug: "richard-mille",
    descriptionEn:
      "Founded in 2001, Richard Mille revolutionized watchmaking with ultra-light, ultra-resistant watches inspired by Formula 1 racing and aerospace engineering.",
    descriptionAr:
      "تأسست ريتشارد ميل عام 2001، وأحدثت ثورة في صناعة الساعات بساعات خفيفة للغاية ومقاومة للغاية مستوحاة من سباقات الفورمولا 1.",
    foundedYear: 2001,
    country: "Switzerland",
    websiteUrl: "https://www.richardmille.com",
    displayOrder: 2,
    isActive: true,
  },
  {
    nameEn: "Audemars Piguet",
    nameAr: "أوديمار بيغيه",
    slug: "audemars-piguet",
    descriptionEn:
      "Since 1875, Audemars Piguet has been creating exceptional timepieces in the Vallée de Joux. The Royal Oak revolutionized luxury sports watches.",
    descriptionAr:
      "منذ عام 1875، تقوم أوديمار بيغيه بإنشاء ساعات استثنائية في وادي جو. أحدثت رويال أوك ثورة في ساعات الرياضة الفاخرة.",
    foundedYear: 1875,
    country: "Switzerland",
    websiteUrl: "https://www.audemarspiguet.com",
    displayOrder: 3,
    isActive: true,
  },
  {
    nameEn: "Rolex",
    nameAr: "رولكس",
    slug: "rolex",
    descriptionEn:
      "Founded in 1905, Rolex is synonymous with prestige and performance. The brand has been at the forefront of watchmaking innovation for over a century.",
    descriptionAr:
      "تأسست رولكس عام 1905، وهي مرادفة للهيبة والأداء. كانت العلامة التجارية في طليعة الابتكار في صناعة الساعات لأكثر من قرن.",
    foundedYear: 1905,
    country: "Switzerland",
    websiteUrl: "https://www.rolex.com",
    displayOrder: 4,
    isActive: true,
  },
  {
    nameEn: "F.P. Journe",
    nameAr: "إف بي جورن",
    slug: "fp-journe",
    descriptionEn:
      "François-Paul Journe founded his eponymous brand in 1999, creating highly complicated timepieces with innovative mechanisms.",
    descriptionAr:
      "أسس فرانسوا بول جورن علامته التجارية في عام 1999، وأنشأ ساعات معقدة للغاية مع آليات مبتكرة.",
    foundedYear: 1999,
    country: "Switzerland",
    websiteUrl: "https://www.fpjourne.com",
    displayOrder: 5,
    isActive: true,
  },
  {
    nameEn: "H. Moser & Cie",
    nameAr: "إتش موزر وشركاه",
    slug: "h-moser-cie",
    descriptionEn:
      "Founded in 1828, H. Moser & Cie is known for its minimalist aesthetic and exceptional in-house movements.",
    descriptionAr: "تأسست H. Moser & Cie عام 1828، وهي معروفة بجمالياتها البسيطة وحركاتها الداخلية الاستثنائية.",
    foundedYear: 1828,
    country: "Switzerland",
    websiteUrl: "https://www.h-moser.com",
    displayOrder: 6,
    isActive: true,
  },
  {
    nameEn: "Tudor",
    nameAr: "تيودور",
    slug: "tudor",
    descriptionEn:
      "Founded by Hans Wilsdorf in 1926, Tudor offers Swiss-made watches with exceptional value.",
    descriptionAr: "تأسست تيودور على يد هانز ويلسدورف عام 1926، وتقدم ساعات سويسرية الصنع بقيمة استثنائية.",
    foundedYear: 1926,
    country: "Switzerland",
    websiteUrl: "https://www.tudorwatch.com",
    displayOrder: 7,
    isActive: true,
  },
  {
    nameEn: "Breitling",
    nameAr: "بريتلينغ",
    slug: "breitling",
    descriptionEn:
      "Founded in 1884, Breitling specializes in precision chronometers and aviation watches.",
    descriptionAr: "تأسست بريتلينغ عام 1884، وتتخصص في الكرونومترات الدقيقة وساعات الطيران.",
    foundedYear: 1884,
    country: "Switzerland",
    websiteUrl: "https://www.breitling.com",
    displayOrder: 8,
    isActive: true,
  },
];

for (const brand of brandsData) {
  await db.insert(schema.brands).values(brand);
  console.log(`  ✓ ${brand.nameEn}`);
}

// Get brand IDs for watches
const allBrands = await db.select().from(schema.brands);
const brandMap = {};
allBrands.forEach((b) => {
  brandMap[b.slug] = b.id;
});

// ============================================================================
// SEED WATCHES
// ============================================================================

console.log("\n⌚ Seeding watches...");

const watchesData = [
  {
    brandId: brandMap["fp-journe"],
    referenceNumber: "Chronomètre à Résonance",
    nameEn: "F.P. Journe Chronomètre à Résonance",
    nameAr: "إف بي جورن كرونومتر أ ريزونانس",
    slug: "fp-journe-chronom-tre-r-sonance",
    descriptionEn:
      "Limited edition celebrating 20 years in Japan. Features 40mm titanium case with 18-carat red gold dial.",
    descriptionAr:
      "إصدار محدود احتفالاً بمرور 20 عاماً في اليابان. يتميز بعلبة من التيتانيوم مقاس 40 مم مع قرص من الذهب الأحمر عيار 18 قيراطاً.",
    storyEn:
      "This exceptional timepiece represents F.P. Journe's mastery of resonance. Limited to just 300 pieces worldwide.",
    storyAr:
      "تمثل هذه القطعة الاستثنائية إتقان إف بي جورن للرنين. محدودة بـ 300 قطعة فقط في جميع أنحاء العالم.",
    material: "Titanium & 18K Red Gold",
    dialColor: "Red Gold",
    caseSize: "40mm",
    movement: "Manual",
    complications: "Chronograph, Resonance",
    limitedEdition: true,
    productionQuantity: 300,
    retailPrice: 101000,
    marketValue: 340000,
    rarity: "Extremely Rare",
    isFeatured: true,
    displayOrder: 1,
    isActive: true,
  },
  {
    brandId: brandMap["patek-philippe"],
    referenceNumber: "5470P",
    nameEn: "Patek Philippe 5470P Chronograph",
    nameAr: "باتيك فيليب 5470P كرونوغراف",
    slug: "patek-philippe-5470p",
    descriptionEn:
      "Extremely rare platinum chronograph from Patek Philippe. Features exceptional complications and craftsmanship.",
    descriptionAr: "كرونوغراف بلاتيني نادر للغاية من باتيك فيليب. يتميز بتعقيدات استثنائية وحرفية عالية.",
    storyEn:
      "The 5470P represents Patek Philippe's pinnacle of watchmaking artistry. A true collector's piece.",
    storyAr: "تمثل 5470P قمة فن صناعة الساعات من باتيك فيليب. قطعة جامع حقيقية.",
    material: "Platinum",
    dialColor: "Black",
    caseSize: "41mm",
    movement: "Manual Winding",
    complications: "Chronograph",
    limitedEdition: true,
    retailPrice: 500000,
    marketValue: 500000,
    rarity: "Extremely Rare",
    isFeatured: true,
    displayOrder: 2,
    isActive: true,
  },
  {
    brandId: brandMap["richard-mille"],
    referenceNumber: "RM 65-01",
    nameEn: "Richard Mille RM 65-01 McLaren",
    nameAr: "ريتشارد ميل RM 65-01 ماكلارين",
    slug: "richard-mille-rm-65-01-mclaren",
    descriptionEn:
      "Latest collaboration between Richard Mille and McLaren. Features automatic movement with chronograph.",
    descriptionAr: "أحدث تعاون بين ريتشارد ميل وماكلارين. يتميز بحركة أوتوماتيكية مع كرونوغراف.",
    storyEn:
      "This collaboration celebrates the partnership between Richard Mille and McLaren Automotive. Embodies Formula 1 racing spirit.",
    storyAr:
      "يحتفل هذا التعاون بالشراكة بين ريتشارد ميل وماكلارين أوتوموتيف. يجسد روح سباقات الفورمولا 1.",
    material: "Carbon TPT",
    dialColor: "Skeleton",
    caseSize: "44mm",
    movement: "Automatic",
    complications: "Chronograph",
    limitedEdition: true,
    productionQuantity: 500,
    retailPrice: 650000,
    marketValue: 650000,
    rarity: "Very Rare",
    isFeatured: true,
    displayOrder: 3,
    isActive: true,
  },
  {
    brandId: brandMap["richard-mille"],
    referenceNumber: "RM 67-02",
    nameEn: "Richard Mille RM 67-02 Italia",
    nameAr: "ريتشارد ميل RM 67-02 إيطاليا",
    slug: "richard-mille-rm-67-02-italia",
    descriptionEn: "Ultra-light automatic extra flat watch weighing only 32 grams. Features Quartz TPT material.",
    descriptionAr: "ساعة أوتوماتيكية فائقة النحافة خفيفة للغاية تزن 32 جراماً فقط. تتميز بمادة Quartz TPT.",
    storyEn:
      "Created for the Italian Olympic team, combining ultra-light construction with Italian flair.",
    storyAr: "تم إنشاؤها للفريق الأولمبي الإيطالي، تجمع بين البناء الخفيف والذوق الإيطالي.",
    material: "Quartz TPT",
    dialColor: "Skeleton",
    caseSize: "38.7mm",
    movement: "Automatic Extra Flat",
    waterResistance: "50m",
    limitedEdition: true,
    productionQuantity: 300,
    retailPrice: 100000,
    marketValue: 100000,
    rarity: "Rare",
    isFeatured: true,
    displayOrder: 4,
    isActive: true,
  },
  {
    brandId: brandMap["rolex"],
    referenceNumber: "6265/8",
    nameEn: "Rolex Daytona 'Paul Newman' Reference 6265/8",
    nameAr: "رولكس دايتونا 'بول نيومان' المرجع 6265/8",
    slug: "rolex-daytona-paul-newman-6265-8",
    descriptionEn:
      "Rare Rolex Daytona from 1987. 18-karat yellow gold with black dial and gold subdials.",
    descriptionAr: "رولكس دايتونا نادرة من عام 1987. ذهب أصفر عيار 18 قيراطاً مع قرص أسود وأقراص فرعية ذهبية.",
    storyEn:
      "Features 37mm 18K yellow gold case with hand-wound Zenith El Primero movement. Represents the golden era of Daytona collecting.",
    storyAr:
      "تتميز بعلبة من الذهب الأصفر عيار 18 قيراطاً مقاس 37 مم مع حركة زينيث إل بريميرو يدوية. تمثل العصر الذهبي لجمع دايتونا.",
    material: "18K Yellow Gold",
    dialColor: "Black with Gold Subdials",
    caseSize: "37mm",
    movement: "Manual Winding (Zenith El Primero)",
    complications: "Chronograph",
    yearReleased: 1987,
    retailPrice: 15000,
    marketValue: 175000,
    rarity: "Extremely Rare",
    isFeatured: true,
    displayOrder: 5,
    isActive: true,
  },
  {
    brandId: brandMap["tudor"],
    referenceNumber: "79360N",
    nameEn: "Tudor Black Bay Chronograph 'Pink Dial'",
    nameAr: "تيودور بلاك باي كرونوغراف 'القرص الوردي'",
    slug: "tudor-black-bay-chronograph-pink-dial",
    descriptionEn:
      "Tudor Black Bay Chronograph with distinctive pink dial. Features 41mm stainless steel case.",
    descriptionAr: "تيودور بلاك باي كرونوغراف مع قرص وردي مميز. يتميز بعلبة من الفولاذ المقاوم للصدأ مقاس 41 مم.",
    storyEn:
      "The pink dial came from Tudor's collaboration with Inter Miami football team. Highly collectible.",
    storyAr: "جاء القرص الوردي من تعاون تيودور مع فريق إنتر ميامي لكرة القدم. قابل للتجميع بشكل كبير.",
    material: "Stainless Steel",
    dialColor: "Pink",
    caseSize: "41mm",
    movement: "Automatic (Caliber MT5813)",
    complications: "Chronograph",
    waterResistance: "200m",
    yearReleased: 2024,
    retailPrice: 5500,
    marketValue: 6500,
    rarity: "Limited",
    isFeatured: false,
    displayOrder: 6,
    isActive: true,
  },
  {
    brandId: brandMap["breitling"],
    referenceNumber: "Avenger Blackbird",
    nameEn: "Breitling Avenger Blackbird DLC-coated Titanium",
    nameAr: "بريتلينغ أفينجر بلاك بيرد تيتانيوم",
    slug: "breitling-avenger-blackbird",
    descriptionEn:
      "Breitling Avenger Blackbird with DLC-coated titanium case. Military-grade precision and durability.",
    descriptionAr: "بريتلينغ أفينجر بلاك بيرد مع علبة تيتانيوم مطلية بـ DLC. دقة ومتانة عسكرية.",
    storyEn:
      "The Avenger Blackbird represents Breitling's commitment to professional aviation watches. Lightweight titanium with exceptional strength.",
    storyAr:
      "يمثل أفينجر بلاك بيرد التزام بريتلينغ بساعات الطيران الاحترافية. تيتانيوم خفيف الوزن مع قوة استثنائية.",
    material: "DLC-coated Titanium",
    dialColor: "Black",
    caseSize: "44mm",
    movement: "Automatic",
    waterResistance: "300m",
    complications: "Date",
    retailPrice: 5100,
    marketValue: 5100,
    rarity: "Available",
    isFeatured: false,
    displayOrder: 7,
    isActive: true,
  },
  {
    brandId: brandMap["audemars-piguet"],
    referenceNumber: "26574ST",
    nameEn: "Audemars Piguet Royal Oak Perpetual Calendar",
    nameAr: "أوديمار بيغيه رويال أوك التقويم الدائم",
    slug: "audemars-piguet-royal-oak-perpetual-calendar",
    descriptionEn:
      "Royal Oak Perpetual Calendar in stainless steel with blue dial. One of the most iconic complications.",
    descriptionAr: "رويال أوك التقويم الدائم من الفولاذ المقاوم للصدأ مع قرص أزرق. واحدة من أكثر التعقيدات شهرة.",
    storyEn:
      "The Royal Oak Perpetual Calendar combines Gérald Genta's iconic design with one of watchmaking's most prestigious complications.",
    storyAr:
      "يجمع رويال أوك التقويم الدائم بين تصميم جيرالد جينتا الأيقوني وواحدة من أكثر التعقيدات هيبة في صناعة الساعات.",
    material: "Stainless Steel",
    dialColor: "Blue",
    caseSize: "41mm",
    movement: "Automatic",
    complications: "Perpetual Calendar, Moon Phase",
    retailPrice: 85000,
    marketValue: 120000,
    rarity: "Very Rare",
    isFeatured: true,
    displayOrder: 8,
    isActive: true,
  },
];

for (const watch of watchesData) {
  await db.insert(schema.watches).values(watch);
  console.log(`  ✓ ${watch.nameEn}`);
}

// ============================================================================
// SEED ADMIN USER
// ============================================================================

console.log("\n👤 Seeding admin user...");

const hashedPassword = await bcrypt.hash("MOATH123", 10);

await db.insert(schema.adminUsers).values({
  username: "MOATH",
  passwordHash: hashedPassword,
  fullName: "Administrator",
  email: "admin@sheikhammargallery.com",
  role: "super_admin",
  isActive: true,
});

console.log("  ✓ Admin user created (username: MOATH, password: MOATH123)");

// ============================================================================
// SEED VIDEO BACKGROUNDS
// ============================================================================

console.log("\n🎬 Seeding video backgrounds...");

await db.insert(schema.videoBackgrounds).values({
  titleEn: "Luxury Watches Showcase",
  titleAr: "عرض الساعات الفاخرة",
  videoUrl: "https://player.vimeo.com/video/123456789",
  thumbnailUrl: "/images/video-thumb.jpg",
  usageLocation: "homepage",
  displayOrder: 1,
  isActive: true,
});

console.log("  ✓ Homepage video background");

// ============================================================================
// DONE
// ============================================================================

console.log("\n✅ Database seeding completed successfully!");
console.log(`\n📊 Summary:`);
console.log(`   - ${brandsData.length} brands`);
console.log(`   - ${watchesData.length} watches`);
console.log(`   - 1 admin user`);
console.log(`   - 1 video background`);

await connection.end();
process.exit(0);
