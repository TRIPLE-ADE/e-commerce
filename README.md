# Triplex — The Future of Wear

<div align="center">

![Triplex Banner](public/og-image.png)

### The world's first collection of neuro-interactive hardware. Meticulously engineered for the absolute elite.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Sanity](https://img.shields.io/badge/Sanity_CMS-v4-F03E2F?style=for-the-badge&logo=sanity&logoColor=white)](https://www.sanity.io/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![Upstash Redis](https://img.shields.io/badge/Upstash-Redis-00E599?style=for-the-badge&logo=redis&logoColor=black)](https://upstash.com/)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture & Data Flow](#-architecture--data-flow)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Sanity Studio & Content Seeding](#sanity-studio--content-seeding)
  - [Stripe Webhook Configuration](#stripe-webhook-configuration)
  - [Running the App](#running-the-app)
- [API Routes](#-api-routes)
- [Sanity Schema Types](#-sanity-schema-types)
- [Scripts](#-scripts)
- [Deployment](#-deployment)
- [License](#-license)

---

## 🌟 Overview

**Triplex** is a futuristic, high-performance e-commerce web application engineered for premium tech wearables and neuro-interactive hardware. Built on Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4, it features a sleek cyber-aesthetic with dark mode, glowing accents, glassmorphic elements, and fluid micro-animations.

The platform provides end-to-end e-commerce capabilities: Sanity CMS v4 for dynamic product/collection management, Clerk for seamless authentication, Upstash Redis for cross-device cart persistence, and Stripe for secure checkout and webhook-driven transactional order fulfillment.

---

## ✨ Key Features

- **⚡ Modern Next.js 16 App Router Architecture**: Server Components, Server Actions, streaming, dynamic SEO metadata, `sitemap.ts`, and `robots.ts`.
- **🎨 Premium Cyber Aesthetics**: Dark theme styling with Emerald glow palettes, glassmorphic headers, `lucide-react` icons, and `motion` (Framer Motion) micro-interactions.
- **🛍️ Dynamic Product Catalog & Collections**: Powered by Sanity CMS with GROQ queries, multi-image galleries, and stock tracking.
- **🔍 Real-Time Product Search**: Debounced instant search with keyboard navigation, image previews, and stock indicators.
- **🛒 Persistent Dual-Layer Cart**:
  - Local state with Zustand and `localStorage`.
  - Server synchronization with Upstash Redis (30-day TTL) for logged-in Clerk users.
  - Interactive "Fly-to-Cart" animation on item addition.
- **🔐 Clerk Authentication**: User accounts, sign-in modals, session protection, and middleware route guarding.
- **💳 Stripe Checkout & Webhook Pipeline**:
  - Server-side inventory & price re-verification prior to session creation.
  - Webhook listener (`/api/webhooks/stripe`) with idempotency check against duplicate orders.
  - Atomic stock decrementing using Sanity transactions.
  - Automatic Redis cart purge upon successful payment.
- **📦 Order History Portal**: Dedicated `/orders` dashboard for authenticated users to view order summaries, line items, and delivery statuses.
- **📝 Embedded Sanity Studio**: Headless CMS studio embedded directly at `/studio` with Vision GROQ playground.
- **🚀 Data Migration Endpoint**: Authenticated `/api/sanity/import` endpoint to quickly seed categories, collections, and products.

---

## 🛠️ Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16.1.4](https://nextjs.org/) | App Router, Server Components, Route Handlers |
| **UI Library** | [React 19.2.3](https://react.dev/) | Core UI rendering engine |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict static typing throughout the codebase |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Next-gen CSS engine with `@tailwindcss/postcss` |
| **Animations** | [Motion (Framer)](https://motion.dev/) & [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) | Micro-interactions and checkout celebrations |
| **CMS** | [Sanity v4](https://www.sanity.io/) & [next-sanity](https://github.com/sanity-io/next-sanity) | Headless content management & GROQ querying |
| **Authentication**| [Clerk](https://clerk.com/) (`@clerk/nextjs`) | User auth, session tokens, and route protection |
| **Database & Cache**| [Upstash Redis](https://upstash.com/) (`@upstash/redis`) | Serverless Redis for persistent user cart storage |
| **Payments** | [Stripe](https://stripe.com/) (`stripe` & `@stripe/stripe-js`) | Hosted checkout and webhook processing |
| **State Management**| [Zustand v5](https://zustand.docs.pmnd.rs/) | Lightweight reactive client-side cart store |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) | Toast notification system |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean and modern iconography |

---

## 🏗️ Architecture & Data Flow

```mermaid
flowchart TD
    subgraph Client ["Client / Browser"]
        UI["Next.js Pages & Components"]
        Zustand["Zustand Cart Store (localStorage)"]
        FlyAnim["Fly-to-Cart Animation"]
    end

    subgraph Auth ["Authentication"]
        Clerk["Clerk Auth Provider & Middleware"]
    end

    subgraph Backend ["Next.js App Router API"]
        CartSyncRoute["/api/cart/sync"]
        CheckoutRoute["/api/checkout"]
        WebhookRoute["/api/webhooks/stripe"]
        ImportRoute["/api/sanity/import"]
    end

    subgraph Services ["External Services & CMS"]
        Upstash["Upstash Redis (Cart State & TTL)"]
        Sanity["Sanity CMS (Products, Orders, Collections)"]
        Stripe["Stripe Checkout API"]
    end

    UI <--> Zustand
    UI --> Clerk
    Zustand -->|Authenticated sync| CartSyncRoute <--> Upstash
    UI -->|Initiate Checkout| CheckoutRoute
    CheckoutRoute -->|Verify Prices & Stock| Sanity
    CheckoutRoute -->|Generate Session| Stripe
    Stripe -->|checkout.session.completed| WebhookRoute
    WebhookRoute -->|1. Create Order & 2. Decr Stock| Sanity
    WebhookRoute -->|3. Clear User Cart| Upstash
    ImportRoute -->|Seed Data| Sanity
```

---

## 📁 Project Structure

```text
├── app/
│   ├── api/
│   │   ├── cart/
│   │   │   └── sync/route.ts        # Redis cart sync endpoint (GET/POST)
│   │   ├── checkout/
│   │   │   └── route.ts             # Stripe Checkout session creator & stock verification
│   │   ├── sanity/
│   │   │   └── import/route.ts      # Protected CMS data migration endpoint
│   │   └── webhooks/
│   │       └── stripe/route.ts      # Stripe Webhook receiver (order fulfillment)
│   ├── collections/
│   │   ├── collections.tsx          # Collections grid view
│   │   └── page.tsx                 # Collections page route
│   ├── orders/
│   │   ├── orders.tsx               # User order history dashboard
│   │   └── page.tsx                 # Orders route with Clerk auth gate
│   ├── product/
│   │   └── [id]/
│   │       ├── product.tsx          # Interactive product detail view
│   │       └── page.tsx             # Product detail route & SEO metadata
│   ├── shop/
│   │   ├── shop.tsx                 # Product catalog with category filters
│   │   └── page.tsx                 # Shop route
│   ├── studio/
│   │   └── [[...tool]]/page.tsx     # Embedded Sanity Studio CMS
│   ├── success/
│   │   ├── success-client.tsx       # Confetti animation & order confirmation
│   │   └── page.tsx                 # Checkout success route
│   ├── error.tsx                    # Error boundary
│   ├── globals.css                  # Global Tailwind CSS styles
│   ├── layout.tsx                   # Root layout with ClerkProvider, Header & Sonner
│   ├── not-found.tsx                # Custom 404 page
│   ├── page.tsx                     # Landing page with Hero & Featured collections
│   ├── robots.ts                    # Dynamic robots.txt
│   └── sitemap.ts                   # Dynamic sitemap.xml
├── components/
│   ├── layouts/
│   │   └── dynamic.tsx              # Lazy-loaded modals & drawers
│   ├── cart-sidebar.tsx             # Slide-over cart drawer
│   ├── cart-sync.tsx                # Client component reconciling Redis & Zustand
│   ├── fly-to-cart.tsx              # Particle / trajectory animation for cart adds
│   ├── header.tsx                   # Navigation bar with Clerk user button & cart badge
│   ├── hero.tsx                     # Hero banner with cyberpunk headline & CTA
│   ├── product-card.tsx             # Product display card with price and quick add
│   ├── product-grid.tsx             # Responsive grid container for product cards
│   ├── product-skeleton.tsx         # Skeleton loader for product cards
│   └── search.tsx                   # Live search overlay with debounced GROQ query
├── data/
│   └── products.ts                  # Mock data for initial seeding & fallback
├── lib/
│   ├── cart-utils.ts                # Cart calculation helpers
│   ├── constants.ts                 # Rate limits, TTLs, error messages
│   ├── redis.ts                     # Upstash Redis client instance
│   └── stripe.ts                    # Stripe SDK server instance
├── proxy.ts                         # Clerk middleware configuration
├── sanity/
│   ├── lib/
│   │   ├── client.ts                # Sanity read & write client instances
│   │   ├── image.ts                 # Image URL builder utility
│   │   ├── live.ts                  # Live visual editing support
│   │   └── queries.ts               # GROQ query definitions
│   ├── schemaTypes/
│   │   ├── category.ts              # Category schema
│   │   ├── collection.ts            # Collection schema
│   │   ├── order.ts                 # Order schema with line items & status
│   │   ├── product.ts               # Product schema with price, stock, variants
│   │   └── index.ts                 # Schema registry
│   ├── env.ts                       # Sanity environment validation
│   └── structure.ts                 # Sanity Studio desk structure
├── store/
│   └── use-cart.ts                  # Zustand cart store with localStorage sync
├── types/
│   ├── cart.ts                      # Cart & cart item type definitions
│   ├── checkout.ts                  # Checkout session payload types
│   ├── order.ts                     # Order document types
│   ├── product.ts                   # Product model types
│   └── sanity.ts                    # GROQ result types
├── sanity.cli.ts                    # Sanity CLI configuration
├── sanity.config.ts                 # Sanity Studio configuration
└── next.config.ts                   # Next.js configuration (remote image patterns)
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v20.x` or later
- **Package Manager**: `pnpm` (recommended), `npm`, `yarn`, or `bun`
- Accounts for external services:
  - [Sanity.io](https://www.sanity.io/) (Project ID & API tokens)
  - [Clerk](https://clerk.com/) (Publishable & Secret keys)
  - [Stripe](https://stripe.com/) (API Secret key & Webhook secret)
  - [Upstash](https://upstash.com/) (Serverless Redis REST URL & Token)

---

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/triplex-ecommerce.git
   cd triplex-ecommerce
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

---

### Environment Configuration

Create a `.env.local` file in the root directory and populate it with the following environment variables:

```env
# Application Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-01-24
SANITY_API_TOKEN=sk... # Sanity write token (with editor/admin permissions)
SANITY_IMPORT_SECRET_KEY=your_custom_secret_key_for_seeding

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://your-upstash-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

### Sanity Studio & Content Seeding

1. **Access the Embedded Sanity Studio:**
   Navigate to [http://localhost:3000/studio](http://localhost:3000/studio) in your browser to inspect or manually edit content schemas.

2. **Automated Seed / Migration:**
   Use the built-in migration endpoint to automatically upload mock categories, products with assets, and collections:

   ```bash
   curl -X POST http://localhost:3000/api/sanity/import \
     -H "Authorization: Bearer YOUR_SANITY_IMPORT_SECRET_KEY" \
     -H "Content-Type: application/json"
   ```

---

### Stripe Webhook Configuration

To test Stripe checkout and order fulfillment locally:

1. **Install the Stripe CLI** (if not already installed):
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. **Log in to Stripe:**
   ```bash
   stripe login
   ```

3. **Forward Webhook Events to your local server:**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Copy the printed webhook signing secret** (e.g., `whsec_...`) and update `STRIPE_WEBHOOK_SECRET` in your `.env.local`.

---

### Running the App

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔌 API Routes

| Endpoint | Method | Authentication | Description |
| :--- | :--- | :--- | :--- |
| `/api/cart/sync` | `GET` | Clerk Session | Retrieves the authenticated user's cart from Upstash Redis |
| `/api/cart/sync` | `POST` | Clerk Session | Syncs and saves the current cart array to Upstash Redis (30-day TTL) |
| `/api/checkout` | `POST` | Clerk Session | Validates stock & price against Sanity, creates a Stripe Checkout session |
| `/api/webhooks/stripe` | `POST` | Stripe Signature | Listens for `checkout.session.completed`, writes order to Sanity, decreases stock atomically, and clears the Redis cart |
| `/api/sanity/import` | `POST` | Bearer Token | Seeds mock products, categories, collections, and asset uploads to Sanity |

---

## 🗄️ Sanity Schema Types

- **`product`**: Includes title, slug, price, main image, gallery images, category reference, description, stock count, and variant details.
- **`collection`**: Groupings of products with title, slug, hero image, release date, and custom layout format.
- **`category`**: Taxonomy categorizing different wearable tech lines.
- **`order`**: Customer orders featuring `orderNumber`, `stripeId`, `clerkUserId`, customer name & email, line items referencing products, `totalPrice`, `status` (`pending`, `paid`, `shipped`, `delivered`), and `orderDate`.

---

## 📜 Scripts

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts the Next.js development server on port `3000` |
| `pnpm build` | Builds the production bundle |
| `pnpm start` | Runs the built production application |
| `pnpm lint` | Runs ESLint check across all files |

---

## 🚢 Deployment

The easiest way to deploy Triplex is via the [Vercel Platform](https://vercel.com/):

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Import the project into Vercel.
3. Configure all environment variables in the Vercel Project Settings.
4. Deploy!
5. In your Stripe Dashboard, configure a live webhook endpoint pointing to `https://your-domain.com/api/webhooks/stripe` listening for `checkout.session.completed`.

---

## 📄 License

This project is private and proprietary. All rights reserved.
