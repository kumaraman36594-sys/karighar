import { Product, Artist, Language } from '../types';

export interface RealCraftCategory {
  id: string;
  name: string;
  nameHi: string;
  nameTa: string;
  nameTe: string;
  region: string;
  regionHi: string;
  regionTa: string;
  regionTe: string;
  priceRange: [number, number];
  materials: string;
  makingTime: string;
  commonProducts: string;
  tags: string[];
  image: string;
  defaultProduct: {
    id: string;
    title: string;
    artistName: string;
    artistLocation: string;
    craft: string;
    price: number;
    material: string;
    size: string;
    makingTime: string;
    description: string;
    tags: string[];
    rating: number;
    reviewCount: number;
  };
  sampleAngles: {
    front: string;
    angle45: string;
    top: string;
  };
}

export const REAL_CRAFT_CATEGORIES: RealCraftCategory[] = [
  {
    id: 'blue_pottery',
    name: 'Blue Pottery',
    nameHi: 'नीला मिट्टी के बर्तन',
    nameTa: 'நீல மண்பாண்டம்',
    nameTe: 'బ్లూ పాట్టీ',
    region: 'Jaipur, Rajasthan',
    regionHi: 'जयपुर, राजस्थान',
    regionTa: 'ஜெய்ப்பூர், ராஜஸ்தான்',
    regionTe: 'జైపూర్, రాజస్థాన్',
    priceRange: [450, 2500],
    materials: "Quartz, fuller's earth, clay",
    makingTime: '3-7 days',
    commonProducts: 'Vases, plates, bowls, tea sets',
    tags: ['pottery', 'blue pottery', 'jaipur', 'handmade', 'rajasthan'],
    image: '/assets/crafts/blue_pottery_vase.jpg',
    defaultProduct: {
      id: 'prod_001',
      title: 'Handmade Blue Pottery Vase',
      artistName: 'Ramesh Kumar',
      artistLocation: 'Jaipur, Rajasthan',
      craft: 'Blue Pottery',
      price: 550,
      material: 'Clay and quartz',
      size: '20cm × 15cm',
      makingTime: '3 days',
      description: 'Beautiful handcrafted blue pottery vase made with traditional Jaipur techniques. Perfect for home decoration and gifting.',
      tags: ['pottery', 'blue pottery', 'jaipur', 'handmade'],
      rating: 4.8,
      reviewCount: 12,
    },
    sampleAngles: {
      front: '/assets/crafts/blue_pottery_vase.jpg',
      angle45: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
      top: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    },
  },
  {
    id: 'kanjivaram',
    name: 'Kanjivaram Silk',
    nameHi: 'कांजीवरम रेशम',
    nameTa: 'காஞ்சிபுரம் பட்டு',
    nameTe: 'కాంచీపురం పట్టు',
    region: 'Kanchipuram, Tamil Nadu',
    regionHi: 'कांचीपुरम, तमिलनाडु',
    regionTa: 'காஞ்சிபுரம், தமிழ்நாடு',
    regionTe: 'కాంచీపురం, తమిళనాడు',
    priceRange: [3500, 25000],
    materials: 'Pure mulberry silk, zari',
    makingTime: '10-20 days',
    commonProducts: 'Sarees, dupattas',
    tags: ['silk saree', 'kanjivaram', 'tamil nadu', 'wedding', 'handloom'],
    image: '/assets/crafts/kanjivaram_saree.jpg',
    defaultProduct: {
      id: 'prod_002',
      title: 'Kanjivaram Silk Saree',
      artistName: 'Sita Devi',
      artistLocation: 'Kanchipuram, Tamil Nadu',
      craft: 'Handloom',
      price: 8500,
      material: 'Pure mulberry silk',
      size: '6.3 meters',
      makingTime: '15 days',
      description: 'Traditional Kanjivaram silk saree woven with pure mulberry silk and zari border. Perfect for weddings and special occasions.',
      tags: ['silk saree', 'kanjivaram', 'tamil nadu', 'handloom'],
      rating: 4.9,
      reviewCount: 28,
    },
    sampleAngles: {
      front: '/assets/crafts/kanjivaram_saree.jpg',
      angle45: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
      top: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
    },
  },
  {
    id: 'bandhani',
    name: 'Bandhani',
    nameHi: 'बांधनी',
    nameTa: 'பாந்தனி',
    nameTe: 'బాంధని',
    region: 'Kutch, Gujarat',
    regionHi: 'कच्छ, गुजरात',
    regionTa: 'கட்ச், குஜராத்',
    regionTe: 'కచ్, గుజరాత్',
    priceRange: [350, 1800],
    materials: 'Cotton, silk',
    makingTime: '2-5 days',
    commonProducts: 'Dupattas, sarees, scarves',
    tags: ['bandhani', 'kutch', 'gujarat', 'tie-dye', 'handmade'],
    image: '/assets/crafts/bandhani_dupatta.jpg',
    defaultProduct: {
      id: 'prod_003',
      title: 'Bandhani Dupatta',
      artistName: 'Mohan Lal',
      artistLocation: 'Kutch, Gujarat',
      craft: 'Bandhani',
      price: 650,
      material: 'Cotton',
      size: '2.5 meters',
      makingTime: '3 days',
      description: 'Handcrafted bandhani dupatta from Kutch with traditional tie-dye patterns.',
      tags: ['bandhani', 'kutch', 'gujarat', 'tie-dye'],
      rating: 4.7,
      reviewCount: 18,
    },
    sampleAngles: {
      front: '/assets/crafts/bandhani_dupatta.jpg',
      angle45: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80',
      top: 'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?w=800&auto=format&fit=crop&q=80',
    },
  },
  {
    id: 'banarasi',
    name: 'Banarasi Silk',
    nameHi: 'बनारसी रेशम',
    nameTa: 'வாரணாசி பட்டு',
    nameTe: 'బనారసి పట్టు',
    region: 'Varanasi, Uttar Pradesh',
    regionHi: 'वाराणसी, उत्तर प्रदेश',
    regionTa: 'வாரணாசி, உத்திரப் பிரதேசம்',
    regionTe: 'వారణాసి, ఉత్తరప్రదేశ్',
    priceRange: [2000, 15000],
    materials: 'Silk, zari, brocade',
    makingTime: '7-15 days',
    commonProducts: 'Sarees, lehengas, fabrics',
    tags: ['banarasi', 'varanasi', 'silk', 'wedding', 'handloom'],
    image: '/assets/crafts/banarasi_saree.jpg',
    defaultProduct: {
      id: 'prod_004',
      title: 'Banarasi Silk Saree',
      artistName: 'Lakshmi Prasad',
      artistLocation: 'Varanasi, Uttar Pradesh',
      craft: 'Handloom',
      price: 4500,
      material: 'Silk and zari',
      size: '6.3 meters',
      makingTime: '10 days',
      description: 'Elegant Banarasi silk saree with traditional brocade work. Ideal for weddings.',
      tags: ['banarasi', 'varanasi', 'silk', 'wedding'],
      rating: 4.8,
      reviewCount: 22,
    },
    sampleAngles: {
      front: '/assets/crafts/banarasi_saree.jpg',
      angle45: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
      top: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    },
  },
  {
    id: 'dhokra',
    name: 'Dhokra',
    nameHi: 'ढोकरा',
    nameTa: 'டோக்ரா',
    nameTe: 'ధోక్రా',
    region: 'Bastar, Chhattisgarh',
    regionHi: 'बस्तर, छत्तीसगढ़',
    regionTa: 'பஸ்தர், சத்தீஸ்கர்',
    regionTe: 'బస్తర్, ఛత్తీస్‌గఢ్',
    priceRange: [500, 5000],
    materials: 'Brass, bronze (lost-wax casting)',
    makingTime: '5-10 days',
    commonProducts: 'Figurines, jewelry, home decor',
    tags: ['dhokra', 'bastar', 'tribal', 'brass', 'handicraft'],
    image: '/assets/crafts/dhokra_figurine.jpg',
    defaultProduct: {
      id: 'prod_005',
      title: 'Dhokra Brass Figurine',
      artistName: 'Budhan Ram',
      artistLocation: 'Bastar, Chhattisgarh',
      craft: 'Metal Craft',
      price: 1200,
      material: 'Brass (lost-wax casting)',
      size: '15cm × 10cm',
      makingTime: '7 days',
      description: 'Traditional Dhokra brass figurine made using ancient lost-wax casting technique.',
      tags: ['dhokra', 'bastar', 'tribal', 'brass'],
      rating: 4.9,
      reviewCount: 15,
    },
    sampleAngles: {
      front: '/assets/crafts/dhokra_figurine.jpg',
      angle45: 'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?w=800&auto=format&fit=crop&q=80',
      top: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    },
  },
  {
    id: 'madhubani',
    name: 'Madhubani',
    nameHi: 'मधुबनी',
    nameTa: 'மதுபானி',
    nameTe: 'మధుబని',
    region: 'Mithila, Bihar',
    regionHi: 'मिथिला, बिहार',
    regionTa: 'மிதிலா, பீகார்',
    regionTe: 'మిథిల, బీహార్',
    priceRange: [300, 5000],
    materials: 'Natural pigments, handmade paper, cloth',
    makingTime: '2-7 days',
    commonProducts: 'Paintings, wall art',
    tags: ['madhubani', 'mithila', 'bihar', 'painting', 'folk art'],
    image: '/assets/crafts/madhubani_painting.jpg',
    defaultProduct: {
      id: 'prod_006',
      title: 'Madhubani Painting',
      artistName: 'Sushila Devi',
      artistLocation: 'Mithila, Bihar',
      craft: 'Folk Painting',
      price: 800,
      material: 'Natural pigments on handmade paper',
      size: '30cm × 40cm',
      makingTime: '3 days',
      description: 'Traditional Madhubani painting with intricate patterns and natural colors.',
      tags: ['madhubani', 'mithila', 'bihar', 'folk art'],
      rating: 4.7,
      reviewCount: 20,
    },
    sampleAngles: {
      front: '/assets/crafts/madhubani_painting.jpg',
      angle45: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
      top: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    },
  },
  {
    id: 'pattachitra',
    name: 'Pattachitra',
    nameHi: 'पट्टचित्र',
    nameTa: 'பட்டச்சித்திர',
    nameTe: 'పట్టచిత్ర',
    region: 'Puri, Odisha',
    regionHi: 'पुरी, ओडिशा',
    regionTa: 'புரி, ஒடிசா',
    regionTe: 'పూరి, ఒడిశా',
    priceRange: [400, 6000],
    materials: 'Natural colors, cloth, palm leaf',
    makingTime: '3-10 days',
    commonProducts: 'Paintings, scrolls',
    tags: ['pattachitra', 'odisha', 'puri', 'painting', 'folk art'],
    image: '/assets/crafts/pattachitra_painting.jpg',
    defaultProduct: {
      id: 'prod_007',
      title: 'Pattachitra Scroll Painting',
      artistName: 'Raghunath Maharana',
      artistLocation: 'Puri, Odisha',
      craft: 'Folk Painting',
      price: 1500,
      material: 'Natural colors on cloth',
      size: '45cm × 60cm',
      makingTime: '10 days',
      description: 'Traditional Pattachitra scroll painting from Odisha with mythological themes.',
      tags: ['pattachitra', 'odisha', 'puri', 'folk art'],
      rating: 4.8,
      reviewCount: 12,
    },
    sampleAngles: {
      front: '/assets/crafts/pattachitra_painting.jpg',
      angle45: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=800&auto=format&fit=crop&q=80',
      top: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    },
  },
  {
    id: 'paithani',
    name: 'Paithani',
    nameHi: 'पैठणी',
    nameTa: 'பைத்தானி',
    nameTe: 'పైథాని',
    region: 'Paithan, Maharashtra',
    regionHi: 'पैठन, महाराष्ट्र',
    regionTa: 'பைத்தான், மகாராஷ்டிரா',
    regionTe: 'పైఠాన్, మహారాష్ట్ర',
    priceRange: [5000, 50000],
    materials: 'Pure silk, zari',
    makingTime: '15-30 days',
    commonProducts: 'Sarees',
    tags: ['paithani', 'maharashtra', 'silk saree', 'handloom', 'wedding'],
    image: '/assets/crafts/paithani_saree.jpg',
    defaultProduct: {
      id: 'prod_008',
      title: 'Paithani Silk Saree',
      artistName: 'Sunita Patil',
      artistLocation: 'Paithan, Maharashtra',
      craft: 'Handloom',
      price: 15000,
      material: 'Pure silk and zari',
      size: '6.3 meters',
      makingTime: '25 days',
      description: 'Exquisite Paithani silk saree with traditional peacock border. A bridal heirloom.',
      tags: ['paithani', 'maharashtra', 'silk saree', 'wedding'],
      rating: 5.0,
      reviewCount: 8,
    },
    sampleAngles: {
      front: '/assets/crafts/paithani_saree.jpg',
      angle45: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&auto=format&fit=crop&q=80',
      top: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    },
  },
  {
    id: 'channapatna',
    name: 'Channapatna',
    nameHi: 'चन्नपटना',
    nameTa: 'சன்னபட்டணா',
    nameTe: 'చన్నపట్న',
    region: 'Channapatna, Karnataka',
    regionHi: 'चन्नपटना, कर्नाटक',
    regionTa: 'சன்னபட்டணா, கர்நாடகா',
    regionTe: 'చన్నపట్న, కర్ణాటక',
    priceRange: [200, 2000],
    materials: 'Ivory wood, natural lacquer',
    makingTime: '1-3 days',
    commonProducts: 'Toys, decorative items, jewelry',
    tags: ['channapatna', 'karnataka', 'toys', 'wooden', 'handmade'],
    image: '/assets/crafts/channapatna_toys.jpg',
    defaultProduct: {
      id: 'prod_009',
      title: 'Channapatna Wooden Toys',
      artistName: 'Krishna Murthy',
      artistLocation: 'Channapatna, Karnataka',
      craft: 'Wooden Toys',
      price: 450,
      material: 'Ivory wood and natural lacquer',
      size: 'Set of 5 pieces',
      makingTime: '2 days',
      description: 'Safe and colorful wooden toys for children made with natural lacquer.',
      tags: ['channapatna', 'karnataka', 'toys', 'wooden'],
      rating: 4.9,
      reviewCount: 35,
    },
    sampleAngles: {
      front: '/assets/crafts/channapatna_toys.jpg',
      angle45: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop&q=80',
      top: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80',
    },
  },
  {
    id: 'kalamkari',
    name: 'Kalamkari',
    nameHi: 'कलमकारी',
    nameTa: 'கலம்சாரி',
    nameTe: 'కలంకారీ',
    region: 'Srikalahasti, Andhra Pradesh',
    regionHi: 'श्रीकालहस्ती, आंध्र प्रदेश',
    regionTa: 'ஸ்ரீகாளஹஸ்தி, ஆந்திரா',
    regionTe: 'శ్రీకాళహస్తి, ఆంధ్రప్రదేశ్',
    priceRange: [500, 8000],
    materials: 'Cotton, natural dyes, myrobalan',
    makingTime: '5-15 days',
    commonProducts: 'Sarees, dupattas, fabrics',
    tags: ['kalamkari', 'andhra pradesh', 'hand-painted', 'textile', 'natural dye'],
    image: '/assets/crafts/kalamkari_textile.jpg',
    defaultProduct: {
      id: 'prod_010',
      title: 'Kalamkari Hand-Painted Dupatta',
      artistName: 'Venkatesh Rao',
      artistLocation: 'Srikalahasti, Andhra Pradesh',
      craft: 'Kalamkari',
      price: 1200,
      material: 'Cotton with natural dyes',
      size: '2.5 meters',
      makingTime: '7 days',
      description: 'Hand-painted Kalamkari dupatta with traditional motifs and natural dyes.',
      tags: ['kalamkari', 'andhra pradesh', 'hand-painted', 'natural dye'],
      rating: 4.7,
      reviewCount: 14,
    },
    sampleAngles: {
      front: '/assets/crafts/kalamkari_textile.jpg',
      angle45: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&auto=format&fit=crop&q=80',
      top: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    },
  },
  {
    id: 'terracotta',
    name: 'Terracotta',
    nameHi: 'टेराकोटा',
    nameTa: 'டெரகோட்டா',
    nameTe: 'టెర్రకోట',
    region: 'Bishnupur, West Bengal',
    regionHi: 'विष्णुपुर, पश्चिम बंगाल',
    regionTa: 'விஷ்ணுபூர், மேற்கு வங்காளம்',
    regionTe: 'విష్ణుపూర్, పశ్చిమ బెంగాల్',
    priceRange: [150, 800],
    materials: 'Clay, natural pigments',
    makingTime: '1-3 days',
    commonProducts: 'Earrings, necklaces, bangles',
    tags: ['terracotta', 'bengal', 'jewelry', 'clay', 'handmade'],
    image: '/assets/crafts/terracotta_jewelry.jpg',
    defaultProduct: {
      id: 'prod_011',
      title: 'Terracotta Earrings Set',
      artistName: 'Anjali Das',
      artistLocation: 'Bishnupur, West Bengal',
      craft: 'Terracotta Jewelry',
      price: 250,
      material: 'Clay and natural pigments',
      size: '3cm × 2cm (each)',
      makingTime: '1 day',
      description: 'Handcrafted terracotta earrings with traditional Bengali designs.',
      tags: ['terracotta', 'bengal', 'jewelry', 'clay'],
      rating: 4.6,
      reviewCount: 42,
    },
    sampleAngles: {
      front: '/assets/crafts/terracotta_jewelry.jpg',
      angle45: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&auto=format&fit=crop&q=80',
      top: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
    },
  },
  {
    id: 'warli',
    name: 'Warli',
    nameHi: 'वारली',
    nameTa: 'வார்லி',
    nameTe: 'వార్లీ',
    region: 'Palghar, Maharashtra',
    regionHi: 'पालघर, महाराष्ट्र',
    regionTa: 'பால்கர், மகாராஷ்டிரா',
    regionTe: 'పాల్ఘర్, మహారాష్ట్ర',
    priceRange: [250, 3000],
    materials: 'Rice paste, cloth, paper',
    makingTime: '1-4 days',
    commonProducts: 'Paintings, wall art',
    tags: ['warli', 'maharashtra', 'tribal art', 'painting', 'handmade'],
    image: '/assets/crafts/warli_painting.jpg',
    defaultProduct: {
      id: 'prod_012',
      title: 'Warli Tribal Painting',
      artistName: 'Jivya Soma Mashe',
      artistLocation: 'Palghar, Maharashtra',
      craft: 'Tribal Art',
      price: 950,
      material: 'Rice paste on cloth',
      size: '35cm × 45cm',
      makingTime: '2 days',
      description: 'Traditional Warli painting depicting tribal life and nature.',
      tags: ['warli', 'maharashtra', 'tribal art', 'painting'],
      rating: 4.8,
      reviewCount: 16,
    },
    sampleAngles: {
      front: '/assets/crafts/warli_painting.jpg',
      angle45: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
      top: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800&auto=format&fit=crop&q=80',
    },
  },
];

