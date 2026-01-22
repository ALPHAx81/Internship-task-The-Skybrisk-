import React from 'react';
import { FiX } from 'react-icons/fi';

const OrderViewModal = ({ order, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <h2>Order Details - {order.orderNumber}</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> {order.customer?.name || 'N/A'}</p>
          <p><strong>Email:</strong> {order.customer?.email || 'N/A'}</p>
          <p><strong>Phone:</strong> {order.customer?.phone || 'N/A'}</p>
          {order.customer?.company && <p><strong>Company:</strong> {order.customer.company}</p>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Order Items</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.product?.name || 'N/A'}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price?.toFixed(2) || '0.00'}</td>
                    <td>${item.subtotal?.toFixed(2) || '0.00'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Order Summary</h3>
          <p><strong>Subtotal:</strong> ${order.subtotal?.toFixed(2) || '0.00'}</p>
          <p><strong>Tax:</strong> ${order.tax?.toFixed(2) || '0.00'}</p>
          <p><strong>Discount:</strong> ${order.discount?.toFixed(2) || '0.00'}</p>
          <p><strong>Total:</strong> ${order.total?.toFixed(2) || '0.00'}</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Status</h3>
          <p><strong>Order Status:</strong> <span className={`status-badge status-${order.status}`}>{order.status}</span></p>
          <p><strong>Payment Status:</strong> <span className={`status-badge status-${order.paymentStatus}`}>{order.paymentStatus}</span></p>
          <p><strong>Payment Method:</strong> {order.paymentMethod || 'N/A'}</p>
        </div>

        {order.notes && (
          <div style={{ marginBottom: '20px' }}>
            <h3>Notes</h3>
            <p>{order.notes}</p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderViewModal;
