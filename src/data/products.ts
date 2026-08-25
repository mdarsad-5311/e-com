export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: "Smartphone" | "Monitor" | "Shirt" | "Home" | "Sparkles" | "Headphones" | "Watch";
  description: string;
  itemCount: number;
  image?: string;
}

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  category: string;
  categoryName: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: "BESTSELLER" | "HOT" | "NEW" | "SALE" | "";
  discountPercentage?: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isDealOfTheDay?: boolean;
  deliveryInfo?: string;
  isAssured?: boolean;
  image: string;
  galleryImages?: string[];
  description: string;
  specifications: string[];
  stock: number;
  brand?: string;
  colors?: string[];
  soldCount?: number;
  reviews?: Review[];
}

export const categories: Category[] = [
  {
    id: "mobiles",
    name: "Mobiles",
    slug: "mobiles",
    icon: "Smartphone",
    description: "Flagship smartphones, 5G devices, and mobile gear.",
    itemCount: 32,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "electronics",
    name: "Electronics",
    slug: "electronics",
    icon: "Monitor",
    description: "Curved ultrawide monitors, laptops, audio gear, and cutting-edge tech.",
    itemCount: 45,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "fashion",
    name: "Fashion",
    slug: "fashion",
    icon: "Shirt",
    description: "Trending streetwear, sneakers, and designer apparel.",
    itemCount: 54,
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "home",
    name: "Home",
    slug: "home-living",
    icon: "Home",
    description: "Modern home appliances, smart oral care, and decor.",
    itemCount: 28,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "beauty",
    name: "Beauty",
    slug: "beauty",
    icon: "Sparkles",
    description: "Personal care, grooming essentials, and wellness products.",
    itemCount: 22,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
  },
];

