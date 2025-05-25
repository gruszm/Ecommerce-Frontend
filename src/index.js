import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import ProductList from './ProductList/ProductList';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationBar from './NavigationBar/NavigationBar';
import Login from './Login/Login';
import Cart from './Cart/Cart';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import { AuthProvider } from './AuthContext';
import Logout from './Logout/Logout';
import AccessDenied from './AccessDenied/AccessDenied';
import AdminRoute from './AdminRoute/AdminRoute';
import AdminPanel from './AdminPanel/AdminPanel';
import ProductManagementPanel from './ProductManagementPanel/ProductManagementPanel';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<NavigationBar />}>
            <Route index element={<ProductList />} />
            <Route path="login" element={<Login />} />
            <Route path="logout" element={<Logout />} />
            <Route element={<ProtectedRoute />}>
              <Route path="cart" element={<Cart />} />
            </Route>
            <Route path="access-denied" element={<AccessDenied />} />
            <Route element={<AdminRoute />}>
              <Route path="admin-panel" element={<AdminPanel />} />
              <Route path="admin-panel/product-management-panel" element={<ProductManagementPanel />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
