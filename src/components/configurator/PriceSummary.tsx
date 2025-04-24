import React from 'react';
import {Box, Button, Divider, List, ListItem, ListItemText, Paper, Typography} from '@mui/material';
import {Product, ProductOption} from '../../types/api.types';
import {formatPrice} from "../../utils/formatPrice.ts";

interface PriceSummaryProps {
    product: Product;
    selectedOptions: ProductOption[];
    totalPrice: number;
    isConfigurationValid: boolean;
    onAddToCart: () => void;
    isAuthenticated: boolean
}

const PriceSummary: React.FC<PriceSummaryProps> = ({
                                                       product,
                                                       selectedOptions,
                                                       totalPrice,
                                                       isConfigurationValid,
                                                       onAddToCart,
                                                       isAuthenticated
                                                   }) => {
    return (
        <Paper sx={{p: 3}}>
            <Typography variant="h6" gutterBottom>
                Configuration Summary
            </Typography>

            <List dense>
                <ListItem>
                    <ListItemText
                        primary={product.name}
                        secondary="Base price"
                    />
                    <Typography variant="body2">
                        {formatPrice(product.basePrice)}
                    </Typography>
                </ListItem>

                <Divider sx={{my: 1}}/>

                {selectedOptions.map((option) => (
                    <ListItem key={option.id}>
                        <ListItemText
                            primary={option.displayName}
                        />
                        <Typography variant="body2">
                            {formatPrice(option.basePrice)}
                        </Typography>
                    </ListItem>
                ))}

                <Divider sx={{my: 1}}/>

                <ListItem>
                    <ListItemText
                        primary={<Typography variant="subtitle1" fontWeight="bold">Total Price</Typography>}
                    />
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                        {formatPrice(totalPrice)}
                    </Typography>
                </ListItem>
            </List>

            <Box sx={{mt: 3}}>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={!isConfigurationValid || !isAuthenticated}
                    onClick={onAddToCart}
                >
                    Add to Cart
                </Button>

                {!isConfigurationValid && (
                    <Typography variant="caption" color="error" sx={{mt: 1, display: 'block'}}>
                        Please complete your configuration
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

export default PriceSummary;
