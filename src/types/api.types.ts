export interface CartItemOption {
    id: string;
    createdAt: string;
    updatedAt: string;
    optionId: string;
    option: {
        id: string;
        name: string;
        displayName: string;
        price: number;
        optionGroupId: string;
        createdAt: string;
        updatedAt: string;
    };
}

export interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    totalPrice: number;
    product: {
        id: string;
        name: string;
        description: string;
        price: number;
        categoryId: string;
        createdAt: string;
        updatedAt: string;
    };
    itemOptions: CartItemOption[];
}

export interface Cart {
    id: string;
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
    items: CartItem[];
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
    product: Product;
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

export interface CreateProductOptionRequest {
    name: string;
    displayName: string;
    basePrice: number;
    isActive: boolean;
    optionGroupId: string;

}

export interface UpdateProductOptionRequest {
    name?: string;
    displayName?: string;
    basePrice?: number;
    isActive?: boolean;
    optionGroupId?: string;

}

export interface CreateProductOptionGroupRequest {
    name: string;
    displayName: string;
    productId: string;
}

export interface UpdateProductOptionGroupRequest {
    name?: string;
    displayName?: string;
    productId?: string;
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

export interface CreateProductRequest {
    name: string;
    description: string;
    basePrice: number;
    type?: string;
    isActive?: boolean;
    categoryId: string;
}

export interface UpdateProductRequest {
    name?: string;
    description?: string;
    basePrice?: number;
    type?: string;
    isActive?: boolean;
    categoryId?: string;
}

export interface CreateCategoryRequest {
    name: string;
    description: string;
    isActive: boolean;
}

export interface UpdateCategoryRequest {
    name?: string;
    description?: string;
    isActive?: boolean;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
