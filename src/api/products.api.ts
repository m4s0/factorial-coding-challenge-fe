import api from './api';
import {
    CalculatePriceResponse,
    CreateProductRequest,
    Product,
    UpdateProductRequest,
    ValidateConfigurationResponse
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

export async function validateConfiguration(productId: string, optionIds: string[]): Promise<ValidateConfigurationResponse> {
    const response = await api.get<ValidateConfigurationResponse>(
        `/products/${productId}/validate`, {
            params: buildQueryParams(optionIds),
        }
    );

    return response.data;
}

export async function calculatePrice(productId: string, optionIds: string[]): Promise<CalculatePriceResponse> {
    const response = await api.get<CalculatePriceResponse>(
        `/products/${productId}/price`, {
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
