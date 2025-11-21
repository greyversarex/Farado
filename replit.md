# FARADO Global - Logistics & Trading Company

## Overview
FARADO Global is a logistics and trading company specializing in China-Central Asia trade routes. This project is a full-stack web application comprising a public-facing website and an internal order management system. The system streamlines logistics operations, manages inventory across multiple warehouses, and provides transparent tracking for clients.

The business vision is to enhance operational efficiency and customer satisfaction through a comprehensive digital platform. Key capabilities include order creation and tracking, inventory management, counterparty management, and a client portal for public order tracking. The project aims to improve internal workflows and provide a professional online presence.

## User Preferences
- Language: Russian (primary), with support for Tajik, English, Chinese
- UI Style: Professional, clean design with red accent color (#dc2626)
- Communication: Clear, concise technical explanations
- Data Integrity: No mock data in production, real tracking system

## System Architecture

### Frontend (React + TypeScript)
The frontend is built with React and TypeScript, providing both a public website and a comprehensive admin system.
- **Public Pages**: Home, Services, About, Contact, Blog, Client Portal. The "Как мы работаем" page serves as the homepage.
- **Admin System**: Login, Dashboard, Orders Management, Inventory Management, Counterparty Management, Warehouse Management, Search.
- **Styling**: Utilizes Tailwind CSS and shadcn/ui for a modern, responsive, and professional UI/UX, adhering to a red and gray brand color scheme. All service cards and other key components feature uniform layouts and responsive design.
- **Technical Implementations**: Wouter for client-side routing, TanStack Query for efficient data fetching and state management. Comprehensive photo management (upload, display) with unlimited file size support. Automatic calculation for pricing, weight, and volume based on item specifics. Item change history tracking with user attribution.

### Backend (Express + Node.js)
The backend is powered by Express.js and Node.js.
- **API Structure**: Features public APIs for general website functionality and protected admin APIs for internal operations.
- **Authentication**: Simple username/password authentication for admin access, secured with bcrypt password encryption. Role-based access control is implemented.

### Database (PostgreSQL with Drizzle ORM)
PostgreSQL is used as the relational database, with Drizzle ORM for database interactions.
- **Core Entities**:
    - **Orders Management**: Create, view, update, delete orders. Includes order status (Active/Completed), warehouse assignment, and detailed order items with individual status tracking (На складе/Отправлено/Доставлено). Supports document management for orders (folders, files).
    - **Inventory Management**: Warehouse-specific inventory tracking (product codes, descriptions, quantity, volume/weight, price management).
    - **Counterparty Management**: Comprehensive management of clients and suppliers, including types, credit limits, and debt tracking.
    - **Truck Management**: Functionality for managing truck-specific documents (folders, files) and tracking current weight/volume based on loaded items.
    - **Change History**: Audit trail for order modifications with user attribution.
- **Schema**: Key tables include `admin_users`, `orders`, `order_items`, `warehouse_inventory`, `customer_tracking`, `counterparties`, and `change_history`.
- **Warehouses**: Supports management for 5 specific warehouses: Гуанчжоу, Фошань, Урумчи, Кашгар, Иу.

### Feature Specifications
- **Client Portal**: Public-facing portal for order tracking via tracking codes, providing real-time item-level status without authentication.
- **Search & Filtering**: Universal search across orders, items, counterparties, and warehouse inventory. Filtering capabilities for orders by status.
- **Financial Tracking**: Automated calculation and display of total and remaining amounts for orders and counterparties.
- **Localization**: Robust multi-language system with support for Russian, English, Tajik, and Chinese, including persistent language selection.
- **Content Management**: Blog system with professional articles on logistics, customs, and warehouse management.

## External Dependencies
- **PostgreSQL**: Primary database.
- **Wouter**: Client-side routing library for React.
- **TanStack Query**: Data fetching and state management library for React.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **shadcn/ui**: Component library built on Tailwind CSS for UI components.
- **Express.js**: Backend web application framework.
- **Node.js**: JavaScript runtime environment for the backend.
- **Drizzle ORM**: TypeScript ORM for PostgreSQL.
- **bcrypt**: Library for hashing passwords securely.
- **Pexels**: Source for high-quality stock images used in the blog.

## Deployment Status
✅ **Ready for Publishing**
- PostgreSQL database created and configured (November 19, 2025)
- Database schema deployed successfully with all tables and relations
- Production deployment configuration set up:
  - Target: `autoscale` (stateless web application)
  - Build command: `npm run build`
  - Run command: `npm start`
  - Environment: NODE_ENV set to production
- Required environment variables configured:
  - ✅ DATABASE_URL (PostgreSQL connection via Neon)
  - ✅ PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT (all configured)
  - ✅ SESSION_SECRET (production security)
- Production build tested successfully
- Application startup verified in production mode
- All team photos and information updated
- Hero section image updated with high-quality office reception photo
- Multi-language support fully implemented (RU, EN, TJ, CN)

## Recent Changes
### November 21, 2025
- ✅ PostgreSQL database recreated and fully configured
- ✅ All database tables created (15 tables):
  - admin_users, archive_folders, archive_materials
  - blog_posts, change_history, company_stats
  - contact_submissions, counterparties, customer_tracking
  - order_items, orders, quote_requests
  - trucks, warehouse_inventory, warehouses
- ✅ Database schema synchronized using Drizzle ORM
- ✅ Deployment configuration verified and ready for publishing
- ✅ Application tested and confirmed working with database

### November 19, 2025
- Updated Bakhtiyar Kurbanov team member photo in About page
- Replaced hero section image on homepage with professional office reception photo
- Database fully configured and migrations applied
- Deployment configuration completed for Autoscale publishing
```