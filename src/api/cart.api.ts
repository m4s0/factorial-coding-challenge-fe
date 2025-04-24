import api from './api';
import {AddItemRequest, Cart, UpdateItemQuantityRequest} from '../types/api.types';

export async function getCart(): Promise<Cart> {
    const response = await api.get<Cart>('/cart');
    return response.data;
}

export async function addItem(data: AddItemRequest): Promise<Cart> {
    const response = await api.post<Cart>('/cart/items', data);
    return response.data;
}

export async function updateItemQuantity(itemId: string, data: UpdateItemQuantityRequest): Promise<Cart> {
    const response = await api.patch<Cart>(`/cart/items/${itemId}`, data);
    return response.data;
}

export async function removeItem(itemId: string): Promise<Cart> {
    const response = await api.delete<Cart>(`/cart/items/${itemId}`);
    return response.data;
}
