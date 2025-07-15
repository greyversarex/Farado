import {
  type QuoteRequest,
  type InsertQuoteRequest,
  type BlogPost,
  type CompanyStats,
  type ContactSubmission,
  type InsertContactSubmission,
  type AdminUser,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type WarehouseInventory,
  type InsertWarehouseInventory,
  type CustomerTracking,
  type InsertCustomerTracking,
} from "@shared/schema";
import { db } from "./db";
import * as schema from "@shared/schema";
import { eq, desc, and, sql, ilike, or } from "drizzle-orm";

const { 
  quoteRequests, 
  blogPosts, 
  companyStats, 
  contactSubmissions,
  adminUsers,
  orders,
  orderItems,
  warehouseInventory,
  customerTracking
} = schema;

export interface IStorage {
  // Quote request operations
  createQuoteRequest(quoteRequest: InsertQuoteRequest): Promise<QuoteRequest>;
  getQuoteRequests(): Promise<QuoteRequest[]>;
  getQuoteRequest(id: number): Promise<QuoteRequest | undefined>;
  updateQuoteRequestStatus(id: number, status: string): Promise<void>;
  
  // Blog operations
  getPublishedBlogPosts(language?: string): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  
  // Company stats
  getCompanyStats(): Promise<CompanyStats | undefined>;
  
  // Contact submissions
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  
  // Admin authentication
  authenticateAdmin(username: string, password: string): Promise<AdminUser | null>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  
  // Контрагенты
  createCounterparty(counterparty: InsertCounterparty): Promise<Counterparty>;
  getCounterparties(): Promise<Counterparty[]>;
  getCounterparty(id: number): Promise<Counterparty | undefined>;
  updateCounterparty(id: number, data: Partial<Counterparty>): Promise<void>;
  deleteCounterparty(id: number): Promise<void>;
  
  // Склады
  createWarehouse(warehouse: InsertWarehouse): Promise<Warehouse>;
  getWarehouses(): Promise<Warehouse[]>;
  getWarehouse(id: number): Promise<Warehouse | undefined>;
  updateWarehouse(id: number, data: Partial<Warehouse>): Promise<void>;
  deleteWarehouse(id: number): Promise<void>;
  updateWarehouseStats(warehouseId: number): Promise<void>;
  
  // Orders management
  createOrder(order: InsertOrder): Promise<Order>;
  getOrders(status?: string): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  updateOrderStatus(id: number, status: string): Promise<void>;
  updateOrder(id: number, data: Partial<Order>): Promise<void>;
  deleteOrder(id: number): Promise<void>;
  updateOrderTotals(orderId: number): Promise<void>;
  
  // Order items
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  updateOrderItemStatus(id: number, status: string, photos?: string[]): Promise<void>;
  updateOrderItem(id: number, data: Partial<OrderItem>): Promise<void>;
  deleteOrderItem(id: number): Promise<void>;
  
  // Warehouse inventory
  createInventoryItem(item: InsertWarehouseInventory): Promise<WarehouseInventory>;
  getWarehouseInventory(warehouseId: number): Promise<WarehouseInventory[]>;
  updateInventoryQuantity(id: number, quantity: number): Promise<void>;
  reduceInventoryQuantity(id: number, usedQuantity: number): Promise<void>;
  updateInventoryItem(id: number, data: Partial<WarehouseInventory>): Promise<void>;
  deleteInventoryItem(id: number): Promise<void>;
  
  // Get inventory counts by warehouse
  getInventoryCounts(): Promise<{ [warehouse: string]: number }>;
  
  // Customer tracking
  createCustomerTracking(tracking: InsertCustomerTracking): Promise<CustomerTracking>;
  getOrderByTrackingCode(trackingCode: string): Promise<Order | undefined>;
  
  // Search functionality
  searchOrders(query: string): Promise<Order[]>;
  searchOrderItems(query: string): Promise<OrderItem[]>;
  
  // Change history
  createChangeHistory(history: InsertChangeHistory): Promise<ChangeHistory>;
  getChangeHistory(entityType: string, entityId: number): Promise<ChangeHistory[]>;
}

// Database storage implementation
class DatabaseStorage implements IStorage {

  // Quote request operations
  async createQuoteRequest(quoteRequest: InsertQuoteRequest): Promise<QuoteRequest> {
    const [created] = await db
      .insert(quoteRequests)
      .values(quoteRequest)
      .returning();
    return created;
  }

  async getQuoteRequests(): Promise<QuoteRequest[]> {
    return await db
      .select()
      .from(quoteRequests)
      .orderBy(desc(quoteRequests.createdAt));
  }

  async getQuoteRequest(id: number): Promise<QuoteRequest | undefined> {
    const [quote] = await db
      .select()
      .from(quoteRequests)
      .where(eq(quoteRequests.id, id));
    return quote;
  }

  async updateQuoteRequestStatus(id: number, status: string): Promise<void> {
    await db
      .update(quoteRequests)
      .set({ status, updatedAt: new Date() })
      .where(eq(quoteRequests.id, id));
  }

