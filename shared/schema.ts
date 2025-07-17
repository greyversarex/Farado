import {
  pgTable,
  text,
  varchar,
  timestamp,
  date,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";



// Quote requests from potential clients
export const quoteRequests = pgTable("quote_requests", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  company: varchar("company"),
  serviceType: varchar("service_type").notNull(),
  description: text("description"),
  files: jsonb("files"), // Array of file URLs
  status: varchar("status").default("pending"), // pending, in_review, quoted, rejected
  priority: varchar("priority").default("normal"), // low, normal, high, urgent
  estimatedBudget: varchar("estimated_budget"),
  timeline: varchar("timeline"),
  sourceCountry: varchar("source_country"),
  destinationCountry: varchar("destination_country"),
  cargoDetails: jsonb("cargo_details"), // weight, volume, type, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});



// Blog posts for content marketing
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  slug: varchar("slug").unique().notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  authorName: varchar("author_name"),
  category: varchar("category"),
  tags: jsonb("tags"), // Array of tag strings
  featuredImage: varchar("featured_image"),
  language: varchar("language").default("ru"),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Company information and statistics
export const companyStats = pgTable("company_stats", {
  id: serial("id").primaryKey(),
  totalOrders: integer("total_orders").default(0),
  countriesServed: integer("countries_served").default(0),
  yearsExperience: integer("years_experience").default(0),
  averageSavings: integer("average_savings").default(0),
  satisfactionRate: decimal("satisfaction_rate", { precision: 5, scale: 2 }).default("0.00"),
  onTimeDelivery: decimal("on_time_delivery", { precision: 5, scale: 2 }).default("0.00"),
  warehouses: integer("warehouses").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact form submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  subject: varchar("subject"),
  message: text("message").notNull(),
  status: varchar("status").default("new"), // new, in_progress, resolved
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin users for order management system
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username").unique().notNull(),
  password: varchar("password").notNull(), // hashed
  fullName: varchar("full_name").notNull(),
  role: varchar("role").default("admin"), // admin, manager, viewer
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Контрагенты (клиенты/поставщики)
export const counterparties = pgTable("counterparties", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  company: varchar("company"),
  email: varchar("email"),
  phone: varchar("phone"),
  address: text("address"),
  taxId: varchar("tax_id"),
  type: varchar("type").notNull().default("client"), // client, supplier, both
  creditLimit: decimal("credit_limit", { precision: 10, scale: 2 }).default("0"),
  comments: text("comments"),
  createdBy: integer("created_by").references(() => adminUsers.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Склады
export const warehouses = pgTable("warehouses", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  location: varchar("location"),
  address: text("address"),
  capacity: decimal("capacity", { precision: 10, scale: 3 }).default("0"), // Вместимость склада в м³
  isActive: boolean("is_active").default(true),
  totalItems: integer("total_items").default(0),
  totalVolume: decimal("total_volume", { precision: 10, scale: 3 }).default("0"),
  totalValue: decimal("total_value", { precision: 10, scale: 2 }).default("0"),
  createdBy: integer("created_by").references(() => adminUsers.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Orders management
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(), // Юсуф-77
  code: varchar("code"), // Код заказа
  counterpartyId: integer("counterparty_id").references(() => counterparties.id),
  status: varchar("status").default("active"), // active, completed, cancelled
  warehouse: varchar("warehouse"), // Склад заказа
  destination: varchar("destination"), // Пункт назначения
  expectedDelivery: date("expected_delivery"), // Ожидаемая дата доставки
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).default("0"),
  paidAmount: decimal("paid_amount", { precision: 10, scale: 2 }).default("0"),
  unpaidAmount: decimal("unpaid_amount", { precision: 10, scale: 2 }).default("0"),
  totalWeight: decimal("total_weight", { precision: 10, scale: 3 }).default("0"), // Автоматически рассчитывается
  totalVolume: decimal("total_volume", { precision: 10, scale: 3 }).default("0"), // Автоматически рассчитывается
  totalQuantity: integer("total_quantity").default(0), // Автоматически рассчитывается
  comments: text("comments"),
  createdBy: integer("created_by").references(() => adminUsers.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order items
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  warehouseId: integer("warehouse_id").references(() => warehouses.id),
  code: varchar("code").notNull(),
  name: varchar("name").notNull(),
  quantity: integer("quantity").notNull(),
  characteristics: text("characteristics"),
  deliveryPeriod: varchar("delivery_period"),
  destination: varchar("destination"), // Пункт назначения
  shipmentDate: date("shipment_date"), // Дата отправки
  expectedDeliveryDate: date("expected_delivery_date"), // Ожидаемая дата доставки
  transport: varchar("transport").default("Авто"),
  volumeType: varchar("volume_type"), // kg or cubic
  transportPrice: decimal("transport_price", { precision: 10, scale: 2 }).notNull(),
  totalTransportCost: decimal("total_transport_cost", { precision: 10, scale: 2 }).notNull(),
  paidAmount: decimal("paid_amount", { precision: 10, scale: 2 }).default("0"),
  unpaidAmount: decimal("unpaid_amount", { precision: 10, scale: 2 }).default("0"),
  paymentType: varchar("payment_type").default("postpaid"), // prepaid, postpaid
  paymentStatus: varchar("payment_status").default("unpaid"), // paid, unpaid, prepaid
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }).default("0"),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).default("0"),
  weight: decimal("weight", { precision: 10, scale: 3 }).default("0"),
  comments: text("comments"),
  volume: decimal("volume", { precision: 10, scale: 3 }),
  status: varchar("status").default("На складе"), // На складе, Отправлено, Доставлено
  fromInventory: boolean("from_inventory").default(false),
  inventoryItemId: integer("inventory_item_id").references(() => warehouseInventory.id),
  rawText: text("raw_text"), // For autofill functionality
  photos: text("photos").array(), // Array of base64 photo strings
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull().default("0"), // Общая сумма
  remainingAmount: decimal("remaining_amount", { precision: 10, scale: 2 }).notNull().default("0"), // Остаток
  createdBy: integer("created_by").references(() => adminUsers.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Warehouse inventory
export const warehouseInventory = pgTable("warehouse_inventory", {
  id: serial("id").primaryKey(),
  warehouseId: integer("warehouse_id").references(() => warehouses.id).notNull(),
  code: varchar("code").notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  characteristics: text("characteristics"),
  quantity: integer("quantity").notNull(),
  availableQuantity: integer("available_quantity").notNull(),
  volumeType: varchar("volume_type"), // kg or cubic
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }),
  volume: decimal("volume", { precision: 10, scale: 3 }),
  deliveryPeriod: varchar("delivery_period"),
  transport: varchar("transport"),
  photos: jsonb("photos"),
  createdBy: integer("created_by").references(() => adminUsers.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// История изменений заказов и товаров
export const changeHistory = pgTable("change_history", {
  id: serial("id").primaryKey(),
  entityType: varchar("entity_type").notNull(), // order, orderItem, inventory, counterparty, warehouse
  entityId: integer("entity_id").notNull(),
  action: varchar("action").notNull(), // created, updated, deleted, status_changed
  fieldChanged: varchar("field_changed"),
  oldValue: text("old_value"),
  newValue: text("new_value"),
  description: text("description"),
  userId: integer("user_id").references(() => adminUsers.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Customer tracking codes for public access
export const customerTracking = pgTable("customer_tracking", {
  id: serial("id").primaryKey(),
  trackingCode: varchar("tracking_code").unique().notNull(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  customerName: varchar("customer_name"),
  customerEmail: varchar("customer_email"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Types for form validation and API

export const insertQuoteRequestSchema = createInsertSchema(quoteRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});



export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
  lastLogin: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  pricePerUnit: z.union([z.string(), z.number()]).transform(val => {
    if (val === '' || val === null || val === undefined) return '0';
    return typeof val === 'string' ? val : val.toString();
  }),
  volume: z.union([z.string(), z.number()]).transform(val => {
    if (val === '' || val === null || val === undefined) return '0';
    return typeof val === 'string' ? val : val.toString();
  }),
  weight: z.union([z.string(), z.number()]).transform(val => {
    if (val === '' || val === null || val === undefined) return '0';
    return typeof val === 'string' ? val : val.toString();
  }),
  totalPrice: z.union([z.string(), z.number()]).transform(val => {
    if (val === '' || val === null || val === undefined) return '0';
    return typeof val === 'string' ? val : val.toString();
  }),
  quantity: z.union([z.string(), z.number()]).transform(val => typeof val === 'string' ? parseInt(val) || 1 : val),
  photos: z.array(z.string()).optional().default([]),
  shipmentDate: z.union([z.string(), z.null()]).transform(val => {
    if (!val || val === '') return null;
    return val;
  }).optional(),
  expectedDeliveryDate: z.union([z.string(), z.null()]).transform(val => {
    if (!val || val === '') return null;
    return val;
  }).optional(),
  totalAmount: z.union([z.string(), z.number()]).transform(val => {
    if (val === '' || val === null || val === undefined) return '0';
    return typeof val === 'string' ? val : val.toString();
  }).optional().default('0'),
  remainingAmount: z.union([z.string(), z.number()]).transform(val => {
    if (val === '' || val === null || val === undefined) return '0';
    return typeof val === 'string' ? val : val.toString();
  }).optional().default('0')
});

export const insertWarehouseInventorySchema = createInsertSchema(warehouseInventory).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  pricePerUnit: z.union([z.string(), z.number()]).transform(val => {
    if (val === '' || val === null || val === undefined) return '0';
    return typeof val === 'string' ? val : val.toString();
  }),
  volume: z.union([z.string(), z.number()]).transform(val => {
    if (val === '' || val === null || val === undefined) return '0';
    return typeof val === 'string' ? val : val.toString();
  }),
  quantity: z.union([z.string(), z.number()]).transform(val => typeof val === 'string' ? parseInt(val) || 1 : val),
  availableQuantity: z.union([z.string(), z.number()]).transform(val => typeof val === 'string' ? parseInt(val) || 1 : val),
  photos: z.array(z.string()).optional().default([])
});

export const insertCounterpartySchema = createInsertSchema(counterparties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWarehouseSchema = createInsertSchema(warehouses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChangeHistorySchema = createInsertSchema(changeHistory).omit({
  id: true,
  createdAt: true,
});

export const insertCustomerTrackingSchema = createInsertSchema(customerTracking).omit({
  id: true,
  createdAt: true,
});

// Relations
export const ordersRelations = relations(orders, ({ many, one }) => ({
  items: many(orderItems),
  tracking: many(customerTracking),
  counterparty: one(counterparties, {
    fields: [orders.counterpartyId],
    references: [counterparties.id],
  }),
  createdByUser: one(adminUsers, {
    fields: [orders.createdBy],
    references: [adminUsers.id],
  }),
}));

export const counterpartiesRelations = relations(counterparties, ({ many, one }) => ({
  orders: many(orders),
  createdByUser: one(adminUsers, {
    fields: [counterparties.createdBy],
    references: [adminUsers.id],
  }),
}));

export const warehousesRelations = relations(warehouses, ({ many, one }) => ({
  inventory: many(warehouseInventory),
  orderItems: many(orderItems),
  createdByUser: one(adminUsers, {
    fields: [warehouses.createdBy],
    references: [adminUsers.id],
  }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  warehouse: one(warehouses, {
    fields: [orderItems.warehouseId],
    references: [warehouses.id],
  }),
  createdByUser: one(adminUsers, {
    fields: [orderItems.createdBy],
    references: [adminUsers.id],
  }),
  inventoryItem: one(warehouseInventory, {
    fields: [orderItems.inventoryItemId],
    references: [warehouseInventory.id],
  }),
}));

export const warehouseInventoryRelations = relations(warehouseInventory, ({ one, many }) => ({
  warehouse: one(warehouses, {
    fields: [warehouseInventory.warehouseId],
    references: [warehouses.id],
  }),
  createdByUser: one(adminUsers, {
    fields: [warehouseInventory.createdBy],
    references: [adminUsers.id],
  }),
  orderItems: many(orderItems),
}));

export const changeHistoryRelations = relations(changeHistory, ({ one }) => ({
  user: one(adminUsers, {
    fields: [changeHistory.userId],
    references: [adminUsers.id],
  }),
}));

export const customerTrackingRelations = relations(customerTracking, ({ one }) => ({
  order: one(orders, {
    fields: [customerTracking.orderId],
    references: [orders.id],
  }),
}));

export type InsertQuoteRequest = z.infer<typeof insertQuoteRequestSchema>;
export type QuoteRequest = typeof quoteRequests.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type CompanyStats = typeof companyStats.$inferSelect;

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertWarehouseInventory = z.infer<typeof insertWarehouseInventorySchema>;
export type WarehouseInventory = typeof warehouseInventory.$inferSelect;
export type InsertCustomerTracking = z.infer<typeof insertCustomerTrackingSchema>;
export type CustomerTracking = typeof customerTracking.$inferSelect;
export type InsertCounterparty = z.infer<typeof insertCounterpartySchema>;
export type Counterparty = typeof counterparties.$inferSelect;
export type InsertWarehouse = z.infer<typeof insertWarehouseSchema>;
export type Warehouse = typeof warehouses.$inferSelect;
export type InsertChangeHistory = z.infer<typeof insertChangeHistorySchema>;
export type ChangeHistory = typeof changeHistory.$inferSelect;
