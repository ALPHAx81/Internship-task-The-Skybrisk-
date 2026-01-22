import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FiX } from 'react-icons/fi';

const OrderModal = ({ order, onClose }) => {
  const [formData, setFormData] = useState({
    customer: '',
    items: [{ product: '', quantity: 1 }],
    tax: 0,
    discount: 0,
    paymentMethod: 'cash',
    notes: '',
    status: 'pending',
    paymentStatus: 'pending'
  });
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    if (order) {
      setFormData({
        customer: order.customer?._id || order.customer || '',
        items: order.items?.map(item => ({
          product: item.product?._id || item.product || '',
          quantity: item.quantity || 1
        })) || [{ product: '', quantity: 1 }],
        tax: order.tax || 0,
        discount: order.discount || 0,
        paymentMethod: order.paymentMethod || 'cash',
        notes: order.notes || '',
        status: order.status || 'pending',
        paymentStatus: order.paymentStatus || 'pending'
      });
    }
  }, [order]);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/api/customers?limit=1000');
      setCustomers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products?limit=1000&status=active');
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product: '', quantity: 1 }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        tax: parseFloat(formData.tax) || 0,
        discount: parseFloat(formData.discount) || 0
      };

      if (order) {
        await api.put(`/api/orders/${order._id}`, data);
      } else {
        await api.post('/api/orders', data);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <h2>{order ? 'Edit Order' : 'Create Order'}</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Customer *</label>
            <select
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              required
            >
              <option value="">Select Customer</option>
              {customers.map(customer => (
                <option key={customer._id} value={customer._id}>
                  {customer.name} {customer.email ? `(${customer.email})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label>Items *</label>
              <button type="button" className="btn btn-secondary" onClick={addItem} style={{ padding: '5px 15px', fontSize: '12px' }}>
                Add Item
              </button>
            </div>
            {formData.items.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                <select
                  value={item.product}
                  onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                  required
                  style={{ flex: 2 }}
                >
                  <option value="">Select Product</option>
                  {products.map(product => (
                    <option key={product._id} value={product._id}>
                      {product.name} - ${product.price?.toFixed(2)} (Stock: {product.stock})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                  required
                  style={{ width: '100px' }}
                  placeholder="Qty"
                />
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeItem(index)}
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tax</label>
              <input
                type="number"
                step="0.01"
                name="tax"
                value={formData.tax}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Discount</label>
              <input
                type="number"
                step="0.01"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                <option value="cash">Cash</option>
                <option value="credit_card">Credit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="form-group">
              <label>Payment Status</label>
              <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : order ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;
