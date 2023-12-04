import React, { useEffect, useState } from "react";
import {
	DataGrid,
	GridToolbarContainer,
	GridToolbarColumnsButton,
	GridToolbarFilterButton,
} from "@mui/x-data-grid";
import Parse from "parse";
import { formatDateString } from "../../utils/constants/FormattedDate";

const OrdersTable = () => {
	const [orders, setOrders] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const Orders = Parse.Object.extend("OrderItems");
				const query = new Parse.Query(Orders);
				const results = await query.find();

				const mapped = results.map((order) => order.toJSON());
				setOrders(mapped);
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

	console.log(orders);
	return (
		<div style={{ width: "100%" }}>
			<DataGrid
				rows={orders.map((order) => ({
					...order.attributes,
					id: order.objectId,
					date: formatDateString(order.createdAt),
					productTitle: order.product.productTitle,
					amount: `$${order.product.productPrice}`,
					author: order.product.productAuthor,
					category: order.product.productCategory,
					status: order.status === "completed" ? "Completed" : "Pending",
				}))}
				columns={columns}
				pageSize={rowsPerPage}
				page={page}
				pagination
				components={{
					Toolbar: CustomToolbar,
				}}
				rowCount={orders.length}
				onPageChange={handleChangePage}
				onPageSizeChange={handleChangeRowsPerPage}
				disableRowSelectionOnClick
				pageSizeOptions={[20, 35, 50]}
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
	{ field: "id", headerName: "BOOK ID", width: 170 },
	{
		field: "date",
		headerName: "DATE",
		width: 170,
	},
	{
		field: "productTitle",
		headerName: "TITLE",
		width: 250,
	},
	{
		field: "amount",
		headerName: "AMOUNT",
		width: 170,
	},
	{
		field: "author",
		headerName: "AUTHOR",
		width: 170,
	},
	{
		field: "category",
		headerName: "CATEGORY",
		width: 170,
	},
	{
		field: "status",
		headerName: "STATUS",
		width: 170,
	},
];

export default OrdersTable;
