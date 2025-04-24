import React from 'react';
import {AppBar, Badge, Box, Button, Toolbar, Typography} from '@mui/material';
import {ShoppingCart} from '@mui/icons-material';
import {Link as RouterLink} from 'react-router-dom';
import {useAuth} from '../../hooks/useAuth';

const Header: React.FC = () => {
    const {isAuthenticated, logout} = useAuth();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    <RouterLink to="/" style={{color: 'white', textDecoration: 'none'}}>
                        Marcus Bicycles
                    </RouterLink>
                </Typography>

                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <Button component={RouterLink} to="/" color="inherit">
                        Home
                    </Button>
                    <Button component={RouterLink} to="/products" color="inherit">
                        Products
                    </Button>

                    {isAuthenticated ? (
                        <>
                            <Button component={RouterLink} color="inherit">
                                My Orders
                            </Button>

                            <Button color="inherit" onClick={logout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button component={RouterLink} to="/login" color="inherit">
                                Login
                            </Button>
                            <Button component={RouterLink} to="/register" color="inherit">
                                Register
                            </Button>
                        </>
                    )}

                    <Button component={RouterLink} to="/cart" color="inherit" sx={{ml: 2}}>
                        {/*<Badge badgeContent={items.length} color="error">*/}
                        <Badge color="error">
                            <ShoppingCart/>
                        </Badge>
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
