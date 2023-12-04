import React from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import OrdersTable from "./OrdersTable";

function Orders() {
	return (
		<>
			<DashboardLayout pageTitle="Orders">
				<OrdersTable />
			</DashboardLayout>
		</>
	);
}

export default Orders;
