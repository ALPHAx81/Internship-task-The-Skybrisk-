import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FiPackage, FiUsers, FiShoppingCart, FiBox, FiTrendingUp } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    orders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, customersRes, ordersRes, inventoryRes] = await Promise.all([
        api.get('/api/products?limit=1'),
        api.get('/api/customers?limit=1'),
        api.get('/api/orders?limit=5'),
        api.get('/api/inventory')
      ]);

      setStats({
        products: productsRes.data.total || 0,
        customers: customersRes.data.total || 0,
        orders: ordersRes.data.total || 0,
        totalRevenue: 0 // Calculate from orders if needed
      });

      setRecentOrders(ordersRes.data.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e3f2fd' }}>
            <FiPackage style={{ color: '#2196f3' }} />
          </div>
          <div className="stat-info">
            <h3>{stats.products}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f3e5f5' }}>
            <FiUsers style={{ color: '#9c27b0' }} />
          </div>
          <div className="stat-info">
            <h3>{stats.customers}</h3>
            <p>Total Customers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e8f5e9' }}>
            <FiShoppingCart style={{ color: '#4caf50' }} />
          </div>
          <div className="stat-info">
            <h3>{stats.orders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fff3e0' }}>
            <FiTrendingUp style={{ color: '#ff9800' }} />
          </div>
          <div className="stat-info">
            <h3>${stats.totalRevenue.toFixed(2)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Recent Orders</h2>
        </div>
        {recentOrders.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.customer?.name || 'N/A'}</td>
                    <td>${order.total?.toFixed(2) || '0.00'}</td>
                    <td>
                      <span className={`status-badge status-${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No recent orders</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
