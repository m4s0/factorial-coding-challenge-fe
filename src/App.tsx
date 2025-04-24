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
import ProductPage from "./pages/ProductPage.tsx";
import ProductCategoryPage from './pages/ProductCategoryPage.tsx';
import ProductOptionPage from './pages/ProductOptionPage.tsx';
import ProductOptionGroupPage from "./pages/ProductOptionGroupPage.tsx";

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <BrowserRouter>
                <AuthProvider>
                    <MainLayout>
                        <Routes>
                            <Route path="/" element={<HomePage/>}/>
                            <Route path="/products" element={<ProductsPage/>}/>
                            <Route path="/products/:productId/configure" element={<ConfiguratorPage/>}/>
                            <Route path="/admin/category" element={<ProductCategoryPage/>}/>
                            <Route path="/admin/product" element={<ProductPage/>}/>
                            <Route path="/admin/product-option" element={<ProductOptionPage/>}/>
                            <Route path="/admin/product-option-group" element={<ProductOptionGroupPage/>}/>
                            <Route path="/cart" element={<CartPage/>}/>
                            <Route path="/login" element={<LoginPage/>}/>
                            <Route path="/register" element={<RegisterPage/>}/>
                        </Routes>
                    </MainLayout>
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>

    );
};

export default App;
