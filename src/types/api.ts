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
