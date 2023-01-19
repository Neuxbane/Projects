import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { GitHub, Instagram, LinkedIn, Telegram, WhatsApp } from '@material-ui/icons';
import { Avatar, Box, Card, CardContent, CardMedia, Link } from '@mui/material';
import { CardHeader } from '@material-ui/core';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { AuthStatus } from './auth';
import { VideoCanvas } from './cameraCapture';

const pages = [
	{ name: "Home", path: "/home" },
	{ name: "About", path: "/about" },
	{ name: "Contact", path: "/contact" }
];

export function ResponsiveAppBar() {
	const [anchorElNav, setAnchorElNav] = React.useState(null);

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	return (
		<AppBar position="static">
			<Container maxWidth="xxl" className=' bg-slate-400'>
				<Toolbar disableGutters>
					<AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />

					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							color="inherit"
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: 'block', md: 'none' },
							}}
						>
							{pages.map((page) => (
								<MenuItem key={page.name} href={page.path} >
									<Typography textAlign="center">{page.name}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
					<AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
					<p
						variant="h5"
						noWrap
						component="a"
						href=""
						sx={{
							mr: 2,
							display: { xs: 'flex', md: 'none' },
							flexGrow: 1,
							fontFamily: 'font-family: "Product Sans",Arial,sans-serif',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						AksaraTranslate
					</p>
					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
						{pages.map((page) => (
							<Button
								href={page.path}
								key={page.name}
								sx={{ my: 2, color: 'white', display: 'block' }}
							>
								{page.name}
							</Button>
						))}
					</Box>
					<AuthStatus></AuthStatus>
				</Toolbar>
			</Container>
		</AppBar>
	);
}

export const Home = () => {
	return (
		<div>
			<ResponsiveAppBar>
				<Typography variant="h4" className="mb-2">
				</Typography>
			</ResponsiveAppBar>
			<VideoCanvas></VideoCanvas>
		</div>
	)
}

export const About = () => {
	return (
		<div>
			<Typography variant="h4" className="mb-2">
				About Me
			</Typography>
			<Typography paragraph>
				Hello world!, my name is Banu Chrisnadi. If I had some free time, I'll build my portofolio or my creation in this site and I like AI Technology
			</Typography>
		</div>
	)
}

export const Footer = () => {
	return (
		<Container>
			<Box mt={8}>
				<Typography variant="body2" color="textSecondary" align="center">
					{'Copyright © '}
					Neuxbane {new Date().getFullYear()}
					{'.'}
				</Typography>
				<SocialLinks></SocialLinks>
			</Box>
		</Container>
	);
}

export const SocialLinks = ({ className }) => {
	return (
		<div className={className}>
			<Link href="https://linkedin.com/in/banuchrisnadi">
				<LinkedIn></LinkedIn>
			</Link>
			<Link href="https://github.com/Neuxbane">
				<GitHub></GitHub>
			</Link>
			<Link href="https://wa.me/6281226125244">
				<WhatsApp></WhatsApp>
			</Link>
			<Link href="https://t.me/neuxbane">
				<Telegram></Telegram>
			</Link>
			<Link href="https://instagram.com/neuxbane.id">
				<Instagram></Instagram>
			</Link>
		</div>
	);
}


export const Contact = () => {
	return (
		<Card>
			<CardHeader
				avatar={<Avatar src="/path/to/avatar.jpg" />}
				title="Title"
				subheader="Subtitle"
			/>
			<CardMedia
				component="img"
				alt="Image"
				height="140"
				image="/path/to/image.jpg"
				title="Image"
			/>
			<CardContent>
				<Typography variant="body2" component="p">
					Description
				</Typography>
			</CardContent>
		</Card>
	);
}



export const HomePage = ({ children }) => {
	return (
		<div>
			<ResponsiveAppBar></ResponsiveAppBar>
			<Container className="mt-8 min-h-[60vh]" maxWidth="md">
				{children}
			</Container>
			<Footer></Footer>
		</div>
	);
}