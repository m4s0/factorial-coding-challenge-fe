import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    TextField,
    Typography
} from '@mui/material';
import {Add, Delete, Remove} from '@mui/icons-material';
import {Link as RouterLink} from 'react-router-dom';
import {formatPrice} from "../utils/formatPrice.ts";
import {getCart, removeItem, updateItemQuantity} from "../api/cart.api.ts";
import {Cart} from "../types/api.types.ts";

const CartPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cart, setCart] = useState<Cart | null>(null);

    useEffect(() => {
        const fetchCartData = async () => {
            setLoading(true);
            setError(null);

            try {
                const cartData = await getCart();
                setCart(cartData);
            } catch (err) {
                setError('Failed to load product configuration data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCartData();
    }, []);

    const handleQuantityChange = async (id: string, value: string) => {
        const quantity = parseInt(value, 10);
        if (!isNaN(quantity) && quantity > 0) {
            const cart = await updateItemQuantity(id, {quantity});
            setCart(cart)
        }
    };

    const handleIncreaseQuantity = async (id: string) => {
        const itemFound = cart?.items.find(item => item.id === id);

        if (itemFound) {
            const cart = await updateItemQuantity(id, {quantity: itemFound.quantity + 1});
            setCart(cart)
        }
    };

    const handleDecreaseQuantity = async (index: string) => {
        const itemFound = cart?.items.find(item => item.id === index);

        if (itemFound && itemFound.quantity > 1) {
            const cart = await updateItemQuantity(index, {quantity: itemFound.quantity - 1});
            setCart(cart)
        }
    };

    const handleRemoveItem = async (index: string) => {
        const cart = await removeItem(index);
        setCart(cart)

    };

    if (!cart) {
        return (
            <>
                <Card sx={{p: 4, textAlign: 'center'}}>
                    <Typography variant="h5" gutterBottom>
                        Your shopping cart is empty
                    </Typography>
                    <Typography variant="body1" sx={{mb: 3}}>
                        Looks like you haven't added any products to your cart yet.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        component={RouterLink}
                        to="/products"
                    >
                        Browse Products
                    </Button>
                </Card>
            </>
        );
    }

    if (loading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', p: 5}}>
                <CircularProgress/>
            </Box>
        );
    }

    if (error || !cart) {
        return <Alert severity="error">{error || 'Cart not found'}</Alert>;
    }

    if (cart.items.length === 0) {
        return <Alert severity="info">{'Cart is empty'}</Alert>;
    }

    return (
        <>
            <Typography variant="h4" component="h1" gutterBottom>
                Shopping Cart
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    {cart.items.map((item, index) => (
                        <Card key={index} sx={{mb: 3}}>
                            <CardContent>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} sm={3}>
                                        <img
                                            src={`https://placehold.co/200x150`}
                                            alt={item.product.name}
                                            style={{width: '100%', height: 'auto'}}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={5}>
                                        <Typography variant="h6">
                                            {item.product.name}
                                        </Typography>
                                        <Typography variant="h6">
                                            {formatPrice(item.product.price)}
                                        </Typography>

                                        <Box sx={{mt: 1}}>
                                            <Typography variant="body2" color="text.secondary">
                                                Configuration:
                                            </Typography>
                                            <List dense disablePadding>
                                                {item.itemOptions.map((itemOption) => (
                                                    <ListItem key={itemOption.id} disablePadding>
                                                        <ListItemText
                                                            primary={itemOption.option.displayName}
                                                            secondary={formatPrice(itemOption.option.price)}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={2}>
                                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDecreaseQuantity(item.id)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <Remove fontSize="small"/>
                                            </IconButton>

                                            <TextField
                                                size="small"
                                                variant="outlined"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                sx={{width: 60, mx: 1, '& input': {textAlign: 'center'}}}
                                                inputProps={{min: 1}}
                                            />

                                            <IconButton
                                                size="small"
                                                onClick={() => handleIncreaseQuantity(item.id)}
                                            >
                                                <Add fontSize="small"/>
                                            </IconButton>

                                            <IconButton
                                                color="error"
                                                size="small"
                                                onClick={() => handleRemoveItem(item.id)}
                                                sx={{mt: 1}}
                                            >
                                                <Delete fontSize="small"/>
                                            </IconButton>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={2} sx={{textAlign: 'right'}}>
                                        <Typography variant="h6">
                                            {formatPrice(item.totalPrice)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ))}
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Order Summary
                            </Typography>

                            <Box sx={{my: 2}}>
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                        <Typography variant="body1">
                                            Subtotal
                                            ({cart.items.reduce((sum, item) => sum + item.quantity, 0)} items)
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1">
                                            {formatPrice(cart.totalPrice)}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Grid container justifyContent="space-between" sx={{mt: 1}}>
                                    <Grid item>
                                        <Typography variant="body1">
                                            Shipping
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1">
                                            {formatPrice(0)}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Grid container justifyContent="space-between" sx={{mt: 1}}>
                                    <Grid item>
                                        <Typography variant="body1">
                                            Tax
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1">
                                            {formatPrice(0)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Divider sx={{my: 2}}/>

                            <Grid container justifyContent="space-between">
                                <Grid item>
                                    <Typography variant="h6">
                                        Total
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="h6">
                                        {formatPrice(cart.totalPrice)}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                sx={{mt: 3}}
                            >
                                Proceed to Checkout
                            </Button>

                            <Button
                                variant="outlined"
                                fullWidth
                                sx={{mt: 2}}
                                component={RouterLink}
                                to="/products"
                            >
                                Continue Shopping
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};

export default CartPage;
