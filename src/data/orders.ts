export interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  status: string;
  totalAmount: number;
  itemsCount: number;
  trackingNumber: string;
  estimatedDelivery: string;
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: string;
}

export const mockOrders: Order[] = [
  {
    id: "ORD-98214",
    date: "2026-08-20",
    status: "Delivered",
    totalAmount: 189.98,
    itemsCount: 2,
    trackingNumber: "TRK-8819203",
    estimatedDelivery: "2026-08-22",
    items: [
      { id: "1", title: "SonicPro Wireless Noise Cancelling Headphones", price: 149.99, quantity: 1, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80" },
      { id: "4", title: "Minimalist Ergonomic Desk Lamp", price: 39.99, quantity: 1, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80" }
    ],
    shippingAddress: "124 Innovation Way, Tech District, Bengaluru 560001",
    paymentMethod: "Credit Card ending in 4242"
  },
  {
    id: "ORD-98105",
    date: "2026-08-18",
    status: "In Transit",
    totalAmount: 89.50,
    itemsCount: 1,
    trackingNumber: "TRK-7712049",
    estimatedDelivery: "2026-08-24",
    items: [
      { id: "2", title: "AuraFit Smart Fitness Watch Series 5", price: 89.50, quantity: 1, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80" }
    ],
    shippingAddress: "45 Ocean Avenue, Bandra West, Mumbai 400050",
    paymentMethod: "UPI (Google Pay)"
  },
  {
    id: "ORD-97992",
    date: "2026-08-15",
    status: "Processing",
    totalAmount: 129.99,
    itemsCount: 1,
    trackingNumber: "TRK-5510294",
    estimatedDelivery: "2026-08-25",
    items: [
      { id: "3", title: "Over-Sized Vintage Denim Jacket", price: 129.99, quantity: 1, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=400&q=80" }
    ],
    shippingAddress: "124 Innovation Way, Tech District, Bengaluru 560001",
    paymentMethod: "Cash on Delivery"
  }
];
