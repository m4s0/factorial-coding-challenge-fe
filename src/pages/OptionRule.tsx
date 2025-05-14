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
    Typography
} from '@mui/material';
import {Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon} from '@mui/icons-material';
import {
    createOptionRuleResponse,
    deleteOptionRuleResponse,
    getOptionRuleResponses,
    updateOptionRuleResponse
} from '../api/option-rules.api';
import {
    CreateOptionRuleRequest,
    OptionRuleResponse,
    ProductOption,
    RuleType,
    UpdateOptionRuleRequest
} from '../types/api.types';
import {getProductOptions} from '../api/product-options.api';

const OptionRulePage: React.FC = () => {
    const [optionRules, setOptionRules] = useState<OptionRuleResponse[]>([]);
    const [options, setOptions] = useState<ProductOption[]>([]);
    const [selectedRule, setSelectedRule] = useState<OptionRuleResponse | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const emptyFormData = {
        ifOptionId: '',
        thenOptionId: '',
        ruleType: RuleType.REQUIRES
    };
    const [editFormData, setEditFormData] = useState<UpdateOptionRuleRequest>(emptyFormData);
    const [createFormData, setCreateFormData] = useState<CreateOptionRuleRequest>(emptyFormData);

    useEffect(() => {
        Promise.all([
            fetchOptionRules(),
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

    const fetchOptionRules = async () => {
        try {
            const rulesData = await getOptionRuleResponses();
            setOptionRules(rulesData);
        } catch (err) {
            console.error('Failed to load option rules:', err);
            setError('Failed to load option rules');
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
            [name]: value
        }));
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await createOptionRuleResponse(createFormData);
            await fetchOptionRules();
            setIsCreateModalOpen(false);
            setSuccess('Option rule created successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Failed to create option rule:', err);
            setError('Failed to create option rule');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (rule: OptionRuleResponse) => {
        setSelectedRule(rule);
        setEditFormData({
            ifOptionId: rule.ifOptionId,
            thenOptionId: rule.thenOptionId,
            ruleType: rule.ruleType
        });
        setIsEditModalOpen(true);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent) => {
        const {name, value} = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRule) return;

        setLoading(true);
        try {
            await updateOptionRuleResponse(selectedRule.id, editFormData);
            await fetchOptionRules();
            setIsEditModalOpen(false);
            setSuccess('Option rule updated successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Failed to update option rule:', err);
            setError('Failed to update option rule');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = async (ruleId: string) => {
        if (window.confirm('Are you sure you want to delete this option rule?')) {
            try {
                await deleteOptionRuleResponse(ruleId);
                await fetchOptionRules();
                setSuccess('Option rule deleted successfully');
                setTimeout(() => setSuccess(null), 3000);
            } catch (err) {
                console.error('Failed to delete option rule:', err);
                setError('Failed to delete option rule');
            }
        }
    };

    return (
        <Box sx={{p: 3}}>
            {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
            {success && <Alert severity="success" sx={{mb: 2}}>{success}</Alert>}

            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                <Typography variant="h5">Option Rules</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon/>}
                    onClick={handleCreateClick}
                >
                    Create Option Rule
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>If Option</TableCell>
                            <TableCell>Then Option</TableCell>
                            <TableCell>Rule Type</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {optionRules.map((rule) => (
                            <TableRow key={rule.id}>
                                <TableCell>{rule.id}</TableCell>
                                <TableCell>{rule.ifOption?.displayName}</TableCell>
                                <TableCell>{rule.thenOption?.displayName}</TableCell>
                                <TableCell>{rule.ruleType}</TableCell>
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
                    </TableBody> </Table>
            </TableContainer>

            <Dialog open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="sm" fullWidth>
                <form onSubmit={handleCreateSubmit}>
                    <DialogTitle>Create Option Rule</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Rule Type</InputLabel>
                            <Select
                                name="ruleType"
                                value={createFormData.ruleType}
                                onChange={handleCreateChange}
                                required
                                label="Rule Type"
                            >
                                {Object.values(RuleType).map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type.replace('_', ' ').toLowerCase()}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>If Option</InputLabel>
                            <Select
                                name="ifOptionId"
                                value={createFormData.ifOptionId}
                                onChange={handleCreateChange}
                                required
                                label="If Option"
                            >
                                {options.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.displayName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Then Option</InputLabel>
                            <Select
                                name="thenOptionId"
                                value={createFormData.thenOptionId}
                                onChange={handleCreateChange}
                                required
                                label="Then Option"
                            >
                                {options.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.displayName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent> <DialogActions>
                    <Button onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24}/> : 'Create'}
                    </Button>
                </DialogActions>
                </form>
            </Dialog>

            <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="sm" fullWidth>
                <form onSubmit={handleEditSubmit}>
                    <DialogTitle>Edit Option Rule</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Rule Type</InputLabel>
                            <Select
                                name="ruleType"
                                value={editFormData.ruleType}
                                onChange={handleEditChange}
                                required
                                label="Rule Type"
                            >
                                {Object.values(RuleType).map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type.replace('_', ' ').toLowerCase()}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>If Option</InputLabel>
                            <Select
                                name="ifOptionId"
                                value={editFormData.ifOptionId}
                                onChange={handleEditChange}
                                required
                                label="If Option"
                            >
                                {options.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.displayName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Then Option</InputLabel>
                            <Select
                                name="thenOptionId"
                                value={editFormData.thenOptionId}
                                onChange={handleEditChange}
                                required
                                label="Then Option"
                            >
                                {options.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.displayName}
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

export default OptionRulePage;
