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

const img = (id: string, w = 400, h = 400) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop`;

export const mockProducts: Product[] = [
  // === ELECTRONICS ===
  { id: "1", name: "Sony WH-1000XM5 Wireless Headphones", brand: "Sony", category: "Electronics", image: img("1618366712010-f4ae9c647dcb"), store: "Amazon", currentPrice: 278, originalPrice: 399.99, lowestPrice: 248, lowestPriceDate: "2025-11-24", highestDiscount: 38, url: "#", priceHistory: generatePriceHistory(399.99, 248, 278), rating: 4.7, reviewCount: 12847 },
  { id: "2", name: "Bose QuietComfort Ultra Earbuds", brand: "Bose", category: "Electronics", image: img("1590658268037-6bf12f032f55"), store: "Best Buy", currentPrice: 229, originalPrice: 299.99, lowestPrice: 199, lowestPriceDate: "2025-12-20", highestDiscount: 34, url: "#", priceHistory: generatePriceHistory(299.99, 199, 229), rating: 4.5, reviewCount: 6782 },
  { id: "3", name: "Apple AirPods Pro 2nd Gen", brand: "Apple", category: "Electronics", image: img("1606220588913-b3aacb4d2f46"), store: "Amazon", currentPrice: 189.99, originalPrice: 249, lowestPrice: 169, lowestPriceDate: "2025-11-29", highestDiscount: 32, url: "#", priceHistory: generatePriceHistory(249, 169, 189.99), rating: 4.8, reviewCount: 34521 },
  { id: "4", name: "JBL Charge 5 Portable Speaker", brand: "JBL", category: "Electronics", image: img("1608043152269-423dbba4e7e1"), store: "Walmart", currentPrice: 129.95, originalPrice: 179.95, lowestPrice: 109.95, lowestPriceDate: "2026-01-02", highestDiscount: 39, url: "#", priceHistory: generatePriceHistory(179.95, 109.95, 129.95), rating: 4.7, reviewCount: 18234 },
  { id: "5", name: "Samsung Galaxy Buds3 Pro", brand: "Samsung", category: "Electronics", image: img("1505740420928-5e560c06d30e"), store: "Best Buy", currentPrice: 179.99, originalPrice: 249.99, lowestPrice: 149.99, lowestPriceDate: "2026-02-14", highestDiscount: 40, url: "#", priceHistory: generatePriceHistory(249.99, 149.99, 179.99), rating: 4.4, reviewCount: 5423 },
  { id: "6", name: "Anker Soundcore Space A40 Earbuds", brand: "Anker", category: "Electronics", image: img("1631867675167-90a456a90863"), store: "Amazon", currentPrice: 54.99, originalPrice: 79.99, lowestPrice: 44.99, lowestPriceDate: "2025-07-15", highestDiscount: 44, url: "#", priceHistory: generatePriceHistory(79.99, 44.99, 54.99), rating: 4.5, reviewCount: 27891 },

  // === TVs ===
  { id: "7", name: 'Samsung 65" OLED 4K Smart TV S95D', brand: "Samsung", category: "TVs", image: img("1593359677879-a4bb92f829d1"), store: "Best Buy", currentPrice: 1797.99, originalPrice: 2599.99, lowestPrice: 1697.99, lowestPriceDate: "2025-12-26", highestDiscount: 35, url: "#", priceHistory: generatePriceHistory(2599.99, 1697.99, 1797.99), rating: 4.8, reviewCount: 3421 },
  { id: "8", name: 'LG C4 55" OLED evo 4K Smart TV', brand: "LG", category: "TVs", image: img("1461151304267-38535e780c79"), store: "Amazon", currentPrice: 1096.99, originalPrice: 1599.99, lowestPrice: 946.99, lowestPriceDate: "2026-01-20", highestDiscount: 41, url: "#", priceHistory: generatePriceHistory(1599.99, 946.99, 1096.99), rating: 4.7, reviewCount: 9123 },
  { id: "9", name: 'Sony Bravia XR 75" 4K HDR TV', brand: "Sony", category: "TVs", image: img("1593784991095-a205069470b6"), store: "Best Buy", currentPrice: 1498, originalPrice: 2199.99, lowestPrice: 1398, lowestPriceDate: "2025-11-28", highestDiscount: 36, url: "#", priceHistory: generatePriceHistory(2199.99, 1398, 1498), rating: 4.6, reviewCount: 4567 },
  { id: "10", name: 'TCL 65" Q7 QLED 4K Smart TV', brand: "TCL", category: "TVs", image: img("1522869635100-9f4c5e86aa37"), store: "Walmart", currentPrice: 449.99, originalPrice: 649.99, lowestPrice: 399.99, lowestPriceDate: "2025-12-01", highestDiscount: 38, url: "#", priceHistory: generatePriceHistory(649.99, 399.99, 449.99), rating: 4.4, reviewCount: 11234 },
  { id: "11", name: 'Hisense 50" A6 Series 4K UHD TV', brand: "Hisense", category: "TVs", image: img("1593305841991-05c297ba4575"), store: "Target", currentPrice: 219.99, originalPrice: 329.99, lowestPrice: 199.99, lowestPriceDate: "2026-01-15", highestDiscount: 39, url: "#", priceHistory: generatePriceHistory(329.99, 199.99, 219.99), rating: 4.3, reviewCount: 8765 },

  // === LAPTOPS ===
  { id: "12", name: "Apple MacBook Air M3 15-inch", brand: "Apple", category: "Laptops", image: img("1517336714731-489689fd1ca8"), store: "Amazon", currentPrice: 1049, originalPrice: 1299, lowestPrice: 999, lowestPriceDate: "2026-01-15", highestDiscount: 23, url: "#", priceHistory: generatePriceHistory(1299, 999, 1049), rating: 4.9, reviewCount: 8932 },
  { id: "13", name: 'Dell XPS 14 Laptop 14.5"', brand: "Dell", category: "Laptops", image: img("1496181133206-80ce9b88a853"), store: "Best Buy", currentPrice: 1199, originalPrice: 1599, lowestPrice: 1099, lowestPriceDate: "2026-02-20", highestDiscount: 31, url: "#", priceHistory: generatePriceHistory(1599, 1099, 1199), rating: 4.5, reviewCount: 3456 },
  { id: "14", name: "Lenovo ThinkPad X1 Carbon Gen 12", brand: "Lenovo", category: "Laptops", image: img("1525547719851-ed2daacaf5ae"), store: "Amazon", currentPrice: 1274.15, originalPrice: 1749, lowestPrice: 1199, lowestPriceDate: "2025-11-25", highestDiscount: 31, url: "#", priceHistory: generatePriceHistory(1749, 1199, 1274.15), rating: 4.6, reviewCount: 2890 },
  { id: "15", name: "ASUS ROG Zephyrus G14 Gaming Laptop", brand: "ASUS", category: "Laptops", image: img("1603302576837-37561b2e2302"), store: "Best Buy", currentPrice: 1299.99, originalPrice: 1599.99, lowestPrice: 1199.99, lowestPriceDate: "2026-01-05", highestDiscount: 25, url: "#", priceHistory: generatePriceHistory(1599.99, 1199.99, 1299.99), rating: 4.7, reviewCount: 5678 },
  { id: "16", name: "HP Spectre x360 16 2-in-1 Laptop", brand: "HP", category: "Laptops", image: img("1544099858-75feeb57f01b"), store: "Walmart", currentPrice: 1149, originalPrice: 1499.99, lowestPrice: 999, lowestPriceDate: "2025-12-15", highestDiscount: 33, url: "#", priceHistory: generatePriceHistory(1499.99, 999, 1149), rating: 4.4, reviewCount: 1987 },
  { id: "17", name: "Acer Swift Go 14 AI Laptop", brand: "Acer", category: "Laptops", image: img("1588872657578-7efd1f1555ed"), store: "Amazon", currentPrice: 649.99, originalPrice: 899.99, lowestPrice: 579.99, lowestPriceDate: "2026-03-01", highestDiscount: 36, url: "#", priceHistory: generatePriceHistory(899.99, 579.99, 649.99), rating: 4.3, reviewCount: 4321 },

  // === GAMING ===
  { id: "18", name: "Nintendo Switch OLED Model", brand: "Nintendo", category: "Gaming", image: img("1578303512597-81e6cc155b3e"), store: "Target", currentPrice: 299.99, originalPrice: 349.99, lowestPrice: 279.99, lowestPriceDate: "2026-02-14", highestDiscount: 20, url: "#", priceHistory: generatePriceHistory(349.99, 279.99, 299.99), rating: 4.8, reviewCount: 21340 },
  { id: "19", name: "PlayStation DualSense Edge Controller", brand: "Sony", category: "Gaming", image: img("1606144042614-b2417e99c4e3"), store: "Amazon", currentPrice: 159.99, originalPrice: 199.99, lowestPrice: 139.99, lowestPriceDate: "2025-11-24", highestDiscount: 30, url: "#", priceHistory: generatePriceHistory(199.99, 139.99, 159.99), rating: 4.5, reviewCount: 8765 },
  { id: "20", name: "Xbox Elite Series 2 Core Controller", brand: "Microsoft", category: "Gaming", image: img("1621259182978-fbf93132d53d"), store: "Best Buy", currentPrice: 99.99, originalPrice: 139.99, lowestPrice: 89.99, lowestPriceDate: "2025-12-26", highestDiscount: 36, url: "#", priceHistory: generatePriceHistory(139.99, 89.99, 99.99), rating: 4.4, reviewCount: 12345 },
  { id: "21", name: "SteelSeries Arctis Nova Pro Wireless Headset", brand: "SteelSeries", category: "Gaming", image: img("1612287230202-1ff1d85d1bdf"), store: "Amazon", currentPrice: 299.99, originalPrice: 349.99, lowestPrice: 269.99, lowestPriceDate: "2026-01-10", highestDiscount: 23, url: "#", priceHistory: generatePriceHistory(349.99, 269.99, 299.99), rating: 4.6, reviewCount: 6789 },
  { id: "22", name: "Razer DeathAdder V3 HyperSpeed Mouse", brand: "Razer", category: "Gaming", image: img("1527814050087-3793815479db"), store: "Best Buy", currentPrice: 119.99, originalPrice: 159.99, lowestPrice: 99.99, lowestPriceDate: "2025-07-04", highestDiscount: 37, url: "#", priceHistory: generatePriceHistory(159.99, 99.99, 119.99), rating: 4.7, reviewCount: 4321 },

  // === HOME ===
  { id: "23", name: "Dyson V15 Detect Cordless Vacuum", brand: "Dyson", category: "Home", image: img("1558317374-067fb5f30001"), store: "Walmart", currentPrice: 549.99, originalPrice: 749.99, lowestPrice: 499.99, lowestPriceDate: "2025-11-29", highestDiscount: 33, url: "#", priceHistory: generatePriceHistory(749.99, 499.99, 549.99), rating: 4.6, reviewCount: 5621 },
  { id: "24", name: "iRobot Roomba j9+ Self-Emptying Vacuum", brand: "iRobot", category: "Home", image: img("1667453466805-75bbf36e8707"), store: "Amazon", currentPrice: 599, originalPrice: 899.99, lowestPrice: 549, lowestPriceDate: "2025-11-25", highestDiscount: 39, url: "#", priceHistory: generatePriceHistory(899.99, 549, 599), rating: 4.3, reviewCount: 4210 },
  { id: "25", name: "Ninja Creami Deluxe Ice Cream Maker", brand: "Ninja", category: "Home", image: img("1570222094114-d054a17d89f4"), store: "Target", currentPrice: 149.99, originalPrice: 229.99, lowestPrice: 129.99, lowestPriceDate: "2025-12-01", highestDiscount: 43, url: "#", priceHistory: generatePriceHistory(229.99, 129.99, 149.99), rating: 4.6, reviewCount: 15678 },
  { id: "26", name: "KitchenAid Artisan Stand Mixer 5qt", brand: "KitchenAid", category: "Home", image: img("1594385208974-2f8bb07c6d1b"), store: "Amazon", currentPrice: 299.99, originalPrice: 449.99, lowestPrice: 279.99, lowestPriceDate: "2025-11-28", highestDiscount: 38, url: "#", priceHistory: generatePriceHistory(449.99, 279.99, 299.99), rating: 4.8, reviewCount: 42567 },
  { id: "27", name: "Breville Barista Express Espresso Machine", brand: "Breville", category: "Home", image: img("1495474472287-4d71bcdd2085"), store: "Best Buy", currentPrice: 549.95, originalPrice: 749.95, lowestPrice: 499.95, lowestPriceDate: "2026-01-20", highestDiscount: 33, url: "#", priceHistory: generatePriceHistory(749.95, 499.95, 549.95), rating: 4.5, reviewCount: 9876 },
  { id: "28", name: "Instant Pot Duo Plus 8qt Pressure Cooker", brand: "Instant Pot", category: "Home", image: img("1585515320754-f4c3e0e8159c"), store: "Walmart", currentPrice: 79.99, originalPrice: 139.99, lowestPrice: 59.99, lowestPriceDate: "2025-11-24", highestDiscount: 57, url: "#", priceHistory: generatePriceHistory(139.99, 59.99, 79.99), rating: 4.7, reviewCount: 67890 },
  { id: "29", name: "Shark AI Ultra Robot Vacuum", brand: "Shark", category: "Home", image: img("1558618666-fcd25c85f82e"), store: "Target", currentPrice: 399.99, originalPrice: 599.99, lowestPrice: 349.99, lowestPriceDate: "2025-12-26", highestDiscount: 42, url: "#", priceHistory: generatePriceHistory(599.99, 349.99, 399.99), rating: 4.4, reviewCount: 8765 },

  // === PHONES & TABLETS ===
  { id: "30", name: "Samsung Galaxy S25 Ultra 256GB", brand: "Samsung", category: "Phones", image: img("1511707171634-5f897ff02aa6"), store: "Amazon", currentPrice: 1099.99, originalPrice: 1299.99, lowestPrice: 999.99, lowestPriceDate: "2026-03-15", highestDiscount: 23, url: "#", priceHistory: generatePriceHistory(1299.99, 999.99, 1099.99), rating: 4.6, reviewCount: 7654 },
  { id: "31", name: "Google Pixel 9 Pro 128GB", brand: "Google", category: "Phones", image: img("1598327105666-5b89351aff97"), store: "Best Buy", currentPrice: 799, originalPrice: 999, lowestPrice: 749, lowestPriceDate: "2026-02-01", highestDiscount: 25, url: "#", priceHistory: generatePriceHistory(999, 749, 799), rating: 4.7, reviewCount: 5432 },
  { id: "32", name: "Apple iPad Air M2 11-inch 128GB", brand: "Apple", category: "Tablets", image: img("1544244015-0df4b3ffc6b0"), store: "Amazon", currentPrice: 499, originalPrice: 599, lowestPrice: 449, lowestPriceDate: "2025-11-29", highestDiscount: 25, url: "#", priceHistory: generatePriceHistory(599, 449, 499), rating: 4.8, reviewCount: 11234 },
  { id: "33", name: "Samsung Galaxy Tab S9 FE 128GB", brand: "Samsung", category: "Tablets", image: img("1561154464-82e9adf32764"), store: "Walmart", currentPrice: 329.99, originalPrice: 449.99, lowestPrice: 299.99, lowestPriceDate: "2025-12-20", highestDiscount: 33, url: "#", priceHistory: generatePriceHistory(449.99, 299.99, 329.99), rating: 4.5, reviewCount: 6789 },
  { id: "34", name: "OnePlus 13 256GB", brand: "OnePlus", category: "Phones", image: img("1592899677977-9c10ca588bbd"), store: "Amazon", currentPrice: 699.99, originalPrice: 899.99, lowestPrice: 649.99, lowestPriceDate: "2026-02-14", highestDiscount: 28, url: "#", priceHistory: generatePriceHistory(899.99, 649.99, 699.99), rating: 4.5, reviewCount: 3456 },

  // === WEARABLES ===
  { id: "35", name: "Apple Watch Series 10 GPS 46mm", brand: "Apple", category: "Wearables", image: img("1434493789847-2a75b0f82fcf"), store: "Amazon", currentPrice: 349, originalPrice: 429, lowestPrice: 329, lowestPriceDate: "2025-12-26", highestDiscount: 23, url: "#", priceHistory: generatePriceHistory(429, 329, 349), rating: 4.7, reviewCount: 15678 },
  { id: "36", name: "Samsung Galaxy Watch7 44mm", brand: "Samsung", category: "Wearables", image: img("1523275335684-37898b6baf30"), store: "Best Buy", currentPrice: 229.99, originalPrice: 329.99, lowestPrice: 199.99, lowestPriceDate: "2026-01-15", highestDiscount: 39, url: "#", priceHistory: generatePriceHistory(329.99, 199.99, 229.99), rating: 4.4, reviewCount: 4567 },
  { id: "37", name: "Garmin Venu 3S Smartwatch", brand: "Garmin", category: "Wearables", image: img("1575311373937-040b8e1fd5b6"), store: "Amazon", currentPrice: 349.99, originalPrice: 449.99, lowestPrice: 299.99, lowestPriceDate: "2025-11-29", highestDiscount: 33, url: "#", priceHistory: generatePriceHistory(449.99, 299.99, 349.99), rating: 4.6, reviewCount: 2345 },
  { id: "38", name: "Fitbit Charge 6 Fitness Tracker", brand: "Fitbit", category: "Wearables", image: img("1576243345927-3eddae9c50e2"), store: "Target", currentPrice: 99.95, originalPrice: 159.95, lowestPrice: 89.95, lowestPriceDate: "2026-02-01", highestDiscount: 44, url: "#", priceHistory: generatePriceHistory(159.95, 89.95, 99.95), rating: 4.3, reviewCount: 19876 },

  // === CAMERAS ===
  { id: "39", name: "Sony Alpha a7 IV Mirrorless Camera", brand: "Sony", category: "Cameras", image: img("1516035069371-29a1b244cc32"), store: "Amazon", currentPrice: 1998, originalPrice: 2499, lowestPrice: 1898, lowestPriceDate: "2025-11-24", highestDiscount: 24, url: "#", priceHistory: generatePriceHistory(2499, 1898, 1998), rating: 4.8, reviewCount: 6543 },
  { id: "40", name: "Canon EOS R6 Mark II Body", brand: "Canon", category: "Cameras", image: img("1502920917128-1aa500764cbd"), store: "Best Buy", currentPrice: 2099, originalPrice: 2499, lowestPrice: 1999, lowestPriceDate: "2026-01-10", highestDiscount: 20, url: "#", priceHistory: generatePriceHistory(2499, 1999, 2099), rating: 4.7, reviewCount: 3456 },
  { id: "41", name: "GoPro HERO13 Black", brand: "GoPro", category: "Cameras", image: img("1526170375885-4d8ecf77b99f"), store: "Amazon", currentPrice: 299.99, originalPrice: 399.99, lowestPrice: 249.99, lowestPriceDate: "2025-12-15", highestDiscount: 37, url: "#", priceHistory: generatePriceHistory(399.99, 249.99, 299.99), rating: 4.5, reviewCount: 12345 },
  { id: "42", name: "DJI Mini 4 Pro Drone Fly More Combo", brand: "DJI", category: "Cameras", image: img("1473968512647-3e447244af8f"), store: "Best Buy", currentPrice: 959, originalPrice: 1159, lowestPrice: 859, lowestPriceDate: "2025-11-29", highestDiscount: 26, url: "#", priceHistory: generatePriceHistory(1159, 859, 959), rating: 4.8, reviewCount: 5678 },

  // === FITNESS ===
  { id: "43", name: "Peloton Bike+ Home Exercise Bike", brand: "Peloton", category: "Fitness", image: img("1517836357463-d25dfeac3438"), store: "Amazon", currentPrice: 1995, originalPrice: 2495, lowestPrice: 1795, lowestPriceDate: "2025-12-26", highestDiscount: 28, url: "#", priceHistory: generatePriceHistory(2495, 1795, 1995), rating: 4.6, reviewCount: 8901 },
  { id: "44", name: "Bowflex SelectTech 552 Dumbbells (Pair)", brand: "Bowflex", category: "Fitness", image: img("1534438327276-14e5300c3a48"), store: "Best Buy", currentPrice: 349, originalPrice: 549, lowestPrice: 299, lowestPriceDate: "2026-01-05", highestDiscount: 45, url: "#", priceHistory: generatePriceHistory(549, 299, 349), rating: 4.7, reviewCount: 23456 },
  { id: "45", name: "Theragun Elite Massage Gun", brand: "Therabody", category: "Fitness", image: img("1571019614242-c5c5dee9f50c"), store: "Target", currentPrice: 299, originalPrice: 399, lowestPrice: 249, lowestPriceDate: "2025-11-28", highestDiscount: 38, url: "#", priceHistory: generatePriceHistory(399, 249, 299), rating: 4.5, reviewCount: 7654 },
  { id: "46", name: "NordicTrack Commercial S22i Studio Cycle", brand: "NordicTrack", category: "Fitness", image: img("1576678927484-cc907957088c"), store: "Walmart", currentPrice: 1299, originalPrice: 1999, lowestPrice: 1099, lowestPriceDate: "2025-12-01", highestDiscount: 45, url: "#", priceHistory: generatePriceHistory(1999, 1099, 1299), rating: 4.3, reviewCount: 3456 },

  // === SMART HOME ===
  { id: "47", name: "Ring Video Doorbell 4", brand: "Ring", category: "Smart Home", image: img("1558002038-1055907df827"), store: "Amazon", currentPrice: 149.99, originalPrice: 219.99, lowestPrice: 119.99, lowestPriceDate: "2025-11-24", highestDiscount: 45, url: "#", priceHistory: generatePriceHistory(219.99, 119.99, 149.99), rating: 4.5, reviewCount: 34567 },
  { id: "48", name: "Google Nest Learning Thermostat 4th Gen", brand: "Google", category: "Smart Home", image: img("1585771724684-38269d6639fd"), store: "Best Buy", currentPrice: 229.99, originalPrice: 279.99, lowestPrice: 199.99, lowestPriceDate: "2026-02-14", highestDiscount: 29, url: "#", priceHistory: generatePriceHistory(279.99, 199.99, 229.99), rating: 4.6, reviewCount: 12345 },
  { id: "49", name: "Philips Hue Starter Kit (4 Bulbs + Bridge)", brand: "Philips", category: "Smart Home", image: img("1558089687-f282d8956bb5"), store: "Target", currentPrice: 149.99, originalPrice: 199.99, lowestPrice: 124.99, lowestPriceDate: "2025-12-20", highestDiscount: 37, url: "#", priceHistory: generatePriceHistory(199.99, 124.99, 149.99), rating: 4.7, reviewCount: 21345 },
  { id: "50", name: "Amazon Echo Show 15 Smart Display", brand: "Amazon", category: "Smart Home", image: img("1556761175-4b46a572b786"), store: "Amazon", currentPrice: 199.99, originalPrice: 299.99, lowestPrice: 159.99, lowestPriceDate: "2025-11-25", highestDiscount: 47, url: "#", priceHistory: generatePriceHistory(299.99, 159.99, 199.99), rating: 4.4, reviewCount: 8765 },
  { id: "51", name: "Arlo Pro 5 Security Camera 2-Pack", brand: "Arlo", category: "Smart Home", image: img("1557862921-37829c790f19"), store: "Best Buy", currentPrice: 299.99, originalPrice: 449.99, lowestPrice: 249.99, lowestPriceDate: "2026-01-15", highestDiscount: 44, url: "#", priceHistory: generatePriceHistory(449.99, 249.99, 299.99), rating: 4.3, reviewCount: 5678 },

  // === STORAGE ===
  { id: "52", name: "Samsung T7 Shield 2TB Portable SSD", brand: "Samsung", category: "Storage", image: img("1597872200969-2b65d56bd16b"), store: "Amazon", currentPrice: 139.99, originalPrice: 219.99, lowestPrice: 109.99, lowestPriceDate: "2025-11-24", highestDiscount: 50, url: "#", priceHistory: generatePriceHistory(219.99, 109.99, 139.99), rating: 4.8, reviewCount: 23456 },
  { id: "53", name: "WD Black SN850X 2TB NVMe SSD", brand: "Western Digital", category: "Storage", image: img("1531492746076-161ca9bcad09"), store: "Best Buy", currentPrice: 129.99, originalPrice: 189.99, lowestPrice: 99.99, lowestPriceDate: "2026-01-20", highestDiscount: 47, url: "#", priceHistory: generatePriceHistory(189.99, 99.99, 129.99), rating: 4.8, reviewCount: 15678 },
  { id: "54", name: "SanDisk Extreme Pro 256GB microSD", brand: "SanDisk", category: "Storage", image: img("1618044619888-009e7ff74cd0"), store: "Walmart", currentPrice: 27.99, originalPrice: 52.99, lowestPrice: 22.99, lowestPriceDate: "2025-12-01", highestDiscount: 57, url: "#", priceHistory: generatePriceHistory(52.99, 22.99, 27.99), rating: 4.7, reviewCount: 45678 },
];

export const stores: Store[] = ["Amazon", "Best Buy", "Walmart", "Target"];
export const categories = [...new Set(mockProducts.map((p) => p.category))];

export const storeColorClass: Record<Store, string> = {
  Amazon: "bg-store-amazon",
  "Best Buy": "bg-store-bestbuy",
  Walmart: "bg-store-walmart",
  Target: "bg-store-target",
};
