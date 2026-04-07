interface Product {
  id: number;
  image: string;
  brand: string;
  title: string;
  price: number;
  rating: number;
  isWishlisted?: boolean;
  category?: string;
  reviewCount: number;
}
export const products: Product[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&q=80",
    brand: "Dove",
    title: "Body Wash with Pump with Skin Natural",
    price: 19.93,
    rating: 4,
    reviewCount: 431,
    category: "Body Care",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    brand: "CeraVe",
    title: "Hyaluronic Acid Serum for Face",
    price: 7.49,
    rating: 4.5,
    reviewCount: 114,
    isWishlisted: true,
    category: "Skincare",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&q=80",
    brand: "The Ordinary",
    title: "Niacinamide 10% + Zinc 1%",
    price: 10.5,
    rating: 4.7,
    reviewCount: 289,
    category: "Skincare",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
    brand: "L'Oreal",
    title: "Elseve Total Repair Shampoo",
    price: 8.99,
    rating: 4.2,
    reviewCount: 198,
    category: "Hair Care",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&q=80",
    brand: "Maybelline",
    title: "Fit Me Matte + Poreless Foundation",
    price: 12.99,
    rating: 4.6,
    reviewCount: 512,
    category: "Makeup",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1598452963314-b09f397a5c48?w=400&q=80",
    brand: "Nivea",
    title: "Soft Moisturizing Cream",
    price: 5.99,
    rating: 4.3,
    reviewCount: 276,
    category: "Body Care",
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80",
    brand: "Wardah",
    title: "Lightening Day Cream",
    price: 6.75,
    rating: 4.4,
    reviewCount: 190,
    category: "Skincare",
  },
  {
    id: 8,
    image:
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80",
    brand: "Emina",
    title: "Cheeklit Cream Blush",
    price: 4.99,
    rating: 4.2,
    reviewCount: 150,
    category: "Makeup",
  },
  {
    id: 9,
    image:
      "https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=400&q=80",
    brand: "Pantene",
    title: "Pro-V Hair Fall Control Shampoo",
    price: 7.25,
    rating: 4.1,
    reviewCount: 210,
    category: "Hair Care",
  },
  {
    id: 10,
    image:
      "https://images.unsplash.com/photo-1629198735660-e39ea93f5c2b?w=400&q=80",
    brand: "Vaseline",
    title: "Healthy Bright Body Lotion",
    price: 5.5,
    rating: 4.3,
    reviewCount: 340,
    category: "Body Care",
  },
  {
    id: 11,
    image:
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=400&q=80",
    brand: "Somethinc",
    title: "Niacinamide + Moisture Serum",
    price: 9.99,
    rating: 4.6,
    reviewCount: 280,
    category: "Skincare",
  },
  {
    id: 12,
    image:
      "https://images.unsplash.com/photo-1611930021592-5c3f06f9f9a3?w=400&q=80",
    brand: "Make Over",
    title: "Powerstay Matte Powder Foundation",
    price: 15.99,
    rating: 4.5,
    reviewCount: 320,
    category: "Makeup",
  },
  {
    id: 13,
    image:
      "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&q=80",
    brand: "Sunsilk",
    title: "Black Shine Shampoo",
    price: 6.2,
    rating: 4.0,
    reviewCount: 175,
    category: "Hair Care",
  },
  {
    id: 14,
    image:
      "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=400&q=80",
    brand: "Scarlett",
    title: "Brightening Shower Scrub",
    price: 8.75,
    rating: 4.4,
    reviewCount: 265,
    category: "Body Care",
  },
  {
    id: 15,
    image:
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&q=80",
    brand: "Innisfree",
    title: "Green Tea Seed Serum",
    price: 17.5,
    rating: 4.7,
    reviewCount: 410,
    category: "Skincare",
  },
  {
    id: 16,
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
    brand: "Revlon",
    title: "Super Lustrous Lipstick",
    price: 9.25,
    rating: 4.3,
    reviewCount: 230,
    category: "Makeup",
  },
  {
    id: 17,
    image:
      "https://images.unsplash.com/photo-1629198735660-e39ea93f5c2b?w=400&q=80",
    brand: "Tresemme",
    title: "Keratin Smooth Conditioner",
    price: 8.4,
    rating: 4.2,
    reviewCount: 198,
    category: "Hair Care",
  },
  {
    id: 18,
    image:
      "https://images.unsplash.com/photo-1598452963314-b09f397a5c48?w=400&q=80",
    brand: "Lux",
    title: "Soft Touch Body Wash",
    price: 6.1,
    rating: 4.1,
    reviewCount: 160,
    category: "Body Care",
  },
  {
    id: 19,
    image:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80",
    brand: "Avoskin",
    title: "Miraculous Refining Toner",
    price: 14.3,
    rating: 4.6,
    reviewCount: 305,
    category: "Skincare",
  },
  {
    id: 20,
    image:
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80",
    brand: "BLP Beauty",
    title: "Lip Coat Matte",
    price: 11.2,
    rating: 4.5,
    reviewCount: 275,
    category: "Makeup",
  },
];
