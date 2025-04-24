import React from 'react';
import {Button, Grid, Paper, Typography} from '@mui/material';
import {ProductCategory} from "../../types/api.types.ts";
import {createUUID} from "../../utils/create-uuid.ts";
import {formatPrice} from "../../utils/format-price.ts";

interface ProductDetailsProps {
    product: {
        id: string;
        name: string;
        description: string;
        basePrice: number;
        isActive: boolean;
        type: string;
        categoryId: string;
        category?: ProductCategory;
        createdAt: string;
        updatedAt: string;
    };
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({product}) => {
    return (
        <Paper sx={{p: 3}}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" gutterBottom>
                        {product.name}
                    </Typography>
                    <Typography variant="h5" color="primary" gutterBottom>
                        {formatPrice(product.basePrice)}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {product.description}
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => addItem({
                            id: createUUID(),
                            product,
                            quantity: 1,
                            selectedOptions: [],
                            totalPrice: product.basePrice
                        })}
                    >
                        Add to Cart
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};
