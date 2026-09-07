export const vacheronDossier = {
  officialSourceUrl: "https://www.vacheron-constantin.com/us/en/watches/all-collections.html",
  heritageSourceUrl: "https://www.vacheron-constantin.com/us/en/maison/manufacture.html",
  eyebrow: {
    en: "A MAISON REFERENCE · 1755",
    ar: "مرجع للدار · 1755",
  },
  title: {
    en: "A study in continuity.",
    ar: "دراسة في الاستمرارية.",
  },
  lede: {
    en: "An original archive reading of Vacheron Constantin, guided by the maison’s published history, collection vocabulary, and a strict distinction between maison context and a documented watch record.",
    ar: "قراءة أرشيفية أصلية لفاشيرون كونستانتين، تسترشد بتاريخ الدار ومفردات مجموعاتها المنشورة، مع فصل واضح بين سياق الدار وسجل الساعة الموثق.",
  },
  boundary: {
    en: "This page is a maison context. It does not assert that any Vacheron Constantin timepiece is owned, worn, available, or represented in this archive without a separate public source.",
    ar: "هذه الصفحة سياق للدار. ولا تؤكد ملكية أو ارتداء أو توافر أو تمثيل أي ساعة من فاشيرون كونستانتين في هذا الأرشيف من دون مصدر علني مستقل.",
  },
  pillars: [
    {
      value: "1755",
      label: { en: "Geneva origin", ar: "بداية جنيف" },
      detail: { en: "A dated point of reference in the maison’s own history.", ar: "نقطة مرجعية مؤرخة في تاريخ الدار كما ترويه بنفسها." },
    },
    {
      value: "270+",
      label: { en: "Years of history", ar: "عاماً من التاريخ" },
      detail: { en: "The official manufacture page describes more than 270 years of history.", ar: "تصف صفحة المصنع الرسمية أكثر من 270 عاماً من التاريخ." },
    },
    {
      value: "∞",
      label: { en: "Continuity", ar: "استمرارية" },
      detail: { en: "The maison states that it has produced watches uninterruptedly since 1755.", ar: "تذكر الدار أنها تنتج الساعات دون انقطاع منذ 1755." },
    },
  ],
  collections: [
    { name: "Overseas", arName: "أوفرسيز", en: "Sport-elegance and an outward-looking construction language.", ar: "أناقة رياضية ولغة تصميم منفتحة على الحركة." },
    { name: "Historiques", arName: "هيستوريك", en: "Contemporary readings of design and mechanical milestones.", ar: "قراءات معاصرة لمحطات في التصميم والميكانيكا." },
    { name: "Traditionnelle", arName: "تراديشنال", en: "Classical Genevan codes and technical refinement.", ar: "رموز جنيف الكلاسيكية وصقل تقني." },
    { name: "Fiftysix", arName: "فيفتي سيكس", en: "A mid-century reference rendered for a contemporary cadence.", ar: "مرجع من منتصف القرن بصياغة معاصرة." },
    { name: "Patrimony", arName: "باتريموني", en: "Purity of line and measured function.", ar: "نقاء الخط ووظيفة محسوبة." },
    { name: "Égérie", arName: "إيجيري", en: "A dialogue between Haute Couture and Haute Horlogerie.", ar: "حوار بين الأزياء الراقية وصناعة الساعات الراقية." },
    { name: "Métiers d’Art", arName: "ميتييه دار", en: "Decorative craft, culture, and artistic expression.", ar: "حرف زخرفية وثقافة وتعبير فني." },
    { name: "Heures Créatives", arName: "أور كرييتيف", en: "Historic women’s-watch design references.", ar: "إشارات إلى تاريخ تصميم ساعات النساء." },
  ],
} as const;
