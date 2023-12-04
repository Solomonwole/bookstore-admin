import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	Typography,
	TextField,
	Button,
	Box,
	Stack,
	InputAdornment,
	Autocomplete,
} from "@mui/material";
import Parse from "parse";
import DashboardLayout from "../../../layout/DashboardLayout";
import { bookCategories } from "./AddProducts";
import { theme } from "../../../components/mui/theme";
import { SlCloudUpload } from "react-icons/sl";
import { AttachmentUploadComponent } from "./AttachmentUploadComponent";
import Preloader from "../../../utils/constants/Preloader";
import { useSiteContext } from "../../../context/UserContext";

const EditProduct = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { setAlertMessage, setAlertSeverity, handleAlertOpen } =
		useSiteContext();
	const [product, setProduct] = useState({
		productTitle: "",
		productAuthor: "",
		productPrice: 0,
		productCategory: "",
		productDescription: "",
	});
	const [formComplete, setFormComplete] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const fileInputRef = useRef(null);
	const [loading, setLoading] = useState(false);

	const [selectedFile, setSelectedFile] = useState({
		name: "",
	});

	const handleCategoryChange = (_, newValue) => {
		setProduct({
			...product,
			productCategory: newValue,
		});
	};

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const query = new Parse.Query("Products");
				const result = await query.get(id);

				const {
					productTitle,
					productAuthor,
					productPrice,
					productCategory,
					productDescription,
					productImage,
					productFile,
				} = result.toJSON();
				setProduct({
					productTitle,
					productAuthor,
					productPrice,
					productCategory,
					productDescription,
				});

				setSelectedFile(productFile);
				setSelectedImage(productImage);

				console.log(result.toJSON());
			} catch (error) {
				console.error("Error fetching product:", error);
			}
		};

		fetchProduct();
	}, [id]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setProduct((prevProduct) => ({
			...prevProduct,
			[name]: value,
		}));
	};

	// Image functions

	const handleImageSelect = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();

			reader.onload = (e) => {
				setSelectedImage(e.target.result);
			};

			reader.readAsDataURL(file);
		}
	};

	const handleImageDrop = (event) => {
		event.preventDefault();
		const file = event.dataTransfer.files[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = (e) => {
				setSelectedImage(e.target.result);
			};

			reader.readAsDataURL(file);
		}
	};

	const handleDragOver = (event) => {
		event.preventDefault();
	};

	const handleBoxClick = () => {
		// Trigger the file input click
		fileInputRef.current.click();
	};

	// File Functions

	const handleAttachmentUpload = (file) => {
		setSelectedFile(file);
	};

	useEffect(() => {
		if (
			product.productTitle &&
			product.productPrice &&
			product.productDescription &&
			product.productCategory &&
			product.productAuthor &&
			selectedFile &&
			selectedImage
		) {
			setFormComplete(true);
		} else {
			setFormComplete(false);
		}
	}, [
		product.productAuthor,
		product.productCategory,
		product.productDescription,
		product.productPrice,
		product.productTitle,
		selectedFile,
		selectedImage,
	]);

	const handleUpdateProduct = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const query = new Parse.Query("Products");
			const productToUpdate = await query.get(id);

			// Update product fields
			productToUpdate.set("productTitle", product.productTitle);
			productToUpdate.set("productAuthor", product.productAuthor);
			productToUpdate.set("productPrice", product.productPrice);
			productToUpdate.set("productCategory", product.productCategory);
			productToUpdate.set("productDescription", product.productDescription);

			// Save the updated product
			await productToUpdate.save();

			setAlertMessage("Successfully Added");
			setAlertSeverity("success");
			handleAlertOpen();
			navigate("/products");
			console.log("Product updated successfully!");
			setLoading(false);
		} catch (error) {
			console.error("Error updating product:", error);
			setAlertMessage(error.message);
			setAlertSeverity("error");
			handleAlertOpen();
			setLoading(false);
		}
	};

	return (
		<>
			<DashboardLayout pageTitle="Edit Product">
				<Box
					mt={3}
					mb={3}
					sx={{
						width: "100%",
						height: "250px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}>
					{selectedImage && (
						<img
							src={selectedImage.url}
							alt=""
							style={{
								maxWidth: "100%",
								maxHeight: "100%",
								objectFit: "contain",
								cursor: "pointer",
							}}
						/>
					)}
				</Box>
				<Box component="form" onSubmit={handleUpdateProduct}>
					<Stack spacing={5}>
						{/* Title  */}
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
								alignItems: "center",
								gap: 2,
							}}>
							<Typography>Book Title:</Typography>
							<TextField
								type="text"
								fullWidth
								placeholder="Enter book title.."
								name="productTitle"
								value={product.productTitle}
								onChange={handleInputChange}
								required
							/>
						</Box>

						{/* Author  */}
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
								alignItems: "center",
								gap: 2,
							}}>
							<Typography>Book Author:</Typography>
							<TextField
								type="text"
								fullWidth
								placeholder="Enter book author.."
								name="productAuthor"
								value={product.productAuthor}
								onChange={handleInputChange}
								required
							/>
						</Box>

						{/* Price  */}
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
								alignItems: "center",
								gap: 2,
							}}>
							<Typography>Book Price:</Typography>
							<TextField
								type="number"
								fullWidth
								placeholder="Enter book author.."
								name="productPrice"
								value={product.productPrice}
								onChange={handleInputChange}
								required
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">$</InputAdornment>
									),
								}}
							/>
						</Box>

						{/* Category  */}
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
								alignItems: "center",
								gap: 2,
							}}>
							<Typography>Book Category:</Typography>
							{/* <TextField
								type="number"
								fullWidth
								placeholder="Enter book author.."
								name="productPrice"
								value={product.productPrice}
								onChange={handleInputChange}
								required
							/> */}
							<Autocomplete
								fullWidth
								options={bookCategories}
								value={product.productCategory}
								onChange={handleCategoryChange}
								autoHighlight
								getOptionLabel={(option) => option}
								renderOption={(props, option) => (
									<Box
										component="li"
										sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
										{...props}>
										{option}
									</Box>
								)}
								renderInput={(params) => (
									<TextField
										{...params}
										label="Select category"
										inputProps={{
											...params.inputProps,
											autoComplete: "new-password",
										}}
									/>
								)}
							/>
						</Box>

						{/* Description  */}
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
								alignItems: "center",
								gap: 2,
							}}>
							<Typography>Book Description:</Typography>
							<TextField
								type="text"
								rows={4}
								multiline
								fullWidth
								placeholder="Enter book description.."
								name="productDescription"
								value={product.productDescription}
								onChange={handleInputChange}
								required
							/>
						</Box>

						{/* Image  */}
						{/* <Box
							sx={{
								display: "grid",
								gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
								alignItems: "center",
								gap: 2,
							}}>
							<Typography>Book Cover Image:</Typography>
							<Box
								sx={{
                                    border: `1px dashed ${theme.palette.grey.dark}`,
									width: "100%",
									height: "250px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									cursor: "pointer",
								}}
								onDrop={handleImageDrop}
								onDragOver={handleDragOver}
								onClick={handleBoxClick}>
								<input
									type="file"
									ref={fileInputRef}
									onChange={handleImageSelect}
									style={{ display: "none" }}
									accept=".jpg, .jpeg, .webp, .png"
								/>
								{selectedImage ? (
									<>
										{selectedImage.url ? (
											<img
												src={selectedImage.url}
												alt="Selected"
												style={{
													maxWidth: "100%",
													maxHeight: "100%",
													objectFit: "contain",
													cursor: "pointer",
												}}
											/>
										) : (
											<img
												src={selectedImage}
												alt="Selected"
												style={{
													maxWidth: "100%",
													maxHeight: "100%",
													objectFit: "contain",
													cursor: "pointer",
												}}
											/>
										)}
									</>
								) : (
									<Box
										sx={{
											display: "flex",
											flexDirection: "column",
											flex: 1,
											height: "100%",
											justifyContent: "center",
											alignItems: "center",
											p: 2,
											gap: 1,
										}}>
										<SlCloudUpload
											size={30}
											color={theme.palette.primary.main}
										/>
										<Typography align="center" color="primary">
											Upload or Drag image here
										</Typography>
										<Typography
											variant="caption"
											color="grey"
											sx={{ fontStyle: "italic" }}
											align="center">
											(Only *.jpg, *.jpeg, *.webp and *.png image will be
											accepted)
										</Typography>
									</Box>
								)}
							</Box>
						</Box> */}

						{/* File  */}
						{/* <Box
							sx={{
								display: "grid",
								gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
								alignItems: "center",
								gap: 2,
							}}>
							<Typography>Upload Book File:</Typography>

							<AttachmentUploadComponent
								onFileUpload={handleAttachmentUpload}
								fileName={selectedFile.name}
							/>
						</Box> */}

						<Box>
							{loading ? (
								<Button
									type="button"
									variant="contained"
									fullWidth
									sx={{ height: "50px" }}>
									<Preloader />
								</Button>
							) : (
								<Button
									type="submit"
									variant="contained"
									fullWidth
									disabled={!formComplete}
									sx={{ height: "50px" }}>
									Submit
								</Button>
							)}
						</Box>
					</Stack>
				</Box>
			</DashboardLayout>
		</>
	);
};

export default EditProduct;
