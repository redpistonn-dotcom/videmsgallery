// Sample catalogue. In production this comes from the Node/PostgreSQL API.
// Shape mirrors the planned DB tables: categories, products, combos, combo_slots.

export const categories = [
  { slug: 'sofas', name: 'Sofas', kind: 'sofa', tone: '#C8281F' },
  { slug: 'beds', name: 'Beds', kind: 'bed', tone: '#B79A74' },
  { slug: 'dining', name: 'Dining', kind: 'table', tone: '#8B5A25' },
  { slug: 'wardrobes', name: 'Wardrobes', kind: 'wardrobe', tone: '#A9825A' },
  { slug: 'chairs', name: 'Chairs', kind: 'chair', tone: '#2F4A3A' },
  { slug: 'tv-units', name: 'TV Units', kind: 'tvunit', tone: '#6B4A33' },
  { slug: 'tables', name: 'Coffee Tables', kind: 'coffee', tone: '#9C7A52' },
  { slug: 'lighting', name: 'Lighting', kind: 'lamp', tone: '#B8862F' },
]

export const products = [
  { id: 'p1', slug: 'aria-3-seater-sofa', name: 'Aria 3 Seater Sofa', category: 'sofas', kind: 'sofa', tone: '#C8281F', price: 38900, mrp: 52900, material: 'Sheesham wood · Velvet', rating: 4.7, reviews: 214, tag: 'Bestseller', stock: 'in' },
  { id: 'p2', slug: 'milano-l-shape-sofa', name: 'Milano L-Shape Sofa', category: 'sofas', kind: 'sofa', tone: '#3E4C59', price: 64900, mrp: 82000, material: 'Teak wood · Linen blend', rating: 4.6, reviews: 98, tag: 'New', stock: 'in' },
  { id: 'p3', slug: 'verona-accent-sofa', name: 'Verona 2 Seater Sofa', category: 'sofas', kind: 'sofa', tone: '#B8862F', price: 27500, mrp: 34000, material: 'Mango wood · Velvet', rating: 4.5, reviews: 61, tag: null, stock: 'low' },
  { id: 'p4', slug: 'kyoto-king-bed', name: 'Kyoto King Size Bed', category: 'beds', kind: 'bed', tone: '#C9B79C', price: 46500, mrp: 61000, material: 'Solid sheesham · Fabric headboard', rating: 4.8, reviews: 176, tag: 'Bestseller', stock: 'in' },
  { id: 'p5', slug: 'oslo-storage-bed', name: 'Oslo Storage Bed', category: 'beds', kind: 'bed', tone: '#8B5A25', price: 52900, mrp: 68500, material: 'Engineered wood · Hydraulic', rating: 4.4, reviews: 83, tag: null, stock: 'in' },
  { id: 'p6', slug: 'aethel-6-seater-dining', name: 'Aethel 6 Seater Dining Table', category: 'dining', kind: 'table', tone: '#8B5A25', price: 41200, mrp: 54000, material: 'Solid mango wood', rating: 4.7, reviews: 132, tag: 'Popular', stock: 'in' },
  { id: 'p7', slug: 'torcello-dining-chair', name: 'Torcello Dining Chair', category: 'chairs', kind: 'chair', tone: '#2F4A3A', price: 5900, mrp: 7800, material: 'Solid wood · Fabric seat', rating: 4.6, reviews: 305, tag: null, stock: 'in' },
  { id: 'p8', slug: 'halo-floor-lamp', name: 'Halo Arc Floor Lamp', category: 'lighting', kind: 'lamp', tone: '#B8862F', price: 6800, mrp: 8900, material: 'Brass finish metal', rating: 4.8, reviews: 74, tag: 'New', stock: 'in' },
  { id: 'p9', slug: 'sienna-4-door-wardrobe', name: 'Sienna 4 Door Wardrobe', category: 'wardrobes', kind: 'wardrobe', tone: '#A9825A', price: 58900, mrp: 74500, material: 'Solid sheesham · Mirror', rating: 4.5, reviews: 59, tag: null, stock: 'in' },
  { id: 'p10', slug: 'nord-tv-unit', name: 'Nord TV Unit 72"', category: 'tv-units', kind: 'tvunit', tone: '#6B4A33', price: 21900, mrp: 28900, material: 'Solid mango wood', rating: 4.6, reviews: 112, tag: null, stock: 'in' },
  { id: 'p11', slug: 'luna-coffee-table', name: 'Luna Coffee Table', category: 'tables', kind: 'coffee', tone: '#9C7A52', price: 11800, mrp: 15200, material: 'Sheesham · Marble top', rating: 4.7, reviews: 143, tag: 'Popular', stock: 'in' },
  { id: 'p12', slug: 'ember-lounge-chair', name: 'Ember Lounge Chair', category: 'chairs', kind: 'chair', tone: '#C8281F', price: 14500, mrp: 18900, material: 'Teak wood · Velvet', rating: 4.9, reviews: 47, tag: 'New', stock: 'out' },
  { id: 'p13', slug: 'aria-2-seater-sofa', name: 'Aria 2 Seater Sofa', category: 'sofas', kind: 'sofa', tone: '#C8281F', price: 29900, mrp: 39900, material: 'Sheesham wood · Velvet', rating: 4.6, reviews: 90, tag: null, stock: 'in' },
  { id: 'p14', slug: 'marlo-glass-coffee-table', name: 'Marlo Glass Coffee Table', category: 'tables', kind: 'coffee', tone: '#6B4A33', price: 15600, mrp: 19800, material: 'Metal frame · Tempered glass', rating: 4.4, reviews: 38, tag: null, stock: 'in' },
  { id: 'p15', slug: 'cora-accent-chair', name: 'Cora Accent Chair', category: 'chairs', kind: 'chair', tone: '#B8862F', price: 9800, mrp: 12400, material: 'Solid wood · Boucle', rating: 4.5, reviews: 52, tag: null, stock: 'in' },
  { id: 'p16', slug: 'aethel-4-seater-dining', name: 'Aethel 4 Seater Dining Table', category: 'dining', kind: 'table', tone: '#9C6B35', price: 29800, mrp: 38500, material: 'Solid mango wood', rating: 4.6, reviews: 88, tag: null, stock: 'in' },
  { id: 'p17', slug: 'verde-dining-bench', name: 'Verde Upholstered Bench', category: 'dining', kind: 'table', tone: '#2F4A3A', price: 12900, mrp: 16800, material: 'Teak wood · Velvet seat', rating: 4.5, reviews: 41, tag: 'New', stock: 'in' },
  { id: 'p18', slug: 'sienna-3-door-wardrobe', name: 'Sienna 3 Door Wardrobe', category: 'wardrobes', kind: 'wardrobe', tone: '#8B5A25', price: 44900, mrp: 57900, material: 'Solid sheesham', rating: 4.6, reviews: 66, tag: null, stock: 'in' },
  { id: 'p19', slug: 'oslo-tv-unit-55', name: 'Oslo TV Unit 55"', category: 'tv-units', kind: 'tvunit', tone: '#A9825A', price: 16900, mrp: 21900, material: 'Engineered wood · Veneer', rating: 4.4, reviews: 57, tag: null, stock: 'in' },
]

