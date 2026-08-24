export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: "Headphones" | "Shirt" | "Home" | "Watch";
  description: string;
  itemCount: number;
  image: string;
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
  isFeatured: boolean;
  isBestSeller: boolean;
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
    id: "electronics",
    name: "Electronics & Audio",
    slug: "electronics",
    icon: "Headphones",
    description: "Gadgets, ANC audio gear, and cutting-edge tech.",
    itemCount: 24,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "fashion",
    name: "Fashion & Apparel",
    slug: "fashion",
    icon: "Shirt",
    description: "Trending fashionwear, shoes, and minimalist style.",
    itemCount: 38,
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "home-living",
    name: "Home & Living",
    slug: "home-living",
    icon: "Home",
    description: "Modern decor, ergonomic furniture, and lighting.",
    itemCount: 19,
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "accessories",
    name: "Accessories",
    slug: "accessories",
    icon: "Watch",
    description: "Premium smartwatches, leather goods, and bags.",
    itemCount: 15,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
  },
];


export const products: Product[] = [
  {
    id: "prod-1",
    title: "Aura Noise-Canceling Wireless Headphones",
    slug: "aura-wireless-headphones",
    category: "electronics",
    categoryName: "Electronics",
    price: 249.99,
    originalPrice: 299.99,
    rating: 4.9,
    reviewsCount: 128,
    badge: "BESTSELLER",
    isFeatured: true,
    isBestSeller: true,
    stock: 14,
    brand: "Aura",
    colors: ["Midnight", "Silver", "Sand"],
    soldCount: 1840,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Immerse yourself in high-fidelity acoustics with active noise cancellation, 40-hour battery life, and ultra-comfortable memory foam ear cushions.",
    specifications: [
      "Active Noise Canceling (ANC)",
      "Bluetooth 5.3 Low Latency",
      "40 Hours Playback",
      "USB-C Fast Charging (10 min = 4 hours)",
      "Multi-device Multipoint Connectivity"
    ],
    reviews: [
      {
        id: "rev-1",
        author: "Alexander Vance",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
        rating: 5,
        date: "August 14, 2026",
        title: "Phenomenal noise cancellation & battery life!",
        comment: "The soundstage is wide, clear, and perfectly balanced. I wore these on a 14-hour flight and the battery still had 60% remaining. Absolutely worth every penny.",
        verified: true
      },
      {
        id: "rev-2",
        author: "Sophia Martinez",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
        rating: 5,
        date: "August 2, 2026",
        title: "Sleek aesthetic and memory foam comfort",
        comment: "No ear pressure even after hours of editing videos. The build quality feels super premium.",
        verified: true
      }
    ]
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
