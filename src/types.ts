export type CategoryType = 'AC' | 'Refrigerator' | 'Mobile' | 'WashingMachine' | 'InverterBattery';

export interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface DeviceModel {
  id: string;
  brandId: string;
  name: string;
  basePrice: number;
}

export type OrderStatus = 
  | 'Confirmed' 
  | 'Failed' 
  | 'Rejected' 
  | 'Cancelled' 
  | 'Passed' 
  | 'Completed' 
  | 'Pending' 
  | 'Hold' 
  | 'Pending Pickup';

export interface EvaluationRequest {
  id: string;
  category: CategoryType | string;
  brand: string;
  model: string;
  condition: 'excellent' | 'good' | 'average' | 'poor' | string;
  capacity?: string; // For ACs & Fridges (e.g. 1 Ton, 1.5 Ton, 250L, 350L)
  energyRating?: string; // For ACs & Fridges (e.g. 3 Star, 5 Star)
  coilType?: 'Copper' | 'Silver' | string; // For ACs (Copper or Silver)
  stabilizerOption?: string; // For ACs (e.g. Inverter model, Non-inverter model)
  issues: string[];
  estimatedPrice: number;
  phone: string;
  secondaryPhone?: string;
  status: OrderStatus;
  createdAt: string;
  customerName?: string;
  customerAddress?: string;
  pickupDate?: string;
  pickupTime?: string;
  pickupSlot?: string;
  pickupAgent?: string;
  adminNotes?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  updatedAt?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  category: CategoryType;
}

// Predefined Brands & Models
export const BRANDS: Record<CategoryType, Brand[]> = {
  AC: [
    { id: 'ac-voltas', name: 'Voltas' },
    { id: 'ac-daikin', name: 'Daikin' },
    { id: 'ac-lg', name: 'LG Electronics' },
    { id: 'ac-samsung', name: 'Samsung' },
    { id: 'ac-blue-star', name: 'Blue Star' },
    { id: 'ac-hitachi', name: 'Hitachi' },
    { id: 'ac-carrier', name: 'Carrier' },
    { id: 'ac-panasonic', name: 'Panasonic' },
    { id: 'ac-lloyd', name: 'Lloyd' },
    { id: 'ac-godrej', name: 'Godrej' },
    { id: 'ac-haier', name: 'Haier' },
    { id: 'ac-whirlpool', name: 'Whirlpool' },
    { id: 'ac-mitsubishi', name: 'Mitsubishi Electric' },
    { id: 'ac-ogneral', name: 'O General' },
    { id: 'ac-cruise', name: 'Cruise' },
  ],
  Refrigerator: [
    { id: 'ref-samsung', name: 'Samsung' },
    { id: 'ref-lg', name: 'LG' },
    { id: 'ref-whirlpool', name: 'Whirlpool' },
    { id: 'ref-haier', name: 'Haier' },
    { id: 'ref-godrej', name: 'Godrej' },
  ],
  Mobile: [
    { id: 'mob-apple', name: 'Apple' },
    { id: 'mob-samsung', name: 'Samsung' },
    { id: 'mob-oneplus', name: 'OnePlus' },
    { id: 'mob-google', name: 'Google' },
    { id: 'mob-xiaomi', name: 'Xiaomi' },
  ],
  WashingMachine: [
    { id: 'wm-lg', name: 'LG' },
    { id: 'wm-samsung', name: 'Samsung' },
    { id: 'wm-whirlpool', name: 'Whirlpool' },
    { id: 'wm-ifb', name: 'IFB' },
    { id: 'wm-bosch', name: 'Bosch' },
  ],
  InverterBattery: [
    { id: 'ib-exide', name: 'Exide' },
    { id: 'ib-luminous', name: 'Luminous' },
    { id: 'ib-amaron', name: 'Amaron' },
    { id: 'ib-okaya', name: 'Okaya' },
    { id: 'ib-microtek', name: 'Microtek' },
  ],
};

