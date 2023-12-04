import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../utils/protectedRoute/ProtectedRoute";
import LoginPage from "../auth/LoginPage";
import Products from "../screens/products/Products";
import Dashboard from "../screens/dashboard/Dashboard";
import Orders from "../screens/orders/Orders";
import Customers from "../screens/customers/Customers";
import AddProducts from "../screens/products/components/AddProducts";
import EditProduct from "../screens/products/components/EditProduct";

function RouterPage() {
	return (
		<Router>
			<Routes>
				<Route exact path="/" element={<LoginPage />} />

				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/products"
					element={
						<ProtectedRoute>
							<Products />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/products/add"
					element={
						<ProtectedRoute>
							<AddProducts />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/products/edit/:id"
					element={
						<ProtectedRoute>
							<EditProduct />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/orders"
					element={
						<ProtectedRoute>
							<Orders />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/customers"
					element={
						<ProtectedRoute>
							<Customers />
						</ProtectedRoute>
					}
				/>

				<Route exact path="*" element={<LoginPage />} />
			</Routes>
		</Router>
	);
}

export default RouterPage;
