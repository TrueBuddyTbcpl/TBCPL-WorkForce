export interface ClientProduct {
  id: string;
  name: string;
}

export interface Client {
  id: string;
  name: string;
  products: ClientProduct[];
}

export const clientsData: Client[] = [
  {
    id: 'client001',
    name: 'Samsung India',
    products: [
      { id: 'prod001', name: 'Galaxy Smartphones' },
      { id: 'prod002', name: 'Smart TVs' },
      { id: 'prod003', name: 'Home Appliances' },
      { id: 'prod004', name: 'Wearable Devices' },
    ],
  },
  {
    id: 'client002',
    name: 'Adidas India',
    products: [
      { id: 'prod005', name: 'Sports Footwear' },
      { id: 'prod006', name: 'Athletic Apparel' },
      { id: 'prod007', name: 'Sports Accessories' },
    ],
  },
  {
    id: 'client003',
    name: 'Apple India',
    products: [
      { id: 'prod008', name: 'iPhone' },
      { id: 'prod009', name: 'MacBook' },
      { id: 'prod010', name: 'iPad' },
      { id: 'prod011', name: 'Apple Watch' },
      { id: 'prod012', name: 'AirPods' },
      { id: 'prod013', name: 'iPhone Accessories' },
    ],
  },
  {
    id: 'client004',
    name: 'Cipla Pharmaceuticals',
    products: [
      { id: 'prod014', name: 'Generic Medicines' },
      { id: 'prod015', name: 'Respiratory Products' },
      { id: 'prod016', name: 'Cardiovascular Drugs' },
    ],
  },
  {
    id: 'client005',
    name: 'Rolex India',
    products: [
      { id: 'prod017', name: 'Luxury Watches' },
      { id: 'prod018', name: 'Watch Accessories' },
    ],
  },
  {
    id: 'client006',
    name: 'Maruti Suzuki India',
    products: [
      { id: 'prod019', name: 'Automotive Spare Parts' },
      { id: 'prod020', name: 'Original Accessories' },
      { id: 'prod021', name: 'Lubricants' },
    ],
  },
  {
    id: 'client007',
    name: 'Zara India',
    products: [
      { id: 'prod022', name: 'Fashion Apparel' },
      { id: 'prod023', name: 'Footwear' },
      { id: 'prod024', name: 'Accessories' },
    ],
  },
  {
    id: 'client008',
    name: 'Lakme India',
    products: [
      { id: 'prod025', name: 'Cosmetics' },
      { id: 'prod026', name: 'Beauty Products' },
      { id: 'prod027', name: 'Skincare' },
    ],
  },
  {
    id: 'client009',
    name: 'Sony India',
    products: [
      { id: 'prod028', name: 'Audio Equipment' },
      { id: 'prod029', name: 'Cameras' },
      { id: 'prod030', name: 'Gaming Consoles' },
      { id: 'prod031', name: 'Televisions' },
    ],
  },
  {
    id: 'client010',
    name: 'Coca Cola India',
    products: [
      { id: 'prod032', name: 'Soft Drinks' },
      { id: 'prod033', name: 'Juices' },
      { id: 'prod034', name: 'Energy Drinks' },
    ],
  },
];
