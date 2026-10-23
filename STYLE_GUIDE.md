# 10X Shop Style Guide

Use this guide for new and updated interfaces throughout the project. The visual direction is a modern, friendly shopping dashboard inspired by the user's reference: a light canvas, white rounded surfaces, deep red accents, clear product imagery, and compact but readable information. Adapt the reference to 10X Shop rather than copying its brand or content.

This guide adapts recommendations from the UI/UX Pro Max design-system generator for an ecommerce store and the visual direction supplied by the user. Use deep red consistently as the main accent rather than the generator's suggested green and orange palette.

## Store experience

Take inspiration from the clear navigation of modern delivery apps and the useful product information of large marketplaces, while giving 10X Shop its own identity. Customers should be able to find a product, understand its price and availability, and proceed to checkout without unnecessary steps. Do not copy another company's branding or interface.

The following patterns are the target for future work, not a claim that these features already exist.

- **Header:** Show the 10X Shop brand and clear links to shopping, account, and cart. Add a labeled search field when search works, and a cart count when cart state exists. On small screens, keep navigation usable without crowding or horizontal scrolling.
- **Catalog navigation:** When implemented, put categories and filters close to the product grid, with clear labels, selected states, and a way to reset filters. On mobile, let filters open in an accessible panel.
- **Product cards:** Show a consistent image, title, and price; show rating, stock, and discount only when available and meaningful. Keep text readable and avoid clutter. Use a functional, clearly labeled cart action when cart behavior is ready; do not nest a button inside the card link.
- **Product details:** Place the image first on mobile and alongside information on larger screens. Show the title, price, description, rating, availability, and a working add-to-cart action in a clear hierarchy. Include a visible route back to the catalog.
- **Cart:** Show each item's image, name, unit price, quantity controls, and removal action, followed by a clear subtotal and checkout action. Explain an empty cart and provide a link back to shopping.
- **Checkout:** Use a simple form with visible labels, field-specific validation, an order summary, and a clear confirmation after submission. Do not imply real payment or delivery services are active unless implemented.

## Visual direction

- Use a pale neutral canvas (`bg-slate-50`), white panels, dark slate text, and a deep red accent (`bg-red-900 text-white`) for primary actions and active navigation. Reserve red for errors and meaningful sale labels; check contrast for each pairing.
- Use product imagery as the main visual element. Keep borders subtle and shadows soft. A restrained warm red gradient may be used for a featured banner, with readable text and no emoji.
- Use a consistent `rounded-xl` or `rounded-2xl` treatment for cards and panels; smaller controls can use `rounded-lg`. Use `max-w-6xl` for the main content area.
- Use descriptive SVG icons from one consistent set when needed for search, account, and cart. Give icon-only controls accessible names and never use emoji as icons.

## Color and type

- Use `white` for surfaces, `slate-50` or `slate-100` for the canvas and image backgrounds, `slate-200` for borders, `slate-900` for primary text, and `slate-600` for secondary text. Use deep red for active navigation and primary actions.
- Use a single, consistent accent when an action needs emphasis; do not introduce new accent colors on individual pages without updating this guide.
- Use the default sans-serif font stack. Use `font-semibold` for headings and important prices, and regular weight for body text.
- Use `text-sm` for supporting information, `text-base` for body copy, and responsive sizes such as `text-3xl sm:text-4xl` for page headings.
- Ensure text, controls, and focus indicators have sufficient contrast. Do not rely on color alone to convey meaning.

## Layout and spacing

- Design for mobile first; use Tailwind breakpoints to expand layouts for larger screens.
- Center content with consistent padding. For the dashboard layout, allow a wider container than `max-w-6xl` when needed, without horizontal overflow.
- Use the spacing scale consistently: `gap-4` or `gap-6` for related items and `py-8` or larger spacing between sections.
- Avoid horizontal overflow and preserve comfortable tap targets on touch screens.

## Components

- **Shell:** Use a top navigation bar and a centered storefront with a prominent image-led hero, product grid, and future category section. On small screens, allow navigation to wrap and maintain usable touch targets.
- **Header and footer:** Keep navigation clear, compact, and consistent across pages. Show visible keyboard focus.
- **Product cards:** Use a white surface, subtle border, rounded corners, consistent image area, and clear title and price. Show real rating and discount data only when available. Make the card link understandable and keyboard accessible.
- **Product details:** Give the image space, keep the title and price prominent, and group supporting information in readable rows.
- **Buttons and links:** Use clear action labels, consistent styling, and distinct hover, focus, and disabled states. Do not make nonfunctional controls look active.
- **Forms:** Place visible labels above or beside inputs, provide descriptive validation messages, and use accessible focus and error states.
- **Feedback:** Loading, empty, and error states should explain what is happening and provide a useful next step when possible.

## Shopping flows

- **Catalog:** Let product images, titles, and prices lead. Keep cards consistent and make navigation to details obvious.
- **Product page:** Present the product image, price, description, and availability clearly; introduce a cart action only when it works.
- **Cart and checkout:** Make quantities, totals, and the next action easy to find. Explain validation errors near their fields and preserve entered information when possible.
- **Login:** Use visible labels, meaningful errors, and a clear submit action. Never use placeholder text as the only label.

## Icons and motion

- Do not use emoji as interface icons or decoration. When an icon helps, use a consistent set of simple SVG icons, with accessible labels for icon-only controls; decorative icons should be hidden from assistive technology.
- Use subtle transitions for hover and focus. Respect reduced-motion preferences and avoid motion essential to understanding the interface.
- Keep product images descriptive with appropriate `alt` text; avoid using decorative imagery when it distracts from the product.

## Tailwind conventions

- Use Tailwind CSS v4 utilities directly in components and prefer existing project patterns.
- Reuse components for repeated UI rather than copying long sets of classes. Introduce shared theme tokens when repeated values warrant them.
- Use responsive, hover, and `focus-visible` variants intentionally. Verify the result at mobile, tablet, and desktop widths.
- These rules guide implementation; existing pages may be updated gradually and the guide should change when the design system evolves.

## Review checklist

- Check layouts at approximately 375, 768, 1024, and 1440 pixels and confirm content reflows without horizontal scrolling.
- Verify keyboard navigation and visible focus; aim for at least 44 by 44 pixels for touch targets.
- Check normal text contrast against its background (at least 4.5:1) and don't communicate status with color alone.
- Test loading, error, empty, and disabled states, and honor reduced-motion settings.
- Confirm imagery has meaningful alternative text and decorative icons are hidden from assistive technology.
