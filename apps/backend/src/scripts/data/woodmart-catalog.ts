/**
 * Furniture catalog seed data for myfurniture.
 */

export type WoodmartCategorySeed = {
  name: string
  handle: string
  description: string
  imagePath: string
  icon: string
}

export type WoodmartProductSeed = {
  title: string
  handle: string
  categoryHandle: string
  description: string
  priceUsd: number
  imagePath: string
  weight?: number
}

export const WOODMART_CATEGORIES: WoodmartCategorySeed[] = [
  {
    name: "Chairs",
    handle: "chairs",
    description: "Seating for dining, office, and living spaces.",
    imagePath: "/images/woodmart/categories/chairs.jpg",
    icon: "chair",
  },
  {
    name: "Tables",
    handle: "tables",
    description: "Dining tables, coffee tables, and side tables.",
    imagePath: "/images/woodmart/categories/tables.jpg",
    icon: "table",
  },
  {
    name: "Sofas",
    handle: "sofas",
    description: "Sectionals, loveseats, and fabric sofas.",
    imagePath: "/images/woodmart/categories/sofas.jpg",
    icon: "sofa",
  },
  {
    name: "Armchairs",
    handle: "armchairs",
    description: "Accent chairs and upholstered armchairs.",
    imagePath: "/images/woodmart/categories/armchairs.jpg",
    icon: "armchair",
  },
  {
    name: "Beds",
    handle: "beds",
    description: "Bed frames and bedroom essentials.",
    imagePath: "/images/woodmart/categories/beds.jpg",
    icon: "bed",
  },
  {
    name: "Storage",
    handle: "storage",
    description: "Cabinets, shelving, and organizers.",
    imagePath: "/images/woodmart/categories/storage.jpg",
    icon: "storage",
  },
  {
    name: "Textiles",
    handle: "textiles",
    description: "Cushions, throws, and soft furnishings.",
    imagePath: "/images/woodmart/categories/textiles.jpg",
    icon: "textile",
  },
  {
    name: "Lighting",
    handle: "lighting",
    description: "Floor lamps, pendants, and ambient lighting.",
    imagePath: "/images/woodmart/categories/lighting.jpg",
    icon: "lighting",
  },
  {
    name: "Toys",
    handle: "toys",
    description: "Playful decor and children's accessories.",
    imagePath: "/images/woodmart/categories/toys.jpg",
    icon: "toy",
  },
  {
    name: "Decor",
    handle: "decor",
    description: "Vases, tableware, and decorative objects.",
    imagePath: "/images/woodmart/categories/decor.jpg",
    icon: "decor",
  },
]

