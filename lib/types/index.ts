export interface ProductListItem {
  id: string;
  name: string;
  image: string | null;
  priceRange: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface OrderListItem {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  user: {
    id: string;
    name: string;
  } | null;
}

export interface OrderDetail {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  items: Array<{
    id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    product: {
      id: string;
      name: string;
      image: string | null;
    } | null;
    variant: {
      id: string;
      ram: string | null;
      ssd: string | null;
    } | null;
  }>;
}

export * from './next-auth' 