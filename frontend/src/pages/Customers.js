import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import CustomerModal from '../components/CustomerModal';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, [searchTerm]);

  const fetchCustomers = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;

      const response = await api.get('/api/customers', { params });
      setCustomers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCustomer(null);
    setShowModal(true);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      await api.delete(`/api/customers/${id}`);
      fetchCustomers();
    } catch (error) {
      alert('Error deleting customer: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingCustomer(null);
    fetchCustomers();
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Customers</h2>
          <button className="btn btn-primary" onClick={handleCreate}>
            <FiPlus /> Add Customer
          </button>
        </div>

        <div style={{ marginBottom: '20px', position: 'relative' }}>
          <FiSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', maxWidth: '400px', padding: '10px 10px 10px 35px', border: '1px solid #ddd', borderRadius: '5px' }}
          />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Type</th>
                <th>Total Orders</th>
                <th>Total Spent</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer._id}>
                    <td>{customer.name}</td>
                    <td>{customer.email || 'N/A'}</td>
                    <td>{customer.phone || 'N/A'}</td>
                    <td>{customer.company || 'N/A'}</td>
                    <td>{customer.customerType || 'individual'}</td>
                    <td>{customer.totalOrders || 0}</td>
                    <td>${customer.totalSpent?.toFixed(2) || '0.00'}</td>
                    <td>
                      <span className={`status-badge status-${customer.status}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleEdit(customer)}
                        style={{ marginRight: '5px', padding: '5px 10px', fontSize: '12px' }}
                      >
                        <FiEdit /> Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(customer._id)}
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
        <CustomerModal
          customer={editingCustomer}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Customers;
