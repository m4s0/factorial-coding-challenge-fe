export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface CartItemOption {
    id: string;
    cartItem: CartItem;
    cartItemId: string;
    option: ProductOption;
    optionId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CartItem {
    id: string;
    product: Product;
    productId: string;
    quantity: number;
    calculatedPrice: number;
    selectedOptions: CartItemOption[];
    createdAt: Date;
    updatedAt: Date;
    // createdAt: string;
    // updatedAt: string;
}

export interface Cart {
    id: string;
    // user: User;
    userId: string;
    items: CartItem[];
    // createdAt: string;
    // updatedAt: string;
    createdAt: Date;
    updatedAt: Date;
    totalPrice: number;
}

export interface ProductCategory {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    isActive: boolean;
    type: string;
    categoryId: string;
    category?: ProductCategory;
    optionGroups: ProductOptionGroup[];
    createdAt: string;
    updatedAt: string;
}

export interface ProductOptionGroup {
    id: string;
    name: string;
    displayName: string;
    productId: string;
    options: ProductOption[];
    createdAt: string;
    updatedAt: string;
}

export interface ProductOption {
    id: string;
    name: string;
    displayName: string;
    basePrice: number;
    isActive: boolean;
    inStock: boolean;
    optionGroupId: string;
    inventoryItem?: InventoryItem;
    createdAt: string;
    updatedAt: string;
}

export interface InventoryItem {
    id: string;
    quantity: number;
    outOfStock: boolean;
    productOptionId: string;
    createdAt: string;
    updatedAt: string;
}

export interface OptionPriceRule {
    id: string;
    price: number;
    targetOptionId: string;
    dependentOptionId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Order {
    id: string;
    status: OrderStatus;
    totalAmount: number;
    shippingAddress?: string;
    paymentMethod?: string;
    customerId: string;
    items?: OrderItem[];
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    productName: string;
    configuration: string;
    price: number;
    quantity: number;
    createdAt: string;
    updatedAt: string;
}

export interface AddItemRequest {
    productId: string;
    quantity: number;
    optionIds: string[];
}

export interface UpdateItemQuantityRequest {
    quantity: number;
}

export interface AuthResponse {
    accessToken: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
}

export interface ValidateConfigurationResponse {
    isValid: boolean;
}

export interface CalculatePriceResponse {
    price: number;
}
