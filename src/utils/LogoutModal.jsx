import { useNavigate } from "react-router-dom";
import { useSiteContext } from "../context/UserContext";
import Parse from "../api/ApiCOnfig";
import { Box, Button, Modal, Typography } from "@mui/material";
import { theme } from "../components/mui/theme";

export const LogoutModal = ({ open, setOpen }) => {
	const navigate = useNavigate();
	const { setUserData, setAlertMessage, setAlertSeverity, handleAlertOpen } =
		useSiteContext();
	const handleClose = () => setOpen(false);
	const handleLogout = () => {
		userLogout();
		handleClose();
	};

	const userLogout = async () => {
		try {
			await Parse.User.logOut().then(() => {
				setUserData({});
				navigate("/");

				setAlertMessage("Logged out successfully");
				setAlertSeverity("success");
				handleAlertOpen();
			});
		} catch (error) {
			console.error("Error logging out user:", error);
		}
	};
	return (
		<>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description">
				<Box sx={style}>
					<Box
						sx={{
							background: theme.palette.primary.main,
							mt: -4,
							mr: -4,
							ml: -4,
							p: 4,
						}}>
						<Typography
							color="white"
							variant="h1"
							component="h2"
							sx={{ fontSize: "30px" }}>
							Are you sure?
						</Typography>
					</Box>
					<Typography align="center" sx={{ mt: 2 }}>
						Are you sure you want to leave? you can't purchase without being
						logged in
					</Typography>

					<Box mt={4} sx={{ display: "flex", gap: 2 }}>
						<Button
							fullWidth
							variant="contained"
							sx={{ height: "50px" }}
							onClick={handleClose}>
							Never mind
						</Button>
						<Button
							fullWidth
							variant="outlined"
							sx={{
								height: "50px",
								fontWeight: 600,
								display: "flex",
								justifyContent: "center",
							}}
							onClick={handleLogout}>
							Logout
						</Button>
					</Box>
				</Box>
			</Modal>
		</>
	);
};

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	boxShadow: 24,
	p: 4,
};
