import api from './api';
import {CreateProductOptionGroupRequest, ProductOptionGroup, UpdateProductOptionGroupRequest} from '../types/api.types';

export async function getProductOptionGroups(): Promise<ProductOptionGroup[]> {
    const response = await api.get<ProductOptionGroup[]>('/product-option-groups');
    return response.data;
}

export async function getProductOptionGroup(productOptionGroupId: string): Promise<ProductOptionGroup> {
    const response = await api.get<ProductOptionGroup>(`/product-option-groups/${productOptionGroupId}`);
    return response.data;
}

export async function createProductOptionGroup(data: CreateProductOptionGroupRequest): Promise<ProductOptionGroup> {
    const response = await api.post<ProductOptionGroup>('/product-option-groups', data);
    return response.data;
}

export async function updateProductOptionGroup(productOptionGroupId: string, data: UpdateProductOptionGroupRequest): Promise<ProductOptionGroup> {
    const response = await api.patch<ProductOptionGroup>(`/product-option-groups/${productOptionGroupId}`, data);
    return response.data;
}

export async function deleteProductOptionGroup(productOptionGroupId: string): Promise<ProductOptionGroup> {
    const response = await api.delete<ProductOptionGroup>(`/product-option-groups/${productOptionGroupId}`);
    return response.data;
}