  // Blog operations
  async getPublishedBlogPosts(language = "ru"): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.published, true), eq(blogPosts.language, language)))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, true)));
    return post;
  }

  // Company stats
  async getCompanyStats(): Promise<CompanyStats | undefined> {
    const [stats] = await db.select().from(companyStats).limit(1);
    return stats;
  }

  // Contact submissions
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const [created] = await db
      .insert(contactSubmissions)
      .values(submission)
      .returning();
    return created;
  }

  // Admin authentication
  async authenticateAdmin(username: string, password: string): Promise<AdminUser | null> {
    try {
      console.log('Authenticating user:', username);
      const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
      console.log('Found user:', user);
      
      if (!user || !user.isActive) {
        console.log('User not found or inactive');
        return null;
      }

      // Simple password check - in production should use bcrypt
      if (user.password === password) {
        console.log('Password match successful');
        return user;
      }
      
      console.log('Password mismatch');
      return null;
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  // Orders management
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async getOrders(status?: string): Promise<Order[]> {
    const query = db.select().from(orders);
    if (status) {
      return await query.where(eq(orders.status, status));
    }
    return await query.orderBy(desc(orders.createdAt));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<void> {
    await db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, id));
  }

  async updateOrder(id: number, data: Partial<Order>): Promise<void> {
    await db.update(orders).set({ ...data, updatedAt: new Date() }).where(eq(orders.id, id));
  }

  async deleteOrder(id: number): Promise<void> {
    // Delete order items first
    await db.delete(orderItems).where(eq(orderItems.orderId, id));
    // Delete customer tracking
    await db.delete(customerTracking).where(eq(customerTracking.orderId, id));
    // Delete the order
    await db.delete(orders).where(eq(orders.id, id));
  }

  // Order items
  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    console.log('Storage: Creating order item with photos:', item.photos?.length || 0);
    console.log('Storage: Item data:', {
      code: item.code,
      name: item.name,
      photos: item.photos ? `[${item.photos.length} photos]` : 'no photos'
    });
    
    const itemData = {
      ...item,
      photos: Array.isArray(item.photos) ? item.photos : []
    };
    
    const [newItem] = await db.insert(orderItems).values(itemData).returning();
    console.log('Storage: Created item successfully with photos:', newItem.photos?.length || 0);
    return newItem;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async updateOrderItemStatus(id: number, status: string, photos?: string[]): Promise<void> {
    const updateData: any = { status, updatedAt: new Date() };
    if (photos) {
      updateData.photos = photos;
    }
    await db.update(orderItems).set(updateData).where(eq(orderItems.id, id));
  }

  async updateOrderItem(id: number, data: Partial<OrderItem>): Promise<void> {
    await db.update(orderItems).set({ ...data, updatedAt: new Date() }).where(eq(orderItems.id, id));
  }

  async deleteOrderItem(id: number): Promise<void> {
    await db.delete(orderItems).where(eq(orderItems.id, id));
  }

  // Warehouse inventory
  async createInventoryItem(item: InsertWarehouseInventory): Promise<WarehouseInventory> {
    const [newItem] = await db.insert(warehouseInventory).values(item).returning();
    return newItem;
  }

  async getWarehouseInventory(warehouseId: number): Promise<WarehouseInventory[]> {
    return await db.select().from(warehouseInventory).where(eq(warehouseInventory.warehouseId, warehouseId));
  }

  async updateInventoryQuantity(id: number, quantity: number): Promise<void> {
    await db.update(warehouseInventory).set({ quantity, updatedAt: new Date() }).where(eq(warehouseInventory.id, id));
  }

  async reduceInventoryQuantity(id: number, usedQuantity: number): Promise<void> {
    const [item] = await db.select().from(warehouseInventory).where(eq(warehouseInventory.id, id));
    if (item) {
      const newAvailableQuantity = Math.max(0, item.availableQuantity - usedQuantity);
      await db.update(warehouseInventory)
        .set({ 
          availableQuantity: newAvailableQuantity, 
          updatedAt: new Date() 
        })
        .where(eq(warehouseInventory.id, id));
    }
  }

  async updateInventoryItem(id: number, data: Partial<WarehouseInventory>): Promise<void> {
    await db.update(warehouseInventory)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(warehouseInventory.id, id));
  }

  async deleteInventoryItem(id: number): Promise<void> {
    await db.delete(warehouseInventory)
      .where(eq(warehouseInventory.id, id));
  }

  // Customer tracking
  async createCustomerTracking(tracking: InsertCustomerTracking): Promise<CustomerTracking> {
    const [newTracking] = await db.insert(customerTracking).values(tracking).returning();
    return newTracking;
  }

  async getOrderByTrackingCode(trackingCode: string): Promise<Order | undefined> {
    const [tracking] = await db.select().from(customerTracking).where(eq(customerTracking.trackingCode, trackingCode));
    if (!tracking) return undefined;
    
    return await this.getOrder(tracking.orderId);
  }

  // Search functionality
  async searchOrders(query: string): Promise<Order[]> {
    return await db.select().from(orders).where(
      sql`${orders.name} ILIKE ${'%' + query + '%'}`
    );
  }

  async searchOrderItems(query: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(
      sql`${orderItems.code} ILIKE ${'%' + query + '%'} OR ${orderItems.name} ILIKE ${'%' + query + '%'}`
    );
  }

  async getInventoryCounts(): Promise<{ [warehouse: string]: number }> {
    const result = await db.select({
      warehouseId: warehouseInventory.warehouseId,
      count: sql<number>`count(*)::int`
    })
    .from(warehouseInventory)
    .groupBy(warehouseInventory.warehouseId);
    
    const counts: { [warehouse: string]: number } = {};
    result.forEach(row => {
      counts[row.warehouseId.toString()] = row.count;
    });
    
    return counts;
  }
}

export const storage = new DatabaseStorage();
