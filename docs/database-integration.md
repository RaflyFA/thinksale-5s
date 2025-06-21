# Database Integration Implementation

## Overview

Implementasi ini mengganti data statis/mock dengan data real dari database Supabase. Website sekarang menggunakan React Query untuk state management dan caching data, dengan service layer yang terpisah untuk operasi database.

## Architecture

### 1. Service Layer (`lib/services/`)
- **`product-service.ts`**: Handle operasi database untuk produk
- **`category-service.ts`**: Handle operasi database untuk kategori

### 2. Custom Hooks (`lib/hooks/`)
- **`use-products.ts`**: React Query hooks untuk produk
- **`use-categories.ts`**: React Query hooks untuk kategori

### 3. UI Components
- **`LoadingSpinner`**: Komponen loading state
- **`ErrorState`**: Komponen error state dengan retry functionality
- **`EmptyState`**: Komponen untuk empty state

### 4. Provider
- **`QueryProvider`**: React Query provider untuk caching dan state management

## Features Implemented

### ✅ Data Fetching
- Fetch produk unggulan (`is_featured = true`)
- Fetch produk terlaris (`is_best_seller = true`)
- Fetch semua kategori
- Search produk berdasarkan nama, deskripsi, processor

### ✅ Loading States
- Loading spinner saat fetch data
- Skeleton loading untuk better UX

### ✅ Error Handling
- Error state dengan retry functionality
- Graceful error handling untuk semua API calls

### ✅ Empty States
- Empty state yang informatif ketika tidak ada data
- Call-to-action untuk user

### ✅ Caching
- React Query caching untuk performa optimal
- Stale time dan garbage collection time yang sesuai

### ✅ Real-time Data
- Rating dan review count dari database
- Fallback ke generated values jika data tidak ada

## Database Schema

### Categories Table
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  processor VARCHAR(255),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  image_url TEXT,
  images TEXT[],
  ram_options TEXT[],
  ssd_options TEXT[],
  price_range VARCHAR(255),
  specs TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Product Variants Table
```sql
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  ram VARCHAR(50) NOT NULL,
  ssd VARCHAR(50) NOT NULL,
  price INTEGER NOT NULL,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Functions

### Product Service
```typescript
// Fetch semua produk
getProducts(): Promise<Product[]>

// Fetch produk unggulan
getFeaturedProducts(): Promise<Product[]>

// Fetch produk terlaris
getBestSellerProducts(): Promise<Product[]>

// Search produk
searchProducts(searchTerm: string): Promise<Product[]>
```

### Category Service
```typescript
// Fetch semua kategori
getCategories(): Promise<Category[]>

// Fetch kategori by slug
getCategoryBySlug(slug: string): Promise<Category | null>
```

## React Query Hooks

### Product Hooks
```typescript
// Hook untuk semua produk
const { data, isLoading, error, refetch } = useProducts()

// Hook untuk produk unggulan
const { data, isLoading, error, refetch } = useFeaturedProducts()

// Hook untuk produk terlaris
const { data, isLoading, error, refetch } = useBestSellerProducts()

// Hook untuk search
const { data, isLoading, error, refetch } = useSearchProducts(searchTerm)
```

### Category Hooks
```typescript
// Hook untuk semua kategori
const { data, isLoading, error, refetch } = useCategories()

// Hook untuk kategori by slug
const { data, isLoading, error, refetch } = useCategoryBySlug(slug)
```

## Usage Examples

### Basic Usage
```typescript
import { useFeaturedProducts } from '@/lib/hooks/use-products'

function MyComponent() {
  const { data: products, isLoading, error } = useFeaturedProducts()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorState onRetry={refetch} />
  if (!products?.length) return <EmptyState />

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

### Search Implementation
```typescript
import { useSearchProducts } from '@/lib/hooks/use-products'

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: results, isLoading } = useSearchProducts(searchTerm)

  return (
    <div>
      <input 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
      {isLoading && <LoadingSpinner />}
      {results?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

## Performance Optimizations

### 1. React Query Configuration
- **Stale Time**: 5-10 menit untuk mengurangi API calls
- **Garbage Collection**: 10-30 menit untuk memory management
- **Retry**: 1 kali retry untuk failed requests
- **Refetch on Window Focus**: Disabled untuk better UX

### 2. Database Indexes
```sql
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_best_seller ON products(is_best_seller);
CREATE INDEX idx_variants_product ON product_variants(product_id);
```

### 3. Image Optimization
- Next.js Image component dengan proper sizing
- Lazy loading untuk images
- Responsive image sizes

## Error Handling Strategy

### 1. Network Errors
- Automatic retry dengan React Query
- User-friendly error messages
- Retry button untuk manual retry

### 2. Data Validation
- TypeScript interfaces untuk type safety
- Fallback values untuk missing data
- Graceful degradation

### 3. Loading States
- Skeleton loading untuk better perceived performance
- Progressive loading untuk large datasets
- Optimistic updates where appropriate

## Testing

### Manual Testing Checklist
- [ ] Halaman utama load dengan data dari database
- [ ] Loading states muncul saat fetch data
- [ ] Error states muncul saat ada error
- [ ] Empty states muncul saat tidak ada data
- [ ] Search functionality bekerja
- [ ] Rating dan review count tampil dengan benar
- [ ] Retry functionality bekerja
- [ ] Caching bekerja (data tidak refetch setiap kali)

### Database Testing
```sql
-- Test queries
SELECT COUNT(*) FROM products WHERE is_featured = true;
SELECT COUNT(*) FROM products WHERE is_best_seller = true;
SELECT COUNT(*) FROM categories;
SELECT * FROM products WHERE name ILIKE '%lenovo%';
```

## Future Enhancements

### 1. Real-time Updates
- Supabase real-time subscriptions
- Live stock updates
- Real-time price changes

### 2. Advanced Search
- Filter by price range
- Filter by category
- Sort by rating, price, name
- Pagination

### 3. Performance
- Infinite scroll
- Virtual scrolling untuk large lists
- Service worker untuk offline support

### 4. Analytics
- Track product views
- Track search queries
- Track user interactions

## Troubleshooting

### Common Issues

1. **Data tidak muncul**
   - Cek Supabase connection
   - Cek environment variables
   - Cek database permissions

2. **Loading infinite**
   - Cek network connection
   - Cek API response
   - Cek React Query configuration

3. **Error states**
   - Cek browser console
   - Cek Supabase logs
   - Cek API endpoint URLs

### Debug Commands
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Check database connection
npm run dev
# Open browser and check console for errors
```

## Conclusion

Implementasi database integration ini memberikan foundation yang solid untuk e-commerce website dengan:

- ✅ Real data dari database
- ✅ Excellent user experience dengan loading/error states
- ✅ Performance optimization dengan caching
- ✅ Scalable architecture dengan service layer
- ✅ Type safety dengan TypeScript
- ✅ Best practices dengan React Query

Website sekarang siap untuk production dengan data real dan performa yang optimal. 