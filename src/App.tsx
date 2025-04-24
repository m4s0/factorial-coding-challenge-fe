import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {AuthProvider} from './contexts/AuthContext';
import HomePage from "./pages/HomePage.tsx";
import ConfiguratorPage from "./pages/ConfiguratorPage.tsx";
import CartPage from "./pages/CartPage.tsx";
import {CssBaseline, ThemeProvider} from "@mui/material";
import MainLayout from './components/layout/MainLayout.tsx';
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from './pages/RegisterPage.tsx';
import {theme} from "./theme.ts";
import ProductsPage from './pages/ProductsPage.tsx';

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <AuthProvider>
                <BrowserRouter>
                    <MainLayout>
                        <Routes>
                            <Route path="/" element={<HomePage/>}/>
                            <Route path="/products" element={<ProductsPage/>}/>
                            <Route path="/products/:productId/configure" element={<ConfiguratorPage/>}/>
                            <Route path="/cart" element={<CartPage/>}/>
                            <Route path="/login" element={<LoginPage/>}/>
                            <Route path="/register" element={<RegisterPage/>}/>
                        </Routes>
                    </MainLayout>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>

    );
};

export default App;
