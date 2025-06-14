# Panduan Pengembangan ThinkSale E-Commerce

## Daftar Isi
1. [Struktur Proyek](#struktur-proyek)
2. [Konvensi Penamaan](#konvensi-penamaan)
3. [Standar Kode](#standar-kode)
4. [Komponen Utama](#komponen-utama)
5. [Responsivitas](#responsivitas)
6. [Optimasi Performa](#optimasi-performa)

## Struktur Proyek

\`\`\`
thinksale-ecommerce/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Halaman utama
│   ├── layout.tsx                # Layout utama
│   ├── globals.css               # Styling global
│   └── product/
│       └── [id]/
│           └── page.tsx          # Halaman detail produk
├── components/                   # Komponen React
│   ├── ui/                       # Komponen UI dasar
│   ├── enhanced-product-card.tsx # Kartu produk yang ditingkatkan
│   ├── footer-section.tsx        # Komponen footer
│   └── scrollable-product-list.tsx
├── lib/                          # Utilitas dan data
│   ├── data.ts                   # Data produk dan kategori
│   ├── types.ts                  # Definisi TypeScript
│   └── utils.ts                  # Fungsi utilitas
├── public/                       # Asset statis
│   └── images/                   # Gambar produk
└── docs/                         # Dokumentasi
    └── DEVELOPMENT_GUIDE.md      # Panduan ini
\`\`\`

## Konvensi Penamaan

### File dan Folder
- **Komponen**: `kebab-case.tsx` (contoh: `product-card.tsx`)
- **Pages**: `page.tsx` untuk App Router
- **Utilitas**: `camelCase.ts` (contoh: `formatPrice.ts`)
- **Konstanta**: `UPPER_SNAKE_CASE.ts` (contoh: `API_ENDPOINTS.ts`)

### Variabel dan Fungsi
- **Variabel**: `camelCase` (contoh: `productList`)
- **Konstanta**: `UPPER_SNAKE_CASE` (contoh: `MAX_PRODUCTS`)
- **Fungsi**: `camelCase` (contoh: `formatCurrency`)
- **Komponen**: `PascalCase` (contoh: `ProductCard`)

### CSS Classes
- Menggunakan **Tailwind CSS** dengan utility-first approach
- Custom classes menggunakan `kebab-case`

## Standar Kode

### TypeScript
\`\`\`typescript
// ✅ Baik - Menggunakan interface untuk props
interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
  className?: string;
}

// ✅ Baik - Menggunakan type untuk union types
type ButtonVariant = 'primary' | 'secondary' | 'outline';

// ❌ Hindari - Menggunakan any
const handleClick = (data: any) => { ... }

// ✅ Baik - Menggunakan type yang spesifik
const handleClick = (data: ProductData) => { ... }
\`\`\`

### React Components
\`\`\`tsx
// ✅ Baik - Functional component dengan TypeScript
export default function ProductCard({ 
  product, 
  showAddToCart = true,
  className = ""
}: ProductCardProps) {
  // Component logic here
  return (
    <div className={`product-card ${className}`}>
      {/* JSX content */}
    </div>
  );
}

// ✅ Baik - Menggunakan hooks dengan proper typing
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState<boolean>(false);
\`\`\`

### Styling dengan Tailwind
\`\`\`tsx
// ✅ Baik - Responsive design
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

// ✅ Baik - Hover effects
<button className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300">

// ✅ Baik - Conditional classes
<div className={`card ${isActive ? 'bg-blue-100' : 'bg-white'}`}>
\`\`\`

## Komponen Utama

### 1. Enhanced Product Card
Komponen kartu produk dengan fitur lengkap:
- Gambar produk dengan hover effect
- Informasi produk (nama, spesifikasi, harga)
- Rating dan ulasan
- Tombol aksi (tambah ke keranjang, wishlist)
- Responsive design

### 2. Footer Section
Footer komprehensif dengan:
- Informasi perusahaan dan social media
- Tautan navigasi yang terorganisir
- Informasi kontak lengkap
- Newsletter subscription
- Legal links

### 3. Scrollable Product List
Daftar produk yang dapat di-scroll dengan:
- Touch/mouse drag support
- Smooth scrolling
- Responsive grid layout

## Responsivitas

### Breakpoints Tailwind CSS
- `sm`: 640px dan ke atas (tablet kecil)
- `md`: 768px dan ke atas (tablet)
- `lg`: 1024px dan ke atas (desktop kecil)
- `xl`: 1280px dan ke atas (desktop)
- `2xl`: 1536px dan ke atas (desktop besar)

### Grid System
\`\`\`tsx
// Mobile-first approach
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* Grid items */}
</div>
\`\`\`

### Typography
\`\`\`tsx
// Responsive text sizes
<h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">
<p className="text-sm sm:text-base lg:text-lg">
\`\`\`

## Optimasi Performa

### Image Optimization
\`\`\`tsx
// Menggunakan Next.js Image component
<Image
  src={product.image || "/placeholder.svg"}
  alt={product.name}
  width={400}
  height={300}
  className="object-cover"
  priority={isAboveFold} // Untuk gambar di atas fold
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
/>
\`\`\`

### Code Splitting
\`\`\`tsx
// Dynamic imports untuk komponen besar
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>
});
\`\`\`

### Memoization
\`\`\`tsx
// Menggunakan useMemo untuk perhitungan berat
const filteredProducts = useMemo(() => {
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [products, searchTerm]);

// Menggunakan useCallback untuk event handlers
const handleAddToCart = useCallback((productId: string) => {
  // Add to cart logic
}, []);
\`\`\`

## Best Practices

### 1. Accessibility
- Gunakan semantic HTML elements
- Tambahkan `alt` text untuk gambar
- Gunakan `aria-label` untuk tombol icon
- Pastikan kontras warna yang cukup
- Support keyboard navigation

### 2. SEO
- Gunakan proper heading hierarchy (h1, h2, h3)
- Tambahkan meta descriptions
- Gunakan structured data untuk produk
- Optimasi loading speed

### 3. User Experience
- Loading states untuk operasi async
- Error handling yang user-friendly
- Smooth transitions dan animations
- Consistent design patterns

### 4. Performance
- Lazy loading untuk gambar
- Code splitting untuk bundle optimization
- Minimize re-renders dengan proper memoization
- Optimize bundle size

## Testing

### Unit Testing
\`\`\`typescript
// Contoh test untuk utility function
describe('formatCurrency', () => {
  it('should format number to Indonesian currency', () => {
    expect(formatCurrency(1000000)).toBe('Rp 1.000.000');
  });
});
\`\`\`

### Component Testing
\`\`\`tsx
// Contoh test untuk komponen
describe('ProductCard', () => {
  it('should render product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
  });
});
\`\`\`

## Deployment

### Build Optimization
\`\`\`bash
# Build untuk production
npm run build

# Analyze bundle size
npm run analyze
\`\`\`

### Environment Variables
\`\`\`env
# .env.local
NEXT_PUBLIC_API_URL=https://api.thinksale.com
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
\`\`\`

---

**Catatan**: Panduan ini akan terus diperbarui seiring dengan perkembangan proyek. Pastikan untuk selalu mengikuti standar dan konvensi yang telah ditetapkan untuk menjaga konsistensi kode.
