/**
 * ChromaCloset - Initial Wardrobe Dataset & SVG Icon Engine
 * Pre-populates a versatile capsule wardrobe across all essential garment categories
 */

const DEFAULT_WARDROBE = [
  // TOPS
  {
    id: 'top-1',
    name: 'Obsidian Silk Camp Shirt',
    category: 'tops',
    subType: 'shirt',
    color: '#111215',
    colorName: 'Obsidian Black',
    formality: 'party_glam',
    season: 'all_season',
    fabric: 'Silk / Satin',
    iconType: 'shirt_button'
  },
  {
    id: 'top-2',
    name: 'Crisp Egyptian Cotton Tee',
    category: 'tops',
    subType: 'tshirt',
    color: '#FFFFFF',
    colorName: 'Crisp White',
    formality: 'casual',
    season: 'all_season',
    fabric: 'Pima Cotton',
    iconType: 'tshirt'
  },
  {
    id: 'top-3',
    name: 'Emerald Satin Dress Shirt',
    category: 'tops',
    subType: 'shirt',
    color: '#065F46',
    colorName: 'Emerald Velvet',
    formality: 'party_glam',
    season: 'all_season',
    fabric: 'Silk Satin',
    iconType: 'shirt_button'
  },
  {
    id: 'top-4',
    name: 'Midnight Oxford Button-Down',
    category: 'tops',
    subType: 'shirt',
    color: '#0F1D38',
    colorName: 'Midnight Navy',
    formality: 'business_formal',
    season: 'all_season',
    fabric: 'Oxford Cotton',
    iconType: 'shirt_button'
  },
  {
    id: 'top-5',
    name: 'Charcoal Merino Knit Sweater',
    category: 'tops',
    subType: 'sweater',
    color: '#2C3038',
    colorName: 'Charcoal Slate',
    formality: 'smart_casual',
    season: 'winter',
    fabric: 'Merino Wool',
    iconType: 'sweater'
  },
  {
    id: 'top-6',
    name: 'Sandstone Ribbed Polo',
    category: 'tops',
    subType: 'polo',
    color: '#F5EBE1',
    colorName: 'Sandstone Cream',
    formality: 'smart_casual',
    season: 'summer',
    fabric: 'Ribbed Knit',
    iconType: 'polo'
  },
  {
    id: 'top-7',
    name: 'Terracotta Washed Linen Shirt',
    category: 'tops',
    subType: 'shirt',
    color: '#C86446',
    colorName: 'Terracotta Clay',
    formality: 'casual',
    season: 'summer',
    fabric: 'Breezy Linen',
    iconType: 'shirt_button'
  },
  {
    id: 'top-8',
    name: 'Sky Blue Chambray Shirt',
    category: 'tops',
    subType: 'shirt',
    color: '#93C5FD',
    colorName: 'Sky Chambray',
    formality: 'casual',
    season: 'all_season',
    fabric: 'Chambray',
    iconType: 'shirt_button'
  },

  // OUTERWEAR
  {
    id: 'outer-1',
    name: 'Lambskin Moto Biker Jacket',
    category: 'outerwear',
    subType: 'leather_jacket',
    color: '#111215',
    colorName: 'Obsidian Black',
    formality: 'party_glam',
    season: 'all_season',
    fabric: 'Smooth Leather',
    iconType: 'leather_jacket'
  },
  {
    id: 'outer-2',
    name: 'Camel Cashmere Overcoat',
    category: 'outerwear',
    subType: 'coat',
    color: '#C19A6B',
    colorName: 'Camel Tan',
    formality: 'smart_casual',
    season: 'winter',
    fabric: 'Cashmere Wool',
    iconType: 'overcoat'
  },
  {
    id: 'outer-3',
    name: 'Midnight Velvet Dinner Jacket',
    category: 'outerwear',
    subType: 'blazer',
    color: '#0F1D38',
    colorName: 'Midnight Navy',
    formality: 'party_glam',
    season: 'winter',
    fabric: 'Plush Velvet',
    iconType: 'blazer'
  },
  {
    id: 'outer-4',
    name: 'Charcoal Tailored Blazer',
    category: 'outerwear',
    subType: 'blazer',
    color: '#2C3038',
    colorName: 'Charcoal Slate',
    formality: 'business_formal',
    season: 'all_season',
    fabric: 'Worsted Wool',
    iconType: 'blazer'
  },
  {
    id: 'outer-5',
    name: 'Raw Indigo Denim Jacket',
    category: 'outerwear',
    subType: 'denim_jacket',
    color: '#1D4ED8',
    colorName: 'Royal Indigo',
    formality: 'casual',
    season: 'all_season',
    fabric: 'Japanese Selvedge',
    iconType: 'denim_jacket'
  },
  {
    id: 'outer-6',
    name: 'Olive Field Overshirt',
    category: 'outerwear',
    subType: 'overshirt',
    color: '#556B2F',
    colorName: 'Olive Utility',
    formality: 'casual',
    season: 'all_season',
    fabric: 'Ripstop Cotton',
    iconType: 'overshirt'
  },

  // BOTTOMS
  {
    id: 'bottom-1',
    name: 'Obsidian Pleated Trousers',
    category: 'bottoms',
    subType: 'trousers',
    color: '#111215',
    colorName: 'Obsidian Black',
    formality: 'party_glam',
    season: 'all_season',
    fabric: 'Fluid Crepe',
    iconType: 'trousers'
  },
  {
    id: 'bottom-2',
    name: 'Selvedge Deep Raw Denim',
    category: 'bottoms',
    subType: 'jeans',
    color: '#0F1D38',
    colorName: 'Midnight Navy',
    formality: 'smart_casual',
    season: 'all_season',
    fabric: 'Raw Denim',
    iconType: 'jeans'
  },
  {
    id: 'bottom-3',
    name: 'Tailored Heather Wool Slacks',
    category: 'bottoms',
    subType: 'trousers',
    color: '#6B7280',
    colorName: 'Heather Gray',
    formality: 'business_formal',
    season: 'winter',
    fabric: 'Flannel Wool',
    iconType: 'trousers'
  },
  {
    id: 'bottom-4',
    name: 'Chalk White Relaxed Trousers',
    category: 'bottoms',
    subType: 'trousers',
    color: '#F3F4F6',
    colorName: 'Chalk White',
    formality: 'smart_casual',
    season: 'summer',
    fabric: 'Linen Blend',
    iconType: 'trousers'
  },
  {
    id: 'bottom-5',
    name: 'Khaki Tapered Chinos',
    category: 'bottoms',
    subType: 'chinos',
    color: '#C19A6B',
    colorName: 'Camel Tan',
    formality: 'casual',
    season: 'all_season',
    fabric: 'Stretch Twill',
    iconType: 'chinos'
  },
  {
    id: 'bottom-6',
    name: 'Olive Slim Fatigue Pants',
    category: 'bottoms',
    subType: 'trousers',
    color: '#556B2F',
    colorName: 'Olive Utility',
    formality: 'casual',
    season: 'all_season',
    fabric: 'Cotton Sateen',
    iconType: 'trousers'
  },

  // FOOTWEAR
  {
    id: 'shoes-1',
    name: 'High-Gloss Chelsea Boots',
    category: 'footwear',
    subType: 'boots',
    color: '#111215',
    colorName: 'Obsidian Black',
    formality: 'party_glam',
    season: 'all_season',
    fabric: 'Calfskin Leather',
    iconType: 'boots'
  },
  {
    id: 'shoes-2',
    name: 'Minimalist White Court Sneakers',
    category: 'footwear',
    subType: 'sneakers',
    color: '#FFFFFF',
    colorName: 'Crisp White',
    formality: 'casual',
    season: 'all_season',
    fabric: 'Nappa Leather',
    iconType: 'sneakers'
  },
  {
    id: 'shoes-3',
    name: 'Burgundy Oxblood Loafers',
    category: 'footwear',
    subType: 'loafers',
    color: '#631D2D',
    colorName: 'Burgundy Wine',
    formality: 'smart_casual',
    season: 'all_season',
    fabric: 'Polished Leather',
    iconType: 'loafers'
  },
  {
    id: 'shoes-4',
    name: 'Sand Suede Chelsea Boots',
    category: 'footwear',
    subType: 'boots',
    color: '#C19A6B',
    colorName: 'Camel Tan',
    formality: 'smart_casual',
    season: 'all_season',
    fabric: 'Split Suede',
    iconType: 'boots'
  },
  {
    id: 'shoes-5',
    name: 'Rich Cognac Oxford Shoes',
    category: 'footwear',
    subType: 'dress_shoes',
    color: '#8B4513',
    colorName: 'Rich Cognac',
    formality: 'business_formal',
    season: 'all_season',
    fabric: 'Burnished Calf',
    iconType: 'dress_shoes'
  },

  // SOCKS & DETAILS
  {
    id: 'socks-1',
    name: 'Charcoal Mercerized Ribbed Socks',
    category: 'socks',
    subType: 'socks',
    color: '#2C3038',
    colorName: 'Charcoal Slate',
    formality: 'business_formal',
    season: 'all_season',
    fabric: 'Mercerized Cotton',
    iconType: 'socks'
  },
  {
    id: 'socks-2',
    name: 'Burgundy Wine Statement Socks',
    category: 'socks',
    subType: 'socks',
    color: '#631D2D',
    colorName: 'Burgundy Wine',
    formality: 'party_glam',
    season: 'all_season',
    fabric: 'Fine Gauge Rib',
    iconType: 'socks'
  },
  {
    id: 'socks-3',
    name: 'Mustard Saffron Accent Socks',
    category: 'socks',
    subType: 'socks',
    color: '#D97706',
    colorName: 'Mustard Saffron',
    formality: 'casual',
    season: 'all_season',
    fabric: 'Organic Cotton',
    iconType: 'socks'
  },
  {
    id: 'socks-4',
    name: 'No-Show Minimalist Black Liners',
    category: 'socks',
    subType: 'socks',
    color: '#111215',
    colorName: 'Obsidian Black',
    formality: 'casual',
    season: 'summer',
    fabric: 'Bamboo Blend',
    iconType: 'socks'
  },

  // ACCESSORIES
  {
    id: 'acc-1',
    name: 'Sleek Obsidian Leather Belt',
    category: 'accessories',
    subType: 'belt',
    color: '#111215',
    colorName: 'Obsidian Black',
    formality: 'party_glam',
    season: 'all_season',
    fabric: 'Matte Leather',
    iconType: 'belt'
  },
  {
    id: 'acc-2',
    name: 'Cognac Saddle Stitch Belt',
    category: 'accessories',
    subType: 'belt',
    color: '#8B4513',
    colorName: 'Rich Cognac',
    formality: 'business_formal',
    season: 'all_season',
    fabric: 'Bridle Leather',
    iconType: 'belt'
  }
];

