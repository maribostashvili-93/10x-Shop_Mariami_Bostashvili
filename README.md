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

### FULL

- **Catalog (`/products`):** one page of 12 products is requested at a time — `/products`, `/products/search?q=` or `/products/category/{slug}` with `limit`, `skip = (page − 1) × 12` and `sortBy`/`order`. Debounced search (`useDebounce(value, 400)`), category filter, five sort options (Default, Price low/high, Rating, Name A→Z), pagination `‹ 1 2 … N ›`, "Showing 13–24 of 194", skeleton, Retry and `AbortController`. `q`, `category`, `sort` and `page` live in the URL, so refresh, Back/Forward and shared links restore the same results
- **Product details:** API image gallery, quantity stepper limited by stock, Description/Reviews tabs, review form (rating 1–5, comment of at least 10 characters) saved in `localStorage`, recalculated average rating, and four related products from the same category (`?limit=5`)
- **Cart:** `useReducer` with typed actions (`ADD_ITEM`, `SET_QTY`, `REMOVE_ITEM`, `CLEAR`, `APPLY_PROMO`, `REMOVE_PROMO`), an immutable `Cart` class that implements `ICart`, a generic `StorageService<T>`, promo code **`10X10`** (−10%; other codes show "Invalid promo code") and shipping: **$10, free from $100**
- **Checkout:** full name, email, phone, address, city, postal code and country (Georgia by default) with exact validation messages; the button is disabled while the order is placed
- **Orders:** `/orders` and `/orders/:id`, sequential numbers (`10X-00001`), an `Order` class with `create()`, `getStatus()` and `toJSON()`, simulated status (Processing < 1 min, Shipped 1–3 min, Delivered after 3 min) and Reorder
- **Login:** Formik (`useFormik`) with a Yup validation schema, field errors, loading/disabled state and success feedback
- **Profile:** edit first name, last name, email and phone; light/dark theme; "Clear local data" (cart, orders, reviews); log out
- **UX:** shared toast notifications, light/dark theme saved as `shop_theme`
- **TypeScript:** generic `ApiClient.get<T>()` with runtime type guards, `ApiError` and `isApiError`, `AsyncState<T>` and `CartAction` discriminated unions, `STORAGE_KEYS as const`, utility types (`Omit`, `Partial`, `Pick`)
- **Optimization:** route-level code splitting with `React.lazy`/`Suspense`, sized lazy images, deferred hero slides, Lighthouse before/after reports in `docs/lighthouse/`
- **Tailwind:** custom `brand` colour and `card` radius tokens in `@theme`, a `dark:` custom variant and a dark theme built from mirrored colour scales

### Additional interface work

- Home page (`/`): hero carousel, feature strip, the search bar (search, category, sort — opens the catalog), The Signature Edit with collection banners, Shop by category, a six-product catalog preview with "View all products", New arrivals, Best sellers, Sale edit, journal, Top brands and community stories. Each section loads only the few products it shows.
- Wishlist state and wishlist page
- Mobile bottom navigation and a desktop sidebar with curated categories
- Featured collection carousels with animated dot controls
- Lifestyle journal articles with related DummyJSON products below each story

Cart, profile, reviews, orders and theme are stored only in the browser (`localStorage`: `shop_cart`, `shop_profile`, `shop_reviews`, `shop_orders`, `shop_theme`, `shop_user` with the username only). There is no real account, payment or delivery service.

Journal articles are illustrative demo content. Product reviews combine the DummyJSON API reviews with reviews written in this browser.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Home: hero, search bar, The Signature Edit, categories, a six-product catalog preview with "View all products", product rails, journal and brands |
| `/products` | Full catalog with search, category, sort and pagination |
| `/products?q=phone&sort=price-asc&page=2` | Example of a shareable catalog URL |
| `/products/:id` | Product details |
| `/cart` | Shopping cart with promo code and shipping |
| `/checkout` | Protected checkout form |
| `/login` | Local demo login |
| `/orders` | Order history (signed-in users) |
| `/orders/:id` | Order details, status and Reorder |
| `/profile` | Profile, theme and local data |
| `/wishlist` | Local wishlist |
| `/journal/:slug` | Lifestyle article with related products |
| `*` | Not-found page |

## Tech stack

- React 19
- TypeScript 6 with strict checking
- Vite
- React Router
- Tailwind CSS v4
- Formik and Yup (login form)
- DummyJSON Products API
- Playwright, axe-core and Lighthouse (testing and audits)
- ESLint

## Project structure

```text
src/
  api/          ApiClient class and DummyJSON product requests
  components/   Layout, navigation, product, cart, order, and UI components
  assets/       Local photography and collection banners
  data/         Lifestyle journal content and image references
  context/      Auth, cart (useReducer), orders, and wishlist providers
  hooks/        useCart, useAuth, useOrders, useDebounce, useNow, useWishlist
  models/       Cart class and promo codes
  services/     Generic StorageService<T> and review storage
  pages/        All route pages (catalog, product, cart, checkout, login, orders, profile, 404)
  types/        Product, cart, user, and API types
  utils/        Shared utility functions
```

The main data flow is: pages request products from the API, product components render typed data, and Context providers share authentication, cart, and wishlist state across routes. Checkout reads cart state, validates the local form, saves the order, clears the cart, and displays a confirmation with a link to the order.

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

Any username works, for example `emilys` / `emilyspass`. The password must have at least 6 characters. These values are checked only in the browser and are never sent anywhere.

## API

Product data is requested from:

```text
GET https://dummyjson.com/products?limit=12&skip=0&sortBy=price&order=asc
GET https://dummyjson.com/products/search?q=phone&limit=12&skip=0
GET https://dummyjson.com/products/category/{slug}?limit=12&skip=0
GET https://dummyjson.com/products/categories
GET https://dummyjson.com/products/{id}
```

API responses are read as `unknown` and validated with type guards (`isProduct`) before use; HTTP errors become a typed `ApiError`. The application shows an error state with a retry action when the API cannot be reached. No production database or payment provider is connected.

Product names, prices, discounts, stock, ratings, images, and reviews come from the API; banner and journal photography are local assets.

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
