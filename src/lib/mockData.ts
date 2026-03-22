export type Store = "Amazon" | "Best Buy" | "Walmart" | "Target";

export type PricePoint = {
  date: string;
  price: number;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  store: Store;
  currentPrice: number;
  originalPrice: number;
  lowestPrice: number;
  lowestPriceDate: string;
  highestDiscount: number;
  url: string;
  priceHistory: PricePoint[];
  rating: number;
  reviewCount: number;
};

const generatePriceHistory = (
  original: number,
  lowest: number,
  current: number,
  months: number = 12
): PricePoint[] => {
  const points: PricePoint[] = [];
  const now = new Date();
  for (let i = months; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    const range = original - lowest;
    const noise = (Math.random() - 0.4) * range * 0.6;
    let price = original - range * 0.3 + noise;
    if (i === 0) price = current;
    if (i === Math.floor(months * 0.6)) price = lowest;
    price = Math.max(lowest * 0.95, Math.min(original * 1.02, price));
    points.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(price * 100) / 100,
    });
  }
  return points;
};

export const mockProducts: Product[] = [
  {
    id: "1",
    name: 'Sony WH-1000XM5 Wireless Headphones',
    brand: "Sony",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop",
    store: "Amazon",
    currentPrice: 278,
    originalPrice: 399.99,
    lowestPrice: 248,
    lowestPriceDate: "2025-11-24",
    highestDiscount: 38,
    url: "#",
    priceHistory: generatePriceHistory(399.99, 248, 278),
    rating: 4.7,
    reviewCount: 12847,
  },
  {
    id: "2",
    name: 'Samsung 65" OLED 4K Smart TV S95D',
    brand: "Samsung",
    category: "TVs",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
    store: "Best Buy",
    currentPrice: 1797.99,
    originalPrice: 2599.99,
    lowestPrice: 1697.99,
    lowestPriceDate: "2025-12-26",
    highestDiscount: 35,
    url: "#",
    priceHistory: generatePriceHistory(2599.99, 1697.99, 1797.99),
    rating: 4.8,
    reviewCount: 3421,
  },
  {
    id: "3",
    name: "Apple MacBook Air M3 15-inch",
    brand: "Apple",
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    store: "Amazon",
    currentPrice: 1049,
    originalPrice: 1299,
    lowestPrice: 999,
    lowestPriceDate: "2026-01-15",
    highestDiscount: 23,
    url: "#",
    priceHistory: generatePriceHistory(1299, 999, 1049),
    rating: 4.9,
    reviewCount: 8932,
  },
  {
    id: "4",
    name: "Dyson V15 Detect Cordless Vacuum",
    brand: "Dyson",
    category: "Home",
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop",
    store: "Walmart",
    currentPrice: 549.99,
    originalPrice: 749.99,
    lowestPrice: 499.99,
    lowestPriceDate: "2025-11-29",
    highestDiscount: 33,
    url: "#",
    priceHistory: generatePriceHistory(749.99, 499.99, 549.99),
    rating: 4.6,
    reviewCount: 5621,
  },
  {
    id: "5",
    name: "Nintendo Switch OLED Model",
    brand: "Nintendo",
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop",
    store: "Target",
    currentPrice: 299.99,
    originalPrice: 349.99,
    lowestPrice: 279.99,
    lowestPriceDate: "2026-02-14",
    highestDiscount: 20,
    url: "#",
    priceHistory: generatePriceHistory(349.99, 279.99, 299.99),
    rating: 4.8,
    reviewCount: 21340,
  },
  {
    id: "6",
    name: "Bose QuietComfort Ultra Earbuds",
    brand: "Bose",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop",
    store: "Best Buy",
    currentPrice: 229,
    originalPrice: 299.99,
    lowestPrice: 199,
    lowestPriceDate: "2025-12-20",
    highestDiscount: 34,
    url: "#",
    priceHistory: generatePriceHistory(299.99, 199, 229),
    rating: 4.5,
    reviewCount: 6782,
  },
  {
    id: "7",
    name: 'LG C4 55" OLED evo 4K Smart TV',
    brand: "LG",
    category: "TVs",
    image: "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400&h=400&fit=crop",
    store: "Amazon",
    currentPrice: 1096.99,
    originalPrice: 1599.99,
    lowestPrice: 946.99,
    lowestPriceDate: "2026-01-20",
    highestDiscount: 41,
    url: "#",
    priceHistory: generatePriceHistory(1599.99, 946.99, 1096.99),
    rating: 4.7,
    reviewCount: 9123,
  },
  {
    id: "8",
    name: "iRobot Roomba j9+ Self-Emptying Robot Vacuum",
    brand: "iRobot",
    category: "Home",
    image: "https://images.unsplash.com/photo-1667453466805-75bbf36e8707?w=400&h=400&fit=crop",
    store: "Walmart",
    currentPrice: 599,
    originalPrice: 899.99,
    lowestPrice: 549,
    lowestPriceDate: "2025-11-25",
    highestDiscount: 39,
    url: "#",
    priceHistory: generatePriceHistory(899.99, 549, 599),
    rating: 4.3,
    reviewCount: 4210,
  },
];

export const stores: Store[] = ["Amazon", "Best Buy", "Walmart", "Target"];
export const categories = [...new Set(mockProducts.map((p) => p.category))];

export const storeColorClass: Record<Store, string> = {
  Amazon: "bg-store-amazon",
  "Best Buy": "bg-store-bestbuy",
  Walmart: "bg-store-walmart",
  Target: "bg-store-target",
};
