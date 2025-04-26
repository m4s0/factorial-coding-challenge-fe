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
    SelectChangeEvent,
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
    createOptionPriceRuleResponse,
    deleteOptionPriceRuleResponse,
    getOptionPriceRuleResponses,
    updateOptionPriceRuleResponse
} from '../api/option-price-rules.api';
import {
    CreateOptionPriceRuleRequest,
    OptionPriceRuleResponse,
    ProductOption,
    UpdateOptionPriceRuleRequest
} from '../types/api.types';
import {getProductOptions} from '../api/product-options.api';
import {formatPrice} from "../utils/formatPrice.ts";

const OptionPriceRulePage: React.FC = () => {
    const [optionPriceRules, setOptionPriceRules] = useState<OptionPriceRuleResponse[]>([]);
    const [options, setOptions] = useState<ProductOption[]>([]);
    const [selectedRule, setSelectedRule] = useState<OptionPriceRuleResponse | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const emptyFormData = {
        price: 0,
        targetOptionId: '',
        dependentOptionId: '',
        isActive: true
    };
    const [editFormData, setEditFormData] = useState<UpdateOptionPriceRuleRequest>(emptyFormData);
    const [createFormData, setCreateFormData] = useState<CreateOptionPriceRuleRequest>(emptyFormData);

    useEffect(() => {
        Promise.all([
            fetchOptionPriceRules(),
            fetchOptions()
        ]).catch(error => {
            setError('Failed to load initial data');
            console.error(error);
        });
    }, []);

    const fetchOptions = async () => {
        try {
            const optionsData = await getProductOptions();
            setOptions(optionsData);
        } catch (err) {
            console.error('Failed to load options:', err);
            setError('Failed to load options');
        }
    };

    const fetchOptionPriceRules = async () => {
        try {
            const rulesData = await getOptionPriceRuleResponses();
            setOptionPriceRules(rulesData);
        } catch (err) {
            console.error('Failed to load price rules:', err);
            setError('Failed to load price rules');
        }
    };

    const handleCreateClick = () => {
        setCreateFormData(emptyFormData);
        setIsCreateModalOpen(true);
    };

    const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent) => {
        const {name, value} = e.target;
        setCreateFormData(prev => ({
            ...prev,
            [name as string]: name === 'price' ? Number(value) : value,
            isActive: prev.isActive
        }));
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await createOptionPriceRuleResponse(createFormData);
            await fetchOptionPriceRules();
            setIsCreateModalOpen(false);
            setSuccess('Price rule created successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Failed to create price rule:', err);
            setError('Failed to create price rule');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (rule: OptionPriceRuleResponse) => {
        setSelectedRule(rule);
        setEditFormData({
            price: rule.price,
            targetOptionId: rule.targetOptionId,
            dependentOptionId: rule.dependentOptionId,
            isActive: rule.isActive
        });
        setIsEditModalOpen(true);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent) => {
        const {name, value} = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name as string]: name === 'price' ? Number(value) : value,
        }));
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRule) return;

        setLoading(true);
        try {
            await updateOptionPriceRuleResponse(selectedRule.id, editFormData);
            await fetchOptionPriceRules();
            setIsEditModalOpen(false);
            setSuccess('Price rule updated successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Failed to update price rule:', err);
            setError('Failed to update price rule');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = async (ruleId: string) => {
        if (window.confirm('Are you sure you want to delete this price rule?')) {
            try {
                await deleteOptionPriceRuleResponse(ruleId);
                await fetchOptionPriceRules();
                setSuccess('Price rule deleted successfully');
                setTimeout(() => setSuccess(null), 3000);
            } catch (err) {
                console.error('Failed to delete price rule:', err);
                setError('Failed to delete price rule');
            }
        }
    };

    return (
        <Box sx={{p: 3}}>
            {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
            {success && <Alert severity="success" sx={{mb: 2}}>{success}</Alert>}

            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                <Typography variant="h5">Option Price Rules</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon/>}
                    onClick={handleCreateClick}
                >
                    Create Price Rule
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Target Option</TableCell>
                            <TableCell>Dependent Option</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {optionPriceRules.map((rule) => (
                            <TableRow key={rule.id}>
                                <TableCell>{rule.targetOption?.displayName}</TableCell>
                                <TableCell>{rule.dependentOption?.displayName}</TableCell>
                                <TableCell>{formatPrice(rule.price)}</TableCell>
                                <TableCell>{rule.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEditClick(rule)}>
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteClick(rule.id)}>
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
                    <DialogTitle>Create Price Rule</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Target Option</InputLabel>
                            <Select
                                name="targetOptionId"
                                value={createFormData.targetOptionId}
                                onChange={handleCreateChange}
                                required
                                label="Target Option"
                            >
                                {options.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.displayName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Dependent Option</InputLabel>
                            <Select
                                name="dependentOptionId"
                                value={createFormData.dependentOptionId}
                                onChange={handleCreateChange}
                                required
                                label="Dependent Option"
                            >
                                {options.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.displayName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Price"
                            name="price"
                            type="number"
                            value={createFormData.price}
                                onChange={handleCreateChange}
                            required
                            inputProps={{step: "0.01"}}
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
                    <DialogTitle>Edit Price Rule</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Target Option</InputLabel>
                            <Select
                                name="targetOptionId"
                                value={editFormData.targetOptionId}
                                onChange={handleEditChange}
                                required
                                label="Target Option"
                            >
                                {options.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.displayName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Dependent Option</InputLabel>
                            <Select
                                name="dependentOptionId"
                                value={editFormData.dependentOptionId}
                                onChange={handleEditChange}
                                required
                                label="Dependent Option"
                            >
                                {options.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.displayName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Price"
                            name="price"
                            type="number"
                            value={editFormData.price}
                            onChange={handleEditChange}
                            required
                            inputProps={{step: "0.01"}}
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

export default OptionPriceRulePage;