// Helper to generate dynamic, stylized vector illustrations for clothing items
const GarmentSvgFactory = {
  getSvg(type, colorHex) {
    const isLight = ColorEngine.hexToHsl(colorHex).l > 75;
    const strokeColor = isLight ? '#2a2e39' : 'rgba(255,255,255,0.3)';
    const shadowColor = 'rgba(0,0,0,0.25)';

    switch (type) {
      case 'tshirt':
        return `
          <svg viewBox="0 0 100 100" class="garment-vector" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 18 L42 26 C47 28 53 28 58 26 L70 18 L86 32 L76 44 L70 38 L70 82 L30 82 L30 38 L24 44 L14 32 Z" 
                  fill="${colorHex}" stroke="${strokeColor}" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M42 26 C47 32 53 32 58 26" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M30 38 L70 38" stroke="${shadowColor}" stroke-width="1.5" stroke-dasharray="2 3"/>
          </svg>
        `;

      case 'shirt_button':
        return `
          <svg viewBox="0 0 100 100" class="garment-vector" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 18 L43 25 L50 21 L57 25 L68 18 L84 32 L74 42 L68 36 L68 82 L32 82 L32 36 L26 42 L16 32 Z" 
                  fill="${colorHex}" stroke="${strokeColor}" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M50 25 L50 82" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="1 8"/>
            <path d="M36 19 L46 29 L50 25 L54 29 L64 19" stroke="${strokeColor}" stroke-width="2.2"/>
            <circle cx="50" cy="38" r="1.5" fill="${strokeColor}"/>
            <circle cx="50" cy="52" r="1.5" fill="${strokeColor}"/>
            <circle cx="50" cy="66" r="1.5" fill="${strokeColor}"/>
          </svg>
        `;

      case 'polo':
        return `
          <svg viewBox="0 0 100 100" class="garment-vector" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 20 L42 26 L50 22 L58 26 L68 20 L84 34 L74 44 L68 38 L68 82 L32 82 L32 38 L26 44 L16 34 Z" 
                  fill="${colorHex}" stroke="${strokeColor}" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M42 26 L50 36 L58 26" stroke="${strokeColor}" stroke-width="2.5"/>
            <path d="M50 36 L50 52" stroke="${strokeColor}" stroke-width="2"/>
            <circle cx="50" cy="42" r="1.5" fill="${strokeColor}"/>
            <circle cx="50" cy="48" r="1.5" fill="${strokeColor}"/>
          </svg>
        `;

      case 'sweater':
        return `
          <svg viewBox="0 0 100 100" class="garment-vector" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28 22 L40 28 C46 30 54 30 60 28 L72 22 L88 38 L78 48 L70 42 L70 82 L30 82 L30 42 L22 48 L12 38 Z" 
                  fill="${colorHex}" stroke="${strokeColor}" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M30 78 L70 78" stroke="${strokeColor}" stroke-width="2"/>
            <path d="M40 28 C46 32 54 32 60 28" stroke="${strokeColor}" stroke-width="2.5"/>
          </svg>
        `;

      case 'leather_jacket':
      case 'blazer':
        return `
          <svg viewBox="0 0 100 100" class="garment-vector" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28 20 L42 26 L50 34 L58 26 L72 20 L88 38 L76 50 L68 44 L68 84 L32 84 L32 44 L24 50 L12 38 Z" 
                  fill="${colorHex}" stroke="${strokeColor}" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M34 22 L48 48 L50 84" stroke="${strokeColor}" stroke-width="2.2"/>
            <path d="M66 22 L52 48" stroke="${strokeColor}" stroke-width="2.2"/>
            <path d="M40 38 L54 38" stroke="${strokeColor}" stroke-width="1.8"/>
            <circle cx="52" cy="56" r="2" fill="${strokeColor}"/>
          </svg>
        `;

      case 'overcoat':
        return `
          <svg viewBox="0 0 100 100" class="garment-vector" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M26 16 L42 22 L50 30 L58 22 L74 16 L90 34 L78 46 L70 40 L70 92 L30 92 L30 40 L22 46 L10 34 Z" 
                  fill="${colorHex}" stroke="${strokeColor}" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M32 20 L46 44 L48 92" stroke="${strokeColor}" stroke-width="2.2"/>
            <path d="M68 20 L54 44" stroke="${strokeColor}" stroke-width="2.2"/>
            <circle cx="54" cy="52" r="2" fill="${strokeColor}"/>
            <circle cx="54" cy="66" r="2" fill="${strokeColor}"/>
          </svg>
        `;

      case 'denim_jacket':
      case 'overshirt':
        return `
          <svg viewBox="0 0 100 100" class="garment-vector" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28 20 L40 26 L60 26 L72 20 L88 36 L76 48 L68 42 L68 80 L32 80 L32 42 L24 48 L12 36 Z" 
                  fill="${colorHex}" stroke="${strokeColor}" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M50 26 L50 80" stroke="${strokeColor}" stroke-width="2"/>
            <rect x="36" y="40" width="10" height="12" rx="1" stroke="${strokeColor}" stroke-width="1.8"/>
            <rect x="54" y="40" width="10" height="12" rx="1" stroke="${strokeColor}" stroke-width="1.8"/>
          </svg>
        `;

      case 'trousers':
      case 'chinos':
        return `
          <svg viewBox="0 0 100 100" class="garment-vector" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 18 L70 18 L68 84 L52 84 L50 42 L48 84 L32 84 Z" 
                  fill="${colorHex}" stroke="${strokeColor}" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M40 18 L40 84" stroke="${shadowColor}" stroke-width="1.2" stroke-dasharray="3 4"/>
            <path d="M60 18 L60 84" stroke="${shadowColor}" stroke-width="1.2" stroke-dasharray="3 4"/>
            <path d="M30 24 L70 24" stroke="${strokeColor}" stroke-width="1.8"/>
          </svg>
        `;

      case 'jeans':
        return `
          <svg viewBox="0 0 100 100" class="garment-vector" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 18 L70 18 L67 86 L53 86 L50 44 L47 86 L33 86 Z" 
                  fill="${colorHex}" stroke="${strokeColor}" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M30 24 L70 24" stroke="${strokeColor}" stroke-width="2"/>
            <path d="M50 24 L50 40" stroke="${strokeColor}" stroke-width="1.8"/>
            <path d="M34 28 C42 28 42 38 42 38" stroke="${strokeColor}" stroke-width="1.5"/>
            <path d="M66 28 C58 28 58 38 58 38" stroke="${strokeColor}" stroke-width="1.5"/>
          </svg>
        `;

      case 'boots':
        return `
          <svg viewBox="0 0 100 100" class="garment-vector" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M35 24 L55 24 L55 52 L78 68 C82 72 80 80 74 80 L28 80 C24 80 24 74 26 66 L35 24 Z" 
                  fill="${colorHex}" stroke="${strokeColor}" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M26 80 L76 80 L76 84 L26 84 Z" fill="${strokeColor}"/>
            <path d="M44 24 L44 48" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="2 3"/>
          </svg>
        `;

      case 'sneakers':
        return `
          <svg viewBox="0 0 100 100" class="garment-vector" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 46 L48 46 L58 56 L82 66 C86 70 82 78 76 78 L20 78 C16 78 18 64 24 54 L30 46 Z" 
                  fill="${colorHex}" stroke="${strokeColor}" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M18 78 L80 78 L80 83 L18 83 Z" fill="${strokeColor}"/>
            <path d="M46 52 L54 62" stroke="${strokeColor}" stroke-width="2"/>
            <path d="M50 48 L58 58" stroke="${strokeColor}" stroke-width="2"/>
          </svg>
        `;

      case 'loafers':
      case 'dress_shoes':
        return `
          <svg viewBox="0 0 100 100" class="garment-vector" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 50 C44 48 54 50 62 58 L82 66 C86 70 82 78 76 78 L22 78 C18 78 20 66 26 58 L32 50 Z" 
                  fill="${colorHex}" stroke="${strokeColor}" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M20 78 L78 78 L78 82 L20 82 Z" fill="${strokeColor}"/>
            <rect x="42" y="52" width="14" height="6" rx="2" stroke="${strokeColor}" stroke-width="1.8"/>
          </svg>
        `;

      case 'socks':
        return `
          <svg viewBox="0 0 100 100" class="garment-vector" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M38 18 L60 18 L60 52 L76 68 C80 74 74 82 66 82 L48 82 C40 82 38 74 38 66 L38 18 Z" 
                  fill="${colorHex}" stroke="${strokeColor}" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M38 24 L60 24" stroke="${strokeColor}" stroke-width="2"/>
            <path d="M38 30 L60 30" stroke="${strokeColor}" stroke-width="1.5" stroke-dasharray="2 3"/>
          </svg>
        `;

      case 'belt':
        return `
          <svg viewBox="0 0 100 100" class="garment-vector" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 44 L84 44 L84 56 L16 56 Z" 
                  fill="${colorHex}" stroke="${strokeColor}" stroke-width="2.5"/>
            <rect x="24" y="40" width="16" height="20" rx="3" stroke="${strokeColor}" stroke-width="2.5" fill="none"/>
            <path d="M32 40 L32 60" stroke="${strokeColor}" stroke-width="2.5"/>
            <circle cx="56" cy="50" r="1.5" fill="${strokeColor}"/>
            <circle cx="66" cy="50" r="1.5" fill="${strokeColor}"/>
            <circle cx="76" cy="50" r="1.5" fill="${strokeColor}"/>
          </svg>
        `;

      default:
        return `
          <svg viewBox="0 0 100 100" class="garment-vector" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="24" y="24" width="52" height="52" rx="8" fill="${colorHex}" stroke="${strokeColor}" stroke-width="2.5"/>
            <circle cx="50" cy="50" r="12" stroke="${strokeColor}" stroke-width="2"/>
          </svg>
        `;
    }
  }
};

// Storage manager
const WardrobeStore = {
  STORAGE_KEY: 'chromacloset_wardrobe_v1',

  getAll() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('LocalStorage error, fallback to default wardrobe:', e);
    }
    // Save defaults
    this.save(DEFAULT_WARDROBE);
    return DEFAULT_WARDROBE;
  },

  save(items) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save wardrobe to localStorage:', e);
    }
  },

  addItem(item) {
    const items = this.getAll();
    items.unshift(item);
    this.save(items);
    return items;
  },

  updateItem(updatedItem) {
    let items = this.getAll();
    items = items.map(it => it.id === updatedItem.id ? updatedItem : it);
    this.save(items);
    return items;
  },

  deleteItem(id) {
    let items = this.getAll();
    items = items.filter(it => it.id !== id);
    this.save(items);
    return items;
  },

  resetToDefault() {
    this.save(DEFAULT_WARDROBE);
    return DEFAULT_WARDROBE;
  }
};