export const MODELS: Record<CategoryType, DeviceModel[]> = {
  AC: [
    { id: 'ac-m1', brandId: 'ac-daikin', name: 'Daikin 1.5 Ton Split AC', basePrice: 9000 },
    { id: 'ac-m2', brandId: 'ac-daikin', name: 'Daikin 1.0 Ton Split AC', basePrice: 8600 },
    { id: 'ac-m3', brandId: 'ac-daikin', name: 'Daikin 2.0 Ton Inverter AC', basePrice: 9500 },
    { id: 'ac-m4', brandId: 'ac-voltas', name: 'Voltas 1.5 Ton 3 Star Split AC', basePrice: 9000 },
    { id: 'ac-m5', brandId: 'ac-voltas', name: 'Voltas 1.5 Ton 5 Star Split AC', basePrice: 9200 },
    { id: 'ac-m6', brandId: 'ac-voltas', name: 'Voltas 1.0 Ton Window AC', basePrice: 9000 },
    { id: 'ac-m7', brandId: 'ac-lg', name: 'LG Dual Inverter 1.5 Ton AC', basePrice: 9000 },
    { id: 'ac-m8', brandId: 'ac-lg', name: 'LG Dual Inverter 2.0 Ton AC', basePrice: 9500 },
    { id: 'ac-m9', brandId: 'ac-samsung', name: 'Samsung WindFree 1.5 Ton AC', basePrice: 9000 },
    { id: 'ac-m10', brandId: 'ac-blue-star', name: 'Blue Star 1.5 Ton Split AC', basePrice: 9000 },
    { id: 'ac-m11', brandId: 'ac-ogneral', name: 'O General 1.5 Ton Hyper Tropical AC', basePrice: 9500 },
    { id: 'ac-m12', brandId: 'ac-godrej', name: 'Godrej 5 Star 1.5 Ton Split AC', basePrice: 9000 },
    { id: 'ac-m13', brandId: 'ac-godrej', name: 'Godrej 3 Star 1.0 Ton Split AC', basePrice: 8600 },
    { id: 'ac-m14', brandId: 'ac-panasonic', name: 'Panasonic 1.5 Ton Smart Inverter AC', basePrice: 9000 },
    { id: 'ac-m15', brandId: 'ac-panasonic', name: 'Panasonic 2.0 Ton Shield Series AC', basePrice: 9600 },
    { id: 'ac-m16', brandId: 'ac-hitachi', name: 'Hitachi 1.5 Ton Yoshi Split AC', basePrice: 9100 },
    { id: 'ac-m17', brandId: 'ac-hitachi', name: 'Hitachi 1.0 Ton Shizuka Window AC', basePrice: 9000 },
    { id: 'ac-m18', brandId: 'ac-carrier', name: 'Carrier 1.5 Ton Octa Inverter AC', basePrice: 9000 },
    { id: 'ac-m19', brandId: 'ac-carrier', name: 'Carrier 1.5 Ton 3 Star Split AC', basePrice: 9000 },
    { id: 'ac-m20', brandId: 'ac-lloyd', name: 'Lloyd 1.5 Ton 5 Star Inverter Split AC', basePrice: 9000 },
    { id: 'ac-m21', brandId: 'ac-lloyd', name: 'Lloyd 1.0 Ton 3 Star Split AC', basePrice: 8600 },
    { id: 'ac-m22', brandId: 'ac-haier', name: 'Haier 1.5 Ton 5 Star Kinouchi Inverter AC', basePrice: 9000 },
    { id: 'ac-m23', brandId: 'ac-haier', name: 'Haier 1.0 Ton Inverter Split AC', basePrice: 8600 },
    { id: 'ac-m24', brandId: 'ac-whirlpool', name: 'Whirlpool 1.5 Ton Magicool Inverter Split AC', basePrice: 9000 },
    { id: 'ac-m25', brandId: 'ac-whirlpool', name: 'Whirlpool 1.0 Ton 3 Star Split AC', basePrice: 8600 },
    { id: 'ac-m26', brandId: 'ac-mitsubishi', name: 'Mitsubishi Electric 1.5 Ton 5 Star Inverter AC', basePrice: 9800 },
    { id: 'ac-m27', brandId: 'ac-mitsubishi', name: 'Mitsubishi Electric 2.0 Ton Split AC', basePrice: 10500 },
    { id: 'ac-m28', brandId: 'ac-cruise', name: 'Cruise 1.5 Ton 3 Star Inverter Split AC', basePrice: 9000 },
    { id: 'ac-m29', brandId: 'ac-cruise', name: 'Cruise 1.5 Ton 5 Star Inverter AC', basePrice: 9000 },
  ],
  Refrigerator: [
    { id: 'ref-m1', brandId: 'ref-samsung', name: 'Samsung 253L Double Door Refrigerator', basePrice: 1700 },
    { id: 'ref-m2', brandId: 'ref-samsung', name: 'Samsung 192L Single Door Refrigerator', basePrice: 1200 },
    { id: 'ref-m3', brandId: 'ref-samsung', name: 'Samsung 580L Side-by-Side Refrigerator', basePrice: 3500 },
    { id: 'ref-m4', brandId: 'ref-lg', name: 'LG 260L Smart Inverter Double Door', basePrice: 1700 },
    { id: 'ref-m5', brandId: 'ref-lg', name: 'LG 190L 4 Star Single Door', basePrice: 1200 },
    { id: 'ref-m6', brandId: 'ref-whirlpool', name: 'Whirlpool 265L 3 Star Refrigerator', basePrice: 1700 },
    { id: 'ref-m7', brandId: 'ref-haier', name: 'Haier 320L Bottom Mounted Double Door', basePrice: 1700 },
    { id: 'ref-m8', brandId: 'ref-godrej', name: 'Godrej 190L Direct Cool Refrigerator', basePrice: 1200 },
  ],
  Mobile: [
    { id: 'mob-m1', brandId: 'mob-apple', name: 'iPhone 15 Pro Max', basePrice: 65000 },
    { id: 'mob-m2', brandId: 'mob-apple', name: 'iPhone 14', basePrice: 35000 },
    { id: 'mob-m3', brandId: 'mob-apple', name: 'iPhone 13 Mini', basePrice: 22000 },
    { id: 'mob-m4', brandId: 'mob-apple', name: 'iPhone 11', basePrice: 12000 },
    { id: 'mob-m5', brandId: 'mob-samsung', name: 'Galaxy S24 Ultra', basePrice: 60000 },
    { id: 'mob-m6', brandId: 'mob-samsung', name: 'Galaxy S23 FE', basePrice: 28000 },
    { id: 'mob-m7', brandId: 'mob-samsung', name: 'Galaxy A54 5G', basePrice: 14000 },
    { id: 'mob-m8', brandId: 'mob-oneplus', name: 'OnePlus 12', basePrice: 38000 },
    { id: 'mob-m9', brandId: 'mob-oneplus', name: 'OnePlus Nord CE 3', basePrice: 12000 },
    { id: 'mob-m10', brandId: 'mob-google', name: 'Pixel 8 Pro', basePrice: 42000 },
    { id: 'mob-m11', brandId: 'mob-xiaomi', name: 'Xiaomi 13 Pro', basePrice: 26000 },
  ],
  WashingMachine: [
    { id: 'wm-m1', brandId: 'wm-lg', name: 'LG 7kg Fully Automatic Front Load', basePrice: 1500 },
    { id: 'wm-m2', brandId: 'wm-lg', name: 'LG 6.5kg Smart Inverter Top Load', basePrice: 1400 },
    { id: 'wm-m3', brandId: 'wm-samsung', name: 'Samsung 8kg Ecobubble Front Load', basePrice: 1500 },
    { id: 'wm-m4', brandId: 'wm-whirlpool', name: 'Whirlpool 7.5kg Royal Fully Automatic', basePrice: 1400 },
    { id: 'wm-m5', brandId: 'wm-ifb', name: 'IFB 8kg Senator Aqua Front Load', basePrice: 1500 },
    { id: 'wm-m6', brandId: 'wm-bosch', name: 'Bosch 7kg Series 4 Front Load', basePrice: 1500 },
    { id: 'wm-m7', brandId: 'wm-whirlpool', name: 'Whirlpool 8kg Semi-Automatic Washing Machine', basePrice: 1200 },
    { id: 'wm-m8', brandId: 'wm-lg', name: 'LG 7.5kg Semi-Automatic Washing Machine', basePrice: 1200 },
    { id: 'wm-m9', brandId: 'wm-samsung', name: 'Samsung 7kg Semi-Automatic Washing Machine', basePrice: 1200 },
  ],
  InverterBattery: [
    { id: 'ib-m1', brandId: 'ib-exide', name: 'Exide 150Ah Tall Tubular Battery', basePrice: 3200 },
    { id: 'ib-m2', brandId: 'ib-exide', name: 'Exide 200Ah Tall Tubular Battery', basePrice: 4200 },
    { id: 'ib-m3', brandId: 'ib-exide', name: 'Exide 100Ah Short Tubular Battery', basePrice: 2200 },
    { id: 'ib-m4', brandId: 'ib-luminous', name: 'Luminous 150Ah Red Charge Battery', basePrice: 3100 },
    { id: 'ib-m5', brandId: 'ib-luminous', name: 'Luminous 200Ah Red Charge Battery', basePrice: 4100 },
    { id: 'ib-m6', brandId: 'ib-amaron', name: 'Amaron Current 150Ah Battery', basePrice: 3200 },
    { id: 'ib-m7', brandId: 'ib-amaron', name: 'Amaron Current 200Ah Battery', basePrice: 4200 },
    { id: 'ib-m8', brandId: 'ib-okaya', name: 'Okaya 150Ah Tubular Battery', basePrice: 3000 },
    { id: 'ib-m9', brandId: 'ib-microtek', name: 'Microtek 150Ah Tubular Battery', basePrice: 3000 },
  ],
};

