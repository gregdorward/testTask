import { Product } from '../types';

/**
 * The product catalogue, bundled with the app so the UI runs fully standalone
 * (no backend required). Image keys map to local SVG art in ProductImage.tsx.
 */
export const products: Product[] = [
  {
    id: 'p-mens-tee',
    name: "Men's Logo T-Shirt",
    description:
      'A clean, everyday tee in heavyweight organic cotton, finished with the embroidered Waracle mark on the chest. Cut for a relaxed modern fit.',
    category: 'T-Shirts',
    gender: 'Men',
    image: 'tshirt-black',
    price: 24.99,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 120,
    createdAt: '2024-05-01T10:00:00.000Z',
  },
  {
    id: 'p-womens-tee',
    name: "Women's Logo T-Shirt",
    description:
      'A tailored tee in soft combed cotton with the Waracle mark front and centre. Designed to layer or stand alone.',
    category: 'T-Shirts',
    gender: 'Women',
    image: 'tee-w-black',
    price: 24.99,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 110,
    createdAt: '2024-05-02T10:00:00.000Z',
  },
  {
    id: 'p-headset',
    name: 'Waracle Headset',
    description:
      'Over-ear wireless headset with active noise cancellation and a 30 hour battery. Tuned for long focus sessions.',
    category: 'Headsets',
    gender: 'Unisex',
    image: 'headset',
    price: 59.99,
    sizes: ['One Size'],
    stock: 40,
    createdAt: '2024-05-05T10:00:00.000Z',
  },
  {
    id: 'p-mens-shorts',
    name: "Men's Logo Shorts",
    description:
      'Lightweight training shorts with a brushed inner and side pockets. Subtle Waracle branding on the left leg.',
    category: 'Shorts',
    gender: 'Men',
    image: 'shorts-black',
    price: 29.99,
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 80,
    createdAt: '2024-05-03T10:00:00.000Z',
  },
  {
    id: 'p-womens-shorts',
    name: "Women's Logo Shorts",
    description:
      'High-rise shorts in a soft French terry with an elastic waist and the Waracle mark on the hem.',
    category: 'Shorts',
    gender: 'Women',
    image: 'shorts-heather',
    price: 29.99,
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 75,
    createdAt: '2024-05-04T10:00:00.000Z',
  },
  {
    id: 'p-womens-white-tee',
    name: "Women's White T-Shirt",
    description:
      'A crisp white tee in breathable cotton jersey with a tonal Waracle mark. A wardrobe staple.',
    category: 'T-Shirts',
    gender: 'Women',
    image: 'tee-w-white',
    price: 24.99,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 95,
    createdAt: '2024-05-07T10:00:00.000Z',
  },
  {
    id: 'p-mens-grey-tee',
    name: "Men's Grey T-Shirt",
    description:
      'A marl-grey tee with a soft hand feel and the embroidered Waracle mark. Easy to wear, hard to take off.',
    category: 'T-Shirts',
    gender: 'Men',
    image: 'tshirt-grey',
    price: 24.99,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 100,
    createdAt: '2024-05-08T10:00:00.000Z',
  },
  {
    id: 'p-cap',
    name: 'Waracle Cap',
    description:
      'A six-panel cap in brushed cotton twill with an embroidered Waracle mark and adjustable strap.',
    category: 'Accessories',
    gender: 'Unisex',
    image: 'cap',
    price: 19.99,
    sizes: ['One Size'],
    stock: 150,
    createdAt: '2024-05-09T10:00:00.000Z',
  },
  {
    id: 'p-headset-premium',
    name: 'Waracle Premium Headset',
    description:
      'The flagship headset: studio-grade drivers, adaptive noise cancellation, and a machined aluminium frame.',
    category: 'Headsets',
    gender: 'Unisex',
    image: 'headset',
    price: 79.99,
    sizes: ['One Size'],
    stock: 25,
    createdAt: '2024-05-06T10:00:00.000Z',
  },
];
