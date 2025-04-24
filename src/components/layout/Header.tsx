import React from 'react';
import {AppBar, Box, Toolbar, Typography} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import {useAuth} from '../../hooks/useAuth';
import {AdminMenu} from "./AdminMenu.tsx";
import {CustomerMenu} from "./CustomerMenu.tsx";

const Header: React.FC = () => {
    const {isAdmin} = useAuth();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    <RouterLink to="/" style={{color: 'white', textDecoration: 'none'}}>
                        Marcus Bicycles
                    </RouterLink>
                </Typography>

                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    {isAdmin ? (
                        <AdminMenu/>
                    ) : (
                        <CustomerMenu/>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
