export const MYFURNITURE_BRAND = "myfurniture."
export const MYFURNITURE_LOGO_SRC = "/myfurniture-logo.png"
export const MYFURNITURE_STORE_TITLE = "myfurniture"
export const MYFURNITURE_HOME_TITLE = "myfurniture – Furniture Store"

/** @deprecated Use MYFURNITURE_BRAND */
export const WOODMART_BRAND = MYFURNITURE_BRAND

export function myfurniturePageTitle(segment: string): string {
  return `${segment} | ${MYFURNITURE_STORE_TITLE}`
}

export const WOODMART_TOP_LINKS = [
  { label: "Gift Cards", href: "/store" },
  { label: "Showrooms", href: "/store" },
  { label: "About Us", href: "/store" },
]

/** ~USD 1,300 free-shipping threshold, shown in storefront promos */
export const PROMO_FREE_SHIPPING_MINIMUM = "Rp 20.000.000"

export const WOODMART_TOP_BAR = {
  phone: "(+62) 8123 4444 2222",
  expertLink: "/store",
  expertAvatars: [
    "/images/woodmart/authors/author-1.png",
    "/images/woodmart/authors/author-2.png",
    "/images/woodmart/authors/author-3.png",
  ],
}

export const WOODMART_HERO_SLIDES = [
  {
    id: 1,
    image: "/images/woodmart/hero/slider-1.jpg",
    authorImage: "/images/woodmart/authors/author-1.png",
    authorName: "Ramón Esteve",
    category: "sofas",
    categoryHref: "/store",
    title: "Sectional fabric sofa by",
    price: "Rp 56.000.000",
    cta: "Shop Now",
    ctaHref: "/store",
  },
  {
    id: 2,
    image: "/images/woodmart/hero/slider-2.jpg",
    authorImage: "/images/woodmart/authors/author-2.png",
    authorName: "Ethimo Design",
    category: "armchairs",
    categoryHref: "/store",
    title: "Modern armchair collection by",
    price: "Rp 29.000.000",
    cta: "Shop Now",
    ctaHref: "/store",
  },
  {
    id: 3,
    image: "/images/woodmart/hero/slider-3.jpg",
    authorImage: "/images/woodmart/authors/author-3.png",
    authorName: "Valencia Studio",
    category: "tables",
    categoryHref: "/store",
    title: "Elegant dining table by",
    price: "Rp 38.000.000",
    cta: "Shop Now",
    ctaHref: "/store",
  },
]

export const WOODMART_BRANDS = [
  {
    id: "elitis",
    name: "Elitis",
    location: "Talosa / France",
    image: "/images/woodmart/brands/elitis-bg.jpg",
    logo: "/images/woodmart/brands/elitis-logo.png",
    href: "/store",
  },
  {
    id: "hay",
    name: "Hay",
    location: "Barcelona / Spain",
    image: "/images/woodmart/brands/hay-bg.jpg",
    logo: "/images/woodmart/brands/hay-logo.png",
    href: "/store",
  },
  {
    id: "kettal",
    name: "Kettal",
    location: "Barcelona / Spain",
    image: "/images/woodmart/brands/kettal-bg.jpg",
    logo: "/images/woodmart/brands/kettal-logo.png",
    href: "/store",
  },
  {
    id: "lladro",
    name: "Lladró",
    location: "Valencia / Spain",
    image: "/images/woodmart/brands/lladro-bg.jpg",
    logo: "/images/woodmart/brands/lladro-logo.png",
    href: "/store",
  },
  {
    id: "poliform",
    name: "Poliform",
    location: "Milan / Italy",
    image: "/images/woodmart/brands/poliform-bg.jpg",
    logo: "/images/woodmart/brands/poliform-logo.png",
    href: "/store",
  },
]

