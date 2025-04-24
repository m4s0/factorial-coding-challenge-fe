import React from 'react';
import {Alert, Box, Button, TextField} from '@mui/material';
import {useAuth} from '../../hooks/useAuth';
import {useNavigate} from "react-router-dom";

export const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const {login} = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/')
        } catch (err) {
            let message;
            if (err instanceof Error) {
                message = typeof err.response.data === 'object' && 'message' in err.response.data ? err.response.data.message : err.response.data;
            } else {
                message = 'Failed to login.';
            }
            setError(message);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{mt: 3}}>
            {error && (
                <Alert severity="error" sx={{mb: 2}}>
                    {error}
                </Alert>
            )}
            <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
            />
            <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
            />
            <Button type="submit" fullWidth variant="contained" sx={{mt: 3}}>
                Login
            </Button>
        </Box>
    );
};
