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
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {
    createProductOptionGroup,
    deleteProductOptionGroup,
    getProductOptionGroups,
    updateProductOptionGroup
} from '../api/product-option-groups.api';
import {getProducts} from '../api/products.api';
import {
    CreateProductOptionGroupRequest,
    Product,
    ProductOptionGroup,
    UpdateProductOptionGroupRequest
} from '../types/api.types';

const ProductOptionGroupPage: React.FC = () => {
    const [optionGroups, setOptionGroups] = useState<ProductOptionGroup[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<ProductOptionGroup | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<UpdateProductOptionGroupRequest>({
        name: '',
        displayName: '',
        productId: ''
    });
    const [createFormData, setCreateFormData] = useState<CreateProductOptionGroupRequest>({
        name: '',
        displayName: '',
        productId: ''
    });

    const fetchData = async () => {
        try {
            const [groupsData, productsData] = await Promise.all([
                getProductOptionGroups(),
                getProducts()
            ]);
            setOptionGroups(groupsData);
            setProducts(productsData);
        } catch (err) {
            setError('Failed to load data');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEditClick = (group: ProductOptionGroup) => {
        setSelectedGroup(group);
        setEditFormData({
            name: group.name,
            displayName: group.displayName,
            productId: group.productId
        });
        setIsEditModalOpen(true);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const {name, value} = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name as string]: value
        }));
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedGroup) return;

        setLoading(true);
        try {
            await updateProductOptionGroup(selectedGroup.id, editFormData);
            await fetchData();
            setIsEditModalOpen(false);
            setSuccess('Option group updated successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to update option group');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this option group?')) return;

        setLoading(true);
        try {
            await deleteProductOptionGroup(id);
            await fetchData();
            setSuccess('Option group deleted successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to delete option group');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClick = () => {
        setCreateFormData({
            name: '',
            displayName: '',
            productId: ''
        });
        setIsCreateModalOpen(true);
    };

    const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const {name, value} = e.target;
        setCreateFormData(prev => ({
            ...prev,
            [name as string]: value
        }));
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createProductOptionGroup(createFormData);
            await fetchData();
            setIsCreateModalOpen(false);
            setSuccess('Option group created successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to create option group');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{p: 3}}>
            {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
            {success && <Alert severity="success" sx={{mb: 2}}>{success}</Alert>}

            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                <Typography variant="h5">Product Option Groups</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon/>}
                    onClick={handleCreateClick}
                >
                    Create Group
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Display Name</TableCell>
                            <TableCell>Groups</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {optionGroups.map((optionGroup) => (
                            <TableRow key={optionGroup.id}>
                                <TableCell>{optionGroup.name}</TableCell>
                                <TableCell>{optionGroup.displayName}</TableCell>
                                <TableCell>
                                    {optionGroup.product.name}
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEditClick(optionGroup)}>
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteClick(optionGroup.id)}>
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
                    <DialogTitle>Create Option Group</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Group Name"
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
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Product</InputLabel>
                            <Select
                                name="productId"
                                value={createFormData.productId}
                                onChange={handleCreateChange}
                                required
                                label="Product"
                            >
                                {products.map((product) => (
                                    <MenuItem key={product.id} value={product.id}>
                                        {product.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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
                    <DialogTitle>Edit Option Group</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Group Name"
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
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Product</InputLabel>
                            <Select
                                name="productId"
                                value={editFormData.productId}
                                onChange={handleEditChange}
                                required
                                label="Product"
                            >
                                {products.map((product) => (
                                    <MenuItem key={product.id} value={product.id}>
                                        {product.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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

export default ProductOptionGroupPage;
