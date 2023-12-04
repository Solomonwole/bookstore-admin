import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import { useSiteContext } from "../../context/UserContext";
import { SearchIcon } from "../../assets/Svgs";
import { IoAddOutline } from "react-icons/io5";
import ProductsTable from "./components/ProductsTable";
import Parse from "../../api/ApiCOnfig";
import { Link } from "react-router-dom";
import { BiSolidTrashAlt } from "react-icons/bi";

function Products() {
	const {
		searchText,
		setSearchText,
		setAlertMessage,
		setAlertSeverity,
		handleAlertOpen,
	} = useSiteContext();
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [fetchingProducts, setFetchingProducts] = useState(true);
	const [selectedItems, setSelectedItems] = useState([]);
	const [deleting, setDeleting] = useState(false);

	const fetchProducts = async () => {
		try {
			const Product = Parse.Object.extend("Products");
			const query = new Parse.Query(Product);

			// Order by updatedAt in descending order to get the latest products first
			query.descending("updatedAt");

			const results = await query.find();

			const productsData = results.map((product) => product.toJSON());

			setProducts(productsData);
			setFilteredProducts(productsData);

			// const uniqueCategories = [
			// 	...new Set(productsData.map((product) => product.productCategory)),
			// ];
			// setCategories(uniqueCategories);
			setFetchingProducts(false);
		} catch (error) {
			console.error("Error fetching products:", error);
			setFetchingProducts(false);
		}
	};
	useEffect(() => {
		fetchProducts();
	}, [setFilteredProducts, setProducts]);

	useEffect(() => {
		const handleSearch = () => {
			const searchTerm = searchText.toLowerCase();
			if (searchTerm === "") {
				setFilteredProducts(products);
			} else {
				const filtered = products.filter(
					(product) =>
						product.productTitle.toLowerCase().includes(searchTerm) ||
						product.productCategory.toLowerCase().includes(searchTerm) ||
						product.productAuthor.toLowerCase().includes(searchTerm) ||
						product.objectId.toLowerCase().includes(searchTerm)
				);
				setFilteredProducts(filtered);
			}
		};

		handleSearch();
	}, [products, searchText, setFilteredProducts]);

	const handleDeleteSelected = async () => {
		setDeleting(true);
		try {
			// Make a Parse query to find all selected products
			const query = new Parse.Query("Products");
			const selectedProducts = await query
				.containedIn("objectId", selectedItems)
				.find();

			// Delete each selected product
			await Parse.Object.destroyAll(selectedProducts);

			// Update the state and fetch the updated product list
			setFilteredProducts((prevProducts) =>
				prevProducts.filter(
					(product) => !selectedItems.includes(product.objectId)
				)
			);
			fetchProducts();

			// Clear the selected items
			setSelectedItems([]);
			setAlertMessage("Deleted Successfully");
			setAlertSeverity("success");
			handleAlertOpen();
			setDeleting(false);
		} catch (error) {
			console.error("Error deleting selected products:", error);
			setAlertMessage(error.message);
			setAlertSeverity("error");
			handleAlertOpen();
			setDeleting(false);
		}
	};

	const handleDelete = async (objectId) => {
		try {
			// Make a Parse query to find the product by objectId
			const query = new Parse.Query("Products");
			const productToDelete = await query.get(objectId);

			// Delete the product
			await productToDelete.destroy();

			// Update the state and fetch the updated product list
			setFilteredProducts((prevProducts) =>
				prevProducts.filter((product) => product.objectId !== objectId)
			);
			fetchProducts();
			setAlertMessage("Deleted Successfully");
			setAlertSeverity("success");
			handleAlertOpen();
		} catch (error) {
			console.error("Error deleting product:", error);
			setAlertMessage(error.message);
			setAlertSeverity("error");
			handleAlertOpen();
		}
	};

	return (
		<>
			<DashboardLayout pageTitle="Products">
				<Box
					sx={{
						display: "flex",
						flexDirection: { xs: "column", md: "row" },
						gap: 3,
						justifyContent: { md: "end" },
					}}>
					<TextField
						placeholder="Search books..."
						variant="outlined"
						sx={{
							display: { md: "none" },
							width: "100%",
							border: "none",
							"&:hover": {
								border: "none",
							},
						}}
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<SearchIcon />
								</InputAdornment>
							),
							style: {
								borderRadius: "10px",
							},
						}}
					/>
					<Box
						sx={{
							display: "flex",
							flexDirection: { xs: "column-reverse", md: "row" },
							gap: 3,
						}}>
						{selectedItems.length > 0 && (
							<>
								{deleting ? (
									<Button
										variant="outlined"
										sx={{ height: "50px", width: { xs: "100%", md: "100%" } }}>
										<BiSolidTrashAlt size={20} /> &nbsp; Deleting...{" "}
										{selectedItems.length}{" "}
										{selectedItems.length > 1 ? "Books" : "Book"}
									</Button>
								) : (
									<Button
										variant="outlined"
										onClick={handleDeleteSelected}
										sx={{ height: "50px", width: { xs: "100%", md: "100%" } }}>
										<BiSolidTrashAlt size={20} /> &nbsp; Delete{" "}
										{selectedItems.length}{" "}
										{selectedItems.length > 1 ? "Books" : "Book"}
									</Button>
								)}
							</>
						)}
						<Link to="/products/add">
							<Button
								variant="contained"
								fullWidth
								sx={{
									height: "50px",
									width: { xs: "100%", md: "100%" },
								}}>
								<IoAddOutline size={25} /> &nbsp; Add Product
							</Button>
						</Link>
					</Box>
				</Box>

				<Box mt={5}>
					<ProductsTable
						products={products}
						fetchingProducts={fetchingProducts}
						filteredProducts={filteredProducts}
						setFilteredProducts={setFilteredProducts}
						selectedItems={selectedItems}
						setSelectedItems={setSelectedItems}
						handleDelete={handleDelete}
					/>
				</Box>
			</DashboardLayout>
		</>
	);
}

export default Products;