// Helper to get translated craft name
export function getCraftName(craftIdOrName: string, lang: Language): string {
  const clean = craftIdOrName.toLowerCase().replace(/[^a-z]/g, '');
  const item = REAL_CRAFT_CATEGORIES.find(c => 
    c.id.replace(/[^a-z]/g, '') === clean || 
    c.name.toLowerCase().replace(/[^a-z]/g, '') === clean ||
    clean.includes(c.id)
  );
  if (!item) return craftIdOrName;
  if (lang === 'hi') return item.nameHi;
  if (lang === 'ta') return item.nameTa;
  if (lang === 'te') return item.nameTe;
  return item.name;
}

// Helper to get translated craft region
export function getCraftRegion(craftIdOrName: string, lang: Language): string {
  const clean = craftIdOrName.toLowerCase().replace(/[^a-z]/g, '');
  const item = REAL_CRAFT_CATEGORIES.find(c => 
    c.id.replace(/[^a-z]/g, '') === clean || 
    c.name.toLowerCase().replace(/[^a-z]/g, '') === clean ||
    clean.includes(c.id)
  );
  if (!item) return '';
  if (lang === 'hi') return item.regionHi;
  if (lang === 'ta') return item.regionTa;
  if (lang === 'te') return item.regionTe;
  return item.region;
}

