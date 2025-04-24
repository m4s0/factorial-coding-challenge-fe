import React from 'react';
import {FormControl, FormGroup, FormLabel, Paper, Typography} from '@mui/material';
import OptionItem from './OptionItem';
import {ProductOption} from "../../types/api.types.ts";

interface OptionGroupProps {
    id: string;
    displayName: string;
    options: ProductOption[];
    selectedOptions: string[];
    onOptionSelect: (optionId: string, isSelected: boolean/*, group: ProductOptionGroup*/) => void;
}

const OptionGroup: React.FC<OptionGroupProps> = ({
                                                     displayName,
                                                     options,
                                                     selectedOptions,
                                                     onOptionSelect,
                                                 }) => {

    return (
        <Paper sx={{p: 3, mb: 3}}>
            <FormControl
                component="fieldset"
                fullWidth
            >
                <FormLabel component="legend">
                    <Typography variant="h6">{displayName}</Typography>
                </FormLabel>

                <FormGroup>
                    {options.map((option) => (
                        <OptionItem
                            key={option.id}
                            option={option}
                            isSelected={selectedOptions.includes(option.id)}
                            onChange={(isSelected) => onOptionSelect(option.id, isSelected)}
                        />
                    ))}
                </FormGroup>
            </FormControl>
        </Paper>
    );
};

export default OptionGroup;
