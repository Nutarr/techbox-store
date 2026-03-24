'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { products as initialProducts, categories as initialCategories } from '@/data/products';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [productsList, setProductsList] = useState(initialProducts);
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      date: '2026-03-24',
      customer: 'أحمد محمد',
      phone: '0551234567',
      city: 'الرياض',
      items: [
        { title: 'شاحن GaN 140W', qty: 2, price: 67, costPrice: 28 },
        { title: 'سماعات Baseus Bowie MA10', qty: 1, price: 79, costPrice: 32 },
      ],
      total: 213,
      totalCost: 88,
      profit: 125,
      status: 'جديد',
      // Dropshipping fields
      supplierStatus: 'لم يُطلب',
      supplierOrderId: '',
      trackingNumber: '',
      trackingUrl: '',
      supplierNote: '',
      estimatedDelivery: '',
    },
    {
      id: 'ORD-002',
      date: '2026-03-23',
      customer: 'سارة العتيبي',
      phone: '0559876543',
      city: 'جدة',
      items: [
        { title: 'ساعة ذكية Ultra 2', qty: 1, price: 125, costPrice: 50 },
      ],
      total: 125,
      totalCost: 50,
      profit: 75,
      status: 'قيد التنفيذ',
      supplierStatus: 'تم الطلب',
      supplierOrderId: 'AE-8294761053',
      trackingNumber: '',
      trackingUrl: '',
      supplierNote: 'تم الطلب من علي إكسبريس',
      estimatedDelivery: '2026-04-08',
    },
    {
      id: 'ORD-003',
      date: '2026-03-22',
      customer: 'خالد الدوسري',
      phone: '0543216789',
      city: 'الدمام',
      items: [
        { title: 'باوربانك GaN 25000mAh', qty: 1, price: 149, costPrice: 65 },
        { title: 'شاحن سيارة 140W', qty: 1, price: 85, costPrice: 35 },
      ],
      total: 234,
      totalCost: 100,
      profit: 134,
      status: 'تم الشحن',
      supplierStatus: 'تم الشحن',
      supplierOrderId: 'AE-7182946305',
      trackingNumber: 'LP00182736492SA',
      trackingUrl: 'https://track.aliexpress.com',
      supplierNote: '',
      estimatedDelivery: '2026-04-05',
    },
  ]);

  const [storeSettings, setStoreSettings] = useState({
    storeName: 'TechBox',
    phone: '966558118653',
    email: 'nutarr@hotmail.com',
    city: 'الرياض',
    currency: 'ر.س',
    freeShippingMin: 150,
    profitMargin: 30,
    defaultShippingCost: 0,
    supplierName: 'AliExpress',
    autoCalcProfit: true,
  });

  // Products CRUD
  const addProduct = useCallback((product) => {
    const newId = Math.max(...productsList.map(p => p.id)) + 1;
    setProductsList(prev => [...prev, { ...product, id: newId }]);
    return newId;
  }, [productsList]);

  const updateProduct = useCallback((id, updates) => {
    setProductsList(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteProduct = useCallback((id) => {
    setProductsList(prev => prev.filter(p => p.id !== id));
  }, []);

  // Orders CRUD
  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  }, []);

  const updateSupplierInfo = useCallback((orderId, supplierData) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...supplierData } : o));
  }, []);

  const addOrder = useCallback((order) => {
    const newId = `ORD-${String(orders.length + 1).padStart(3, '0')}`;
    const totalCost = order.items.reduce((sum, item) => sum + (item.costPrice || 0) * item.qty, 0);
    const profit = order.total - totalCost;
    setOrders(prev => [{
      ...order,
      id: newId,
      date: new Date().toISOString().split('T')[0],
      totalCost,
      profit,
      supplierStatus: 'لم يُطلب',
      supplierOrderId: '',
      trackingNumber: '',
      trackingUrl: '',
      supplierNote: '',
      estimatedDelivery: '',
    }, ...prev]);
  }, [orders]);

  // Find order by ID (for customer tracking)
  const findOrder = useCallback((orderId) => {
    return orders.find(o => o.id === orderId);
  }, [orders]);

  // Dropshipping Stats
  const stats = {
    totalProducts: productsList.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    totalCost: orders.reduce((sum, o) => sum + (o.totalCost || 0), 0),
    totalProfit: orders.reduce((sum, o) => sum + (o.profit || 0), 0),
    profitMargin: orders.length > 0
      ? Math.round((orders.reduce((sum, o) => sum + (o.profit || 0), 0) / orders.reduce((sum, o) => sum + o.total, 0)) * 100)
      : 0,
    newOrders: orders.filter(o => o.status === 'جديد').length,
    shippedOrders: orders.filter(o => o.status === 'تم الشحن').length,
    completedOrders: orders.filter(o => o.status === 'مكتمل').length,
    pendingSupplier: orders.filter(o => o.supplierStatus === 'لم يُطلب').length,
    avgProfit: orders.length > 0
      ? Math.round(orders.reduce((sum, o) => sum + (o.profit || 0), 0) / orders.length)
      : 0,
  };

  // Product profit stats
  const getProductProfit = useCallback((product) => {
    const cost = product.costPrice || 0;
    const profit = product.price - cost;
    const margin = cost > 0 ? Math.round((profit / product.price) * 100) : 0;
    return { cost, profit, margin };
  }, []);

  return (
    <AdminContext.Provider value={{
      products: productsList,
      orders,
      storeSettings,
      stats,
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      updateSupplierInfo,
      addOrder,
      findOrder,
      setStoreSettings,
      getProductProfit,
      categories: initialCategories,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
}
