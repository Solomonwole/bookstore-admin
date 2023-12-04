import React from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import CustomersTable from "./CustomersTable";

function Customers() {
	return (
		<>
			<DashboardLayout pageTitle="Customers">
				<CustomersTable />
			</DashboardLayout>
		</>
	);
}

export default Customers;