export const byId = Object.fromEntries(products.map((p) => [p.id, p]))

// A combo = fixed set of slots. Each slot has a default product and eligible swaps.
// Final price = combo base price + sum(swap price − default price).
export const combos = [
  {
    id: 'c1',
    slug: 'the-living-room-suite',
    name: 'The Living Room Suite',
    room: 'Living room',
    blurb: 'A warm, grounded set built around the Aria sofa — sofa, coffee table and arc lamp, styled to work together.',
    basePrice: 51500,
    mrp: 64800,
    slots: [
      { label: 'Sofa', default: 'p1', options: ['p1', 'p3', 'p13', 'p2'] },
      { label: 'Coffee table', default: 'p11', options: ['p11', 'p14'] },
      { label: 'Floor lamp', default: 'p8', options: ['p8'] },
    ],
  },
  {
    id: 'c2',
    slug: 'the-dining-set',
    name: 'The Dining Sanctuary',
    room: 'Dining room',
    blurb: 'Solid mango dining table with upholstered chairs. Swap chair styles to suit your space.',
    basePrice: 62400,
    mrp: 78800,
    slots: [
      { label: 'Dining table', default: 'p6', options: ['p6'] },
      { label: 'Chairs × 4', default: 'p7', options: ['p7', 'p15', 'p12'], qty: 4 },
      { label: 'Accent light', default: 'p8', options: ['p8'] },
    ],
  },
  {
    id: 'c3',
    slug: 'the-bedroom-nocturne',
    name: 'The Bedroom Nocturne',
    room: 'Bedroom',
    blurb: 'King bed with a four-door wardrobe. Choose a storage bed for the extra room.',
    basePrice: 98900,
    mrp: 126000,
    slots: [
      { label: 'Bed', default: 'p4', options: ['p4', 'p5'] },
      { label: 'Wardrobe', default: 'p9', options: ['p9'] },
    ],
  },
  {
    id: 'c4',
    slug: 'the-media-lounge',
    name: 'The Media Lounge',
    room: 'TV lounge',
    blurb: 'Compact sofa, TV unit and coffee table for an easy evening-in setup.',
    basePrice: 59900,
    mrp: 77300,
    slots: [
      { label: 'Sofa', default: 'p13', options: ['p13', 'p3'] },
      { label: 'TV unit', default: 'p10', options: ['p10'] },
      { label: 'Coffee table', default: 'p14', options: ['p14', 'p11'] },
    ],
  },
  {
    id: 'c5',
    slug: 'the-reading-corner',
    name: 'The Reading Corner',
    room: 'Studio / corner',
    blurb: 'Lounge chair, accent chair and a glass table — a small, elegant corner.',
    basePrice: 33900,
    mrp: 41900,
    slots: [
      { label: 'Chair', default: 'p15', options: ['p15', 'p7'] },
      { label: 'Sofa', default: 'p3', options: ['p3', 'p13'] },
      { label: 'Table', default: 'p14', options: ['p14', 'p11'] },
    ],
  },
]


