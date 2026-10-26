# 10X Shop

10X Shop is a responsive front-end e-commerce application built as a graduation project. Users can browse products from the DummyJSON API, view product details, manage a shared cart, sign in through a local demo authentication flow, and complete a simulated checkout.

## Current status

The CORE shopping flow is implemented and the project builds successfully with strict TypeScript checking. Authentication, cart, checkout, responsive layouts, loading states, error states, empty states, and the not-found route are included.

This is a front-end demo. Login and checkout are local simulations: no real authentication, payment, order processing, or delivery service is connected.

## Features

### CORE

- Responsive storefront layout with header, sidebar, main content area, and footer
- Product catalog loaded from the DummyJSON API
- Product cards and product details by route
- Loading, error, empty, and invalid-product states
- Local demo login with controlled username and password fields
- Shared authentication state through React Context
- Shared cart state through React Context
- Add products to cart with stock-aware quantities
- Update quantities and remove products from the cart
- Cart subtotal and order summary
- Protected checkout flow for signed-in users
- Checkout fields: full name, email, address, and city
- Field-level checkout validation
- Local order confirmation and cart clearing
- Responsive Tailwind UI with hover, focus, and disabled states
- 404 page for unknown routes

### Additional interface work

- Wishlist state and wishlist page
- Supporting navigation pages prepared for future features

These additional pages do not represent real order history, coupons, addresses, or account services yet.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Storefront home page |
| `/products` | Product catalog |
| `/products/:id` | Product details |
| `/wishlist` | Local wishlist |
| `/cart` | Shopping cart |
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

The current validation status is:

```text
npm run typecheck  ✅
npm run build      ✅
npm run lint       ✅
```

## Demo login

Login is simulated locally. Enter any non-empty username and password. Do not use a real password. There is no external authentication service.

## API

Product data is requested from:

```text
https://dummyjson.com/products
https://dummyjson.com/products/:id
https://dummyjson.com/products/categories
```

The application shows an error state when the API cannot be reached. No production database or payment provider is connected.

## Deployment

The project is prepared for deployment to Vercel or Netlify. The live URL will be added here after deployment:

```text
Live demo: to be added
```

For SPA deployments, configure a rewrite so direct visits and refreshes on routes such as `/products/5` and `/checkout` serve `index.html`.

## Project documentation

- [PLAN.md](PLAN.md) — project plan and implementation scope
- [REPORT.md](REPORT.md) — completion report and final results
- [STYLE_GUIDE.md](STYLE_GUIDE.md) — UI and Tailwind conventions
