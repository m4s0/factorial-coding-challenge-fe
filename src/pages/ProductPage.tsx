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
import {createProduct, deleteProduct, getProducts, updateProduct} from '../api/products.api';
import {getCategories} from '../api/categories.api';
import {Category, CreateProductRequest, Product, UpdateProductRequest} from '../types/api.types';
import {formatPrice} from "../utils/formatPrice.ts";

const ProductPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const emptyFormData = {
        name: '',
        description: '',
        basePrice: 0,
        isActive: true,
        categoryId: ''
    };
    const [editFormData, setEditFormData] = useState<UpdateProductRequest>(emptyFormData);
    const [createFormData, setCreateFormData] = useState<CreateProductRequest>(emptyFormData);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const productsData = await getProducts();
            setProducts(productsData);
        } catch (err) {
            setError('Failed to load products');
        }
    };

    const fetchCategories = async () => {
        try {
            const categoriesData = await getCategories();
            setCategories(categoriesData);
        } catch (err) {
            setError('Failed to load categories');
        }
    };

    const handleCreateClick = () => {
        setCreateFormData(emptyFormData);
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
        setError(null);

        try {
            await createProduct(createFormData);
            await fetchProducts();
            setIsCreateModalOpen(false);
            setSuccess('Product created successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (product: Product) => {
        setSelectedProduct(product);
        setEditFormData({
            name: product.name,
            description: product.description,
            basePrice: product.basePrice,
            isActive: product.isActive,
            categoryId: product.categoryId
        });
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = async (productId: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(productId);
                await fetchProducts();
            } catch (err) {
                setError('Failed to delete product');
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
        if (!selectedProduct) return;

        setLoading(true);
        try {
            await updateProduct(selectedProduct.id, editFormData);
            await fetchProducts();
            setIsEditModalOpen(false);
        } catch (err) {
            setError('Failed to update product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{p: 3}}>
            {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
            {success && <Alert severity="success" sx={{mb: 2}}>{success}</Alert>}

            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                <Typography variant="h5">Products</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon/>}
                    onClick={handleCreateClick}
                >
                    Create Product
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.description}</TableCell>
                                <TableCell>{formatPrice(product.basePrice)}</TableCell>
                                <TableCell>
                                    {categories.find(c => c.id === product.categoryId)?.name}
                                </TableCell>
                                <TableCell>{product.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEditClick(product)}>
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteClick(product.id)}>
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
                    <DialogTitle>Create Product</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Product Name"
                            name="name"
                            value={createFormData.name}
                            onChange={handleCreateChange}
                            required
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={createFormData.description}
                            onChange={handleCreateChange}
                            required
                            multiline
                            rows={4}
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
                            <InputLabel>Category</InputLabel>
                            <Select
                                name="categoryId"
                                value={createFormData.categoryId}
                                onChange={handleCreateChange}
                                required
                                label="Category"
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
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
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Product Name"
                            name="name"
                            value={editFormData.name}
                            onChange={handleEditChange}
                            required
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={editFormData.description}
                            onChange={handleEditChange}
                            required
                            multiline
                            rows={4}
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
                            <InputLabel>Category</InputLabel>
                            <Select
                                name="categoryId"
                                value={editFormData.categoryId}
                                onChange={handleEditChange}
                                required
                                label="Category"
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
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

export default ProductPage;
