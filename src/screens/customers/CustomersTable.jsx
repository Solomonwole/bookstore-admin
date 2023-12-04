import React, { useEffect, useState } from "react";
import {
	DataGrid,
	GridToolbarContainer,
	GridToolbarColumnsButton,
	GridToolbarFilterButton,
} from "@mui/x-data-grid";
import Parse from "parse";
import { formatDateString } from "../../utils/constants/FormattedDate";

const CustomersTable = () => {
	const [customers, setCustomers] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const customerQuery = new Parse.Query(Parse.User);
				customerQuery.equalTo("admin", false);
				const results = await customerQuery.find();

				const mapped = results.map((order) => order.toJSON());
				setCustomers(mapped);
			} catch (error) {
				console.error("Error fetching orders:", error);
			}
		};

		fetchOrders();
	}, []);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	console.log(customers);
	return (
		<div style={{ width: "100%" }}>
			<DataGrid
				rows={customers.map((customer) => ({
					...customer.attributes,
					id: customer.objectId,
					date: formatDateString(customer.createdAt),
					email: customer.username,
					emailVerified: customer.emailVerified === true ? "Yes" : "No",
					firstName: customer.firstName,
					lastName: customer.lastName,
				}))}
				columns={columns}
				pageSize={rowsPerPage}
				page={page}
				pagination
				components={{
					Toolbar: CustomToolbar,
				}}
				rowCount={customers.length}
				onPageChange={handleChangePage}
				onPageSizeChange={handleChangeRowsPerPage}
				pageSizeOptions={[20, 35, 50]}
				disableRowSelectionOnClick
			/>
		</div>
	);
};

const CustomToolbar = () => {
	return (
		<GridToolbarContainer>
			<GridToolbarColumnsButton />
			<GridToolbarFilterButton />
		</GridToolbarContainer>
	);
};

const columns = [
	{
		field: "date",
		headerName: "JOINED",
		width: 170,
	},
	{
		field: "email",
		headerName: "EMAIL",
		width: 250,
	},
	{
		field: "emailVerified",
		headerName: "EMAIL VERIFIED",
		width: 170,
	},
	{
		field: "firstName",
		headerName: "FIRST NAME",
		width: 170,
	},
	{
		field: "lastName",
		headerName: "LAST NAME",
		width: 170,
	},
];

export default CustomersTable;
