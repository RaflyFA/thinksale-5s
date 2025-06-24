# Stock Management Strategy

## Overview

The stock management system uses a **separate stock table** approach for maximum flexibility and features.

## Database Schema

### Stock Table Structure
```sql
CREATE TABLE stock (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  product_id uuid NOT NULL REFERENCES products(id),
  variant_id uuid NULL REFERENCES product_variants(id),
  quantity integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Key Relationships
- **Product → Stock**: One product can have multiple stock records
- **Variant → Stock**: One variant can have one stock record (1:1 relationship)
- **Product → Variants**: One product can have multiple variants

## Stock Management Flow

### 1. Product Creation
1. Create product in `products` table
2. Create variants in `product_variants` table
3. Create stock records in `stock` table for each variant

### 2. Stock Updates
- **Admin Interface**: Use stock management section in product edit page
- **API**: `/api/admin/stock` for CRUD operations
- **Real-time**: Changes reflect immediately in UI

### 3. Stock Validation
- **Frontend**: Check stock before adding to cart
- **Product Cards**: Show stock status badges
- **Cart**: Validate stock availability

## Benefits of Separate Stock Table

### ✅ Advantages
1. **Stock History**: Track stock changes over time
2. **Flexibility**: Easy to add features like stock reservations, movements
3. **Admin Features**: Detailed stock management interface
4. **Scalability**: Can handle complex stock scenarios
5. **Audit Trail**: Track who changed stock and when

### ❌ Disadvantages
1. **Complexity**: Slightly more complex than direct stock in variants
2. **Performance**: Additional table joins required

## Implementation Details

### Stock Status Levels
- **In Stock**: > 10 units
- **Low Stock**: 1-10 units  
- **Out of Stock**: 0 units

### Stock Display
- **Product Cards**: Show overall stock status
- **Product Details**: Show stock per variant
- **Admin Panel**: Detailed stock management

### Stock Validation
- **Add to Cart**: Check variant stock availability
- **Checkout**: Validate final stock before order
- **Real-time**: Prevent overselling

## Migration Notes

### Changes Made
1. ✅ Removed `stock` column from `product_variants` table
2. ✅ Updated all code to use `stock_quantity` from stock table
3. ✅ Standardized stock helpers and utilities
4. ✅ Updated type definitions

### SQL Migration
```sql
-- Run this in Supabase SQL Editor
ALTER TABLE public.product_variants DROP COLUMN IF EXISTS stock;
```

## Future Enhancements

### Planned Features
1. **Stock Reservations**: Reserve stock during checkout process
2. **Stock Movements**: Track stock in/out with reasons
3. **Low Stock Alerts**: Email notifications for low stock
4. **Stock Forecasting**: Predict stock needs based on sales
5. **Bulk Stock Operations**: Import/export stock data

### API Extensions
- Stock history endpoints
- Stock movement tracking
- Bulk stock updates
- Stock analytics

## Best Practices

### Stock Management
1. **Regular Updates**: Update stock after each order
2. **Validation**: Always validate stock before operations
3. **Monitoring**: Set up low stock alerts
4. **Backup**: Regular stock data backups

### Code Guidelines
1. **Use Stock Helpers**: Always use utility functions for stock operations
2. **Type Safety**: Use proper TypeScript types
3. **Error Handling**: Handle stock-related errors gracefully
4. **Performance**: Optimize stock queries with proper indexing 