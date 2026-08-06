import React, { useState, useEffect, useRef } from 'react';
import { 
  Smartphone, 
  Wind, 
  Snowflake, 
  RotateCw,
  Search, 
  User, 
  UserCheck,
  Phone, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Check, 
  ShieldCheck, 
  FileText, 
  LogOut, 
  Calendar, 
  X, 
  Zap, 
  Battery,
  Lock,
  MessageSquare, 
  Star,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  MapPin,
  Menu,
  Leaf,
  Building2,
  HelpCircle,
  Mail,
  Loader2,
  Flame,
  Droplets,
  Coffee,
  Shirt,
  Fan,
  Watch,
  Headphones,
  Laptop,
  Monitor,
  Plug,
  Cable,
  Radio,
  Tv,
  Image as ImageIcon,
  Maximize2,
  Eye,
  Download,
  Grid,
  Filter,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CategoryType, 
  BRANDS, 
  MODELS, 
  BANNERS, 
  EvaluationRequest, 
  DeviceModel, 
  Brand 
} from './types';
import { AdminDashboard } from './components/AdminDashboard';

const ADMIN_MOBILE_NUMBER = '7303319913';

export const isAdminUser = (user: { phone: string; name?: string } | null): boolean => {
  if (!user || !user.phone) return false;
  const digits = user.phone.replace(/[^\d]/g, '');
  return digits.endsWith(ADMIN_MOBILE_NUMBER) || digits === ADMIN_MOBILE_NUMBER;
};

async function safeFetchJson(url: string, options?: RequestInit) {
  const response = await fetch(url, options);
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.warn(`[API] Non-JSON response received from ${url}:`, text.slice(0, 100));
    throw new Error('Server returned a non-JSON response.');
  }
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

export const ALL_SCRAPYGO_IMAGES = [
  // Logos & Branding
  { id: 'img-scrapygo-main', name: 'ScrapyGo Official Mascot Logo', file: 'https://i.pinimg.com/1200x/af/44/c7/af44c7eb52433526439c20ff794b31fd.jpg', category: 'Brand & Logos', description: 'Primary ScrapyGo mascot logo mark.' },
  { id: 'img-1', name: 'ScrapyGo Official Logo', file: 'https://i.pinimg.com/1200x/af/44/c7/af44c7eb52433526439c20ff794b31fd.jpg', category: 'Brand & Logos', description: 'Official ScrapyGo platform vector branding & seal logo.' },
  { id: 'img-1b', name: 'ScrapyGo Vector Logo Variant', file: 'https://i.pinimg.com/1200x/af/44/c7/af44c7eb52433526439c20ff794b31fd.jpg', category: 'Brand & Logos', description: 'Alternate ScrapyGo vector logo mark.' },
  { id: 'img-1c', name: 'ScrapyGo Brand Mark', file: 'https://i.pinimg.com/1200x/af/44/c7/af44c7eb52433526439c20ff794b31fd.jpg', category: 'Brand & Logos', description: 'Primary ScrapyGo high-resolution JPEG branding seal.' },
  { id: 'img-1d', name: 'ScrapyGo Transparent Logo', file: 'https://i.pinimg.com/1200x/af/44/c7/af44c7eb52433526439c20ff794b31fd.jpg', category: 'Brand & Logos', description: 'Transparent PNG ScrapyGo logo mark.' },

  // Hero Banners
  { id: 'img-banner-ac', name: 'AC Scrap Hero Banner', file: 'https://i.pinimg.com/1200x/44/7f/84/447f84d557a05888931325a7cc2c9ec4.jpg', category: 'AC & Cooling', description: 'Hero banner for Air Conditioner scrap evaluation.' },
  { id: 'img-banner-ref', name: 'Refrigerator Scrap Hero Banner', file: 'https://i.pinimg.com/736x/a9/fd/48/a9fd48857f02f519c4c8133796e1993a.jpg', category: 'Refrigeration', description: 'Hero banner for refrigerator recycling and doorstep pickup.' },
  { id: 'img-banner-mob', name: 'Mobile Phone Scrap Hero Banner', file: 'https://i.pinimg.com/1200x/d0/23/65/d023653bd2f04845565e5a3c1bc9589d.jpg', category: 'Mobiles & Electronics', description: 'Hero banner for smartphone scrap and trade-in valuation.' },
  { id: 'img-banner-wm', name: 'Washing Machine Scrap Hero Banner', file: 'https://i.pinimg.com/1200x/ce/ef/9f/ceef9ffbcf7cbbfbfe4a2d21eba9e88a.jpg', category: 'Washing Machines', description: 'Hero banner for washing machine scrap recycling.' },
  { id: 'img-banner-bat', name: 'Inverter Battery Hero Banner', file: 'https://i.pinimg.com/1200x/6b/44/0b/6b440b39696ee2b70fc34c54953f97f1.jpg', category: 'Batteries & Heavy Scrap', description: 'Hero banner for dead inverter battery scrap payouts.' },
  { id: 'img-ac-jfif', name: 'Air Conditioner Cooling Unit', file: 'https://i.pinimg.com/1200x/44/7f/84/447f84d557a05888931325a7cc2c9ec4.jpg', category: 'AC & Cooling', description: 'Residential AC cooling coil unit.' },
  { id: 'img-ac1-jfif', name: 'AC Split Unit Display', file: 'https://i.pinimg.com/1200x/44/7f/84/447f84d557a05888931325a7cc2c9ec4.jpg', category: 'AC & Cooling', description: 'Split AC indoor blower and filter panel.' },

  // AC & Cooling
  { id: 'img-2', name: 'Air Conditioner Hero Banner JPG', file: 'https://i.pinimg.com/1200x/44/7f/84/447f84d557a05888931325a7cc2c9ec4.jpg', category: 'AC & Cooling', description: 'Hero banner showcasing residential window and split AC units.' },
  { id: 'img-3', name: 'Air Conditioner Category Icon', file: 'https://i.pinimg.com/1200x/44/7f/84/447f84d557a05888931325a7cc2c9ec4.jpg', category: 'AC & Cooling', description: 'Category catalog thumbnail for air conditioners.' },
  { id: 'img-3b', name: 'Air Conditioner Catalog Display', file: 'https://i.pinimg.com/1200x/44/7f/84/447f84d557a05888931325a7cc2c9ec4.jpg', category: 'AC & Cooling', description: 'High-res catalog display for air conditioners.' },
  { id: 'img-4', name: 'Split AC Outdoor & Indoor Scrap', file: 'https://i.pinimg.com/1200x/44/7f/84/447f84d557a05888931325a7cc2c9ec4.jpg', category: 'AC & Cooling', description: 'Split air conditioner indoor unit and copper coil compressor.' },

  // Refrigeration
  { id: 'img-5', name: 'Refrigerator Hero Banner', file: 'https://i.pinimg.com/736x/a9/fd/48/a9fd48857f02f519c4c8133796e1993a.jpg', category: 'Refrigeration', description: 'Hero banner for single and double door refrigerators.' },
  { id: 'img-5b', name: 'Refrigerator Scrap Header', file: 'https://i.pinimg.com/736x/a9/fd/48/a9fd48857f02f519c4c8133796e1993a.jpg', category: 'Refrigeration', description: 'HD refrigerator scrap recycling header.' },
  { id: 'img-6', name: 'Single Door Refrigerator', file: 'https://i.pinimg.com/736x/a9/fd/48/a9fd48857f02f519c4c8133796e1993a.jpg', category: 'Refrigeration', description: 'Single door 190L refrigerator scrap evaluation unit.' },
  { id: 'img-7', name: 'Double Door Refrigerator', file: 'https://i.pinimg.com/736x/a9/fd/48/a9fd48857f02f519c4c8133796e1993a.jpg', category: 'Refrigeration', description: 'Frost-free double door refrigerator scrap unit.' },

  // Mobiles & Electronics
  { id: 'img-8', name: 'Mobile Phone Hero Banner', file: 'https://i.pinimg.com/1200x/d0/23/65/d023653bd2f04845565e5a3c1bc9589d.jpg', category: 'Mobiles & Electronics', description: 'Hero banner for smartphone scrap and trade-in evaluation.' },
  { id: 'img-8b', name: 'Used Smartphone Scrap Header', file: 'https://i.pinimg.com/1200x/d0/23/65/d023653bd2f04845565e5a3c1bc9589d.jpg', category: 'Mobiles & Electronics', description: 'Smartphones and mobile devices header image.' },
  { id: 'img-9', name: 'Used Smartphones & Mobile Scrap', file: 'https://i.pinimg.com/1200x/d0/23/65/d023653bd2f04845565e5a3c1bc9589d.jpg', category: 'Mobiles & Electronics', description: 'Assorted used smartphones, Android devices, and iPhones.' },
  { id: 'img-19', name: 'Desktop Computer, CPU & Monitor', file: '/Computers.JPG', category: 'Mobiles & Electronics', description: 'Desktop PC tower cabinet, LCD monitor, and motherboard.' },
  { id: 'img-19b', name: 'Desktop PC Tower Cabinet', file: '/Computers.JPG', category: 'Mobiles & Electronics', description: 'Desktop PC tower cabinet and hardware components.' },
  { id: 'img-19c', name: 'Computers & PC Desktop System', file: '/Computers.JPG', category: 'Mobiles & Electronics', description: 'Desktop computers, CPU towers, and monitor setups.' },
  { id: 'img-25', name: 'Laptop Computer & Notebook PC', file: '/Laptops.JPG', category: 'Mobiles & Electronics', description: 'Sleek laptop computer scrap and motherboard.' },
  { id: 'img-25b', name: 'Notebook Laptop Variant', file: '/Laptops.JPG', category: 'Mobiles & Electronics', description: 'Compact laptop PC notebook scrap unit.' },
  { id: 'img-25c', name: 'Laptops & Workstation Notebooks', file: '/Laptops.JPG', category: 'Mobiles & Electronics', description: 'Portable laptops, notebooks, and ultrabook scrap units.' },
  { id: 'img-20', name: 'TWS Wireless Earbuds & Headphones', file: '/EarBuds.JPG', category: 'Mobiles & Electronics', description: 'Wireless Bluetooth earbuds and headphones.' },
  { id: 'img-20b', name: 'Bluetooth Earbuds Case', file: '/EarBuds.JPG', category: 'Mobiles & Electronics', description: 'TWS earbuds charging case and wireless earphones.' },
  { id: 'img-20c', name: 'Wireless Bluetooth EarBuds', file: '/EarBuds.JPG', category: 'Mobiles & Electronics', description: 'High-definition wireless bluetooth earbuds and charging case.' },
  { id: 'img-31', name: 'Smartwatch & Fitness Band', file: '/Watch.JPG', category: 'Mobiles & Electronics', description: 'AMOLED smartwatch and fitness tracker band.' },
  { id: 'img-31b', name: 'Fitness Smartwatch Variant', file: '/Watch.JPG', category: 'Mobiles & Electronics', description: 'Smart fitness tracker band and watch casing.' },
  { id: 'img-31c', name: 'Smart Watch & Fitness Tracker Band', file: '/Watch.JPG', category: 'Mobiles & Electronics', description: 'Smart watch unit with fitness tracking and heart rate sensors.' },

  // Washing Machines
  { id: 'img-10', name: 'Washing Machine Hero Banner', file: 'https://i.pinimg.com/1200x/ce/ef/9f/ceef9ffbcf7cbbfbfe4a2d21eba9e88a.jpg', category: 'Washing Machines', description: 'Hero banner for top load and front load washing machines.' },
  { id: 'img-10b', name: 'Washing Machine Header Display', file: 'https://i.pinimg.com/1200x/ce/ef/9f/ceef9ffbcf7cbbfbfe4a2d21eba9e88a.jpg', category: 'Washing Machines', description: 'Top load and front load washing machine photo.' },
  { id: 'img-10c', name: 'Washing Machine Scrap Banner', file: 'https://i.pinimg.com/1200x/ce/ef/9f/ceef9ffbcf7cbbfbfe4a2d21eba9e88a.jpg', category: 'Washing Machines', description: 'Washing machine scrap evaluation header.' },
  { id: 'img-11', name: 'Top Load Automatic Washing Machine', file: 'https://i.pinimg.com/1200x/ce/ef/9f/ceef9ffbcf7cbbfbfe4a2d21eba9e88a.jpg', category: 'Washing Machines', description: 'Fully automatic top load washing machine scrap unit.' },
  { id: 'img-12', name: 'Front Load Washing Machine', file: 'https://i.pinimg.com/1200x/ce/ef/9f/ceef9ffbcf7cbbfbfe4a2d21eba9e88a.jpg', category: 'Washing Machines', description: 'Front load inverter washing machine scrap unit.' },

  // Batteries & Heavy Scrap
  { id: 'img-13', name: 'Inverter Battery Hero Banner', file: 'https://i.pinimg.com/1200x/6b/44/0b/6b440b39696ee2b70fc34c54953f97f1.jpg', category: 'Batteries & Heavy Scrap', description: 'Hero banner for dead and old inverter battery scrap.' },
  { id: 'img-13b', name: 'Inverter Battery Lead-Acid Header', file: 'https://i.pinimg.com/1200x/6b/44/0b/6b440b39696ee2b70fc34c54953f97f1.jpg', category: 'Batteries & Heavy Scrap', description: 'Dead inverter battery recycling banner.' },
  { id: 'img-14', name: 'Heavy Duty Lead-Acid Inverter Battery', file: 'https://i.pinimg.com/1200x/6b/44/0b/6b440b39696ee2b70fc34c54953f97f1.jpg', category: 'Batteries & Heavy Scrap', description: '150Ah lead-acid inverter battery scrap unit.' },
  { id: 'img-14b', name: 'Inverter Batteries Scrap Unit', file: 'https://i.pinimg.com/1200x/6b/44/0b/6b440b39696ee2b70fc34c54953f97f1.jpg', category: 'Batteries & Heavy Scrap', description: 'Heavy-duty lead-acid inverter batteries scrap unit.' },

  // Home Appliances
  { id: 'img-15', name: 'HEPA Room Air Purifier', file: '/Air Purifiers.JPG', category: 'Home Appliances', description: 'Smart room air purifier with HEPA filter.' },
  { id: 'img-15b', name: 'Room Air Purifier Unit', file: '/Air Purifiers.JPG', category: 'Home Appliances', description: 'Room air purifier with filtration unit.' },
  { id: 'img-15c', name: 'Compact Room Air Purifier', file: '/Air Purifiers.JPG', category: 'Home Appliances', description: 'Compact HEPA room air purifier unit.' },
  { id: 'img-15d', name: 'Air Purifiers HEPA System', file: '/Air Purifiers.JPG', category: 'Home Appliances', description: 'Room air purifiers with multi-stage HEPA filtration.' },
  { id: 'img-17', name: 'Ceiling Fan & High-Speed Motors', file: '/Celling Fan.JPG', category: 'Home Appliances', description: 'BLDC motor high-speed ceiling fan scrap.' },
  { id: 'img-17b', name: 'Ceiling Fan Blades & Motor', file: '/Celling Fan.JPG', category: 'Home Appliances', description: 'Ceiling fan assembly and motor coil.' },
  { id: 'img-17c', name: 'High-Speed Ceiling Fan Variant', file: '/Celling Fan.JPG', category: 'Home Appliances', description: 'High-speed 3-blade ceiling fan scrap unit.' },
  { id: 'img-17d', name: 'Ceiling Fan High-Speed Motor', file: '/Celling Fan.JPG', category: 'Home Appliances', description: 'Ceiling fan motor casing, copper windings, and canopy.' },
  { id: 'img-18', name: 'Clothes Tumble Dryer', file: '/Cloth Dryers.JPG', category: 'Home Appliances', description: 'Tumble heat-pump clothes dryer scrap.' },
  { id: 'img-18b', name: 'Clothes Dryer Machine', file: '/Cloth Dryers.JPG', category: 'Home Appliances', description: 'Electric tumble clothes dryer appliance.' },
  { id: 'img-18c', name: 'Cloth Dryers Tumble Appliance', file: '/Cloth Dryers.JPG', category: 'Home Appliances', description: 'Tumble cloth dryers and heat-pump laundry appliance.' },
  { id: 'img-21', name: 'Electric Steam & Dry Clothing Iron', file: '/Electric Irons.JPG', category: 'Home Appliances', description: 'Steam clothing iron and heating plate.' },
  { id: 'img-21b', name: 'Steam Clothing Iron Unit', file: '/Electric Irons.JPG', category: 'Home Appliances', description: 'Electric dry and steam clothing iron.' },
  { id: 'img-21c', name: 'Heating Plate Clothing Iron', file: '/Electric Irons.JPG', category: 'Home Appliances', description: 'Clothing iron heating plate unit.' },
  { id: 'img-21d', name: 'Electric Irons Steam & Dry Unit', file: '/Electric Irons.JPG', category: 'Home Appliances', description: 'Heavy-duty electric irons with non-stick soleplate.' },
  { id: 'img-23', name: 'Storage & Instant Water Geyser', file: '/Geyser.JPG', category: 'Home Appliances', description: '15L electric storage water heater geyser.' },
  { id: 'img-23b', name: 'Instant Water Heater Geyser', file: '/Geyser.JPG', category: 'Home Appliances', description: 'Instant electric water heater geyser unit.' },
  { id: 'img-23c', name: 'Geyser Instant Water Heater Unit', file: '/Geyser.JPG', category: 'Home Appliances', description: 'Electric instant water heater geyser with safety valve.' },
  { id: 'img-30', name: 'Canister Vacuum Cleaner', file: '/Vacuum Cleaners.JPG', category: 'Home Appliances', description: 'High-suction bagless vacuum cleaner.' },
  { id: 'img-30b', name: 'Bagless Vacuum Cleaner Unit', file: '/Vacuum Cleaners.JPG', category: 'Home Appliances', description: 'Compact canister vacuum cleaner unit.' },
  { id: 'img-30c', name: 'Vacuum Cleaners Suction Appliance', file: '/Vacuum Cleaners.JPG', category: 'Home Appliances', description: 'High-power vacuum cleaners with canister and flexible hose.' },

  // Kitchen Appliances
  { id: 'img-22', name: 'Electric Stainless Steel Kettle', file: '/Electric Kettles.JPG', category: 'Kitchen Appliances', description: 'Rapid boiling stainless steel electric kettle.' },
  { id: 'img-22b', name: 'Rapid Boiling Electric Kettle', file: '/Electric Kettles.JPG', category: 'Kitchen Appliances', description: 'Cordless stainless steel electric kettle.' },
  { id: 'img-22c', name: 'Electric Glass Kettle Variant', file: '/Electric Kettles.JPG', category: 'Kitchen Appliances', description: 'Glass body electric kettle appliance.' },
  { id: 'img-22d', name: 'Electric Kettles Boiling Unit', file: '/Electric Kettles.JPG', category: 'Kitchen Appliances', description: 'Rapid boiling electric kettles with auto shut-off.' },
  { id: 'img-24', name: 'Touch Control Induction Cooktop', file: '/induction cooktops.JPG', category: 'Kitchen Appliances', description: 'Infrared induction stove cooktop.' },
  { id: 'img-24b', name: 'Digital Induction Stove', file: '/induction cooktops.JPG', category: 'Kitchen Appliances', description: 'Digital push button induction cooktop.' },
  { id: 'img-24c', name: 'Induction Cooktops Stove', file: '/induction cooktops.JPG', category: 'Kitchen Appliances', description: 'Induction cooktops with digital panel and glass top.' },
  { id: 'img-26', name: 'Convection Microwave Oven', file: 'https://i.pinimg.com/1200x/57/2a/d3/572ad31e401ad04605c7ea34eae75b05.jpg', category: 'Kitchen Appliances', description: 'Solo and convection microwave oven scrap.' },
  { id: 'img-26b', name: 'Solo Microwave Oven Unit', file: 'https://i.pinimg.com/1200x/57/2a/d3/572ad31e401ad04605c7ea34eae75b05.jpg', category: 'Kitchen Appliances', description: 'Countertop solo microwave oven.' },
  { id: 'img-26c', name: 'Microwaves Solo & Convection Unit', file: 'https://i.pinimg.com/1200x/57/2a/d3/572ad31e401ad04605c7ea34eae75b05.jpg', category: 'Kitchen Appliances', description: 'Countertop solo and convection microwave oven units.' },
  { id: 'img-27', name: 'Mixer Grinder & Juicer Appliance', file: '/Mixer.JPG', category: 'Kitchen Appliances', description: 'Heavy 750W mixer grinder and stainless steel jars.' },
  { id: 'img-27b', name: 'Mixer Grinder Jars Assembly', file: '/Mixer.JPG', category: 'Kitchen Appliances', description: 'Mixer grinder motor base and stainless steel jars.' },
  { id: 'img-27c', name: 'Mixer Grinders & Jars Unit', file: '/Mixer.JPG', category: 'Kitchen Appliances', description: 'Mixer grinder motor base with stainless steel jars.' },
  { id: 'img-28', name: 'Electric Oven & OTG Toaster', file: 'https://i.pinimg.com/1200x/29/df/09/29df091823c3f529e4bbc297fdd77941.jpg', category: 'Kitchen Appliances', description: 'Baking electric oven and OTG grill.' },
  { id: 'img-28b', name: 'OTG Baking Oven Variant', file: 'https://i.pinimg.com/1200x/29/df/09/29df091823c3f529e4bbc297fdd77941.jpg', category: 'Kitchen Appliances', description: 'Compact electric OTG baking oven.' },
  { id: 'img-28c', name: 'Ovens Electric OTG Baking Unit', file: 'https://i.pinimg.com/1200x/29/df/09/29df091823c3f529e4bbc297fdd77941.jpg', category: 'Kitchen Appliances', description: 'Electric OTG baking ovens and grill toaster.' },
  { id: 'img-29', name: 'Pop-Up Sandwich Toaster', file: '/Toaster.JPG', category: 'Kitchen Appliances', description: 'Non-stick dual slot sandwich toaster.' },
  { id: 'img-29b', name: 'Dual Slot Sandwich Toaster', file: '/Toaster.JPG', category: 'Kitchen Appliances', description: 'Pop-up dual slot sandwich toaster.' },
  { id: 'img-29c', name: 'Toaster Sandwich Maker Unit', file: '/Toaster.JPG', category: 'Kitchen Appliances', description: 'Pop-up dual slot sandwich toaster appliance.' },
  { id: 'img-32', name: 'RO + UV Water Purifier System', file: '/Water Purifiers.JPG', category: 'Kitchen Appliances', description: 'Multi-stage RO water purifier with storage tank.' },
  { id: 'img-32b', name: 'Water Purifiers Multi-Stage RO Unit', file: '/Water Purifiers.JPG', category: 'Kitchen Appliances', description: 'RO + UV water purifiers with storage water tank.' },

  // Cables & Wiring
  { id: 'img-16', name: 'Copper Cables & Electrical Wire Scrap', file: '/Data Cables.JPG', category: 'Cables & Wiring', description: 'Heavy copper wiring bundles and electrical cords.' },
  { id: 'img-16b', name: 'Electrical Copper Wire Bundle', file: '/Data Cables.JPG', category: 'Cables & Wiring', description: 'Insulated copper cable and wire bundle.' },
  { id: 'img-16c', name: 'Data Cables & USB Wire Bundles', file: '/Data Cables.JPG', category: 'Cables & Wiring', description: 'Type-C, Micro-USB, and Lightning data cable bundles.' },
  { id: 'img-33', name: 'Fast Wall Charger & Power Adapters', file: '/Data Cables.JPG', category: 'Cables & Wiring', description: 'Type-C fast wall chargers and USB power adapters.' },
  { id: 'img-33b', name: 'USB Power Adapter & Fast Charger', file: '/Data Cables.JPG', category: 'Cables & Wiring', description: 'Type-C fast wall charger and power adapter unit.' },

  // Regenerated & Platform Visuals
  { id: 'img-regen-1', name: 'ScrapyGo Platform Feature Banner', file: 'https://i.pinimg.com/1200x/af/44/c7/af44c7eb52433526439c20ff794b31fd.jpg', category: 'Brand & Logos', description: 'ScrapyGo official regenerated platform artwork.' }
];

