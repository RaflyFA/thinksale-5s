# Component Standards & Guidelines

## Naming Conventions

### Files & Folders
- **Components**: PascalCase (`ProductCard.tsx`)
- **Hooks**: camelCase dengan prefix `use` (`useResponsive.ts`)
- **Utils**: camelCase (`formatPrice.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (`DESIGN_TOKENS`)

### Component Props
\`\`\`typescript
interface ComponentProps {
  // Required props first
  title: string
  items: Item[]
  
  // Optional props with defaults
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  
  // Event handlers
  onClick?: () => void
  onSubmit?: (data: FormData) => void
}
\`\`\`

## Component Structure

### Standard Template
\`\`\`typescript
/**
 * Component Name
 * 
 * Brief description of component purpose
 * List key features and use cases
 * 
 * @author ThinkSale Development Team
 * @version 1.0.0
 */

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface ComponentProps {
  // Props definition
}

const Component = forwardRef<HTMLElement, ComponentProps>(
  ({ className, ...props }, ref) => {
    return (
      <element
        ref={ref}
        className={cn('base-classes', className)}
        {...props}
      >
        {/* Component content */}
      </element>
    )
  }
)

Component.displayName = 'Component'

export default Component
\`\`\`

## Styling Guidelines

### Class Organization
\`\`\`typescript
// 1. Layout classes
'flex items-center justify-between'

// 2. Spacing classes  
'p-4 m-2 gap-4'

// 3. Typography classes
'text-lg font-semibold text-gray-900'

// 4. Background & borders
'bg-white border border-gray-200 rounded-lg'

// 5. Interactive states
'hover:bg-gray-50 focus:ring-2 focus:ring-blue-500'

// 6. Responsive classes
'sm:text-xl md:p-6 lg:grid-cols-3'
\`\`\`

### Conditional Styling
\`\`\`typescript
// Use cn() utility for conditional classes
className={cn(
  'base-classes',
  {
    'variant-classes': condition,
    'state-classes': isActive,
  },
  className // Allow override
)}
\`\`\`

## Performance Guidelines

### Image Optimization
\`\`\`typescript
<Image
  src={src || "/placeholder.svg"}
  alt={alt}
  width={width}
  height={height}
  className="object-cover"
  sizes="(max-width: 768px) 100vw, 50vw"
  priority={isPriority}
/>
\`\`\`

### Lazy Loading
\`\`\`typescript
// Use dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false
})
\`\`\`

## Accessibility Standards

### ARIA Labels
\`\`\`typescript
<button
  aria-label="Add to cart"
  aria-describedby="product-description"
>
  <ShoppingCart />
</button>
\`\`\`

### Keyboard Navigation
\`\`\`typescript
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
>
\`\`\`

## Testing Guidelines

### Component Testing
\`\`\`typescript
// Test component rendering
it('renders correctly', () => {
  render(<Component {...defaultProps} />)
  expect(screen.getByRole('button')).toBeInTheDocument()
})

// Test interactions
it('handles click events', () => {
  const handleClick = jest.fn()
  render(<Component onClick={handleClick} />)
  fireEvent.click(screen.getByRole('button'))
  expect(handleClick).toHaveBeenCalled()
})
\`\`\`

## Error Handling

### Error Boundaries
\`\`\`typescript
// Wrap components that might fail
<ErrorBoundary fallback={<ErrorFallback />}>
  <Component />
</ErrorBoundary>
\`\`\`

### Loading States
\`\`\`typescript
if (isLoading) return <Skeleton />
if (error) return <ErrorMessage error={error} />
return <Component data={data} />
\`\`\`

## Documentation Requirements

### Component Documentation
1. **Purpose**: What the component does
2. **Props**: All props with types and descriptions  
3. **Examples**: Usage examples
4. **Accessibility**: ARIA requirements
5. **Performance**: Any performance considerations

### Code Comments
\`\`\`typescript
/**
 * Calculates discount percentage
 * @param originalPrice - Original product price
 * @param salePrice - Discounted price
 * @returns Discount percentage rounded to nearest integer
 */
function calculateDiscount(originalPrice: number, salePrice: number): number {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}
