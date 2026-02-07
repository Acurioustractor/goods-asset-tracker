'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { unstable_cache } from 'next/cache';

// Cache dashboard data for 5 minutes
const CACHE_REVALIDATE = 300;

export interface DashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  growthRate: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface ProductPerformance {
  product: string;
  orders: number;
  revenue: number;
  units: number;
}

export interface GeographicData {
  state: string;
  orders: number;
  revenue: number;
  customers: number;
}

export interface InventoryStatus {
  product: string;
  inStock: number;
  reserved: number;
  available: number;
  lowStockAlert: boolean;
}

// Get high-level KPI metrics
export const getMetrics = unstable_cache(
  async (): Promise<DashboardMetrics> => {
    const supabase = await createServiceClient();

    // Get all orders
    const { data: orders, error } = await supabase
      .from('orders')
      .select('total_cents, created_at, payment_status')
      .eq('payment_status', 'paid');

    if (error) {
      console.error('Error fetching metrics:', error);
      return {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        ordersThisMonth: 0,
        revenueThisMonth: 0,
        growthRate: 0,
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Calculate metrics
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total_cents || 0) / 100, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Current month
    const currentMonthOrders = orders.filter((order) => {
      const orderDate = new Date(order.created_at);
      return (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      );
    });
    const ordersThisMonth = currentMonthOrders.length;
    const revenueThisMonth = currentMonthOrders.reduce(
      (sum, order) => sum + (order.total_cents || 0) / 100,
      0
    );

    // Last month
    const lastMonthOrders = orders.filter((order) => {
      const orderDate = new Date(order.created_at);
      return (
        orderDate.getMonth() === lastMonth &&
        orderDate.getFullYear() === lastMonthYear
      );
    });
    const revenueLastMonth = lastMonthOrders.reduce(
      (sum, order) => sum + (order.total_cents || 0) / 100,
      0
    );

    // Growth rate
    const growthRate =
      revenueLastMonth > 0
        ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100
        : 0;

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      ordersThisMonth,
      revenueThisMonth,
      growthRate,
    };
  },
  ['dashboard-metrics'],
  { revalidate: CACHE_REVALIDATE }
);

// Get revenue over time (daily for last 30 days)
export const getRevenueData = unstable_cache(
  async (days: number = 30): Promise<RevenueDataPoint[]> => {
    const supabase = await createServiceClient();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: orders, error } = await supabase
      .from('orders')
      .select('total_cents, created_at')
      .eq('payment_status', 'paid')
      .gte('created_at', startDate.toISOString());

    if (error) {
      console.error('Error fetching revenue data:', error);
      return [];
    }

    // Group by date
    const revenueByDate = new Map<string, { revenue: number; orders: number }>();

    orders.forEach((order) => {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      const current = revenueByDate.get(date) || { revenue: 0, orders: 0 };
      revenueByDate.set(date, {
        revenue: current.revenue + (order.total_cents || 0) / 100,
        orders: current.orders + 1,
      });
    });

    // Fill in missing dates with zeros
    const result: RevenueDataPoint[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      const dateStr = date.toISOString().split('T')[0];
      const data = revenueByDate.get(dateStr) || { revenue: 0, orders: 0 };
      result.push({
        date: dateStr,
        revenue: data.revenue,
        orders: data.orders,
      });
    }

    return result;
  },
  ['dashboard-revenue-data'],
  { revalidate: CACHE_REVALIDATE }
);

// Get product performance
export const getProductPerformance = unstable_cache(
  async (): Promise<ProductPerformance[]> => {
    const supabase = await createServiceClient();

    const { data: orderItems, error } = await supabase
      .from('order_items')
      .select(
        `
        product_type,
        quantity,
        unit_price_cents,
        orders!inner (
          payment_status
        )
      `
      )
      .eq('orders.payment_status', 'paid');

    if (error) {
      console.error('Error fetching product performance:', error);
      return [];
    }

    // Group by product
    const productMap = new Map<
      string,
      { orders: Set<string>; revenue: number; units: number }
    >();

    orderItems.forEach((item: any) => {
      const product = item.product_type || 'unknown';
      const current = productMap.get(product) || {
        orders: new Set<string>(),
        revenue: 0,
        units: 0,
      };

      current.revenue += ((item.unit_price_cents || 0) / 100) * (item.quantity || 0);
      current.units += item.quantity || 0;

      productMap.set(product, current);
    });

    // Convert to array
    const result: ProductPerformance[] = [];
    productMap.forEach((data, product) => {
      result.push({
        product: formatProductName(product),
        orders: data.orders.size,
        revenue: data.revenue,
        units: data.units,
      });
    });

    return result.sort((a, b) => b.revenue - a.revenue);
  },
  ['dashboard-product-performance'],
  { revalidate: CACHE_REVALIDATE }
);

// Get geographic distribution
export const getGeographicData = unstable_cache(
  async (): Promise<GeographicData[]> => {
    const supabase = await createServiceClient();

    const { data: orders, error } = await supabase
      .from('orders')
      .select('id, total_cents, shipping_address')
      .eq('payment_status', 'paid');

    if (error) {
      console.error('Error fetching geographic data:', error);
      return [];
    }

    // Group by state
    const stateMap = new Map<
      string,
      { orders: number; revenue: number; customers: Set<string> }
    >();

    orders.forEach((order) => {
      const address = order.shipping_address as any;
      const state = address?.state || 'Unknown';

      const current = stateMap.get(state) || {
        orders: 0,
        revenue: 0,
        customers: new Set<string>(),
      };

      current.orders += 1;
      current.revenue += (order.total_cents || 0) / 100;
      if (address?.email) {
        current.customers.add(address.email);
      }

      stateMap.set(state, current);
    });

    // Convert to array
    const result: GeographicData[] = [];
    stateMap.forEach((data, state) => {
      result.push({
        state,
        orders: data.orders,
        revenue: data.revenue,
        customers: data.customers.size,
      });
    });

    return result.sort((a, b) => b.revenue - a.revenue);
  },
  ['dashboard-geographic-data'],
  { revalidate: CACHE_REVALIDATE }
);

// Get inventory status
export const getInventoryStatus = unstable_cache(
  async (): Promise<InventoryStatus[]> => {
    const supabase = await createServiceClient();

    const { data: products, error } = await supabase
      .from('products')
      .select('name, inventory_count');

    if (error) {
      console.error('Error fetching inventory:', error);
      return [];
    }

    return products.map((product) => {
      const inStock = product.inventory_count || 0;
      const reserved = 0; // Not tracked yet
      const available = inStock - reserved;
      const threshold = 10; // Default threshold

      return {
        product: product.name,
        inStock,
        reserved,
        available,
        lowStockAlert: available <= threshold,
      };
    });
  },
  ['dashboard-inventory'],
  { revalidate: CACHE_REVALIDATE }
);

// Helper: Format product names
function formatProductName(productType: string): string {
  const nameMap: Record<string, string> = {
    stretch_bed: 'Stretch Bed',
    weave_bed: 'Stretch Bed', // Legacy mapping
    basket_bed: 'Basket Bed',
    washing_machine: 'Washing Machine',
  };

  return nameMap[productType] || productType;
}