export const WOODMART_PRODUCTS: WoodmartProductSeed[] = [
  {
    title: "Curve",
    handle: "curve",
    categoryHandle: "chairs",
    description:
      "A sculptural dining chair with soft curves and a compact footprint for modern interiors.",
    priceUsd: 320,
    imagePath: "/images/woodmart/products/curve.jpg",
    weight: 8000,
  },
  {
    title: "Can",
    handle: "can",
    categoryHandle: "sofas",
    description:
      "A modular sofa system with clean lines and deep, comfortable seating.",
    priceUsd: 2100,
    imagePath: "/images/woodmart/products/can.jpg",
    weight: 45000,
  },
  {
    title: "Belt",
    handle: "belt",
    categoryHandle: "armchairs",
    description:
      "The compact silhouette opens up a new way of using the dining space as a living room within the living room.",
    priceUsd: 680,
    imagePath: "/images/woodmart/products/belt.jpg",
    weight: 12000,
  },
  {
    title: "Giro LR",
    handle: "giro-lr",
    categoryHandle: "tables",
    description:
      "A contemporary table with tapered legs and a balanced top for everyday dining.",
    priceUsd: 449,
    imagePath: "/images/woodmart/products/giro-lr.jpg",
    weight: 35000,
  },
  {
    title: "Soft Edge",
    handle: "soft-edge",
    categoryHandle: "chairs",
    description:
      "Rounded edges and a generous seat make this chair ideal for long dinners and casual lounging.",
    priceUsd: 440,
    imagePath: "/images/woodmart/products/soft-edge.jpg",
    weight: 7500,
  },
  {
    title: "Palissade",
    handle: "palissade",
    categoryHandle: "sofas",
    description:
      "Outdoor-inspired upholstery with a relaxed profile and durable construction.",
    priceUsd: 1890,
    imagePath: "/images/woodmart/products/palissade.jpg",
    weight: 42000,
  },
  {
    title: "Albert",
    handle: "albert",
    categoryHandle: "armchairs",
    description:
      "A classic armchair with a well-proportioned frame and supportive cushioning.",
    priceUsd: 1600,
    imagePath: "/images/woodmart/products/albert.jpg",
    weight: 14000,
  },
  {
    title: "Navona",
    handle: "navona",
    categoryHandle: "tables",
    description:
      "An elegant dining table designed for gatherings, with a stable base and refined finish.",
    priceUsd: 1200,
    imagePath: "/images/woodmart/products/navona.jpg",
    weight: 40000,
  },
  {
    title: "Aruda",
    handle: "aruda",
    categoryHandle: "sofas",
    description:
      "Low-profile seating with soft upholstery and a minimalist Scandinavian expression.",
    priceUsd: 699,
    imagePath: "/images/woodmart/products/aruda.jpg",
    weight: 38000,
  },
  {
    title: "Revolt",
    handle: "revolt",
    categoryHandle: "chairs",
    description: "Stackable chair with a bold profile and comfortable seat.",
    priceUsd: 275,
    imagePath: "/images/woodmart/products/curve.jpg",
    weight: 5000,
  },
  {
    title: "Sophie",
    handle: "sophie",
    categoryHandle: "chairs",
    description: "Upholstered dining chair with a tailored back and soft padding.",
    priceUsd: 520,
    imagePath: "/images/woodmart/products/soft-edge.jpg",
    weight: 7000,
  },
  {
    title: "Frames Upholstered",
    handle: "frames-upholstered",
    categoryHandle: "armchairs",
    description:
      "Soft curves and tapering slender lines inspired by modern design for a classic yet contemporary chair.",
    priceUsd: 399,
    imagePath: "/images/woodmart/products/belt.jpg",
    weight: 11000,
  },
  {
    title: "Mags",
    handle: "mags",
    categoryHandle: "sofas",
    description:
      "Slender organic forms with thin yet comfortable upholstery in natural colours.",
    priceUsd: 3620,
    imagePath: "/images/woodmart/products/can.jpg",
    weight: 50000,
  },
  {
    title: "Giro",
    handle: "giro",
    categoryHandle: "tables",
    description:
      "Mondrian table reinterprets light and elegant design for the contemporary dining room.",
    priceUsd: 3400,
    imagePath: "/images/woodmart/products/giro-lr.jpg",
    weight: 45000,
  },
  {
    title: "Henry",
    handle: "henry",
    categoryHandle: "sofas",
    description:
      "A new classic for the contemporary dining room with light, elegant proportions.",
    priceUsd: 2090,
    imagePath: "/images/woodmart/products/palissade.jpg",
    weight: 48000,
  },
  {
    title: "Skygarden",
    handle: "skygarden",
    categoryHandle: "lighting",
    description:
      "Ambient light woven through the structure of the shade for a soft, diffused glow.",
    priceUsd: 780,
    imagePath: "/images/woodmart/products/navona.jpg",
    weight: 6000,
  },
  {
    title: "Floor lamp",
    handle: "floor-lamp",
    categoryHandle: "lighting",
    description:
      "Filament-style structure that blends sculptural form with warm illumination.",
    priceUsd: 320,
    imagePath: "/images/woodmart/products/trevi.jpg",
    weight: 5500,
  },
  {
    title: "Alessa",
    handle: "alessa",
    categoryHandle: "storage",
    description:
      "Floor-standing cabinets highlighting minimalist design with vibrant colour accents.",
    priceUsd: 1100,
    imagePath: "/images/woodmart/products/albert.jpg",
    weight: 25000,
  },
  {
    title: "Comb. 401",
    handle: "comb-401",
    categoryHandle: "storage",
    description: "Wall-hanging cabinet with clean lines and practical compartments.",
    priceUsd: 110,
    imagePath: "/images/woodmart/products/curve.jpg",
    weight: 15000,
  },
  {
    title: "Be Look",
    handle: "be-look",
    categoryHandle: "beds",
    description:
      "Bed frame with a compact silhouette suited to modern bedrooms and guest rooms.",
    priceUsd: 1200,
    imagePath: "/images/woodmart/products/aruda.jpg",
    weight: 35000,
  },
  {
    title: "Maya Dune Linel",
    handle: "maya-dune-linel",
    categoryHandle: "textiles",
    description:
      "Modular textile system with irregular polygons for infinite colour combinations.",
    priceUsd: 530,
    imagePath: "/images/woodmart/products/belt.jpg",
    weight: 2000,
  },
  {
    title: "Hem",
    handle: "hem",
    categoryHandle: "textiles",
    description: "Soft throw with a modular pattern and natural palette.",
    priceUsd: 45,
    imagePath: "/images/woodmart/products/soft-edge.jpg",
    weight: 1500,
  },
  {
    title: "Terracotta vase",
    handle: "terracotta-vase",
    categoryHandle: "decor",
    description: "Hand-finished terracotta vase for shelves and console tables.",
    priceUsd: 182,
    imagePath: "/images/woodmart/products/trevi.jpg",
    weight: 2500,
  },
  {
    title: "Stoense",
    handle: "stoense",
    categoryHandle: "decor",
    description: "Decorative object with geometric facets and a matte glaze.",
    priceUsd: 230,
    imagePath: "/images/woodmart/products/navona.jpg",
    weight: 1800,
  },
  {
    title: "Mega Dot",
    handle: "mega-dot",
    categoryHandle: "decor",
    description: "Bold dotted pattern piece for coffee tables and open shelving.",
    priceUsd: 85,
    imagePath: "/images/woodmart/products/curve.jpg",
    weight: 1200,
  },
  {
    title: "Baby Key Rattle",
    handle: "baby-key-rattle",
    categoryHandle: "toys",
    description: "Wooden rattle with smooth edges, safe for little hands.",
    priceUsd: 120,
    imagePath: "/images/woodmart/products/trevi.jpg",
    weight: 300,
  },
  {
    title: "Panda Bear",
    handle: "panda-bear",
    categoryHandle: "toys",
    description: "Soft plush toy with a playful design for children's rooms.",
    priceUsd: 16,
    imagePath: "/images/woodmart/products/soft-edge.jpg",
    weight: 400,
  },
  {
    title: "Ice Cream",
    handle: "ice-cream",
    categoryHandle: "decor",
    description:
      "Whimsical decor piece with a sculptural form and glossy finish.",
    priceUsd: 850,
    imagePath: "/images/woodmart/products/can.jpg",
    weight: 3000,
  },
  {
    title: "Foglio",
    handle: "foglio",
    categoryHandle: "tables",
    description: "Side table with a leaf-inspired top and slim metal base.",
    priceUsd: 445,
    imagePath: "/images/woodmart/products/giro-lr.jpg",
    weight: 12000,
  },
  {
    title: "Bluemine",
    handle: "bluemine",
    categoryHandle: "armchairs",
    description:
      "Compact armchair with a hybrid lounge profile for dining and living areas.",
    priceUsd: 1620,
    imagePath: "/images/woodmart/products/albert.jpg",
    weight: 13000,
  },
]

export function resolveImageUrl(
  imagePath: string,
  storefrontBaseUrl: string
): string {
  const base = storefrontBaseUrl.replace(/\/$/, "")
  if (imagePath.startsWith("http")) {
    return imagePath
  }
  return `${base}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`
}
