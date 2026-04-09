// ─── Shared types (same as ProductSection) ───────────────────────────────────
export interface ProductColor {
  name: string;
  hex: string;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  badge?: string;
  category: string;
  brand: string;
  colors: ProductColor[];
  sizes?: string[];
  description?: string;
  stock?: number;
  sku?: string;
  reviews?: Review[];
}

export interface Review {
  id: number;
  author: string;
  avatar?: string;
  date: string;
  rating: number;
  comment: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
export const allProducts: Product[] = [
  {
    id: 1,
    name: "Piqué Biker Jacket",
    price: 67.24,
    rating: 3.5,
    badge: "NEW",
    category: "Clothing",
    brand: "Zara",
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "A sleek biker jacket crafted from premium piqué fabric with structured shoulders and moto-inspired hardware. The tailored silhouette offers an effortlessly cool look, perfect for layering in any season.",
    stock: 12,
    sku: "ZR-PBJ-001",
    colors: [
      {
        name: "Khaki",
        hex: "#b5945e",
        image:
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
      },
      {
        name: "Navy",
        hex: "#2c3e6b",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
      },
    ],
    reviews: [
      {
        id: 1,
        author: "John Doe",
        date: "01 Jan 2025",
        rating: 3,
        comment:
          "Great quality jacket, fits true to size. The fabric feels premium and the hardware looks sharp. Would definitely recommend.",
      },
    ],
  },
  {
    id: 2,
    name: "Urban Leather Sneaker",
    price: 43.48,
    originalPrice: 58,
    rating: 4,
    badge: "SALE",
    category: "Shoes",
    brand: "Nike",
    colors: [
      {
        name: "Black",
        hex: "#1a1a1a",
        image:
          "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80",
      },
      {
        name: "White",
        hex: "#f0f0f0",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
      },
    ],
  },
  {
    id: 3,
    name: "Diagonal Textured Hoodie",
    price: 60.9,
    rating: 0,
    category: "Clothing",
    brand: "H&M",
    colors: [
      {
        name: "Brown",
        hex: "#8B6914",
        image:
          "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80",
      },
      {
        name: "Black",
        hex: "#1a1a1a",
        image:
          "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&q=80",
      },
    ],
  },
  {
    id: 4,
    name: "Canvas Field Jacket",
    price: 89.0,
    rating: 3,
    badge: "NEW",
    category: "Clothing",
    brand: "Zara",
    colors: [
      {
        name: "Olive",
        hex: "#6b7c45",
        image:
          "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80",
      },
      {
        name: "Navy",
        hex: "#2c3e6b",
        image:
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80",
      },
    ],
  },
  {
    id: 5,
    name: "Leather Crossbody Bag",
    price: 55.0,
    rating: 5,
    category: "Bags",
    brand: "Louis Vuitton",
    colors: [
      {
        name: "Tan",
        hex: "#c9934a",
        image:
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
      },
      {
        name: "Black",
        hex: "#1a1a1a",
        image:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
      },
    ],
  },
  {
    id: 6,
    name: "Slim Chino Trousers",
    price: 52.0,
    rating: 3,
    category: "Clothing",
    brand: "H&M",
    colors: [
      {
        name: "Beige",
        hex: "#d4b896",
        image:
          "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400&q=80",
      },
      {
        name: "Navy",
        hex: "#2c3e6b",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
      },
    ],
  },
  {
    id: 7,
    name: "Oxford Button-Down Shirt",
    price: 45.5,
    rating: 4,
    category: "Clothing",
    brand: "Ralph Lauren",
    colors: [
      {
        name: "White",
        hex: "#f5f5f5",
        image:
          "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80",
      },
      {
        name: "Blue",
        hex: "#3b5bdb",
        image:
          "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80",
      },
    ],
  },
  {
    id: 8,
    name: "Merino Wool Turtleneck",
    price: 89.0,
    rating: 5,
    badge: "NEW",
    category: "Clothing",
    brand: "Ralph Lauren",
    colors: [
      {
        name: "Camel",
        hex: "#c9934a",
        image:
          "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=80",
      },
      {
        name: "Black",
        hex: "#1a1a1a",
        image:
          "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80",
      },
    ],
  },
  {
    id: 9,
    name: "Suede Chelsea Boots",
    price: 128.0,
    rating: 5,
    category: "Shoes",
    brand: "Gucci",
    colors: [
      {
        name: "Brown",
        hex: "#8B6914",
        image:
          "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80",
      },
      {
        name: "Black",
        hex: "#1a1a1a",
        image:
          "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80",
      },
    ],
  },
  {
    id: 10,
    name: "Leather Derby Shoes",
    price: 112.0,
    originalPrice: 135.0,
    rating: 5,
    badge: "SALE",
    category: "Shoes",
    brand: "Gucci",
    colors: [
      {
        name: "Tan",
        hex: "#c9934a",
        image:
          "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80",
      },
      {
        name: "Black",
        hex: "#1a1a1a",
        image:
          "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80",
      },
    ],
  },
  {
    id: 11,
    name: "Canvas Tote Bag",
    price: 35.0,
    rating: 3,
    category: "Bags",
    brand: "H&M",
    colors: [
      {
        name: "Natural",
        hex: "#d4c5a9",
        image:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
      },
      {
        name: "Black",
        hex: "#1a1a1a",
        image:
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
      },
    ],
  },
  {
    id: 12,
    name: "Graphic Print Tee",
    price: 28.5,
    rating: 4,
    category: "Clothing",
    brand: "Zara",
    colors: [
      {
        name: "White",
        hex: "#f5f5f5",
        image:
          "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80",
      },
      {
        name: "Black",
        hex: "#1a1a1a",
        image:
          "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&q=80",
      },
    ],
  },
  {
    id: 13,
    name: "Woven Leather Belt",
    price: 38.0,
    rating: 4,
    category: "Accessories",
    brand: "Louis Vuitton",
    colors: [
      {
        name: "Tan",
        hex: "#c9934a",
        image:
          "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80",
      },
    ],
  },
  {
    id: 14,
    name: "Ribbed Knit Beanie",
    price: 22.0,
    originalPrice: 32,
    rating: 3,
    badge: "SALE",
    category: "Accessories",
    brand: "H&M",
    colors: [
      {
        name: "Grey",
        hex: "#888",
        image:
          "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80",
      },
      {
        name: "Black",
        hex: "#1a1a1a",
        image:
          "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80",
      },
    ],
  },
  {
    id: 15,
    name: "Denim Trucker Jacket",
    price: 88.0,
    originalPrice: 110.0,
    rating: 4,
    badge: "SALE",
    category: "Clothing",
    brand: "Zara",
    colors: [
      {
        name: "Blue",
        hex: "#3b5bdb",
        image:
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80",
      },
    ],
  },
  {
    id: 16,
    name: "Bomber Track Jacket",
    price: 79.0,
    rating: 5,
    badge: "NEW",
    category: "Clothing",
    brand: "Nike",
    colors: [
      {
        name: "Olive",
        hex: "#6b7c45",
        image:
          "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80",
      },
      {
        name: "Black",
        hex: "#1a1a1a",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
      },
    ],
  },
  {
    id: 17,
    name: "Slim Fit Chinos",
    price: 35.0,
    originalPrice: 52.0,
    rating: 3,
    badge: "SALE",
    category: "Clothing",
    brand: "H&M",
    colors: [
      {
        name: "Khaki",
        hex: "#b5945e",
        image:
          "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400&q=80",
      },
    ],
  },
  {
    id: 18,
    name: "Running Track Pants",
    price: 44.0,
    originalPrice: 65.0,
    rating: 3,
    badge: "SALE",
    category: "Clothing",
    brand: "Nike",
    colors: [
      {
        name: "Black",
        hex: "#1a1a1a",
        image:
          "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400&q=80",
      },
    ],
  },
  {
    id: 19,
    name: "Cargo Utility Pants",
    price: 72.0,
    rating: 3,
    badge: "NEW",
    category: "Clothing",
    brand: "Zara",
    colors: [
      {
        name: "Olive",
        hex: "#6b7c45",
        image:
          "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400&q=80",
      },
    ],
  },
  {
    id: 20,
    name: "Knit Polo Shirt",
    price: 55.0,
    rating: 3,
    badge: "NEW",
    category: "Clothing",
    brand: "Ralph Lauren",
    colors: [
      {
        name: "Navy",
        hex: "#2c3e6b",
        image:
          "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80",
      },
    ],
  },
  {
    id: 21,
    name: "Leather Wallet",
    price: 48.0,
    rating: 4,
    category: "Accessories",
    brand: "Gucci",
    colors: [
      {
        name: "Brown",
        hex: "#8B6914",
        image:
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
      },
    ],
  },
  {
    id: 22,
    name: "Classic White Sneaker",
    price: 59.0,
    originalPrice: 89.0,
    rating: 5,
    badge: "SALE",
    category: "Shoes",
    brand: "Nike",
    colors: [
      {
        name: "White",
        hex: "#f5f5f5",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
      },
    ],
  },
  {
    id: 23,
    name: "Flannel Check Shirt",
    price: 39.0,
    originalPrice: 55.0,
    rating: 4,
    badge: "SALE",
    category: "Clothing",
    brand: "Ralph Lauren",
    colors: [
      {
        name: "Red",
        hex: "#c0392b",
        image:
          "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80",
      },
    ],
  },
  {
    id: 24,
    name: "Puffer Vest",
    price: 48.0,
    originalPrice: 72.0,
    rating: 4,
    badge: "SALE",
    category: "Clothing",
    brand: "Nike",
    colors: [
      {
        name: "Navy",
        hex: "#2c3e6b",
        image:
          "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80",
      },
    ],
  },
];
