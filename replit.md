# FARADO Global - Logistics & Trading Company

## Project Overview
Full-stack web application for FARADO Global, a logistics and trading company specializing in China-Central Asia trade routes. The project includes both a public website and an internal order management system.

## Recent Changes  
- **2025-07-14**: ADDED RED HEADERS TO ALL ITEM CARDS - Added red header backgrounds to all item card displays throughout the system including AdminDashboard order items, CounterpartyDetails order items, and WarehouseDetails inventory items. Headers now have red background with white text and improved visual hierarchy with better button styling and hover effects.
- **2025-07-09**: FIXED NUMBER FORMATTING - Removed trailing zeros from weight and volume display throughout the system. Created formatNumber helper function that displays numbers naturally (20 instead of 20.000). Applied to all order cards, item cards, and totals in both AdminDashboard and CounterpartyDetails. Added red header design to item cards for better visual hierarchy.
- **2025-07-08**: COMPLETELY FIXED COUNTERPARTY FINANCIAL TRACKING & WAREHOUSE FUNCTIONALITY - Fixed getOrdersByCounterparty to include order items which resolved zero totals in counterparty summary, added proper financial summaries to order cards showing individual order totals, implemented fully functional "Со склада" button with AddFromWarehouseForm for selecting and adding items from warehouse inventory, removed "Расчет стоимости" section from warehouse inventory form (UniversalItemForm in inventory mode), all counterparty financial calculations now working correctly
- **2025-07-08**: FIXED ORDER CARDS DISPLAY ISSUE - Removed incorrect $3800 sum display from counterparty order cards and replaced with item count display, ensured proper financial field loading in edit forms by adding totalAmount and remainingAmount to getOrderItems SQL query, comprehensive item management working correctly in counterparty order view with proper financial summaries
- **2025-07-08**: FIXED FINANCIAL FIELDS DISPLAY ISSUE - Resolved problem where "Общая сумма" and "Остаток" fields were saving to database but not displaying in edit forms by adding missing totalAmount and remainingAmount fields to getOrderItems SQL query, added comprehensive item management to counterparty order view with add/edit/delete functionality, fixed Russian translations in change history for all field names including financial fields
- **2025-07-08**: IMPLEMENTED COMPREHENSIVE FINANCIAL TRACKING SYSTEM - Added "Общая сумма" and "Остаток" fields to all item forms (add/edit), updated database schema with total_amount and remaining_amount fields, implemented automatic totals calculation for orders and counterparties, added financial summaries display in order details and counterparty pages, fixed EditItemForm save button to use correct updateOrderItem function, enhanced item cards with color-coded financial information display
- **2025-07-07**: COMPLETELY RESTRUCTURED ITEM EDITING FORM - Fixed warehouse duplication by showing location instead of name, reorganized form layout with "Цена перевозки" field next to measurement type, consolidated cost calculations into "Расчет стоимости" section with "Цена за товары" and "Стоимость транспорта" automatic calculations, added proper transport type section, and enhanced form structure for better usability
- **2025-07-07**: ENHANCED CLIENT PORTAL ORDER TRACKING - Fixed weight/volume number formatting (removed trailing zeros), removed "Склад:" prefix to show only warehouse city name, removed "Ожидаемая доставка" from order info section, added expected delivery dates to order history items, and updated backend to include warehouse information in order items
- **2025-07-07**: IMPROVED ADMIN DASHBOARD MOBILE RESPONSIVENESS - Replaced desktop grid layout with responsive card layout for mobile screens, added proper mobile-first design for order management with improved readability and touch-friendly interface
- **2025-07-07**: COMPLETELY REDESIGNED BLOG CONTENT - Replaced low-quality articles with concise, professional content about logistics, customs, and warehouse management. Used high-quality stock images from Pexels instead of generated graphics. Simplified text formatting and removed unnecessary markdown symbols. Added 3 additional articles covering freight forwarding, international trade documentation, and supply chain optimization
- **2025-07-07**: FIXED VOLUME CALCULATION BUG - Corrected logic in order totals calculation to properly recognize 'm³' volumeType instead of 'cubic'
- **2025-07-04**: FIXED CRITICAL ORDERS DISPLAY BUG - Resolved authentication issues preventing orders from displaying in Orders tab by correcting password authentication for user accounts
- **2025-07-04**: ADDED ITEM CHANGE HISTORY TRACKING - Implemented comprehensive item change history with History button, modal display, and user attribution showing who made changes and when
- **2025-07-04**: ENHANCED MOBILE RESPONSIVENESS AND NAVIGATION - Improved mobile adaptation across all pages with better spacing, text sizes, and layouts
- **2025-07-04**: FIXED NAVIGATION PANEL - Changed from floating to fixed positioning as requested, improved stability
- **2025-07-04**: ADJUSTED LOGO POSITIONING - Moved logo 1cm to the left for better visual balance
- **2025-07-04**: COMPLETED SERVICE CARDS UNIFORM LAYOUT - All service cards now have equal heights using flexbox with consistent button positioning
- **2025-07-04**: ADDED MISSING TRANSLATIONS - Completed warehouse and full support service translations for all 4 languages (Russian, English, Tajik, Chinese)
- **2025-07-04**: IMPROVED MULTI-LANGUAGE SYSTEM IMPLEMENTATION - Enhanced translation system with better structure and comprehensive coverage
- **2025-07-04**: Fixed translation file structure and eliminated duplicate keys to resolve system errors
- **2025-07-04**: Added complete Russian and English translations for all website sections including contacts, services, forms, and navigation
- **2025-07-04**: Implemented working language selector with flags and native language names for easy language switching
- **2025-07-04**: Built robust translation system with fallback support and persistent language selection via localStorage
- **2025-07-04**: Enhanced contact page translations with FAQ section and comprehensive contact information
- **2025-07-03**: FIXED ALL CRITICAL ADMIN ISSUES - Resolved order deletion, warehouse capacity display, weight/volume calculations, and counterparty navigation
- **2025-07-03**: CORRECTED VOLUME/WEIGHT CALCULATIONS - Now properly distinguishes between kg and cubic measurements based on volumeType field
- **2025-07-03**: FIXED ORDER DELETION FUNCTIONALITY - Added proper headers and error handling for order deletion
- **2025-07-03**: ADDED WAREHOUSE CAPACITY FIELD - Updated schema and UI to display warehouse capacity in warehouse management cards
- **2025-07-03**: FIXED COUNTERPARTY ORDER NAVIGATION - Orders from counterparty details now properly open in admin dashboard with correct modal
- **2025-07-03**: FIXED CLIENT PORTAL TRANSLATIONS - Added all missing translation keys for proper Russian display in client portal
- **2025-07-03**: FIXED AUTOMATIC QUANTITY CALCULATION - Now correctly calculates total quantity, weight and volume from order items instead of always showing 3 items
- **2025-07-03**: ADDED ORDER EDITING FUNCTIONALITY - Added "Edit Order" button to order details modal with status and expected delivery date editing
- **2025-07-03**: RESOLVED SELECTITEM EMPTY VALUE ERROR - Fixed form validation errors by using "none" instead of empty string values
- **2025-07-03**: COMPLETED COMPREHENSIVE ORDER MANAGEMENT ENHANCEMENTS - Implemented full order editing system with change history tracking
- **2025-07-03**: Added automatic weight/volume calculation from order items with database field updates (total_weight, total_volume)
- **2025-07-03**: Fixed item cost display issue - now shows accurate prices even when entered as string values
- **2025-07-03**: Completed order and item editing forms with full integration to server-side routes and change history
- **2025-07-03**: Enhanced client portal search functionality - now searches by both tracking codes and order codes
- **2025-07-03**: Added change history API endpoints for order modification tracking with user attribution
- **2025-07-01**: FIXED USER AUTHENTICATION SYSTEM - Updated bcrypt password verification for all admin users
- **2025-07-01**: Created 5 admin users with working credentials: Barumand/bar40020, Akmal/ak89090, Alisher/sher777, Baha/jigarak200, Umed/admin321
- **2025-07-01**: Enhanced universal search to include counterparties and warehouse inventory with proper UI display
- **2025-07-01**: Simplified counterparty creation form to essential fields only (Name, Company, Phone, Comments)
- **2025-07-01**: Moved warehouse selection from order creation to item addition for improved workflow
- **2025-06-30**: EXPANDED ORDER MANAGEMENT SYSTEM - Major system enhancement with new payment tracking and warehouse management features
- **2025-06-30**: Added comprehensive counterparties management with client/supplier types, credit limits, and debt tracking
- **2025-06-30**: Implemented warehouse management system with inventory statistics and warehouse selection at item level
- **2025-06-30**: Enhanced order items with payment type (prepaid/postpaid), paid amounts, and unpaid amounts tracking
- **2025-06-30**: Added new database tables: counterparties, warehouses (enhanced), change_history for audit trail
- **2025-06-30**: Updated admin navigation with 5 tabs: Orders, Inventory, Counterparties, Warehouse Management, Search
- **2025-06-30**: FIXED TRANSLATION SYSTEM - Service cards now properly translate to all languages (Russian, Tajik, English, Chinese)
- **2025-06-30**: Added comprehensive translation keys for all service benefits and features across all supported languages
- **2025-06-27**: APPLICATION READY FOR DEPLOYMENT - All core functionality verified and working
- **2025-06-27**: CRITICAL FIX - Completely resolved order item saving functionality after comprehensive debugging
- **2025-06-27**: Manually updated database schema - removed jsonb photos field and added text[] array with proper defaults
- **2025-06-27**: Fixed all Zod validation schemas with proper type transformation for numeric fields
- **2025-06-27**: Added comprehensive error logging and debugging throughout the item creation pipeline
- **2025-06-27**: Verified database operations work correctly with both empty arrays and photo data
- **2025-06-27**: Removed all photo size restrictions per user request - unlimited file size support
- **2025-06-27**: Increased Express server payload limits to 50MB for large photo uploads
- **2025-06-27**: Fixed TypeScript errors in forms with proper photo array typing (string[] instead of never[])
- **2025-06-27**: Updated database schema to use text array for photos instead of jsonb for better compatibility
- **2025-06-27**: Added PhotoUpload component integration to all item creation and editing forms
- **2025-06-27**: Implemented comprehensive photo management with proper state handling and cleanup
- **2025-06-27**: Enhanced form UI with proper icons and mobile-responsive photo upload interface
- **2025-06-27**: Completed mobile adaptation with responsive design for all admin dashboard components
- **2025-06-26**: Completed comprehensive deletion functionality for orders, order items, and warehouse inventory with confirmation dialogs
- **2025-06-26**: Added delete buttons to order cards and detailed order view with proper UI placement and event handling
- **2025-06-26**: Fixed inventory count display to show real-time updates across all warehouse cards
- **2025-06-26**: Enhanced admin dashboard with complete CRUD operations - create, read, update, delete for all entities
- **2025-06-25**: Reduced navigation panel height to h-32 while keeping logo at h-40 with adjusted positioning (mt-2 -mb-4)
- **2025-06-25**: Fixed content boundaries to stay within central zone marked by red lines using max-w-7xl containers
- **2024-12-25**: Fixed navigation symmetry using flexbox layout with centered navigation and proper spacing
- **2024-12-25**: Finalized navigation design with modern styling effects and gradient buttons
- **2024-12-25**: Made "Как мы работаем" page the homepage, removed from navigation menu
- **2024-12-24**: Fixed client portal tracking system to show proper error messages for non-existent orders
- **2024-12-24**: Replaced logistics article image with custom China container image
- **2024-12-24**: Updated all page banners with red gradients and 3-second shine animation effect
- **2024-12-24**: Removed "FARADO" from all page banner titles (About, Services, Blog, Contacts)
- **2024-12-24**: Set unique realistic images for each blog article from Pexels (professional quality)
- **2024-12-24**: Fixed blog article image display in both list view and individual article view
- **2024-12-24**: Removed publication dates from blog article cards
- **2024-12-24**: Fixed Instagram link to https://www.instagram.com/farado.global/
- **2024-12-24**: Implemented functional blog with article reading and clickable categories
- **2024-12-24**: Added sample blog posts with full content in logistics, business, customs, and analytics categories
- **2024-12-24**: Admin system UI isolation - removed public site header/navigation from admin routes
- **2024-12-24**: Added order and item editing functionality with enhanced cost calculation displays
- **2024-12-23**: Fixed client portal routing - added `/portal` route alongside `/client-portal`
- **2024-12-23**: Created comprehensive order management system for internal use
  - Added admin authentication with username/password
  - Created orders management with status tracking
  - Added warehouse inventory system for 5 warehouses
  - Implemented customer tracking system for public order tracking
  - Added search functionality for orders and items
  - Created administrative dashboard with full CRUD operations