export const WOODMART_FURNITURE_RULES = {
  chairImage: "/images/woodmart/home/choosing-rules-chair.png",
  videoImage: "/images/woodmart/home/video-preview.jpg",
  videoUrl: "https://www.youtube.com/watch?v=XHOmBV4js_E",
  lead:
    "Whether living on your own or with a family, your living room is an important space.",
  body:
    "This room is where your family spends time together, and it is the room most of your guests will spend the majority of their time in. Choosing furniture that creates a pleasant, welcoming appearance while holding up against the wear and tear of everyday life is the key in getting this space to work for your needs.",
  tips: [
    "Choose items in a single color scheme and style",
    "Consider the area of the room",
    "Do not buy unnecessary pieces of furniture",
  ],
  videoTitle: "How choose furniture",
  videoSubtitle: "SØLREM furniture collection",
}

export type WoodmartBlogArticle = {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  image: string
  href: string
}

export const WOODMART_LATEST_ARTICLES: WoodmartBlogArticle[] = [
  {
    id: "valencia",
    title: "In the heart of Valencia",
    excerpt:
      "As an alternative theory, (and because Latin scholars do this sort of thing) someone tracked down a ...",
    category: "Decoration",
    date: "26 May 2023",
    image: "/images/woodmart/home/blog-1.jpg",
    href: "/store",
  },
  {
    id: "ethimo",
    title: "Ethimo mountain style",
    excerpt:
      "So how did the classical Latin become so incoherent? According to McClintock, a 15th century typeset...",
    category: "Furniture",
    date: "26 May 2023",
    image: "/images/woodmart/home/blog-2.jpg",
    href: "/store",
  },
  {
    id: "clear-thinking",
    title: "For clear thinking",
    excerpt:
      "The passage experienced a surge in popularity during the 1960s when Letraset used it on their dry-tr...",
    category: "Wooden accessories",
    date: "26 May 2023",
    image: "/images/woodmart/home/blog-3.jpg",
    href: "/store",
  },
  {
    id: "clean-series",
    title: "The clean series",
    excerpt:
      "So when is it okay to use lorem ipsum? First, lorem ipsum works well for staging. It's like the prop...",
    category: "Design trends",
    date: "26 May 2023",
    image: "/images/woodmart/home/blog-4.jpg",
    href: "/store",
  },
]

export const WOODMART_FOOTER_USEFUL_LINKS = [
  { label: "About Us", href: "/store" },
  { label: "Contact Us", href: "/store" },
  { label: "Showrooms", href: "/store" },
  { label: "Blog", href: "/store" },
  { label: "Gift Cards", href: "/store" },
]

export const WOODMART_FOOTER_SOCIAL = [
  { id: "facebook", label: "Facebook", href: "https://facebook.com", color: "#1877F2" },
  { id: "x", label: "X", href: "https://x.com", color: "#000000" },
  { id: "instagram", label: "Instagram", href: "https://instagram.com", color: "#E4405F" },
  { id: "youtube", label: "YouTube", href: "https://youtube.com", color: "#FF0000" },
]

export type IndonesiaPaymentMethodId =
  | "qris"
  | "ovo"
  | "gopay"
  | "dana"
  | "shopeepay"
  | "linkaja"
  | "visa"
  | "mastercard"
  | "bank_transfer"

export const INDONESIA_PAYMENT_METHODS: {
  id: IndonesiaPaymentMethodId
  label: string
}[] = [
  { id: "qris", label: "QRIS" },
  { id: "ovo", label: "OVO" },
  { id: "gopay", label: "GoPay" },
  { id: "dana", label: "DANA" },
  { id: "shopeepay", label: "ShopeePay" },
  { id: "linkaja", label: "LinkAja" },
  { id: "visa", label: "Visa" },
  { id: "mastercard", label: "Mastercard" },
  { id: "bank_transfer", label: "Transfer Bank" },
]

export type IndonesiaShippingCourierId = "jne" | "jnt" | "sicepat" | "anteraja"

export const INDONESIA_SHIPPING_COURIERS: {
  id: IndonesiaShippingCourierId
  label: string
}[] = [
  { id: "jne", label: "JNE" },
  { id: "jnt", label: "J&T Express" },
  { id: "sicepat", label: "SiCepat" },
  { id: "anteraja", label: "AnterAja" },
]
