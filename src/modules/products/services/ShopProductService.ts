
import { apiClient } from "@/utils/api";
import { GenericResponse } from "@/types/response.type";
import {
  CreateProductRequest,
  CreateProductResData,
  ProductHomeResData,
  SearchProductResData,
} from "@/modules/products/homeproduct";
import { ProductDetailResData } from "../detailproduct";

export const getAllShopProducts = async ({
  pageParam,
  size,
}: {
  pageParam?: number;
  size?: number;
}): Promise<ProductHomeResData> => {
  const response = await apiClient.get<
    void,
    GenericResponse<ProductHomeResData>
  >(`/v1/products?page=${pageParam}&size=${size}`);

  return response.data;
};

export const getShopProductsBySearch = async ({
  pageParam,
  size,
  q,
}: {
  pageParam?: number;
  size?: number;
  q: string;
}): Promise<SearchProductResData> => {
  const response = await apiClient.get<
    void,
    GenericResponse<SearchProductResData>
  >(`/v1/products/search?q=${q}&page=${pageParam}&size=${size}`);

  return response.data;
};

export const deleteProduct = async (
  productId: string,
): Promise<GenericResponse<null>> => {

  const response = await apiClient.delete(`/v1/products/${productId}`);

  if (!response) {
    throw new Error("Delete failed: No response from server");
  }
  return response as unknown as GenericResponse<null>;
};

export const createProduct = async (
  payload: CreateProductRequest,
): Promise<GenericResponse<CreateProductResData>> => {
  const formData = new FormData();
  formData.append("productName", String(payload.productName));
  formData.append("price", String(payload.price));
  formData.append("weight", String(payload.weight));
  formData.append("description", String(payload.description));
  formData.append("active", String(payload.active));
  formData.append("featured", String(payload.featured));
  formData.append("primary_index", String(payload.primary_index));

  payload.imagesData.forEach((file) => {
    if (file.size > 0) {
      formData.append("imagesData", file);
    }
  });

  const response = await apiClient.post<
    FormData,
    GenericResponse<CreateProductResData>
  >(`/v1/products`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

export const updateProduct = async (
  productId: string,
  payload: CreateProductRequest,
  deleteImageIds: string[] = [],
  existIntoPrimary: string = "",
): Promise<GenericResponse<CreateProductResData>> => {
  const formData = new FormData();

  formData.append("productName", String(payload.productName));
  formData.append("price", String(payload.price));
  formData.append("weight", String(payload.weight));
  formData.append("description", String(payload.description));
  formData.append("active", String(payload.active));
  formData.append("featured", String(payload.featured));
  formData.append("primaryIndex", String(payload.primary_index));
  if (existIntoPrimary) formData.append("existIntoPrimary", existIntoPrimary);

  deleteImageIds.forEach((id) => {
    formData.append("deleteImageIds", id);
  });

  payload.imagesData.forEach((file) => {
    if (file.size > 0) {
      formData.append("imagesData", file);
    }
  });

  const response = await apiClient.put<
    FormData,
    GenericResponse<CreateProductResData>
  >(`/v1/products/${productId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

export const getProductDetailById = async (
  productId: string,
): Promise<ProductDetailResData> => {
  const response = await apiClient.get<
    void,
    GenericResponse<ProductDetailResData>
  >(`/v1/products/${productId}`);
  return response.data;
};
