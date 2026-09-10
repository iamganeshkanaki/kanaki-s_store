# 🌿 KANAKI'S STORE — Full-Stack Grocery Web Application
> **"Your Everyday Grocery Partner"**  
> Developed by **Ganesh Kanaki**  
> © 2026 Kanaki's Store. All Rights Reserved.

---

## 1. Project Overview

**Kanaki's Store** is a modern, nature-inspired, full-stack grocery ordering and list-management platform built to streamline the everyday shopping experience. Customers can create grocery lists either by typing items manually or by uploading photos of handwritten or printed grocery lists. The platform uses **multimodal AI/OCR (Google Gemini Vision)** to automatically read and parse items, allows customers to review and edit extracted lists, captures verified delivery details, and automatically synchronizes all order data into both a relational database and a formatted master Excel workbook (`kanakis_store_orders.xlsx`).

---

## 2. Key Features

- **Nature-Inspired Organic Aesthetics**: Forest green, leaf accents, botanical motifs, and high-contrast typography designed for an eco-friendly Indian grocery market.
- **Dual Grocery List Creation**:
  - **Option A — Manual Entry**: Fast interactive item addition with unit selector (`kg`, `g`, `litre`, `ml`, `packet`, `piece`, `bunch`, `dozen`), quantity stepper, notes, and quick item search.
  - **Option B — Image Upload & AI OCR**: Drag-and-drop photo upload of handwritten grocery notes or receipts. Uses Gemini Vision AI to extract items into an editable review table before final submission.
- **Master Excel Reporting (`kanakis_store_orders.xlsx`)**:
  - Automatically updates upon every order submission.
  - 4 distinct formatted worksheets: **Customers**, **Orders**, **Grocery Items**, and **Feedback**.
  - Styled with bold forest green headers, auto column widths, filter views, and frozen headers.
- **Customer Order Tracking & Search**:
  - Real-time lookup by Mobile Number or Order Reference (e.g., `KKS-20260910-001`).
  - Visual order progression: `Pending` → `Confirmed` → `Processing` → `Ready` → `Completed`.
- **Customer Feedback System**:
  - 5-star ratings, quick quality tags, and review storage.
