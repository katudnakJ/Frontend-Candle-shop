import { apiClient } from "@/utils/api";
import { GenericResponse } from "@/types/response.type";
import {
  AddShoppingCartItemReq,
  ShoppingCartData,
  AddCartResData,
} from "../shoppingcartInterface";

export const fetchShoppingCart = async (page: number, size: number) => {
  const response = await apiClient.get<GenericResponse<ShoppingCartData>>(
    "/v1/cart",
    { params: { page, size } },
  );

  if (!response || !response.data) {
    throw new Error("No Shopping Cart Data received from API");
  }

  console.log("fetchshoppingcartdata: " , response.data);
  return response.data;
};

const processShoppingCartItem = async (payload: AddShoppingCartItemReq) => {
  const response = await apiClient.post<GenericResponse<AddCartResData>>(
    "/v1/cart",
    payload,
  );
  if (!response ) {
    throw new Error("Failed to Add or Update item to shopping cart");
  }

  return response.data;
};
export const addShoppingCartItem = processShoppingCartItem;
export const updateShoppingCartItem = processShoppingCartItem;

export interface DeleteShoppingCartItemReq {
  shoppingCartId: string;
  shoppingCartItemId: string;
}

export const deleteShoppingCartItem = async (
  payload: DeleteShoppingCartItemReq,
) => {
  const response = await apiClient.delete<GenericResponse<null>>("/v1/cart", {
    data: payload,
  });

  if (!response ) {
    throw new Error("Failed to delete item from shopping cart");
  }

  return response.data;
};