export const BANNERS: Banner[] = [
  {
    id: 'b1',
    title: 'Got an Old AC Gathering Dust?',
    subtitle: 'Sell it instantly on ScrapyGo! Get direct pickup & immediate payment transfer with no hassles.',
    image: 'https://i.pinimg.com/1200x/44/7f/84/447f84d557a05888931325a7cc2c9ec4.jpg',
    badge: 'Best Value Guaranteed',
    category: 'AC',
  },
  {
    id: 'b2',
    title: 'Upgrade Your Refrigerator Today',
    subtitle: 'Evaluate your old fridge in 3 steps. Free home pickup and personal handoff follow-up.',
    image: 'https://i.pinimg.com/736x/a9/fd/48/a9fd48857f02f519c4c8133796e1993a.jpg',
    badge: 'Eco-Friendly Recycling',
    category: 'Refrigerator',
  },
  {
    id: 'b3',
    title: 'Declutter and Sell Old Mobile Phones',
    subtitle: 'Get a top-dollar quotation for your used iPhones, OnePlus, or Samsung Galaxy devices.',
    image: 'https://i.pinimg.com/1200x/d0/23/65/d023653bd2f04845565e5a3c1bc9589d.jpg',
    badge: 'Instant Pricing',
    category: 'Mobile',
  },
  {
    id: 'b4',
    title: 'Easiest Way to Scrap Washing Machines',
    subtitle: 'Working or dead condition – we purchase and recycle all washing machines instantly.',
    image: 'https://i.pinimg.com/1200x/ce/ef/9f/ceef9ffbcf7cbbfbfe4a2d21eba9e88a.jpg',
    badge: 'Same Day Pickup',
    category: 'WashingMachine',
  },
  {
    id: 'b5',
    title: 'Scrap Your Old Inverter Batteries',
    subtitle: 'Earn maximum scrap value for dead or old Exide, Luminous, or Amaron inverter batteries.',
    image: 'https://i.pinimg.com/1200x/6b/44/0b/6b440b39696ee2b70fc34c54953f97f1.jpg',
    badge: 'Instant Cash for Scrap',
    category: 'InverterBattery',
  },
];
