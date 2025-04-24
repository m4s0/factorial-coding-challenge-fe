import api from './api';
import {Category, CreateCategoryRequest, UpdateCategoryRequest,} from '../types/api.types';

export async function getCategories(categoryName?: string): Promise<Category[]> {
    const response = await api.get<Category[]>('/product-categories',
        {
            params: categoryName ? new URLSearchParams({categoryName}) : undefined,
        }
    );

    return response.data;
}

export async function getCategory(categoryId: string): Promise<Category> {
    const response = await api.get<Category>(`/product-categories/${categoryId}`);
    return response.data;
}

export async function createCategory(data: CreateCategoryRequest): Promise<Category> {
    const response = await api.post<Category>('/product-categories', data);
    return response.data;
}

export async function updateCategory(categoryId: string, data: UpdateCategoryRequest): Promise<Category> {
    const response = await api.patch<Category>(`/product-categories/${categoryId}`, data);
    return response.data;
}

export async function deleteCategory(categoryId: string): Promise<Category> {
    const response = await api.delete<Category>(`/product-categories/${categoryId}`);
    return response.data;
}
