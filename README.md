# 10X Shop

10X Shop is a front-end graduation project for an online store. The goal is to build a responsive shopping experience where users can browse products, view product details, manage a cart, and complete a checkout flow. Product data is planned to come from the [DummyJSON API](https://dummyjson.com/).

## Current status

The project is in its early stages. The React application, styling setup, and initial project structure are in place. A header links to the Products, Cart, and Login pages; these pages currently display placeholder headings.

The API integration and shopping features listed below are planned and have not yet been implemented.

## Planned features

- Product catalog and product details using the DummyJSON API
- Login and shared authentication state
- Shopping cart with quantity controls and item removal
- Checkout form and order summary
- Loading, error, and empty states
- Responsive layouts and accessibility improvements

Additional features such as search, filters, sorting, orders, and a profile page are described in the project plan.

## Technologies

- React and TypeScript
- Vite
- React Router
- Tailwind CSS v4
- ESLint

## Getting started

Install Node.js and npm, then run the following commands in the project folder:

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal. On Windows, if PowerShell blocks `npm`, use `npm.cmd` instead (for example, `npm.cmd run dev`).

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Type-check the project and create a production build in `dist/`. |
| `npm run lint` | Run ESLint. |
| `npm run preview` | Preview the production build locally. |

## Project structure

```text
src/
  api/          Planned API integration
  components/   Layout, product, and reusable UI components
  context/      Planned authentication and cart state
  hooks/        Planned custom hooks
  pages/        Application pages
  types/        Planned TypeScript types
  utils/        Utility functions
```

Some files in these folders are currently placeholders. See [PLAN.md](PLAN.md) for the roadmap and [REPORT.md](REPORT.md) for the project report.

## Deployment

A live deployment link will be added when the project is deployed.
