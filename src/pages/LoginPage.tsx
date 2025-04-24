import React from 'react';
import {Container, Link, Paper, Typography} from '@mui/material';
import {Login} from '../components/auth/Login';
import {Link as RouterLink} from "react-router";

const LoginPage: React.FC = () => {
    return (
        <Container maxWidth="sm">
            <Paper sx={{p: 4, mt: 8}}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Login
                </Typography>
                <Login/>
                <Typography variant="body2" sx={{mt: 3, textAlign: 'center'}}>
                    Don't have an account?{' '}
                    <Link component={RouterLink} to="/register">
                        Register
                    </Link>
                </Typography>
            </Paper>
        </Container>
    );
};

export default LoginPage;
