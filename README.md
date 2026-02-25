# Kael Cafe POS System - UI Templates

This repository contains the Next.js React frontend templates for the Kael Cafe Point of Sale (POS) system. It relies heavily on Tailwind CSS for styling and uses Material Symbols for icons.

The application is structured into several core modules, organized by routes, intended to integrate with a backend API.

## Frontend Pages & Required Backend Integration

Below is a summary of every page designed in this project and the expected backend functionalities required to make them fully operational.

### 1. Dashboard (`/`)
Provides a high-level overview of the cafe's daily performance.
- **Key Data Needs:**
  - **Metrics Aggregation:** Endpoints to fetch Total Sales, Order Count, Average Order Value (AOV), and New Customers for a chosen date range (e.g., "Today").
  - **Sales Trend:** Time-series data (e.g., hourly sales totals) to populate the sales chart.
  - **Top Items:** Ranked list of "Popular Items" based on order volume, showing unit sales and revenue.
  - **Recent Activity:** Quick fetch of the ~5 most recently placed orders.

### 2. Cashier / POS Terminal (`/cashier`)
The main interface used by cafe staff to process customer orders.
- **Key Data Needs:**
  - **Fetch Menu:** `GET /api/menu` to load categorized, active menu items with current prices, images, and availability status.
  - **Submit Order:** `POST /api/orders` to submit a finalized cart. Payload should include the array of item IDs, quantities, optional notes ("Less sugar"), applied discounts, calculated tax, and payment method used.
  - **Transaction Handling:** Logic to link an order to a specific cashier session ("Morning Shift: 08:00 - 16:00").

### 3. Orders Management (`/orders`)
Real-time tracking dashboard for incoming and ongoing orders.
- **Key Data Needs:**
  - **Fetch Orders:** `GET /api/orders` with filtering capabilities by status (`New`, `Preparing`, `Ready`, `Completed`).
  - **Update Status:** `PATCH /api/orders/:id/status` to move an order through the fulfillment pipeline (e.g., Cashier accepts order -> Barista marks as Preparing -> Marks as Ready -> Completed upon handoff).
  - *Recommendation:* Utilize WebSockets or Server-Sent Events (SSE) to push new orders to the frontend in real-time without refreshing.

### 4. Menu / Catalog Management (`/menu` & `/products`)
Interface for adding, editing, and categorizing the cafe's product offerings.
- **Key Data Needs:**
  - **CRUD Products:** Endpoints to Create, Read, Update, Delete items.
  - **Data Structure:** Product Name, SKU, Category, Price, Cost Price, Image URL, Description, and an `is_active` boolean toggle.
  - **Categories:** Endpoints to manage menu categories (Coffee, Non-Coffee, Bakery, etc.).

### 5. Inventory Management (`/inventory`)
Tracking system for raw materials, ingredients, and packaging.
- **Key Data Needs:**
  - **CRUD Inventory:** Master list of raw items (e.g., Coffee Beans, Milk, Cups).
  - **Data Structure:** Item Name, Category, Stock Quantity, Unit of Measurement (Kg, Liters, Pcs), and Minimum Threshold (for triggering low-stock alerts).
  - **Stock Movement:** `POST /api/inventory/adjust` to log manual stock additions or waste.
  - **Auto-deduction:** Backend logic/triggers to automatically deduct raw inventory based on product recipes when an order is completed.

### 6. Settings (`/settings`)
Global configuration for the POS system.
- **Key Data Needs:**
  - **Store Profile:** Save cafe name, address, and contact info (used for receipt printing).
  - **Tax Configuration:** Define and store tax rates (e.g., standard sales tax vs. prepared food tax percentages).
  - **Payment Methods:** Toggle enabled payment options.
  - *Implementation details:* These settings should likely be cached globally on the server to affect order calculations globally.

---

## Suggested Database Schema (Relational)

To support this frontend, consider the following core tables for your backend database:

- **Users/Staff:** `id`, `name`, `role` (Admin, Cashier), `pin`, `created_at`
- **Categories:** `id`, `name`, `type` (Menu or Inventory)
- **Products:** `id`, `name`, `category_id`, `price`, `sku`, `image_url`, `is_active`
- **InventoryItems:** `id`, `name`, `category_id`, `current_stock`, `unit`, `low_stock_level`
- **ProductIngredients (Recipes):** `product_id`, `inventory_item_id`, `quantity_required`
- **Orders:** `id`, `order_number`, `staff_id`, `status`, `subtotal`, `tax_amount`, `discount_amount`, `grand_total`, `payment_method`, `created_at`
- **OrderItems:** `id`, `order_id`, `product_id`, `quantity`, `unit_price`, `custom_notes`
- **SystemSettings:** `key`, `value`

---
*Note: The frontend is built with React 19, Next.js 16 (Turbopack), and styled with Tailwind CSS v4. Icons utilize the Material Symbols Outlined font.*
