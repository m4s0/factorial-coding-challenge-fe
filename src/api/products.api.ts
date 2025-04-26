import api from './api';
import {
    CreateProductRequest,
    Product,
    UpdateProductRequest,
} from '../types/api.types';

function buildQueryParams(optionIds: string[]) {
    const urlSearchParams = new URLSearchParams({})
    optionIds.forEach(id => urlSearchParams.append('optionIds', id));

    return urlSearchParams;
}

export async function getProducts(): Promise<Product[]> {
    const response = await api.get<Product[]>('/products');
    return response.data;
}

export async function getProduct(productId: string): Promise<Product> {
    const response = await api.get<Product>(`/products/${productId}`);
    return response.data;
}

export async function getProductWithOptions(productId: string, optionIds: string[]): Promise<Product> {
    const response = await api.get<Product>(`/products/${productId}/with-options`, {
            params: buildQueryParams(optionIds),
        }
    );

    return response.data;
}

export async function createProduct(data: CreateProductRequest): Promise<Product> {
    const response = await api.post<Product>('/products', data);
    return response.data;
}

export async function updateProduct(productId: string, data: UpdateProductRequest): Promise<Product> {
    const response = await api.patch<Product>(`/products/${productId}`, data);
    return response.data;
}

export async function deleteProduct(productId: string): Promise<Product> {
    const response = await api.delete<Product>(`/products/${productId}`);
    return response.data;
}