export const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN')
export const off = (price, mrp) => Math.round(((mrp - price) / mrp) * 100)

// Delivery rules are admin-configurable later; sample values for UI only.
export const delivery = { freeAbove: 25000, radiusKm: 200, flat: 1500 }

// Default configuration of a combo as a cart line (used by "Add combo" quick buttons).
export const comboCartItem = (c) => {
  const rows = c.slots.map((s) => ({ p: byId[s.default], q: s.qty || 1 }))
  return {
    key: `${c.id}:${c.slots.map((s) => s.default).join('-')}`,
    name: c.name,
    kind: rows[0].p.kind,
    tone: rows[0].p.tone,
    price: c.basePrice,
    meta: 'Room combo',
    lines: rows.map((r) => `${r.q > 1 ? r.q + '× ' : ''}${r.p.name}`),
  }
}

// Seconds until local midnight — drives the "deal ends in" timers (sample).
export const secondsToMidnight = () => {
  const n = new Date()
  const e = new Date(n)
  e.setHours(24, 0, 0, 0)
  return Math.max(0, Math.floor((e - n) / 1000))
}

export const coupons = [
  { code: 'VIDEM10', text: 'Extra 10% off', note: 'On orders above ₹20,000', type: 'pct', value: 10, min: 20000 },
  { code: 'COMBO15', text: '₹15,000 off', note: 'On orders above ₹90,000', type: 'flat', value: 15000, min: 90000 },
  { code: 'FIRST5', text: 'Flat 5% off', note: 'On your first order', type: 'pct', value: 5, min: 0 },
]
