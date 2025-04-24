import React from 'react';
import {Box, Checkbox, Chip, FormControlLabel, Typography} from '@mui/material';
import {ProductOption} from "../../types/api.types.ts";
import {formatPrice} from "../../utils/formatPrice.ts";

interface OptionItemProps {
    option: ProductOption;
    isSelected: boolean;
    onChange: (isSelected: boolean) => void;
}

const OptionItem: React.FC<OptionItemProps> = ({
                                                   option,
                                                   isSelected,
                                                   onChange,
                                               }) => {
    const price = option.basePrice;

    return (
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1}}>
            <FormControlLabel
                disabled={!option.inStock || !option.isActive}
                control={
                    <Checkbox
                        checked={isSelected}
                        onChange={(e) => onChange(e.target.checked)}
                    />
                }
                label={
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Typography variant="body1">{option.displayName}</Typography>
                        {!option.inStock && (
                            <Chip
                                label="Out of Stock"
                                color="error"
                                size="small"
                                sx={{ml: 2}}
                            />
                        )}
                        {!option.isActive && (
                            <Chip
                                label="Inactive"
                                color="default"
                                size="small"
                                sx={{ml: 2}}
                            />
                        )}
                    </Box>
                }
            />
            <Typography variant="body2" color="primary">
                {formatPrice(price)}
            </Typography>
        </Box>
    );
};

export default OptionItem;