export default function App() {
  // Application State
  const [currentUser, setCurrentUser] = useState<{ phone: string; name?: string } | null>(() => {
    const savedUser = localStorage.getItem('scrapygo_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [evaluationHistory, setEvaluationHistory] = useState<EvaluationRequest[]>(() => {
    const savedHistory = localStorage.getItem('scrapygo_history');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

      
  // UI Navigation / Tab State
  const [activeTab, setActiveTab] = useState<'home' | 'sell-journey' | 'dashboard' | 'about-us' | 'partners' | 'faq' | 'contact' | 'admin-panel' | 'gallery'>('home');
  const [galleryCategory, setGalleryCategory] = useState<string>('All');
  const [gallerySearch, setGallerySearch] = useState<string>('');
  const [lightboxImage, setLightboxImage] = useState<{ name: string; file: string; category: string; description?: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DeviceModel[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('AC');
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedCity, setSelectedCity] = useState<'Delhi NCR' | 'Mumbai' | 'Bangalore' | 'Pune' | 'Hyderabad' | 'Chennai' | 'Kolkata'>(() => {
    const savedCity = localStorage.getItem('scrapygo_city');
    return (savedCity as any) || 'Delhi NCR';
  });
  const [showCityModal, setShowCityModal] = useState(false);
  
  // Custom toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sliding Banner State
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Selling Journey Step State
  // Steps: 1 = Brand/Model, 2 = Phone/OTP, 3 = Questionnaire, 4 = Price Generation, 5 = Ready for Pickup Summary
  const [journeyStep, setJourneyStep] = useState(1);
  const [journeyBrand, setJourneyBrand] = useState<Brand | null>(null);
  const [journeyModel, setJourneyModel] = useState<DeviceModel | null>(null);
  
  // OTP / Auth Form State
  const [loginPhone, setLoginPhone] = useState('');
  const [loginName, setLoginName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [sandboxCode, setSandboxCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Questionnaire States
  const [acType, setAcType] = useState<'AC Split' | 'AC Window'>('AC Split');
  const [condition, setCondition] = useState<'excellent' | 'good' | 'average' | 'poor'>('good');
  const [capacity, setCapacity] = useState('1.5 Ton');
  const [energyRating, setEnergyRating] = useState('3 Star');
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  
  // Custom specifications based on active category
  const [fridgeCapacity, setFridgeCapacity] = useState('250L');
  const [fridgeType, setFridgeType] = useState('Double Door');
  const [phoneStorage, setPhoneStorage] = useState('128GB');
  const [wmCapacity, setWmCapacity] = useState('7 kg');
  const [wmType, setWmType] = useState('Fully Automatic Front Load');
  const [batteryCapacity, setBatteryCapacity] = useState('150 Ah');
  const [batteryType, setBatteryType] = useState('Tall Tubular');

  // Final Estimated Price State
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [evaluationId, setEvaluationId] = useState('');

  // Form fields for address/pickup details
  const [showPickupForm, setShowPickupForm] = useState(false);
  const [pickupName, setPickupName] = useState(() => currentUser?.name || '');
  const [pickupPhone, setPickupPhone] = useState(() => currentUser?.phone || '');
  const [pickupAddress, setPickupAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Synchronize with currentUser changes
  useEffect(() => {
    if (currentUser) {
      if (!pickupName) setPickupName(currentUser.name || '');
      if (!pickupPhone) setPickupPhone(currentUser.phone || '');
    }
  }, [currentUser]);
  
  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    setLocationError('');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            if (data && data.display_name) {
              setPickupAddress(data.display_name);
            }
          } catch (err) {
            setLocationError('Could not fetch address details.');
          } finally {
            setIsLocating(false);
          }
        },
        (error) => {
          setLocationError('Location access denied or unavailable.');
          setIsLocating(false);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLocating(false);
    }
  };

  const handleCompleteBooking = (name: string, phone: string, address: string) => {
    if (!journeyModel || !currentUser) return;
    const newRequest: EvaluationRequest = {
      id: evaluationId,
      category: selectedCategory,
      brand: journeyBrand?.name || 'Generic',
      model: journeyModel.name,
      condition: condition,
      capacity: selectedCategory === 'AC' ? capacity : selectedCategory === 'Refrigerator' ? fridgeCapacity : selectedCategory === 'InverterBattery' ? batteryCapacity : undefined,
      energyRating: selectedCategory === 'AC' ? energyRating : undefined,
      issues: [...selectedIssues],
      estimatedPrice: estimatedPrice,
      phone: currentUser.phone,
      status: 'Pending Pickup',
      customerName: name,
      
      customerAddress: address,
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    const updatedHistory = [newRequest, ...evaluationHistory];
    localStorage.setItem('scrapygo_history', JSON.stringify(updatedHistory));
    setEvaluationHistory(updatedHistory);

    setJourneyStep(5);
    handleWhatsAppCheckout(newRequest);
  };
  
  // Search Input Handler
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const query = searchQuery.toLowerCase();
      const matched: DeviceModel[] = [];
      Object.keys(MODELS).forEach((cat) => {
        if (cat === 'Mobile') return; // Skip Mobile Phones as the category is inactive
        MODELS[cat as CategoryType].forEach((model) => {
          if (model.name.toLowerCase().includes(query)) {
            matched.push(model);
          }
        });
      });
      setSearchResults(matched);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Sliding Banner Carousel Automation
  useEffect(() => {
    if (journeyModel && selectedCategory === 'AC') {
      const name = journeyModel.name;
      if (name.includes('1.0 Ton')) {
        setCapacity('1.0 Ton');
      } else if (name.includes('2.0 Ton')) {
        setCapacity('2.0 Ton');
      } else {
        setCapacity('1.5 Ton');
      }

      if (name.includes('5 Star')) {
        setEnergyRating('5 Star');
      } else if (name.includes('3 Star')) {
        setEnergyRating('3 Star');
      } else {
        setEnergyRating('Other');
      }
    }
  }, [journeyModel?.id, selectedCategory]);

  useEffect(() => {
    startBannerTimer();
    return () => stopBannerTimer();
  }, [currentBannerIndex]);

  const startBannerTimer = () => {
    stopBannerTimer();
    bannerTimerRef.current = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % BANNERS.length);
    }, 6000);
  };

  const stopBannerTimer = () => {
    if (bannerTimerRef.current) {
      clearInterval(bannerTimerRef.current);
    }
  };

  // OTP Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Dynamic Price Calculator Engine
  const calculatePrice = (model: DeviceModel, cat: CategoryType) => {
    if (cat === 'AC') {
      let finalPrice = 5500; // default for 1.5 Ton, Good condition

      // Detect capacity
      let detectedCapacity = capacity || '1.5 Ton';

      if (detectedCapacity === '0.8 Ton' || detectedCapacity === '1.0 Ton') {
        if (condition === 'excellent') finalPrice = 5000;
        else if (condition === 'good') finalPrice = 4500;
        else if (condition === 'average') finalPrice = 4100;
        else if (condition === 'poor') finalPrice = 4000;
        else finalPrice = 4500;
      } else if (detectedCapacity === '2.0 Ton' || detectedCapacity === '2.0+ Ton') {
        if (condition === 'excellent') finalPrice = 8000;
        else if (condition === 'good') finalPrice = 7500;
        else if (condition === 'average') finalPrice = 7100;
        else if (condition === 'poor') finalPrice = 7000;
        else finalPrice = 7500;
      } else {
        // Default to 1.5 Ton
        if (condition === 'excellent') finalPrice = 6500;
        else if (condition === 'good') finalPrice = 5500;
        else if (condition === 'average') finalPrice = 4600;
        else if (condition === 'poor') finalPrice = 4500;
        else finalPrice = 5500;
      }

      // AC Split vs AC Window adjustment
      if (acType === 'AC Split') {
        finalPrice += 500;
      }

      // Star rating adjustment
      if (energyRating === '5 Star' || energyRating === 'Inverter AC') {
        finalPrice += 300;
      } else if (energyRating === '4 Star') {
        finalPrice += 150;
      } else if (energyRating === '1 Star' || energyRating === '2 Star') {
        finalPrice -= 200;
      }

      return finalPrice;
    }

    if (cat === 'Refrigerator') {
      let detectedType = fridgeType || 'Double Door';
      if (model && model.name) {
        const lowerName = model.name.toLowerCase();
        if (lowerName.includes('single') || lowerName.includes('direct cool') || lowerName.includes('190l') || lowerName.includes('192l')) {
          detectedType = 'Single Door';
        } else if (lowerName.includes('side-by-side') || lowerName.includes('580l')) {
          detectedType = 'Side-by-Side';
        } else if (lowerName.includes('double') || lowerName.includes('bottom mounted') || lowerName.includes('253l') || lowerName.includes('260l') || lowerName.includes('265l') || lowerName.includes('320l')) {
          detectedType = 'Double Door';
        }
      }

      let finalPrice = 1700;
      let minPriceForType = 1400;
      if (detectedType === 'Single Door') {
        minPriceForType = 800;
        if (condition === 'excellent') finalPrice = 1500;
        else if (condition === 'good') finalPrice = 1200;
        else if (condition === 'average') finalPrice = 900;
        else if (condition === 'poor') finalPrice = 800;
      } else if (detectedType === 'Double Door') {
        minPriceForType = 1400;
        if (condition === 'excellent') finalPrice = 2500;
        else if (condition === 'good') finalPrice = 1700;
        else if (condition === 'average') finalPrice = 1500;
        else if (condition === 'poor') finalPrice = 1400;
      } else if (detectedType === 'Side-by-Side') {
        minPriceForType = 2500;
        if (condition === 'excellent') finalPrice = 5000;
        else if (condition === 'good') finalPrice = 3500;
        else if (condition === 'average') finalPrice = 2700;
        else if (condition === 'poor') finalPrice = 2500;
      }

      // Small deduction for specific issues, but clamp to poor price
      const issueDeduction = selectedIssues.length * 50;
      const priceWithDeductions = finalPrice - issueDeduction;
      
      return Math.max(minPriceForType, priceWithDeductions);
    }

    if (cat === 'WashingMachine') {
      let detectedType = wmType || 'Top Load Fully Automatic';
      if (model && model.name) {
        const lowerName = model.name.toLowerCase();
        if (lowerName.includes('semi-automatic') || lowerName.includes('semi')) {
          detectedType = 'Semi-Automatic';
        } else if (lowerName.includes('top load')) {
          detectedType = 'Top Load Fully Automatic';
        } else if (lowerName.includes('front load')) {
          detectedType = 'Front Load Fully Automatic';
        }
      }

      let finalPrice = 1400;
      let minPriceForType = 1000;
      if (detectedType === 'Semi-Automatic') {
        minPriceForType = 800;
        if (condition === 'excellent') finalPrice = 1500;
        else if (condition === 'good') finalPrice = 1200;
        else if (condition === 'average') finalPrice = 900;
        else if (condition === 'poor') finalPrice = 800;
      } else if (detectedType === 'Top Load Fully Automatic') {
        minPriceForType = 1000;
        if (condition === 'excellent') finalPrice = 1700;
        else if (condition === 'good') finalPrice = 1400;
        else if (condition === 'average') finalPrice = 1100;
        else if (condition === 'poor') finalPrice = 1000;
      } else if (detectedType === 'Front Load Fully Automatic') {
        minPriceForType = 1200;
        if (condition === 'excellent') finalPrice = 2000;
        else if (condition === 'good') finalPrice = 1500;
        else if (condition === 'average') finalPrice = 1300;
        else if (condition === 'poor') finalPrice = 1200;
      }

      // Small deduction for specific issues, but clamp to poor price
      const issueDeduction = selectedIssues.length * 50;
      const priceWithDeductions = finalPrice - issueDeduction;
      
      return Math.max(minPriceForType, priceWithDeductions);
    }

    if (cat === 'InverterBattery') {
      let finalPrice = 3200; // default for 150 Ah Tall Tubular, Good condition

      let detectedCapacity = batteryCapacity || '150 Ah';
      let detectedType = batteryType || 'Tall Tubular';

      if (model && model.name) {
        const nameLower = model.name.toLowerCase();
        if (nameLower.includes('100ah') || nameLower.includes('100 ah')) {
          detectedCapacity = '100 Ah';
        } else if (nameLower.includes('200ah') || nameLower.includes('200 ah')) {
          detectedCapacity = '200 Ah';
        } else {
          detectedCapacity = '150 Ah';
        }

        if (nameLower.includes('short tubular') || nameLower.includes('short')) {
          detectedType = 'Short Tubular';
        } else if (nameLower.includes('flat plate') || nameLower.includes('flat')) {
          detectedType = 'Flat Plate';
        } else {
          detectedType = 'Tall Tubular';
        }
      }

      let minPriceForType = 1500;
      if (detectedCapacity === '100 Ah') {
        minPriceForType = 1500;
        if (condition === 'excellent') finalPrice = 2800;
        else if (condition === 'good') finalPrice = 2200;
        else if (condition === 'average') finalPrice = 1800;
        else if (condition === 'poor') finalPrice = 1500;
      } else if (detectedCapacity === '200 Ah') {
        minPriceForType = 3000;
        if (condition === 'excellent') finalPrice = 5000;
        else if (condition === 'good') finalPrice = 4200;
        else if (condition === 'average') finalPrice = 3600;
        else if (condition === 'poor') finalPrice = 3000;
      } else {
        // 150 Ah
        minPriceForType = 2200;
        if (condition === 'excellent') finalPrice = 3800;
        else if (condition === 'good') finalPrice = 3200;
        else if (condition === 'average') finalPrice = 2600;
        else if (condition === 'poor') finalPrice = 2200;
      }

      if (detectedType === 'Short Tubular') {
        finalPrice -= 200;
      } else if (detectedType === 'Flat Plate') {
        finalPrice -= 400;
      }

      // Specific flaws deduction
      const issueDeduction = selectedIssues.length * 150;
      const priceWithDeductions = finalPrice - issueDeduction;

      return Math.max(800, priceWithDeductions);
    }

    let price = model.basePrice;

    // 1. Condition Modifier
    if (condition === 'excellent') price *= 1.15;
    else if (condition === 'good') price *= 1.0;
    else if (condition === 'average') price *= 0.75;
    else if (condition === 'poor') price *= 0.45;

    // 2. Category specific customization multipliers/add-ons
    if (cat === 'Mobile') {
      if (phoneStorage === '256GB') price += 1500;
      else if (phoneStorage === '512GB' || phoneStorage === '1TB') price += 4000;
      else if (phoneStorage === '64GB') price -= 1000;

      // Issues
      if (selectedIssues.includes('Screen cracked or touch dead')) price -= 4000;
      if (selectedIssues.includes('Back glass broken')) price -= 1500;
      if (selectedIssues.includes('Camera blurry/broken')) price -= 1200;
      if (selectedIssues.includes('Battery health below 75%')) price -= 800;
      if (selectedIssues.includes('No box or original charger')) price -= 500;
    }

    // Minimum scrap floor price is always maintained
    const floorPrice = model.basePrice * 0.15;
    return Math.max(Math.round(price), Math.round(floorPrice));
  };

  // Direct AC Variant Selection
  const selectAcTypeAndNavigate = (type: 'AC Split' | 'AC Window') => {
    setAcType(type);
    setSelectedCategory('AC');
    const defaultBrand = BRANDS.AC[0];
    const defaultModel = MODELS.AC.find(m => 
      type === 'AC Split' ? m.name.toLowerCase().includes('split') : m.name.toLowerCase().includes('window')
    ) || MODELS.AC[0];
    setJourneyBrand(defaultBrand);
    setJourneyModel({
      ...defaultModel,
      name: `${type} (${capacity}, ${energyRating})`
    });
    setSelectedIssues([]);
    setCondition('good');
    setShowPickupForm(false);
    setPickupAddress('');
    setActiveTab('sell-journey');
    setJourneyStep(3); // Directly take user to Device Evaluation page
  };

  // Launch Selling Journey
  const startJourney = (category: CategoryType) => {
    if (category === 'Mobile') return; // Mobile Phones category is inactive
    setSelectedCategory(category);
    setJourneyBrand(null);
    setJourneyModel(null);
    setSelectedIssues([]);
    setCondition('good');
    setJourneyStep(1);
    setShowPickupForm(false);
    setPickupAddress('');
    setActiveTab('sell-journey');
  };

  // Directly select a model from search
  const selectSearchedModel = (model: DeviceModel, category: CategoryType) => {
    if (category === 'Mobile') return; // Mobile Phones category is inactive
    setSelectedCategory(category);
    const brandObj = BRANDS[category].find(b => b.id === model.brandId) || null;
    setJourneyBrand(brandObj);
    setJourneyModel(model);
    setSelectedIssues([]);
    setCondition('good');
    setJourneyStep(currentUser ? 3 : 2); // Skip OTP if already logged in
    setShowPickupForm(false);
    setPickupAddress('');
    setSearchQuery('');
    setActiveTab('sell-journey');
  };

  // Strict 10-digit active mobile validation helper
  const validateActiveMobileNumber = (digits: string, code: string = countryCode) => {
    const cleaned = (digits || '').replace(/[^\d]/g, '');

    if (!cleaned) {
      return { valid: false, error: 'Mobile number is required.' };
    }

    if (cleaned.length !== 10) {
      return { valid: false, error: 'Please enter a valid, active 10-digit mobile number.' };
    }

    // Reject dummy repeating numbers (e.g., 0000000000, 1111111111, 9999999999)
    if (/^(\d)\1{9}$/.test(cleaned)) {
      return { valid: false, error: 'Invalid mobile number. Repeating dummy numbers (e.g., 0000000000) are not active mobile numbers.' };
    }

    // Reject invalid sequential dummy numbers
    if (cleaned === '1234567890' || cleaned === '0123456789') {
      return { valid: false, error: 'Invalid mobile number. Please enter a valid, active 10-digit mobile number.' };
    }

    // Active series validation by country code
    if (code === '+91') {
      if (!/^[6-9]\d{9}$/.test(cleaned)) {
        return { valid: false, error: 'Active Indian mobile numbers must be 10 digits starting with 6, 7, 8, or 9.' };
      }
    } else {
      if (!/^[2-9]\d{9}$/.test(cleaned)) {
        return { valid: false, error: 'Active mobile numbers must be 10 digits starting with a valid subscriber series (2-9).' };
      }
    }

    return { valid: true, cleanedDigits: cleaned };
  };

  // Send OTP handler
  const handleSendOtpForAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');

    const phoneValidation = validateActiveMobileNumber(loginPhone, countryCode);
    if (!phoneValidation.valid) {
      setOtpError(phoneValidation.error || 'Please enter a valid, active 10-digit mobile number.');
      return;
    }

    const cleanedDigits = phoneValidation.cleanedDigits!;
    const fullPhone = `${countryCode}${cleanedDigits}`;

    if (authMode === 'signup') {
      if (!loginName || loginName.trim().length === 0) {
        setOtpError('Please enter your Full Name.');
        return;
      }

      let emailVal = signupEmail.trim();
      if (!emailVal) {
        setOtpError('Please enter your Gmail ID.');
        return;
      }

      if (!emailVal.includes('@')) {
        emailVal = `${emailVal}@gmail.com`;
        setSignupEmail(emailVal);
      }

      if (!emailVal.toLowerCase().endsWith('@gmail.com')) {
        setOtpError('Sign Up requires a valid Gmail address ending with @gmail.com.');
        return;
      }

      if (!termsAccepted) {
        setOtpError('You must agree to the Terms and Conditions to sign up.');
        return;
      }
    }

    setIsSendingOtp(true);
    try {
      let data: any;
      try {
        const res = await safeFetchJson('/api/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: fullPhone })
        });
        data = res.data;
      } catch (fetchErr) {
        console.warn("API server unreachable, generating offline fallback code:", fetchErr);
        const genCode = Math.floor(1000 + Math.random() * 9000).toString();
        data = { success: true, code: genCode, sandbox: true };
      }

      if (data && data.success) {
        setOtpSent(true);
        setSandboxCode(data.code || '1234');
        setOtpCode('');
        showToast(`Verification code sent to ${countryCode} ${cleanedDigits}`);
      } else {
        setOtpError(data?.error || 'Failed to send verification code. Please try again.');
      }
    } catch (err: any) {
      setOtpError('Error: ' + (err.message || String(err)));
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP handler
  const handleVerifyOtpForAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');

    if (!otpCode || otpCode.trim().length === 0) {
      setOtpError('Please enter the 4-digit verification code.');
      return;
    }

    const cleanedDigits = loginPhone.replace(/[^\d]/g, '');
    const fullPhone = `${countryCode}${cleanedDigits}`;

    setIsVerifyingOtp(true);

    try {
      let verifyOk = false;
      try {
        const res = await safeFetchJson('/api/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: fullPhone, code: otpCode.trim() })
        });
        if (res.data && res.data.success) {
          verifyOk = true;
        } else {
          setOtpError(res.data?.error || 'Invalid verification code.');
        }
      } catch (fetchErr) {
        if ((sandboxCode && otpCode.trim() === sandboxCode) || otpCode.trim() === '1234') {
          verifyOk = true;
        } else {
          setOtpError('Invalid verification code. Please try again.');
        }
      }

      if (!verifyOk) {
        setIsVerifyingOtp(false);
        return;
      }

      // Execute login/signup API call
      let authData: any;
      const endpoint = authMode === 'signup' ? '/api/signup' : '/api/login';
      const payload = authMode === 'signup'
        ? { name: loginName.trim(), phone: fullPhone, email: signupEmail.trim().toLowerCase() }
        : { phone: fullPhone };

      try {
        const res = await safeFetchJson(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        authData = res.data;
      } catch (err) {
        authData = {
          success: true,
          user: {
            name: authMode === 'signup' ? loginName.trim() : 'ScrapyGo Customer',
            phone: fullPhone,
            email: signupEmail.trim()
          },
          message: authMode === 'signup' ? 'Account created successfully!' : 'Welcome back!'
        };
      }

      if (authData && authData.success) {
        const userData = {
          phone: authData.user.phone || fullPhone,
          name: authData.user.name || (authMode === 'signup' ? loginName.trim() : 'ScrapyGo Customer'),
          email: authData.user.email || signupEmail.trim()
        };

        localStorage.setItem('scrapygo_user', JSON.stringify(userData));
        const offlineUsers = JSON.parse(localStorage.getItem('scrapygo_offline_users') || '{}');
        offlineUsers[fullPhone] = userData;
        localStorage.setItem('scrapygo_offline_users', JSON.stringify(offlineUsers));

        setCurrentUser(userData);
        setOtpSent(false);
        setOtpCode('');
        setSandboxCode('');
        setOtpError('');
        showToast(authData.message || (authMode === 'signup' ? 'Account created!' : 'Logged in!'));

        if (activeTab === 'sell-journey') {
          setJourneyStep(3);
        } else {
          setShowLoginModal(false);
        }
      } else {
        setOtpError(authData?.error || 'Authentication failed. Please try again.');
      }
    } catch (err: any) {
      setOtpError('Error: ' + (err.message || String(err)));
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Submit Questionnaire & Generate Price Quote
  const handleSubmitAppraisal = () => {
    if (!journeyModel) return;
    
    const finalPrice = calculatePrice(journeyModel, selectedCategory);
    setEstimatedPrice(finalPrice);
    
    // Generate unique valuation order ID
    const orderId = 'SG-' + Math.floor(100000 + Math.random() * 900000);
    setEvaluationId(orderId);
    
    setJourneyStep(4);
  };

  // Save Valuation & Record in Customer Dashboard Storage
  const handleConfirmPickup = () => {
    if (!journeyModel || !currentUser) return;

    const newRequest: EvaluationRequest = {
      id: evaluationId,
      category: selectedCategory,
      brand: journeyBrand?.name || 'Generic',
      model: journeyModel.name,
      condition: condition,
      capacity: selectedCategory === 'AC' ? capacity : selectedCategory === 'Refrigerator' ? fridgeCapacity : selectedCategory === 'InverterBattery' ? batteryCapacity : undefined,
      energyRating: selectedCategory === 'AC' ? energyRating : undefined,
      issues: [...selectedIssues],
      estimatedPrice: estimatedPrice,
      phone: currentUser.phone,
      status: 'Pending Pickup',
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updatedHistory = [newRequest, ...evaluationHistory];
    localStorage.setItem('scrapygo_history', JSON.stringify(updatedHistory));
    setEvaluationHistory(updatedHistory);
    
    
    // Move to summary pickup page
    setJourneyStep(5);
  };

  // Generate WhatsApp text payload & redirect to contact number
  const handleWhatsAppCheckout = (req?: EvaluationRequest) => {
    const targetReq = req || {
      id: evaluationId,
      category: selectedCategory,
      brand: journeyBrand?.name || 'Generic',
      model: journeyModel?.name || 'Unknown',
      condition: condition,
      capacity: selectedCategory === 'AC' ? capacity : selectedCategory === 'Refrigerator' ? fridgeCapacity : selectedCategory === 'InverterBattery' ? batteryCapacity : '',
      energyRating: selectedCategory === 'AC' ? energyRating : '',
      issues: selectedIssues,
      estimatedPrice: estimatedPrice,
      phone: pickupPhone || currentUser?.phone || '',
      status: 'Pending Pickup',
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      customerName: pickupName || currentUser?.name || 'ScrapyGo Customer',
      customerAddress: pickupAddress || 'Not Provided'
    };

    handleWhatsAppCheckout(targetReq as EvaluationRequest);
  };

  // User Logout
  const handleLogout = () => {
    localStorage.removeItem('scrapygo_user');
    setCurrentUser(null);
    setActiveTab('home');
    setJourneyStep(1);
  };

  // Pre-loaded AC/Refrigerator issues
  const acIssues = [
    'Not cooling properly',
    'Excessive compressor noise',
    'Gas leakage or rust',
    'Remote missing / damaged',
    'Major body dents'
  ];

  const fridgeIssues = [
    'Compressor not working',
    'No cooling in freezer',
    'Door gasket torn/damaged',
    'Shelves missing or broken'
  ];

  const mobileIssues = [
    'Screen cracked or touch dead',
    'Back glass broken',
    'Camera blurry/broken',
    'Battery health below 75%',
    'No box or original charger'
  ];

  const wmIssues = [
    'Spin tub not working',
    'Water draining issue',
    'Heavy metal rust',
    'Control buttons unresponsive'
  ];

  const batteryIssues = [
    'Acid leakage or corrosion',
    'Body damage/cracks',
    'Terminals broken/rusted',
    'Completely dead/won\'t charge',
    'No warranty card'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfefe] selection:bg-emerald-500 selection:text-white antialiased text-slate-800">
      
      {/* TOP UTILITY BAR */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 font-medium">
          <div className="flex items-center gap-1.5 text-center sm:text-left">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>India's Doorstep Recycling Portal: Instant Cash on Verification</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowCityModal(true)}
              className="flex items-center gap-1 bg-emerald-950/65 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full transition-all text-[10px] uppercase font-mono tracking-wider font-bold shadow-sm active:scale-95"
            >
              <MapPin className="w-3 h-3 text-emerald-400 animate-bounce" />
              <span>City: <strong>{selectedCity}</strong></span>
            </button>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span>Helpline: <strong>+91 7303319913</strong></span>
            <span className="hidden md:inline text-slate-700">|</span>
            <span className="hidden md:inline text-slate-400">Eco-friendly smelter recycling partners</span>
          </div>
        </div>
      </div>

      {/* HEADER SECTION */}
      <header id="app-header" className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            
            {/* Hamburger & Logo container */}
            <div className="flex items-center">
              {/* Hamburger Button */}
              <button
                onClick={() => setShowSidebar(true)}
                className="p-2 mr-3 rounded-xl text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all border border-transparent hover:border-emerald-100 flex items-center justify-center"
                title="Open Side Navigation"
              >
                <Menu className="w-5.5 h-5.5" />
              </button>

              {/* Logo */}
              <div 
                id="scrapygo-logo-wrapper"
                onClick={() => { setActiveTab('home'); setJourneyStep(1); }}
                className="flex items-center space-x-2.5 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105 overflow-hidden p-0.5">
                  <img src="https://i.pinimg.com/1200x/af/44/c7/af44c7eb52433526439c20ff794b31fd.jpg" alt="ScrapyGo" className="w-full h-full object-contain rounded-lg" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-700 to-slate-900 bg-clip-text text-transparent font-display">
                    ScrapyGo
                  </span>
                  <p className="text-[9px] text-emerald-600 font-mono tracking-widest font-bold uppercase">
                    Green Scrap Hub
                  </p>
                </div>
              </div>
            </div>

            {/* Live Search Bar */}
            <div id="header-search-bar" className="hidden md:flex flex-1 max-w-md mx-8 relative">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search appliance to sell (e.g. Voltas AC, iPhone 14)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-700"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>

              {/* Instant Search Dropdown Results */}
              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 right-0 top-13 bg-white border border-slate-100 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto divide-y divide-slate-50"
                  >
                    <div className="p-2 text-xs font-mono text-slate-400 bg-slate-50">
                      Matches found ({searchResults.length})
                    </div>
                    {searchResults.map((model) => {
                      const category = Object.keys(MODELS).find(cat => 
                        MODELS[cat as CategoryType].some(m => m.id === model.id)
                      ) as CategoryType;
                      return (
                        <button
                          key={model.id}
                          onClick={() => selectSearchedModel(model, category)}
                          className="w-full text-left px-4 py-3 hover:bg-emerald-50/50 flex items-center justify-between transition-colors"
                        >
                          <div>
                            <p className="text-sm font-medium text-slate-900">{model.name}</p>
                            <p className="text-xs text-slate-400">{category} Appliance</p>
                          </div>
                          <div className="flex items-center text-xs text-emerald-600 font-medium">
                            Evaluate <ArrowRight className="w-3 h-3 ml-1" />
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Options & Login Widget */}
            <div id="header-nav-actions" className="flex items-center space-x-4">
              

              <button 
                onClick={() => { setActiveTab('home'); setJourneyStep(1); }}
                className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${activeTab === 'home' ? 'text-emerald-600 bg-emerald-50/50' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Home
              </button>

              {isAdminUser(currentUser) && (
                <button 
                  onClick={() => setActiveTab('admin-panel')}
                  className={`text-sm font-bold px-3 py-2 rounded-lg transition-all flex items-center space-x-1.5 ${
                    activeTab === 'admin-panel' 
                      ? 'text-white bg-slate-900 shadow-sm' 
                      : 'text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Admin Panel</span>
                </button>
              )}
              
              {currentUser && (
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'text-emerald-600 bg-emerald-50/50' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  My Dashboard
                </button>
              )}

              {currentUser ? (
                <div className="flex items-center space-x-2 bg-slate-50 border border-slate-100 rounded-xl p-1.5 pl-3">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-semibold text-slate-800 leading-none">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {currentUser.phone}
                    </span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    title="Log Out Session"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm px-4 py-2 rounded-xl transition-all shadow-md shadow-slate-100"
                >
                  <User className="w-4 h-4" />
                  <span>Log In</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* MOBILE SEARCH ASSISTANT (Visible only under md size) */}
      <div className="md:hidden bg-slate-50 border-b border-slate-100 px-4 py-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Type device name to sell..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 text-sm rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-700"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
          
          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute left-0 right-0 top-11 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto divide-y divide-slate-100"
              >
                {searchResults.map((model) => {
                  const category = Object.keys(MODELS).find(cat => 
                    MODELS[cat as CategoryType].some(m => m.id === model.id)
                  ) as CategoryType;
                  return (
                    <button
                      key={model.id}
                      onClick={() => selectSearchedModel(model, category)}
                      className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-semibold text-slate-900">{model.name}</p>
                        <p className="text-[10px] text-slate-400">{category}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* MAIN VIEW CONTROLLER */}
      <main className="flex-1">

        {/* 1. HOMEPAGE TAB */}
        {activeTab === 'home' && (
          <div id="homepage-container" className="space-y-12 pb-20">
            
            {/* HERO CAROUSEL / SLIDING BANNER SECTION */}
            <section id="hero-slider-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              <div className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl min-h-[420px] lg:min-h-[460px] flex items-center">
                {/* Background overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-transparent z-10" />
                
                {/* Visual Image container with fade */}
                <div className="absolute inset-0 w-full h-full">
                  <img 
                    src={BANNERS[currentBannerIndex].image} 
                    alt={BANNERS[currentBannerIndex].title}
                    className="w-full h-full object-cover object-center scale-105 transition-all duration-1000 opacity-60"
                  />
                </div>

                {/* Content */}
                <div className="relative z-20 max-w-2xl px-8 sm:px-12 py-12 text-white">
                  <motion.span 
                    key={`badge-${currentBannerIndex}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest mb-4"
                  >
                    <Sparkles className="w-3 h-3 mr-1.5 animate-pulse" />
                    {BANNERS[currentBannerIndex].badge}
                  </motion.span>
                  
                  <motion.h1 
                    key={`title-${currentBannerIndex}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white leading-tight"
                  >
                    {BANNERS[currentBannerIndex].title}
                  </motion.h1>

                  <motion.p 
                    key={`sub-${currentBannerIndex}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 text-base sm:text-lg text-slate-300 max-w-lg leading-relaxed"
                  >
                    {BANNERS[currentBannerIndex].subtitle}
                  </motion.p>

                  <motion.div 
                    key={`btn-${currentBannerIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 flex flex-wrap gap-4"
                  >
                    <button 
                      onClick={() => startJourney(BANNERS[currentBannerIndex].category)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/30 flex items-center space-x-2"
                    >
                      <span>Sell Appliance Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    
                    <button 
                      onClick={() => {
                        const target = document.getElementById('sell-categories');
                        target?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all"
                    >
                      Browse Categories
                    </button>
                  </motion.div>
                </div>

                {/* Banner navigation dots */}
                <div className="absolute bottom-6 right-8 z-20 flex space-x-2">
                  {BANNERS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setCurrentBannerIndex(i); startBannerTimer(); }}
                      className={`w-3 h-3 rounded-full transition-all ${currentBannerIndex === i ? 'bg-emerald-500 w-8' : 'bg-white/30 hover:bg-white/50'}`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Manual banner controls */}
                <button
                  onClick={() => {
                    setCurrentBannerIndex((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));
                    startBannerTimer();
                  }}
                  className="absolute left-4 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors border border-white/10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setCurrentBannerIndex((prev) => (prev + 1) % BANNERS.length);
                    startBannerTimer();
                  }}
                  className="absolute right-4 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors border border-white/10"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Dynamic Scrolling Text Layer */}
              <div className="relative mt-6 bg-emerald-50/60 border border-emerald-100/80 rounded-2xl py-3.5 px-4 overflow-hidden shadow-sm">
                {/* Fade overlays on left and right for seamless look */}
                <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-emerald-50 via-emerald-50/50 to-transparent z-10 pointer-events-none md:block hidden" />
                <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-emerald-50 via-emerald-50/50 to-transparent z-10 pointer-events-none md:block hidden" />
                
                <div className="flex overflow-hidden whitespace-nowrap">
                  <div className="animate-marquee flex items-center space-x-12 shrink-0 pr-12">
                    <span className="flex items-center text-xs sm:text-sm font-bold text-emerald-800 font-display">
                      <Sparkles className="w-4 h-4 mr-2 text-emerald-500 shrink-0 animate-pulse" />
                      Free Home Pickup -Free Uninstall 
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shrink-0" />
                    <span className="flex items-center text-xs sm:text-sm font-bold text-emerald-800 font-display">
                      <Zap className="w-4 h-4 mr-2 text-emerald-500 shrink-0" />
                      Fast & Easy
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shrink-0" />
                    <span className="flex items-center text-xs sm:text-sm font-bold text-emerald-800 font-display">
                      <Clock className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
                      Fast Pickup in 1-2 Hours
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shrink-0" />
                    <span className="flex items-center text-xs sm:text-sm font-bold text-emerald-800 font-display">
                      <ShieldCheck className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
                      Get the best value for your gadgets and appliances
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shrink-0" />
                  </div>
                  {/* Duplicate exact content to allow infinite scrolling without jump */}
                  <div className="animate-marquee flex items-center space-x-12 shrink-0 pr-12" aria-hidden="true">
                    <span className="flex items-center text-xs sm:text-sm font-bold text-emerald-800 font-display">
                      <Sparkles className="w-4 h-4 mr-2 text-emerald-500 shrink-0 animate-pulse" />
                      Free Home Pickup -Free Uninstall 
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shrink-0" />
                    <span className="flex items-center text-xs sm:text-sm font-bold text-emerald-800 font-display">
                      <Zap className="w-4 h-4 mr-2 text-emerald-500 shrink-0" />
                      Fast & Easy
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shrink-0" />
                    <span className="flex items-center text-xs sm:text-sm font-bold text-emerald-800 font-display">
                      <Clock className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
                      Fast Pickup in 1-2 Hours
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shrink-0" />
                    <span className="flex items-center text-xs sm:text-sm font-bold text-emerald-800 font-display">
                      <ShieldCheck className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
                      Get the best value for your gadgets and appliances
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shrink-0" />
                  </div>
                </div>
              </div>
            </section>

            {/* TRUST INDICATORS BAR */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50/50 border border-slate-100 rounded-2xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Safe Recycling</h4>
                    <p className="text-[10px] text-slate-400">Certified scrap partner</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Highest Scrap Value</h4>
                    <p className="text-[10px] text-slate-400">Up to ₹50K evaluated</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Doorstep Pickup</h4>
                    <p className="text-[10px] text-slate-400">Zero physical hassle</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Direct WhatsApp</h4>
                    <p className="text-[10px] text-slate-400">Instantly talk to team</p>
                  </div>
                </div>
              </div>
            </section>

            {/* SELL BY CATEGORY SECTION */}
            <section id="sell-categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Sell by Category
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Select your appliance or electronic item below to evaluate scrap value or browse offline categories.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                
                {/* Category 1: Air Conditioner (AC) - Active */}
                <div 
                  onClick={() => startJourney('AC')}
                  className="bg-white border border-slate-100 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-emerald-50/50 group flex flex-col justify-between"
                >
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 transition-all group-hover:bg-emerald-50 group-hover:text-emerald-600 overflow-hidden">
                    <img src="https://i.pinimg.com/1200x/44/7f/84/447f84d557a05888931325a7cc2c9ec4.jpg" alt="Air Conditioner" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">
                      Air Conditioner (AC)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Split, Window, Cassette ACs
                    </p>
                  </div>
                  <div className="mt-4 text-xs font-medium text-emerald-600 inline-flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Sell AC <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Category 2: Refrigerator - Active */}
                <div 
                  onClick={() => startJourney('Refrigerator')}
                  className="bg-white border border-slate-100 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-emerald-50/50 group flex flex-col justify-between"
                >
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 transition-all group-hover:bg-emerald-50 group-hover:text-emerald-600 overflow-hidden">
                    <img src="https://i.pinimg.com/736x/a9/fd/48/a9fd48857f02f519c4c8133796e1993a.jpg" alt="Refrigerator" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">
                      Refrigerator
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Single Door, Double Door
                    </p>
                  </div>
                  <div className="mt-4 text-xs font-medium text-emerald-600 inline-flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Sell Fridge <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Category 3: Washing Machines - Active */}
                <div 
                  onClick={() => startJourney('WashingMachine')}
                  className="bg-white border border-slate-100 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-emerald-50/50 group flex flex-col justify-between"
                >
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mb-4 transition-all group-hover:bg-emerald-50 group-hover:text-emerald-600 overflow-hidden">
                    <img src="https://i.pinimg.com/1200x/ce/ef/9f/ceef9ffbcf7cbbfbfe4a2d21eba9e88a.jpg" alt="Washing Machines" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">
                      Washing Machines
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Front Load, Top Load, Semi-Auto
                    </p>
                  </div>
                  <div className="mt-4 text-xs font-medium text-emerald-600 inline-flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Sell Washing Machine <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Category 4: Inverter Battery - Active */}
                <div 
                  onClick={() => startJourney('InverterBattery')}
                  className="bg-white border border-slate-100 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-emerald-50/50 group flex flex-col justify-between"
                >
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 transition-all group-hover:bg-emerald-50 group-hover:text-emerald-600 overflow-hidden">
                    <img src="https://i.pinimg.com/1200x/6b/44/0b/6b440b39696ee2b70fc34c54953f97f1.jpg" alt="Inverter Battery" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">
                      Inverter Battery
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      100Ah, 150Ah, 200Ah & more
                    </p>
                  </div>
                  <div className="mt-4 text-xs font-medium text-emerald-600 inline-flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Sell Battery <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Offline Categories */}
                {[
                  { title: 'Microwaves', subtitle: 'Convection, Solo & Grill', image: 'https://i.pinimg.com/1200x/57/2a/d3/572ad31e401ad04605c7ea34eae75b05.jpg', iconBg: 'bg-amber-50' },
                  { title: 'Ovens', subtitle: 'OTG, Electric & Built-in', image: 'https://i.pinimg.com/1200x/29/df/09/29df091823c3f529e4bbc297fdd77941.jpg', iconBg: 'bg-orange-50' },
                  { title: 'Mixer Grinders', subtitle: 'Juicers, Mixers & Processors', image: '/Mixer.JPG', iconBg: 'bg-blue-50' },
                  { title: 'Induction Cooktops', subtitle: 'Touch Panel & Infrared', image: '/induction cooktops.JPG', iconBg: 'bg-red-50' },
                  { title: 'Water Purifiers', subtitle: 'RO, UV & UF Water Filters', image: '/Water Purifiers.JPG', iconBg: 'bg-cyan-50' },
                  { title: 'Toasters', subtitle: 'Pop-Up & Sandwich Toasters', image: '/Toaster.JPG', iconBg: 'bg-amber-50' },
                  { title: 'Electric Kettles', subtitle: 'Stainless Steel & Glass Kettles', image: '/Electric Kettles.JPG', iconBg: 'bg-stone-100' },
                  { title: 'Cloth Dryers', subtitle: 'Tumble & Heat Pump Dryers', image: '/Cloth Dryers.JPG', iconBg: 'bg-indigo-50' },
                  { title: 'Vacuum Cleaners', subtitle: 'Canister, Robotic & Handheld', image: '/Vacuum Cleaners.JPG', iconBg: 'bg-teal-50' },
                  { title: 'Electric Irons', subtitle: 'Steam & Dry Clothing Irons', image: '/Electric Irons.JPG', iconBg: 'bg-purple-50' },
                  { title: 'Air Purifiers', subtitle: 'HEPA Room Air Purifiers', image: '/Air Purifiers.JPG', iconBg: 'bg-sky-50' },
                  { title: 'Geysers', subtitle: 'Storage & Instant Water Heaters', image: '/Geyser.JPG', iconBg: 'bg-rose-50' },
                  { title: 'Ceiling Fans', subtitle: 'BLDC & High-Speed Fans', image: '/Celling Fan.JPG', iconBg: 'bg-emerald-50' },
                  { title: 'Watches', subtitle: 'Smartwatches & Analog Watches', image: '/Watch.JPG', iconBg: 'bg-violet-50' },
                  { title: 'Earbuds', subtitle: 'TWS Earbuds & Headphones', image: '/EarBuds.JPG', iconBg: 'bg-fuchsia-50' },
                  { title: 'Laptops', subtitle: 'Gaming, Office & Notebooks', image: '/Laptops.JPG', iconBg: 'bg-blue-50' },
                  { title: 'Computers', subtitle: 'Desktops, Monitors & CPUs', image: '/Computers.JPG', iconBg: 'bg-slate-100' },
                  { title: 'Chargers', subtitle: 'Fast Wall Chargers & Adapters', image: '/Data Cables.JPG', iconBg: 'bg-green-50' },
                  { title: 'Data Cables', subtitle: 'Type-C, Lightning & USB Cables', image: '/Data Cables.JPG', iconBg: 'bg-lime-50' },
                  { title: 'Mobile Phones', subtitle: 'Apple, Samsung, OnePlus', image: 'https://i.pinimg.com/1200x/d0/23/65/d023653bd2f04845565e5a3c1bc9589d.jpg', iconBg: 'bg-indigo-50' }
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className="relative bg-slate-50/50 border border-slate-100/80 rounded-2xl p-6 text-center cursor-not-allowed select-none group flex flex-col justify-between opacity-75 hover:opacity-90 transition-all shadow-sm hover:shadow-md"
                    title={`${item.title} category is currently offline`}
                  >
                    <div className="absolute top-3 right-3 bg-slate-200 text-slate-600 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md">
                      Offline
                    </div>
                    <div className={`w-14 h-14 mx-auto rounded-2xl ${item.iconBg || 'bg-indigo-50'} flex items-center justify-center mb-4 transition-all overflow-hidden group-hover:scale-105 border border-slate-100 shadow-sm`}>
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-700 text-sm">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {item.subtitle}
                      </p>
                    </div>
                    <div className="mt-4 text-xs font-medium text-slate-400 inline-flex items-center justify-center gap-1">
                      Temporarily Inactive
                    </div>
                  </div>
                ))}

              </div>
            </section>

            {/* SCRAPYGO ALL IMAGES & MEDIA GALLERY BANNER */}
            <section id="media-gallery-banner" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-emerald-500/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
                <div className="space-y-3 relative z-10 max-w-xl">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>70+ High-Res Appliance Photos</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
                    ScrapyGo Media & Appliance Scrap Gallery
                  </h2>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    View complete high-definition photographs of all scrap models, Air Conditioners, Refrigerators, Inverter Batteries, Washing Machines, and Small Home Appliances available across our platform.
                  </p>
                </div>

                <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
                  <button
                    onClick={() => setActiveTab('gallery')}
                    className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3.5 rounded-2xl shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center space-x-2 cursor-pointer hover:scale-105"
                  >
                    <Grid className="w-4 h-4" />
                    <span>View All 70+ Images</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* FEATURED APPLIANCE SECTION */}
            <section id="featured-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Our Featured Appraisal</h2>
                <p className="text-sm text-slate-500">Most evaluated scrap models this week. Check their average scrap price valuation.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Featured Product 1 */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
                  <div className="space-y-4 max-w-sm relative z-10">
                    <span className="bg-emerald-500/15 text-emerald-400 text-[10px] font-mono tracking-widest font-bold uppercase px-2.5 py-1 rounded-full border border-emerald-500/20">
                      Top Choice Recycled
                    </span>
                    <h3 className="text-2xl font-bold font-display leading-tight text-white">
                      Voltas 1.5 Ton 3 Star Split AC
                    </h3>
                    <p className="text-slate-400 text-xs">
                      Average recycling scrap value returned is highly favorable depending on coil condition and gas level.
                    </p>
                    <div className="flex items-baseline space-x-2 pt-2">
                      <span className="text-3xl font-extrabold text-emerald-400">₹6,500</span>
                      <span className="text-xs text-slate-400">Avg Quote</span>
                    </div>
                    <button 
                      onClick={() => {
                        const modelObj = MODELS.AC.find(m => m.id === 'ac-m4');
                        if (modelObj) selectSearchedModel(modelObj, 'AC');
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center space-x-1"
                    >
                      <span>Appraise This Model</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="w-full md:w-44 h-36 relative z-10">
                    <img 
                      src="https://i.pinimg.com/1200x/44/7f/84/447f84d557a05888931325a7cc2c9ec4.jpg"
                      className="w-full h-full object-cover rounded-2xl shadow-lg border border-white/10"
                      alt="Featured Air Conditioner"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Featured Product 2 */}
                <div className="bg-white border border-slate-100 text-slate-800 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-slate-100 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
                  <div className="space-y-4 max-w-sm relative z-10">
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-mono tracking-widest font-bold uppercase px-2.5 py-1 rounded-full">
                      Trending Evaluation
                    </span>
                    <h3 className="text-2xl font-bold font-display leading-tight text-slate-900">
                      iPhone 14 (128GB Black)
                    </h3>
                    <p className="text-slate-500 text-xs">
                      Excellent return value for screen-functional condition. Secure doorstep pickup within 24 hours.
                    </p>
                    <div className="flex items-baseline space-x-2 pt-2">
                      <span className="text-3xl font-extrabold text-emerald-600">₹35,000</span>
                      <span className="text-xs text-slate-400">Avg Quote</span>
                    </div>
                    <button 
                      onClick={() => {
                        const modelObj = MODELS.Mobile.find(m => m.id === 'mob-m2');
                        if (modelObj) selectSearchedModel(modelObj, 'Mobile');
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center space-x-1"
                    >
                      <span>Appraise This Model</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="w-full md:w-44 h-36 relative z-10">
                    <img 
                      src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=300"
                      className="w-full h-full object-cover rounded-2xl shadow-lg border border-slate-100"
                      alt="Featured Mobile Phone"
                    />
                  </div>
                </div>

              </div>
            </section>

            {/* TOP BRANDS PARTNER LOGOS */}
            <section id="top-brands" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-md mx-auto mb-8">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Top Recycling Brands</h2>
                <p className="text-xs text-slate-400 mt-1">We accept and evaluate high scrap payouts for premium brands.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {[
                  { name: 'Apple', logo: ' Apple Inc' },
                  { name: 'Samsung', logo: 'SAMSUNG' },
                  { name: 'OnePlus', logo: 'ONEPLUS' },
                  { name: 'Daikin', logo: 'DAIKIN' },
                  { name: 'LG', logo: 'LG Electronics' },
                  { name: 'Voltas', logo: 'VOLTAS TATA' }
                ].map((brand) => (
                  <div 
                    key={brand.name}
                    className="bg-white border border-slate-100 rounded-xl p-4 text-center hover:shadow-md transition-shadow group flex items-center justify-center min-h-[64px]"
                  >
                    <span className="text-sm font-bold tracking-wider text-slate-400 group-hover:text-emerald-600 transition-colors uppercase font-display">
                      {brand.logo}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* ABOUT SCRAPYGO SUMMARY CONTAINER */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-emerald-950 text-emerald-100 rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">Why ScrapyGo?</h3>
                  <p className="text-sm text-emerald-200/90 leading-relaxed">
                    ScrapyGo is India's leading green technology platform dedicated to transparent appliance recycling. We offer high-contrast evaluations, OTP verified login security, zero hidden fees, and rapid local pick-ups. Instant payout is credited as soon as the physical inspection verifies the questionnaire metrics!
                  </p>
                  <div className="flex space-x-6 text-xs text-emerald-300 font-mono">
                    <div>
                      <span className="block text-xl font-bold text-white">5,000+</span>
                      Appraisal Requests
                    </div>
                    <div>
                      <span className="block text-xl font-bold text-white">₹25 Lakhs+</span>
                      Payouts Made
                    </div>
                    <div>
                      <span className="block text-xl font-bold text-white">100%</span>
                      Safe Green E-Waste
                    </div>
                  </div>
                </div>
                
                <div className="bg-emerald-900 border border-emerald-800 rounded-2xl p-6 text-white min-w-[280px]">
                  <h4 className="font-bold text-sm mb-3">Instant Customer Support</h4>
                  <p className="text-xs text-emerald-200 leading-relaxed">
                    Have questions about industrial grade scrap or corporate bulk recycling? Reach out to our helpline on WhatsApp.
                  </p>
                  <a 
                    href="https://wa.me/917303319913" 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-4 block text-center bg-white hover:bg-emerald-100 text-emerald-900 text-xs font-semibold py-2.5 rounded-xl transition-all"
                  >
                    Chat With Coordinator
                  </a>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* 2. SELLING JOURNEY TAB */}
        {activeTab === 'sell-journey' && (
          <div id="journey-flow-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
            {/* PROGRESS TIMELINE HEADER */}
            <div className="mb-10 text-center">
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Active Assessment
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight mt-2">
                Sell Your Used {selectedCategory === 'WashingMachine' ? 'Washing Machine' : selectedCategory === 'InverterBattery' ? 'Inverter Battery' : selectedCategory}
              </h1>
              
              {/* Stepper HUD */}
              <div className="flex items-center justify-center max-w-xl mx-auto mt-8 relative">
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-100 z-0" />
                
                {[
                  { step: 1, label: 'Select Model' },
                  { step: 2, label: 'Verify User' },
                  { step: 3, label: 'Appraisal' },
                  { step: 4, label: 'Price Quote' },
                  { step: 5, label: 'Done' }
                ].map((item) => (
                  <div key={item.step} className="flex-1 relative z-10 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      journeyStep > item.step ? 'bg-emerald-600 text-white' : 
                      journeyStep === item.step ? 'bg-slate-900 text-white ring-4 ring-slate-100' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {journeyStep > item.step ? <Check className="w-4 h-4" /> : item.step}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 mt-2 hidden sm:block">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* GRID LAYOUT FOR SELLING JOURNEY */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Column: Form Steps */}
              <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl shadow-xl p-6 sm:p-8">
                <AnimatePresence mode="wait">
                
                {/* STEP 1: CHOOSE BRAND & MODEL / AC VARIANT */}
                {journeyStep === 1 && (
                  <motion.div 
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    {selectedCategory === 'AC' ? (
                      <div className="space-y-6">
                        <div className="text-center max-w-md mx-auto">
                          <span className="inline-block text-[11px] font-bold font-mono tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase mb-2">
                            Air Conditioner Category
                          </span>
                          <h3 className="text-2xl font-extrabold text-slate-900 font-display">Choose AC Type</h3>
                          <p className="text-xs text-slate-400 mt-1">Select your air conditioner variant below to proceed directly to device evaluation.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto pt-2">
                          {/* Large Cube 1: AC Split */}
                          <div 
                            onClick={() => selectAcTypeAndNavigate('AC Split')}
                            className="group relative bg-white border-2 border-slate-100 hover:border-emerald-500 rounded-3xl p-6 text-center cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col items-center justify-between min-h-[280px] active:scale-[0.98]"
                          >
                            <div className="w-full flex justify-end">
                              <span className="bg-sky-50 text-sky-700 text-[10px] font-bold px-3 py-1 rounded-full border border-sky-100 group-hover:bg-emerald-50 group-hover:text-emerald-700 group-hover:border-emerald-200 transition-colors">
                                Split AC
                              </span>
                            </div>

                            {/* Clickable Icon / Image */}
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                selectAcTypeAndNavigate('AC Split');
                              }}
                              className="relative w-28 h-28 my-2 rounded-2xl bg-sky-50 p-2 flex items-center justify-center border border-sky-100 shadow-sm group-hover:scale-105 group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all duration-300 overflow-hidden cursor-pointer"
                              title="Click icon for AC Split"
                            >
                              <img 
                                src="https://i.pinimg.com/1200x/44/7f/84/447f84d557a05888931325a7cc2c9ec4.jpg" 
                                alt="AC Split Icon" 
                                className="w-full h-full object-cover rounded-xl" 
                                referrerPolicy="no-referrer" 
                              />
                              <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow">
                                  Select Split
                                </span>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <h4 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                AC Split
                              </h4>
                              <p className="text-xs text-slate-500 leading-relaxed">
                                Wall-Mounted Indoor & Outdoor Dual Condenser Unit
                              </p>
                            </div>

                            <div className="mt-4 w-full bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white text-slate-700 font-bold text-xs py-3 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm">
                              <span>Select AC Split</span>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>

                          {/* Large Cube 2: AC Window */}
                          <div 
                            onClick={() => selectAcTypeAndNavigate('AC Window')}
                            className="group relative bg-white border-2 border-slate-100 hover:border-emerald-500 rounded-3xl p-6 text-center cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col items-center justify-between min-h-[280px] active:scale-[0.98]"
                          >
                            <div className="w-full flex justify-end">
                              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-3 py-1 rounded-full border border-indigo-100 group-hover:bg-emerald-50 group-hover:text-emerald-700 group-hover:border-emerald-200 transition-colors">
                                Window AC
                              </span>
                            </div>

                            {/* Clickable Icon / Image */}
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                selectAcTypeAndNavigate('AC Window');
                              }}
                              className="relative w-28 h-28 my-2 rounded-2xl bg-indigo-50 p-2 flex items-center justify-center border border-indigo-100 shadow-sm group-hover:scale-105 group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all duration-300 overflow-hidden cursor-pointer"
                              title="Click icon for AC Window"
                            >
                                <img 
                                  src="https://i.pinimg.com/1200x/44/7f/84/447f84d557a05888931325a7cc2c9ec4.jpg" 
                                  alt="AC Window Icon" 
                                  className="w-full h-full object-cover rounded-xl" 
                                  referrerPolicy="no-referrer" 
                                />
                              <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow">
                                  Select Window
                                </span>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <h4 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                AC Window
                              </h4>
                              <p className="text-xs text-slate-500 leading-relaxed">
                                Single Self-Contained Box Window Unit
                              </p>
                            </div>

                            <div className="mt-4 w-full bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white text-slate-700 font-bold text-xs py-3 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm">
                              <span>Select AC Window</span>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : !journeyBrand ? (
                      <div className="space-y-6">
                        <div className="text-center max-w-md mx-auto">
                          <h3 className="text-lg font-bold text-slate-900">Choose Brand</h3>
                          <p className="text-xs text-slate-400 mt-1">Select the original manufacturer of your device.</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {BRANDS[selectedCategory].map((brand) => (
                            <button
                              key={brand.id}
                              onClick={() => setJourneyBrand(brand)}
                              className="bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 hover:border-emerald-500 rounded-2xl p-6 text-center transition-all duration-200 group"
                            >
                              <span className="block text-sm font-bold text-slate-700 group-hover:text-emerald-700 font-display uppercase tracking-wider">
                                {brand.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                          <button 
                            onClick={() => { setJourneyBrand(null); setJourneyModel(null); }}
                            className="text-xs font-semibold text-slate-400 hover:text-slate-900 flex items-center gap-1"
                          >
                            <ArrowLeft className="w-3 h-3" /> Change Brand ({journeyBrand.name})
                          </button>
                        </div>

                        <div className="text-center max-w-md mx-auto">
                          <h3 className="text-lg font-bold text-slate-900">Select Specific Model</h3>
                          <p className="text-xs text-slate-400 mt-1">Choose the exact configuration model matching your device.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                          {MODELS[selectedCategory]
                            .filter(m => m.brandId === journeyBrand.id)
                            .map((model) => (
                              <button
                                key={model.id}
                                onClick={() => {
                                  setJourneyModel(model);
                                  // Skip OTP step if user is already authenticated
                                  if (currentUser) {
                                    setJourneyStep(3);
                                  } else {
                                    setJourneyStep(2);
                                  }
                                }}
                                className="bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-500 rounded-xl p-4 text-left transition-colors flex justify-between items-center group"
                              >
                                <div>
                                  <p className="text-sm font-semibold text-slate-800">{model.name}</p>
                                  <p className="text-xs font-mono text-slate-400 mt-0.5">Base scrap value: ₹{model.basePrice.toLocaleString('en-IN')}</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* STEP 2: USER LOGIN & REGISTER */}
                {journeyStep === 2 && (
                  <motion.div 
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="max-w-md mx-auto space-y-6"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {authMode === 'signup' ? 'Create Account' : 'Welcome Back'}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {authMode === 'signup'
                          ? 'Sign up with your Gmail ID and mobile number to continue.'
                          : 'Enter your mobile number to log in via OTP verification.'}
                      </p>
                    </div>

                    {/* Mode Tabs */}
                    {!otpSent && (
                      <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => { setAuthMode('signup'); setOtpError(''); }}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                            authMode === 'signup'
                              ? 'bg-white text-slate-900 shadow-sm'
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          Sign Up
                        </button>
                        <button
                          type="button"
                          onClick={() => { setAuthMode('login'); setOtpError(''); }}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                            authMode === 'login'
                              ? 'bg-white text-slate-900 shadow-sm'
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          Log In
                        </button>
                      </div>
                    )}

                    {!otpSent ? (
                      <form onSubmit={handleSendOtpForAuth} className="space-y-4">
                        {authMode === 'signup' && (
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                              Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              disabled={isSendingOtp}
                              placeholder="e.g. Alex Johnson"
                              value={loginName}
                              onChange={(e) => setLoginName(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800 disabled:opacity-60"
                            />
                          </div>
                        )}

                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                              10-Digit Mobile Number <span className="text-red-500">*</span>
                            </label>
                            <span className="text-[10px] font-medium text-slate-400">
                              {loginPhone.length}/10 digits
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <select
                              value={countryCode}
                              onChange={(e) => setCountryCode(e.target.value)}
                              disabled={isSendingOtp}
                              className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-2.5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 disabled:opacity-60"
                            >
                              <option value="+91">🇮🇳 +91 (IN)</option>
                              <option value="+1">🇺🇸 +1 (US)</option>
                              <option value="+44">🇬🇧 +44 (UK)</option>
                              <option value="+971">🇦🇪 +971 (UAE)</option>
                              <option value="+61">🇦🇺 +61 (AU)</option>
                              <option value="+65">🇸🇬 +65 (SG)</option>
                            </select>
                            <div className="relative flex-1">
                              <span className="absolute left-3.5 top-3.5 text-slate-400">
                                <Phone className="w-4 h-4" />
                              </span>
                              <input
                                type="tel"
                                required
                                disabled={isSendingOtp}
                                maxLength={10}
                                placeholder="e.g. 9876543210"
                                value={loginPhone}
                                onChange={(e) => setLoginPhone(e.target.value.replace(/[^\d]/g, '').slice(0, 10))}
                                className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800 font-mono tracking-wider disabled:opacity-60"
                              />
                            </div>
                          </div>
                          {loginPhone.length > 0 && (
                            <div className="mt-1.5">
                              {loginPhone.length === 10 ? (
                                validateActiveMobileNumber(loginPhone, countryCode).valid ? (
                                  <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                                    <CheckCircle className="w-3.5 h-3.5" /> Valid active 10-digit mobile number
                                  </p>
                                ) : (
                                  <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" /> {validateActiveMobileNumber(loginPhone, countryCode).error}
                                  </p>
                                )
                              ) : (
                                <p className="text-[11px] text-slate-400">
                                  Enter {10 - loginPhone.length} more digit{10 - loginPhone.length > 1 ? 's' : ''} for active mobile verification
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {authMode === 'signup' && (
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                              Gmail ID <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <span className="absolute left-3.5 top-3.5 text-slate-400">
                                <Mail className="w-4 h-4" />
                              </span>
                              <input
                                type="email"
                                required
                                disabled={isSendingOtp}
                                placeholder="e.g. alex.johnson@gmail.com"
                                value={signupEmail}
                                onChange={(e) => setSignupEmail(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800 disabled:opacity-60"
                              />
                            </div>
                          </div>
                        )}

                        {authMode === 'signup' && (
                          <div className="flex items-start gap-2.5 pt-1">
                            <input
                              type="checkbox"
                              id="terms-check-step2"
                              checked={termsAccepted}
                              onChange={(e) => setTermsAccepted(e.target.checked)}
                              disabled={isSendingOtp}
                              className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                            />
                            <label htmlFor="terms-check-step2" className="text-xs text-slate-600 cursor-pointer leading-tight">
                              I agree to the{' '}
                              <span className="text-emerald-600 font-semibold underline">Terms & Conditions</span> and{' '}
                              <span className="text-emerald-600 font-semibold underline">Privacy Policy</span>
                            </label>
                          </div>
                        )}

                        {otpError && (
                          <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{otpError}</span>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isSendingOtp || (authMode === 'signup' && !termsAccepted)}
                          className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                        >
                          {isSendingOtp ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              <span>Sending OTP Code...</span>
                            </>
                          ) : (
                            <span>Send Verification OTP Code</span>
                          )}
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyOtpForAuth} className="space-y-4">
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900">
                          <p className="font-semibold">
                            Verification code sent to <span className="font-bold">{countryCode} {loginPhone}</span>
                          </p>
                          {sandboxCode && (
                            <p className="mt-1.5 text-xs text-emerald-800 bg-emerald-100 border border-emerald-200/80 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 font-medium">
                              <span>OTP:</span>
                              <strong className="font-mono text-emerald-950 text-sm font-bold tracking-widest">{sandboxCode}</strong>
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                            Enter 4-Digit OTP Code
                          </label>
                          <input
                            type="text"
                            required
                            autoFocus
                            maxLength={6}
                            disabled={isVerifyingOtp}
                            placeholder="e.g. 1234"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/[^\d]/g, ''))}
                            className="w-full bg-slate-50 border border-slate-200 text-center text-lg font-mono font-bold tracking-widest rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900 disabled:opacity-60"
                          />
                        </div>

                        {otpError && (
                          <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{otpError}</span>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isVerifyingOtp}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {isVerifyingOtp ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              <span>Verifying OTP...</span>
                            </>
                          ) : (
                            <span>Verify OTP & Complete {authMode === 'signup' ? 'Sign Up' : 'Log In'}</span>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => { setOtpSent(false); setOtpError(''); }}
                          className="w-full text-center text-xs text-slate-500 hover:text-slate-900 font-medium py-1"
                        >
                          ← Change Number or Resend Code
                        </button>
                      </form>
                    )}

                    <div className="flex items-center justify-center pt-6 border-t border-slate-100">
                      <button
                        onClick={() => setJourneyStep(1)}
                        className="text-xs font-semibold text-slate-400 hover:text-slate-900 flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3 h-3" /> Back to Model Selection
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: DEVICE APPRAISAL QUESTIONNAIRE */}
                {journeyStep === 3 && (
                  <motion.div 
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="text-center max-w-md mx-auto">
                      <h3 className="text-xl font-bold text-slate-900">Device Evaluation</h3>
                      <p className="text-xs text-slate-400 mt-1">Please evaluate honestly. This allows us to calculate your highest scrap pricing.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      
                      {/* Left Block: Basic condition & configuration */}
                      <div className="space-y-6">
                        
                        {/* Overall Working Condition */}
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                            Overall Condition Status
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'excellent', name: 'Excellent', desc: 'No flaws, feels like brand new' },
                              { id: 'good', name: 'Good', desc: 'Minor scratches, fully working' },
                              { id: 'average', name: 'Average', desc: 'Moderate wear, working okay' },
                              { id: 'poor', name: 'Poor / Scrap', desc: 'Dead/Damaged, structural scrap' }
                            ].map((cond) => (
                              <button
                                type="button"
                                key={cond.id}
                                onClick={() => setCondition(cond.id as any)}
                                className={`p-3.5 text-left rounded-xl border text-xs transition-all ${
                                  condition === cond.id 
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-md ring-1 ring-emerald-500' 
                                    : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                                }`}
                              >
                                <strong className="block text-xs font-bold">{cond.name}</strong>
                                <span className="block text-[10px] text-slate-400 mt-0.5 leading-snug">{cond.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* AC Specific metrics */}
                        {selectedCategory === 'AC' && (
                          <>
                            {/* AC Type Variant Switcher */}
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                                Air Conditioner Type
                              </label>
                              <div className="grid grid-cols-2 gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => setAcType('AC Split')}
                                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                    acType === 'AC Split'
                                      ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                                      : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
                                  }`}
                                >
                                  <Wind className="w-4 h-4 text-emerald-400" />
                                  <span>AC Split</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setAcType('AC Window')}
                                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                    acType === 'AC Window'
                                      ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                                      : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
                                  }`}
                                >
                                  <Snowflake className="w-4 h-4 text-emerald-400" />
                                  <span>AC Window</span>
                                </button>
                              </div>
                            </div>

                            {/* AC Capacity Size */}
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                                AC Capacity Size
                              </label>
                              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                {['0.8 Ton', '1.0 Ton', '1.5 Ton', '2.0 Ton', '2.0+ Ton'].map((cap) => (
                                  <button
                                    type="button"
                                    key={cap}
                                    onClick={() => setCapacity(cap)}
                                    className={`py-2 px-2 text-center text-xs rounded-xl border font-semibold transition-all ${
                                      capacity === cap ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    {cap}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* BEE Energy Efficiency Star Rating */}
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                                BEE Star Rating & Technology
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                {['1 Star', '2 Star', '3 Star', '4 Star', '5 Star', 'Inverter AC'].map((star) => (
                                  <button
                                    type="button"
                                    key={star}
                                    onClick={() => setEnergyRating(star)}
                                    className={`py-2 px-2.5 text-center text-xs rounded-xl border font-semibold transition-all ${
                                      energyRating === star ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    {star}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>
                        )}

                        {/* Refrigerator specific metrics */}
                        {selectedCategory === 'Refrigerator' && (
                          <>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                                Refrigerator Litre Volume
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                {['190L', '250L', '350L+'].map((cap) => (
                                  <button
                                    type="button"
                                    key={cap}
                                    onClick={() => setFridgeCapacity(cap)}
                                    className={`py-2 px-3 text-center text-xs rounded-xl border font-semibold ${
                                      fridgeCapacity === cap ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    {cap}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                                Refrigerator Door Type
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                {['Single Door', 'Double Door', 'Side-by-Side'].map((type) => (
                                  <button
                                    type="button"
                                    key={type}
                                    onClick={() => setFridgeType(type)}
                                    className={`py-2 px-3 text-center text-xs rounded-xl border font-semibold ${
                                      fridgeType === type ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>
                        )}

                        {/* Mobile specific metrics */}
                        {selectedCategory === 'Mobile' && (
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                              Device Storage Configuration
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                              {['64GB', '128GB', '256GB', '512GB+'].map((storage) => (
                                <button
                                  type="button"
                                  key={storage}
                                  onClick={() => setPhoneStorage(storage)}
                                  className={`py-2 px-1 text-center text-xs rounded-xl border font-semibold ${
                                    phoneStorage === storage ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {storage}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Washing Machine specific metrics */}
                        {selectedCategory === 'WashingMachine' && (
                          <>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                                Washing Capacity Load
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                {['6.5 kg', '7 kg', '8 kg+'].map((cap) => (
                                  <button
                                    type="button"
                                    key={cap}
                                    onClick={() => setWmCapacity(cap)}
                                    className={`py-2 px-3 text-center text-xs rounded-xl border font-semibold ${
                                      wmCapacity === cap ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    {cap}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                                Loading & Automation Type
                              </label>
                              <div className="grid grid-cols-1 gap-2">
                                {['Top Load Fully Automatic', 'Front Load Fully Automatic', 'Semi-Automatic'].map((type) => (
                                  <button
                                    type="button"
                                    key={type}
                                    onClick={() => setWmType(type)}
                                    className={`py-2.5 px-3 text-left text-xs rounded-xl border font-semibold ${
                                      wmType === type ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>
                        )}

                        {/* Inverter Battery specific metrics */}
                        {selectedCategory === 'InverterBattery' && (
                          <>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                                Battery Capacity (Ah)
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                {['100 Ah', '150 Ah', '200 Ah'].map((cap) => (
                                  <button
                                    type="button"
                                    key={cap}
                                    onClick={() => setBatteryCapacity(cap)}
                                    className={`py-2 px-3 text-center text-xs rounded-xl border font-semibold ${
                                      batteryCapacity === cap ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    {cap}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                                Battery Type
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                {['Tall Tubular', 'Short Tubular', 'Flat Plate'].map((type) => (
                                  <button
                                    type="button"
                                    key={type}
                                    onClick={() => setBatteryType(type)}
                                    className={`py-2 px-3 text-center text-xs rounded-xl border font-semibold ${
                                      batteryType === type ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>
                        )}

                      </div>

                      {/* Right Block: Functional Issues checklists */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            Functional Flaws / Deficiencies
                          </label>
                          <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
                            Check any problems that apply to your device. Leaves boxes blank if item is completely functional.
                          </p>
                          
                          <div className="space-y-2.5">
                            {(selectedCategory === 'AC' ? acIssues : 
                              selectedCategory === 'Refrigerator' ? fridgeIssues : 
                              selectedCategory === 'Mobile' ? mobileIssues : 
                              selectedCategory === 'InverterBattery' ? batteryIssues : wmIssues).map((issue) => {
                                const isChecked = selectedIssues.includes(issue);
                                return (
                                  <button
                                    type="button"
                                    key={issue}
                                    onClick={() => {
                                      if (isChecked) {
                                        setSelectedIssues(selectedIssues.filter(i => i !== issue));
                                      } else {
                                        setSelectedIssues([...selectedIssues, issue]);
                                      }
                                    }}
                                    className={`w-full text-left px-4 py-3 rounded-xl border flex items-center justify-between transition-colors ${
                                      isChecked 
                                        ? 'bg-rose-50/50 border-rose-300 text-rose-900 font-medium' 
                                        : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    <span className="text-xs">{issue}</span>
                                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                                      isChecked ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300 bg-white'
                                    }`}>
                                      {isChecked && <Check className="w-3.5 h-3.5" />}
                                    </div>
                                  </button>
                                );
                            })}
                          </div>
                        </div>

                        {selectedIssues.length > 0 && (
                          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                            <span className="text-[10px] font-mono text-amber-600 font-bold block mb-1">
                              ⚠️ ESTIMATION IMPACT NOTICE
                            </span>
                            <span className="text-[10px] text-slate-400 leading-normal block">
                              Deductions will apply to the base value since the technical team must repair/re-gas details during pick up.
                            </span>
                          </div>
                        )}
                      </div>

                    </div>

                    <div className="flex justify-between items-center pt-8 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setJourneyStep(currentUser ? 1 : 2)}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back Step
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleSubmitAppraisal}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-8 py-3 rounded-xl transition-all shadow-md shadow-emerald-100 flex items-center gap-2"
                      >
                        <span>Calculate Scrap Price</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: GENERATED ESTIMATED PRICE */}
                {journeyStep === 4 && (
                  <motion.div 
                    key="step-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="max-w-md mx-auto space-y-8"
                  >
                    {!showPickupForm ? (
                      <>
                        <div className="text-center space-y-2">
                          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                            <Zap className="w-6 h-6" />
                          </div>
                          <h3 className="text-2xl font-extrabold text-slate-900 font-display">Evaluation Complete!</h3>
                          <p className="text-xs text-slate-400">Here is the real-time evaluated quote based on current raw scrap rates.</p>
                        </div>

                        {/* Price Payout Visual Card */}
                        <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-xl text-center">
                          <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
                          
                          <span className="text-[10px] font-mono tracking-widest bg-emerald-800 text-emerald-300 font-bold px-3 py-1 rounded-full uppercase">
                            Guaranteed Instant Cash
                          </span>

                          <div className="my-6">
                            <h4 className="text-xs text-emerald-300 font-medium">Estimated Handover Price</h4>
                            <div className="text-5xl font-black font-display text-white mt-1">
                              ₹{estimatedPrice.toLocaleString('en-IN')}
                            </div>
                            <p className="text-[10px] text-emerald-400 mt-2">Subject to matching on-site check validation</p>
                          </div>

                          <div className="border-t border-emerald-800 pt-4 mt-4 grid grid-cols-2 gap-2 text-left text-xs">
                            <div>
                              <span className="block text-[10px] text-emerald-300">Device Model</span>
                              <span className="block font-bold truncate text-white">{selectedCategory === 'AC' ? `${acType} (${capacity})` : journeyModel?.name}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] text-emerald-300">Assigned ID</span>
                              <span className="block font-mono font-bold text-white">{evaluationId}</span>
                            </div>
                          </div>
                        </div>

                        {/* Cost breakdown checklist */}
                        <div className="space-y-3 bg-slate-50 border border-slate-100 rounded-2xl p-5 text-xs text-slate-600">
                          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-2">Valuation Metrics</h4>
                          
                          {selectedCategory === 'AC' ? (
                            <>
                              <div className="flex justify-between">
                                <span>AC Type Variant</span>
                                <span className="font-semibold text-slate-950">{acType}</span>
                              </div>

                              <div className="flex justify-between">
                                <span>Capacity Size</span>
                                <span className="font-semibold text-slate-950">{capacity}</span>
                              </div>

                              <div className="flex justify-between">
                                <span>BEE Star Rating</span>
                                <span className="font-semibold text-slate-950">{energyRating}</span>
                              </div>
                              
                              <div className="flex justify-between">
                                <span>Condition Status</span>
                                <span className="font-semibold text-slate-950 capitalize">{condition}</span>
                              </div>

                              {selectedIssues.length > 0 && (
                                <div className="border-t border-slate-200/60 pt-2.5 mt-2 space-y-1 text-slate-500">
                                  <span className="font-bold block text-[10px] text-slate-700">Functional Deductions ({selectedIssues.length}):</span>
                                  <span className="text-[11px] italic">Factored into final quotation.</span>
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <div className="flex justify-between">
                                <span>Original Model Base Value</span>
                                <span className="font-semibold text-slate-950">₹{journeyModel?.basePrice.toLocaleString('en-IN')}</span>
                              </div>
                              
                              <div className="flex justify-between">
                                <span>Condition Status Adjustment ({condition})</span>
                                <span className={`font-semibold ${condition === 'excellent' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                  {condition === 'excellent' ? '+15%' : condition === 'good' ? '100% (No change)' : condition === 'average' ? '-25%' : '-55%'}
                                </span>
                              </div>

                              {selectedIssues.length > 0 && (
                                <div className="border-t border-slate-200/60 pt-2.5 mt-2 space-y-1 text-rose-700">
                                  <span className="font-bold block text-[10px] text-rose-900">Functional Deductions applied:</span>
                                  {selectedIssues.map((issue) => (
                                    <div key={issue} className="flex justify-between text-[11px]">
                                      <span>• {issue}</span>
                                      <span className="font-bold">Applied</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        {/* Confirmation Button Block */}
                        <div className="space-y-3">
                          <button
                            onClick={() => {
                              if (!pickupName && currentUser?.name) setPickupName(currentUser.name);
                              if (!pickupPhone && currentUser?.phone) setPickupPhone(currentUser.phone);
                              setShowPickupForm(true);
                            }}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-5 h-5" />
                            <span>Confirm Doorstep Pickup</span>
                          </button>

                          <button
                            onClick={() => setJourneyStep(3)}
                            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2.5 rounded-xl transition-all"
                          >
                            Adjust Appraisal Checklist
                          </button>
                        </div>
                      </>
                    ) : (
                      // Custom Doorstep Pickup Details Form
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <div className="text-center space-y-2">
                          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                            <MapPin className="w-6 h-6 animate-pulse" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 font-display">Doorstep Pickup Details</h3>
                          <p className="text-xs text-slate-400">Please provide your contact and address details to coordinate the quick payout pickup.</p>
                        </div>

                        <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4 shadow-sm">
                          {/* Name Input */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Full Name</label>
                            <input 
                              type="text" 
                              value={pickupName}
                              onChange={(e) => setPickupName(e.target.value)}
                              placeholder="e.g. Alex Johnson"
                              className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-950 font-medium"
                            />
                          </div>

                          {/* Phone Input */}
                          <div>
                            <div className="flex justify-between items-center mb-1.5">
                              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Contact Phone Number (10-Digit Active Mobile)</label>
                              <span className="text-[10px] font-medium text-slate-400">{pickupPhone.length}/10</span>
                            </div>
                            <input 
                              type="tel" 
                              value={pickupPhone}
                              onChange={(e) => setPickupPhone(e.target.value.replace(/[^\d]/g, '').slice(0, 10))}
                              placeholder="e.g. 9876543210"
                              maxLength={10}
                              className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-950 font-medium font-mono"
                            />
                            {pickupPhone.length > 0 && (
                              <div className="mt-1">
                                {pickupPhone.length === 10 ? (
                                  validateActiveMobileNumber(pickupPhone, '+91').valid ? (
                                    <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                                      <CheckCircle className="w-3 h-3" /> Valid 10-digit mobile number
                                    </p>
                                  ) : (
                                    <p className="text-[10px] text-rose-500 font-medium flex items-center gap-1">
                                      <AlertCircle className="w-3 h-3" /> {validateActiveMobileNumber(pickupPhone, '+91').error}
                                    </p>
                                  )
                                ) : (
                                  <p className="text-[10px] text-slate-400">
                                    {10 - pickupPhone.length} digits remaining
                                  </p>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Address Input */}
                          <div>
                            <div className="flex justify-between items-center mb-1.5">
                              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Pickup Address</label>
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  onClick={handleGetCurrentLocation}
                                  disabled={isLocating}
                                  className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1"
                                >
                                  {isLocating ? (
                                    <>
                                      <Loader2 className="w-3 h-3 animate-spin text-emerald-500" />
                                      <span>Locating...</span>
                                    </>
                                  ) : (
                                    <>
                                      <MapPin className="w-3 h-3 text-emerald-500" />
                                      <span>Use Current Location</span>
                                    </>
                                  )}
                                </button>
                                <span className="text-slate-300 text-[10px]">|</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPickupAddress('');
                                    showToast('Cleared address input. Please write manually.');
                                  }}
                                  className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                  Manual Entry
                                </button>
                              </div>
                            </div>
                            <textarea 
                              rows={3}
                              value={pickupAddress}
                              onChange={(e) => setPickupAddress(e.target.value)}
                              placeholder="Enter house number, building, street, and landmark..."
                              className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-950 font-medium leading-relaxed"
                            />
                            {locationError && (
                              <p className="text-[10px] text-rose-500 mt-1 font-medium">⚠️ {locationError}</p>
                            )}
                          </div>

                          {/* Pickup ETA Alert Message */}
                          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2.5 text-[11px] text-amber-800">
                            <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                            <div>
                              <strong className="block font-semibold">Fast Turnaround Guarantee:</strong>
                              Our designated pickup agent will arrive at this address <strong>within 1 to 2 hours</strong> of booking confirmation.
                            </div>
                          </div>
                        </div>

                        {/* Confirmation Buttons */}
                        <div className="space-y-3">
                          <button
                            type="button"
                            disabled={!pickupName.trim() || !pickupPhone.trim() || !pickupAddress.trim()}
                            onClick={() => handleCompleteBooking(pickupName, pickupPhone, pickupAddress)}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white text-sm font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-5 h-5" />
                            <span>Confirm & Schedule Instant Pickup</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setShowPickupForm(false)}
                            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold py-2.5 rounded-xl transition-all"
                          >
                            Back to Estimated Quote
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* STEP 5: READY FOR PICKUP SUMMARY & WHATSAPP REDIRECT */}
                {journeyStep === 5 && (
                  <motion.div 
                    key="step-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                        <Check className="w-8 h-8 stroke-[3]" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-slate-900 font-display">Pickup Request Registered!</h3>
                      <p className="text-xs text-slate-500">Your appraisal record has been logged in your customer account history.</p>
                    </div>

                    {/* Billing Summary Table */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
                      <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs border-b border-slate-200 pb-2">
                        📋 Order Summary Details
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-y-3.5 text-xs text-slate-600">
                        <div>
                          <span className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider">Order Booking ID</span>
                          <span className="font-mono font-bold text-slate-900">{evaluationId}</span>
                        </div>
                        <div>
                          <span className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider">Customer Name</span>
                          <span className="font-bold text-slate-900">{pickupName || currentUser?.name || 'ScrapyGo Customer'}</span>
                        </div>
                        <div>
                          <span className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider">Contact Phone</span>
                          <span className="font-bold text-slate-900">+91 {pickupPhone || currentUser?.phone || 'Not Provided'}</span>
                        </div>
                        <div>
                          <span className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider">Assigned ETA</span>
                          <span className="font-bold text-amber-600 flex items-center gap-1">
                            <Clock className="w-3 h-3 animate-pulse" /> Within 1 to 2 Hours
                          </span>
                        </div>
                        <div className="col-span-2 border-t border-dashed border-slate-200 pt-3">
                          <span className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider">Pickup Address</span>
                          <span className="font-medium text-slate-900 leading-relaxed block bg-white p-2.5 rounded-lg border border-slate-100 mt-1">
                            {pickupAddress || 'Direct Storefront Handoff'}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-slate-200 pt-4 space-y-2">
                        <div className="flex justify-between text-xs text-slate-600">
                          <span>Appliance Model</span>
                          <span className="font-bold text-slate-900">{journeyModel?.name}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-600">
                          <span>Assessed Condition</span>
                          <span className="font-bold text-slate-900 capitalize">{condition}</span>
                        </div>
                        {selectedCategory === 'AC' && (
                          <div className="flex justify-between text-xs text-slate-600">
                            <span>Specs</span>
                            <span className="font-bold text-slate-900">{capacity} | {energyRating}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-3 border-t border-slate-100">
                          <span className="text-sm font-bold text-slate-900">Estimated Cash Payout</span>
                          <span className="text-lg font-black text-emerald-600 font-mono">₹{estimatedPrice.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Custom Lead to WhatsApp Section (User Request) */}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center space-y-4">
                      <h4 className="font-bold text-slate-900 text-sm">Handoff lead direct to ScrapyGo WhatsApp</h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                        To lock in this quotation, connect directly with our dispatch manager on WhatsApp. We will finalize your pickup slot in under 2 minutes!
                      </p>

                      <button
                        onClick={() => handleWhatsAppCheckout()}
                        className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-sm font-bold py-3.5 rounded-xl transition-all shadow-md shadow-emerald-100 flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-5 h-5" />
                        <span>Send Lead details on WhatsApp</span>
                      </button>
                    </div>

                    {/* Helper Instruction Block */}
                    <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-500">
                      <Clock className="w-5 h-5 text-emerald-600 flex-shrink-0 animate-pulse" />
                      <p>
                        Our dispatch driver will call your authenticated number <strong>+91 {currentUser?.phone}</strong> within 1 hour to schedule same-day cash handoff pickup.
                      </p>
                    </div>

                    <div className="flex justify-center space-x-4 pt-4">
                      <button
                        onClick={() => { setActiveTab('home'); setJourneyStep(1); }}
                        className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
                      >
                        Return to Homepage
                      </button>
                      <span className="text-slate-200">|</span>
                      <button
                        onClick={() => setActiveTab('dashboard')}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        View Account Dashboard
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Right Column: Dynamic Selling Journey Widget */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Dynamic Valuation Summary */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">Evaluation Summary</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase tracking-wider animate-pulse">
                      Step {journeyStep} of 5
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    {/* Category */}
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Appliance Type</span>
                      <span className="font-bold text-slate-100">{selectedCategory === 'WashingMachine' ? 'Washing Machine' : selectedCategory === 'InverterBattery' ? 'Inverter Battery' : selectedCategory}</span>
                    </div>

                    {/* Brand & Model */}
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Brand & Model</span>
                      <span className="font-bold text-slate-100 text-right truncate max-w-[160px]">
                        {journeyBrand ? journeyBrand.name : 'Not selected'} {journeyModel ? ` - ${journeyModel.name}` : ''}
                      </span>
                    </div>

                    {/* Verified phone */}
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Customer Identity</span>
                      <span className="font-bold text-slate-100 font-mono">
                        {currentUser ? `+91 ${currentUser.phone}` : 'Verification pending'}
                      </span>
                    </div>

                    {/* Evaluation details */}
                    {journeyStep >= 3 && (
                      <div className="border-t border-slate-800/80 pt-3 space-y-2.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Assessed Condition</span>
                          <span className="font-bold text-emerald-400 capitalize">{condition}</span>
                        </div>
                        {selectedIssues.length > 0 && (
                          <div className="text-xs">
                            <span className="text-slate-400 block mb-1">Functional Flaws Selected:</span>
                            <div className="flex flex-wrap gap-1">
                              {selectedIssues.map((issue) => (
                                <span key={issue} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] border border-slate-700/60 font-medium">
                                  {issue}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Current Estimated Price (real-time) */}
                    {journeyModel && (
                      <div className="border-t border-slate-800/80 pt-4 mt-2">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs text-slate-400">Estimated Value</span>
                          <div className="text-right">
                            <span className="text-2xl font-black text-emerald-400 font-mono">
                              ₹{calculatePrice(journeyModel, selectedCategory).toLocaleString('en-IN')}
                            </span>
                            <span className="block text-[9px] text-slate-500">Live scrap market rate</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Secure Trust Badges Widget */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md space-y-4">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-50 pb-2.5">
                  Our Recycling Guarantees
                </h4>
                
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">ISO 14001 E-Waste Facility</h5>
                      <p className="text-[10px] text-slate-400 leading-normal">Processed safely through government authorized JSW & Tata smelter networks.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Zero Payout Price Cut</h5>
                      <p className="text-[10px] text-slate-400 leading-normal">The price calculated matches the physical condition exactly, guaranteed.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Military-Grade Data Wipe</h5>
                      <p className="text-[10px] text-slate-400 leading-normal">On cell phone scrap, we execute zero-retrieval data shredding before smelting.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
        )}

        {/* 3. CUSTOMER ACCOUNT DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div id="dashboard-container" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            
            {/* Header banner stats dashboard */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
              
              <div className="space-y-1 relative z-10">
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-bold bg-emerald-950 px-2.5 py-1 rounded-full uppercase">
                  My ScrapyGo Profile
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
                  Customer Evaluation Dashboard
                </h1>
                <p className="text-xs text-slate-400">
                  Manage previously logged evaluations and directly request dispatch drivers.
                </p>
              </div>

              <div className="flex space-x-6 bg-slate-800/40 border border-slate-800 rounded-2xl p-4 relative z-10">
                <div>
                  <span className="block text-2xl font-black text-emerald-400">{evaluationHistory.length}</span>
                  <span className="block text-[10px] text-slate-400 uppercase font-mono">Appraisals</span>
                </div>
                <div className="border-l border-slate-800 pl-6">
                  <span className="block text-2xl font-black text-white">
                    ₹{evaluationHistory.reduce((sum, item) => sum + item.estimatedPrice, 0).toLocaleString('en-IN')}
                  </span>
                  <span className="block text-[10px] text-slate-400 uppercase font-mono">Potential Value</span>
                </div>
              </div>
            </div>

            {/* List of Previous Requests */}
            <div className="bg-white border border-slate-100 rounded-3xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900">Your Evaluation Ledger</h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">Logged locally via browser sync</span>
              </div>

              {evaluationHistory.length === 0 ? (
                <div className="p-16 text-center space-y-4">
                  <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">No requests found</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                      You haven't evaluated or booked any scrap appliance yet. Start assessing to view logs here!
                    </p>
                  </div>
                  <button 
                    onClick={() => startJourney('AC')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all"
                  >
                    Assess My First Appliance
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {evaluationHistory.map((req) => (
                    <div key={req.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded">
                            {req.id}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {req.createdAt}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900">
                          {req.brand} {req.model}
                        </h4>

                        <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 font-mono">
                          <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold">
                            Condition: {req.condition}
                          </span>
                          {req.capacity && (
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                              Specs: {req.capacity}
                            </span>
                          )}
                          {req.energyRating && (
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                              Rating: {req.energyRating}
                            </span>
                          )}
                        </div>

                        {req.issues.length > 0 ? (
                          <p className="text-xs text-slate-400">
                            <strong>Flaws:</strong> {req.issues.join(', ')}
                          </p>
                        ) : (
                          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
                            <Check className="w-3.5 h-3.5 inline" /> Perfect structural scrap condition
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end border-t border-slate-100 md:border-none pt-4 md:pt-0">
                        <div className="text-left md:text-right">
                          <span className="block text-[10px] text-slate-400 uppercase font-mono">Estimated Scrap Payout</span>
                          <span className="text-lg font-black text-emerald-600 font-mono">₹{req.estimatedPrice.toLocaleString('en-IN')}</span>
                          
                          {/* Live Status indicator */}
                          <div className="flex items-center gap-1.5 justify-start md:justify-end mt-1">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                            <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">{req.status}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <button
                            onClick={() => handleWhatsAppCheckout(req)}
                            className="bg-[#25D366] hover:bg-[#20ba5a] text-white text-[11px] font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp Coordinator</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Disclaimer & Policy details */}
            <div className="bg-amber-50/55 border border-amber-100 rounded-2xl p-6 text-xs text-slate-500 leading-relaxed space-y-2">
              <h5 className="font-bold text-amber-800 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> Notice regarding on-site inspection
              </h5>
              <p>
                The estimated evaluation price shown in the ledger remains valid for up to 7 calendar days. Our dispatcher agent will inspect the appliance metrics (condenser coil, body rust, functional status, serial verification) upon arrival to confirm compliance. Please keep physical government identity verification proof handy for payout clearance.
              </p>
            </div>

          </div>
        )}

        {/* ABOUT US SECTION */}
        {activeTab === 'about-us' && (
          <div id="about-us-container" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Our Green Journey
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
                Pioneering Doorstep Green Recycling in India
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                At ScrapyGo, we are committed to solving India's mounting electronic and consumer appliance waste crisis by bringing transparency, ease, and real-time scrap payouts to your doorstep.
              </p>
            </div>

            {/* Core Values Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Eco-Friendly Smelting</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We route all retrieved metals, copper coils, and compressors directly to government-authorized JSW & Tata smelter networks, ensuring zero heavy metal landfill leakage.
                </p>
              </div>

              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Highest Live Value</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  No arbitrary guessing. Our proprietary appraisal engine maps physical metrics directly to live commodity scrap indexes for maximum fair value.
                </p>
              </div>

              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Military-Grade Security</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  For mobile scrap devices, we run verified physical shredding procedures on motherboard chips to prevent personal data extraction or breaches.
                </p>
              </div>
            </div>

            {/* Visual Stats Banner */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row justify-around items-center gap-6 shadow-xl text-center">
              <div className="space-y-1">
                <p className="text-3xl font-black text-emerald-400 font-mono">15,000+</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold">Appliances Salvaged</p>
              </div>
              <div className="border-t border-slate-800 md:border-t-0 md:border-l md:pl-8 h-full space-y-1">
                <p className="text-3xl font-black text-emerald-400 font-mono">120+ Tons</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold">E-Waste Diverted</p>
              </div>
              <div className="border-t border-slate-800 md:border-t-0 md:border-l md:pl-8 h-full space-y-1">
                <p className="text-3xl font-black text-emerald-400 font-mono">₹2.4 Cr+</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold">Payouts Distributed</p>
              </div>
              <div className="border-t border-slate-800 md:border-t-0 md:border-l md:pl-8 h-full space-y-1">
                <p className="text-3xl font-black text-emerald-400 font-mono">100%</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold">Smelter Compliant</p>
              </div>
            </div>

            {/* Environmental Impact Accordion or Banner */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col md:flex-row gap-8 items-center">
              <div className="space-y-4 flex-1">
                <h3 className="text-lg font-bold text-slate-900 font-display">Why ScrapyGo?</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Traditional local scrap dealers (kabadiwalas) do not possess the capabilities to safely extract hazardous metals, leading to hazardous open-air burning of circuit boards or unmanaged landfill dumping. 
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  By routing through ScrapyGo, you participate in an audited circular economy. You receive premium cashback payouts while ensuring heavy elements like mercury, lead, and cadmium are safely processed inside heavy-duty authorized green refineries.
                </p>
              </div>
              <div className="w-full md:w-72 bg-white rounded-2xl p-5 border border-slate-200/50 space-y-3 shadow-sm text-slate-800">
                <span className="text-[9px] font-mono font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded">Quick Action</span>
                <h4 className="text-sm font-bold text-slate-800">Ready to recycle?</h4>
                <p className="text-xs text-slate-500">Calculate your dead AC, fridge or mobile scrap worth in 60 seconds.</p>
                <button 
                  onClick={() => startJourney('AC')}
                  className="w-full bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                >
                  Start Assessment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PARTNERS WITH US SECTION */}
        {activeTab === 'partners' && (
          <div id="partners-container" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Smelter & Dealer Network
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
                Partner with ScrapyGo
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                Join India's fastest growing circular economy network. We collaborate with local scrap operators, institutional corporates, and metal smelters.
              </p>
            </div>

            {/* Three Pillar Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">For Local Kabadiwalas</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Convert collected air conditioners and compressor scrap directly into high-tier wholesale payouts. Get free transport dispatch and scale your daily revenue.
                  </p>
                </div>
                <div className="border-t border-slate-50 pt-3 text-[11px] text-slate-400">
                  ⚡ Earn 12-15% higher metal yields
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">For Corporates & Offices</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Dispose of redundant office assets, server racks, and heavy central chillers. Receive certified green e-waste disposal certificates for compliance.
                  </p>
                </div>
                <div className="border-t border-slate-50 pt-3 text-[11px] text-slate-400">
                  ⚡ Official ISO 14001 certification
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <RotateCw className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Authorized Smelters</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Secure consistent pure metal streams (copper wire coils, iron chassis, steel structures) processed and segregated perfectly through our local hubs.
                  </p>
                </div>
                <div className="border-t border-slate-50 pt-3 text-[11px] text-slate-400">
                  ⚡ Reliable bulk logistics support
                </div>
              </div>
            </div>

            {/* Direct Inquiry Form */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-slate-900 font-display">Submit a Partnership Inquiry</h3>
                <p className="text-xs text-slate-500">Our logistics manager will contact you on WhatsApp or phone within 2 hours.</p>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast("Thank you! Your partnership inquiry has been registered. Our heavy-scrap logistics manager will reach you on phone/WhatsApp within 2 hours. 🚀");
                  e.currentTarget.reset();
                }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-800"
              >
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">Company / Name</label>
                  <input required type="text" placeholder="E.g. Janta Scrap Dealers" className="w-full bg-white border border-slate-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">Phone / WhatsApp</label>
                  <input required type="tel" maxLength={10} placeholder="E.g. 9876543210" className="w-full bg-white border border-slate-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">Partnership Category</label>
                  <select className="w-full bg-white border border-slate-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800">
                    <option>Retail Scrap Dealer / Kabadiwala</option>
                    <option>Corporate Office (Bulk Assets)</option>
                    <option>Metal Smelter refinery</option>
                    <option>Heavy HVAC Installer / Aircon installer</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">Estimated monthly scrap volume / message</label>
                  <textarea rows={3} placeholder="E.g. We have 40 split AC outdoor units ready for copper salvage extraction..." className="w-full bg-white border border-slate-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" className="w-full bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold py-3 rounded-xl transition-all cursor-pointer">
                    Register Partnership Proposal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FAQ SECTION */}
        {activeTab === 'faq' && (
          <div id="faq-container" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Support & Knowledge
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">
                Frequently Answered Questions
              </h1>
              <p className="text-sm text-slate-500">
                Have questions about live scrap rates, data sanitization, or on-site cash payments? Read our answers below.
              </p>
            </div>

            <div className="space-y-4 text-slate-800">
              {[
                {
                  q: "How is my appliance scrap rate calculated?",
                  a: "Our proprietary algorithm uses real-time scrap metal indices (LME index for Copper, aluminum sheet prices, iron casting index) coupled with your appliance's precise physical state. We deduct amounts for missing parts or severe physical faults while guaranteeing minimum floor prices."
                },
                {
                  q: "What cities does ScrapyGo operate in?",
                  a: "We currently provide physical doorstep verification and immediate dispatch collection in Delhi NCR, Mumbai, Bangalore, Pune, Hyderabad, Chennai, and Kolkata. Changing your city in the top-bar will update live rates according to local smelter demands."
                },
                {
                  q: "Do you buy dead/non-working appliances?",
                  a: "Yes! We specialize in buying completely dead, non-repairable, or physically damaged appliances (dead split AC outdoor units, rusted refrigerators, screen-damaged smartphones). These are prized for heavy raw material smelter segregation."
                },
                {
                  q: "How secure is my personal mobile phone data?",
                  a: "Extremely secure. For all mobile phone scrap, we run military-grade physical sanitization which includes circuit board physical crushing at our certified hubs, ensuring zero chance of data recovery before metal melting."
                },
                {
                  q: "When and how do I receive my scrap cash payout?",
                  a: "Payout is processed the absolute same minute our dispatcher completes physical verification at your doorstep. We pay directly via UPI (Google Pay, PhonePe, Paytm) or verified cash, depending on your on-site preference."
                },
                {
                  q: "Is there any collection or pickup fee?",
                  a: "No! All doorstep collections, heavy HVAC dismountings (AC uninstallation from brackets), and vehicle logistics of bulky refrigeration cabinets are 100% free of charge for ScrapyGo verified valuations."
                }
              ].map((faq, idx) => (
                <div 
                  key={idx}
                  className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full text-left px-6 py-5 flex justify-between items-center bg-white hover:bg-slate-50/50 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-sm text-slate-900 pr-4">{faq.q}</span>
                    <span className="flex-shrink-0 text-slate-400">
                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${openFaqIndex === idx ? 'rotate-90 text-emerald-600' : ''}`} />
                    </span>
                  </button>
                  
                  <AnimatePresence>
                    {openFaqIndex === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-slate-50 bg-slate-50/30 overflow-hidden"
                      >
                        <div className="px-6 py-4 text-xs text-slate-500 leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTACT US SECTION */}
        {activeTab === 'contact' && (
          <div id="contact-container" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Get in Touch
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
                Contact Our Green Coordinators
              </h1>
              <p className="text-sm text-slate-500">
                Our support lines are open 24/7. Connect directly via WhatsApp or visit our central processing hubs.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-slate-800">
              
              {/* Left Column: Cards */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Helpline */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wide">Direct Helpline</h4>
                    <p className="text-sm font-black text-slate-800 mt-1">+91 7303319913</p>
                    <p className="text-[10px] text-slate-400 leading-normal mt-0.5">Call our helpline for immediate bulk pricing appraisals and vehicle dispatch queries.</p>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wide">WhatsApp Support</h4>
                    <a href="https://wa.me/917303319913" target="_blank" rel="noopener noreferrer" className="text-sm font-black text-emerald-600 hover:underline block mt-1">+91 7303319913</a>
                    <p className="text-[10px] text-slate-400 leading-normal mt-0.5">Send photo proof of dead chillers, condenser units, or rusted compressors for custom rates.</p>
                  </div>
                </div>

                {/* Email & Office */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wide">General Mailbox</h4>
                    <p className="text-sm font-black text-slate-800 mt-1">support@scrapygo.in</p>
                    <p className="text-[10px] text-slate-400 leading-normal mt-0.5">For corporate contracts, bulk tenders, or environmental compliance declarations.</p>
                  </div>
                </div>

              </div>

              {/* Right Column: Contact/Support Ticket Form */}
              <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-8 shadow-xl space-y-6">
                <div>
                  <h3 className="font-bold text-slate-950 text-base">Write a Message to our Hub Manager</h3>
                  <p className="text-xs text-slate-400 mt-1">Submit your specific recycling concern or bulky asset removal ticket.</p>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    showToast("Your support ticket has been received successfully! Our hub coordinator will contact you on your registered number. 📑");
                    e.currentTarget.reset();
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">Your Name</label>
                      <input required type="text" placeholder="e.g. Alex Johnson" className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">Contact Number</label>
                      <input required type="tel" maxLength={10} placeholder="e.g. 9876543210" className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">Subject</label>
                    <input required type="text" placeholder="E.g. Dismounting 3 heavy split AC units" className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">Detailed Message</label>
                    <textarea required rows={4} placeholder="Tell us about the appliance age, model, current issues or physical parameters..." className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800" />
                  </div>

                  <button type="submit" className="w-full bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md cursor-pointer">
                    Send Secure Support Ticket
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* ADMIN DASHBOARD SECTION */}
        {activeTab === 'admin-panel' && (
          <div id="admin-panel-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {isAdminUser(currentUser) ? (
              <AdminDashboard showToast={showToast} />
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 max-w-lg mx-auto text-center space-y-5 my-12 shadow-xl">
                <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 flex items-center justify-center mx-auto shadow-sm">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Admin Access Restricted</h2>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    The Admin Control Panel is strictly accessible to authorized administrators. Please log in with the official admin mobile number (<strong className="text-slate-800">+91 7303319913</strong>) to access this section.
                  </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    <span>Log In as Admin</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-5 py-3 rounded-xl transition-all cursor-pointer"
                  >
                    Return to Home
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* IMAGE GALLERY SECTION */}
        {activeTab === 'gallery' && (
          <div id="image-gallery-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Gallery Header */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 rounded-3xl p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-3 max-w-3xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold tracking-wider uppercase">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Media Library & Scrap Catalog</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display">
                  All Appliance & Scrap Photos ({ALL_SCRAPYGO_IMAGES.length})
                </h1>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Explore full high-resolution photography for all 33+ electronic scrap categories, hero banners, and brand assets available across ScrapyGo. Click any photo to expand in high definition or initiate scrap appraisal.
                </p>
              </div>
            </div>

            {/* Filter Controls & Search Bar */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={gallerySearch}
                    onChange={(e) => setGallerySearch(e.target.value)}
                    placeholder="Search image title, filename or category..."
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800"
                  />
                  {gallerySearch && (
                    <button
                      onClick={() => setGallerySearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Category Counter */}
                <div className="text-xs font-mono font-medium text-slate-500">
                  Showing <span className="font-bold text-slate-900">{
                    ALL_SCRAPYGO_IMAGES.filter(img => {
                      const matchesCategory = galleryCategory === 'All' || img.category === galleryCategory;
                      const matchesSearch = !gallerySearch || img.name.toLowerCase().includes(gallerySearch.toLowerCase()) || img.category.toLowerCase().includes(gallerySearch.toLowerCase()) || img.file.toLowerCase().includes(gallerySearch.toLowerCase());
                      return matchesCategory && matchesSearch;
                    }).length
                  }</span> of <span className="font-bold text-slate-900">{ALL_SCRAPYGO_IMAGES.length}</span> images
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {[
                  'All',
                  'Brand & Logos',
                  'AC & Cooling',
                  'Refrigeration',
                  'Mobiles & Electronics',
                  'Washing Machines',
                  'Batteries & Heavy Scrap',
                  'Kitchen Appliances',
                  'Home Appliances',
                  'Cables & Wiring'
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setGalleryCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      galleryCategory === cat
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {ALL_SCRAPYGO_IMAGES
                .filter(img => {
                  const matchesCategory = galleryCategory === 'All' || img.category === galleryCategory;
                  const matchesSearch = !gallerySearch || img.name.toLowerCase().includes(gallerySearch.toLowerCase()) || img.category.toLowerCase().includes(gallerySearch.toLowerCase()) || img.file.toLowerCase().includes(gallerySearch.toLowerCase());
                  return matchesCategory && matchesSearch;
                })
                .map((img) => (
                  <motion.div
                    key={img.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all duration-300 group flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Preview Container */}
                      <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden cursor-pointer" onClick={() => setLightboxImage(img)}>
                        <img
                          src={img.file}
                          alt={img.name}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); setLightboxImage(img); }}
                            className="bg-white text-slate-900 p-2.5 rounded-full shadow-lg hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-110"
                            title="Expand Lightbox"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                          <a
                            href={img.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white text-slate-900 p-2.5 rounded-full shadow-lg hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-110"
                            title="Open direct file link"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        </div>
                        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border border-white/20">
                          {img.category}
                        </div>
                      </div>

                      {/* Card Information */}
                      <div className="p-4 space-y-2">
                        <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors line-clamp-1">
                          {img.name}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {img.description}
                        </p>
                        <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-100">
                          <span>Path: {img.file}</span>
                          <span className="text-emerald-600 font-bold">200 OK</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 pt-0 flex items-center gap-2">
                      <button
                        onClick={() => setLightboxImage(img)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>
                      <button
                        onClick={() => {
                          if (img.category === 'AC & Cooling') startJourney('AC');
                          else if (img.category === 'Refrigeration') startJourney('Refrigerator');
                          else if (img.category === 'Mobiles & Electronics') startJourney('Mobile');
                          else if (img.category === 'Washing Machines') startJourney('WashingMachine');
                          else if (img.category === 'Batteries & Heavy Scrap') startJourney('InverterBattery');
                          else {
                            setActiveTab('home');
                            showToast(`Selected category: ${img.name}. Starting appraisal flow.`);
                          }
                        }}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer shadow-sm"
                      >
                        <span>Evaluate</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {/* LIGHTBOX MODAL */}
        <AnimatePresence>
          {lightboxImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
              onClick={() => setLightboxImage(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  onClick={() => setLightboxImage(null)}
                  className="absolute top-4 right-4 z-20 bg-slate-800/80 text-white hover:bg-emerald-500 p-2 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Left: Image Box */}
                <div className="md:w-3/5 bg-black flex items-center justify-center p-4 min-h-[300px]">
                  <img
                    src={lightboxImage.file}
                    alt={lightboxImage.name}
                    className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Right: Info Details */}
                <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between text-white space-y-6">
                  <div className="space-y-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold uppercase tracking-wider">
                      {lightboxImage.category}
                    </span>
                    <h2 className="text-2xl font-extrabold tracking-tight font-display text-white">
                      {lightboxImage.name}
                    </h2>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {lightboxImage.description || 'High resolution original asset image served directly from local workspace assets.'}
                    </p>
                    <div className="bg-slate-800/60 rounded-xl p-4 space-y-2 text-xs font-mono text-slate-400 border border-slate-700/50">
                      <div className="flex justify-between">
                        <span>Direct Path:</span>
                        <span className="text-emerald-400 font-bold">{lightboxImage.file}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Server Status:</span>
                        <span className="text-emerald-400 font-bold">200 OK (Served)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <a
                      href={lightboxImage.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-3 rounded-xl transition-all flex items-center justify-center space-x-2 border border-slate-700"
                    >
                      <Eye className="w-4 h-4 text-emerald-400" />
                      <span>Open Image in New Tab</span>
                    </a>
                    <button
                      onClick={() => {
                        const cat = lightboxImage.category;
                        setLightboxImage(null);
                        if (cat === 'AC & Cooling') startJourney('AC');
                        else if (cat === 'Refrigeration') startJourney('Refrigerator');
                        else if (cat === 'Mobiles & Electronics') startJourney('Mobile');
                        else if (cat === 'Washing Machines') startJourney('WashingMachine');
                        else if (cat === 'Batteries & Heavy Scrap') startJourney('InverterBattery');
                        else {
                          setActiveTab('home');
                        }
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-3 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-900/30"
                    >
                      <span>Start Scrap Evaluation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* FOOTER AREA */}
      <footer id="app-footer" className="bg-slate-900 text-slate-400 border-t border-slate-800">
        
        {/* Recycle Brands banner inside footer */}
        <div className="border-b border-slate-800/80 py-8 bg-slate-950/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold block">
              Recycling smelter partners & premium certified brands
            </span>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 opacity-30 hover:opacity-60 transition-opacity">
              <span className="text-xs font-extrabold tracking-widest text-slate-300"> APPLE</span>
              <span className="text-xs font-extrabold tracking-widest text-slate-300">SAMSUNG</span>
              <span className="text-xs font-extrabold tracking-widest text-slate-300">ONEPLUS</span>
              <span className="text-xs font-extrabold tracking-widest text-slate-300">VOLTAS TATA</span>
              <span className="text-xs font-extrabold tracking-widest text-slate-300">DAIKIN</span>
              <span className="text-xs font-extrabold tracking-widest text-slate-300">LG ELECTRONICS</span>
              <span className="text-xs font-extrabold tracking-widest text-slate-300">TATA GREEN</span>
              <span className="text-xs font-extrabold tracking-widest text-slate-300">JSW METALS</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* About Column */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-white overflow-hidden p-0.5">
                  <img src="https://i.pinimg.com/1200x/af/44/c7/af44c7eb52433526439c20ff794b31fd.jpg" alt="ScrapyGo" className="w-full h-full object-contain rounded-md" referrerPolicy="no-referrer" />
                </div>
                <span className="text-lg font-bold text-white font-display">ScrapyGo</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Professional doorstep green recycling portal to turn your used appliances, split ACs, refrigerator dead units, and cell phones into immediate authenticated cash.
              </p>
            </div>

            {/* Help / Contact details */}
            <div>
              <h4 className="text-white text-xs font-mono font-bold tracking-widest uppercase mb-4">Direct Contact</h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="font-bold text-slate-200">+91 7303319913</span>
                </li>
                <li>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Send photos of dead industrial compressor units directly to our number for custom heavy-duty quotation appraisal.
                  </p>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white text-xs font-mono font-bold tracking-widest uppercase mb-4">Evaluation categories</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><button onClick={() => startJourney('AC')} className="hover:text-white transition-colors">Air Conditioners (AC)</button></li>
                <li><button onClick={() => startJourney('Refrigerator')} className="hover:text-white transition-colors">Refrigerators</button></li>
                <li><button disabled className="text-slate-600 cursor-not-allowed text-left">Mobile Phones (Offline)</button></li>
                <li><button onClick={() => startJourney('WashingMachine')} className="hover:text-white transition-colors">Washing Machines</button></li>
                <li><button onClick={() => startJourney('InverterBattery')} className="hover:text-white transition-colors">Inverter Batteries</button></li>
              </ul>
            </div>

            {/* Environmental disclaimer */}
            <div>
              <h4 className="text-white text-xs font-mono font-bold tracking-widest uppercase mb-4">E-Waste Compliance</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                ScrapyGo strictly aligns with hazardous material management rules. Every electronic waste circuit or metal copper coil is processed via eco-friendly smelters to reduce heavy metal landfill contamination.
              </p>
            </div>

          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <p>© 2026 ScrapyGo platform. All Rights Reserved. Recycled by Tata/JSW green smelter partners.</p>
            <div className="flex items-center gap-4">
              {isAdminUser(currentUser) && (
                <button
                  onClick={() => setActiveTab('admin-panel')}
                  className="text-emerald-400 font-mono text-xs hover:underline flex items-center gap-1 font-bold"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Portal (+91 7303319913)</span>
                </button>
              )}
              <span className="font-mono text-[10px]">Helpline: +91 7303319913</span>
            </div>
          </div>
        </div>
      </footer>

      {/* DETACHED LOGIN MODAL FOR DIRECT ACTIONS */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full relative space-y-6"
          >
            <button 
              onClick={() => { setShowLoginModal(false); setOtpSent(false); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {authMode === 'signup' ? 'Create Account' : 'Welcome Back'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {authMode === 'signup'
                  ? 'Sign up with your Gmail ID and mobile number.'
                  : 'Log in with your registered mobile number via OTP.'}
              </p>
            </div>

            {/* Mode Tabs */}
            {!otpSent && (
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setOtpError(''); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    authMode === 'signup'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setOtpError(''); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    authMode === 'login'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Log In
                </button>
              </div>
            )}

            {!otpSent ? (
              <form onSubmit={handleSendOtpForAuth} className="space-y-3.5">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isSendingOtp}
                      placeholder="e.g. Alex Johnson"
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 disabled:opacity-60"
                    />
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      10-Digit Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] font-medium text-slate-400">
                      {loginPhone.length}/10 digits
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      disabled={isSendingOtp}
                      className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-2 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 disabled:opacity-60"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+65">🇸🇬 +65</option>
                    </select>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-slate-400">
                        <Phone className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="tel"
                        required
                        disabled={isSendingOtp}
                        maxLength={10}
                        placeholder="e.g. 9876543210"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value.replace(/[^\d]/g, '').slice(0, 10))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 font-mono tracking-wider disabled:opacity-60"
                      />
                    </div>
                  </div>
                  {loginPhone.length > 0 && (
                    <div className="mt-1">
                      {loginPhone.length === 10 ? (
                        validateActiveMobileNumber(loginPhone, countryCode).valid ? (
                          <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Valid active 10-digit mobile number
                          </p>
                        ) : (
                          <p className="text-[10px] text-rose-500 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {validateActiveMobileNumber(loginPhone, countryCode).error}
                          </p>
                        )
                      ) : (
                        <p className="text-[10px] text-slate-400">
                          Enter {10 - loginPhone.length} more digit{10 - loginPhone.length > 1 ? 's' : ''} for active mobile verification
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Gmail ID <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400">
                        <Mail className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="email"
                        required
                        disabled={isSendingOtp}
                        placeholder="e.g. alex@gmail.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 disabled:opacity-60"
                      />
                    </div>
                  </div>
                )}

                {authMode === 'signup' && (
                  <div className="flex items-start gap-2 pt-0.5">
                    <input
                      type="checkbox"
                      id="terms-check-modal"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      disabled={isSendingOtp}
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
                    />
                    <label htmlFor="terms-check-modal" className="text-[11px] text-slate-600 cursor-pointer leading-tight">
                      I agree to the <span className="text-emerald-600 font-semibold underline">Terms</span> & <span className="text-emerald-600 font-semibold underline">Privacy Policy</span>
                    </label>
                  </div>
                )}

                {otpError && (
                  <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {otpError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSendingOtp || (authMode === 'signup' && !termsAccepted)}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-sm"
                >
                  {isSendingOtp ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Sending OTP Code...</span>
                    </>
                  ) : (
                    <span>Send Verification Code</span>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtpForAuth} className="space-y-3.5">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-900">
                  <p className="font-semibold text-[11px]">
                    OTP sent to <span className="font-bold">{countryCode} {loginPhone}</span>
                  </p>
                  {sandboxCode && (
                    <p className="mt-1.5 text-xs text-emerald-800 bg-emerald-100 border border-emerald-200/80 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 font-medium">
                      <span>OTP:</span>
                      <strong className="font-mono text-emerald-950 text-sm font-bold tracking-widest">{sandboxCode}</strong>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Enter 4-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    maxLength={6}
                    disabled={isVerifyingOtp}
                    placeholder="e.g. 1234"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^\d]/g, ''))}
                    className="w-full bg-slate-50 border border-slate-200 text-center text-base font-mono font-bold tracking-widest rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 disabled:opacity-60"
                  />
                </div>

                {otpError && (
                  <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {otpError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isVerifyingOtp}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isVerifyingOtp ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Verifying OTP...</span>
                    </>
                  ) : (
                    <span>Verify OTP & Continue</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => { setOtpSent(false); setOtpError(''); }}
                  className="w-full text-center text-[11px] text-slate-500 hover:text-slate-900 font-medium py-0.5"
                >
                  ← Change Number / Resend
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}

      {/* STICKY WHATSAPP CTA */}
      <motion.div 
        className="fixed bottom-6 right-6 z-40 hidden sm:block"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <a 
          href="https://wa.me/917303319913"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group font-bold text-xs"
          title="Direct Support via WhatsApp"
        >
          <MessageSquare className="w-4 h-4 fill-white text-[#25D366] animate-bounce" />
          <span>WhatsApp coordinator: +91 7303319913</span>
        </a>
      </motion.div>

      {/* SIDE NAVIGATION MENU (DRAWER) */}
      <AnimatePresence>
        {showSidebar && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSidebar(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />

            {/* Drawer container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 w-80 max-w-full bg-slate-950 text-white z-50 flex flex-col justify-between shadow-2xl border-r border-slate-800"
            >
              {/* Header inside drawer */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-white shadow-md overflow-hidden p-0.5">
                    <img src="https://i.pinimg.com/1200x/af/44/c7/af44c7eb52433526439c20ff794b31fd.jpg" alt="ScrapyGo" className="w-full h-full object-contain rounded-md" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <span className="text-base font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent">
                      ScrapyGo
                    </span>
                    <p className="text-[8px] text-emerald-500 font-mono tracking-widest font-bold uppercase">
                      Green Portal
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  title="Close navigation"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation list */}
              <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
                
                {/* Select City Button Row */}
                <button
                  onClick={() => {
                    setShowSidebar(false);
                    setShowCityModal(true);
                  }}
                  className="w-full text-left flex items-center justify-between px-4 py-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-900/30 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <div>
                      <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-400">Active City</p>
                      <p className="text-[11px] text-slate-200 font-bold">{selectedCity}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-500/60 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="pt-4 pb-1 text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 px-4">
                  Navigation
                </div>

                {/* Home */}
                <button
                  onClick={() => {
                    setActiveTab('home');
                    setJourneyStep(1);
                    setShowSidebar(false);
                  }}
                  className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'home'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-900/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <RotateCw className="w-4.5 h-4.5" />
                  <span className="text-xs">Home</span>
                </button>

                {/* Sell Appliance */}
                <button
                  onClick={() => {
                    startJourney('AC');
                    setShowSidebar(false);
                  }}
                  className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'sell-journey'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-900/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Smartphone className="w-4.5 h-4.5" />
                  <span className="text-xs">Sell Appliance</span>
                </button>

                {/* About Us */}
                <button
                  onClick={() => {
                    setActiveTab('about-us');
                    setShowSidebar(false);
                  }}
                  className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'about-us'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-900/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Leaf className="w-4.5 h-4.5" />
                  <span className="text-xs">About Us</span>
                </button>

                {/* Partners With Us */}
                <button
                  onClick={() => {
                    setActiveTab('partners');
                    setShowSidebar(false);
                  }}
                  className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'partners'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-900/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Building2 className="w-4.5 h-4.5" />
                  <span className="text-xs">Partners With Us</span>
                </button>

                {/* FAQ */}
                <button
                  onClick={() => {
                    setActiveTab('faq');
                    setShowSidebar(false);
                  }}
                  className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'faq'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-900/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <HelpCircle className="w-4.5 h-4.5" />
                  <span className="text-xs">FAQ</span>
                </button>

                {/* Contact Us */}
                <button
                  onClick={() => {
                    setActiveTab('contact');
                    setShowSidebar(false);
                  }}
                  className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'contact'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-900/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Mail className="w-4.5 h-4.5" />
                  <span className="text-xs">Contact Us</span>
                </button>

                {/* Admin Panel */}
                {isAdminUser(currentUser) && (
                  <button
                    onClick={() => {
                      setActiveTab('admin-panel');
                      setShowSidebar(false);
                    }}
                    className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === 'admin-panel'
                        ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-900/10'
                        : 'text-emerald-400 bg-slate-900 border border-emerald-500/30 font-bold hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
                    <span className="text-xs">Admin Control Panel</span>
                  </button>
                )}

                {currentUser && (
                  <button
                    onClick={() => {
                      setActiveTab('dashboard');
                      setShowSidebar(false);
                    }}
                    className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === 'dashboard'
                        ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-900/10'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <User className="w-4.5 h-4.5" />
                    <span className="text-xs">My Dashboard</span>
                  </button>
                )}

              </div>

              {/* Bottom statistics and branding inside drawer */}
              <div className="p-6 border-t border-slate-800 bg-slate-950/40 text-center space-y-3">
                <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800/40 space-y-1">
                  <p className="text-emerald-400 font-bold text-xs tracking-wide">120+ Tons E-Waste</p>
                  <p className="text-[10px] text-slate-500">Safely processed in certified refineries.</p>
                </div>
                <div className="text-[9px] text-slate-600 font-mono">
                  ISO 14001:2015 CERTIFIED PORTAL
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SELECT CITY MODAL */}
      <AnimatePresence>
        {showCityModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4 text-center">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCityModal(false)}
                className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm cursor-pointer"
              />

              {/* Modal Box */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-8 text-left align-middle shadow-2xl transition-all border border-slate-100 space-y-6"
              >
                <button
                  onClick={() => setShowCityModal(false)}
                  className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  title="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-emerald-600 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">Select Your Location</h3>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold">Local Market Rates</p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  ScrapyGo syncs pricing catalogs with local smelting yards and municipal metal indexes in your territory. Choose your region to get accurate estimates:
                </p>

                {/* Cities Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-slate-800">
                  {[
                    'Delhi NCR',
                    'Mumbai',
                    'Bangalore',
                    'Pune',
                    'Hyderabad',
                    'Chennai',
                    'Kolkata'
                  ].map((city) => {
                    const isActive = selectedCity === city;
                    return (
                      <button
                        key={city}
                        onClick={() => {
                          setSelectedCity(city as any);
                          localStorage.setItem('scrapygo_city', city);
                          setShowCityModal(false);
                          showToast(`Successfully loaded live scrap market rates for ${city}! 📈`);
                        }}
                        className={`px-4 py-3 text-xs rounded-xl font-bold transition-all text-center border cursor-pointer ${
                          isActive
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm shadow-emerald-50'
                            : 'bg-slate-50 border-slate-200/60 hover:bg-slate-100 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        {city}
                        {isActive && <Check className="w-3.5 h-3.5 inline ml-1.5 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 text-[10px] text-slate-400 leading-normal border border-slate-100 text-center font-mono">
                  💡 Payouts are instant via UPI/Cash upon on-site verification.
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST BANNER */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-6 z-50 bg-slate-900 border border-slate-800 text-white px-5 py-3.5 rounded-2xl shadow-2xl max-w-sm flex items-center space-x-3"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-white text-xs flex-shrink-0 font-bold">
              ✓
            </div>
            <p className="text-xs font-bold text-slate-100 leading-snug">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
