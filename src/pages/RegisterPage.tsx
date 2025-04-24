import React from 'react';
import {Container, Link, Paper, Typography} from '@mui/material';
import {Register} from '../components/auth/Register';
import {Link as RouterLink} from 'react-router-dom';

const RegisterPage: React.FC = () => {
    return (
        <Container maxWidth="sm">
            <Paper sx={{p: 4, mt: 8}}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Create Account
                </Typography>
                <Register/>
                <Typography variant="body2" sx={{mt: 3, textAlign: 'center'}}>
                    Already have an account?{' '}
                    <Link component={RouterLink} to="/login">
                        Sign in
                    </Link>
                </Typography>
            </Paper>
        </Container>
    );
};

export default RegisterPage;
