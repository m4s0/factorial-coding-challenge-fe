import React, {useEffect, useState} from 'react';
import {Button, Card, CardActions, CardContent, CardMedia, Container, Grid, Typography} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import {getProducts} from '../api/products.api';
import {Product} from '../types/api.types';
import {formatPrice} from "../utils/formatPrice.ts";

const HomePage: React.FC = () => {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFeaturedProducts = async () => {
            try {
                const products = await getProducts();
                setFeaturedProducts(products.slice(0, 3));
            } catch (error) {
                console.error('Failed to load featured products:', error);
            } finally {
                setLoading(false);
            }
        };

        loadFeaturedProducts();
    }, []);

    return (
        <>
            <Container
                maxWidth="xl"
                sx={{
                    py: 8,
                    bgcolor: 'background.paper',
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url(/bicycle-bg.jpg)',
                    backgroundSize: 'cover',
                    borderRadius: 2,
                    mb: 6
                }}
            >
                <Typography variant="h2" component="h1" gutterBottom align="center">
                    Custom Bicycles, Built Your Way
                </Typography>
            </Container>


            <Typography variant="h4" component="h2" gutterBottom align="center" sx={{mb: 4}}>
                Featured Bicycles
            </Typography>

            <Grid container spacing={4}>
                {featuredProducts.map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4}>
                        <Card sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                            <CardMedia
                                component="img"
                                sx={{height: 200}}
                                image={`https://placehold.co/400x320`}
                                alt={product.name}
                            />
                            <CardContent sx={{flexGrow: 1}}>
                                <Typography gutterBottom variant="h5" component="h3">
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
        </>
    )
}

export default HomePage;
