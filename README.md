# 10X Shop

10X Shop is a responsive front-end e-commerce application built as a graduation project. Users can browse products from the DummyJSON API, view product details, manage a shared cart, sign in through a local demo authentication flow, and complete a simulated checkout.

**[View live demo](https://10x-shop-mariami-bostashvili-mt61.vercel.app/)**

The storefront features a violet visual theme, curated lifestyle collections, image-led collection carousels, and a shoppable lifestyle journal.

## Current status

The CORE shopping flow is implemented and the project builds successfully with strict TypeScript checking. Authentication, cart, checkout, responsive layouts, loading states, error states, empty states, and the not-found route are included.

This is a front-end demo. Login and checkout are local simulations: no real authentication, payment, order processing, or delivery service is connected.

## Features

### CORE

- Responsive storefront layout with header, sidebar, main content area, and footer
- Catalog on `/` loaded with `GET /products?limit=12&skip=0`, rendered by `ProductGrid` → `ProductCard`
- Discounted prices calculated as `price × (1 − discountPercentage / 100)` and stock status on every card
- Product cards and product details by route, with an image gallery and API reviews
- Responsive product grid: 1 column on mobile (≤480px), 2–3 on tablet, 4 on desktop
- Loading, error (with retry), empty, and not-found states; invalid or unknown product IDs show the 404 page
- Local demo login with controlled fields and field-level validation (required username, password of at least 6 characters)
- Shared authentication state through React Context
- Shared cart state through React Context
- Add products to cart with stock-aware quantities
- Update quantities and remove products from the cart
- Cart subtotal, discount and total; clear-cart action; live cart badge in the header
- Protected checkout flow for signed-in users
- Checkout fields: full name, email, address, and city
- Field-level checkout validation
- Local order confirmation with an order summary (items, subtotal, discount, total, delivery details) and cart clearing
- Responsive Tailwind UI with hover, focus, and disabled states
- 404 page for unknown routes

### Additional interface work

- Wishlist state and wishlist page
- Mobile bottom navigation and a desktop sidebar
- Featured collection carousels with animated dot controls and category links
- Category navigation with SVG icons
- Product search, category filtering, price ranges, and price/rating sorting through URL parameters
- New arrivals, rating-based favorites, and discount-based product selections
- Product detail layout with the API image gallery, description, and API customer reviews
- Lifestyle journal articles with related DummyJSON products below each story
- Brand and community inspiration sections
- Expanded footer with product search and navigation
- Profile page and local account settings that pre-fill checkout

Profile and account settings are stored only in the browser; there is no order history, coupon, or account service.

Community stories are illustrative demo content. Product reviews come from the DummyJSON API. New-arrival ordering uses product IDs, and the best-seller section uses ratings rather than sales data.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Storefront home page with the CORE catalog grid |
| `/products` | Product catalog |
| `/products?q=perfume&category=fragrances&price=under-50` | Search and filter the catalog |
| `/products/:id` | Product details |
| `/journal/:slug` | Lifestyle article with related products |
| `/wishlist` | Local wishlist |
| `/cart` | Shopping cart |
| `/profile` | Local profile overview |
| `/account-settings` | Local delivery details used by checkout |
| `/checkout` | Protected checkout form |
| `/login` | Local demo login |
| `*` | Not-found page |

## Tech stack

- React 19
- TypeScript 6 with strict checking
- Vite
- React Router
- Tailwind CSS v4
- DummyJSON Products API
- ESLint

## Project structure

```text
src/
  api/          DummyJSON API requests
  components/   Layout, navigation, product, and UI components
  assets/       Local photography and collection banners
  data/         Lifestyle journal content and image references
  context/      Authentication, cart, and wishlist state
  hooks/        Context hooks used by pages and components
  pages/        Home, catalog, product, cart, checkout, login, and 404 pages
  types/        Product, cart, user, and API types
  utils/        Shared utility functions
```

The main data flow is: pages request products from the API, product components render typed data, and Context providers share authentication, cart, and wishlist state across routes. Checkout reads cart state, validates the local form, clears the cart, and displays a confirmation state.

## Getting started

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. On Windows, use `npm.cmd` if PowerShell blocks the `npm` command:

```bash
npm.cmd run dev
```

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run typecheck` | Run the strict TypeScript check |
| `npm run build` | Type-check and create a production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build locally |

Run the relevant checks locally before publishing changes. The production build includes TypeScript checking.

## Demo login

Login is simulated locally. Enter any non-empty username and a password of at least 6 characters. Do not use a real password. There is no external authentication service.

### Test account

Use any demo values, for example `demo-user` / `demo-password`. These values are local only and are not real credentials.

## API

Product data is requested from:

```text
https://dummyjson.com/products?limit=12&skip=0
https://dummyjson.com/products?limit=0
https://dummyjson.com/products/:id
https://dummyjson.com/products/categories
```

API responses are read as `unknown` and validated with type guards (`isProduct`) before use; HTTP errors become a typed `ApiError`. The application shows an error state with a retry action when the API cannot be reached. No production database or payment provider is connected.

The catalog is curated from DummyJSON categories including beauty, skincare, fragrances, dresses, bags, eyewear, jewellery, watches, and home decoration. Product names, prices, discounts, stock, ratings, images, and reviews come from the API; banner and journal photography are local assets.

## Deployment

The application is deployed on Vercel:

[10X Shop — live website](https://10x-shop-mariami-bostashvili-mt61.vercel.app/)

Build command: `npm run build`. Output directory: `dist`.

For SPA deployments, configure a rewrite so direct visits and refreshes on routes such as `/products/5` and `/checkout` serve `index.html`.

The repository includes this fallback in [`vercel.json`](vercel.json). The latest deployed-site check found provider 404 responses on direct nested URLs; publishing the current configuration and rechecking deployment are still required. See [QA-REPORT.md](QA-REPORT.md).

## Project documentation

- [PLAN.md](PLAN.md) — project plan and implementation scope
- [REPORT.md](REPORT.md) — completion report and final results
- [STYLE_GUIDE.md](STYLE_GUIDE.md) — UI and Tailwind conventions
- [DEBUG-LOG.md](DEBUG-LOG.md) — real bugs, their root causes and fixes
- [COMPATIBILITY.md](COMPATIBILITY.md) — browser and device test matrix

## Credits

- Product data: [DummyJSON](https://dummyjson.com/)
- Stack: React, TypeScript, Vite, React Router, and Tailwind CSS
- Project author: Mariami Bostashvili
