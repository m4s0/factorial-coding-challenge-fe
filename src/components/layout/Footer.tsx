import React from 'react';
import {Box, Container, Typography} from '@mui/material';

const Footer: React.FC = () => {
    return (
        <Box component="footer" sx={{bgcolor: 'primary.main', color: 'white', py: 3, mt: 'auto'}}>
            <Container maxWidth="lg">
                <Typography variant="body1" align="center">
                    &copy; {new Date().getFullYear()} Marcus Bicycles. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;
