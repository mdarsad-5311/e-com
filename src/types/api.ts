import { Product } from '@/data/products';

export interface WishlistItemResponse {
  id: number;
  product: Product;
  created_at: string;
}

export interface WishlistListResponse {
  count: number;
  results: WishlistItemResponse[];
}

export interface AddWishlistResponse {
  detail: string;
  is_already_wishlisted: boolean;
  item: WishlistItemResponse;
}

export interface MoveToCartResponse {
  detail: string;
  cart: any;
}

export interface OrderItemResponse {
  id: number | string;
  product_id?: number | null;
  product_name: string;
  title: string;
  product_sku?: string;
  product_image_url?: string;
  image: string;
  unit_price: string | number;
  price: string | number;
  quantity: number;
  qty: number;
  subtotal: string | number;
  created_at?: string;
}

export interface ShippingAddressData {
  name: string;
  line1: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  cityStateZip?: string;
  country?: string;
  phone?: string;
}

export interface TimelineStep {
  id: string;
  label: string;
  detail?: string;
  note?: string;
  done: boolean;
  active: boolean;
}

export interface OrderResponse {
  id: number | string;
  order_number: string;
  status: string;
  status_display: string;
  subtotal: string | number;
  shipping_cost: string | number;
  tax_amount: string | number;
  total_amount: string | number;
  totalAmount?: string | number;
  summary?: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  payment_method?: string;
  paymentMethod?: string;
  payment_status?: string;
  tracking_number?: string;
  trackingNumber?: string;
  estimated_delivery?: string;
  estimatedDelivery?: string;
  shipping_address?: ShippingAddressData;
  shippingAddress?: string;
  notes?: string;
  items_count?: number;
  itemsCount?: number;
  total_quantity?: number;
  items: OrderItemResponse[];
  timeline?: TimelineStep[];
  created_at?: string;
  date?: string;
  placed?: string;
  updated_at?: string;
}

export interface CreateOrderPayload {
  shipping_address_id?: number;
  shipping_address?: {
    name: string;
    line1: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    cityStateZip?: string;
    country?: string;
    phone?: string;
  };
  payment_method?: string;
  notes?: string;
}
