import api from './api';
import {CreateOptionPriceRuleRequest, UpdateOptionPriceRuleRequest, OptionPriceRuleResponse} from '../types/api.types';

export async function getOptionPriceRuleResponses(): Promise<OptionPriceRuleResponse[]> {
    const response = await api.get<OptionPriceRuleResponse[]>('/option-price-rules');
    return response.data;
}

export async function getOptionPriceRuleResponse(optionPriceRuleId: string): Promise<OptionPriceRuleResponse> {
    const response = await api.get<OptionPriceRuleResponse>(`/option-price-rules/${optionPriceRuleId}`);
    return response.data;
}

export async function createOptionPriceRuleResponse(data: CreateOptionPriceRuleRequest): Promise<OptionPriceRuleResponse> {
    const response = await api.post<OptionPriceRuleResponse>('/option-price-rules', data);
    return response.data;
}

export async function updateOptionPriceRuleResponse(optionPriceRuleId: string, data: UpdateOptionPriceRuleRequest): Promise<OptionPriceRuleResponse> {
    const response = await api.patch<OptionPriceRuleResponse>(`/option-price-rules/${optionPriceRuleId}`, data);
    return response.data;
}

export async function deleteOptionPriceRuleResponse(optionPriceRuleId: string): Promise<OptionPriceRuleResponse> {
    const response = await api.delete<OptionPriceRuleResponse>(`/option-price-rules/${optionPriceRuleId}`);
    return response.data;
}
