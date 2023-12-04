import {
	AppBar,
	Avatar,
	Box,
	Container,
	Drawer,
	IconButton,
	InputAdornment,
	ListItem,
	Menu,
	MenuItem,
	Stack,
	TextField,
	Toolbar,
	Typography,
} from "@mui/material";
import React, { useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { FiMenu, FiSearch } from "react-icons/fi";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { useSiteContext } from "../context/UserContext";
import { GiBoxUnpacking } from "react-icons/gi";
import { MdOutlineInventory } from "react-icons/md";
import Parse from "../api/ApiCOnfig";
import { theme } from "../components/mui/theme";
import { Logo, SearchIcon } from "../assets/Svgs";
import { LogoutModal } from "../utils/LogoutModal";
// import NotificationModal from "./notifications/NotificationModal";
// import ModalPopup from "../../utils/modal/Modal";
// import Logo from "../../website/assets/logo.svg";

const drawerWidth = 266;

function DashboardLayout(props) {
	const navigate = useNavigate();
	const { window, pageTitle, children } = props;
	const [mobileOpen, setMobileOpen] = useState(false);
	const [userLogout, setUserLogout] = useState(false);
	const [logoutLoading, setLogoutLoading] = useState(false);
	const { userData, searchText, setSearchText } = useSiteContext();
	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = async () => {
		setLogoutLoading(true);
		try {
			await Parse.User.logOut();
			const currentUser = await Parse.User.current();
			if (currentUser === null) {
				localStorage.clear();
				navigate("/login");
				// setSuccess("Logged Out Successfully");
				setUserLogout(false);
				setLogoutLoading(false);
			}
		} catch (error) {
			// setError(`Error!: ${error.message}`);
			setLogoutLoading(false);
		}
	};
	const drawer = (
		<Box
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				background: theme.palette.secondary.main,
			}}>
			<Toolbar>
				<Box sx={{ height: "60px", width: "140px", marginTop: 2 }}>
					<Logo />
				</Box>
			</Toolbar>

			<Box
				mt={1}
				height="100%"
				flex={1}
				sx={{
					display: "flex",
					flexDirection: "column",
				}}>
				<Stack
					spacing={1}
					sx={{
						flex: 1,
						pl: 1,
						pr: 1,

						a: {
							color: theme.palette.grey.main,
							// background: theme.palette.primary.main,
							borderRadius: "10px",
							display: "flex",
							opacity: 0.7,
							height: "50px",
						},
						"a.active": {
							// background: theme.palette.secondary.main,
							color: theme.palette.primary.main,
							opacity: 1,
						},
					}}>
					<ListItem>
						<Typography variant="caption" color="grey">
							Navigation
						</Typography>
					</ListItem>

					<NavLink to="/dashboard">
						<ListItem>
							<Stack direction="row" alignItems="center" spacing={3}>
								<RxDashboard size={20} />
								<Typography>Dashboard</Typography>
							</Stack>
						</ListItem>
					</NavLink>

					<NavLink to="/products">
						<ListItem>
							<Stack direction="row" alignItems="center" spacing={3}>
								<MdOutlineInventory size={20} />
								<Typography>Products</Typography>
							</Stack>
						</ListItem>
					</NavLink>

					<NavLink to="/orders">
						<ListItem>
							<Stack direction="row" alignItems="center" spacing={3}>
								<GiBoxUnpacking size={20} />
								<Typography>Orders</Typography>
							</Stack>
						</ListItem>
					</NavLink>

					<NavLink to="/customers">
						<ListItem>
							<Stack direction="row" alignItems="center" spacing={3}>
								<FaUsers size={20} />
								<Typography>Customers</Typography>
							</Stack>
						</ListItem>
					</NavLink>

					{/* <NavLink to="/transfer">
						<ListItem>
							<Stack direction="row" alignItems="center" spacing={3}>
								<BiTransfer size={20} />
								<Typography>Transfer</Typography>
							</Stack>
						</ListItem>
					</NavLink> */}

					{/* <Stack>
						<ListItem>
							<Typography variant="caption" color="grey">
								Help
							</Typography>
						</ListItem>

						<NavLink to="/support">
							<ListItem>
								<Stack direction="row" alignItems="center" spacing={3}>
									<MdSupport size={20} />
									<Typography>Support</Typography>
								</Stack>
							</ListItem>
						</NavLink>

						<NavLink to="/contact">
							<ListItem>
								<Stack direction="row" alignItems="center" spacing={3}>
									<BiSupport size={20} />
									<Typography>Contact</Typography>
								</Stack>
							</ListItem>
						</NavLink>
					</Stack> */}

					{/* <Stack>
						<ListItem>
							<Typography variant="caption" color="grey">
								Account Security
							</Typography>
						</ListItem>

						<NavLink to="/settings">
							<ListItem>
								<Stack direction="row" alignItems="center" spacing={3}>
									<MdSupport size={20} />
									<Typography>Profile Settings</Typography>
								</Stack>
							</ListItem>
						</NavLink>
					</Stack> */}
				</Stack>

				{/* <Stack sx={{ pl: 1, pr: 1, mb: 2 }} onClick={() => {}}>
					<ListItem>
						<Typography variant="caption" color="grey">
							Navigation
						</Typography>
					</ListItem>
					<ListItem
						onClick={() => {
							setUserLogout(true);
							handleDrawerToggle();
						}}
						sx={{
							background: "transparent",
							color: theme.palette.grey.main,
							borderRadius: "10px",
							boxShadow: "none",
							height: "50px",
							cursor: "pointer",

							".icon": {
								color: theme.palette.grey.main,
							},

							"&:hover": {
								background: theme.palette.error.main,
								color: theme.palette.secondary.main,
								borderRadius: "10px",
								boxShadow: "none",

								".icon": {
									color: theme.palette.secondary.main,
								},
							},
						}}>
						<ListItemIcon>
							<IoLogOut size={20} className="icon" />
						</ListItemIcon>
						<ListItemText primary="Logout" />
					</ListItem>
				</Stack> */}
			</Box>
		</Box>
	);

	const container =
		window !== undefined ? () => window().document.body : undefined;

	return (
		<>
			<Box sx={{ display: "flex" }}>
				<AppBar
					position="fixed"
					elevation={0}
					sx={{
						width: { md: `calc(100% - ${drawerWidth}px)` },
						md: { sm: `${drawerWidth}px` },
						background: theme.palette.secondary.main,
					}}>
					<Toolbar>
						<Box
							sx={{
								width: "100%",
								display: "flex",
								alignItems: "center",
							}}>
							<Box flex={1} sx={{ display: "flex", alignItems: "center" }}>
								<IconButton
									color="inherit"
									aria-label="open drawer"
									edge="start"
									onClick={handleDrawerToggle}
									sx={{ mr: 2, display: { md: "none" } }}>
									<FiMenu size={30} color={theme.palette.grey.main} />
								</IconButton>
								<Typography
									variant="h3"
									noWrap
									component="div"
									color="primary"
									sx={{ display: { xs: "flex", md: "flex" } }}>
									{pageTitle}
								</Typography>
							</Box>

							<Stack direction="row" alignItems="center" spacing={2.5}>
								<TextField
									placeholder="Search books..."
									variant="outlined"
									sx={{
										display: { xs: "none", md: "flex" },
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

								{/* <NotificationModal /> */}
								<Stack
									direction="row"
									alignItems="center"
									spacing={1}
									id="basic-button"
									aria-controls={open ? "basic-menu" : undefined}
									aria-haspopup="true"
									aria-expanded={open ? "true" : undefined}
									onClick={handleClick}
									sx={{ cursor: "pointer" }}>
									{userData?.image ? (
										<Avatar
											sx={{
												bgcolor: theme.palette.primary.main,
												border: "2px solid #F6CE53",
											}}
											src={userData?.image}
										/>
									) : (
										<Avatar
											sx={{
												bgcolor: theme.palette.primary.main,
												border: "2px solid #F6CE53",
												textTransform: "uppercase",
											}}>
											{userData.firstName.charAt(0)}
											{userData.lastName.charAt(0)}
										</Avatar>
									)}

									<Stack
										sx={{
											display: {
												xs: "none",
												md: "flex",
												flexDirection: "column",
											},
										}}>
										<Typography
											color="primary"
											sx={{ fontWeight: 600, textTransform: "capitalize" }}>
											{userData?.firstName} {userData?.lastName}
										</Typography>
									</Stack>
								</Stack>

								<Menu
									id="basic-menu"
									anchorEl={anchorEl}
									open={open}
									onClose={handleClose}
									sx={{ minWidth: "150px" }}
									MenuListProps={{
										"aria-labelledby": "basic-button",
									}}
									anchorOrigin={{
										vertical: "bottom",
										horizontal: "right",
									}}
									transformOrigin={{
										vertical: "top",
										horizontal: "left",
									}}
									PaperProps={{
										elevation: 0,
										sx: {
											overflow: "visible",
											filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
											mt: 1.5,
											width: 200,
											"& .MuiAvatar-root": {
												width: 52,
												height: 32,
												ml: -0.5,
												mr: 1,
											},
											"&:before": {
												content: '""',
												display: "block",
												position: "absolute",
												top: 0,
												right: 14,
												width: 10,
												height: 10,
												bgcolor: "background.paper",
												transform: "translateY(-50%) rotate(45deg)",
												zIndex: 0,
											},
										},
									}}>
									<MenuItem onClick={handleClose}>Profile</MenuItem>
									<MenuItem
										sx={{ color: theme.palette.error.main }}
										onClick={() => {
											setUserLogout(true);
											handleClose();
										}}>
										Logout
									</MenuItem>
								</Menu>
							</Stack>
						</Box>
					</Toolbar>
				</AppBar>

				<Box
					component="nav"
					sx={{
						width: { md: drawerWidth },
						flexShrink: { md: 0 },
					}}>
					<Drawer
						container={container}
						variant="temporary"
						open={mobileOpen}
						onClose={handleDrawerToggle}
						ModalProps={{
							keepMounted: true,
						}}
						sx={{
							display: { xs: "block", md: "none" },
							border: "none",
							"& .MuiDrawer-paper": {
								boxSizing: "border-box",
								width: drawerWidth,
								border: "none",
							},
						}}>
						{drawer}
					</Drawer>
					<Drawer
						variant="permanent"
						sx={{
							display: { xs: "none", md: "block" },
							border: "none",
							"& .MuiDrawer-paper": {
								boxSizing: "border-box",
								width: drawerWidth,
								border: "none",
							},
						}}
						open>
						{drawer}
					</Drawer>
				</Box>

				<Box
					component="main"
					sx={{
						width: "100vw",
						pt: 2,
						pb: 5,
						background: "#F8FAFC",
						minHeight: "100vh",
						overflowX: "hidden",
					}}>
					<Container maxWidth="lg">
						<Toolbar />
						{children}
					</Container>
				</Box>
			</Box>

			{/* <ModalPopup
				open={userLogout}
				title="You'll be logged out of your account"
				showBtn2={true}
				onClick={handleLogout}
				showBtn1={true}
				setOpen={setUserLogout}
				btnText={
					logoutLoading ? (
						<CircularProgress
							size={20}
							sx={{ color: theme.palette.secondary.main }}
						/>
					) : (
						"Log Out"
					)
				}
			/> */}

			<LogoutModal open={userLogout} setOpen={setUserLogout} />
		</>
	);
}

DashboardLayout.propTypes = {
	window: PropTypes.func,
	pageTitle: PropTypes.string,
	children: PropTypes.any,
	showBackBtn: PropTypes.bool,
	onNavigate: PropTypes.func,
	searchText: PropTypes.string,
	setSearchText: PropTypes.func,
};

export default DashboardLayout;
