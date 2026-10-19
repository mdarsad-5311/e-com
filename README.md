# Al-Umaima E-Commerce Storefront

A modern, responsive e-commerce web application built with **Next.js 14 (App Router)**, **TypeScript**, and custom CSS. Designed for high performance, smooth mobile-first shopping experiences, and seamless integration with a RESTful backend API.

---

## Features

- **Storefront & Navigation**
  - Mobile bottom navigation bar and responsive header with instant search.
  - Category pages (Electronics, Fashion, Home Goods) with filtering and sorting.
  - Featured product carousels, deal of the day counters, and trending badges.

- **Product Discovery & Interaction**
  - High-resolution image galleries with thumbnail switching and image zoom.
  - Customer review submission and star ratings.
  - Recently viewed item history and quick view modals.
  - Delivery pincode serviceability checker.

- **Cart & Wishlist Management**
  - Persistent shopping cart with guest fallback and automatic server sync upon login.
  - Save-for-later functionality and quantity adjustments.
  - Wishlist management directly integrated with customer profiles.

- **Checkout & Orders**
  - Multi-step checkout pipeline (Address -> Shipping -> Payment).
  - Saved delivery addresses management.
  - Order confirmation, tracking status, and past order history.

- **User Accounts & Administration**
  - JWT-based authentication (Login, Register, and Token Refresh).
  - Customer profile settings, notification preferences, and currency selector.
  - Admin dashboard for tracking orders, managing product stocks, and viewing analytics.

---

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI & Icons**: [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/)
- **Styling**: Component-level Vanilla CSS & Design Tokens
- **State & Storage**: React Context API & LocalStorage synchronization

---

## Getting Started

### Prerequisites

- Node.js 18.17+ or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/e-commerce.git
   cd e-commerce
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` file in the project root:
   ```env
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   ```
   *(Replace with your backend API URL if deploying to production)*

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

---

## Available Scripts

- `npm run dev` - Starts the development server on `localhost:3000`.
- `npm run build` - Creates an optimized production build.
- `npm run start` - Runs the compiled production server.
- `npm run lint` - Runs ESLint code style and syntax checks.

---

## Project Structure

```text
├── public/                 # Static assets, icons, and placeholder media
├── src/
│   ├── app/                # Next.js App Router pages and layouts
│   │   ├── (auth)/         # Login, Register, Forgot Password
│   │   ├── admin/          # Store admin dashboard
│   │   ├── cart/           # Shopping cart page
│   │   ├── checkout/       # Checkout flow
│   │   ├── products/       # Product details [id]
│   │   ├── profile/        # Customer profile, addresses, settings
│   │   └── ...
│   ├── components/         # Reusable UI components
│   │   ├── mobile/         # Mobile-specific views & navigation
│   │   └── ...
│   ├── context/            # Global React Context providers (Auth, Cart, Wishlist)
│   ├── data/               # Catalog datasets and initial fallbacks
│   ├── hooks/              # Custom React hooks (focus traps, layout triggers)
│   ├── lib/                # API client, security sanitizers, formatters
│   ├── styles/             # Dedicated CSS stylesheets for pages & components
│   └── types/              # TypeScript interfaces and API payload definitions
└── next.config.js          # Next.js configuration and image domains
```

---

## License

This project is licensed under the MIT License.
