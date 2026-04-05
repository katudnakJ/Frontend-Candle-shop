
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
  console.log(`Sending DELETE request for product: ${productId}`);

  const response = await apiClient.delete(`/v1/products/${productId}`);

  if (!response) {
    throw new Error("Delete failed: No response from server");
  }
  console.log("DELETERESPRODUCT", response);
  console.log("DELETEPRODUCT", response.data);
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

  if (process.env.NODE_ENV === "development") {
    console.log("3. DATA in FormData:");
    const images = formData.getAll("imagesData");
    if (images.length === 0) console.log("   - No new images uploaded");
    images.forEach((file, i) =>
      console.log(`   - File[${i}]:`, (file as File).name),
    );

    console.log("--- 📦 Full FormData Content ---");
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(` > ${key}: [File] ${value.name}`);
      } else {
        console.log(` > ${key}: ${value}`);
      }
    });

    console.log("==============================================");
  }

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

  if (process.env.NODE_ENV === "development") {
    console.log("===== 🔍 DEBUG: UPDATE PRODUCT API CALL =====");
    console.log("1. Product ID:", productId);

    console.log("2. Query Params:", {
      productName: payload.productName,
      price: payload.price,
      weight: payload.weight,
      description: payload.description,
      active: payload.active,
      featured: payload.featured,
      primaryIndex: payload.primary_index,
      existIntoPrimary: existIntoPrimary,
      deleteImageIds: deleteImageIds,
    });

    console.log("3. DATA in FormData:");
    const images = formData.getAll("imagesData");
    if (images.length === 0) console.log("   - No new images uploaded");
    images.forEach((file, i) =>
      console.log(`   - File[${i}]:`, (file as File).name),
    );

    let count = 0;
    for (const pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
      count++;
    }
    console.log("Total parts in FormData:", count);

    console.log("--- 📦 Full FormData Content ---");
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(` > ${key}: [File] ${value.name}`);
      } else {
        console.log(` > ${key}: ${value}`);
      }
    });

    console.log("==============================================");
  }

  const response = await apiClient.put<
    FormData,
    GenericResponse<CreateProductResData>
  >(`/v1/products/${productId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      console.log(
        `Upload Progress: ${progressEvent.loaded} / ${progressEvent.total}`,
      );
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

export const toggleProductStatus = async (
  productId: string,
  currentStatus: boolean,
) => {
  console.log(
    `Toggling status for ${productId} from ${currentStatus} to ${!currentStatus}`,
  );
  return { success: true };
};
