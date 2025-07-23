import { eq, sql, like, and, desc, asc, isNotNull, count } from "drizzle-orm";
import bcrypt from "bcrypt";
import { db } from "./db";
import * as schema from "@shared/schema";
import type {
  QuoteRequest,
  InsertQuoteRequest,
  BlogPost,
  InsertBlogPost,
  ContactSubmission,
  InsertContactSubmission,
  CompanyStats,
  AdminUser,
  InsertAdminUser,
  Order,
  InsertOrder,
  OrderItem,
  InsertOrderItem,
  WarehouseInventory,
  InsertWarehouseInventory,
  CustomerTracking,
  InsertCustomerTracking,
  Counterparty,
  InsertCounterparty,
  Warehouse,
  InsertWarehouse,
  ChangeHistory,
  InsertChangeHistory,
  Truck,
  InsertTruck,
  ArchiveFolder,
  InsertArchiveFolder,
  ArchiveMaterial,
  InsertArchiveMaterial
} from "@shared/schema";

const {
  quoteRequests,
  blogPosts,
  contactSubmissions,
  companyStats,
  adminUsers,
  orders,
  orderItems,
  warehouseInventory,
  customerTracking,
  counterparties,
  warehouses,
  changeHistory,
  trucks,
  archiveFolders,
  archiveMaterials
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
  getOrderItem(id: number): Promise<OrderItem | undefined>;
  updateOrderItemStatus(id: number, status: string, photos?: string[]): Promise<void>;
  updateOrderItem(id: number, data: Partial<OrderItem>, userId: number): Promise<void>;
  deleteOrderItem(id: number): Promise<void>;
  
  // Warehouse inventory
  createInventoryItem(item: InsertWarehouseInventory): Promise<WarehouseInventory>;
  getWarehouseInventory(warehouseId: number): Promise<WarehouseInventory[]>;
  getWarehouseInventoryByName(warehouseName: string): Promise<WarehouseInventory[]>;
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
  searchCounterparties(query: string): Promise<Counterparty[]>;
  searchInventory(query: string): Promise<WarehouseInventory[]>;
  
  // Counterparty orders
  getOrdersByCounterparty(counterpartyId: number): Promise<Order[]>;
  
  // Change history
  createChangeHistory(history: InsertChangeHistory): Promise<ChangeHistory>;
  getChangeHistory(entityType: string, entityId: number): Promise<ChangeHistory[]>;
  
  // Грузовые траки (Фуры)
  createTruck(truck: InsertTruck): Promise<Truck>;
  getTrucks(): Promise<Truck[]>;
  getTruck(id: number): Promise<Truck | undefined>;
  updateTruck(id: number, data: Partial<Truck>): Promise<void>;
  deleteTruck(id: number): Promise<void>;
  updateTruckVolume(truckId: number): Promise<void>;
  getTruckItems(truckId: number): Promise<OrderItem[]>;
  
  // Архив
  createArchiveFolder(folder: InsertArchiveFolder): Promise<ArchiveFolder>;
  getArchiveFolders(parentId?: number): Promise<ArchiveFolder[]>;
  getArchiveFolder(id: number): Promise<ArchiveFolder | undefined>;
  updateArchiveFolder(id: number, data: Partial<ArchiveFolder>): Promise<void>;
  deleteArchiveFolder(id: number): Promise<void>;
  
  createArchiveMaterial(material: InsertArchiveMaterial): Promise<ArchiveMaterial>;
  getArchiveMaterials(folderId?: number): Promise<ArchiveMaterial[]>;
  getArchiveMaterial(id: number): Promise<ArchiveMaterial | undefined>;
  updateArchiveMaterial(id: number, data: Partial<ArchiveMaterial>): Promise<void>;
  deleteArchiveMaterial(id: number): Promise<void>;
}

class DatabaseStorage implements IStorage {
  // Quote request operations
  async createQuoteRequest(quoteRequest: InsertQuoteRequest): Promise<QuoteRequest> {
    const [newRequest] = await db.insert(quoteRequests).values(quoteRequest).returning();
    return newRequest;
  }

  async getQuoteRequests(): Promise<QuoteRequest[]> {
    return await db.select().from(quoteRequests).orderBy(desc(quoteRequests.createdAt));
  }

  async getQuoteRequest(id: number): Promise<QuoteRequest | undefined> {
    const [request] = await db.select().from(quoteRequests).where(eq(quoteRequests.id, id));
    return request;
  }

  async updateQuoteRequestStatus(id: number, status: string): Promise<void> {
    await db.update(quoteRequests).set({ status, updatedAt: new Date() }).where(eq(quoteRequests.id, id));
  }

