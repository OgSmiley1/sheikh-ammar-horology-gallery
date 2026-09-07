export interface Watch {
  id: string;
  slug: string;
  brand: string;
  model: string;
  reference: string;
  subtitle: string;
  description: string;
  story: string;
  watchImage: string;
  sheikhImage?: string;
  specifications: {
    movement: string;
    case: string;
    diameter: string;
    year: string;
    price: string;
    rarity: string;
  };
  retailPrice?: string;
  marketPrice?: string;
  limitedEdition?: {
    pieces: number;
    note: string;
  };
  features: string[];
  category: "perpetual-calendar" | "tourbillon" | "chronograph" | "time-only" | "complications";
}

export const completeCollection: Watch[] = [
  // H. Moser & Cie
  {
    id: "h-moser-endeavour-tourbillon-vantablack",
    slug: "h-moser-endeavour-tourbillon-vantablack-1804-0212",
    brand: "H. Moser & Cie",
    model: "Endeavour Tourbillon",
    reference: "1804-0212",
    subtitle: "Concept Vantablack",
    description: "Darker than black: H. Moser & Cie. combines its ingenious double hairspring flying tourbillon with the blackest material known to man: Vantablack®. The Endeavour Tourbillon watch in white gold and Vantablack® dial is the epitome of 'less is more', where the strikingly black dial void of a logo, markers or any embellishment gives way to the hypnotic tourbillon.",
    story: "H. Moser & Cie has always been known for pushing boundaries in watchmaking. The Endeavour Tourbillon Concept Vantablack represents the ultimate expression of minimalism, featuring a dial coated in Vantablack®, one of the darkest substances known to science. This material absorbs 99.965% of visible light, creating an almost surreal visual effect.",
    watchImage: "/watches/h-moser-1674217667237_800x.webp",
    sheikhImage: "/watches/278694984_1021506258792161_7433008742422839721_n-1681913736827_800x.webp",
    specifications: {
      movement: "HMC 804, Flying Tourbillon",
      case: "White Gold",
      diameter: "40.8mm",
      year: "2020",
      price: "$85,000",
      rarity: "Rare"
    },
    retailPrice: "CHF 75,000",
    features: [
      "Vantablack® dial - absorbs 99.965% of light",
      "Double hairspring flying tourbillon",
      "Minimalist design with no logo or markers",
      "Hand-wound movement",
      "72-hour power reserve"
    ],
    category: "tourbillon"
  },

  // Audemars Piguet Collection
  {
    id: "ap-royal-oak-blue-ceramic",
    slug: "audemars-piguet-royal-oak-perpetual-calendar-blue-ceramic-26579cs",
    brand: "Audemars Piguet",
    model: "Royal Oak Perpetual Calendar",
    reference: "26579CS",
    subtitle: "Blue Ceramic",
    description: "Entirely dressed in blue, the new 41mm Royal Oak Perpetual Calendar presents a case and bracelet fully crafted in blue ceramic for the first time. The blue dial features a 'Grande Tapisserie' pattern with blue counters, white gold applied hour-markers and Royal Oak hands with luminescent coating.",
    story: "Released in September 2022, this groundbreaking timepiece marks the first time Audemars Piguet has created a Royal Oak Perpetual Calendar entirely in blue ceramic. The achievement represents years of research into ceramic manufacturing and finishing techniques. Paired with a blue ceramic bracelet with an AP folding clasp in blackened polished steel, the blue watch has a 41mm case and a 9.5mm in height.",
    watchImage: "/watches/278694984_1021506258792161_7433008742422839721_n-1681913736827_800x.webp",
    sheikhImage: "/watches/326048239_936601320719759_2450602950051524580_n-1674200911447_800x.webp",
    specifications: {
      movement: "Caliber 5134, Perpetual Calendar",
      case: "Blue Ceramic",
      diameter: "41mm × 9.5mm",
      year: "2022",
      price: "$400,000",
      rarity: "Ultra Rare - First Full Blue Ceramic"
    },
    retailPrice: "$109,500",
    features: [
      "Grande Tapisserie dial pattern",
      "Day, date, month, astronomical moon",
      "Week of the year indication",
      "Leap year indication",
      "Blue ceramic bracelet with AP folding clasp"
    ],
    category: "perpetual-calendar"
  },

  {
    id: "ap-royal-oak-white-ceramic",
    slug: "audemars-piguet-royal-oak-perpetual-calendar-white-ceramic-26579cb",
    brand: "Audemars Piguet",
    model: "Royal Oak Perpetual Calendar",
    reference: "26579CB",
    subtitle: "White Ceramic",
    description: "The 41mm white ceramic Royal Oak Perpetual Calendar featuring the day, date, month, astronomical moon, and week of the year. The leap year indication, pioneered by Audemars Piguet in 1955, is also featured on the blue Grande Tapisserie decorated dial.",
    story: "This Audemars Piguet Royal Oak Perpetual Calendar White Ceramic has presence and a certain elegance with its casual, sporty, summery style. Instead of the understated elegance of a Calatrava, its elegance is appealing and alluring. Ceramic allows you to enjoy its lightweight, immaculate white personality without worrying about damaging the surface with scratches thanks to its great solidity, scratch resistance, and light weight. The white watch that John Mayer and Ed Sheeran also have was introduced in September 2019.",
    watchImage: "/watches/royal-oak-white-1674201595442_800x.webp",
    specifications: {
      movement: "Caliber 5134, Perpetual Calendar",
      case: "White Ceramic",
      diameter: "41mm × 9.5mm",
      year: "2019",
      price: "$300,000",
      rarity: "Rare"
    },
    retailPrice: "$93,900",
    features: [
      "Grande Tapisserie dial pattern",
      "Day, date, month, astronomical moon",
      "Week of the year indication",
      "Leap year indication",
      "Scratch-resistant ceramic case"
    ],
    category: "perpetual-calendar"
  },

  {
    id: "ap-royal-oak-chronograph-ice-blue",
    slug: "audemars-piguet-royal-oak-chronograph-ice-blue-26317bc",
    brand: "Audemars Piguet",
    model: "Royal Oak Chronograph",
    reference: "26317BC",
    subtitle: "Ice Blue Dial",
    description: "The white gold Royal Oak Chronograph 26317BC features a light blue dial with 'Grande Tapisserie' pattern, blue counters and dark blue external zone, white gold applied hour-markers and hands with luminescent coating.",
    story: "Next is the white gold Royal Oak Chronograph 26317BC. The watch features a light blue dial with 'Grande Tapisserie' pattern, blue counters and dark blue external zone, white gold applied hour-markers and hands with luminescent coating. Limited to 100 pieces only worldwide, this exclusive timepiece represents the pinnacle of Audemars Piguet's chronograph craftsmanship.",
    watchImage: "/watches/royal-oak-chronograph-ice-blue-dial-1674203067787_800x.webp",
    limitedEdition: {
      pieces: 100,
      note: "Limited to 100 pieces worldwide"
    },
    specifications: {
      movement: "Caliber 2385, Automatic Chronograph",
      case: "White Gold",
      diameter: "38mm",
      year: "2018",
      price: "$150,000",
      rarity: "Ultra Rare - Limited Edition"
    },
    marketPrice: "~$140,000",
    features: [
      "Grande Tapisserie dial pattern",
      "Chronograph function",
      "Date display",
      "White gold case and bracelet",
      "Limited to 100 pieces"
    ],
    category: "chronograph"
  },

  {
    id: "ap-royal-oak-flying-tourbillon-salmon",
    slug: "audemars-piguet-royal-oak-flying-tourbillon-salmon-26522ce",
    brand: "Audemars Piguet",
    model: "Royal Oak Flying Tourbillon Extra-Thin",
    reference: "26522CE",
    subtitle: "Salmon Dial - Middle East Edition",
    description: "In the picture, his Highness wears the very special 25 pieces limited 'Middle East Edition' 41mm Audemars Piguet Royal Oak Tourbillon Extra-Thin, in stainless steel. The salmon-colored dial features white gold Eastern-Arabic numerals and displays the 'Evolution Tapisserie' pattern emanating from the center of the tourbillon.",
    story: "This extraordinary timepiece represents one of the most exclusive Royal Oak models ever created. Limited to just 25 pieces for the Middle East market, it features a stunning salmon dial with Eastern-Arabic numerals, making it instantly recognizable and highly sought after by collectors. The Evolution Tapisserie pattern radiates from the tourbillon, creating a mesmerizing visual effect.",
    watchImage: "/watches/royal-oak-salmon-dial-tourbillon-1674208549211_800x.webp",
    limitedEdition: {
      pieces: 25,
      note: "Middle East Edition - Limited to 25 pieces"
    },
    specifications: {
      movement: "Caliber 2950, Flying Tourbillon",
      case: "Stainless Steel",
      diameter: "41mm",
      year: "2020",
      price: "$170,000",
      rarity: "Ultra Rare - Middle East Exclusive"
    },
    retailPrice: "$170,000",
    features: [
      "Flying tourbillon",
      "Eastern-Arabic numerals",
      "Evolution Tapisserie pattern",
      "Salmon dial",
      "Middle East exclusive edition"
    ],
    category: "tourbillon"
  },

  {
    id: "ap-royal-oak-jumbo-salmon",
    slug: "audemars-piguet-royal-oak-extra-thin-jumbo-15202",
    brand: "Audemars Piguet",
    model: "Royal Oak Extra-Thin 'Jumbo'",
    reference: "15202",
    subtitle: "Salmon Dial",
    description: "The iconic Royal Oak 'Jumbo' Extra-Thin in its most elegant form, featuring a rare salmon dial that has become one of the most sought-after configurations among collectors.",
    story: "The Royal Oak 'Jumbo' reference 15202 is a direct descendant of the original 1972 Royal Oak designed by Gérald Genta. This salmon dial variant represents the perfect blend of classic design and contemporary aesthetics, making it one of the most desirable Royal Oak models in the current collection.",
    watchImage: "/watches/royal-oak-jumbo-15202bc-1681913914790_800x.webp",
    specifications: {
      movement: "Caliber 2121, Ultra-Thin Automatic",
      case: "White Gold",
      diameter: "39mm × 8.1mm",
      year: "2021",
      price: "$120,000",
      rarity: "Rare"
    },
    features: [
      "Ultra-thin automatic movement",
      "Salmon dial with Grande Tapisserie pattern",
      "Date display at 3 o'clock",
      "Integrated bracelet",
      "Water-resistant to 50m"
    ],
    category: "time-only"
  },

  // Rolex Collection
  {
    id: "rolex-day-date-coral-red",
    slug: "rolex-day-date-18239-coral-red",
    brand: "Rolex",
    model: "Day-Date",
    reference: "18239",
    subtitle: "Coral Red",
    description: "Day-Date 18239 'Coral Red' in 18k white gold. Due to the material's scarcity, coral Day-Date dials are among the most difficult to locate of all natural stone Day-Date dials.",
    story: "The Rolex Day-Date with a coral dial is one of the rarest and most sought-after configurations in the entire Day-Date lineup. Natural coral dials are extremely scarce due to environmental restrictions on coral harvesting, making authentic examples incredibly valuable. The warm, organic tones of the coral create a stunning contrast against the white gold case.",
    watchImage: "/watches/326048239_936601320719759_2450602950051524580_n-1674200911447_800x.webp",
    specifications: {
      movement: "Caliber 3155, Automatic",
      case: "18k White Gold",
      diameter: "36mm",
      year: "1990s",
      price: "$175,000",
      rarity: "Ultra Rare - Natural Stone Dial"
    },
    marketPrice: "~$175,000",
    features: [
      "Natural coral dial",
      "Day and date display",
      "President bracelet",
      "Superlative Chronometer",
      "Extremely rare natural stone dial"
    ],
    category: "time-only"
  },

  {
    id: "rolex-daytona-quraysh-hawk",
    slug: "rolex-daytona-6263-quraysh-hawk",
    brand: "Rolex",
    model: "Daytona Chronograph",
    reference: "6263",
    subtitle: "Quraysh Hawk Dial",
    description: "The Rolex Daytona Chronograph 6263 in 37,5 mm stainless steel with a 'Quraysh Hawk Dial' that was built for the late ruler of Dubai, Mohammed Bin Al Maktoum Rashid, is being worn by the Crown Prince of Ajman.",
    story: "The United Arab Emirates began ordering timepieces from Rolex to offer as gifts to 'important' persons around the beginning of the 1970s. You can see the hawk's feet perched on top of the 'Mohammed bin Rashid Al Makhtoum' signature on this example's distinctive dial. The Emir's name is likewise signed above six o'clock. This watch represents a unique piece of UAE history and horological heritage.",
    watchImage: "/watches/rolex-daytona-6263-quraysh-1674202164605_800x.webp",
    specifications: {
      movement: "Caliber 727, Manual Chronograph",
      case: "Stainless Steel",
      diameter: "37.5mm",
      year: "1970s",
      price: "$700,000",
      rarity: "Ultra Rare - UAE Royal Commission"
    },
    marketPrice: "$700,000",
    features: [
      "Quraysh Hawk dial",
      "UAE royal commission piece",
      "Mohammed bin Rashid Al Maktoum signature",
      "Manual-wind chronograph",
      "Historical significance"
    ],
    category: "chronograph"
  },

  {
    id: "rolex-gmt-master-pepsi",
    slug: "rolex-gmt-master-ii-pepsi-126710blro",
    brand: "Rolex",
    model: "GMT-Master II 'Pepsi'",
    reference: "126710BLRO",
    subtitle: "Jubilee Bracelet",
    description: "Not only he has rare watches in his collection, but he also has common luxury watches such as the Rolex GMT-Master II 'Pepsi' 126710BLRO on a jubilee bracelet. This model features a black dial and a two-colour Cerachrom bezel insert in red and blue ceramic.",
    story: "Designed to show the time in two different time zones simultaneously during intercontinental flights, the GMT-Master II has come to be recognized for its robustness and versatile appearance. The iconic 'Pepsi' bezel has become one of the most recognizable designs in all of watchmaking.",
    watchImage: "/watches/rolex-pepsi-1674209935187_800x.webp",
    specifications: {
      movement: "Caliber 3285, Automatic GMT",
      case: "Oystersteel",
      diameter: "40mm",
      year: "2018",
      price: "$22,000",
      rarity: "Common Luxury"
    },
    marketPrice: "~$22,000",
    features: [
      "GMT function",
      "Cerachrom bezel in red and blue",
      "Jubilee bracelet",
      "70-hour power reserve",
      "Superlative Chronometer"
    ],
    category: "complications"
  },

  {
    id: "rolex-gmt-master-pepsi-meteorite",
    slug: "rolex-gmt-master-ii-pepsi-meteorite-126719",
    brand: "Rolex",
    model: "GMT-Master II 'Pepsi'",
    reference: "126719BLRO",
    subtitle: "Meteorite Dial",
    description: "The GMT-Master II 'Pepsi' with a rare meteorite dial in white gold, combining the iconic red and blue bezel with an otherworldly dial made from genuine meteorite.",
    story: "This exceptional GMT-Master II features a dial crafted from genuine meteorite, making each watch truly unique. The Gibeon meteorite used by Rolex fell to Earth in Namibia and is approximately 4 billion years old. The distinctive crystalline pattern, known as Widmanstätten pattern, is unique to each dial.",
    watchImage: "/watches/rolex-pepsi-meteorite-1681913907088_800x.webp",
    specifications: {
      movement: "Caliber 3285, Automatic GMT",
      case: "18k White Gold",
      diameter: "40mm",
      year: "2019",
      price: "$45,000",
      rarity: "Rare"
    },
    features: [
      "Genuine meteorite dial",
      "GMT function",
      "Cerachrom bezel in red and blue",
      "White gold case",
      "Unique Widmanstätten pattern"
    ],
    category: "complications"
  },

  {
    id: "rolex-daytona-paul-newman-6239",
    slug: "rolex-daytona-paul-newman-6239",
    brand: "Rolex",
    model: "Daytona",
    reference: "6239",
    subtitle: "Paul Newman Dial",
    description: "The legendary Rolex Daytona with the iconic Paul Newman dial, one of the most sought-after vintage chronographs in the world.",
    story: "The Paul Newman Daytona is perhaps the most famous vintage watch in the world, named after the legendary actor who wore his own example daily. These watches feature an exotic dial with Art Deco-style numerals and contrasting sub-dials. Original examples from the 1960s are now among the most valuable watches ever sold at auction.",
    watchImage: "/watches/rolex-daytona-6239-paul-newman-1681913854878_800x.webp",
    specifications: {
      movement: "Caliber 722, Manual Chronograph",
      case: "Stainless Steel",
      diameter: "37mm",
      year: "1960s",
      price: "$250,000+",
      rarity: "Ultra Rare"
    },
    features: [
      "Exotic Paul Newman dial",
      "Manual-wind chronograph",
      "Acrylic crystal",
      "Pump pushers",
      "Legendary provenance"
    ],
    category: "chronograph"
  },

  {
    id: "rolex-daytona-paul-newman-6264",
    slug: "rolex-daytona-paul-newman-6264-green-strap",
    brand: "Rolex",
    model: "Daytona",
    reference: "6264",
    subtitle: "Paul Newman Dial with Green Leather Strap",
    description: "A rare Rolex Daytona 6264 featuring the coveted Paul Newman dial, presented on a distinctive green leather strap that adds a unique character to this legendary chronograph.",
    story: "The reference 6264 represents a transitional model in the Daytona lineage, featuring screw-down pushers that improved water resistance. This example's Paul Newman dial combined with the unusual green leather strap creates a striking and distinctive appearance that sets it apart from other vintage Daytonas.",
    watchImage: "/watches/rolex-daytona-6264-1681913860634_800x.webp",
    specifications: {
      movement: "Caliber 727, Manual Chronograph",
      case: "Stainless Steel",
      diameter: "37mm",
      year: "1970s",
      price: "$200,000+",
      rarity: "Ultra Rare"
    },
    features: [
      "Paul Newman dial",
      "Screw-down pushers",
      "Green leather strap",
      "Manual-wind chronograph",
      "Transitional reference"
    ],
    category: "chronograph"
  },

  {
    id: "rolex-daytona-6265",
    slug: "rolex-daytona-6265-black-dial",
    brand: "Rolex",
    model: "Daytona",
    reference: "6265",
    subtitle: "Black Dial",
    description: "The Rolex Daytona 6265 with black dial represents one of the most desirable vintage Daytona configurations, featuring screw-down pushers and the robust Valjoux 727 movement.",
    story: "Produced from the 1970s through the 1980s, the reference 6265 is considered by many collectors to be the ultimate vintage Daytona. The black dial variant is particularly sought after for its sporty aesthetic and excellent legibility. These watches have appreciated significantly in value over the past decade.",
    watchImage: "/watches/rolex-daytona-6265-1681913867168_800x.webp",
    specifications: {
      movement: "Caliber 727, Manual Chronograph",
      case: "Stainless Steel",
      diameter: "37mm",
      year: "1970s-1980s",
      price: "$150,000+",
      rarity: "Rare"
    },
    features: [
      "Black dial",
      "Screw-down pushers",
      "Manual-wind chronograph",
      "Acrylic crystal",
      "Vintage collector's favorite"
    ],
    category: "chronograph"
  },

  {
    id: "rolex-daytona-john-player-special",
    slug: "rolex-daytona-6241-john-player-special",
    brand: "Rolex",
    model: "Daytona",
    reference: "6241",
    subtitle: "John Player Special",
    description: "Rolex Daytona 6241 'John Player Special' in yellow gold with the Paul Newman dial. This rare configuration features a black and gold color scheme reminiscent of the famous Formula 1 racing livery.",
    story: "The 'John Player Special' nickname comes from the black and gold color scheme that matches the iconic Lotus Formula 1 cars sponsored by John Player Special cigarettes in the 1970s. These yellow gold Daytonas with black Paul Newman dials are among the rarest and most valuable vintage Rolex chronographs.",
    watchImage: "/watches/rolex-daytona-john-player-special-1681913884253_800x.webp",
    specifications: {
      movement: "Caliber 722, Manual Chronograph",
      case: "18k Yellow Gold",
      diameter: "37mm",
      year: "1960s",
      price: "$400,000+",
      rarity: "Ultra Rare"
    },
    features: [
      "Paul Newman dial",
      "Yellow gold case",
      "Black dial",
      "Manual-wind chronograph",
      "Formula 1 racing heritage"
    ],
    category: "chronograph"
  },

  {
    id: "rolex-daytona-white-gold-blue",
    slug: "rolex-cosmograph-daytona-116509-white-gold",
    brand: "Rolex",
    model: "Cosmograph Daytona",
    reference: "116509",
    subtitle: "White Gold with Blue Dial",
    description: "The Rolex Cosmograph Daytona in white gold with a striking blue dial, representing modern Daytona elegance and sophistication.",
    story: "The reference 116509 represents the modern era of Daytona production, featuring the in-house Caliber 4130 movement. The white gold case paired with the blue dial creates a refined and elegant aesthetic that appeals to collectors seeking a more understated luxury sports watch.",
    watchImage: "/watches/rolex-daytona-white-gold-1681913899487_800x.webp",
    specifications: {
      movement: "Caliber 4130, Automatic Chronograph",
      case: "18k White Gold",
      diameter: "40mm",
      year: "2010s",
      price: "$45,000",
      rarity: "Common Luxury"
    },
    features: [
      "Blue dial",
      "Automatic chronograph",
      "72-hour power reserve",
      "Cerachrom bezel",
      "Superlative Chronometer"
    ],
    category: "chronograph"
  },

  {
    id: "rolex-daytona-abu-dhabi-aet",
    slug: "rolex-cosmograph-daytona-abu-dhabi-aet-remould",
    brand: "Rolex",
    model: "Cosmograph Daytona 'Abu Dhabi'",
    reference: "Custom",
    subtitle: "Sapphire Case by AET Remould",
    description: "Rolex Cosmograph Daytona 'Abu Dhabi' in sapphire made by AET Remould. This extraordinary custom creation features a fully transparent sapphire case, allowing a complete view of the movement.",
    story: "AET Remould is renowned for creating some of the most spectacular custom Rolex watches in the world. This Abu Dhabi edition Daytona features a case entirely crafted from sapphire crystal, one of the hardest materials on Earth. The transparency allows the wearer to appreciate the intricate mechanics of the chronograph movement from every angle.",
    watchImage: "/watches/rolex-daytona-aet-remould-1681913876180_800x.webp",
    specifications: {
      movement: "Caliber 4130, Automatic Chronograph",
      case: "Sapphire Crystal",
      diameter: "40mm",
      year: "2020s",
      price: "$150,000+",
      rarity: "Ultra Rare - Custom Creation"
    },
    features: [
      "Full sapphire crystal case",
      "Transparent case back",
      "Custom AET Remould creation",
      "Automatic chronograph",
      "Unique one-of-a-kind piece"
    ],
    category: "chronograph"
  },

  // Patek Philippe Collection
  {
    id: "patek-perpetual-calendar-5271p-blue-sapphire",
    slug: "patek-philippe-perpetual-calendar-5271p-blue-sapphire",
    brand: "Patek Philippe",
    model: "Perpetual Calendar",
    reference: "5271P",
    subtitle: "Blue Sapphire",
    description: "Of course he also has Patek Philippe watches, and this is one of them: the Perpetual Calendar 5271P 'Blue Sapphire' in platinum. It features a blue dial paired perfectly with the 80 baguette-cut blue sapphires (5.16 cts) across its case and folding clasp.",
    story: "This timepiece was released almost at the end of 2022 together with the red version set with baguette-cut rubies. The 5271P represents the pinnacle of Patek Philippe's perpetual calendar craftsmanship, combining haute horlogerie complications with high jewelry artistry. The 80 baguette-cut sapphires are meticulously set by hand, requiring hundreds of hours of work by master gem-setters.",
    watchImage: "/watches/patek-1674210655318_800x.webp",
    specifications: {
      movement: "Caliber CH 29-535 PS Q, Manual Chronograph Perpetual Calendar",
      case: "Platinum with Baguette Sapphires",
      diameter: "41mm",
      year: "2022",
      price: "$335,500",
      rarity: "Ultra Rare"
    },
    retailPrice: "$335,500",
    features: [
      "80 baguette-cut blue sapphires (5.16 cts)",
      "Perpetual calendar",
      "Chronograph function",
      "Moon phase display",
      "Platinum case"
    ],
    category: "perpetual-calendar"
  },

  {
    id: "patek-calatrava-5326g",
    slug: "patek-philippe-calatrava-5326g-001",
    brand: "Patek Philippe",
    model: "Calatrava",
    reference: "5326G-001",
    subtitle: "Weekly Calendar",
    description: "The Patek Philippe Calatrava 5326G-001 introduces a new complication to the Calatrava line: a weekly calendar display showing the day, date, and week number.",
    story: "Introduced in 2021, the reference 5326G represents a fresh take on the classic Calatrava design. The weekly calendar complication is both practical and elegant, displaying the current week number alongside the traditional day and date. The opaline dial and applied gold hour markers exemplify Patek Philippe's attention to detail.",
    watchImage: "/watches/patek-calatrava-5326g-1681913791211_800x.webp",
    specifications: {
      movement: "Caliber 31-260 PS QL, Automatic",
      case: "White Gold",
      diameter: "41mm",
      year: "2021",
      price: "$45,000",
      rarity: "Common Luxury"
    },
    features: [
      "Weekly calendar",
      "Day and date display",
      "Week number indication",
      "Automatic movement",
      "Calatrava elegance"
    ],
    category: "complications"
  },

  {
    id: "patek-calatrava-6007a",
    slug: "patek-philippe-calatrava-6007a-gray-blue",
    brand: "Patek Philippe",
    model: "Calatrava",
    reference: "6007A",
    subtitle: "Gray-Blue Dial",
    description: "The Patek Philippe Calatrava 6007A with a 'Gray-Blue' dial represents a rare offering from Patek Philippe: a Calatrava in stainless steel.",
    story: "Released in 2020 to commemorate the opening of Patek Philippe's new manufacture building, the 6007A is notable for being one of the few modern Calatrava models offered in stainless steel. The gray-blue dial with carbon pattern and embossed decoration makes this a distinctive and highly collectible Calatrava.",
    watchImage: "/watches/patek-calatrava-6007a-1681913797813_800x.webp",
    specifications: {
      movement: "Caliber 324 S C, Automatic",
      case: "Stainless Steel",
      diameter: "40mm",
      year: "2020",
      price: "$35,000",
      rarity: "Rare"
    },
    features: [
      "Stainless steel case",
      "Gray-blue carbon pattern dial",
      "Date display",
      "Automatic movement",
      "Limited production"
    ],
    category: "time-only"
  },

  {
    id: "patek-nautilus-olive-green",
    slug: "patek-philippe-nautilus-5711-1300a-olive-green",
    brand: "Patek Philippe",
    model: "Nautilus",
    reference: "5711/1300A",
    subtitle: "Sunburst Olive-Green Dial",
    description: "Patek Philippe Nautilus with a 'Sunburst Olive-Green' Dial 5711/1300A - one of the most sought-after modern Patek Philippe watches.",
    story: "The final iteration of the legendary 5711A before its discontinuation, this olive-green dial variant was released in 2021 and immediately became one of the most desirable watches in the world. The sunburst olive-green dial paired with the integrated bracelet creates an iconic silhouette that has defined luxury sports watches for decades.",
    watchImage: "/watches/patek-nautilus-green-dial-diamond-1681913804026_800x.webp",
    specifications: {
      movement: "Caliber 26-330 S C, Automatic",
      case: "Stainless Steel",
      diameter: "40mm",
      year: "2021",
      price: "$250,000+",
      rarity: "Ultra Rare - Final 5711A"
    },
    features: [
      "Sunburst olive-green dial",
      "Integrated bracelet",
      "Date display",
      "Water-resistant to 120m",
      "Final 5711A production"
    ],
    category: "time-only"
  },

  {
    id: "patek-perpetual-calendar-5270p-green",
    slug: "patek-philippe-perpetual-calendar-5270p-green",
    brand: "Patek Philippe",
    model: "Perpetual Calendar Chronograph",
    reference: "5270P",
    subtitle: "Green Dial",
    description: "The Patek Philippe Perpetual Calendar Chronograph 5270P with a striking green dial, combining two of watchmaking's most revered complications.",
    story: "The reference 5270 represents the pinnacle of Patek Philippe's chronograph perpetual calendar watches. This green dial variant showcases Patek Philippe's willingness to experiment with color while maintaining classical proportions and finishing. The combination of perpetual calendar and chronograph functions in a single watch represents the height of horological complexity.",
    watchImage: "/watches/patek-perpetual-calendar-green-1681913811529_800x.webp",
    specifications: {
      movement: "Caliber CH 29-535 PS Q, Manual Chronograph Perpetual Calendar",
      case: "Platinum",
      diameter: "41mm",
      year: "2020s",
      price: "$200,000",
      rarity: "Rare"
    },
    features: [
      "Perpetual calendar",
      "Chronograph function",
      "Moon phase display",
      "Day, date, month display",
      "Leap year indication"
    ],
    category: "perpetual-calendar"
  },

  {
    id: "patek-nautilus-perpetual-calendar-5740",
    slug: "patek-philippe-nautilus-perpetual-calendar-5740",
    brand: "Patek Philippe",
    model: "Nautilus Perpetual Calendar",
    reference: "5740",
    subtitle: "White Gold",
    description: "The Patek Philippe Nautilus Perpetual Calendar 5740 in white gold represents the ultimate expression of the Nautilus collection, combining the iconic sports watch design with one of watchmaking's most sophisticated complications.",
    story: "Introduced in 2015, the reference 5740 was the first Nautilus to feature a perpetual calendar complication. This watch represents the perfect marriage of sporty elegance and haute horlogerie, maintaining the Nautilus's distinctive porthole-inspired case while incorporating a complex perpetual calendar mechanism.",
    watchImage: "/watches/patek-philippe-nautilus-perpetual-calendar-1681913819958_800x.webp",
    specifications: {
      movement: "Caliber 240 Q, Ultra-Thin Perpetual Calendar",
      case: "White Gold",
      diameter: "40mm",
      year: "2015",
      price: "$150,000",
      rarity: "Rare"
    },
    features: [
      "Perpetual calendar",
      "Moon phase display",
      "Day, date, month display",
      "Ultra-thin automatic movement",
      "Integrated bracelet"
    ],
    category: "perpetual-calendar"
  },

  {
    id: "patek-world-time-manama",
    slug: "patek-philippe-world-time-5230g-011-manama",
    brand: "Patek Philippe",
    model: "World Time",
    reference: "5230G-011",
    subtitle: "Manama Edition",
    description: "The Patek Philippe World Time 5230G-011 Manama in White Gold - a special edition featuring Manama as one of the 24 time zone cities on the dial.",
    story: "This special edition World Time watch honors Manama, the capital of Bahrain, by featuring it as one of the 24 cities representing the world's time zones. The World Time complication, invented by Louis Cottier and perfected by Patek Philippe, allows the wearer to read the time in all 24 time zones simultaneously with a simple glance at the dial.",
    watchImage: "/watches/patek-world-time-manama-1681913828669_800x.webp",
    specifications: {
      movement: "Caliber 240 HU, Automatic World Time",
      case: "White Gold",
      diameter: "38.5mm",
      year: "2020s",
      price: "$100,000+",
      rarity: "Rare - Special Edition"
    },
    features: [
      "World Time complication",
      "24 time zones display",
      "Manama special edition",
      "Guilloche center dial",
      "Day/night indication"
    ],
    category: "complications"
  },

  // Richard Mille Collection
  {
    id: "richard-mille-rm26-02-evil-eye",
    slug: "richard-mille-rm-26-02-tourbillon-evil-eye",
    brand: "Richard Mille",
    model: "RM 26-02 Tourbillon",
    reference: "RM 26-02",
    subtitle: "Evil Eye",
    description: "One model that I want to feature is the Richard Mille RM26-02 Tourbillon Evil Eye, the timepiece that also has been spotted on Ed Sheeran's wrist. This watch is inspired by the 'Eye of Sauron' from the movie trilogy Lord Of The Rings and is limited to 25 pieces worldwide.",
    story: "The RM 26-02 Evil Eye is one of Richard Mille's most artistic and collectible creations. The dial features a hand-painted evil eye motif inspired by the Eye of Sauron from Lord of the Rings. Each piece is unique, with the eye hand-painted by a master miniaturist. The combination of haute horlogerie and artistic craftsmanship makes this one of the most sought-after Richard Mille models.",
    watchImage: "/watches/rm26-02-1674211731885_800x.webp",
    limitedEdition: {
      pieces: 25,
      note: "Limited to 25 pieces worldwide"
    },
    specifications: {
      movement: "Caliber RM26-02, Manual Tourbillon",
      case: "White Gold with Gemstones",
      diameter: "38mm × 47.77mm",
      year: "2018",
      price: "$600,000 - $900,000",
      rarity: "Ultra Rare - Limited Edition"
    },
    retailPrice: "$600,000",
    features: [
      "Hand-painted Evil Eye dial",
      "Tourbillon movement",
      "Inspired by Lord of the Rings",
      "Limited to 25 pieces",
      "Unique artistic creation"
    ],
    category: "tourbillon"
  },

  {
    id: "richard-mille-rm68-01-cyril-kongo",
    slug: "richard-mille-rm-68-01-tourbillon-cyril-kongo",
    brand: "Richard Mille",
    model: "RM 68-01 Tourbillon",
    reference: "RM 68-01",
    subtitle: "Cyril Kongo",
    description: "And this is one of my favorite Richard Mille watches seen on his wrist, as part of the fun and playful rainbow watches on the market. Released in 2016, Richard Mille released a rainbow Richard Mille watch in collaboration with the graffiti/street artist Cyril Kongo.",
    story: "Released in 2016, Richard Mille released a rainbow Richard Mille watch in collaboration with the graffiti/street artist Cyril Kongo. As a result, the colors are everywhere. However, the craftsmanship is stunning! As expected from a talented artist that is famous for his partnership with French fashion behemoth Hermes. For the RM 68-01 Tourbillon Cyril Kongo, the artist created a new technology that allowed him to paint his graffiti on the watch. The practice, known as micro-painting, allowed the Kongo to apply intricate flourishes to the microscopic canvas.",
    watchImage: "/watches/rm-cyril-kongo-1674216610713_800x.webp",
    limitedEdition: {
      pieces: 30,
      note: "Limited to 30 unique hand-painted pieces worldwide"
    },
    specifications: {
      movement: "Caliber RM68-01, Manual Tourbillon",
      case: "Titanium",
      diameter: "38.7mm × 47.25mm",
      year: "2016",
      price: "$685,000",
      rarity: "Ultra Rare - Artist Collaboration"
    },
    retailPrice: "$685,000",
    features: [
      "Hand-painted by Cyril Kongo",
      "Micro-painting technique",
      "Tourbillon movement",
      "Limited to 30 pieces",
      "Collaboration with street artist"
    ],
    category: "tourbillon"
  },

  {
    id: "richard-mille-rm67-02-alexis-pinturault",
    slug: "richard-mille-rm-67-02-alexis-pinturault",
    brand: "Richard Mille",
    model: "RM 67-02 Automatic",
    reference: "RM 67-02",
    subtitle: "Alexis Pinturault Edition",
    description: "The Richard Mille RM 67-02 Automatic Alexis Pinturault Edition, designed for the French alpine ski racer and built to withstand the extreme conditions of professional skiing.",
    story: "The RM 67-02 was specifically designed for French alpine skiing champion Alexis Pinturault. This ultra-light automatic watch can withstand accelerations of over 5,000 g's, making it one of the most shock-resistant watches ever created. The skeletonized movement and colorful design reflect both technical prowess and sporting spirit.",
    watchImage: "/watches/rm67-02-alexis-pinturault-1681913841692_800x.webp",
    specifications: {
      movement: "Caliber CRMA7, Automatic",
      case: "Carbon TPT and Quartz TPT",
      diameter: "38.7mm × 47.25mm",
      year: "2018",
      price: "$150,000",
      rarity: "Rare - Athlete Edition"
    },
    features: [
      "Ultra-light construction",
      "Shock-resistant to 5,000 g's",
      "Automatic movement",
      "Carbon TPT case",
      "Designed for alpine skiing"
    ],
    category: "time-only"
  },

  // F.P. Journe Collection
  {
    id: "fp-journe-tourbillon-souverain-red",
    slug: "fp-journe-tourbillon-souverain-red-dial",
    brand: "F.P. Journe",
    model: "Tourbillon Souverain",
    reference: "Tourbillon Souverain",
    subtitle: "Red Dial",
    description: "The F.P. Journe Tourbillon Souverain with a rare red dial, representing one of the most coveted configurations from the independent watchmaker.",
    story: "F.P. Journe is renowned for creating some of the finest mechanical watches in the world. The Tourbillon Souverain with red dial is an extremely rare variant that showcases François-Paul Journe's mastery of traditional watchmaking. The constant-force remontoire ensures perfect amplitude delivery to the escapement, resulting in exceptional chronometric performance.",
    watchImage: "/watches/fp-journe-1681913766335_800x.webp",
    specifications: {
      movement: "Caliber 1403, Manual Tourbillon with Remontoire",
      case: "Platinum",
      diameter: "40mm",
      year: "2010s",
      price: "$200,000+",
      rarity: "Ultra Rare"
    },
    features: [
      "Tourbillon with constant-force remontoire",
      "Red dial",
      "Dead-beat seconds",
      "Power reserve indicator",
      "Independent watchmaker"
    ],
    category: "tourbillon"
  },

  {
    id: "fp-journe-resonance-platinum-grey",
    slug: "fp-journe-chronometre-a-resonance-platinum-grey",
    brand: "F.P. Journe",
    model: "Chronomètre à Résonance",
    reference: "Résonance",
    subtitle: "Platinum with Grey Dial",
    description: "The F.P. Journe Chronomètre à Résonance in Platinum With a Grey Dial - one of the most technically sophisticated watches ever created, utilizing the principle of resonance.",
    story: "The Chronomètre à Résonance is F.P. Journe's masterpiece, featuring two balance wheels that synchronize through resonance, a phenomenon first observed by Dutch scientist Christiaan Huygens in the 17th century. This synchronization improves chronometric performance and represents one of the most complex achievements in modern watchmaking.",
    watchImage: "/watches/fp-journe-resonance-1681913779906_800x.webp",
    specifications: {
      movement: "Caliber 1499.3, Manual with Resonance",
      case: "Platinum",
      diameter: "40mm",
      year: "2010s",
      price: "$150,000+",
      rarity: "Rare"
    },
    features: [
      "Resonance phenomenon",
      "Two synchronized balance wheels",
      "Differential mechanism",
      "Digital seconds display",
      "Independent watchmaker"
    ],
    category: "complications"
  },

  // Artisans de Genève
  {
    id: "artisans-de-geneve-la-montoya",
    slug: "artisans-de-geneve-la-montoya-platinum-challenge",
    brand: "Artisans de Genève",
    model: "La Montoya",
    reference: "Custom",
    subtitle: "Platinum Challenge",
    description: "Artisans De Geneve La Montoya Platinum Challenge - a custom-created masterpiece based on the Rolex Daytona, transformed into a unique work of art.",
    story: "Artisans de Genève is renowned for creating some of the most spectacular custom Rolex watches in the world. La Montoya Platinum Challenge represents the pinnacle of their craft, featuring extensive customization including skeletonization, engraving, and precious metal work. Each piece is a unique creation that transforms a standard Rolex Daytona into a haute horlogerie masterpiece.",
    watchImage: "/watches/artisans-de-geneve-la-montoya-1681913755711_800x.webp",
    specifications: {
      movement: "Modified Rolex Caliber 4130",
      case: "Platinum",
      diameter: "40mm",
      year: "2020s",
      price: "$100,000+",
      rarity: "Ultra Rare - Custom Creation"
    },
    features: [
      "Fully customized Rolex Daytona",
      "Skeletonized movement",
      "Hand engraving",
      "Platinum case",
      "Unique one-of-a-kind piece"
    ],
    category: "chronograph"
  },
];

// Helper functions
export function getWatchBySlug(slug: string): Watch | undefined {
  return completeCollection.find((watch) => watch.slug === slug);
}

export function getWatchesByBrand(brand: string): Watch[] {
  return completeCollection.filter((watch) => watch.brand === brand);
}

export function getWatchesByCategory(category: string): Watch[] {
  if (category === "all") return completeCollection;
  return completeCollection.filter((watch) => watch.category === category);
}

// Export unique brands
export const brands = Array.from(
  new Set(completeCollection.map((watch) => watch.brand))
).sort();

// Export categories with labels
export const categories = [
  { value: "all", label: "All Watches" },
  { value: "perpetual-calendar", label: "Perpetual Calendar" },
  { value: "tourbillon", label: "Tourbillon" },
  { value: "chronograph", label: "Chronograph" },
  { value: "complications", label: "Complications" },
  { value: "time-only", label: "Time Only" },
];
