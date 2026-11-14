# Videm's Gallery — Storefront (React)

Customer-facing website for Videm's Gallery, a furniture & interior shop.
React 19 + Vite + React Router. Frontend only — the Node/Express/PostgreSQL backend, admin dashboard,
Juspay payments and Twilio WhatsApp notifications are separate phases.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## What's built

- Home: combo-offer hero slider, shop by type, "shop the room" hotspots, offers & coupons, trending, services
- Shop (filters, sort, budget, search suggestions), product detail (finishes, gallery, delivery check), wishlist
- Room combos with swappable pieces and live price difference
- Cart (drawer + page), coupons, checkout with validation, order confirmation

## Demo data / placeholders

- Catalogue, combos and coupons live in `src/data/catalog.js` (replace with API calls).
- Product and room images are SVG illustrations until real photos are supplied.
- Cart, wishlist and orders are stored in `localStorage`; payment is **not** connected (orders are not charged).
- Delivery-zone choice at checkout is manual until pincode/zone data is provided.
- Logo files are in `public/brand/` (original artwork, background removed) — do not recolour or redraw.
