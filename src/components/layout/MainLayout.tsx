import React, {ReactNode} from 'react';
import {Box, Container, CssBaseline} from '@mui/material';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({children}) => {
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <CssBaseline/>
            <Header/>
            <Container component="main" sx={{mt: 4, mb: 4, flex: 1}}>
                {children}
            </Container>
            <Footer/>
        </Box>
    );
};

export default MainLayout;
