import api from './api';
import {CreateOptionRuleRequest, UpdateOptionRuleRequest, OptionRuleResponse} from '../types/api.types';

export async function getOptionRuleResponses(): Promise<OptionRuleResponse[]> {
    const response = await api.get<OptionRuleResponse[]>('/option-rules');
    return response.data;
}

export async function getOptionRuleResponse(optionRuleId: string): Promise<OptionRuleResponse> {
    const response = await api.get<OptionRuleResponse>(`/option-rules/${optionRuleId}`);
    return response.data;
}

export async function createOptionRuleResponse(data: CreateOptionRuleRequest): Promise<OptionRuleResponse> {
    const response = await api.post<OptionRuleResponse>('/option-rules', data);
    return response.data;
}

export async function updateOptionRuleResponse(optionRuleId: string, data: UpdateOptionRuleRequest): Promise<OptionRuleResponse> {
    const response = await api.patch<OptionRuleResponse>(`/option-rules/${optionRuleId}`, data);
    return response.data;
}

export async function deleteOptionRuleResponse(optionRuleId: string): Promise<OptionRuleResponse> {
    const response = await api.delete<OptionRuleResponse>(`/option-rules/${optionRuleId}`);
    return response.data;
}