export const products: Product[] = [
  // --- 1. Sony WH-1000XM5 (Matching Reference Screenshot) ---
  {
    id: "sony-wh-1000xm5",
    title: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    slug: "sony-wh-1000xm5-headphones",
    category: "electronics",
    categoryName: "Electronics",
    price: 298.00,
    originalPrice: 399.99,
    discountPercentage: 25,
    rating: 4.5,
    reviewsCount: 1204,
    badge: "BESTSELLER",
    isFeatured: true,
    isBestSeller: true,
    isAssured: true,
    stock: 24,
    brand: "Sony",
    colors: ["Black", "Silver"],
    soldCount: 1204,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Industry-leading noise canceling with two processors and 8 microphones. Magnificent Sound, engineered to perfection with the new Integrated Processor V1.",
    specifications: [
      "Auto NC Optimizer automatically optimizes noise canceling based on wearing conditions",
      "Up to 30-hour battery life with quick charging (3 min charge for 3 hours of playback)",
      "Ultra-comfortable, lightweight design with soft fit leather",
      "Crystal clear hands-free calling with 4 beamforming microphones"
    ],
    reviews: []
  },
  // --- 2. JBL Charge 5 (Matching Reference Screenshot) ---
  {
    id: "jbl-charge-5",
    title: "JBL Charge 5 Portable Waterproof Bluetooth Speaker",
    slug: "jbl-charge-5-speaker",
    category: "electronics",
    categoryName: "Electronics",
    price: 139.95,
    originalPrice: 159.95,
    discountPercentage: 10,
    rating: 5.0,
    reviewsCount: 3850,
    badge: "BESTSELLER",
    deliveryInfo: "Get it by Tomorrow",
    isFeatured: true,
    isBestSeller: true,
    stock: 35,
    brand: "JBL",
    colors: ["Teal Blue", "Black", "Red", "Squad"],
    soldCount: 3850,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Take the amazing power of JBL Pro Sound with you. The JBL Charge 5 has an optimized long excursion driver, a separate tweeter, and dual JBL bass radiators.",
    specifications: [
      "JBL Pro Sound with an optimized long excursion driver and separate tweeter",
      "Long-lasting battery delivers up to 20 hours of playtime",
      "IP67 waterproof and dustproof rating for pool or park",
      "PartyBoost feature lets you pair two JBL PartyBoost-compatible speakers together"
    ],
    reviews: []
  },
  // --- 3. Keychron Q1 Pro (Matching Reference Screenshot) ---
  {
    id: "keychron-q1-pro",
    title: "Keychron Q1 Pro Custom Wireless Mechanical Keyboard",
    slug: "keychron-q1-pro-keyboard",
    category: "electronics",
    categoryName: "Electronics",
    price: 199.00,
    rating: 4.0,
    reviewsCount: 112,
    badge: "NEW",
    isAssured: true,
    isFeatured: true,
    isBestSeller: false,
    stock: 18,
    brand: "Keychron",
    colors: ["Carbon Black", "Silver Grey", "Shell White"],
    soldCount: 112,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80"
    ],
    description: "A full metal QMK/VIA wireless custom mechanical keyboard equipped with Bluetooth 5.1, double-gasket design, and hot-swappable switches.",
    specifications: [
      "Full CNC Machined Aluminum 6063 Body",
      "QMK & VIA Full Key Remapping Support",
      "Double-Gasket Design for Acoustic Performance",
      "K Pro Mechanical Switches (Hot-Swappable)"
    ],
    reviews: []
  },
  // --- 4. Apple AirPods Pro (2nd Gen) (Matching Reference Screenshot) ---
  {
    id: "apple-airpods-pro-2",
    title: "Apple AirPods Pro (2nd Gen) with MagSafe Case",
    slug: "apple-airpods-pro-2nd-gen",
    category: "electronics",
    categoryName: "Electronics",
    price: 189.00,
    originalPrice: 249.00,
    discountPercentage: 40,
    rating: 5.0,
    reviewsCount: 15892,
    badge: "HOT",
    deliveryInfo: "Get it by Thursday",
    isFeatured: true,
    isBestSeller: true,
    stock: 42,
    brand: "Apple",
    colors: ["White"],
    soldCount: 15892,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80"
    ],
    description: "AirPods Pro feature up to 2x more Active Noise Cancellation, plus Adaptive Audio and Transparency mode.",
    specifications: [
      "H2 Apple Silicon Chip with Computational Audio",
      "Adaptive Audio dynamically blends Transparency mode and ANC",
      "MagSafe Charging Case (USB-C) with speaker and lanyard loop",
      "Up to 6 hours of listening time with ANC enabled"
    ],
    reviews: []
  },
  // Aura Pro Max Headphones
  {
    id: "aura-pro-max-headphones",
    title: "Aura Pro Max ANC Wireless Headphones - Matte Black",
    slug: "aura-pro-max-headphones",
    category: "electronics",
    categoryName: "Electronics",
    price: 249.99,
    originalPrice: 299.99,
    discountPercentage: 16,
    rating: 4.9,
    reviewsCount: 4821,
    badge: "BESTSELLER",
    isFeatured: true,
    isBestSeller: true,
    stock: 19,
    brand: "AURA AUDIO",
    colors: ["Matte Black", "Silver White", "Midnight Navy"],
    soldCount: 4821,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Industry-leading noise canceling with custom 40mm drivers and 30-hour battery life.",
    specifications: [
      "Industry-Leading ANC: Block out distractions with advanced active noise cancellation that adapts to your environment.",
      "Immersive Audio: Custom 40mm drivers deliver high-fidelity sound with deep bass and crisp highs.",
      "30-Hour Battery Life: Enjoy uninterrupted listening all day, with a quick 10-minute charge providing 5 hours of playback.",
      "Multipoint Connectivity: Seamlessly switch between two Bluetooth devices without reconnecting.",
      "All-Day Comfort: Memory foam earcups and a lightweight headband design ensure maximum comfort during extended wear."
    ],
    reviews: []
  },
  // Alias for prod-1
  {
    id: "prod-1",
    title: "Aura Pro Max ANC Wireless Headphones - Matte Black",
    slug: "aura-pro-max-headphones",
    category: "electronics",
    categoryName: "Electronics",
    price: 249.99,
    originalPrice: 299.99,
    discountPercentage: 16,
    rating: 4.9,
    reviewsCount: 4821,
    badge: "BESTSELLER",
    isFeatured: true,
    isBestSeller: true,
    stock: 19,
    brand: "AURA AUDIO",
    colors: ["Matte Black", "Silver White", "Midnight Navy"],
    soldCount: 4821,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Industry-leading noise canceling with custom 40mm drivers and 30-hour battery life.",
    specifications: [
      "Industry-Leading ANC: Block out distractions with advanced active noise cancellation that adapts to your environment.",
      "Immersive Audio: Custom 40mm drivers deliver high-fidelity sound with deep bass and crisp highs.",
      "30-Hour Battery Life: Enjoy uninterrupted listening all day, with a quick 10-minute charge providing 5 hours of playback.",
      "Multipoint Connectivity: Seamlessly switch between two Bluetooth devices without reconnecting.",
      "All-Day Comfort: Memory foam earcups and a lightweight headband design ensure maximum comfort during extended wear."
    ],
    reviews: []
  },
  {
    id: "deal-2",
    title: "Samsung Galaxy Watch 6 Classic -...",
    slug: "samsung-galaxy-watch-6-classic",
    category: "accessories",
    categoryName: "Accessories",
    price: 1199,
    originalPrice: 1499,
    discountPercentage: 20,
    rating: 4.8,
    reviewsCount: 890,
    badge: "SALE",
    isDealOfTheDay: true,
    isFeatured: false,
    isBestSeller: true,
    stock: 12,
    brand: "Samsung",
    colors: ["Black", "Silver"],
    soldCount: 1950,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Timeless stainless steel style featuring a rotating bezel, advanced sleep coaching, ECG tracking, and personalized HR zones.",
    specifications: [
      "Signature Rotating Bezel & Sapphire Crystal Glass",
      "Advanced Sleep Coaching with Sleep Zone Analysis",
      "BIA Body Composition Sensor",
      "Up to 40 hours battery life"
    ],
    reviews: []
  },
  {
    id: "deal-3",
    title: "De'Longhi Dedica Deluxe Espresso...",
    slug: "delonghi-dedica-espresso-machine",
    category: "home",
    categoryName: "Home",
    price: 799,
    originalPrice: 1199,
    discountPercentage: 30,
    rating: 4.8,
    reviewsCount: 650,
    badge: "SALE",
    isDealOfTheDay: true,
    isFeatured: false,
    isBestSeller: false,
    stock: 7,
    brand: "De'Longhi",
    colors: ["Stainless Steel", "Matte Black"],
    soldCount: 820,
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Slim 15-bar pump espresso and cappuccino machine crafted for barista-grade espresso, lattes, and cappuccinos in compact kitchens.",
    specifications: [
      "15-bar professional pressure",
      "Adjustable milk frother for micro-foam texture",
      "Compact 6-inch slim stainless steel silhouette",
      "Removable 35oz water reservoir"
    ],
    reviews: []
  },

  // --- Featured for You (Matching Attachment 2x2 Grid) ---
  {
    id: "feat-1",
    title: "LG 34\" Curved UltraWide QHD Monitor",
    slug: "lg-34-curved-ultrawide-qhd-monitor",
    category: "electronics",
    categoryName: "Electronics",
    price: 1299,
    originalPrice: 1699,
    discountPercentage: 24,
    rating: 5.0,
    reviewsCount: 128,
    badge: "BESTSELLER",
    isFeatured: true,
    isBestSeller: true,
    stock: 14,
    brand: "LG",
    colors: ["Black / Silver"],
    soldCount: 128,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Immersive 34-inch 21:9 curved UltraWide QHD (3440 x 1440) display with sRGB 99% color gamut and HDR10 support for seamless multitasking and gaming.",
    specifications: [
      "34\" Curved UltraWide QHD (3440 x 1440)",
      "sRGB 99% Color Gamut with HDR10",
      "USB Type-C connectivity with 65W Power Delivery",
      "Ergonomic Tilt & Height Adjustable Stand"
    ],
    reviews: []
  },
  {
    id: "feat-2",
    title: "Philips Sonicare ProtectiveClean 4300",
    slug: "philips-sonicare-protectiveclean-4300",
    category: "home",
    categoryName: "Home",
    price: 249,
    originalPrice: 349,
    discountPercentage: 29,
    rating: 5.0,
    reviewsCount: 3402,
    badge: "BESTSELLER",
    isFeatured: true,
    isBestSeller: true,
    stock: 25,
    brand: "Philips Sonicare",
    colors: ["Pastel Pink", "White", "Black"],
    soldCount: 3402,
    image: "https://images.unsplash.com/photo-1559591937-e1032d8471b4?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1559591937-e1032d8471b4?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Gentle yet effective rechargeable sonic toothbrush that removes up to 7x more plaque than a manual toothbrush with pressure sensor protection.",
    specifications: [
      "Pressure sensor pulses when brushing too hard",
      "BrushSync technology alerts when to replace brush head",
      "Quadpacer and Smartimer encourage 2-minute brushing",
      "Long-lasting 14-day battery life on a single charge"
    ],
    reviews: []
  },
  {
    id: "feat-3",
    title: "Nike Air Force 1 '07 - Men's Classic Sneakers",
    slug: "nike-air-force-1-07-classic-sneakers",
    category: "fashion",
    categoryName: "Fashion",
    price: 499,
    originalPrice: 599,
    discountPercentage: 17,
    rating: 5.0,
    reviewsCount: 845,
    badge: "BESTSELLER",
    isFeatured: true,
    isBestSeller: true,
    stock: 18,
    brand: "Nike",
    colors: ["Triple White"],
    soldCount: 845,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
    ],
    description: "The radiance lives on in the Nike Air Force 1 '07, the b-ball icon that puts a fresh spin on what you know best: crisp leather, bold details and classic comfort.",
    specifications: [
      "Stitched crisp real leather overlays for durability",
      "Nike Air cushioning for lightweight, all-day comfort",
      "Padded, low-cut collar looks sleek and feels great",
      "Non-marking rubber outsole with heritage pivot circles"
    ],
    reviews: []
  },
  {
    id: "feat-4",
    title: "Apple MacBook Air M2 Chip 8GB RAM 256GB...",
    slug: "apple-macbook-air-m2-chip",
    category: "electronics",
    categoryName: "Electronics",
    price: 4299,
    originalPrice: 4799,
    discountPercentage: 10,
    rating: 5.0,
    reviewsCount: 1204,
    badge: "HOT",
    isFeatured: true,
    isBestSeller: true,
    stock: 10,
    brand: "Apple",
    colors: ["Space Gray", "Midnight", "Silver", "Starlight"],
    soldCount: 1204,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Strikingly thin design with lightning-fast M2 performance, brilliant 13.6-inch Liquid Retina display, 1080p FaceTime HD camera, and up to 18 hours of battery life.",
    specifications: [
      "Apple M2 chip with 8-core CPU and up to 10-core GPU",
      "13.6-inch Liquid Retina display with 500 nits brightness",
      "Silent fanless design with up to 18 hours battery life",
      "MagSafe 3 charging port with two Thunderbolt ports"
    ],
    reviews: []
  },
  {
    id: "prod-2",
    title: "Chronos Minimalist SmartWatch Pro",
    slug: "chronos-smartwatch-pro",
    category: "accessories",
    categoryName: "Accessories",
    price: 189.00,
    originalPrice: 229.00,
    rating: 4.8,
    reviewsCount: 95,
    badge: "HOT",
    isFeatured: true,
    isBestSeller: true,
    stock: 9,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Sleek stainless steel smartwatch featuring AMOLED display, heart rate monitor, sleep tracking, and 7-day battery life.",
    specifications: [
      "1.4-inch High-Res AMOLED Display",
      "50m Waterproof (5 ATM)",
      "SpO2 & Continuous Heart Rate Tracking",
      "iOS & Android Seamless Sync",
      "7 Days Typical Usage Battery"
    ],
    reviews: [
      {
        id: "rev-3",
        author: "Marcus Chen",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
        rating: 5,
        date: "July 28, 2026",
        title: "Best smartwatch display in direct sunlight!",
        comment: "The AMOLED screen is crisp and vivid even in bright sunlight. Health metrics line up accurately with my chest strap monitor.",
        verified: true
      }
    ]
  },
  {
    id: "prod-3",
    title: "ErgoComfort Oak Desk Chair",
    slug: "ergocomfort-desk-chair",
    category: "home-living",
    categoryName: "Home & Living",
    price: 320.00,
    originalPrice: 380.00,
    rating: 4.7,
    reviewsCount: 64,
    badge: "NEW",
    isFeatured: true,
    isBestSeller: false,
    stock: 5,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Ergonomically engineered for posture alignment, constructed with solid oak legs and breathable premium linen upholstery.",
    specifications: [
      "Ergonomic Lumbar Cushioning",
      "Kiln-Dried Solid Oak Frame",
      "High-Density Molded Foam",
      "Heavy-Duty Pneumatic Lift"
    ],
    reviews: [
      {
        id: "rev-4",
        author: "Emily Taylor",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
        rating: 5,
        date: "August 10, 2026",
        title: "Saved my lower back during long workdays",
        comment: "Assembly took less than 15 minutes. The lumbar support is firm yet comfortable, and the oak finish matches my Scandinavian desk setup perfectly.",
        verified: true
      }
    ]
  },
  {
    id: "prod-4",
    title: "Urban Minimalist Waterproof Backpack",
    slug: "urban-waterproof-backpack",
    category: "fashion",
    categoryName: "Fashion & Apparel",
    price: 89.95,
    originalPrice: 119.95,
    rating: 4.8,
    reviewsCount: 210,
    badge: "SALE",
    isFeatured: false,
    isBestSeller: true,
    stock: 22,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80"
    ],
    description: "All-weather urban backpack crafted from water-resistant ballistic nylon with dedicated 16-inch laptop compartment.",
    specifications: [
      "Padded 16-inch Laptop Sleeve",
      "TPU Water-resistant Outer Coating",
      "Hidden Anti-Theft Back Pocket",
      "25 Liter Total Capacity"
    ],
    reviews: [
      {
        id: "rev-5",
        author: "David Miller",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        rating: 5,
        date: "August 18, 2026",
        title: "Durable and completely waterproof",
        comment: "Got caught in a heavy rainstorm with my MacBook inside and not a single drop got through. Excellent urban backpack.",
        verified: true
      }
    ]
  },
  {
    id: "prod-5",
    title: "Lumino Smart RGB Ambient Desk Lamp",
    slug: "lumino-smart-rgb-lamp",
    category: "home-living",
    categoryName: "Home & Living",
    price: 64.50,
    originalPrice: 79.99,
    rating: 4.6,
    reviewsCount: 42,
    badge: "",
    isFeatured: true,
    isBestSeller: false,
    stock: 11,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Customizable ambient lighting with 16 million colors, touch brightness control, and seamless voice assistant integration.",
    specifications: [
      "16 Million RGB Colors + Warm White",
      "Alexa & Google Assistant Voice Sync",
      "Stepless Touch Dimming",
      "Built-in Wireless Fast Charger Base"
    ],
    reviews: []
  },
  {
    id: "prod-6",
    title: "Vortex SoundLink Portable Speaker",
    slug: "vortex-soundlink-speaker",
    category: "electronics",
    categoryName: "Electronics",
    price: 119.99,
    originalPrice: 149.99,
    rating: 4.9,
    reviewsCount: 312,
    badge: "BESTSELLER",
    isFeatured: true,
    isBestSeller: true,
    stock: 18,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80"
    ],
    description: "360-degree room-filling audio with deep bass, IPX7 waterproof rating, and dual pairing mode for stereo surround sound.",
    specifications: [
      "IPX7 Fully Submersible Waterproof",
      "20-Hour Playtime Battery",
      "Dual Passive Radiators for Deep Bass",
      "Built-in HD Noise-canceling Microphone"
    ],
    reviews: []
  },
  {
    id: "prod-7",
    title: "Luxe Genuine Leather Bifold Wallet",
    slug: "luxe-leather-bifold-wallet",
    category: "accessories",
    categoryName: "Accessories",
    price: 49.00,
    originalPrice: 65.00,
    rating: 4.7,
    reviewsCount: 88,
    badge: "",
    isFeatured: false,
    isBestSeller: false,
    stock: 15,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Handcrafted full-grain leather wallet featuring RFID blocking protection, slim profile, and 8 card slots.",
    specifications: [
      "Full-Grain Italian Cowhide Leather",
      "Certified RFID Blocking Shielding Layer",
      "Ultra-Slim Bifold Silhouette",
      "8 Dedicated Card Slots + Quick-ID Window"
    ],
    reviews: []
  },
  {
    id: "prod-8",
    title: "Nordic Ceramic Coffee Pour-Over Set",
    slug: "nordic-ceramic-coffee-set",
    category: "home-living",
    categoryName: "Home & Living",
    price: 55.00,
    originalPrice: 70.00,
    rating: 4.8,
    reviewsCount: 53,
    badge: "NEW",
    isFeatured: true,
    isBestSeller: false,
    stock: 8,
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Artisanal matte ceramic coffee dripper set designed for optimal thermal retention and precise extraction.",
    specifications: [
      "Matte Finish Thermal Ceramic Dripper",
      "600ml Borosilicate Glass Carafe",
      "Reusable Fine Stainless Steel Mesh Filter",
      "Heat-Resistant Silicone Collar Grip"
    ],
    reviews: []
  },
  {
    id: "prod-9",
    title: "Pulse ANC True Wireless Earbuds",
    slug: "pulse-anc-earbuds",
    category: "electronics",
    categoryName: "Electronics",
    price: 129.00,
    originalPrice: 159.00,
    rating: 4.8,
    reviewsCount: 276,
    badge: "HOT",
    isFeatured: true,
    isBestSeller: true,
    stock: 27,
    brand: "Pulse",
    colors: ["Black", "White", "Navy"],
    soldCount: 2210,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Compact earbuds with adaptive ANC, spatial audio, and 32-hour total battery with the charging case.",
    specifications: [
      "Adaptive Active Noise Canceling",
      "IPX5 Sweat & Splash Resistance",
      "Wireless Charging Case",
      "Transparency Mode"
    ],
    reviews: []
  },
  {
    id: "prod-10",
    title: "Aero Mechanical Keyboard 75%",
    slug: "aero-mechanical-keyboard",
    category: "electronics",
    categoryName: "Electronics",
    price: 159.00,
    originalPrice: 189.00,
    rating: 4.7,
    reviewsCount: 141,
    badge: "NEW",
    isFeatured: true,
    isBestSeller: false,
    stock: 12,
    brand: "Aero",
    colors: ["Graphite", "Cream"],
    soldCount: 640,
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Hot-swappable 75% keyboard with gasket mount, RGB, and buttery linear switches for long coding sessions.",
    specifications: [
      "Hot-swappable Gasket Mount",
      "South-facing RGB",
      "USB-C Detachable Cable",
      "PBT Doubleshot Keycaps"
    ],
    reviews: []
  },
  {
    id: "prod-11",
    title: "Stride Knit Performance Sneakers",
    slug: "stride-knit-sneakers",
    category: "fashion",
    categoryName: "Fashion & Apparel",
    price: 110.00,
    originalPrice: 140.00,
    rating: 4.6,
    reviewsCount: 198,
    badge: "SALE",
    isFeatured: true,
    isBestSeller: true,
    stock: 31,
    brand: "Stride",
    colors: ["Cloud", "Ink", "Olive"],
    soldCount: 980,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Breathable knit sneakers with responsive foam midsoles, built for all-day city walking and light training.",
    specifications: [
      "Breathable Knit Upper",
      "Responsive Foam Midsole",
      "Gum Rubber Outsole",
      "Removable Ortholite Insole"
    ],
    reviews: []
  },
  {
    id: "prod-12",
    title: "Merino Everyday Crew Neck Tee",
    slug: "merino-crew-tee",
    category: "fashion",
    categoryName: "Fashion & Apparel",
    price: 48.00,
    originalPrice: 62.00,
    rating: 4.8,
    reviewsCount: 167,
    badge: "",
    isFeatured: false,
    isBestSeller: false,
    stock: 40,
    brand: "Northline",
    colors: ["Ivory", "Charcoal", "Sage"],
    soldCount: 740,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Temperature-regulating merino tee that stays odor-free on travel days and looks sharp under a jacket.",
    specifications: [
      "18.5 Micron Merino Wool",
      "Anti-odor Natural Fibers",
      "Tailored Regular Fit",
      "Machine Wash Cold"
    ],
    reviews: []
  },
  {
    id: "prod-13",
    title: "Nimbus Memory Foam Pillow Pair",
    slug: "nimbus-pillow-pair",
    category: "home-living",
    categoryName: "Home & Living",
    price: 79.00,
    originalPrice: 99.00,
    rating: 4.7,
    reviewsCount: 88,
    badge: "BESTSELLER",
    isFeatured: true,
    isBestSeller: true,
    stock: 16,
    brand: "Nimbus",
    colors: ["White"],
    soldCount: 1320,
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Hotel-grade cooling pillows with shredded memory foam you can adjust for side, back, or stomach sleep.",
    specifications: [
      "Adjustable Fill Volume",
      "Cooling Bamboo Cover",
      "Hypoallergenic Foam",
      "Sold as a Pair"
    ],
    reviews: []
  },
  {
    id: "prod-14",
    title: "Forge Cast-Iron Skillet 12\"",
    slug: "forge-cast-iron-skillet",
    category: "home-living",
    categoryName: "Home & Living",
    price: 72.00,
    originalPrice: 88.00,
    rating: 4.9,
    reviewsCount: 204,
    badge: "",
    isFeatured: false,
    isBestSeller: true,
    stock: 19,
    brand: "Forge",
    colors: ["Black"],
    soldCount: 1560,
    image: "https://images.unsplash.com/photo-1556910103-1c0279aa3b47?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1556910103-1c0279aa3b47?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Pre-seasoned 12-inch skillet that goes from stovetop to oven, built for searing steaks and baking cornbread.",
    specifications: [
      "Pre-seasoned Cast Iron",
      "Oven Safe to 500°F",
      "Helper Handle",
      "Made for Gas, Induction & Grill"
    ],
    reviews: []
  },
  {
    id: "prod-15",
    title: "Horizon Polarized Aviator Sunglasses",
    slug: "horizon-aviator-sunglasses",
    category: "accessories",
    categoryName: "Accessories",
    price: 95.00,
    originalPrice: 125.00,
    rating: 4.6,
    reviewsCount: 73,
    badge: "SALE",
    isFeatured: true,
    isBestSeller: false,
    stock: 21,
    brand: "Horizon",
    colors: ["Gold", "Matte Black"],
    soldCount: 410,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Lightweight titanium aviators with polarized lenses and UV400 protection for bright city and coastal days.",
    specifications: [
      "Polarized UV400 Lenses",
      "Titanium Frame",
      "Spring Hinges",
      "Includes Hard Case"
    ],
    reviews: []
  },
  {
    id: "prod-16",
    title: "Volt MagSafe 3-in-1 Charging Stand",
    slug: "volt-magsafe-stand",
    category: "accessories",
    categoryName: "Accessories",
    price: 79.00,
    originalPrice: 99.00,
    rating: 4.5,
    reviewsCount: 119,
    badge: "NEW",
    isFeatured: false,
    isBestSeller: false,
    stock: 13,
    brand: "Volt",
    colors: ["White", "Space Gray"],
    soldCount: 530,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Nightstand charger that powers phone, watch, and earbuds at once with magnetic snap alignment.",
    specifications: [
      "15W Magnetic Phone Pad",
      "Watch & Earbuds Docks",
      "Over-current Protection",
      "Braided USB-C Cable Included"
    ],
    reviews: []
  }
];
