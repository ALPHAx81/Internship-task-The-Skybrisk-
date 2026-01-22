import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiEye } from 'react-icons/fi';
import OrderModal from '../components/OrderModal';
import OrderViewModal from '../components/OrderViewModal';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;

      const response = await api.get('/api/orders', { params });
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingOrder(null);
    setShowModal(true);
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setShowModal(true);
  };

  const handleView = async (order) => {
    try {
      const response = await api.get(`/api/orders/${order._id}`);
      setViewingOrder(response.data.data);
      setShowViewModal(true);
    } catch (error) {
      alert('Error fetching order details');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await api.delete(`/api/orders/${id}`);
      fetchOrders();
    } catch (error) {
      alert('Error deleting order: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingOrder(null);
    fetchOrders();
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Orders</h2>
          <button className="btn btn-primary" onClick={handleCreate}>
            <FiPlus /> Create Order
          </button>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
            <input
              type="text"
              placeholder="Search by order number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 35px', border: '1px solid #ddd', borderRadius: '5px' }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', minWidth: '150px' }}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.customer?.name || 'N/A'}</td>
                    <td>{order.items?.length || 0} item(s)</td>
                    <td>${order.total?.toFixed(2) || '0.00'}</td>
                    <td>
                      <span className={`status-badge status-${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${order.paymentStatus}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleView(order)}
                        style={{ marginRight: '5px', padding: '5px 10px', fontSize: '12px' }}
                      >
                        <FiEye /> View
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleEdit(order)}
                        style={{ marginRight: '5px', padding: '5px 10px', fontSize: '12px' }}
                      >
                        <FiEdit /> Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(order._id)}
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <OrderModal
          order={editingOrder}
          onClose={handleModalClose}
        />
      )}

      {showViewModal && viewingOrder && (
        <OrderViewModal
          order={viewingOrder}
          onClose={() => {
            setShowViewModal(false);
            setViewingOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default Orders;
