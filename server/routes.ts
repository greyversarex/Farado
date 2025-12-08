import type { Express, Request } from "express";
import express from "express";
import { body, param, query, validationResult } from "express-validator";
import { createServer, type Server } from "http";
import { storage } from "./storage";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
  };
}
import { 
  insertQuoteRequestSchema, 
  insertContactSubmissionSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertWarehouseInventorySchema,
  insertCustomerTrackingSchema,
  insertCounterpartySchema,
  insertWarehouseSchema,
  insertChangeHistorySchema,
  insertAdminUserSchema,
  insertTruckSchema,
  insertArchiveFolderSchema,
  insertArchiveMaterialSchema
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { sendTelegramNotification, formatQuoteRequestMessage, formatContactMessage } from "./telegram";

// Validation middleware
const handleValidationErrors = (req: Request, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: "Validation error", 
      errors: errors.array() 
    });
  }
  next();
};

// Sanitize search queries
const sanitizeQuery = (query: string): string => {
  if (!query || typeof query !== 'string') return '';
  return query
    .trim()
    .slice(0, 100) // Limit length to prevent DoS
    .replace(/[<>\"'&]/g, '') // Remove XSS characters
    .replace(/[%_\\]/g, '\\$&'); // Escape LIKE wildcards
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static assets before API routes with no-cache headers
  app.use('/attached_assets', express.static('attached_assets', {
    setHeaders: (res, path) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }));
  
  // Health check endpoint for monitoring
  app.get('/api/health', async (req, res) => {
    try {
      const dbCheck = await storage.checkDatabaseConnection();
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: dbCheck ? 'connected' : 'disconnected'
      });
    } catch (error) {
      res.status(503).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected'
      });
    }
  });

  // Public API routes

  // Quote requests
  app.post('/api/quote-requests', async (req, res) => {
    try {
      const validatedData = insertQuoteRequestSchema.parse(req.body);
      const quoteRequest = await storage.createQuoteRequest(validatedData);
      
      // Send Telegram notification
      const message = formatQuoteRequestMessage(quoteRequest);
      await sendTelegramNotification(message);
      
      res.status(201).json(quoteRequest);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      // Log error but don't expose details to client
      res.status(500).json({ message: "Failed to create quote request" });
    }
  });

  // Contact submissions
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      
      // Send Telegram notification
      const message = formatContactMessage(submission);
      await sendTelegramNotification(message);
      
      res.status(201).json(submission);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      // Log error but don't expose details to client
      res.status(500).json({ message: "Failed to create contact submission" });
    }
  });

  // Blog posts
  app.get('/api/blog', async (req, res) => {
    try {
      const language = req.query.lang as string || "ru";
      const posts = await storage.getPublishedBlogPosts(language);
      res.json(posts);
    } catch (error) {
      // Log error internally
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get('/api/blog/:slug', async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      // Log error internally
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Company stats
  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await storage.getCompanyStats();
      res.json(stats || {
        totalOrders: 2000,
        countriesServed: 3,
        yearsExperience: 7,
        averageSavings: 25,
        satisfactionRate: 99.2,
        onTimeDelivery: 98.7,
        warehouses: 6
      });
    } catch (error) {
      // Log error internally
      res.status(500).json({ message: "Failed to fetch company stats" });
    }
  });

  // Admin authentication middleware
  const requireAuth = async (req: AuthenticatedRequest, res: any, next: any) => {
    // Check session first
    if ((req as any).session && (req as any).session.user) {
      req.user = (req as any).session.user;
      return next();
    }
    
    // Fallback to header-based auth
    const { username, password } = req.headers;
    if (!username || !password) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const user = await storage.authenticateAdmin(username as string, password as string);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    req.user = { id: user.id, username: user.username };
    next();
  };

  // Admin API routes
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const user = await storage.authenticateAdmin(username, password);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Save user to session
      (req as any).session.user = { id: user.id, username: user.username };
      
      res.json({ user: { id: user.id, username: user.username, fullName: user.fullName, role: user.role } });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Admin Users Management API
  app.get('/api/admin/users', requireAuth, async (req, res) => {
    try {
      const users = await storage.getAdminUsers();
      // Remove password from response
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json(safeUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/admin/users/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const user = await storage.getAdminUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Remove password from response
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post('/api/admin/users', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertAdminUserSchema.parse(req.body);
      const newUser = await storage.createAdminUser(validatedData);
      // Remove password from response
      const { password, ...safeUser } = newUser;
      res.status(201).json(safeUser);
    } catch (error: any) {
      console.error('Error creating user:', error);
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      if (error.code === '23505') {
        return res.status(409).json({ message: "Username already exists" });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.put('/api/admin/users/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      await storage.updateAdminUser(id, req.body);
      res.json({ message: "User updated successfully" });
    } catch (error: any) {
      console.error('Error updating user:', error);
      if (error.code === '23505') {
        return res.status(409).json({ message: "Username already exists" });
      }
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete('/api/admin/users/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      // Prevent deleting yourself
      if (req.user!.id === id) {
        return res.status(400).json({ message: "Cannot delete yourself" });
      }
      await storage.deleteAdminUser(id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Контрагенты API
  app.get('/api/admin/counterparties', requireAuth, async (req, res) => {
    try {
      const counterparties = await storage.getCounterparties();
      res.json(counterparties);
    } catch (error) {
      console.error('Error fetching counterparties:', error);
      res.status(500).json({ message: "Failed to fetch counterparties" });
    }
  });

  // Get specific counterparty by ID - должен быть после общего маршрута
  app.get('/api/admin/counterparties/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid counterparty ID" });
      }
      const counterparty = await storage.getCounterparty(id);
      if (!counterparty) {
        return res.status(404).json({ message: "Counterparty not found" });
      }
      res.json(counterparty);
    } catch (error) {
      console.error('Error fetching counterparty:', error);
      res.status(500).json({ message: "Failed to fetch counterparty" });
    }
  });

  app.post('/api/admin/counterparties', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertCounterpartySchema.parse({ ...req.body, createdBy: req.user!.id });
      const counterparty = await storage.createCounterparty(validatedData);
      res.status(201).json(counterparty);
    } catch (error: any) {
      console.error('Error creating counterparty:', error);
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create counterparty" });
    }
  });

  app.put('/api/admin/counterparties/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid counterparty ID" });
      }
      await storage.updateCounterparty(id, req.body);
      res.json({ message: "Counterparty updated successfully" });
    } catch (error) {
      console.error('Error updating counterparty:', error);
      res.status(500).json({ message: "Failed to update counterparty" });
    }
  });

  app.delete('/api/admin/counterparties/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid counterparty ID" });
      }
      await storage.deleteCounterparty(id);
      res.json({ message: "Counterparty deleted successfully" });
    } catch (error) {
      console.error('Error deleting counterparty:', error);
      res.status(500).json({ message: "Failed to delete counterparty" });
    }
  });

  // Get orders for specific counterparty
  app.get('/api/admin/counterparty/:id/orders', requireAuth, async (req, res) => {
    try {
      const counterpartyId = parseInt(req.params.id);
      const orders = await storage.getOrdersByCounterparty(counterpartyId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch counterparty orders" });
    }
  });

  // Склады API
  app.get('/api/admin/warehouses', requireAuth, async (req, res) => {
    try {
      const warehouses = await storage.getWarehouses();
      res.json(warehouses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch warehouses" });
    }
  });

  app.post('/api/admin/warehouses', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertWarehouseSchema.parse({ ...req.body, createdBy: req.user!.id });
      const warehouse = await storage.createWarehouse(validatedData);
      res.status(201).json(warehouse);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create warehouse" });
    }
  });

  app.put('/api/admin/warehouses/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.updateWarehouse(id, req.body);
      res.json({ message: "Warehouse updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update warehouse" });
    }
  });

  app.delete('/api/admin/warehouses/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteWarehouse(id);
      res.json({ message: "Warehouse deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete warehouse" });
    }
  });

  // История изменений API
  app.get('/api/admin/history/:entityType/:entityId', requireAuth, async (req, res) => {
    try {
      const { entityType, entityId } = req.params;
      const history = await storage.getChangeHistory(entityType, parseInt(entityId));
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch change history" });
    }
  });

  // Orders API
  app.get('/api/admin/orders', requireAuth, async (req, res) => {
    try {
      const { status } = req.query;
      const orders = await storage.getOrders(status as string);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post('/api/admin/orders', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertOrderSchema.parse({ ...req.body, createdBy: req.user!.id });
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get('/api/admin/orders/:id', requireAuth, async (req, res) => {
    try {
      const order = await storage.getOrder(parseInt(req.params.id));
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const items = await storage.getOrderItems(order.id);
      res.json({ ...order, items });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Update order
  app.put('/api/admin/orders/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const updateData = req.body;
      
      // Get current order for change history
      const currentOrder = await storage.getOrder(orderId);
      if (!currentOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Update order
      await storage.updateOrder(orderId, updateData);
      
      // Log change history
      const changedFields = Object.keys(updateData).filter(key => 
        (currentOrder as any)[key] !== updateData[key]
      );
      
      for (const field of changedFields) {
        await storage.createChangeHistory({
          entityType: 'order',
          entityId: orderId,
          action: 'updated',
          fieldChanged: field,
          oldValue: String((currentOrder as any)[field] || ''),
          newValue: String(updateData[field] || ''),
          description: `Поле "${field}" изменено с "${(currentOrder as any)[field] || ''}" на "${updateData[field] || ''}"`,
          userId: req.user!.id
        });
      }
      
      // Recalculate order totals
      await storage.updateOrderTotals(orderId);
      
      res.json({ message: "Order updated successfully" });
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  app.patch('/api/admin/orders/:id/status', requireAuth, async (req, res) => {
    try {
      const { status } = req.body;
      await storage.updateOrderStatus(parseInt(req.params.id), status);
      res.json({ message: "Status updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update status" });
    }
  });

  // Update entire order
  app.patch('/api/admin/orders/:id', requireAuth, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const updateData = req.body;
      await storage.updateOrder(orderId, updateData);
      await storage.updateOrderTotals(orderId);
      res.json({ message: "Order updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // Recalculate order totals
  app.post('/api/admin/orders/:id/recalculate', requireAuth, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      await storage.updateOrderTotals(orderId);
      res.json({ message: "Order totals recalculated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to recalculate totals" });
    }
  });

  // Update order item
  app.patch('/api/admin/orders/items/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const updateData = req.body;
      await storage.updateOrderItem(itemId, updateData, req.user!.id);
      res.json({ message: "Order item updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update order item" });
    }
  });

  // Recalculate all orders totals
  app.post('/api/admin/orders/recalculate', requireAuth, async (req, res) => {
    try {
      const orders = await storage.getOrders();
      for (const order of orders) {
        await storage.updateOrderTotals(order.id);
      }
      res.json({ message: "All orders recalculated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to recalculate orders" });
    }
  });

  // Delete order
  app.delete('/api/admin/orders/:id', requireAuth, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      if (isNaN(orderId)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      await storage.deleteOrder(orderId);
      res.json({ message: "Order deleted" });
    } catch (error) {
      console.error('Delete order error:', error);
      res.status(500).json({ message: "Failed to delete order" });
    }
  });

  // Delete order item
  app.delete('/api/admin/orders/items/:id', requireAuth, async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      await storage.deleteOrderItem(itemId);
      res.json({ message: "Order item deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete order item" });
    }
  });

  // Update inventory item
  app.patch('/api/admin/inventory/:id', requireAuth, async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const updateData = req.body;
      await storage.updateInventoryItem(itemId, updateData);
      res.json({ message: "Inventory item updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update inventory item" });
    }
  });

  // Delete inventory item
  app.delete('/api/admin/inventory/:id', requireAuth, async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      await storage.deleteInventoryItem(itemId);
      res.json({ message: "Inventory item deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete inventory item" });
    }
  });

  // Update order item status
  app.patch('/api/admin/orders/items/:itemId/status', requireAuth, async (req, res) => {
    try {
      const { itemId } = req.params;
      const { status, photos } = req.body;
      
      await storage.updateOrderItemStatus(parseInt(itemId), status, photos);
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating order item status:', error);
      res.status(500).json({ error: 'Failed to update order item status' });
    }
  });

  // Update order item photos
  app.patch('/api/admin/orders/items/:itemId/photos', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const { itemId } = req.params;
      const { photos } = req.body;
      
      await storage.updateOrderItem(parseInt(itemId), { photos }, req.user!.id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating order item photos:', error);
      res.status(500).json({ error: 'Failed to update order item photos' });
    }
  });

  // Order items API
  app.post('/api/admin/orders/:id/items', requireAuth, async (req, res) => {
    try {
      console.log('=== ORDER ITEM CREATION DEBUG ===');
      console.log('Raw request body:', {
        code: req.body.code,
        name: req.body.name,
        photos: req.body.photos ? `[${req.body.photos.length} photos]` : 'no photos',
        pricePerUnit: req.body.pricePerUnit,
        volume: req.body.volume,
        totalPrice: req.body.totalPrice
      });
      
      const validatedData = insertOrderItemSchema.parse({ 
        ...req.body, 
        orderId: parseInt(req.params.id) 
      });
      
      console.log('Validated successfully, creating item...');
      
      const item = await storage.createOrderItem(validatedData);
      console.log('Item created successfully:', item.id);
      
      res.status(201).json(item);
    } catch (error: any) {
      console.error('=== ORDER ITEM CREATION ERROR ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      
      if (error.name === 'ZodError') {
        console.error('Validation errors:', error.errors);
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create order item" });
    }
  });

  app.patch('/api/admin/order-items/:id/status', requireAuth, async (req, res) => {
    try {
      const { status, photos } = req.body;
      await storage.updateOrderItemStatus(parseInt(req.params.id), status, photos);
      res.json({ message: "Status updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update status" });
    }
  });

  // Update order item with full data and change history
  app.put('/api/admin/order-items/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const updateData = req.body;
      
      console.log('=== API UPDATE ORDER ITEM ===');
      console.log('Item ID:', itemId);
      console.log('Request body:', updateData);
      console.log('totalAmount in request:', updateData.totalAmount);
      console.log('remainingAmount in request:', updateData.remainingAmount);
      
      // Update order item with change history tracking
      await storage.updateOrderItem(itemId, updateData, req.user!.id);
      
      res.json({ message: "Order item updated successfully" });
    } catch (error) {
      console.error('Error updating order item:', error);
      res.status(500).json({ message: "Failed to update order item" });
    }
  });

  // Warehouse inventory API - get inventory by warehouse ID
  app.get('/api/admin/warehouse-inventory/:warehouseId', requireAuth, async (req, res) => {
    try {
      const warehouseId = parseInt(req.params.warehouseId);
      console.log('Fetching inventory for warehouse ID:', warehouseId);
      const inventory = await storage.getWarehouseInventory(warehouseId);
      res.json(inventory);
    } catch (error) {
      console.error('Error fetching warehouse inventory:', error);
      res.status(500).json({ message: "Failed to fetch warehouse inventory" });
    }
  });

  // Add new inventory item
  app.post('/api/admin/warehouse-inventory', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      console.log('Received inventory data:', req.body);
      const validatedData = insertWarehouseInventorySchema.parse({ ...req.body, createdBy: req.user!.id });
      console.log('Validated data:', validatedData);
      const item = await storage.createInventoryItem(validatedData);
      res.status(201).json(item);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        console.log('Validation error details:', error.issues);
        return res.status(400).json({ message: validationError.message });
      }
      console.error('Error creating inventory item:', error);
      res.status(500).json({ message: "Failed to create inventory item" });
    }
  });

  // Update warehouse inventory item
  app.put('/api/admin/warehouse-inventory/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const itemId = parseInt(req.params.id);
      await storage.updateInventoryItem(itemId, { ...req.body, updatedAt: new Date() });
      res.json({ message: "Inventory item updated" });
    } catch (error) {
      console.error('Error updating inventory item:', error);
      res.status(500).json({ message: "Failed to update inventory item" });
    }
  });

  // Delete warehouse inventory item
  app.delete('/api/admin/warehouse-inventory/:id', requireAuth, async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      await storage.deleteInventoryItem(itemId);
      res.json({ message: "Inventory item deleted" });
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      res.status(500).json({ message: "Failed to delete inventory item" });
    }
  });

  // Legacy endpoint for compatibility
  app.get('/api/admin/inventory/:warehouse', requireAuth, async (req, res) => {
    try {
      const warehouse = decodeURIComponent(req.params.warehouse);
      console.log('Fetching inventory for warehouse:', warehouse);
      
      // Проверяем, является ли warehouse числом (ID) или строкой (имя)
      const isNumeric = /^\d+$/.test(warehouse);
      let inventory;
      
      if (isNumeric) {
        console.log('Using warehouse ID:', parseInt(warehouse));
        inventory = await storage.getWarehouseInventory(parseInt(warehouse));
      } else {
        console.log('Using warehouse name:', warehouse);
        inventory = await storage.getWarehouseInventoryByName(warehouse);
      }
      
      res.json(inventory);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  app.post('/api/admin/inventory', requireAuth, async (req, res) => {
    try {
      const validatedData = insertWarehouseInventorySchema.parse(req.body);
      const item = await storage.createInventoryItem(validatedData);
      res.status(201).json(item);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create inventory item" });
    }
  });

  // Reduce inventory quantity when used in orders
  app.patch('/api/admin/inventory/:id/reduce', requireAuth, async (req, res) => {
    try {
      const { quantity } = req.body;
      await storage.reduceInventoryQuantity(parseInt(req.params.id), quantity);
      res.json({ message: "Inventory quantity reduced" });
    } catch (error) {
      res.status(500).json({ message: "Failed to reduce inventory quantity" });
    }
  });



  // Warehouses API
  app.get('/api/admin/warehouses', requireAuth, async (req, res) => {
    try {
      const warehouses = await storage.getWarehouses();
      res.json(warehouses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch warehouses" });
    }
  });

  app.post('/api/admin/warehouses', requireAuth, async (req, res) => {
    try {
      const validatedData = insertWarehouseSchema.parse(req.body);
      const warehouse = await storage.createWarehouse(validatedData);
      res.status(201).json(warehouse);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create warehouse" });
    }
  });

  app.get('/api/admin/warehouses/:id', requireAuth, async (req, res) => {
    try {
      const warehouse = await storage.getWarehouse(parseInt(req.params.id));
      if (!warehouse) {
        return res.status(404).json({ message: "Warehouse not found" });
      }
      res.json(warehouse);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch warehouse" });
    }
  });

  app.put('/api/admin/warehouses/:id', requireAuth, async (req, res) => {
    try {
      await storage.updateWarehouse(parseInt(req.params.id), req.body);
      await storage.updateWarehouseStats(parseInt(req.params.id));
      res.json({ message: "Warehouse updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update warehouse" });
    }
  });

  app.delete('/api/admin/warehouses/:id', requireAuth, async (req, res) => {
    try {
      await storage.deleteWarehouse(parseInt(req.params.id));
      res.json({ message: "Warehouse deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete warehouse" });
    }
  });

  // Universal search endpoint
  app.get('/api/admin/search', 
    [
      query('q').notEmpty().trim().isLength({ min: 1, max: 100 }).escape(),
      handleValidationErrors
    ],
    requireAuth, 
    async (req: any, res: any) => {
    try {
      const searchQuery = sanitizeQuery(req.query.q as string);
      if (!searchQuery) {
        return res.status(400).json({ message: "Valid search query required" });
      }

      const [orders, items, counterparties, inventory] = await Promise.all([
        storage.searchOrders(searchQuery),
        storage.searchOrderItems(searchQuery),
        storage.searchCounterparties(searchQuery),
        storage.searchInventory(searchQuery)
      ]);

      res.json({ orders, items, counterparties, inventory });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ message: "Search failed" });
    }
  });

  // Get inventory counts for all warehouses
  app.get('/api/admin/inventory-counts', requireAuth, async (req, res) => {
    try {
      const counts = await storage.getInventoryCounts();
      res.json(counts);
    } catch (error) {
      console.error('Get inventory counts error:', error);
      res.status(500).json({ error: 'Failed to get inventory counts' });
    }
  });

  // Delete order
  app.delete('/api/admin/orders/:orderId', requireAuth, async (req, res) => {
    try {
      const { orderId } = req.params;
      await storage.deleteOrder(parseInt(orderId));
      res.json({ success: true });
    } catch (error) {
      console.error('Delete order error:', error);
      res.status(500).json({ error: 'Failed to delete order' });
    }
  });

  // Delete order item
  app.delete('/api/admin/orders/:orderId/items/:itemId', requireAuth, async (req, res) => {
    try {
      const itemId = parseInt(req.params.itemId);
      if (isNaN(itemId)) {
        return res.status(400).json({ message: "Invalid item ID" });
      }
      await storage.deleteOrderItem(itemId);
      res.json({ success: true });
    } catch (error) {
      console.error('Delete order item error:', error);
      res.status(500).json({ error: 'Failed to delete order item' });
    }
  });

  // Customer tracking API
  app.get('/api/tracking/:code', async (req, res) => {
    try {
      const order = await storage.getOrderByTrackingCode(req.params.code);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const items = await storage.getOrderItems(order.id);
      res.json({ ...order, items });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Search orders by code for client portal
  app.get('/api/search/orders/:code', async (req, res) => {
    try {
      const searchTerm = req.params.code;
      
      // First try to find by exact tracking code
      const orderByTracking = await storage.getOrderByTrackingCode(searchTerm);
      if (orderByTracking) {
        const items = await storage.getOrderItems(orderByTracking.id);
        return res.json({ ...orderByTracking, items });
      }
      
      // Then try to find by order code
      const orders = await storage.searchOrders(searchTerm);
      if (orders.length > 0) {
        const order = orders[0];
        const items = await storage.getOrderItems(order.id);
        return res.json({ ...order, items });
      }
      
      // If not found, return empty result
      return res.json({ order: null, items: [] });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ message: "Failed to search orders" });
    }
  });

  // Get change history for order
  app.get('/api/admin/change-history/order/:id', requireAuth, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const history = await storage.getChangeHistory('order', orderId);
      res.json(history);
    } catch (error) {
      console.error('Error fetching order history:', error);
      res.status(500).json({ message: "Failed to fetch order history" });
    }
  });

  // Get change history for order item
  app.get('/api/admin/change-history/item/:id', requireAuth, async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const history = await storage.getChangeHistory('orderItem', itemId);
      res.json(history);
    } catch (error) {
      console.error('Error fetching item history:', error);
      res.status(500).json({ message: "Failed to fetch item history" });
    }
  });

  // Search API
  app.get('/api/admin/search', requireAuth, async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Query parameter required" });
      }
      
      const [orders, items] = await Promise.all([
        storage.searchOrders(q as string),
        storage.searchOrderItems(q as string)
      ]);
      
      res.json({ orders, items });
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });

  // Грузовые траки (Фуры) API
  app.get('/api/admin/trucks', requireAuth, async (req, res) => {
    try {
      const trucks = await storage.getTrucks();
      res.json(trucks);
    } catch (error) {
      console.error('Get trucks error:', error);
      res.status(500).json({ error: 'Failed to fetch trucks' });
    }
  });

  app.get('/api/admin/trucks/:id', requireAuth, async (req, res) => {
    try {
      const truck = await storage.getTruck(parseInt(req.params.id));
      if (!truck) {
        return res.status(404).json({ error: 'Truck not found' });
      }
      
      const items = await storage.getTruckItems(truck.id);
      res.json({ ...truck, items });
    } catch (error) {
      console.error('Get truck error:', error);
      res.status(500).json({ error: 'Failed to fetch truck' });
    }
  });

  app.post('/api/admin/trucks', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertTruckSchema.parse({
        ...req.body,
        createdBy: req.user?.id
      });
      
      const truck = await storage.createTruck(validatedData);
      res.status(201).json(truck);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error('Create truck error:', error);
      res.status(500).json({ error: 'Failed to create truck' });
    }
  });

  app.put('/api/admin/trucks/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      await storage.updateTruck(parseInt(id), updateData);
      
      // Update truck volume if status changed
      if (updateData.status) {
        await storage.updateTruckVolume(parseInt(id));
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Update truck error:', error);
      res.status(500).json({ error: 'Failed to update truck' });
    }
  });

  app.delete('/api/admin/trucks/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid truck ID" });
      }
      await storage.deleteTruck(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Delete truck error:', error);
      res.status(500).json({ error: 'Failed to delete truck' });
    }
  });

  // Get truck items
  app.get('/api/admin/trucks/:id/items', requireAuth, async (req, res) => {
    try {
      const truckId = parseInt(req.params.id);
      console.log('=== GET TRUCK ITEMS DEBUG ===');
      console.log('Truck ID:', truckId);
      
      const items = await storage.getTruckItems(truckId);
      console.log('Found items:', items.length);
      console.log('Items:', items.map(i => ({id: i.id, name: i.name, truckId: i.truckId})));
      
      res.json(items);
    } catch (error) {
      console.error('Get truck items error:', error);
      res.status(500).json({ error: 'Failed to fetch truck items' });
    }
  });

  // Truck folders API
  app.post('/api/admin/trucks/:id/folders', requireAuth, async (req, res) => {
    try {
      const truckId = parseInt(req.params.id);
      const { name } = req.body;
      
      const truck = await storage.getTruck(truckId);
      if (!truck) {
        return res.status(404).json({ error: 'Truck not found' });
      }

      const folders = Array.isArray(truck.folders) ? truck.folders : [];
      const newFolder = {
        id: Date.now(),
        name,
        createdAt: new Date().toISOString()
      };
      
      folders.push(newFolder);
      await storage.updateTruck(truckId, { folders });
      
      res.status(201).json(newFolder);
    } catch (error) {
      console.error('Create truck folder error:', error);
      res.status(500).json({ error: 'Failed to create folder' });
    }
  });

  app.get('/api/admin/trucks/:id/folders', requireAuth, async (req, res) => {
    try {
      const truckId = parseInt(req.params.id);
      const truck = await storage.getTruck(truckId);
      
      if (!truck) {
        return res.status(404).json({ error: 'Truck not found' });
      }
      
      const folders = Array.isArray(truck.folders) ? truck.folders : [];
      res.json(folders);
    } catch (error) {
      console.error('Get truck folders error:', error);
      res.status(500).json({ error: 'Failed to fetch folders' });
    }
  });

  // Truck documents API
  app.post('/api/admin/trucks/:id/documents', requireAuth, async (req, res) => {
    try {
      const truckId = parseInt(req.params.id);
      const { name, type, folderId, fileData } = req.body;
      
      const truck = await storage.getTruck(truckId);
      if (!truck) {
        return res.status(404).json({ error: 'Truck not found' });
      }

      const documents = Array.isArray(truck.documents) ? truck.documents : [];
      const newDocument = {
        id: Date.now(),
        name,
        type: type || 'document',
        folderId: folderId || null,
        fileData: fileData || '',
        createdAt: new Date().toISOString()
      };
      
      documents.push(newDocument);
      await storage.updateTruck(truckId, { documents });
      
      res.status(201).json(newDocument);
    } catch (error) {
      console.error('Create truck document error:', error);
      res.status(500).json({ error: 'Failed to create document' });
    }
  });

  app.get('/api/admin/trucks/:id/documents', requireAuth, async (req, res) => {
    try {
      const truckId = parseInt(req.params.id);
      const truck = await storage.getTruck(truckId);
      
      if (!truck) {
        return res.status(404).json({ error: 'Truck not found' });
      }
      
      const documents = Array.isArray(truck.documents) ? truck.documents : [];
      res.json(documents);
    } catch (error) {
      console.error('Get truck documents error:', error);
      res.status(500).json({ error: 'Failed to fetch documents' });
    }
  });

  // Delete truck folder
  app.delete('/api/admin/trucks/:id/folders/:folderId', requireAuth, async (req, res) => {
    try {
      const truckId = parseInt(req.params.id);
      const folderId = parseInt(req.params.folderId);
      
      const truck = await storage.getTruck(truckId);
      if (!truck) {
        return res.status(404).json({ error: 'Truck not found' });
      }

      const folders = Array.isArray(truck.folders) ? truck.folders : [];
      const documents = Array.isArray(truck.documents) ? truck.documents : [];
      
      // Remove folder and all documents in it
      const updatedFolders = folders.filter(f => f.id !== folderId);
      const updatedDocuments = documents.filter(d => d.folderId !== folderId);
      
      await storage.updateTruck(truckId, { 
        folders: updatedFolders,
        documents: updatedDocuments
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error('Delete truck folder error:', error);
      res.status(500).json({ error: 'Failed to delete folder' });
    }
  });

  // Delete truck document
  app.delete('/api/admin/trucks/:id/documents/:documentId', requireAuth, async (req, res) => {
    try {
      const truckId = parseInt(req.params.id);
      const documentId = parseInt(req.params.documentId);
      
      const truck = await storage.getTruck(truckId);
      if (!truck) {
        return res.status(404).json({ error: 'Truck not found' });
      }

      const documents = Array.isArray(truck.documents) ? truck.documents : [];
      const updatedDocuments = documents.filter(d => d.id !== documentId);
      
      await storage.updateTruck(truckId, { documents: updatedDocuments });
      
      res.json({ success: true });
    } catch (error) {
      console.error('Delete truck document error:', error);
      res.status(500).json({ error: 'Failed to delete document' });
    }
  });

  // Order document management API
  app.post('/api/admin/orders/:id/folders', requireAuth, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { name } = req.body;
      
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const folders = Array.isArray(order.folders) ? order.folders : [];
      const newFolder = {
        id: Date.now(),
        name,
        createdAt: new Date().toISOString()
      };
      
      folders.push(newFolder);
      await storage.updateOrder(orderId, { folders });
      
      res.status(201).json(newFolder);
    } catch (error) {
      console.error('Create order folder error:', error);
      res.status(500).json({ error: 'Failed to create folder' });
    }
  });

  app.get('/api/admin/orders/:id/folders', requireAuth, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      const folders = Array.isArray(order.folders) ? order.folders : [];
      res.json(folders);
    } catch (error) {
      console.error('Get order folders error:', error);
      res.status(500).json({ error: 'Failed to fetch folders' });
    }
  });

  app.post('/api/admin/orders/:id/documents', requireAuth, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { name, type, folderId, fileData } = req.body;
      
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const documents = Array.isArray(order.documents) ? order.documents : [];
      const newDocument = {
        id: Date.now(),
        name,
        type: type || 'document',
        folderId: folderId || null,
        fileData: fileData || '',
        createdAt: new Date().toISOString()
      };
      
      documents.push(newDocument);
      await storage.updateOrder(orderId, { documents });
      
      res.status(201).json(newDocument);
    } catch (error) {
      console.error('Create order document error:', error);
      res.status(500).json({ error: 'Failed to create document' });
    }
  });

  app.get('/api/admin/orders/:id/documents', requireAuth, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      const documents = Array.isArray(order.documents) ? order.documents : [];
      res.json(documents);
    } catch (error) {
      console.error('Get order documents error:', error);
      res.status(500).json({ error: 'Failed to fetch documents' });
    }
  });

  app.delete('/api/admin/orders/:id/folders/:folderId', requireAuth, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const folderId = parseInt(req.params.folderId);
      
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const folders = Array.isArray(order.folders) ? order.folders : [];
      const documents = Array.isArray(order.documents) ? order.documents : [];
      
      // Remove folder and all documents in it
      const updatedFolders = folders.filter(f => f.id !== folderId);
      const updatedDocuments = documents.filter(d => d.folderId !== folderId);
      
      await storage.updateOrder(orderId, { 
        folders: updatedFolders,
        documents: updatedDocuments
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error('Delete order folder error:', error);
      res.status(500).json({ error: 'Failed to delete folder' });
    }
  });

  app.delete('/api/admin/orders/:id/documents/:documentId', requireAuth, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const documentId = parseInt(req.params.documentId);
      
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const documents = Array.isArray(order.documents) ? order.documents : [];
      const updatedDocuments = documents.filter(d => d.id !== documentId);
      
      await storage.updateOrder(orderId, { documents: updatedDocuments });
      
      res.json({ success: true });
    } catch (error) {
      console.error('Delete order document error:', error);
      res.status(500).json({ error: 'Failed to delete document' });
    }
  });

  // Архив API
  app.get('/api/admin/archive/folders', requireAuth, async (req, res) => {
    try {
      const { parentId } = req.query;
      const folders = await storage.getArchiveFolders(parentId ? parseInt(parentId as string) : undefined);
      res.json(folders);
    } catch (error) {
      console.error('Get archive folders error:', error);
      res.status(500).json({ error: 'Failed to fetch archive folders' });
    }
  });

  app.get('/api/admin/archive/materials', requireAuth, async (req, res) => {
    try {
      const { folderId } = req.query;
      const materials = await storage.getArchiveMaterials(folderId ? parseInt(folderId as string) : undefined);
      res.json(materials);
    } catch (error) {
      console.error('Get archive materials error:', error);
      res.status(500).json({ error: 'Failed to fetch archive materials' });
    }
  });

  app.post('/api/admin/archive/folders', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertArchiveFolderSchema.parse({
        ...req.body,
        createdBy: req.user?.id
      });
      
      const folder = await storage.createArchiveFolder(validatedData);
      res.status(201).json(folder);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error('Create archive folder error:', error);
      res.status(500).json({ error: 'Failed to create archive folder' });
    }
  });

  app.post('/api/admin/archive/materials', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertArchiveMaterialSchema.parse({
        ...req.body,
        createdBy: req.user?.id
      });
      
      const material = await storage.createArchiveMaterial(validatedData);
      res.status(201).json(material);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error('Create archive material error:', error);
      res.status(500).json({ error: 'Failed to create archive material' });
    }
  });

  app.put('/api/admin/archive/folders/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.updateArchiveFolder(parseInt(id), req.body);
      res.json({ success: true });
    } catch (error) {
      console.error('Update archive folder error:', error);
      res.status(500).json({ error: 'Failed to update archive folder' });
    }
  });

  app.put('/api/admin/archive/materials/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.updateArchiveMaterial(parseInt(id), req.body);
      res.json({ success: true });
    } catch (error) {
      console.error('Update archive material error:', error);
      res.status(500).json({ error: 'Failed to update archive material' });
    }
  });

  app.delete('/api/admin/archive/folders/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteArchiveFolder(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error('Delete archive folder error:', error);
      res.status(500).json({ error: 'Failed to delete archive folder' });
    }
  });

  app.delete('/api/admin/archive/materials/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteArchiveMaterial(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error('Delete archive material error:', error);
      res.status(500).json({ error: 'Failed to delete archive material' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
