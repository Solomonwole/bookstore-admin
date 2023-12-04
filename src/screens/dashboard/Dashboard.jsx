import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { Box, Stack, Typography } from "@mui/material";
import Parse from "../../api/ApiCOnfig";
import { theme } from "../../components/mui/theme";
import { RiInboxArchiveFill } from "react-icons/ri";
import { MdOutlineInventory } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { FaUsers } from "react-icons/fa";

function Dashboard() {
	const [totalProducts, setTotalProducts] = useState(0);
	const [totalOrders, setTotalOrders] = useState(0);
	const [totalRevenue, setTotalRevenue] = useState(0.0);
	const [totalCustomers, setTotalCustomers] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch total number of products
				const productQuery = new Parse.Query("Products");
				const products = await productQuery.count();
				setTotalProducts(products);

				// Fetch total number of orders
				const orderQuery = new Parse.Query("OrderItems");
				const orders = await orderQuery.count();
				setTotalOrders(orders);

				// Fetch total revenue
				const revenueQuery = new Parse.Query("OrderItems");
				const revenueItems = await revenueQuery.find();

				const productsList = revenueItems.map((product) => product.toJSON());

				let totalSum = 0;

				productsList.forEach((item) => {
					const productPrice = item.product.productPrice;
					totalSum += productPrice;
				});

				setTotalRevenue(totalSum.toFixed(2));

				// Fetch total number of customers (users with admin field set to false)
				const customerQuery = new Parse.Query(Parse.User);
				customerQuery.equalTo("admin", false);
				const customers = await customerQuery.count();
				setTotalCustomers(customers);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);
	return (
		<>
			<DashboardLayout pageTitle="Dashboard">
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" },
						gap: 3,
					}}>
					{/* Total Orders */}
					<TotalBox
						num={totalOrders}
						text="Number of Orders"
						icon={
							<RiInboxArchiveFill
								size={40}
								color={theme.palette.primary.main}
							/>
						}
					/>

					{/* Total Products */}
					<TotalBox
						num={totalProducts}
						text="Number of Products"
						icon={
							<MdOutlineInventory
								size={40}
								color={theme.palette.primary.main}
							/>
						}
					/>

					{/* Total Revenue */}
					<TotalBox
						num={`$${totalRevenue}`}
						text="Revenue"
						icon={<GiMoneyStack size={40} color={theme.palette.primary.main} />}
					/>

					{/* Total Customers */}
					<TotalBox
						num={totalCustomers}
						text="Number of Customers"
						icon={<FaUsers size={40} color={theme.palette.primary.main} />}
					/>
				</Box>
			</DashboardLayout>
		</>
	);
}

export default Dashboard;

const TotalBox = ({ text, num, icon }) => {
	return (
		<Box
			sx={{
				background: "#fff",
				p: 2,
				border: `1px dashed #FB625D2F`,
			}}>
			<Stack spacing={3} width="100%">
				<Typography variant="caption" color="grey">
					Total {text}
				</Typography>
				<Box sx={{ display: "flex", width: "100%" }}>
					<Typography sx={{ flex: 1 }} variant="h4">
						{num}
					</Typography>
					{icon}
				</Box>
			</Stack>
		</Box>
	);
};