// Convert category data to the 12 marketplace products
export const REAL_12_PRODUCTS: Product[] = REAL_CRAFT_CATEGORIES.map((craft, idx) => {
  const p = craft.defaultProduct;
  return {
    id: p.id,
    artistId: `artist-${idx + 1}`,
    title: p.title,
    description: p.description,
    category: p.craft,
    material: p.material,
    price: p.price,
    tags: p.tags,
    imagePaths: [craft.sampleAngles.front, craft.sampleAngles.angle45, craft.sampleAngles.top],
    image: craft.image,
    artistName: p.artistName,
    artistLocation: p.artistLocation,
    craft: p.craft,
    size: p.size,
    dimensions: p.size,
    makingTime: p.makingTime,
    stock: 5 + (idx % 6),
    rating: p.rating,
    reviewCount: p.reviewCount,
    priceRange: craft.priceRange,
    region: craft.region,
    status: 'published',
    createdAt: new Date(Date.now() - idx * 86400000 * 2).toISOString(),
    featured: idx < 4,
    confidence: {
      title: 0.94,
      description: 0.88,
      category: 0.96,
      material: 0.91,
      price: 0.82,
    },
  };
});

// Artisans for the 12 crafts
export const REAL_12_ARTISTS: Artist[] = REAL_CRAFT_CATEGORIES.map((craft, idx) => {
  const p = craft.defaultProduct;
  const avatarPool = [
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  ];
  return {
    id: `artist-${idx + 1}`,
    name: p.artistName,
    village: p.artistLocation.split(',')[0].trim(),
    district: p.artistLocation,
    craft: p.craft,
    language: idx === 1 ? 'ta' : idx === 9 ? 'te' : 'hi',
    relationship: idx === 0 ? 'self' : 'helper',
    productIds: [p.id],
    createdAt: new Date(Date.now() - idx * 86400000 * 5).toISOString(),
    avatar: avatarPool[idx % avatarPool.length],
    totalEarned: 3500 + idx * 1200,
    rating: p.rating,
    reviewsCount: p.reviewCount,
    bio: `Master artisan specializing in authentic ${craft.name} from ${p.artistLocation}. Practicing traditional heritage craft passed down across generations.`,
  };
});