  // Blog operations
  async getPublishedBlogPosts(language = "ru"): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).where(
      and(
        eq(blogPosts.published, true),
        eq(blogPosts.language, language)
      )
    ).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  // Company stats
  async getCompanyStats(): Promise<CompanyStats | undefined> {
    const [stats] = await db.select().from(companyStats);
    return stats;
  }

  // Contact submissions
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const [newSubmission] = await db.insert(contactSubmissions).values(submission).returning();
    return newSubmission;
  }

  // Admin authentication
  async authenticateAdmin(username: string, password: string): Promise<AdminUser | null> {
    try {
      const [user] = await db.select().from(adminUsers).where(
        and(
          eq(adminUsers.username, username),
          eq(adminUsers.isActive, true)
        )
      );
      
      if (!user) {
        return null;
      }

      // Check if password is already hashed (bcrypt) or plain text
      let passwordMatches = false;
      if (user.password.startsWith('$2b$')) {
        // Hashed password - use bcrypt compare
        passwordMatches = await bcrypt.compare(password, user.password);
      } else {
        // Plain text password - direct comparison (for admin/admin123)
        passwordMatches = user.password === password;
      }
      
      if (passwordMatches) {
        await db.update(adminUsers).set({ lastLogin: new Date() }).where(eq(adminUsers.id, user.id));
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const [newUser] = await db.insert(adminUsers).values(user).returning();
    return newUser;
  }

  // Контрагенты
  async createCounterparty(counterparty: InsertCounterparty): Promise<Counterparty> {
    const [newCounterparty] = await db.insert(counterparties).values(counterparty).returning();
    await this.createChangeHistory({
      entityType: 'counterparty',
      entityId: newCounterparty.id,
      action: 'created',
      description: `Создан контрагент: ${newCounterparty.name}`,
      userId: counterparty.createdBy || 1
    });
    return newCounterparty;
  }

  async getCounterparties(): Promise<Counterparty[]> {
    return await db.select().from(counterparties).orderBy(desc(counterparties.createdAt));
  }

  async getCounterparty(id: number): Promise<Counterparty | undefined> {
    const [counterparty] = await db.select().from(counterparties).where(eq(counterparties.id, id));
    return counterparty;
  }

  async updateCounterparty(id: number, data: Partial<Counterparty>): Promise<void> {
    await db.update(counterparties).set({ ...data, updatedAt: new Date() }).where(eq(counterparties.id, id));
  }

  async deleteCounterparty(id: number): Promise<void> {
    await db.delete(counterparties).where(eq(counterparties.id, id));
  }

  // Склады
  async createWarehouse(warehouse: InsertWarehouse): Promise<Warehouse> {
    const [newWarehouse] = await db.insert(warehouses).values(warehouse).returning();
    await this.createChangeHistory({
      entityType: 'warehouse',
      entityId: newWarehouse.id,
      action: 'created',
      description: `Создан склад: ${newWarehouse.name}`,
      userId: warehouse.createdBy || 1
    });
    return newWarehouse;
  }

  async getWarehouses(): Promise<Warehouse[]> {
    return await db.select().from(warehouses).where(eq(warehouses.isActive, true)).orderBy(asc(warehouses.name));
  }

  async getWarehouse(id: number): Promise<Warehouse | undefined> {
    const [warehouse] = await db.select().from(warehouses).where(eq(warehouses.id, id));
    return warehouse;
  }

  async updateWarehouse(id: number, data: Partial<Warehouse>): Promise<void> {
    await db.update(warehouses).set({ ...data, updatedAt: new Date() }).where(eq(warehouses.id, id));
  }

  async deleteWarehouse(id: number): Promise<void> {
    await db.update(warehouses).set({ isActive: false }).where(eq(warehouses.id, id));
  }

  async updateWarehouseStats(warehouseId: number): Promise<void> {
    const stats = await db.select({
      totalItems: sql<number>`sum(${warehouseInventory.quantity})::int`,
      totalVolume: sql<number>`sum(${warehouseInventory.volume})::decimal`,
      totalValue: sql<number>`sum(${warehouseInventory.pricePerUnit} * ${warehouseInventory.quantity})::decimal`
    }).from(warehouseInventory).where(eq(warehouseInventory.warehouseId, warehouseId));
    
    const stat = stats[0];
    await db.update(warehouses).set({
      totalItems: stat.totalItems || 0,
      totalVolume: stat.totalVolume?.toString() || "0",
      totalValue: stat.totalValue?.toString() || "0",
      updatedAt: new Date()
    }).where(eq(warehouses.id, warehouseId));
  }

  // Orders management
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    await this.createChangeHistory({
      entityType: 'order',
      entityId: newOrder.id,
      action: 'created',
      description: `Создан заказ: ${newOrder.name}`,
      userId: order.createdBy || 1
    });
    return newOrder;
  }

  async getOrders(status?: string): Promise<Order[]> {
    const query = db.select({
      id: orders.id,
      name: orders.name,
      code: orders.code,
      counterpartyId: orders.counterpartyId,
      counterpartyName: counterparties.name,
      counterpartyCompany: counterparties.company,
      status: orders.status,
      warehouse: orders.warehouse,
      destination: orders.destination,
      expectedDelivery: orders.expectedDelivery,
      totalAmount: orders.totalAmount,
      paidAmount: orders.paidAmount,
      unpaidAmount: orders.unpaidAmount,
      totalWeight: orders.totalWeight,
      totalVolume: orders.totalVolume,
      totalQuantity: orders.totalQuantity,
      comments: orders.comments,
      createdBy: orders.createdBy,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
    }).from(orders).leftJoin(counterparties, eq(orders.counterpartyId, counterparties.id));
    
    if (status) {
      return await query.where(eq(orders.status, status)).orderBy(desc(orders.createdAt));
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
    // Delete related records first to avoid foreign key constraints
    await db.delete(orderItems).where(eq(orderItems.orderId, id));
    await db.delete(customerTracking).where(eq(customerTracking.orderId, id));
    await db.delete(orders).where(eq(orders.id, id));
  }

  async updateOrderTotals(orderId: number): Promise<void> {
    const items = await this.getOrderItems(orderId);
    console.log(`=== UPDATING ORDER ${orderId} TOTALS ===`);
    console.log('Items:', items.map(item => ({
      id: item.id,
      name: item.name,
      volumeType: item.volumeType,
      weight: item.weight,
      volume: item.volume,
      quantity: item.quantity
    })));
    
    const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.totalTransportCost || "0"), 0);
    const paidAmount = items.reduce((sum, item) => sum + parseFloat(item.paidAmount || "0"), 0);
    const unpaidAmount = totalAmount - paidAmount;
    
    // Расчет количества, веса и объема с учетом типа измерения
    const totalQuantity = items.reduce((sum, item) => sum + (typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity || "0")), 0);
    
    // Для веса - суммируем только товары с volumeType = 'kg'
    const totalWeight = items.reduce((sum, item) => {
      if (item.volumeType === 'kg') {
        const weight = typeof item.weight === 'number' ? item.weight : parseFloat(item.weight || "0");
        console.log(`Adding weight: ${weight} from item ${item.name}`);
        return sum + weight;
      }
      return sum;
    }, 0);
    
    // Для объема - суммируем только товары с volumeType = 'm³'
    const totalVolume = items.reduce((sum, item) => {
      if (item.volumeType === 'm³') {
        const volume = typeof item.volume === 'number' ? item.volume : parseFloat(item.volume || "0");
        console.log(`Adding volume: ${volume} from item ${item.name}`);
        return sum + volume;
      }
      return sum;
    }, 0);
    
    console.log(`Calculated totals: weight=${totalWeight}, volume=${totalVolume}, quantity=${totalQuantity}`);
    
    await db.update(orders).set({
      totalAmount: totalAmount.toString(),
      paidAmount: paidAmount.toString(),
      unpaidAmount: unpaidAmount.toString(),
      totalQuantity: totalQuantity,
      totalWeight: totalWeight.toString(),
      totalVolume: totalVolume.toString(),
      updatedAt: new Date()
    }).where(eq(orders.id, orderId));
  }

  // Order items
  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const [newItem] = await db.insert(orderItems).values(item).returning();
    
    // Если товар со статусом "На складе" и указан склад, добавить в инвентарь склада
    if (newItem.status === 'На складе' && newItem.warehouseId) {
      const inventoryItem = {
        warehouseId: newItem.warehouseId,
        code: newItem.code,
        name: newItem.name,
        description: newItem.characteristics || '',
        characteristics: newItem.characteristics || '',
        quantity: newItem.quantity,
        availableQuantity: newItem.quantity,
        volumeType: newItem.volumeType,
        pricePerUnit: newItem.pricePerUnit,
        volume: newItem.volume,
        deliveryPeriod: newItem.deliveryPeriod,
        transport: newItem.transport,
        photos: newItem.photos,
        createdBy: newItem.createdBy
      };
      
      try {
        const [createdInventoryItem] = await db.insert(warehouseInventory).values(inventoryItem).returning();
        
        // Связать товар заказа с инвентарем
        await db.update(orderItems)
          .set({ inventoryItemId: createdInventoryItem.id })
          .where(eq(orderItems.id, newItem.id));
      } catch (error) {
        console.error('Error creating inventory item from order item:', error);
      }
    }
    
    // Обновить общие суммы заказа
    await this.updateOrderTotals(newItem.orderId);
    
    // Обновить статистику склада если товар со склада
    if (newItem.warehouseId) {
      await this.updateWarehouseStats(newItem.warehouseId);
    }
    
    // Обновить объем грузового трака если товар назначен на трак
    if (newItem.truckId) {
      await this.updateTruckVolume(newItem.truckId);
    }
    
    await this.createChangeHistory({
      entityType: 'orderItem',
      entityId: newItem.id,
      action: 'created',
      description: `Добавлен товар: ${newItem.name}`,
      userId: item.createdBy || 1
    });
    
    return newItem;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select({
      id: orderItems.id,
      orderId: orderItems.orderId,
      warehouseId: orderItems.warehouseId,
      truckId: orderItems.truckId,
      warehouseName: warehouses.name,
      truck: {
        id: trucks.id,
        number: trucks.number,
        capacity: trucks.capacity,
        status: trucks.status
      },
      code: orderItems.code,
      name: orderItems.name,
      quantity: orderItems.quantity,
      characteristics: orderItems.characteristics,
      deliveryPeriod: orderItems.deliveryPeriod,
      destination: orderItems.destination,
      shipmentDate: orderItems.shipmentDate,
      expectedDeliveryDate: orderItems.expectedDeliveryDate,
      transport: orderItems.transport,
      volumeType: orderItems.volumeType,
      transportPrice: orderItems.transportPrice,
      totalTransportCost: orderItems.totalTransportCost,
      paidAmount: orderItems.paidAmount,
      unpaidAmount: orderItems.unpaidAmount,
      paymentType: orderItems.paymentType,
      paymentStatus: orderItems.paymentStatus,
      pricePerUnit: orderItems.pricePerUnit,
      totalPrice: orderItems.totalPrice,
      weight: orderItems.weight,
      comments: orderItems.comments,
      volume: orderItems.volume,
      status: orderItems.status,
      fromInventory: orderItems.fromInventory,
      inventoryItemId: orderItems.inventoryItemId,
      rawText: orderItems.rawText,
      photos: orderItems.photos,
      totalAmount: orderItems.totalAmount,
      remainingAmount: orderItems.remainingAmount,
      createdBy: orderItems.createdBy,
      createdAt: orderItems.createdAt,
      updatedAt: orderItems.updatedAt,
    }).from(orderItems)
      .leftJoin(warehouses, eq(orderItems.warehouseId, warehouses.id))
      .leftJoin(trucks, eq(orderItems.truckId, trucks.id))
      .where(eq(orderItems.orderId, orderId))
      .orderBy(desc(orderItems.createdAt));
  }

  async getOrderItem(id: number): Promise<OrderItem | undefined> {
    const [item] = await db.select().from(orderItems).where(eq(orderItems.id, id));
    return item;
  }

  async updateOrderItemStatus(id: number, status: string, photos?: string[]): Promise<void> {
    const updateData: any = { status, updatedAt: new Date() };
    if (photos) {
      updateData.photos = photos;
    }
    await db.update(orderItems).set(updateData).where(eq(orderItems.id, id));
  }

  async updateOrderItem(id: number, data: Partial<OrderItem>, userId: number): Promise<void> {
    const [item] = await db.select().from(orderItems).where(eq(orderItems.id, id));
    if (!item) return;
    
    console.log('=== UPDATE ORDER ITEM ===');
    console.log('Item ID:', id);
    console.log('Data received:', data);
    console.log('Current item totalAmount:', item.totalAmount);
    console.log('Current item remainingAmount:', item.remainingAmount);
    console.log('New totalAmount:', data.totalAmount);
    console.log('New remainingAmount:', data.remainingAmount);
    
    // Track changes for each field
    const changes: { field: string; oldValue: any; newValue: any }[] = [];
    
    // Check specific fields that might change
    if (data.name !== undefined && data.name !== item.name) {
      changes.push({ field: 'name', oldValue: item.name, newValue: data.name });
    }
    if (data.quantity !== undefined && data.quantity !== item.quantity) {
      changes.push({ field: 'quantity', oldValue: item.quantity, newValue: data.quantity });
    }
    if (data.pricePerUnit !== undefined && data.pricePerUnit !== item.pricePerUnit) {
      changes.push({ field: 'pricePerUnit', oldValue: item.pricePerUnit, newValue: data.pricePerUnit });
    }
    if (data.totalPrice !== undefined && data.totalPrice !== item.totalPrice) {
      changes.push({ field: 'totalPrice', oldValue: item.totalPrice, newValue: data.totalPrice });
    }
    if (data.status !== undefined && data.status !== item.status) {
      changes.push({ field: 'status', oldValue: item.status, newValue: data.status });
    }
    if (data.destination !== undefined && data.destination !== item.destination) {
      changes.push({ field: 'destination', oldValue: item.destination, newValue: data.destination });
    }
    if (data.transport !== undefined && data.transport !== item.transport) {
      changes.push({ field: 'transport', oldValue: item.transport, newValue: data.transport });
    }
    if (data.characteristics !== undefined && data.characteristics !== item.characteristics) {
      changes.push({ field: 'characteristics', oldValue: item.characteristics, newValue: data.characteristics });
    }
    if (data.volume !== undefined && data.volume !== item.volume) {
      changes.push({ field: 'volume', oldValue: item.volume, newValue: data.volume });
    }
    if (data.weight !== undefined && data.weight !== item.weight) {
      changes.push({ field: 'weight', oldValue: item.weight, newValue: data.weight });
    }
    if (data.paymentStatus !== undefined && data.paymentStatus !== item.paymentStatus) {
      changes.push({ field: 'paymentStatus', oldValue: item.paymentStatus, newValue: data.paymentStatus });
    }
    if (data.comments !== undefined && data.comments !== item.comments) {
      changes.push({ field: 'comments', oldValue: item.comments, newValue: data.comments });
    }
    if (data.deliveryPeriod !== undefined && data.deliveryPeriod !== item.deliveryPeriod) {
      changes.push({ field: 'deliveryPeriod', oldValue: item.deliveryPeriod, newValue: data.deliveryPeriod });
    }
    if (data.transportPrice !== undefined && data.transportPrice !== item.transportPrice) {
      changes.push({ field: 'transportPrice', oldValue: item.transportPrice, newValue: data.transportPrice });
    }
    if (data.totalTransportCost !== undefined && data.totalTransportCost !== item.totalTransportCost) {
      changes.push({ field: 'totalTransportCost', oldValue: item.totalTransportCost, newValue: data.totalTransportCost });
    }
    if (data.volumeType !== undefined && data.volumeType !== item.volumeType) {
      changes.push({ field: 'volumeType', oldValue: item.volumeType, newValue: data.volumeType });
    }
    if (data.totalAmount !== undefined && data.totalAmount !== item.totalAmount) {
      changes.push({ field: 'totalAmount', oldValue: item.totalAmount, newValue: data.totalAmount });
    }
    if (data.remainingAmount !== undefined && data.remainingAmount !== item.remainingAmount) {
      changes.push({ field: 'remainingAmount', oldValue: item.remainingAmount, newValue: data.remainingAmount });
    }
    
    // Check if status is changing to shipped or delivered
    const oldStatus = item.status;
    const newStatus = data.status;
    
    await db.update(orderItems).set({ ...data, updatedAt: new Date() }).where(eq(orderItems.id, id));
    
    // Verify the update
    const [updatedItem] = await db.select().from(orderItems).where(eq(orderItems.id, id));
    console.log('Updated item totalAmount:', updatedItem.totalAmount);
    console.log('Updated item remainingAmount:', updatedItem.remainingAmount);
    console.log('=== END UPDATE ORDER ITEM ===');
    
    // Handle warehouse inventory updates based on status change
    if (newStatus && newStatus !== oldStatus) {
      if (oldStatus === 'На складе' && (newStatus === 'Отправлено' || newStatus === 'Доставлено')) {
        // Item left warehouse - reduce available quantity or remove from inventory
        if (item.inventoryItemId) {
          await this.reduceInventoryQuantity(item.inventoryItemId, item.quantity);
        }
      } else if ((oldStatus === 'Отправлено' || oldStatus === 'Доставлено') && newStatus === 'На складе') {
        // Item returned to warehouse
        if (item.inventoryItemId) {
          // Increase available quantity
          await db.update(warehouseInventory)
            .set({ 
              availableQuantity: sql`${warehouseInventory.availableQuantity} + ${item.quantity}`,
              updatedAt: new Date()
            })
            .where(eq(warehouseInventory.id, item.inventoryItemId));
        } else if (item.warehouseId) {
          // Create new inventory item if doesn't exist
          const inventoryItem = {
            warehouseId: item.warehouseId,
            code: item.code,
            name: item.name,
            description: item.characteristics || '',
            characteristics: item.characteristics || '',
            quantity: item.quantity,
            availableQuantity: item.quantity,
            volumeType: item.volumeType,
            pricePerUnit: item.pricePerUnit,
            volume: item.volume,
            deliveryPeriod: item.deliveryPeriod,
            transport: item.transport,
            photos: item.photos,
            createdBy: item.createdBy
          };
          
          try {
            const [createdInventoryItem] = await db.insert(warehouseInventory).values(inventoryItem).returning();
            // Link order item to inventory
            await db.update(orderItems)
              .set({ inventoryItemId: createdInventoryItem.id })
              .where(eq(orderItems.id, id));
          } catch (error) {
            console.error('Error creating inventory item from status change:', error);
          }
        }
      } else if (oldStatus !== 'На складе' && newStatus === 'На складе' && item.warehouseId && !item.inventoryItemId) {
        // First time setting status to "На складе"
        const inventoryItem = {
          warehouseId: item.warehouseId,
          code: item.code,
          name: item.name,
          description: item.characteristics || '',
          characteristics: item.characteristics || '',
          quantity: item.quantity,
          availableQuantity: item.quantity,
          volumeType: item.volumeType,
          pricePerUnit: item.pricePerUnit,
          volume: item.volume,
          deliveryPeriod: item.deliveryPeriod,
          transport: item.transport,
          photos: item.photos,
          createdBy: item.createdBy
        };
        
        try {
          const [createdInventoryItem] = await db.insert(warehouseInventory).values(inventoryItem).returning();
          // Link order item to inventory
          await db.update(orderItems)
            .set({ inventoryItemId: createdInventoryItem.id })
            .where(eq(orderItems.id, id));
        } catch (error) {
          console.error('Error creating inventory item from status change:', error);
        }
      }
    }
    
    // Create change history entries for each changed field
    for (const change of changes) {
      await this.createChangeHistory({
        entityType: 'orderItem',
        entityId: id,
        action: 'updated',
        fieldChanged: change.field,
        oldValue: change.oldValue?.toString() || '',
        newValue: change.newValue?.toString() || '',
        description: `Изменено поле ${change.field}: ${change.oldValue} → ${change.newValue}`,
        userId
      });
    }
    
    // Обновить общие суммы заказа
    await this.updateOrderTotals(item.orderId);
    
    // Обновить статистику склада
    if (item.warehouseId) {
      await this.updateWarehouseStats(item.warehouseId);
    }
  }

  async deleteOrderItem(id: number): Promise<void> {
    const [item] = await db.select().from(orderItems).where(eq(orderItems.id, id));
    if (!item) return;
    
    await db.delete(orderItems).where(eq(orderItems.id, id));
    
    // Обновить общие суммы заказа
    await this.updateOrderTotals(item.orderId);
    
    // Обновить статистику склада
    if (item.warehouseId) {
      await this.updateWarehouseStats(item.warehouseId);
    }
  }

  // Warehouse inventory
  async createInventoryItem(item: InsertWarehouseInventory): Promise<WarehouseInventory> {
    const [newItem] = await db.insert(warehouseInventory).values(item).returning();
    
    // Обновить статистику склада
    if (newItem.warehouseId) {
      await this.updateWarehouseStats(newItem.warehouseId);
    }
    
    await this.createChangeHistory({
      entityType: 'inventory',
      entityId: newItem.id,
      action: 'created',
      description: `Добавлен товар на склад: ${newItem.name}`,
      userId: item.createdBy || 1
    });
    
    return newItem;
  }

  async getWarehouseInventory(warehouseId: number): Promise<WarehouseInventory[]> {
    return await db.select({
      id: warehouseInventory.id,
      warehouseId: warehouseInventory.warehouseId,
      warehouseName: warehouses.name,
      code: warehouseInventory.code,
      name: warehouseInventory.name,
      description: warehouseInventory.description,
      characteristics: warehouseInventory.characteristics,
      quantity: warehouseInventory.quantity,
      availableQuantity: warehouseInventory.availableQuantity,
      volumeType: warehouseInventory.volumeType,
      pricePerUnit: warehouseInventory.pricePerUnit,
      volume: warehouseInventory.volume,
      deliveryPeriod: warehouseInventory.deliveryPeriod,
      transport: warehouseInventory.transport,
      photos: warehouseInventory.photos,
      createdBy: warehouseInventory.createdBy,
      createdAt: warehouseInventory.createdAt,
      updatedAt: warehouseInventory.updatedAt
    }).from(warehouseInventory)
      .leftJoin(warehouses, eq(warehouseInventory.warehouseId, warehouses.id))
      .where(eq(warehouseInventory.warehouseId, warehouseId));
  }

  async getWarehouseInventoryByName(warehouseName: string): Promise<WarehouseInventory[]> {
    const [warehouse] = await db.select().from(warehouses).where(eq(warehouses.name, warehouseName));
    if (!warehouse) return [];
    return await this.getWarehouseInventory(warehouse.id);
  }

  async updateInventoryQuantity(id: number, quantity: number): Promise<void> {
    const [item] = await db.select().from(warehouseInventory).where(eq(warehouseInventory.id, id));
    if (!item) return;
    
    await db.update(warehouseInventory).set({ quantity, updatedAt: new Date() }).where(eq(warehouseInventory.id, id));
    
    // Обновить статистику склада
    await this.updateWarehouseStats(item.warehouseId);
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
      
      // Обновить статистику склада
      await this.updateWarehouseStats(item.warehouseId);
    }
  }

  async updateInventoryItem(id: number, data: Partial<WarehouseInventory>): Promise<void> {
    const [item] = await db.select().from(warehouseInventory).where(eq(warehouseInventory.id, id));
    if (!item) return;
    
    await db.update(warehouseInventory).set({ ...data, updatedAt: new Date() }).where(eq(warehouseInventory.id, id));
    
    // Обновить статистику склада
    await this.updateWarehouseStats(item.warehouseId);
  }

  async deleteInventoryItem(id: number): Promise<void> {
    const [item] = await db.select().from(warehouseInventory).where(eq(warehouseInventory.id, id));
    if (!item) return;
    
    await db.delete(warehouseInventory).where(eq(warehouseInventory.id, id));
    
    // Обновить статистику склада
    await this.updateWarehouseStats(item.warehouseId);
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
      sql`${orders.name} ILIKE ${'%' + query + '%'} OR ${orders.code} ILIKE ${'%' + query + '%'}`
    );
  }

  async searchOrderItems(query: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(
      sql`${orderItems.code} ILIKE ${'%' + query + '%'} OR ${orderItems.name} ILIKE ${'%' + query + '%'}`
    );
  }

  async searchCounterparties(query: string): Promise<Counterparty[]> {
    return await db.select().from(counterparties).where(
      sql`${counterparties.name} ILIKE ${'%' + query + '%'} OR ${counterparties.company} ILIKE ${'%' + query + '%'}`
    );
  }

  async searchInventory(query: string): Promise<WarehouseInventory[]> {
    return await db.select().from(warehouseInventory).where(
      sql`${warehouseInventory.code} ILIKE ${'%' + query + '%'} OR ${warehouseInventory.name} ILIKE ${'%' + query + '%'} OR ${warehouseInventory.description} ILIKE ${'%' + query + '%'}`
    );
  }

  async getInventoryCounts(): Promise<{ [warehouse: string]: number }> {
    const result = await db.select({
      warehouseId: warehouseInventory.warehouseId,
      count: sql<number>`count(*)::int`
    })
    .from(warehouseInventory)
    .where(sql`${warehouseInventory.warehouseId} IS NOT NULL`)
    .groupBy(warehouseInventory.warehouseId);
    
    const counts: { [warehouse: string]: number } = {};
    result.forEach(row => {
      if (row.warehouseId) {
        counts[row.warehouseId.toString()] = row.count;
      }
    });
    
    return counts;
  }

  async getOrdersByCounterparty(counterpartyId: number): Promise<Order[]> {
    const orderList = await db.select().from(orders)
      .where(eq(orders.counterpartyId, counterpartyId))
      .orderBy(desc(orders.createdAt));
    
    // Add items to each order
    const ordersWithItems = await Promise.all(orderList.map(async (order) => {
      const items = await this.getOrderItems(order.id);
      return { ...order, items };
    }));
    
    return ordersWithItems;
  }

  // Change history
  async createChangeHistory(history: InsertChangeHistory): Promise<ChangeHistory> {
    const [newHistory] = await db.insert(changeHistory).values(history).returning();
    return newHistory;
  }

  async getChangeHistory(entityType: string, entityId: number): Promise<ChangeHistory[]> {
    return await db.select({
      id: changeHistory.id,
      entityType: changeHistory.entityType,
      entityId: changeHistory.entityId,
      action: changeHistory.action,
      fieldChanged: changeHistory.fieldChanged,
      oldValue: changeHistory.oldValue,
      newValue: changeHistory.newValue,
      description: changeHistory.description,
      userId: changeHistory.userId,
      username: adminUsers.username,
      createdAt: changeHistory.createdAt
    }).from(changeHistory)
      .leftJoin(adminUsers, eq(changeHistory.userId, adminUsers.id))
      .where(and(
        eq(changeHistory.entityType, entityType),
        eq(changeHistory.entityId, entityId)
      ))
      .orderBy(desc(changeHistory.createdAt));
  }

  // Грузовые траки (Фуры)
  async createTruck(truck: InsertTruck): Promise<Truck> {
    const [newTruck] = await db.insert(trucks).values(truck).returning();
    
    await this.createChangeHistory({
      entityType: 'truck',
      entityId: newTruck.id,
      action: 'created',
      description: `Создан грузовой трак: ${newTruck.number}`,
      userId: truck.createdBy || 1
    });
    
    return newTruck;
  }

  async getTrucks(): Promise<Truck[]> {
    return await db.select().from(trucks).orderBy(desc(trucks.createdAt));
  }

  async getTruck(id: number): Promise<Truck | undefined> {
    const [truck] = await db.select().from(trucks).where(eq(trucks.id, id));
    return truck;
  }

  async updateTruck(id: number, data: Partial<Truck>): Promise<void> {
    await db.update(trucks).set({
      ...data,
      updatedAt: new Date()
    }).where(eq(trucks.id, id));
  }

  async deleteTruck(id: number): Promise<void> {
    await db.delete(trucks).where(eq(trucks.id, id));
  }

  async updateTruckVolume(truckId: number): Promise<void> {
    const items = await db.select({
      volume: orderItems.volume,
      weight: orderItems.weight,
      volumeType: orderItems.volumeType
    }).from(orderItems).where(eq(orderItems.truckId, truckId));

    let totalVolume = 0;
    let totalWeight = 0;

    items.forEach(item => {
      const itemVolume = parseFloat(item.volume || '0') || 0;
      const itemWeight = parseFloat(item.weight || '0') || 0;
      
      if (item.volumeType === 'cubic' || item.volumeType === 'm³') {
        totalVolume += itemVolume;
      } else if (item.volumeType === 'kg') {
        totalWeight += itemVolume; // В этом случае volume содержит вес
      }
      
      // Также добавляем вес из поля weight
      totalWeight += itemWeight;
    });

    await db.update(trucks).set({
      currentVolume: totalVolume.toString(),
      currentWeight: totalWeight.toString(),
      updatedAt: new Date()
    }).where(eq(trucks.id, truckId));
  }

  async getTruckItems(truckId: number): Promise<OrderItem[]> {
    return await db.select({
      id: orderItems.id,
      orderId: orderItems.orderId,
      warehouseId: orderItems.warehouseId,
      truckId: orderItems.truckId,
      warehouseName: warehouses.name,
      code: orderItems.code,
      name: orderItems.name,
      quantity: orderItems.quantity,
      characteristics: orderItems.characteristics,
      deliveryPeriod: orderItems.deliveryPeriod,
      destination: orderItems.destination,
      shipmentDate: orderItems.shipmentDate,
      expectedDeliveryDate: orderItems.expectedDeliveryDate,
      transport: orderItems.transport,
      volumeType: orderItems.volumeType,
      transportPrice: orderItems.transportPrice,
      totalTransportCost: orderItems.totalTransportCost,
      paidAmount: orderItems.paidAmount,
      unpaidAmount: orderItems.unpaidAmount,
      paymentType: orderItems.paymentType,
      paymentStatus: orderItems.paymentStatus,
      pricePerUnit: orderItems.pricePerUnit,
      totalPrice: orderItems.totalPrice,
      weight: orderItems.weight,
      comments: orderItems.comments,
      volume: orderItems.volume,
      status: orderItems.status,
      fromInventory: orderItems.fromInventory,
      inventoryItemId: orderItems.inventoryItemId,
      rawText: orderItems.rawText,
      photos: orderItems.photos,
      totalAmount: orderItems.totalAmount,
      remainingAmount: orderItems.remainingAmount,
      createdBy: orderItems.createdBy,
      createdAt: orderItems.createdAt,
      updatedAt: orderItems.updatedAt,
      counterpartyName: counterparties.name,
      counterpartyCompany: counterparties.company,
      expectedDelivery: orders.expectedDelivery
    }).from(orderItems)
      .leftJoin(warehouses, eq(orderItems.warehouseId, warehouses.id))
      .leftJoin(orders, eq(orderItems.orderId, orders.id))
      .leftJoin(counterparties, eq(orders.counterpartyId, counterparties.id))
      .where(eq(orderItems.truckId, truckId))
      .orderBy(desc(orderItems.createdAt));
  }

  // Архив
  async createArchiveFolder(folder: InsertArchiveFolder): Promise<ArchiveFolder> {
    const [newFolder] = await db.insert(archiveFolders).values(folder).returning();
    
    await this.createChangeHistory({
      entityType: 'archiveFolder',
      entityId: newFolder.id,
      action: 'created',
      description: `Создана папка архива: ${newFolder.name}`,
      userId: folder.createdBy || 1
    });
    
    return newFolder;
  }

  async getArchiveFolders(parentId?: number): Promise<ArchiveFolder[]> {
    if (parentId) {
      return await db.select().from(archiveFolders)
        .where(eq(archiveFolders.parentId, parentId))
        .orderBy(asc(archiveFolders.name));
    } else {
      return await db.select().from(archiveFolders)
        .where(sql`${archiveFolders.parentId} IS NULL`)
        .orderBy(asc(archiveFolders.name));
    }
  }

  async getArchiveFolder(id: number): Promise<ArchiveFolder | undefined> {
    const [folder] = await db.select().from(archiveFolders).where(eq(archiveFolders.id, id));
    return folder;
  }

  async updateArchiveFolder(id: number, data: Partial<ArchiveFolder>): Promise<void> {
    await db.update(archiveFolders).set({
      ...data,
      updatedAt: new Date()
    }).where(eq(archiveFolders.id, id));
  }

  async deleteArchiveFolder(id: number): Promise<void> {
    await db.delete(archiveFolders).where(eq(archiveFolders.id, id));
  }

  async createArchiveMaterial(material: InsertArchiveMaterial): Promise<ArchiveMaterial> {
    const [newMaterial] = await db.insert(archiveMaterials).values(material).returning();
    
    await this.createChangeHistory({
      entityType: 'archiveMaterial',
      entityId: newMaterial.id,
      action: 'created',
      description: `Добавлен материал: ${newMaterial.name}`,
      userId: material.createdBy || 1
    });
    
    return newMaterial;
  }

  async getArchiveMaterials(folderId?: number): Promise<ArchiveMaterial[]> {
    if (folderId) {
      return await db.select().from(archiveMaterials)
        .where(eq(archiveMaterials.folderId, folderId))
        .orderBy(desc(archiveMaterials.createdAt));
    } else {
      return await db.select().from(archiveMaterials)
        .where(sql`${archiveMaterials.folderId} IS NULL`)
        .orderBy(desc(archiveMaterials.createdAt));
    }
  }

  async getArchiveMaterial(id: number): Promise<ArchiveMaterial | undefined> {
    const [material] = await db.select().from(archiveMaterials).where(eq(archiveMaterials.id, id));
    return material;
  }

  async updateArchiveMaterial(id: number, data: Partial<ArchiveMaterial>): Promise<void> {
    await db.update(archiveMaterials).set({
      ...data,
      updatedAt: new Date()
    }).where(eq(archiveMaterials.id, id));
  }

  async deleteArchiveMaterial(id: number): Promise<void> {
    await db.delete(archiveMaterials).where(eq(archiveMaterials.id, id));
  }
}

export const storage = new DatabaseStorage();