- **Store Owner & Admin Dashboard**:
  - Live analytics counters (Total Customers, Orders, Today's Volume, Total Grocery Items, Feedback Average).
  - Search and filter orders by customer name, mobile, order ID, and status.
  - Instant one-click Excel downloads (Complete Report, Today's Orders, Date-Range, Customer-Wise).
  - Inline order status management.

---

## 3. Technology Stack

### Frontend
- **React 19** with **TypeScript**
- **Vite** for fast modern bundling
- **Tailwind CSS v4** with botanical palette & micro-interactions
- **Lucide React** icons
- **Canvas Confetti** for organic celebration on order submission

### Backend
- **Node.js / Express 4** (Production & Live Container Server with Vite integration on port 3000)
- **Python 3 / Django 5 REST Framework** (Production backend suite in `/backend`)
- **ExcelJS** & **openpyxl**: Automated generation of `kanakis_store_orders.xlsx`
- **Google Gen AI SDK (`@google/genai`)**: Gemini 3.8 Flash multimodal vision OCR

### Database
- **PostgreSQL** schema (models provided in Django & relational store in Express)

---

## 4. Architecture & System Flow

```text
[ Customer Device / Browser ]
           │
           ▼
[ React + Tailwind Frontend ]
   ├── Customer Profile Form (Validation)
   ├── Option A: Manual Grocery List Builder
   ├── Option B: Image Upload (Handwritten Notes)
   ├── Review & Edit Extracted List Table
   ├── Order Confirmation & Receipt Generator
   └── Admin Management & Feedback Dashboard
           │
           ▼ (HTTP REST APIs)
[ Backend Server API (Express / Django) ]
   ├── /api/customers/  ──> [ Customer Model ]
   ├── /api/orders/     ──> [ Order & GroceryItem Models ]
   ├── /api/ocr/        ──> [ Google Gemini 3.8 Flash Vision ]
   ├── /api/feedback/   ──> [ Feedback Model ]
   └── /api/reports/    ──> [ Excel Report Generator (kanakis_store_orders.xlsx) ]
```

---

## 5. Database Schema (PostgreSQL ER Diagram)

```text
+---------------------+         +---------------------+
|      CUSTOMER       | 1     * |        ORDER        |
+---------------------+---------+---------------------+
| id (PK)             |         | id (PK)             |
| name                |         | order_number (UQ)   |
| mobile (UQ, Index)  |         | customer_id (FK)    |
| email               |         | order_date          |
| address             |         | source              |
| city                |         | status              |
| pincode             |         | created_at          |
| created_at          |         +----------+----------+
+---------------------+                    | 1
                                           |
                                           | *
                                +----------+----------+
                                |    GROCERY_ITEM     |
                                +---------------------+
                                | id (PK)             |
                                | order_id (FK)       |
                                | name                |
                                | quantity            |
                                | unit                |
                                | notes               |
                                | created_at          |
                                +---------------------+

+---------------------+
|      FEEDBACK       |
+---------------------+
| id (PK)             |
| customer_name       |
| mobile              |
| order_number (opt)  |
| rating (1-5)        |
| message             |
| created_at          |
+---------------------+
```

---

## 6. REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service status and store metadata |
| `POST` | `/api/auth/login` | Store owner / admin authentication |
| `GET` | `/api/customers/` | List all registered customers |
| `POST` | `/api/customers/` | Register or update customer information |
| `GET` | `/api/customers/:id` | Get customer details by ID or mobile |
| `GET` | `/api/orders/` | List orders (filters: search, status, mobile) |
| `POST` | `/api/orders/` | Create order, validate customer, sync Excel |
| `GET` | `/api/orders/:id` | Retrieve single order details & items |
| `PATCH`| `/api/orders/:id/status` | Update order processing status |
| `POST` | `/api/ocr/extract/` | Multimodal AI OCR extraction from photo |
| `GET` | `/api/feedback/` | List all customer feedback submissions |
| `POST` | `/api/feedback/` | Submit new customer rating & feedback |
| `GET` | `/api/admin/stats` | Summary metrics for store operations |
| `GET` | `/api/reports/excel/` | Stream master Excel workbook (`.xlsx`) |
| `GET` | `/api/reports/customer/:id` | Stream customer-specific order spreadsheet |

---

## 7. Master Excel Structure (`kanakis_store_orders.xlsx`)

- **Sheet 1 — Customers**: `Customer ID`, `Customer Name`, `Mobile`, `Email`, `Address`, `City`, `Pincode`, `Registration Date`
- **Sheet 2 — Orders**: `Order ID`, `Customer ID`, `Customer Name`, `Mobile`, `Order Date`, `Total Items`, `Source`, `Status`
- **Sheet 3 — Grocery Items**: `Order ID`, `Customer Name`, `Grocery Item`, `Quantity`, `Unit`, `Notes`
- **Sheet 4 — Feedback**: `Feedback ID`, `Customer Name`, `Mobile`, `Rating`, `Feedback`, `Date`

---

## 8. Installation & Setup

### Running the Application (Unified Development Mode)
The repository is configured to run out-of-the-box with TypeScript and Express + Vite:

```bash
# 1. Install dependencies
npm install

# 2. Run dev server (brings up both API routes and React UI on http://localhost:3000)
npm run dev
```

### Running Django Backend (Optional Alternative Backend)
To run the pure Django REST API backend in `/backend`:

```bash
cd backend

# 1. Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Apply database migrations
python manage.py makemigrations
python manage.py migrate

# 4. Run Django server
python manage.py runserver 8000
```

---

## 9. Environment Variables

Define the following in `.env`:
```env
# Gemini Vision OCR API Key
GEMINI_API_KEY="your_api_key_here"

# Application URL
APP_URL="http://localhost:3000"
```

---

## 10. Developer Credit
Designed and built with care for **Kanaki's Store** by **Ganesh Kanaki**.
