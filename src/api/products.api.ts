import api from './api';
import {CalculatePriceResponse, Product, ValidateConfigurationResponse} from '../types/api.types';

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
        `/product-configuration/${productId}/validate`, {
            params: buildQueryParams(optionIds),
        }
    );

    return response.data;
}

export async function calculatePrice(productId: string, optionIds: string[]): Promise<CalculatePriceResponse> {
    const response = await api.get<CalculatePriceResponse>(
        `/product-configuration/${productId}/price`, {
            params: buildQueryParams(optionIds),
        }
    );

    return response.data;
}