// Mock AI Service with real craft detection and pricing intelligence
export class MockAIService {
  static detectCraft(imagePathOrName: string): RealCraftCategory {
    const clean = (imagePathOrName || '').toLowerCase();
    
    for (const craft of REAL_CRAFT_CATEGORIES) {
      if (
        clean.includes(craft.id) ||
        clean.includes(craft.name.toLowerCase().replace(/\s+/g, '_')) ||
        craft.tags.some(t => clean.includes(t.toLowerCase()))
      ) {
        return craft;
      }
    }
    
    // Default fallback to Jaipur Blue Pottery
    return REAL_CRAFT_CATEGORIES[0];
  }

  static generateListing(imagePath: string, activeArtistName: string = 'Ramesh Kumar'): Product {
    const craft = this.detectCraft(imagePath);
    const p = craft.defaultProduct;

    return {
      id: `prod-gen-${Date.now()}`,
      artistId: 'artist-1',
      title: p.title,
      description: p.description,
      category: craft.defaultProduct.craft,
      material: p.material,
      price: p.price,
      priceRange: craft.priceRange,
      region: craft.region,
      dimensions: p.size,
      size: p.size,
      makingTime: p.makingTime,
      stock: 6,
      tags: craft.tags,
      imagePaths: [craft.sampleAngles.front, craft.sampleAngles.angle45, craft.sampleAngles.top],
      image: craft.image,
      artistName: activeArtistName || p.artistName,
      artistLocation: p.artistLocation,
      craft: p.craft,
      rating: 4.8,
      reviewCount: 1,
      createdAt: new Date().toISOString(),
      confidence: {
        title: 0.94,
        description: 0.85,
        category: 0.97,
        material: 0.9,
        price: 0.72,
      },
    };
  }

