import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import reportWebVitals from './reportWebVitals';
import ProductList from './ProductList/ProductList';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationBar from './NavigationBar/NavigationBar';
import Login from './Login/Login';
import Cart from './Cart/Cart';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import { AuthProvider } from './AuthContext/AuthContext';
import Logout from './Logout/Logout';
import AccessDenied from './AccessDenied/AccessDenied';
import AdminRoute from './AdminRoute/AdminRoute';
import AdminPanel from './AdminPanel/AdminPanel';
import ProductManagementPanel from './AdminPanel/ProductManagementPanel/ProductManagementPanel';
import NewProductForm from './NewProductForm/NewProductForm';
import AddressList from './AddressList/AddressList';
import NewAddressForm from './AddressList/NewAddressForm/NewAddressForm';
import SelectAddress from './SelectAddress/SelectAddress';
import OrderSummary from './OrderSummary/OrderSummary';
import DeliveryMethodManagementPanel from './AdminPanel/DeliveryMethodManagementPanel/DeliveryMethodManagementPanel';
import NewDeliveryMethodethodForm from './AdminPanel/DeliveryMethodManagementPanel/NewDeliveryMethodForm/NewDeliveryMethodForm';
import OrderSuccess from './OrderSummary/OrderSuccess/OrderSuccess';
import { SnackbarProvider } from 'notistack';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SnackbarProvider maxSnack={2}>
          <Routes>
            <Route path="/" element={<NavigationBar />}>
              <Route index element={<ProductList />} />
              <Route path="login" element={<Login />} />
              <Route path="logout" element={<Logout />} />
              <Route element={<ProtectedRoute />}>
                <Route path="cart" element={<Cart />} />
                <Route path="addresses" element={<AddressList />} />
                <Route path="addresses/new-address-form" element={<NewAddressForm />} />
                <Route path="select-address" element={<SelectAddress />} />
                <Route path="order-summary" element={<OrderSummary />} />
              </Route>
              <Route path="access-denied" element={<AccessDenied />} />
              <Route element={<AdminRoute />}>
                <Route path="admin-panel" element={<AdminPanel />} />
                <Route path="admin-panel/product-management-panel" element={<ProductManagementPanel />} />
                <Route path="admin-panel/product-management-panel/new-product" element={<NewProductForm />} />
                <Route path="admin-panel/delivery-method-management-panel" element={<DeliveryMethodManagementPanel />} />
                <Route path="admin-panel/delivery-method-management-panel/new-method" element={<NewDeliveryMethodethodForm />} />
              </Route>
              <Route path="success" element={<OrderSuccess />} />
            </Route>
          </Routes>
        </SnackbarProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
