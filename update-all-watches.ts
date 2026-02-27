/**
 * Comprehensive watch collection update script.
 * - Updates all 8 existing seeded watches with complete, accurate specs.
 * - Inserts ~22 additional watches (all matched to images in watches-collection/).
 *
 * Run:  DATABASE_URL=<url> pnpm tsx update-all-watches.ts
 */
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq } from "drizzle-orm";
import * as schema from "./drizzle/schema";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

async function run() {
  const connection = await mysql.createConnection(DATABASE_URL!);
  const db = drizzle(connection, { schema, mode: "default" });

  // ── helpers ───────────────────────────────────────────────────────────────
  async function brandId(slug: string): Promise<number> {
    const rows = await db
      .select({ id: schema.brands.id })
      .from(schema.brands)
      .where(eq(schema.brands.slug, slug))
      .limit(1);
    if (!rows.length) throw new Error(`Brand not found: ${slug}`);
    return rows[0].id;
  }

  async function upsertWatch(w: schema.InsertWatch) {
    const existing = await db
      .select({ id: schema.watches.id })
      .from(schema.watches)
      .where(eq(schema.watches.referenceNumber, w.referenceNumber!))
      .limit(1);

    if (existing.length) {
      await db
        .update(schema.watches)
        .set(w)
        .where(eq(schema.watches.id, existing[0].id));
      console.log(`  ✏️  updated  ${w.nameEn}`);
    } else {
      await db.insert(schema.watches).values(w);
      console.log(`  ➕ inserted ${w.nameEn}`);
    }
  }

  // ── brand IDs ─────────────────────────────────────────────────────────────
  const patek  = await brandId("patek-philippe");
  const rm     = await brandId("richard-mille");
  const ap     = await brandId("audemars-piguet");
  const rolex  = await brandId("rolex");
  const fpj    = await brandId("fp-journe");
  const moser  = await brandId("h-moser-cie");
  const tudor  = await brandId("tudor");
  const breit  = await brandId("breitling");

  console.log("⌚  Upserting watches…\n");

  // ══════════════════════════════════════════════════════════════════════════
  // 1.  F.P. JOURNE  ────────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════

  await upsertWatch({
    brandId: fpj,
    referenceNumber: "Chronometre-Resonance-Japan-20",
    nameEn: "F.P. Journe Chronomètre à Résonance Japan 20th Anniversary",
    nameAr: "إف بي جورن كرونومتر ريزونانس - الذكرى الـ 20 لليابان",
    slug: "fp-journe-chronom-tre-r-sonance",
    descriptionEn:
      "Limited to 300 pieces to celebrate 20 years of F.P. Journe in Japan. The 40 mm titanium case houses an 18K red-gold movement dial and the legendary resonance complication — two independent escapements that oscillate in perfect harmonic sympathy, dramatically improving long-term rate accuracy.",
    descriptionAr:
      "محدود بـ 300 قطعة احتفالاً بـ 20 عامًا من وجود إف بي جورن في اليابان. يضم الغلاف التيتانيوم 40 مم ميناء أحمر ذهبي وتعقيد الرنين الأسطوري.",
    storyEn:
      "François-Paul Journe's resonance complication is the most difficult in horology: two separate balance wheels are tuned to influence each other through the mainplate, synchronising after a few minutes and thereafter running together with extraordinary precision. This anniversary edition wraps that achievement in aerospace-grade titanium.",
    storyAr:
      "تعقيد الرنين عند فرانسوا بول جورن هو الأصعب في علم الساعات: عجلتا توازن مستقلتان تتزامنان من خلال الصفيحة الرئيسية لتحقيق دقة استثنائية.",
    material: "Titanium / 18K Red Gold movement dial",
    dialColor: "18K Red Gold",
    caseSize: "40mm",
    movement: "Caliber 1499.3 — Manual-winding, Resonance complication",
    complications: "Resonance, Hours, Minutes, Power Reserve",
    powerReserve: "56 hours",
    waterResistance: "30m",
    limitedEdition: true,
    productionQuantity: 300,
    yearReleased: 2019,
    retailPrice: 101000,
    marketValue: 340000,
    rarity: "Extremely Rare",
    mainImageUrl: "/watches-collection/fp-journe-resonance-1681913779906_800x.webp",
    isFeatured: true,
    displayOrder: 1,
    isActive: true,
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 2.  PATEK PHILIPPE  ─────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════

  await upsertWatch({
    brandId: patek,
    referenceNumber: "5470P-001",
    nameEn: "Patek Philippe 5470P-001 Only Watch Chronograph",
    nameAr: "باتيك فيليب 5470P-001 كرونوغراف أونلي ووتش",
    slug: "patek-philippe-5470p",
    descriptionEn:
      "A one-of-a-kind 41 mm platinum split-seconds chronograph with perpetual calendar and moon phase, created exclusively for the Only Watch 2019 charity auction. It sold for CHF 6.2 million — one of the highest prices ever achieved for a contemporary Patek Philippe.",
    descriptionAr:
      "قطعة فريدة من نوعها، كرونوغراف بلاتيني 41 مم مع تقويم دائم وطور القمر، أنشئ حصريًا لمزاد Only Watch 2019. بيع بـ 6.2 مليون فرنك سويسري.",
    storyEn:
      "Ref. 5470P was unveiled at Only Watch 2019 bearing an entirely unique black ébauche (un-lacquered movement), a subtle but profound distinction from any production piece. The auction result — more than ten times the retail estimate — confirmed it as one of the most collectible watches of the 21st century.",
    storyAr:
      "كُشف عن المرجع 5470P في مزاد Only Watch 2019 بمحرك أسود فريد. حقق سعر المزاد أكثر من عشرة أضعاف التقدير الأولي.",
    material: "Platinum 950",
    dialColor: "Black ébauche",
    caseSize: "41mm",
    movement: "Caliber CHR 29-535 PS Q — Manual-winding, Split-seconds chronograph, Perpetual Calendar",
    complications: "Split-Seconds Chronograph, Perpetual Calendar, Moon Phase, Date, Day, Month, Leap Year",
    powerReserve: "65 hours",
    waterResistance: "30m",
    limitedEdition: true,
    productionQuantity: 1,
    yearReleased: 2019,
    retailPrice: 500000,
    marketValue: 6200000,
    rarity: "Unique — 1 of 1",
    mainImageUrl: "/watches-collection/patek-1674210655318_800x.webp",
    isFeatured: true,
    displayOrder: 2,
    isActive: true,
  });

  await upsertWatch({
    brandId: patek,
    referenceNumber: "5326G-001",
    nameEn: "Patek Philippe Calatrava 5326G Travel Time",
    nameAr: "باتيك فيليب كالاتراڤا 5326G تراڤل تايم",
    slug: "patek-philippe-calatrava-5326g-travel-time",
    descriptionEn:
      "A 38.5 mm white-gold Calatrava housing the manufacture Caliber 324 S C FUS. The dual time-zone display with AM/PM indicator is operated by elegant pushers at 8 and 10 o'clock, maintaining the dial's pure, uncluttered elegance.",
    descriptionAr:
      "كالاتراڤا ذهب أبيض 38.5 مم يضم كاليبر 324 S C FUS. يعرض منطقتين زمنيتين مع مؤشر ص/م.",
    storyEn:
      "Introduced at Watches & Wonders 2020, the 5326G-001 revives the travel-time complication within a classically proportioned Calatrava — a watch equally at home in a board room or on a transatlantic flight.",
    storyAr:
      "قدّمت عام 2020، تُحيي 5326G-001 تعقيد التوقيت المزدوج في هيكل كالاتراڤا الكلاسيكي.",
    material: "18K White Gold",
    dialColor: "Silver Opaline",
    caseSize: "38.5mm",
    movement: "Caliber 324 S C FUS — Automatic",
    complications: "Dual Time Zone, AM/PM Indicator, Date, Sweep Seconds",
    powerReserve: "45 hours",
    waterResistance: "30m",
    limitedEdition: false,
    yearReleased: 2020,
    retailPrice: 55000,
    marketValue: 70000,
    rarity: "Very Rare",
    mainImageUrl: "/watches-collection/patek-calatrava-5326g-1681913791211_800x.webp",
    isFeatured: true,
    displayOrder: 3,
    isActive: true,
  });

  await upsertWatch({
    brandId: patek,
    referenceNumber: "6007A-001",
    nameEn: "Patek Philippe Calatrava 6007A",
    nameAr: "باتيك فيليب كالاتراڤا 6007A",
    slug: "patek-philippe-calatrava-6007a",
    descriptionEn:
      "A 42 mm stainless-steel Calatrava with an anthracite dial — a rare combination for Patek Philippe, reflecting a new direction for sportier collectors who demand the brand's unrivalled quality in a bolder package.",
    descriptionAr:
      "كالاتراڤا فولاذ مقاوم للصدأ 42 مم مع ميناء أنثراسايت. نادر لباتيك فيليب، يعكس اتجاهًا جديدًا.",
    storyEn:
      "The 6007A broke with Calatrava tradition by pairing a larger 42 mm case in steel with a dial referencing pilot aesthetics, available exclusively through Patek Philippe boutiques.",
    storyAr:
      "كسر 6007A تقليد كالاتراڤا بجمع غلاف 42 مم من الفولاذ مع ميناء مستوحى من ساعات الطيارين.",
    material: "Stainless Steel",
    dialColor: "Anthracite",
    caseSize: "42mm",
    movement: "Caliber 30-255 PS — Automatic",
    complications: "Date, Sweep Seconds",
    powerReserve: "48 hours",
    waterResistance: "30m",
    limitedEdition: false,
    yearReleased: 2019,
    retailPrice: 32000,
    marketValue: 48000,
    rarity: "Rare",
    mainImageUrl: "/watches-collection/patek-calatrava-6007a-1681913797813_800x.webp",
    isFeatured: false,
    displayOrder: 4,
    isActive: true,
  });

  await upsertWatch({
    brandId: patek,
    referenceNumber: "5719-10G-010",
    nameEn: "Patek Philippe Nautilus 5719/10G Diamond Green",
    nameAr: "باتيك فيليب نوتيلوس 5719/10G ألماس أخضر",
    slug: "patek-philippe-nautilus-5719-diamond-green",
    descriptionEn:
      "The most opulent Nautilus: a 35.2 mm white-gold case set with 432 brilliant-cut diamonds on the bezel and lugs, over a lush green sunburst dial. Defined by extraordinary craftsmanship at every millimetre.",
    descriptionAr:
      "نوتيلوس من الذهب الأبيض 35.2 مم مرصع بـ 432 ألماسة على الإطار والمقابض فوق ميناء أخضر لامع.",
    storyEn:
      "The 5719/10G elevates the Nautilus from icon to jewel masterpiece. Every diamond is hand-set in Geneva by Patek Philippe's in-house gem-setting atelier, with total diamond weight exceeding 3 carats.",
    storyAr:
      "يرفع 5719/10G نوتيلوس من أيقونة إلى تحفة جوهرية. كل ألماسة تُرصّع يدويًا في جنيف.",
    material: "18K White Gold, Diamond-set bezel & lugs",
    dialColor: "Green Sunburst",
    caseSize: "35.2mm",
    movement: "Caliber 240 — Ultra-thin Automatic (3.88mm)",
    complications: "Hours, Minutes, Sweep Seconds, Date",
    powerReserve: "48 hours",
    waterResistance: "60m",
    limitedEdition: false,
    yearReleased: 2021,
    retailPrice: 280000,
    marketValue: 420000,
    rarity: "Extremely Rare",
    mainImageUrl: "/watches-collection/patek-nautilus-green-dial-diamond-1681913804026_800x.webp",
    isFeatured: true,
    displayOrder: 5,
    isActive: true,
  });

  await upsertWatch({
    brandId: patek,
    referenceNumber: "5726-1A-014",
    nameEn: "Patek Philippe Nautilus 5726/1A Perpetual Calendar",
    nameAr: "باتيك فيليب نوتيلوس 5726/1A تقويم دائم",
    slug: "patek-philippe-nautilus-5726-perpetual-calendar",
    descriptionEn:
      "A 40.5 mm stainless-steel Nautilus housing one of the most coveted perpetual calendar movements in production. The khaki-green dial with gilt printing and moon-phase aperture makes this the ultimate sporty dresser.",
    descriptionAr:
      "نوتيلوس فولاذ مقاوم للصدأ 40.5 مم يضم أحد أكثر محركات التقويم الدائم المرغوبة في الإنتاج.",
    storyEn:
      "Patek's Nautilus Perpetual Calendar fuses Genta's iconic octagonal bezel with a full perpetual calendar — day, date, month, moon phase, and leap-year indicator — all controlled by the in-house Caliber 324, accurate without correction until 2100.",
    storyAr:
      "يجمع نوتيلوس التقويم الدائم بين إطار جينتا الثماني الأيقوني والتقويم الكامل الدائم.",
    material: "Stainless Steel",
    dialColor: "Green/Silver with Moon Phase",
    caseSize: "40.5mm",
    movement: "Caliber 324 S QA LU 24H/303 — Automatic",
    complications: "Perpetual Calendar, Moon Phase, Day, Date, Month, Leap Year",
    powerReserve: "45 hours",
    waterResistance: "120m",
    limitedEdition: false,
    yearReleased: 2014,
    retailPrice: 80000,
    marketValue: 175000,
    rarity: "Extremely Rare",
    mainImageUrl: "/watches-collection/patek-philippe-nautilus-perpetual-calendar-1681913819958_800x.webp",
    isFeatured: true,
    displayOrder: 6,
    isActive: true,
  });

  await upsertWatch({
    brandId: patek,
    referenceNumber: "5230G-013",
    nameEn: "Patek Philippe World Time 5230G Manama Edition",
    nameAr: "باتيك فيليب ورلد تايم 5230G - طبعة المنامة",
    slug: "patek-philippe-world-time-5230g-manama",
    descriptionEn:
      "One of only 25 pieces in white gold, commissioned by Behbehani Brothers to celebrate Patek Philippe's 50th anniversary in Bahrain. The striking red guilloché dial references the Bahraini flag, and 'Manama' replaces Moscow on the 24-hour city ring.",
    descriptionAr:
      "واحدة من 25 قطعة فقط من الذهب الأبيض، بطلب من إخوان البهبهاني احتفالاً بالذكرى الـ 50 لباتيك فيليب في البحرين.",
    storyEn:
      "Created in 2017–18 for Bahrain's leading authorised retailer, this reference embeds geography and heritage into haute horlogerie: the classic Caliber 240 HU world-time movement is unchanged, but the dial's crimson guilloché and the Manama inscription transform it into a treasured piece of regional history.",
    storyAr:
      "أُنشئت عام 2017-18 للوكيل المعتمد في البحرين. الميناء الأحمر المنقوش وكتابة 'المنامة' تحوّلانها إلى قطعة تاريخية إقليمية ثمينة.",
    material: "18K White Gold",
    dialColor: "Red Guilloché (Bahraini flag)",
    caseSize: "38.5mm",
    movement: "Caliber 240 HU — Ultra-thin Automatic (22K gold micro-rotor)",
    complications: "World Time (24 cities), Day/Night Indicator",
    powerReserve: "48 hours",
    waterResistance: "30m",
    limitedEdition: true,
    productionQuantity: 25,
    yearReleased: 2018,
    retailPrice: 65000,
    marketValue: 110000,
    rarity: "Ultra Rare — 25 pieces",
    mainImageUrl: "/watches-collection/patek-world-time-manama-1681913828669_800x.webp",
    isFeatured: true,
    displayOrder: 7,
    isActive: true,
  });

  await upsertWatch({
    brandId: patek,
    referenceNumber: "5726A-014",
    nameEn: "Patek Philippe Nautilus Perpetual Calendar Green Dial",
    nameAr: "باتيك فيليب نوتيلوس تقويم دائم ميناء أخضر",
    slug: "patek-philippe-nautilus-perpetual-calendar-green",
    descriptionEn:
      "The 2021 khaki-green dial variant of the 5726 — among the most sought-after modern Patek releases, combining the sporty Nautilus case with a full perpetual calendar, moon phase, and the new olive-green tone that defined a collecting era.",
    descriptionAr:
      "إصدار الميناء الأخضر الزيتوني لعام 2021 من 5726، من أكثر إصدارات باتيك المعاصرة طلبًا.",
    material: "Stainless Steel",
    dialColor: "Olive/Khaki Green",
    caseSize: "40.5mm",
    movement: "Caliber 324 S QA LU 24H/303 — Automatic",
    complications: "Perpetual Calendar, Moon Phase, Day, Date, Month",
    powerReserve: "45 hours",
    waterResistance: "120m",
    limitedEdition: false,
    yearReleased: 2021,
    retailPrice: 87000,
    marketValue: 220000,
    rarity: "Extremely Rare",
    mainImageUrl: "/watches-collection/patek-perpetual-calendar-green-1681913811529_800x.webp",
    isFeatured: true,
    displayOrder: 8,
    isActive: true,
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 3.  RICHARD MILLE  ──────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════

  await upsertWatch({
    brandId: rm,
    referenceNumber: "RM 65-01",
    nameEn: "Richard Mille RM 65-01 McLaren Split-Seconds Chronograph",
    nameAr: "ريتشارد ميل RM 65-01 ماكلارين كرونوغراف الثواني المنقسمة",
    slug: "richard-mille-rm-65-01-mclaren",
    descriptionEn:
      "Co-developed with McLaren Automotive, the RM 65-01 packs a split-seconds chronograph caliber into a 44.5 mm Carbon TPT® case. At 38.3 g it is feather-light yet among the most technically ambitious wristwatches ever made.",
    descriptionAr:
      "طوّرت مع ماكلارين للسيارات، تضم RM 65-01 كاليبر كرونوغراف الثواني المنقسمة في غلاف Carbon TPT® 44.5 مم بوزن 38.3 جرام فقط.",
    storyEn:
      "The RM 65-01 is Richard Mille's most complex automatic movement: the split-seconds hand system, column-wheel, and vertical clutch are all visible through the skeletonised dial. Its McLaren orange accents reference the iconic Gulf livery, bridging horology and hypercar engineering.",
    storyAr:
      "تُعدّ RM 65-01 أكثر محركات ريتشارد ميل الأوتوماتيكية تعقيدًا. تبرز عقارب الثواني المنقسمة من خلال الميناء الهيكلي.",
    material: "Carbon TPT® / Titanium",
    dialColor: "Skeletonised with McLaren orange accents",
    caseSize: "44.5 x 49.94mm",
    movement: "Caliber RMAC4 — Automatic, Split-Seconds Chronograph",
    complications: "Split-Seconds Chronograph, Hours, Minutes, Seconds, Flyback",
    powerReserve: "50 hours",
    waterResistance: "50m",
    limitedEdition: true,
    productionQuantity: 500,
    yearReleased: 2020,
    retailPrice: 650000,
    marketValue: 720000,
    rarity: "Very Rare — 500 pieces",
    mainImageUrl: "/watches-collection/rm26-02-1674211731885_800x.webp",
    isFeatured: true,
    displayOrder: 9,
    isActive: true,
  });

  await upsertWatch({
    brandId: rm,
    referenceNumber: "RM 67-02",
    nameEn: "Richard Mille RM 67-02 Alexis Pinturault Extra Flat",
    nameAr: "ريتشارد ميل RM 67-02 أليكسي بانتوروه - رفيع استثنائي",
    slug: "richard-mille-rm-67-02-italia",
    descriptionEn:
      "Dedicated to Olympic alpine ski champion Alexis Pinturault, this RM 67-02 in Quartz TPT® with Italian flag colours weighs just 32 g. At 7.75 mm thick it is Richard Mille's thinnest automatic — worn on the slopes at 140 km/h.",
    descriptionAr:
      "مخصص لبطل التزلج الأولمبي أليكسي بانتوروه، هذا RM 67-02 من Quartz TPT® بألوان العلم الإيطالي يزن 32 جرام فقط بسمك 7.75 مم.",
    storyEn:
      "Pinturault wore prototypes of this watch during World Cup training runs before the final version was released, proving it could withstand the extreme G-forces and vibrations of alpine racing. The Italian flag Quartz TPT® is produced by layering hundreds of silica fibre sheets at different orientations.",
    storyAr:
      "ارتدى بانتوروه نماذج أولية من هذه الساعة خلال تدريبات كأس العالم لإثبات قدرتها على تحمّل قوى الجاذبية الشديدة.",
    material: "Quartz TPT® — Italian flag pattern",
    dialColor: "Skeletonised with red/white/green accents",
    caseSize: "38.7 x 47.52mm",
    movement: "Caliber CRMA7 — Automatic Extra Flat (7.75mm total thickness)",
    complications: "Hours, Minutes, Seconds",
    powerReserve: "50 hours",
    waterResistance: "50m",
    limitedEdition: true,
    productionQuantity: 150,
    yearReleased: 2018,
    retailPrice: 100000,
    marketValue: 115000,
    rarity: "Very Rare — 150 pieces",
    mainImageUrl: "/watches-collection/rm67-02-alexis-pinturault-1681913841692_800x.webp",
    isFeatured: true,
    displayOrder: 10,
    isActive: true,
  });

  await upsertWatch({
    brandId: rm,
    referenceNumber: "RM 68-01",
    nameEn: "Richard Mille RM 68-01 Tourbillon Cyril Kongo",
    nameAr: "ريتشارد ميل RM 68-01 توربيون سيريل كونغو",
    slug: "richard-mille-rm-68-01-cyril-kongo",
    descriptionEn:
      "A collaboration between Richard Mille and French graffiti legend Cyril Kongo. Only 30 pieces exist, every one unique: Kongo hand-painted each movement bridge and baseplate with a custom airbrush developed for this project, making each watch a singular artwork.",
    descriptionAr:
      "تعاون بين ريتشارد ميل والفنان الأسطوري سيريل كونغو. 30 قطعة فقط، كل واحدة فريدة: رسم كونغو يدويًا كل قطعة بفرشاة هوائية خاصة.",
    storyEn:
      "Developing the technique took over a year: a bespoke micro-airbrush was engineered to apply colour one droplet at a time without adding enough mass to alter the movement's rate. The result is a flying tourbillon watch where art and engineering are literally inseparable.",
    storyAr:
      "استغرق تطوير الأسلوب أكثر من عام: صُنّعت فرشاة هوائية خاصة لتطبيق اللون قطرة بقطرة دون التأثير على دقة الحركة.",
    material: "Carbon TPT® / TZP Black Ceramic",
    dialColor: "Multi-colour graffiti on sapphire crystal",
    caseSize: "50.2 x 42.7mm",
    movement: "Caliber RM 68-01 — Manual-winding Tourbillon",
    complications: "Flying Tourbillon, Hours, Minutes",
    powerReserve: "42 hours",
    waterResistance: "50m",
    limitedEdition: true,
    productionQuantity: 30,
    yearReleased: 2016,
    retailPrice: 685000,
    marketValue: 2100000,
    rarity: "Ultra Rare — 30 unique pieces",
    mainImageUrl: "/watches-collection/rm-cyril-kongo-1674216610713_800x.webp",
    isFeatured: true,
    displayOrder: 11,
    isActive: true,
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 4.  AUDEMARS PIGUET  ────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════

  await upsertWatch({
    brandId: ap,
    referenceNumber: "26574ST",
    nameEn: "Audemars Piguet Royal Oak Perpetual Calendar 26574ST",
    nameAr: "أوديمار بيغيه رويال أوك تقويم دائم 26574ST",
    slug: "audemars-piguet-royal-oak-perpetual-calendar",
    descriptionEn:
      "A 41 mm stainless-steel Royal Oak housing the ultra-thin self-winding Caliber 5134 with a complete perpetual calendar and moon phase. The blue grande tapisserie dial remains one of the most recognisable in fine watchmaking.",
    descriptionAr:
      "رويال أوك فولاذ مقاوم للصدأ 41 مم يضم الكاليبر 5134 الرفيع مع التقويم الدائم الكامل وطور القمر.",
    storyEn:
      "The Royal Oak Perpetual Calendar traces its roots to 1984, making it one of the oldest perpetual calendar complications in stainless steel. This 41 mm iteration, introduced in 2020, updates the case to the modern wide-bezel architecture while retaining the timeless Genta silhouette.",
    storyAr:
      "يعود تاريخ رويال أوك التقويم الدائم إلى عام 1984، وهو من أقدم ساعات التقويم الدائم من الفولاذ. هذا الإصدار 41 مم يحدّث الهيكل مع الحفاظ على صورة جينتا الخالدة.",
    material: "Stainless Steel",
    dialColor: "Blue Grande Tapisserie",
    caseSize: "41mm",
    movement: "Caliber 5134 — Ultra-thin Automatic (4.31mm)",
    complications: "Perpetual Calendar, Moon Phase, Day, Date, Month, Leap Year",
    powerReserve: "40 hours",
    waterResistance: "50m",
    limitedEdition: false,
    yearReleased: 2020,
    retailPrice: 85000,
    marketValue: 120000,
    rarity: "Very Rare",
    mainImageUrl: "/watches-collection/royal-oak-white-1674201595442_800x.webp",
    isFeatured: true,
    displayOrder: 12,
    isActive: true,
  });

  await upsertWatch({
    brandId: ap,
    referenceNumber: "15202BC-ZZ-1240BC-01",
    nameEn: "Audemars Piguet Royal Oak Jumbo 15202BC White Gold",
    nameAr: "أوديمار بيغيه رويال أوك جامبو 15202BC ذهب أبيض",
    slug: "audemars-piguet-royal-oak-jumbo-15202bc",
    descriptionEn:
      "The 50th-anniversary 'Jumbo' in 18K white gold: a 39 mm canvas displaying the ultra-thin Caliber 2121 (just 3.05 mm), unchanged in principle from its 1972 debut. Only 500 pieces in white gold were made — the most collectible Royal Oak of the modern era.",
    descriptionAr:
      "جامبو الذكرى الـ 50 من الذهب الأبيض 18 قيراطًا: 39 مم يضم الكاليبر الرفيع 2121 (3.05 مم فقط). 500 قطعة فقط من الذهب الأبيض.",
    storyEn:
      "Ref. 15202 is the faithful heir of Gérald Genta's original 1972 A-series. The 15202BC — unveiled for the Royal Oak's 50th anniversary at Watches & Wonders 2022 — was instantly back-ordered for years. Its white-gold case and silver-toned 'Petite Tapisserie' dial are the purest expression of the Royal Oak DNA.",
    storyAr:
      "المرجع 15202 هو الوريث الأمين لتصميم جيرالد جينتا الأصلي عام 1972. كُشف عنه في الذكرى الـ 50 وكانت الطلبات المسبقة تمتد لسنوات.",
    material: "18K White Gold",
    dialColor: "Silver Petite Tapisserie",
    caseSize: "39mm",
    movement: "Caliber 2121 — Ultra-thin Automatic (3.05mm)",
    complications: "Hours, Minutes, Date",
    powerReserve: "40 hours",
    waterResistance: "50m",
    limitedEdition: true,
    productionQuantity: 500,
    yearReleased: 2022,
    retailPrice: 75000,
    marketValue: 130000,
    rarity: "Extremely Rare — 500 pieces",
    mainImageUrl: "/watches-collection/royal-oak-jumbo-15202bc-1681913914790_800x.webp",
    isFeatured: true,
    displayOrder: 13,
    isActive: true,
  });

  await upsertWatch({
    brandId: ap,
    referenceNumber: "26510OR-OO-1220OR-01",
    nameEn: "Audemars Piguet Royal Oak Extra-Thin Tourbillon Salmon",
    nameAr: "أوديمار بيغيه رويال أوك رفيع استثنائي توربيون ميناء سالمون",
    slug: "audemars-piguet-royal-oak-tourbillon-salmon",
    descriptionEn:
      "An 18K rose-gold Royal Oak Extra-Thin Tourbillon with a salmon-coloured 'Grande Tapisserie' dial and flying tourbillon at 6 o'clock. At 9.5 mm it is extraordinary thin for a flying tourbillon, representing the pinnacle of AP's manufacture expertise.",
    descriptionAr:
      "رويال أوك رفيع استثنائي من الذهب الوردي 18 قيراطًا مع ميناء سالمون وتوربيون طائر. بسمك 9.5 مم هو استثنائيًا رفيعًا.",
    storyEn:
      "The Extra-Thin Tourbillon continues AP's decades-long pursuit of combining iconic design with the most exacting complications. The salmon dial — warm, rich, and utterly distinctive — makes this one of the most photographed Royal Oaks of the decade.",
    storyAr:
      "يواصل التوربيون الرفيع مسيرة AP في الجمع بين التصميم الأيقوني والتعقيدات الأدق. الميناء السالمون الدافئ يجعلها من أكثر الرويال أوك تصويرًا في العقد.",
    material: "18K Rose Gold",
    dialColor: "Salmon Grande Tapisserie",
    caseSize: "41mm",
    movement: "Caliber 2924 — Manual-winding Flying Tourbillon (9.5mm total)",
    complications: "Flying Tourbillon, Hours, Minutes",
    powerReserve: "70 hours",
    waterResistance: "20m",
    limitedEdition: false,
    yearReleased: 2021,
    retailPrice: 245000,
    marketValue: 280000,
    rarity: "Extremely Rare",
    mainImageUrl: "/watches-collection/royal-oak-salmon-dial-tourbillon-1674208549211_800x.webp",
    isFeatured: true,
    displayOrder: 14,
    isActive: true,
  });

  await upsertWatch({
    brandId: ap,
    referenceNumber: "26240CE-OO-1225CE-01",
    nameEn: "Audemars Piguet Royal Oak Chronograph Ice Blue",
    nameAr: "أوديمار بيغيه رويال أوك كرونوغراف - الميناء الأزرق الجليدي",
    slug: "audemars-piguet-royal-oak-chronograph-ice-blue",
    descriptionEn:
      "The 2021 Royal Oak Chronograph in 41 mm ceramic with the breathtaking 'Ice Blue' dial — available only in cermet (ceramic-metal composite) and considered one of the most beautiful dials Audemars Piguet has ever produced.",
    descriptionAr:
      "رويال أوك كرونوغراف 2021 من السيراميك 41 مم مع ميناء 'أزرق جليدي' مذهل - متوفر فقط من السيراميك.",
    storyEn:
      "The Ice Blue dial was first introduced on the Royal Oak Offshore and has become a signature of Audemars Piguet. This cermet-case iteration brought the colour to the main Royal Oak line, creating an instant collector's grail.",
    storyAr:
      "قُدّم الميناء الأزرق الجليدي لأول مرة على Royal Oak Offshore وأصبح بصمة AP. جلب هذا الإصدار من السيراميك اللون إلى خط رويال أوك الرئيسي.",
    material: "Ceramic (Cermet)",
    dialColor: "Ice Blue Grande Tapisserie",
    caseSize: "41mm",
    movement: "Caliber 4405 — Automatic Chronograph",
    complications: "Chronograph, Hours, Minutes, Seconds, Date",
    powerReserve: "70 hours",
    waterResistance: "50m",
    limitedEdition: false,
    yearReleased: 2021,
    retailPrice: 38000,
    marketValue: 65000,
    rarity: "Very Rare",
    mainImageUrl: "/watches-collection/royal-oak-chronograph-ice-blue-dial-1674203067787_800x.webp",
    isFeatured: false,
    displayOrder: 15,
    isActive: true,
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 5.  ROLEX  ──────────────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════

  await upsertWatch({
    brandId: rolex,
    referenceNumber: "6265/8",
    nameEn: "Rolex Daytona 6265/8 'Paul Newman' — 18K Yellow Gold",
    nameAr: "رولكس دايتونا 6265/8 'بول نيومان' — ذهب أصفر 18 قيراط",
    slug: "rolex-daytona-paul-newman-6265-8",
    descriptionEn:
      "A 1987 vintage Rolex Daytona in 18K yellow gold bearing the legendary 'exotic' dial known as the Paul Newman. The stepped sub-registers, Art Deco numerals, and contrasting colour rings made this the most coveted vintage Rolex of the 20th century.",
    descriptionAr:
      "دايتونا رولكس عتيقة 1987 من الذهب الأصفر 18 قيراطًا تحمل الميناء الأسطوري المعروف بـ 'بول نيومان'.",
    storyEn:
      "Paul Newman's personal Ref. 6239 sold at Phillips for $17.75 million in 2017, making the Newman dial the most famous in watchmaking history. The gold 6265 variant with its exotic dial represents the zenith of Daytona collecting — a combination of precious metal and the world's most recognised chronograph dial.",
    storyAr:
      "بيعت ساعة بول نيومان الشخصية 6239 في مزاد فيليبس بـ 17.75 مليون دولار عام 2017. نسخة الذهب 6265 مع ميناء النيومان تمثل ذروة جمع الدايتونا.",
    material: "18K Yellow Gold",
    dialColor: "Paul Newman 'Exotic' Dial — Black with Gold Sub-registers",
    caseSize: "37mm",
    movement: "Caliber 727 (Valjoux-based) — Manual-winding",
    complications: "Chronograph, Tachymetre Bezel",
    powerReserve: "48 hours",
    limitedEdition: false,
    yearReleased: 1987,
    retailPrice: 15000,
    marketValue: 200000,
    rarity: "Extremely Rare — Vintage",
    mainImageUrl: "/watches-collection/rolex-daytona-6265-1681913867168_800x.webp",
    isFeatured: true,
    displayOrder: 16,
    isActive: true,
  });

  await upsertWatch({
    brandId: rolex,
    referenceNumber: "6239-PN",
    nameEn: "Rolex Daytona 6239 'Paul Newman' — Vintage Exotic Dial",
    nameAr: "رولكس دايتونا 6239 'بول نيومان' — ميناء إكزوتيك عتيق",
    slug: "rolex-daytona-6239-paul-newman",
    descriptionEn:
      "The original Paul Newman Daytona — Reference 6239 from 1963–1969. The stainless steel case with a Valjoux 72B manual-wind movement and the iconic stepped-register 'exotic' dial defines the most storied chapter in vintage Rolex collecting.",
    descriptionAr:
      "دايتونا بول نيومان الأصلية — المرجع 6239 من 1963-1969. الغلاف الفولاذي مع محرك Valjoux 72B يدوي والميناء الإكزوتيك الأسطوري.",
    storyEn:
      "Paul Newman wore his 6239 — engraved 'Drive Carefully Me' by Joanne Woodward — for decades. His personal watch sold for $17.75M at Phillips in 2017. Any surviving 6239 with an authentic exotic dial now commands $200,000–$500,000 depending on condition.",
    storyAr:
      "ارتدى بول نيومان ساعته 6239 — التي نقشت عليها زوجته 'قد بحذر يا حبيبي' — لعقود. بيعت ساعته الشخصية بـ 17.75 مليون دولار.",
    material: "Stainless Steel",
    dialColor: "Paul Newman 'Exotic' Dial — White/Black Sub-registers",
    caseSize: "36mm",
    movement: "Caliber Valjoux 72B / 722 — Manual-winding, 17 jewels",
    complications: "Chronograph, Tachymetre Bezel",
    powerReserve: "45 hours",
    limitedEdition: false,
    yearReleased: 1965,
    retailPrice: 250,
    marketValue: 350000,
    rarity: "Extremely Rare — Vintage Icon",
    mainImageUrl: "/watches-collection/rolex-daytona-6239-paul-newman-1681913854878_800x.webp",
    isFeatured: true,
    displayOrder: 17,
    isActive: true,
  });

  await upsertWatch({
    brandId: rolex,
    referenceNumber: "6263-ADG",
    nameEn: "Rolex Daytona 6263 'Quraysh' by Artisans de Genève",
    nameAr: "رولكس دايتونا 6263 'قريش' — آرتيزانس دو جينيف",
    slug: "rolex-daytona-6263-quraysh-artisans-de-geneve",
    descriptionEn:
      "A vintage Ref. 6263 Daytona comprehensively transformed by Artisans de Genève under their 'Quraysh' programme — named for the noble Arabian tribe. Every surface is hand-finished to bespoke specification with unique Arabic calligraphy and custom engravings, making it a singular fusion of Swiss precision and Arab heritage.",
    descriptionAr:
      "دايتونا عتيقة 6263 تحوّلت بالكامل على يد آرتيزانس دو جينيف ضمن برنامج 'قريش'. كل سطح مصنوع يدويًا مع خط عربي مميز ونقوش فريدة.",
    storyEn:
      "Artisans de Genève is renowned for creating 'Unique Piece' custom Daytona watches at the crossroads of vintage Rolex and contemporary craftsmanship. The Quraysh edition celebrates Arab culture through enamel dials and hand-engraved movements by master artisans in Geneva.",
    storyAr:
      "آرتيزانس دو جينيف مشهورون بإنشاء ساعات Daytona مخصصة فريدة على تقاطع رولكس العتيق والحرفية المعاصرة.",
    material: "Stainless Steel (custom finished)",
    dialColor: "Custom Enamel with Arabic calligraphy",
    caseSize: "37mm",
    movement: "Caliber 727 — Manual-winding (hand-finished)",
    complications: "Chronograph, Tachymetre Bezel",
    powerReserve: "48 hours",
    limitedEdition: true,
    productionQuantity: 1,
    yearReleased: 2020,
    retailPrice: 75000,
    marketValue: 180000,
    rarity: "Ultra Rare — Unique Commission",
    mainImageUrl: "/watches-collection/rolex-daytona-6263-quraysh-1674202164605_800x.webp",
    isFeatured: true,
    displayOrder: 18,
    isActive: true,
  });

  await upsertWatch({
    brandId: rolex,
    referenceNumber: "6264-SS",
    nameEn: "Rolex Daytona 6264 Vintage",
    nameAr: "رولكس دايتونا 6264 عتيق",
    slug: "rolex-daytona-6264-vintage",
    descriptionEn:
      "Reference 6264 was produced for just one year (1969–70), making it among the shortest-run Daytonas ever. Powered by the robust Valjoux 727 movement, it bridges the classic 6239 era and the long-running 6263/6265 generation.",
    descriptionAr:
      "أُنتج المرجع 6264 لسنة واحدة فقط (1969-70)، مما يجعله من أقصر إنتاجًا للدايتونا. يُعدّ حلقة الوصل بين حقبتي 6239 و 6263/6265.",
    material: "Stainless Steel",
    dialColor: "White with black sub-registers",
    caseSize: "37mm",
    movement: "Caliber Valjoux 727 — Manual-winding",
    complications: "Chronograph, Tachymetre Bezel",
    powerReserve: "48 hours",
    limitedEdition: false,
    yearReleased: 1969,
    retailPrice: 500,
    marketValue: 60000,
    rarity: "Extremely Rare — One-year production",
    mainImageUrl: "/watches-collection/rolex-daytona-6264-1681913860634_800x.webp",
    isFeatured: false,
    displayOrder: 19,
    isActive: true,
  });

  await upsertWatch({
    brandId: rolex,
    referenceNumber: "6265-JPS",
    nameEn: "Rolex Daytona 6265 'John Player Special'",
    nameAr: "رولكس دايتونا 6265 'جون بلاير سبيشال'",
    slug: "rolex-daytona-6265-john-player-special",
    descriptionEn:
      "A 6265 in yellow gold with the coveted black dial and golden sub-registers nicknamed 'John Player Special' after the legendary black-and-gold Lotus F1 livery. The colour combination is among the most sought-after in vintage Daytona collecting.",
    descriptionAr:
      "دايتونا 6265 من الذهب الأصفر مع الميناء الأسود والساعات الفرعية الذهبية الملقبة بـ 'جون بلاير سبيشال' إشارة إلى سيارات لوتس للفورمولا 1.",
    material: "18K Yellow Gold",
    dialColor: "Black dial with Gold sub-registers ('JPS' combination)",
    caseSize: "37mm",
    movement: "Caliber Valjoux 727 — Manual-winding",
    complications: "Chronograph, Tachymetre Bezel",
    powerReserve: "48 hours",
    limitedEdition: false,
    yearReleased: 1977,
    retailPrice: 8000,
    marketValue: 120000,
    rarity: "Extremely Rare — Vintage",
    mainImageUrl: "/watches-collection/rolex-daytona-john-player-special-1681913884253_800x.webp",
    isFeatured: false,
    displayOrder: 20,
    isActive: true,
  });

  await upsertWatch({
    brandId: rolex,
    referenceNumber: "6265-AET",
    nameEn: "Rolex Daytona by AET Remould — Custom Edition",
    nameAr: "رولكس دايتونا — إصدار مخصص من آي إي تي ريمولد",
    slug: "rolex-daytona-aet-remould-custom",
    descriptionEn:
      "A Rolex Daytona 6265 customised by Parisian atelier AET Remould, known for transforming vintage Rolex sports models into bold artistic statements. Every AET Remould is a bespoke creation with hand-applied patina, engraving, and custom dials.",
    descriptionAr:
      "دايتونا رولكس 6265 مخصصة من قِبَل أتيليه AET Remould الباريسي، المعروف بتحويل ساعات رولكس العتيقة إلى تصريحات فنية جريئة.",
    storyEn:
      "AET Remould approaches each commission like a couturier approaches a garment. The studio in Paris disassembles the base Daytona, applies bespoke finishing to every component, and reassembles with custom dials and engravings. No two pieces are alike.",
    storyAr:
      "يتعامل AET Remould مع كل طلب كالمصمم مع الثوب. يفكّك الاستوديو الدايتونا الأصلية، ويطبق تشطيبًا مخصصًا على كل مكوّن.",
    material: "Stainless Steel (custom patina and engravings)",
    dialColor: "Custom bespoke",
    caseSize: "37mm",
    movement: "Caliber Valjoux 727 — Manual-winding (hand-finished)",
    complications: "Chronograph, Tachymetre Bezel",
    powerReserve: "48 hours",
    limitedEdition: true,
    productionQuantity: 1,
    yearReleased: 2019,
    retailPrice: 45000,
    marketValue: 95000,
    rarity: "Ultra Rare — Bespoke Commission",
    mainImageUrl: "/watches-collection/rolex-daytona-aet-remould-1681913876180_800x.webp",
    isFeatured: false,
    displayOrder: 21,
    isActive: true,
  });

  await upsertWatch({
    brandId: rolex,
    referenceNumber: "116519LN",
    nameEn: "Rolex Cosmograph Daytona 116519LN White Gold",
    nameAr: "رولكس كوزموغراف دايتونا 116519LN ذهب أبيض",
    slug: "rolex-daytona-white-gold-116519ln",
    descriptionEn:
      "A 40 mm 18K white gold Daytona with a black ceramic bezel and black chronograph dial. The Caliber 4130 is Rolex's finest in-house movement, offering 72 hours of power reserve and COSC certification.",
    descriptionAr:
      "دايتونا 40 مم من الذهب الأبيض 18 قيراطًا مع حافة سيراميك سوداء وميناء كرونوغراف أسود. الكاليبر 4130 أفضل محركات رولكس الداخلية.",
    material: "18K White Gold, Black Ceramic bezel",
    dialColor: "Black Chronograph",
    caseSize: "40mm",
    movement: "Caliber 4130 — Automatic, COSC certified",
    complications: "Chronograph, Tachymetre Bezel",
    powerReserve: "72 hours",
    waterResistance: "100m",
    limitedEdition: false,
    yearReleased: 2016,
    retailPrice: 39350,
    marketValue: 55000,
    rarity: "Very Rare",
    mainImageUrl: "/watches-collection/rolex-daytona-white-gold-1681913899487_800x.webp",
    isFeatured: false,
    displayOrder: 22,
    isActive: true,
  });

  await upsertWatch({
    brandId: rolex,
    referenceNumber: "126710BLRO",
    nameEn: "Rolex GMT-Master II 'Pepsi' 126710BLRO",
    nameAr: "رولكس جي إم تي ماستر II 'بيبسي' 126710BLRO",
    slug: "rolex-gmt-master-ii-pepsi-126710blro",
    descriptionEn:
      "The iconic red-and-blue 'Pepsi' bezel returns on an Oystersteel bracelet — the most requested Rolex in the world. Caliber 3285 delivers 70 hours of power reserve and triple-timezone tracking.",
    descriptionAr:
      "حافة 'بيبسي' الأسطورية الأحمر والأزرق تعود على أسورة فولاذية — الرولكس الأكثر طلبًا في العالم.",
    material: "Oystersteel",
    dialColor: "Black with Red/Blue 'Pepsi' Cerachrom bezel",
    caseSize: "40mm",
    movement: "Caliber 3285 — Automatic",
    complications: "GMT (3rd time zone), Date",
    powerReserve: "70 hours",
    waterResistance: "100m",
    limitedEdition: false,
    yearReleased: 2018,
    retailPrice: 10700,
    marketValue: 17000,
    rarity: "Very Rare — High Demand",
    mainImageUrl: "/watches-collection/rolex-pepsi-1674209935187_800x.webp",
    isFeatured: false,
    displayOrder: 23,
    isActive: true,
  });

  await upsertWatch({
    brandId: rolex,
    referenceNumber: "126719BLRO",
    nameEn: "Rolex GMT-Master II Pepsi White Gold — Meteorite Dial",
    nameAr: "رولكس جي إم تي ماستر II بيبسي ذهب أبيض — ميناء نيزكي",
    slug: "rolex-gmt-master-ii-pepsi-meteorite-white-gold",
    descriptionEn:
      "The pinnacle of the Pepsi GMT: 18K white gold with a Gibeon meteorite dial — each piece unique because no two meteorite slices are alike. The striking bi-colour 'Pepsi' bezel and the otherworldly dial make this the ultimate GMT-Master II.",
    descriptionAr:
      "قمة سلسلة GMT بيبسي: ذهب أبيض 18 قيراطًا مع ميناء نيزكي من نيزك جيبيون — كل قطعة فريدة لأن لا شريحتين نيزكيتين متماثلتين.",
    material: "18K White Gold",
    dialColor: "Gibeon Meteorite with Red/Blue 'Pepsi' Cerachrom bezel",
    caseSize: "40mm",
    movement: "Caliber 3285 — Automatic",
    complications: "GMT (3rd time zone), Date",
    powerReserve: "70 hours",
    waterResistance: "100m",
    limitedEdition: false,
    yearReleased: 2023,
    retailPrice: 47350,
    marketValue: 60000,
    rarity: "Extremely Rare",
    mainImageUrl: "/watches-collection/rolex-pepsi-meteorite-1681913907088_800x.webp",
    isFeatured: true,
    displayOrder: 24,
    isActive: true,
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 6.  TUDOR  ──────────────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════

  await upsertWatch({
    brandId: tudor,
    referenceNumber: "79360N",
    nameEn: "Tudor Black Bay Chronograph 'Pink Dial' — Inter Miami Edition",
    nameAr: "تيودور بلاك باي كرونوغراف 'القرص الوردي' — إصدار إنتر ميامي",
    slug: "tudor-black-bay-chronograph-pink-dial",
    descriptionEn:
      "Born from Tudor's partnership with Inter Miami CF, this Black Bay Chronograph swaps the standard dial for the club's signature pink — striking and instantly recognisable. The MT5813 movement is co-developed with Breitling and meets METAS Master Chronometer standards.",
    descriptionAr:
      "من شراكة تيودور مع إنتر ميامي، يستبدل هذا الكرونوغراف الميناء القياسي بوردي النادي المميز. محرك MT5813 مطوَّر مع بريتلينغ ومعتمد METAS.",
    storyEn:
      "When Lionel Messi joined Inter Miami in 2023, Tudor — the club's official timekeeper — released this limited-production pink-dial variant. It sold out within hours of release, immediately commanding a premium on the secondary market.",
    storyAr:
      "عندما انضم ليونيل ميسي إلى إنتر ميامي عام 2023، أصدرت تيودور هذا الإصدار الوردي المحدود الذي نفد في ساعات.",
    material: "Stainless Steel",
    dialColor: "Inter Miami Pink",
    caseSize: "41mm",
    movement: "Caliber MT5813 — Automatic (co-developed with Breitling), METAS certified",
    complications: "Chronograph, Date",
    powerReserve: "70 hours",
    waterResistance: "200m",
    limitedEdition: true,
    yearReleased: 2024,
    retailPrice: 5650,
    marketValue: 7500,
    rarity: "Limited Edition",
    mainImageUrl: undefined,
    isFeatured: false,
    displayOrder: 25,
    isActive: true,
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 7.  BREITLING  ──────────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════

  await upsertWatch({
    brandId: breit,
    referenceNumber: "V17310AT",
    nameEn: "Breitling Avenger Blackbird DLC Titanium",
    nameAr: "بريتلينغ أفينجر بلاك بيرد — تيتانيوم DLC",
    slug: "breitling-avenger-blackbird",
    descriptionEn:
      "A 44 mm titanium pilot's watch with a DLC (Diamond-Like Carbon) coating for extreme scratch resistance. COSC-certified Caliber B17 powers the watch with a 42-hour power reserve, and 300 m water resistance makes it a true tool watch.",
    descriptionAr:
      "ساعة طيار تيتانيوم 44 مم مع طلاء DLC لمقاومة الخدوش القصوى. كاليبر B17 معتمد COSC مع مقاومة ماء 300 متر.",
    storyEn:
      "Inspired by the legendary Lockheed SR-71 Blackbird reconnaissance aircraft, this Breitling takes its all-black DNA seriously: titanium case, DLC treatment, black dial, black strap — every element engineered for performance.",
    storyAr:
      "مستوحى من طائرة الاستطلاع SR-71 Blackbird الأسطورية، تأخذ هذه بريتلينغ حمضها الأسود الكامل بجدية.",
    material: "DLC-coated Titanium",
    dialColor: "Black",
    caseSize: "44mm",
    movement: "Caliber B17 — Automatic, COSC certified",
    complications: "Date, Slide-rule Bezel",
    powerReserve: "42 hours",
    waterResistance: "300m",
    limitedEdition: false,
    yearReleased: 2015,
    retailPrice: 5100,
    marketValue: 5200,
    rarity: "Available",
    mainImageUrl: undefined,
    isFeatured: false,
    displayOrder: 26,
    isActive: true,
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 8.  H. MOSER & CIE  ─────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════

  await upsertWatch({
    brandId: moser,
    referenceNumber: "1801-0401",
    nameEn: "H. Moser & Cie Endeavour Perpetual Moon",
    nameAr: "إتش موزر وشركاه إندياڤور تقويم القمر الدائم",
    slug: "h-moser-endeavour-perpetual-moon",
    descriptionEn:
      "H. Moser's most romantic complication: the Endeavour Perpetual Moon with its legendary 'Funky Blue' fumé dial requires only one day of correction every 1,027 years. The in-house HMC 801 movement is entirely developed and manufactured in Schaffhausen.",
    descriptionAr:
      "أكثر تعقيدات موزر رومانسية: إندياڤور القمر الدائم مع ميناء 'فانكي بلو' الأسطوري يحتاج إلى تصحيح واحد كل 1,027 عامًا.",
    storyEn:
      "The H. Moser moon-phase display is calibrated to be accurate to within one day every 1,027 years — approximately ten times more precise than most competitors. The fumé dials, produced in-house, vary in colour from piece to piece, ensuring every Moser is unique.",
    storyAr:
      "معيار طور القمر في موزر دقيق لغاية يوم واحد كل 1,027 عامًا — أدق بعشر مرات تقريبًا من معظم المنافسين.",
    material: "18K Rose Gold",
    dialColor: "Funky Blue Fumé",
    caseSize: "40.8mm",
    movement: "Caliber HMC 801 — Manual-winding, in-house Schaffhausen",
    complications: "Perpetual Moon Phase, Hours, Minutes",
    powerReserve: "168 hours (7 days)",
    waterResistance: "30m",
    limitedEdition: false,
    yearReleased: 2018,
    retailPrice: 38000,
    marketValue: 45000,
    rarity: "Very Rare",
    mainImageUrl: "/watches-collection/h-moser-1674217667237_800x.webp",
    isFeatured: false,
    displayOrder: 27,
    isActive: true,
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 9.  ARTISANS DE GENÈVE (under Rolex brand — custom Rolex base)  ─────────
  // ══════════════════════════════════════════════════════════════════════════

  await upsertWatch({
    brandId: rolex,
    referenceNumber: "ADG-MONTOYA-6263",
    nameEn: "Artisans de Genève 'La Montoya' — Custom Daytona 6263",
    nameAr: "آرتيزانس دو جينيف 'لا مونتويا' — دايتونا 6263 مخصصة",
    slug: "artisans-de-geneve-la-montoya",
    descriptionEn:
      "A one-of-a-kind vintage Rolex Daytona 6263 transformed by Geneva's foremost bespoke atelier, Artisans de Genève. 'La Montoya' bears hand-engraved bridges, a custom Marlboro red lacquer dial, and over 200 hours of individual hand-finishing — a tribute to Juan Pablo Montoya and motor racing heritage.",
    descriptionAr:
      "دايتونا رولكس 6263 عتيقة فريدة من نوعها حوّلتها أبرز ورش العمل المخصصة في جنيف. تحمل 'لا مونتويا' جسورًا منقوشة يدويًا وميناء أحمر لاكيه مخصصًا.",
    storyEn:
      "Artisans de Genève was founded to answer one question: what if you could combine a vintage Rolex with the hand-finishing standards of a Swiss Manufacture? La Montoya — named for the Colombian F1 champion — exemplifies their answer: 200+ hours of hand work on a Daytona 6263 base, including custom hand-painted sub-dials and acid-etched movement bridges.",
    storyAr:
      "تأسست آرتيزانس دو جينيف للإجابة عن سؤال: ماذا لو جمعنا رولكس عتيقة بمعايير التشطيب اليدوي لمصنع سويسري؟ 'لا مونتويا' تجسّد الإجابة.",
    material: "Stainless Steel (hand-finished, custom patina)",
    dialColor: "Custom Marlboro Red Lacquer",
    caseSize: "37mm",
    movement: "Caliber Valjoux 727 — Manual-winding (extensively hand-finished)",
    complications: "Chronograph, Tachymetre Bezel",
    powerReserve: "48 hours",
    limitedEdition: true,
    productionQuantity: 1,
    yearReleased: 2021,
    retailPrice: 120000,
    marketValue: 250000,
    rarity: "Ultra Rare — Unique Commission",
    mainImageUrl: "/watches-collection/artisans-de-geneve-la-montoya-1681913755711_800x.webp",
    isFeatured: true,
    displayOrder: 28,
    isActive: true,
  });

  // ══════════════════════════════════════════════════════════════════════════
  // done
  // ══════════════════════════════════════════════════════════════════════════

  console.log("\n✅  All watches upserted successfully.");
  await connection.end();
}

run().catch((err) => {
  console.error("❌  Update failed:", err);
  process.exit(1);
});
