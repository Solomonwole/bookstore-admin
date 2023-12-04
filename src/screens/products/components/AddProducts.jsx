import React, { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../../layout/DashboardLayout";
import {
	Autocomplete,
	Box,
	Button,
	InputAdornment,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { SlCloudUpload } from "react-icons/sl";
import { theme } from "../../../components/mui/theme";
import Preloader from "../../../utils/constants/Preloader";
import Parse from "../../../api/ApiCOnfig";
import { useNavigate } from "react-router-dom";
import { useSiteContext } from "../../../context/UserContext";
import { AttachmentUploadComponent } from "./AttachmentUploadComponent";

function AddProducts() {
	const navigate = useNavigate();
	const { setAlertMessage, setAlertSeverity, handleAlertOpen } =
		useSiteContext();
	const [formData, setFormData] = useState({
		productTitle: "",
		productAuthor: "",
		productPrice: null,
		productCategory: "",
		productDescription: "",
	});

	const [formComplete, setFormComplete] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const fileInputRef = useRef(null);

	const [selectedFile, setSelectedFile] = useState({
		name: "",
	});

	const [loading, setLoading] = useState(false);

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleCategoryChange = (_, newValue) => {
		setFormData({
			...formData,
			productCategory: newValue,
		});
	};

	useEffect(() => {
		if (
			formData.productTitle &&
			formData.productPrice &&
			formData.productDescription &&
			formData.productCategory &&
			formData.productAuthor &&
			selectedFile.name &&
			selectedImage
		) {
			setFormComplete(true);
		} else {
			setFormComplete(false);
		}
	}, [
		formData.productAuthor,
		formData.productCategory,
		formData.productDescription,
		formData.productPrice,
		formData.productTitle,
		selectedFile,
		selectedImage,
	]);
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

	const handleAddProduct = async (e) => {
		e.preventDefault();
		setLoading(true);
		const sanitizedTitle = sanitizeFileName(formData.productTitle);

		try {
			let Product = new Parse.Object("Products");
			Product.set("productTitle", formData.productTitle);
			Product.set("productAuthor", formData.productAuthor);
			Product.set("productPrice", parseFloat(formData.productPrice));
			Product.set("productCategory", formData.productCategory);
			Product.set("productDescription", formData.productDescription);

			if (selectedImage) {
				// Check if selectedImage is a base64-encoded string or Blob
				const productImage = new Parse.File(sanitizedTitle, {
					base64: selectedImage,
				});
				Product.set("productImage", productImage);
			}

			if (selectedFile) {
				// Check if selectedFile is a valid file data
				const productFile = new Parse.File(sanitizedTitle, selectedFile);
				Product.set("productFile", productFile);
			}

			await Product.save();
			setAlertMessage("Successfully Added");
			setAlertSeverity("success");
			handleAlertOpen();
			navigate("/products");
		} catch (error) {
			console.error("Error adding product:", error);
			setAlertMessage(error.message);
			setAlertSeverity("error");
			handleAlertOpen();
		} finally {
			setLoading(false);
		}
	};

	console.log(selectedFile);
	return (
		<>
			<DashboardLayout pageTitle="Add Product">
				<Box component="form" onSubmit={handleAddProduct}>
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
								value={formData.productTitle}
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
								value={formData.productAuthor}
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
								value={formData.productPrice}
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
								value={formData.productPrice}
								onChange={handleInputChange}
								required
							/> */}
							<Autocomplete
								fullWidth
								options={bookCategories}
								value={formData.productCategory}
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
								value={formData.productDescription}
								onChange={handleInputChange}
								required
							/>
						</Box>

						{/* Image  */}
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
								alignItems: "center",
								gap: 2,
							}}>
							<Typography>Book Cover Image:</Typography>
							<Box
								sx={{
									width: "100%",
									height: "250px",
									border: `1px dashed ${theme.palette.grey.dark}`,
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
						</Box>

						{/* File  */}
						<Box
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
						</Box>

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
}

export default AddProducts;

const sanitizeFileName = (fileName) => {
	// Replace unsupported characters with underscores
	return fileName.replace(/[^a-z0-9_.]/gi, "_");
};

export const bookCategories = [
	"Fiction",
	"Non-Fiction",
	"Science Fiction",
	"Mystery",
	"Thriller",
	"Romance",
	"Fantasy",
	"Biography",
	"History",
	"Self-Help",
	"Science",
	"Poetry",
	"Cooking",
	"Travel",
	"Business",
	"Health",
	"Children's",
	"Young Adult",
	"Art",
	"Technology",
	"Tutorial",
	"General",
];
