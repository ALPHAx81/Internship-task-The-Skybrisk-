import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FiBox, FiAlertTriangle, FiPackage } from 'react-icons/fi';
import './Inventory.css';

const Inventory = () => {
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);

  useEffect(() => {
    fetchInventory();
  }, [lowStockThreshold]);

  const fetchInventory = async () => {
    try {
      const response = await api.get(`/api/inventory?lowStock=${lowStockThreshold}`);
      setInventory(response.data.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId, operation, value) => {
    try {
      await api.put(`/api/inventory/${productId}/stock`, {
        stock: value,
        operation
      });
      fetchInventory();
    } catch (error) {
      alert('Error updating stock: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <h1>Inventory Management</h1>

      <div className="inventory-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e3f2fd' }}>
            <FiPackage style={{ color: '#2196f3' }} />
          </div>
          <div className="stat-info">
            <h3>{inventory?.totalProducts || 0}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fff3cd' }}>
            <FiAlertTriangle style={{ color: '#ffc107' }} />
          </div>
          <div className="stat-info">
            <h3>{inventory?.lowStockCount || 0}</h3>
            <p>Low Stock Items</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f8d7da' }}>
            <FiBox style={{ color: '#dc3545' }} />
          </div>
          <div className="stat-info">
            <h3>{inventory?.outOfStockCount || 0}</h3>
            <p>Out of Stock</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1e7dd' }}>
            <FiPackage style={{ color: '#198754' }} />
          </div>
          <div className="stat-info">
            <h3>${inventory?.totalValue?.toFixed(2) || '0.00'}</h3>
            <p>Total Inventory Value</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label>Low Stock Threshold:</label>
        <input
          type="number"
          value={lowStockThreshold}
          onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 10)}
          min="1"
          style={{ padding: '5px', width: '100px', border: '1px solid #ddd', borderRadius: '5px' }}
        />
      </div>

      {inventory?.lowStockProducts && inventory.lowStockProducts.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2>Low Stock Products</h2>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Current Stock</th>
                  <th>Threshold</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.lowStockProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>{product.stock}</td>
                    <td>{product.minStock}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        placeholder="Add stock"
                        style={{ width: '100px', padding: '5px', marginRight: '5px' }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const value = parseInt(e.target.value);
                            if (value > 0) {
                              updateStock(product.id, 'add', value);
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          const value = prompt('Enter quantity to add:');
                          if (value && parseInt(value) > 0) {
                            updateStock(product.id, 'add', parseInt(value));
                          }
                        }}
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        Add Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {inventory?.outOfStockProducts && inventory.outOfStockProducts.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2>Out of Stock Products</h2>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.outOfStockProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        placeholder="Add stock"
                        style={{ width: '100px', padding: '5px', marginRight: '5px' }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const value = parseInt(e.target.value);
                            if (value > 0) {
                              updateStock(product.id, 'add', value);
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          const value = prompt('Enter quantity to add:');
                          if (value && parseInt(value) > 0) {
                            updateStock(product.id, 'add', parseInt(value));
                          }
                        }}
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        Add Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
