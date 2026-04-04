
// // กำหนด Prefix 
const PREFIX_PRODUCTS = '/products';
const PREFIX_SELLER = '/seller';

export const ROUTE = {
    HOME: '/',
    PRODUCTS : {
        ALL_PRODUCTS : PREFIX_PRODUCTS + '/',
        PRODUCT_DETAIL : PREFIX_PRODUCTS + '/[productId]',
    },
    SELLER : {
        ORDER : PREFIX_SELLER + '/sellerorders',
    }
}