## Project Architecture

### Frontend (React + TypeScript)
- **Public Pages**: Home, Services, About, Contact, Blog, Client Portal
- **Admin System**: Login, Dashboard, Orders Management, Inventory Management
- **Libraries**: Wouter (routing), TanStack Query (data fetching), Tailwind CSS + shadcn/ui (styling)

### Backend (Express + Node.js)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Simple username/password for admin access
- **API Routes**: Public APIs + Protected admin APIs
- **Storage Layer**: Abstracted database operations

### Database Schema
- **Public Tables**: quote_requests, blog_posts, company_stats, contact_submissions
- **Admin Tables**: admin_users, orders, order_items, warehouse_inventory, customer_tracking
- **Warehouses**: Гуанчжоу, Фошань, Урумчи, Кашгар, Иу

## Order Management System Features

### Admin Authentication
- Login: `/admin`
- Available user accounts:
  - admin / admin123 (default administrator)
  - Barumand / bar40020
  - Akmal / ak89090
  - Alisher / sher777
  - Baha / jigarak200
  - Umed / admin321
- Role-based access control with bcrypt password encryption

### Orders Management
- Create/view/update orders
- Order status: Active/Completed
- Warehouse assignment
- Order items with detailed tracking
- Item status: На складе/Отправлено/Доставлено
- Photo upload capability for status updates

