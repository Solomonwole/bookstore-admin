import React, { useRef } from "react";
import { Box, Button, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { AiFillFileText } from "react-icons/ai";
import { theme } from "../../../components/mui/theme";
import { BsBook } from "react-icons/bs";
import { SlCloudUpload } from "react-icons/sl";

const supportedFileTypes = ["application/pdf", "application/msword"];

export const AttachmentUploadComponent = ({ onFileUpload, fileName }) => {
	const attachmentInputRef = useRef(null);

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file && supportedFileTypes.includes(file.type)) {
			onFileUpload(file);
			// eslint-disable-next-line no-undef
		} else {
			alert(
				"Unsupported file type. Please select a PDF, DOC, DOCX or TXT file."
			);
		}
	};
	const handleDragOver = (e) => {
		e.preventDefault();
	};

	const handleDrop = (e) => {
		e.preventDefault();
		const file = e.dataTransfer.files[0];
		if (file && supportedFileTypes.includes(file.type)) {
			onFileUpload(file);
		} else {
			alert(
				"Unsupported file type. Please select a PDF, DOC, DOCX, or TXT file."
			);
		}
	};

	return (
		<Box
			width="100%"
			height="66px"
			sx={{
				width: "100%",
				height: "250px",
				border: `1px dashed ${theme.palette.grey.dark}`,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				cursor: "pointer",
			}}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
			onClick={() => attachmentInputRef.current.click()}>
			<input
				type="file"
				ref={attachmentInputRef}
				style={{ display: "none" }}
				onChange={handleFileChange}
				accept=".pdf, .doc"
			/>

			{fileName ? (
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
					<BsBook size={30} color={theme.palette.primary.main} />

					<Typography align="center" color="primary">
						{fileName}
					</Typography>
				</Box>
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
					<SlCloudUpload size={30} color={theme.palette.primary.main} />
					<Typography align="center" color="primary">
						Upload or Drag file here
					</Typography>
					<Typography
						variant="caption"
						color="grey"
						sx={{ fontStyle: "italic" }}
						align="center">
						(Only *.png file will be accepted)
					</Typography>
				</Box>
			)}
		</Box>
	);
};

AttachmentUploadComponent.propTypes = {
	onFileUpload: PropTypes.any,
	fileName: PropTypes.string,
};
