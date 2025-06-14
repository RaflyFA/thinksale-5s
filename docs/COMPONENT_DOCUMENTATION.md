# Dokumentasi Komponen ThinkSale

## Daftar Komponen

### 1. EnhancedProductCard

**Lokasi**: `components/enhanced-product-card.tsx`

**Deskripsi**: Komponen kartu produk yang ditingkatkan dengan fitur lengkap untuk menampilkan informasi produk secara menarik dan interaktif.

**Props**:
\`\`\`typescript
interface EnhancedProductCardProps {
  product: Product;           // Data produk yang akan ditampilkan
  showAddToCart?: boolean;    // Menampilkan tombol tambah ke keranjang (default: true)
  showWishlist?: boolean;     // Menampilkan tombol wishlist (default: true)
  className?: string;         // CSS class tambahan
}
\`\`\`

**Fitur**:
- ✅ Hover effects yang smooth
- ✅ Rating dan ulasan display
- ✅ Price comparison dengan diskon
- ✅ Quick action buttons
- ✅ Responsive design
- ✅ Accessibility support

**Penggunaan**:
\`\`\`tsx
<EnhancedProductCard 
  product={productData}
  showAddToCart={true}
  showWishlist={true}
  className="custom-class"
/>
\`\`\`

### 2. FooterSection

**Lokasi**: `components/footer-section.tsx`

**Deskripsi**: Komponen footer komprehensif dengan informasi lengkap perusahaan, navigasi, dan kontak.

**Fitur**:
- ✅ Company information dengan social media links
- ✅ Organized navigation links
- ✅ Complete contact information
- ✅ Newsletter subscription
- ✅ Legal links dan copyright
- ✅ Responsive layout

**Sections**:
1. **Company Info**: Logo, deskripsi, social media
2. **Quick Links**: Navigasi utama website
3. **Customer Service**: Link bantuan dan kebijakan
4. **Contact Info**: Alamat, telepon, email, jam operasional
5. **Newsletter**: Form subscription
6. **Legal**: Copyright dan legal links

### 3. ScrollableProductList

**Lokasi**: `components/scrollable-product-list.tsx`

**Deskripsi**: Komponen daftar produk yang dapat di-scroll horizontal dengan dukungan touch dan mouse.

**Props**:
\`\`\`typescript
interface ScrollableProductListProps {
  products: Product[];        // Array produk yang akan ditampilkan
  id?: string;               // ID untuk scroll targeting
}
\`\`\`

**Fitur**:
- ✅ Horizontal scrolling
- ✅ Touch/mouse drag support
- ✅ Smooth scrolling animation
- ✅ Snap scrolling
- ✅ Responsive grid

## Styling Guidelines

### Tailwind CSS Classes yang Sering Digunakan

**Layout**:
\`\`\`css
/* Grid responsive */
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4

/* Flexbox */
flex items-center justify-between

/* Spacing */
space-y-4 space-x-6 gap-4 gap-6
\`\`\`

**Typography**:
\`\`\`css
/* Headings */
text-2xl sm:text-3xl lg:text-4xl font-bold

/* Body text */
text-sm sm:text-base text-gray-600

/* Truncation */
line-clamp-2 truncate
\`\`\`

**Interactive Elements**:
\`\`\`css
/* Hover effects */
hover:shadow-xl hover:scale-105 hover:bg-blue-700

/* Transitions */
transition-all duration-300 transition-colors duration-200

/* Focus states */
focus:ring-2 focus:ring-blue-500 focus:border-blue-500
\`\`\`

## Accessibility Features

### Keyboard Navigation
- Semua interactive elements dapat diakses dengan keyboard
- Proper tab order dan focus indicators
- Skip links untuk navigasi cepat

### Screen Reader Support
- Semantic HTML elements
- Proper ARIA labels dan descriptions
- Alt text untuk semua gambar

### Color Contrast
- Minimum contrast ratio 4.5:1 untuk text normal
- Minimum contrast ratio 3:1 untuk large text
- Color tidak menjadi satu-satunya indikator informasi

## Performance Optimizations

### Image Optimization
\`\`\`tsx
// Next.js Image component dengan optimasi
<Image
  src={product.image || "/placeholder.svg"}
  alt={product.name}
  width={400}
  height={300}
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
  priority={isAboveFold}
/>
\`\`\`

### Code Splitting
\`\`\`tsx
// Dynamic imports untuk komponen besar
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />
});
\`\`\`

### Memoization
\`\`\`tsx
// Memo untuk komponen yang sering re-render
const MemoizedProductCard = memo(ProductCard);

// useMemo untuk perhitungan berat
const filteredProducts = useMemo(() => {
  return products.filter(/* filter logic */);
}, [products, filterCriteria]);
\`\`\`

## Testing Guidelines

### Unit Tests
\`\`\`typescript
// Test untuk utility functions
describe('formatPrice', () => {
  it('should format Indonesian currency correctly', () => {
    expect(formatPrice(1000000)).toBe('Rp 1.000.000');
  });
});
\`\`\`

### Component Tests
\`\`\`tsx
// Test untuk komponen
describe('EnhancedProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Laptop',
    price: '10.000.000'
  };

  it('should render product name', () => {
    render(<EnhancedProductCard product={mockProduct} />);
    expect(screen.getByText('Test Laptop')).toBeInTheDocument();
  });

  it('should show add to cart button by default', () => {
    render(<EnhancedProductCard product={mockProduct} />);
    expect(screen.getByText('Tambah ke Keranjang')).toBeInTheDocument();
  });
});
\`\`\`

## Browser Support

### Minimum Requirements
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Progressive Enhancement
- Core functionality bekerja tanpa JavaScript
- Enhanced features dengan JavaScript enabled
- Graceful degradation untuk browser lama

## Maintenance

### Code Review Checklist
- [ ] TypeScript types properly defined
- [ ] Responsive design tested
- [ ] Accessibility features implemented
- [ ] Performance optimizations applied
- [ ] Error handling implemented
- [ ] Tests written and passing

### Regular Updates
- Update dependencies secara berkala
- Monitor performance metrics
- Review dan update dokumentasi
- Conduct accessibility audits

---

**Terakhir diperbarui**: Desember 2024
**Versi**: 1.0.0