### Inventory Management
- Warehouse-specific inventory
- Product codes and descriptions
- Quantity tracking
- Volume/weight specifications
- Price management

### Customer Tracking
- Public tracking via tracking codes
- Real-time order status
- Item-level tracking
- No authentication required for customers

### Search & Filtering
- Search orders by name, code, warehouse
- Search items by code, name
- Filter orders by status
- Advanced search across all entities

## User Preferences
- Language: Russian (primary), with support for Tajik, English, Chinese
- UI Style: Professional, clean design with red accent color (#dc2626)
- Communication: Clear, concise technical explanations
- Data Integrity: No mock data in production, real tracking system

## Technical Notes
- Admin system uses header-based authentication for simplicity
- Database includes relations between orders, items, and tracking
- Client portal integrated with real tracking API
- Responsive design for both public and admin interfaces
- Auto-calculation for pricing (price × quantity)
- Photo storage prepared for order item status updates

## Access Points
- Public Website: `/`
- Admin System: `/admin` (credentials: admin/admin123)
- Customer Tracking: `/client-portal` 
- API Documentation: RESTful APIs under `/api/`

## Deployment Status
- **READY FOR PRODUCTION DEPLOYMENT**
- Database: 4 orders, 3 items, 9 inventory items configured
- All core features tested and working: order management, photo uploads, inventory tracking
- Mobile-responsive design implemented
- Authentication system active

## Development Setup
- Default admin user created automatically
- Test data available for demonstration
- All warehouse locations configured
- Tracking codes linked to sample orders