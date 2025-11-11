# E‑commerce App (Admin, Backend, Frontend)

A full‑stack e‑commerce solution built with React + Vite (customer storefront and admin dashboard) and Node.js/Express + MongoDB on the backend. It supports product management with image uploads to Cloudinary, cart/checkout, Cash on Delivery and Stripe payments, order placement and verification, and live order status tracking.

## Contents

- Overview
- Tech stack
- Project structure
- Features
- Getting started (local dev)
- Environment variables
- Running the apps
- API overview
- Data models
- Payments and verification
- Order status flow
- Image uploads (Multer + Cloudinary)
- Troubleshooting
- Roadmap

## Overview

This repository contains three apps under one workspace:

- `backend/` – Express API with MongoDB, JWT admin auth, Stripe, Cloudinary
- `frontend/` – Customer storefront built with React + Vite
- `admin/` – Admin dashboard for managing products and orders

## Tech stack

- Frontend: React 18, Vite, React Router, TailwindCSS (utility classes in components)
- Admin: React 18, Vite, React‑Toastify for feedback
- Backend: Node.js, Express, Mongoose, JWT, Multer, Cloudinary, Stripe
- Database: MongoDB (Atlas or local)

## Project structure

```
admin/
backend/
frontend/
```

Key backend folders:

- `controllers/` – route handlers (products, users, orders)
- `routes/` – Express routers (note: product router file name is `prouduct.routes.js`)
- `middleware/` – `adminAuth`, `multer` upload config
- `config/` – `mongodb.js`, `cloudinary.js` configuration
- `models/` – Mongoose schemas

## Features

- Product management (create/list/remove, images to Cloudinary)
- Customer catalog, cart, and checkout
- Payments: Cash on Delivery and Stripe Checkout Session
- Post‑payment verification endpoint to finalize Stripe orders
- Order history and single order page with a live status stepper
- Auto‑refresh of order status on the client via polling

## Getting started

Prerequisites:

- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (for image hosting)
- Stripe account (for card payments)

Install dependencies for all three apps:

```powershell
cd backend; npm install; cd ..
cd frontend; npm install; cd ..
cd admin; npm install; cd ..
```

## Environment variables

Create a `.env` file in `backend/` with values similar to:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/ecommerce

# Admin auth (JWT)
JWT_SECRET=supersecret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=supersecure

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
CLIENT_URL=http://localhost:5173
```

Important: In `backend/config/cloudinary.js`, ensure your environment keys match the names above (CLOUDINARY_NAME/API_KEY/API_SECRET). If you change the variable names, update that file accordingly.

For the frontend/admin apps, optionally create `.env` files to point to your backend URL:

```env
VITE_BACKEND_URL=http://localhost:4000
```

## Running the apps

Run backend API:

```powershell
cd backend
npm run start
```

Run customer frontend:

```powershell
cd frontend
npm run dev
```

Run admin dashboard:

```powershell
cd admin
npm run dev
```

Default local URLs:

- Backend API: http://localhost:4000
- Frontend storefront: http://localhost:5173
- Admin dashboard: http://localhost:5174 (or the next free port)

## API overview

High‑level endpoints (not exhaustive):

- `POST /api/product/add` – Add a product (admin only; JWT auth). Accepts images via Multer.
- `GET /api/product/list` – List products
- `POST /api/product/remove` – Remove product by id (admin)
- `POST /api/product/single` – Get single product by id
- `POST /api/order/place` – Place COD order
- `POST /api/order/place-stripe` – Create Stripe checkout session
- `POST /api/order/verifyStripe` – Verify Stripe payment and update order status
- `POST /api/order/userorders` – List orders for the authenticated user

Note: The product router file is `routes/prouduct.routes.js` and is mounted at `/api/product`.

## Data models (simplified)

Product (`backend/models/productModel.js`):

- name: String (required)
- description: String (required)
- price: Number (required)
- image: Array of URLs (required)
- category: String (required)
- subCategory: String (required)
- size: Array (required)
- bestSeller: Boolean
- date: Number (required; timestamp)

Orders and users are defined similarly in `backend/models/`.

## Payments and verification

- COD orders are marked placed immediately.
- Stripe flow creates a pending order and redirects user to Stripe Checkout.
- After the redirect, the client calls the `/api/order/verifyStripe` endpoint. The backend verifies session/payment and updates the order payment/status.

## Order status flow

The storefront order page renders a five‑step tracker:

1) placed → 2) packing → 3) shipped → 4) out for delivery → 5) delivered

The page polls the backend periodically to auto‑update status when changed by the admin.

## Image uploads (Multer + Cloudinary)

- Backend accepts either multiple files under the key `image` or individual keys `image1..image4`.
- Files are uploaded to Cloudinary and the resulting `secure_url` values are saved on the product document.
- At least one image is required by the model.

## Troubleshooting

- “Failed to add product” from admin:
	- Ensure you are authenticated as admin (a valid JWT `token` header is required)
	- Provide at least one image; the backend now validates this and returns 400 otherwise
	- Confirm Cloudinary environment variables; mis‑spelled keys will cause upload errors
	- The backend returns `{ success: true/false, message }` – the admin UI displays `message` on error

- Cannot connect to database:
	- Verify `MONGODB_URI` and that MongoDB is running/reachable

- Stripe not redirecting or verifying:
	- Make sure `STRIPE_SECRET_KEY` is set and your client URL is correct
	- Check the `verifyStripe` controller for logs

## Roadmap

- Move from polling to real‑time updates via WebSockets/SSE for order status
- Add Stripe webhooks for authoritative payment confirmation
- Strengthen backend validation (Joi/Zod) and error messages
- Improve admin UX for status updates (packing/out‑for‑delivery)

---

Maintained by Sougata‑jana. Contributions and issues are welcome.

