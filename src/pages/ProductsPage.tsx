import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    CircularProgress,
    Grid,
    Typography
} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import {getProducts} from '../api/products.api';
import {Product} from '../types/api.types';
import {formatPrice} from "../utils/formatPrice.ts";

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const productsData = await getProducts();
                setProducts(productsData);
            } catch (error) {
                console.error('Failed to load products:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    return (
        <>
            <Typography variant="h4" component="h1" gutterBottom>
                Our Bicycles
            </Typography>

            {loading ? (
                <Box sx={{display: 'flex', justifyContent: 'center', p: 5}}>
                    <CircularProgress/>
                </Box>
            ) : products.length === 0 ? (
                <Typography variant="h6" align="center" sx={{my: 5}}>
                    No products found.
                </Typography>
            ) : (
                <Grid container spacing={4}>
                    {products.map((product) => (
                        <Grid item key={product.id} xs={12} sm={6} md={4}>
                            <Card sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                                <CardMedia
                                    component="img"
                                    sx={{height: 200}}
                                    image={`https://placehold.co/400x320`}
                                    alt={product.name}
                                />
                                <CardContent sx={{flexGrow: 1}}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {product.description.length > 120
                                            ? `{product.description.substring(0, 120)}...`
                                            : product.description}
                                    </Typography>
                                    <Typography variant="h6" color="primary" sx={{mt: 2}}>
                                        Starting at {formatPrice(product.basePrice)}
                                    </Typography>
                                </CardContent>
                                <CardActions>


                                    <Button
                                        size="small"
                                        color="primary"
                                        component={RouterLink}
                                        to={`/products/${product.id}/configure`}
                                    >
                                        Configure
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </>
    );
};

export default ProductsPage;
