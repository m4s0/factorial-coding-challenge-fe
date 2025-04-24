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
    FormControlLabel,
    IconButton,
    Paper,
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
import {createCategory, deleteCategory, getCategories, updateCategory} from '../api/categories.api';
import {Category} from '../types/api.types';

const ProductCategoryPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const emptyFormData = {
        name: '',
        description: '',
        isActive: true
    };

    const [editFormData, setEditFormData] = useState(emptyFormData);
    const [createFormData, setCreateFormData] = useState(emptyFormData);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            setError('Failed to load categories');
        }
    };

    const handleCreateClick = () => {
        setCreateFormData(emptyFormData);
        setIsCreateModalOpen(true);
    };

    const handleEditClick = (category: Category) => {
        setSelectedCategory(category);
        setEditFormData({
            name: category.name,
            description: category.description,
            isActive: category.isActive
        });
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = async (categoryId: string) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategory(categoryId);
                await fetchCategories();
                setSuccess('Category deleted successfully');
                setTimeout(() => setSuccess(null), 3000);
            } catch (err) {
                setError('Failed to delete category');
            }
        }
    };

    const handleFormChange = (
        setState: React.Dispatch<React.SetStateAction<typeof emptyFormData>>,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const {name, value, type, checked} = e.target;
        setState(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await createCategory(createFormData);
            await fetchCategories();
            setIsCreateModalOpen(false);
            setSuccess('Category created successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to create category');
        } finally {
            setLoading(false);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategory) return;

        setLoading(true);
        try {
            await updateCategory(selectedCategory.id, editFormData);
            await fetchCategories();
            setIsEditModalOpen(false);
            setSuccess('Category updated successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to update category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{p: 3}}>
            {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
            {success && <Alert severity="success" sx={{mb: 2}}>{success}</Alert>}

            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                <Typography variant="h5">Product Categories</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon/>}
                    onClick={handleCreateClick}
                >
                    Create Category
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>{category.description}</TableCell>
                                <TableCell>{category.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEditClick(category)}>
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteClick(category.id)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Create Modal */}
            <Dialog open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="sm" fullWidth>
                <form onSubmit={handleCreateSubmit}>
                    <DialogTitle>Create Category</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Category Name"
                            name="name"
                            value={createFormData.name}
                            onChange={(e) => handleFormChange(setCreateFormData, e)}
                            required
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={createFormData.description}
                            onChange={(e) => handleFormChange(setCreateFormData, e)}
                            required
                            multiline
                            rows={4}
                            margin="normal"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={createFormData.isActive}
                                    onChange={(e) => handleFormChange(setCreateFormData, e)}
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

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="sm" fullWidth>
                <form onSubmit={handleEditSubmit}>
                    <DialogTitle>Edit Category</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Category Name"
                            name="name"
                            value={editFormData.name}
                            onChange={(e) => handleFormChange(setEditFormData, e)}
                            required
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={editFormData.description}
                            onChange={(e) => handleFormChange(setEditFormData, e)}
                            required
                            multiline
                            rows={4}
                            margin="normal"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={editFormData.isActive}
                                    onChange={(e) => handleFormChange(setEditFormData, e)}
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

export default ProductCategoryPage;
