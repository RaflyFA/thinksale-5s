# Design System Documentation

## Overview
Dokumentasi lengkap sistem desain ThinkSale untuk memastikan konsistensi visual dan fungsional di seluruh aplikasi.

## Design Tokens

### Colors
\`\`\`typescript
// Primary Colors
primary: {
  50: '#eff6ff',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
}

// Secondary Colors
secondary: {
  500: '#8b5cf6',
  600: '#7c3aed',
}

// Neutral Colors
gray: {
  50: '#f9fafb',
  100: '#f3f4f6',
  500: '#6b7280',
  900: '#111827',
}
\`\`\`

### Typography
- **Font Family**: Inter (Primary), JetBrains Mono (Code)
- **Font Sizes**: xs (12px) → 5xl (48px)
- **Font Weights**: normal (400), medium (500), semibold (600), bold (700)

### Spacing
- **Scale**: xs (8px), sm (12px), md (16px), lg (24px), xl (32px), 2xl (48px)
- **Container**: Max-width 1280px dengan padding responsif

### Border Radius
- **sm**: 6px
- **md**: 8px  
- **lg**: 12px
- **xl**: 16px
- **2xl**: 24px

## Component Guidelines

### Product Card
- **Aspect Ratio**: Square (1:1) default
- **Hover Effects**: Scale 110%, translate Y -8px
- **Shadow**: Elevation dari sm → xl on hover
- **Content**: Image, title, specs, rating, price

### Buttons
- **Variants**: Primary, Secondary, Outline, Ghost
- **Sizes**: sm, md, lg
- **States**: Default, Hover, Active, Disabled

### Layout
- **Header**: Sticky, 80px height
- **Container**: Max-width 1280px, centered
- **Grid**: Responsive 1-4 columns
- **Spacing**: Consistent 16px-32px gaps

## Responsive Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## Animation Guidelines
- **Duration**: Fast (150ms), Normal (300ms), Slow (500ms)
- **Easing**: ease-out untuk entrance, ease-in untuk exit
- **Transform**: Scale, translate, opacity changes

## Accessibility
- **Color Contrast**: Minimum 4.5:1 ratio
- **Focus States**: Visible outline untuk keyboard navigation
- **ARIA Labels**: Untuk interactive elements
- **Semantic HTML**: Proper heading hierarchy

## File Organization
\`\`\`
components/
├── layout/          # Layout components
├── ui/             # Reusable UI components
└── sections/       # Page-specific sections

lib/
├── constants/      # Design tokens & constants
├── hooks/         # Custom hooks
└── utils/         # Utility functions
\`\`\`

## Best Practices
1. **Consistency**: Gunakan design tokens untuk semua styling
2. **Reusability**: Buat komponen yang dapat digunakan kembali
3. **Performance**: Optimize images dan lazy loading
4. **Accessibility**: Test dengan screen readers
5. **Documentation**: Dokumentasi setiap komponen baru
