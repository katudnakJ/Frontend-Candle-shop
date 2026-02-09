import { ALL } from "dns";

// // กำหนด Prefix 
const PREFIX_PRODUCTS = '/products';

export const ROUTE = {
    HOME: '/',
    PRODUCTS : {
        ALL_PRODUCTS : PREFIX_PRODUCTS + '/',
        PRODUCT_DETAIL : PREFIX_PRODUCTS + '/[productId]',
    }
}

