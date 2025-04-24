import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import {Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon} from '@mui/icons-material';
import {
    createProductOption,
    deleteProductOption,
    getProductOptions,
    updateProductOption
} from '../api/product-options.api';
import {getProductOptionGroups} from '../api/product-option-groups.api';
import {
    CreateProductOptionRequest,
    ProductOption,
    ProductOptionGroup,
    UpdateProductOptionRequest
} from '../types/api.types';
import {formatPrice} from '../utils/formatPrice';

const ProductOptionPage: React.FC = () => {
    const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
    const [optionGroups, setOptionGroups] = useState<ProductOptionGroup[]>([]);
    const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const emptyFormData = {
        name: '',
        displayName: '',
        basePrice: 0,
        isActive: true,
        optionGroupId: ''
    };
    const [editFormData, setEditFormData] = useState<UpdateProductOptionRequest>(emptyFormData);
    const [createFormData, setCreateFormData] = useState<Omit<CreateProductOptionRequest, 'id'>>(emptyFormData);

    useEffect(() => {
        fetchProductOptions();
        fetchOptionGroups();
    }, []);

    const fetchProductOptions = async () => {
        try {
            const data = await getProductOptions();
            setProductOptions(data);
        } catch (err) {
            setError('Failed to load product options');
        }
    };

    const fetchOptionGroups = async () => {
        try {
            const data = await getProductOptionGroups();
            setOptionGroups(data);
        } catch (err) {
            setError('Failed to load option groups');
        }
    };

    const handleEditClick = (option: ProductOption) => {
        setSelectedOption(option);
        setEditFormData({
            name: option.name,
            displayName: option.displayName,
            basePrice: option.basePrice,
            isActive: option.isActive,
            optionGroupId: option.optionGroupId
        });
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = async (optionId: string) => {
        if (window.confirm('Are you sure you want to delete this option?')) {
            try {
                await deleteProductOption(optionId);
                await fetchProductOptions();
                setSuccess('Product option deleted successfully');
                setTimeout(() => setSuccess(null), 3000);
            } catch (err) {
                setError('Failed to delete product option');
            }
        }
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const {name, value} = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name as string]: name === 'basePrice' ? Number(value) : value
        }));
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOption) return;

        setLoading(true);
        try {
            await updateProductOption(selectedOption.id, editFormData);
            await fetchProductOptions();
            setIsEditModalOpen(false);
            setSuccess('Product option updated successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to update product option');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClick = () => {
        setCreateFormData({
            name: '',
            displayName: '',
            basePrice: 0,
            isActive: true,
            optionGroupId: ''
        });
        setIsCreateModalOpen(true);
    };

    const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const {name, value} = e.target;
        setCreateFormData(prev => ({
            ...prev,
            [name as string]: name === 'basePrice' ? Number(value) : value
        }));
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createProductOption(createFormData);
            await fetchProductOptions();
            setIsCreateModalOpen(false);
            setSuccess('Product option created successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to create product option');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{p: 3}}>
            {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
            {success && <Alert severity="success" sx={{mb: 2}}>{success}</Alert>}

            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                <Typography variant="h5">Product Options</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon/>}
                    onClick={handleCreateClick}
                >
                    Create Option
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Display Name</TableCell>
                            <TableCell>Base Price</TableCell>
                            <TableCell>Option Group</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productOptions.map((option) => (
                            <TableRow key={option.id}>
                                <TableCell>{option.name}</TableCell>
                                <TableCell>{option.displayName}</TableCell>
                                <TableCell>{formatPrice(option.basePrice)}</TableCell>
                                <TableCell>
                                    {optionGroups.find(g => g.id === option.optionGroupId)?.name}
                                </TableCell>
                                <TableCell>{option.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEditClick(option)}>
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteClick(option.id)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="sm" fullWidth>
                <form onSubmit={handleCreateSubmit}>
                    <DialogTitle>Create Product Option</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Option Name"
                            name="name"
                            value={createFormData.name}
                            onChange={handleCreateChange}
                            required
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Display Name"
                            name="displayName"
                            value={createFormData.displayName}
                            onChange={handleCreateChange}
                            required
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Base Price"
                            name="basePrice"
                            type="number"
                            value={createFormData.basePrice}
                            onChange={handleCreateChange}
                            required
                            margin="normal"
                            inputProps={{min: 0, step: 0.01}}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Option Group</InputLabel>
                            <Select
                                name="optionGroupId"
                                value={createFormData.optionGroupId}
                                onChange={handleCreateChange}
                                required
                                label="Option Group"
                            >
                                {optionGroups.map((group) => (
                                    <MenuItem key={group.id} value={group.id}>
                                        {group.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={createFormData.isActive}
                                    onChange={(e) => setCreateFormData(prev => ({
                                        ...prev,
                                        isActive: e.target.checked
                                    }))}
                                    name="isActive"
                                />
                            }
                            label="Active"
                            sx={{mt: 2}}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={loading}>
                            {loading ? <CircularProgress size={24}/> : 'Create'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="sm" fullWidth>
                <form onSubmit={handleEditSubmit}>
                    <DialogTitle>Edit Product Option</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Option Name"
                            name="name"
                            value={editFormData.name}
                            onChange={handleEditChange}
                            required
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Display Name"
                            name="displayName"
                            value={editFormData.displayName}
                            onChange={handleEditChange}
                            required
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Base Price"
                            name="basePrice"
                            type="number"
                            value={editFormData.basePrice}
                            onChange={handleEditChange}
                            required
                            margin="normal"
                            inputProps={{min: 0, step: 0.01}}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Option Group</InputLabel>
                            <Select
                                name="optionGroupId"
                                value={editFormData.optionGroupId}
                                onChange={handleEditChange}
                                required
                                label="Option Group"
                            >
                                {optionGroups.map((group) => (
                                    <MenuItem key={group.id} value={group.id}>
                                        {group.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={editFormData.isActive}
                                    onChange={(e) => setEditFormData(prev => ({
                                        ...prev,
                                        isActive: e.target.checked
                                    }))}
                                    name="isActive"
                                />
                            }
                            label="Active"
                            sx={{mt: 2}}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={loading}>
                            {loading ? <CircularProgress size={24}/> : 'Save Changes'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default ProductOptionPage;
