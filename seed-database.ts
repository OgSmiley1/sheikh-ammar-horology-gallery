import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./drizzle/schema";
import * as bcrypt from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

async function seed() {
  const connection = await mysql.createConnection(DATABASE_URL!);
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
        "Founded in 1839, Patek Philippe is renowned for creating some of the world's most complicated and prestigious timepieces.",
      descriptionAr:
        "تأسست باتيك فيليب عام 1839، وهي مشهورة بإنشاء بعض من أكثر الساعات تعقيداً وهيبة في العالم.",
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
        "Founded in 2001, Richard Mille revolutionized watchmaking with ultra-light, ultra-resistant watches.",
      descriptionAr: "تأسست ريتشارد ميل عام 2001، وأحدثت ثورة في صناعة الساعات بساعات خفيفة للغاية.",
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
        "Since 1875, Audemars Piguet has been creating exceptional timepieces in the Vallée de Joux.",
      descriptionAr: "منذ عام 1875، تقوم أوديمار بيغيه بإنشاء ساعات استثنائية في وادي جو.",
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
      descriptionEn: "Founded in 1905, Rolex is synonymous with prestige and performance.",
      descriptionAr: "تأسست رولكس عام 1905، وهي مرادفة للهيبة والأداء.",
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
      descriptionEn: "François-Paul Journe founded his brand in 1999, creating highly complicated timepieces.",
      descriptionAr: "أسس فرانسوا بول جورن علامته التجارية في عام 1999، وأنشأ ساعات معقدة للغاية.",
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
      descriptionEn: "Founded in 1828, H. Moser & Cie is known for its minimalist aesthetic.",
      descriptionAr: "تأسست H. Moser & Cie عام 1828، وهي معروفة بجمالياتها البسيطة.",
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
      descriptionEn: "Founded by Hans Wilsdorf in 1926, Tudor offers Swiss-made watches with exceptional value.",
      descriptionAr: "تأسست تيودور على يد هانز ويلسدورف عام 1926.",
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
      descriptionEn: "Founded in 1884, Breitling specializes in precision chronometers.",
      descriptionAr: "تأسست بريتلينغ عام 1884، وتتخصص في الكرونومترات الدقيقة.",
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

  // Get brand IDs
  const allBrands = await db.select().from(schema.brands);
  const brandMap: Record<string, number> = {};
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
      descriptionEn: "Limited edition celebrating 20 years in Japan. 40mm titanium case with 18K red gold dial.",
      descriptionAr: "إصدار محدود احتفالاً بمرور 20 عاماً في اليابان. علبة تيتانيوم مقاس 40 مم.",
      storyEn: "This exceptional timepiece represents F.P. Journe's mastery of resonance.",
      storyAr: "تمثل هذه القطعة الاستثنائية إتقان إف بي جورن للرنين.",
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
      descriptionEn: "Extremely rare platinum chronograph from Patek Philippe.",
      descriptionAr: "كرونوغراف بلاتيني نادر للغاية من باتيك فيليب.",
      storyEn: "The 5470P represents Patek Philippe's pinnacle of watchmaking artistry.",
      storyAr: "تمثل 5470P قمة فن صناعة الساعات من باتيك فيليب.",
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
      descriptionEn: "Latest collaboration between Richard Mille and McLaren.",
      descriptionAr: "أحدث تعاون بين ريتشارد ميل وماكلارين.",
      storyEn: "Celebrates the partnership between Richard Mille and McLaren Automotive.",
      storyAr: "يحتفل بالشراكة بين ريتشارد ميل وماكلارين.",
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
      descriptionEn: "Ultra-light automatic extra flat watch weighing only 32 grams.",
      descriptionAr: "ساعة أوتوماتيكية فائقة النحافة تزن 32 جراماً فقط.",
      storyEn: "Created for the Italian Olympic team.",
      storyAr: "تم إنشاؤها للفريق الأولمبي الإيطالي.",
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
      descriptionEn: "Rare Rolex Daytona from 1987. 18K yellow gold with black dial.",
      descriptionAr: "رولكس دايتونا نادرة من عام 1987. ذهب أصفر عيار 18 قيراطاً.",
      storyEn: "Represents the golden era of Daytona collecting.",
      storyAr: "تمثل العصر الذهبي لجمع دايتونا.",
      material: "18K Yellow Gold",
      dialColor: "Black with Gold Subdials",
      caseSize: "37mm",
      movement: "Manual Winding",
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
      descriptionEn: "Tudor Black Bay Chronograph with distinctive pink dial.",
      descriptionAr: "تيودور بلاك باي كرونوغراف مع قرص وردي مميز.",
      storyEn: "From Tudor's collaboration with Inter Miami football team.",
      storyAr: "من تعاون تيودور مع فريق إنتر ميامي.",
      material: "Stainless Steel",
      dialColor: "Pink",
      caseSize: "41mm",
      movement: "Automatic",
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
      descriptionEn: "Breitling Avenger Blackbird with DLC-coated titanium case.",
      descriptionAr: "بريتلينغ أفينجر بلاك بيرد مع علبة تيتانيوم.",
      storyEn: "Represents Breitling's commitment to professional aviation watches.",
      storyAr: "يمثل التزام بريتلينغ بساعات الطيران الاحترافية.",
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
      descriptionEn: "Royal Oak Perpetual Calendar in stainless steel with blue dial.",
      descriptionAr: "رويال أوك التقويم الدائم من الفولاذ المقاوم للصدأ.",
      storyEn: "Combines Gérald Genta's iconic design with prestigious complications.",
      storyAr: "يجمع بين تصميم جيرالد جينتا الأيقوني والتعقيدات المرموقة.",
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
  // DONE
  // ============================================================================

  console.log("\n✅ Database seeding completed successfully!");
  console.log(`\n📊 Summary:`);
  console.log(`   - ${brandsData.length} brands`);
  console.log(`   - ${watchesData.length} watches`);
  console.log(`   - 1 admin user`);

  await connection.end();
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