  static getPricingGuidance(imagePathOrCraftId: string): {
    craftName: string;
    region: string;
    range: [number, number];
    recommended: number;
    explanationEn: string;
    explanationHi: string;
  } {
    const craft = this.detectCraft(imagePathOrCraftId);
    return {
      craftName: craft.name,
      region: craft.region,
      range: craft.priceRange,
      recommended: craft.defaultProduct.price,
      explanationEn: `Similar ${craft.name.toLowerCase()} items in ${craft.region} sell for ₹${craft.priceRange[0].toLocaleString()} - ₹${craft.priceRange[1].toLocaleString()}`,
      explanationHi: `${craft.regionHi} में ऐसे ${craft.nameHi} आमतौर पर ₹${craft.priceRange[0].toLocaleString()} से ₹${craft.priceRange[1].toLocaleString()} में बिकते हैं`,
    };
  }
}

export const REAL_CRAFTS_DEMO_SCRIPT = [
  {
    time: '0:30',
    title: 'Ramesh & Jaipur Blue Pottery',
    titleHi: 'रमेश और जयपुर ब्लू पॉटरी',
    dialogue: '"Let me show you. Ramesh is a potter from Jaipur. He makes blue pottery — the famous Jaipur craft. Let me upload a real photo of his vase."',
    dialogueHi: '"देखिए, रमेश जयपुर के कुम्हार हैं। वे प्रसिद्ध ब्लू पॉटरी बनाते हैं। मैं उनके हस्तनिर्मित फूलदान की असली तस्वीर अपलोड करता हूँ।"',
    craftId: 'blue_pottery',
    action: 'upload_blue_pottery',
  },
  {
    time: '0:45',
    title: 'AI Recognition & Voice Q&A',
    titleHi: 'एआई पहचान व बोलकर उत्तर',
    dialogue: '"AI recognizes it as blue pottery. Let me answer the questions."',
    dialogueHi: '"एआई ने इसे तुरंत ब्लू पॉटरी के रूप में पहचान लिया। अब बोलकर आसान प्रश्नों के उत्तर देते हैं।"',
    craftId: 'blue_pottery',
    action: 'voice_qa',
  },
  {
    time: '1:10',
    title: 'Fair Market Price Suggestion',
    titleHi: 'बाज़ार का सही मूल्य',
    dialogue: '"AI generated the listing: \'Handmade Blue Pottery Vase\' from Jaipur. Look at the price suggestion — ₹450 to ₹2,500. This is what blue pottery actually sells for in Jaipur markets."',
    dialogueHi: '"एआई ने लिस्टिंग तैयार की: जयपुर का \'हैंडमेड ब्लू पॉटरी वाज़\'। मूल्य सुझाव देखिए: ₹450 से ₹2,500। जयपुर के बाज़ार में यह इसी सही दाम पर बिकता है।"',
    craftId: 'blue_pottery',
    action: 'review_pricing',
  },
  {
    time: '1:30',
    title: 'One-Tap Publish',
    titleHi: 'एक क्लिक में प्रकाशन',
    dialogue: '"One tap. Published."',
    dialogueHi: '"बस एक क्लिक — और उत्पाद तुरंत बाज़ार में प्रकाशित!"',
    craftId: 'blue_pottery',
    action: 'publish',
  },
  {
    time: '1:45',
    title: 'Pan-India Real Crafts Marketplace',
    titleHi: 'अखिल भारतीय हस्तशिल्प बाज़ार',
    dialogue: '"Now let me show you what a buyer sees. Here are real crafts from across India — Kanjivaram silk from Tamil Nadu, Bandhani from Kutch, Madhubani from Bihar."',
    dialogueHi: '"अब देखिए खरीदार को क्या दिखता है — पूरे भारत के असली हस्तशिल्प: तमिलनाडु का कांजीवरम रेशम, कच्छ की बांधनी, बिहार की मधुबनी चित्रकला।"',
    craftId: 'kanjivaram',
    action: 'buyer_view',
  },
  {
    time: '2:00',
    title: 'Direct Connection to Artisans',
    titleHi: 'कारीगर से सीधा संपर्क',
    dialogue: '"A buyer in Delhi can browse these. See the real prices, real regions, real artisans."',
    dialogueHi: '"दिल्ली या मुंबई का कोई भी खरीदार असली कारीगरों, उनके क्षेत्र और असली दामों को देखकर सीधे खरीदारी कर सकता है।"',
    craftId: 'madhubani',
    action: 'view_details',
  },
  {
    time: '2:15',
    title: 'Karighar: The Rural-Urban Bridge',
    titleHi: 'कारीगर — हुनर से बाज़ार तक',
    dialogue: '"This is what makes कारीगर different. It\'s not just an app — it\'s a bridge between rural artisans and urban buyers."',
    dialogueHi: '"यही कारीगर को ख़ास बनाता है — यह केवल एक ऐप नहीं, बल्कि ग्रामीण शिल्पकारों और शहरी खरीदारों के बीच एक सशक्त सेतु है।"',
    craftId: 'dhokra',
    action: 'finish_tour',
  },
];
