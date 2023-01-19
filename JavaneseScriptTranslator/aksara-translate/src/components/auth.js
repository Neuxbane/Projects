import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Avatar, MenuItem } from '@mui/material';
import { Container, Menu, Typography } from '@material-ui/core';
import { goTo, wsUrl } from '../Root';
import { DataBase } from '../service/storage';
import { Client } from '../service/Nxcom';

export const AuthForm = ({ className, childClass, onLogin, validate = (username, password) => true }) => {
	const [username, setUsername] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [error, setError] = React.useState(null);
	const [showPassword, setShowPassword] = React.useState(false);

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!username || !password) {
			setError('Please enter a username and password');
			return;
		}
		if (!validate(username, password)) {
			setError('Invalid username or password');
			return;
		}
		// Add code here to send login request to server
		// Assuming the server returns a success or failure message
		const client = new Client({ url: wsUrl, uid: await DataBase.getItem('uid') })
		const result = await client.connect("Server").send("auth", { username, password })
		client.disconnect()
		const { t: token, s: status, m: message } = result.data
		if (status === false) {
			setError(message);
			return;
		}

		await DataBase.setItem('auth', { token, username })

		if (onLogin !== undefined) onLogin({ token, username })

		setError('');
		setUsername('');
		setPassword('');
	};

	return (
		<form className={className} onSubmit={handleSubmit}>
			<TextField
				label="Username"
				value={username}
				className={childClass}
				onChange={(event) => setUsername(event.target.value)}
			/>
			<TextField
				label="Password"
				type={showPassword ? 'text' : 'password'}
				value={password}
				onChange={(event) => setPassword(event.target.value)}
				className={childClass}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								aria-label="toggle password visibility"
								onClick={handleClickShowPassword}
								onMouseDown={handleMouseDownPassword}
							>
								{showPassword ? <Visibility /> : <VisibilityOff />}
							</IconButton>
						</InputAdornment>
					),
				}}
			/>
			{error && <div className={childClass + ' text-red-600'}>{error}</div>}
			<Button variant="contained" color="primary" type="submit" className={childClass}>
				Login
			</Button>
		</form>
	);
}

export const AuthBlockContent = ({ className, children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	useEffect(()=>{
		(async()=>setIsLoggedIn(await DataBase.getItem('auth') != null))()
	}, [])

	if (isLoggedIn) {
		return <Container className={className}>{children}</Container>;
	} else {
		return (
			<div style={{ width: '100%', height: '100%' }}>
				<Typography className={className}>
					<Button onClick={() => goTo('/auth?' + new URLSearchParams({ redirect: window.location.toString() }))}>Login Required</Button>
				</Typography>
			</div>
		);
	}
};


export const AuthStatus = () => {
	const [auth, setAuth] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);

	useEffect(() => {
		(async()=>setAuth(await DataBase.getItem('auth')))();
	}, []);

	const menuItems = [
		{ name: 'Profile', handler: () => { } },
		{ name: 'Settings', handler: () => { } },
		{ name: 'Logout', handler: async() => { await DataBase.removeItem('auth'); window.location.reload() } },
	];

	const handleMenuClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	if (auth == null) {
		return <Button className='!text-white' onClick={() => goTo('/auth?' + new URLSearchParams({ redirect: window.location.toString() }))}>Auth</Button>;
	} else {
		return (
			<div>
				<Container onClick={handleMenuClick} className="!flex !flex-row cursor-pointer">
					<Avatar
						alt={auth.username}
						src="/profile-pic.jpg"
					/>
					<Typography className="m-auto p-2">{auth.username}</Typography>
				</Container>
				<Menu
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={handleMenuClose}
				>
					{menuItems.map((item) => (
						<MenuItem onClick={item.handler} key={item.name}>
							{item.name}
						</MenuItem>
					))}
				</Menu>
			</div>
		);
	}
}
