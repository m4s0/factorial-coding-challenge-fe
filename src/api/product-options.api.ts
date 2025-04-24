import api from './api';
import {CreateProductOptionRequest, ProductOption} from '../types/api.types';

export async function getProductOptions(): Promise<ProductOption[]> {
    const response = await api.get<ProductOption[]>('/product-options');
    return response.data;
}

export async function getProductOption(productOptionId: string): Promise<ProductOption> {
    const response = await api.get<ProductOption>(`/product-options/${productOptionId}`);
    return response.data;
}

export async function createProductOption(data: CreateProductOptionRequest): Promise<ProductOption> {
    const response = await api.post<ProductOption>('/product-options', data);
    return response.data;
}

export async function updateProductOption(productOptionId: string, data: CreateProductOptionRequest): Promise<ProductOption> {
    const response = await api.patch<ProductOption>(`/product-options/${productOptionId}`, data);
    return response.data;
}

export async function deleteProductOption(productOptionId: string): Promise<ProductOption> {
    const response = await api.delete<ProductOption>(`/product-options/${productOptionId}`);
    return response.data;
}
