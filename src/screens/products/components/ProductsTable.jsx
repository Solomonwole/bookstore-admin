import React, { useState } from "react";
import {
	Checkbox,
	IconButton,
	Menu,
	MenuItem,
	Paper,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TableSortLabel,
	Typography,
} from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const columns = [
	{ id: "number", label: "", minWidth: 20 },
	{ id: "id", label: "PRODUCT ID", minWidth: 170 },
	{ id: "title", label: "PRODUCT TITLE", minWidth: 200 },
	{ id: "author", label: "PRODUCT AUTHOR", minWidth: 200 },
	{ id: "price", label: "PRODUCT PRICE", minWidth: 200 },
	{ id: "category", label: "PRODUCT CATEGORY", minWidth: 240 },
	{ id: "action", label: "ACTION", minWidth: 100 },
];

const ProductsTable = ({
	products,
	fetchingProducts,
	filteredProducts,
	setFilteredProducts,
	selectedItems,
	setSelectedItems,
	handleDelete,
}) => {
	const navigate = useNavigate();
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const handleSelectAll = () => {
		if (selectedItems.length === filteredProducts.length) {
			// All items are currently selected, so unselect all
			setSelectedItems([]);
		} else {
			// Not all items are selected, so select all
			const allObjectIds = filteredProducts.map((product) => product.objectId);
			setSelectedItems(allObjectIds);
		}
	};

	const handleCheckboxChange = (objectId) => {
		const selectedIndex = selectedItems.indexOf(objectId);
		let newSelectedItems = [];

		if (selectedIndex === -1) {
			// Item not selected, add it to the array
			newSelectedItems = [...selectedItems, objectId];
		} else {
			// Item already selected, remove it from the array
			newSelectedItems = [
				...selectedItems.slice(0, selectedIndex),
				...selectedItems.slice(selectedIndex + 1),
			];
		}

		setSelectedItems(newSelectedItems);
	};

	return (
		<Paper sx={{ width: "100%" }}>
			<TableContainer>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							<TableCell>
								<Checkbox
									indeterminate={
										selectedItems.length > 0 &&
										selectedItems.length < filteredProducts.length
									}
									checked={selectedItems.length === filteredProducts.length}
									onChange={handleSelectAll}
								/>
							</TableCell>
							{columns.map((column) => (
								<TableCell
									key={column.id}
									align="left"
									style={{ minWidth: column.minWidth }}>
									<TableSortLabel>{column.label}</TableSortLabel>
								</TableCell>
							))}
						</TableRow>
					</TableHead>

					{fetchingProducts ? (
						<TableBody>
							{rows
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((index) => {
									return (
										<TableRow hover role="checkbox" tabIndex={-1}>
											<TableCell>
												<Skeleton variant="text" sx={{ fontSize: "1rem" }} />
											</TableCell>
											<TableCell>
												<Skeleton variant="text" sx={{ fontSize: "1rem" }} />
											</TableCell>
											<TableCell sx={{ textTransform: "uppercase" }}>
												<Skeleton variant="text" sx={{ fontSize: "1rem" }} />
											</TableCell>
											<TableCell>
												<Skeleton variant="text" sx={{ fontSize: "1rem" }} />
											</TableCell>
											<TableCell>
												<Skeleton variant="text" sx={{ fontSize: "1rem" }} />
											</TableCell>
											<TableCell>
												<Skeleton variant="text" sx={{ fontSize: "1rem" }} />
											</TableCell>
											<TableCell>
												<Skeleton variant="text" sx={{ fontSize: "1rem" }} />
											</TableCell>
										</TableRow>
									);
								})}
						</TableBody>
					) : (
						<>
							{filteredProducts.length > 0 ? (
								<TableBody>
									{products
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((product, index) => {
											const isSelected = selectedItems.includes(
												product.objectId
											);
											return (
												<TableRow
													hover
													role="checkbox"
													tabIndex={-1}
													key={product.objectId}
													selected={isSelected}>
													<TableCell>
														<Checkbox
															checked={isSelected}
															onChange={() =>
																handleCheckboxChange(product.objectId)
															}
														/>
													</TableCell>
													<TableCell>{index + 1}</TableCell>
													<TableCell
														align="left"
														sx={{ textTransform: "uppercase" }}>
														{product.objectId}
													</TableCell>
													<TableCell align="left">
														{product.productTitle}
													</TableCell>
													<TableCell align="left">
														{product.productAuthor}
													</TableCell>
													<TableCell align="left">
														${product.productPrice}
													</TableCell>
													<TableCell align="left">
														{product.productCategory}
													</TableCell>
													<TableCell align="left">
														<IconButton
															id="basic-button"
															aria-controls={open ? "basic-menu" : undefined}
															aria-haspopup="true"
															aria-expanded={open ? "true" : undefined}
															onClick={handleClick}>
															<BsThreeDotsVertical />
														</IconButton>

														<Menu
															id="basic-menu"
															anchorEl={anchorEl}
															open={open}
															onClose={handleClose}
															MenuListProps={{
																"aria-labelledby": "basic-button",
															}}>
															<MenuItem
																onClick={() => {
																	navigate(
																		`/products/edit/${product.objectId}`
																	);
																	handleClose();
																}}>
																Edit
															</MenuItem>

															<MenuItem
																onClick={() => {
																	handleDelete(product.objectId);
																	handleClose();
																}}
																sx={{ color: "#f00" }}>
																Delete
															</MenuItem>
														</Menu>
													</TableCell>
												</TableRow>
											);
										})}
								</TableBody>
							) : (
								<TableBody>
									<TableRow hover role="checkbox" tabIndex={-1}>
										<TableCell colSpan={8}>
											<Typography
												sx={{ textAlign: { xs: "left", md: "center" } }}>
												You haven&apos;t made any purchase
											</Typography>
										</TableCell>
									</TableRow>
								</TableBody>
							)}
						</>
					)}
				</Table>
			</TableContainer>
			{!fetchingProducts && products.length > 0 && (
				<TablePagination
					rowsPerPageOptions={[10, 15, 20]}
					component="div"
					count={products.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			)}
		</Paper>
	);
};

export default ProductsTable;

const rows = Array.from({ length: 10 }, () => ({}));
