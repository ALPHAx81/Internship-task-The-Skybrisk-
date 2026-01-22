# Quick Start Guide

## Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

## Step 1: Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/erp_system
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

Start MongoDB, then:
```bash
npm run dev
```

## Step 2: Frontend Setup

Open a new terminal:
```bash
cd frontend
npm install
npm start
```

## Step 3: Access the Application

1. Open http://localhost:3000
2. Register a new account
3. Start using the ERP system!

## Default Roles

- **Admin**: Full access (create first admin via database or modify registration)
- **Manager**: Can manage products, customers, orders, view users
- **Employee**: Can create/edit products, customers, orders
- **Viewer**: Read-only access

## Features Available

✅ User Authentication (Login/Register)
✅ Dashboard with statistics
✅ Product Management (CRUD)
✅ Customer Management (CRUD)
✅ Order Management (CRUD)
✅ Inventory Tracking
✅ User Management (Admin/Manager only)
✅ Role-Based Access Control
✅ Responsive Design
