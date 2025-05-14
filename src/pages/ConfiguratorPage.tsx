import React, {useEffect, useState} from 'react';
import {Alert, Box, CircularProgress, Grid, Typography} from '@mui/material';
import {useParams} from 'react-router-dom';
import {getProduct, getProductWithOptions} from '../api/products.api';
import {
    Product,
    ProductOption,
    ProductOptionGroup,
} from '../types/api.types';
import PriceSummary from '../components/configurator/PriceSummary.tsx';
import OptionGroup from '../components/configurator/OptionGroup.tsx';
import {addItem} from '../api/cart.api.ts';
import {useAuth} from "../hooks/useAuth.ts";

function getSelectedOptions(
    groups: ProductOptionGroup[],
    selectedOptionIds: string[]
): ProductOption[] {
    return groups
        .flatMap(group => group.options)
        .filter(option => selectedOptionIds.includes(option.id));
}

function groupProductByGroups(product: Product | null): ProductOptionGroup[] {
    if (!product) {
        return [];
    }

    return product.optionGroups.map(group => ({
        ...group
    }));
}

const ConfiguratorPage: React.FC = () => {
    const {productId} = useParams<{ productId: string }>();

    const {isAuthenticated} = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [productOptionGroups, setProductOptionGroups] = useState<ProductOptionGroup[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [configValidation, setConfigValidation] = useState<boolean>(false);
    const [calculatedPrice, setCalculateCalculatedPrice] = useState<number>(0);

    useEffect(() => {
        const fetchProductData = async () => {
            if (!productId) return;

            setLoading(true);
            setError(null);

            try {
                const productData = await getProduct(productId);
                setProduct(productData);

                setProductOptionGroups(groupProductByGroups(productData))
            } catch (err) {
                setError('Failed to load product configuration data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [productId]);

    useEffect(() => {
        const validateAndPrice = async () => {
            if (!productId || selectedOptions.length === 0) {
                setConfigValidation(false);
                setCalculateCalculatedPrice(0);
                return;
            }

            try {
                const productData = await getProductWithOptions(productId, selectedOptions);
                setProduct(productData);

                setProductOptionGroups(groupProductByGroups(productData))

                if (productData.price !== undefined) {
                    setCalculateCalculatedPrice(productData.price);
                }

                if (productData.isValidConfiguration !== undefined) {
                    setConfigValidation(productData.isValidConfiguration)
                }
            } catch (err) {
                console.error('Failed to validate configuration:', err);
            }
        };

        validateAndPrice();
    }, [productId, selectedOptions]);

    const handleOptionSelect = (optionId: string, isSelected: boolean, groupId: string) => {
        setSelectedOptions(prev => {
            const filteredOptions = prev.filter(id =>
                !productOptionGroups.some(group => group.id === groupId && group.options.some(option => option.id === id))
            );

            return isSelected ? [...filteredOptions, optionId] : filteredOptions;
        });
    };

    const handleAddToCart = async () => {
        if (!product || selectedOptions.length === 0) {
            return;
        }

        try {
            await addItem({
                productId: product.id,
                quantity: 1,
                optionIds: getSelectedOptions(productOptionGroups, selectedOptions).map(o => o.id),
            })
        } catch (err) {
            console.error('Failed to add item:', err);
        }
    };

    if (loading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', p: 5}}>
                <CircularProgress/>
            </Box>
        );
    }

    if (error || !product) {
        return <Alert severity="error">{error || 'Product not found'}</Alert>;
    }

    return (
        <>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Configure Your {product.name}
                    </Typography>
                    <Typography gutterBottom>
                        {product.description}
                    </Typography>
                    <Typography variant="body1">
                        Select your preferred options to build your custom {product.name}.
                    </Typography>
                </Grid>

                <Grid item xs={12} md={8}>
                    {productOptionGroups.map(group => (
                        <OptionGroup
                            key={group.id}
                            id={group.id}
                            displayName={group.displayName}
                            options={group.options}
                            selectedOptions={selectedOptions}
                            onOptionSelect={(optionId, isSelected) => handleOptionSelect(optionId, isSelected, group.id)}
                        />
                    ))}
                </Grid>

                <Grid item xs={12} md={4}>
                    <PriceSummary
                        product={product}
                        selectedOptions={
                            getSelectedOptions(productOptionGroups, selectedOptions)
                        }
                        totalPrice={calculatedPrice}
                        isConfigurationValid={configValidation}
                        isAuthenticated={isAuthenticated}
                        onAddToCart={handleAddToCart}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default ConfiguratorPage;
