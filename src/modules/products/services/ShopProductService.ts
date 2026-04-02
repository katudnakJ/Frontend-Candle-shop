// services/product.service.ts


import { apiClient } from "@/utils/api";
import { GenericResponse } from "@/types/response.type";
import { CreateProductRequest, CreateProductResData, ProductHomeResData,SearchProductResData } from "@/modules/products/homeproduct";
import { ProductDetailResData } from "../detailproduct";



export const getAllShopProducts = async ({pageParam, size}:{ pageParam?: number , size?:number }): Promise<ProductHomeResData> => {

  
  const response = await apiClient.get<void, GenericResponse<ProductHomeResData>>(
    `/v1/products?page=${pageParam}&size=${size}`
  );

  return response.data;
};

export const getShopProductsBySearch = async ({pageParam, size, q}:{ pageParam?: number , size?:number, q: string }): Promise<SearchProductResData> => {

  
  const response = await apiClient.get<void, GenericResponse<SearchProductResData>>(
    `/v1/products/search?q=${q}&page=${pageParam}&size=${size}`
  );

  return response.data;
};



export const deleteProduct = async (productId: string): Promise<GenericResponse<null>> => {
  console.log(`Sending DELETE request for product: ${productId}`);

const response = await apiClient.delete(`/v1/products/${productId}`);

  if (!response) {
    throw new Error("Delete failed: No response from server");
  }
  console.log("DELETERESPRODUCT",response);
  console.log("DELETEPRODUCT",response.data);
 return response as unknown as GenericResponse<null>;
};

export const createProduct = async (
  payload: CreateProductRequest
): Promise<GenericResponse<CreateProductResData>> => {
  const formData = new FormData();
  formData.append("productName", payload.productName);
  formData.append("description", payload.description);
  formData.append("price", String(payload.price));
  formData.append("weight", String(payload.weight));
  formData.append("active", String(payload.active));
  formData.append("featured", String(payload.featured));
  formData.append("primary_index", String(payload.primary_index));

  payload.imagesData.forEach((file) => {
    if (file.size > 0) {
      formData.append("imagesData", file);
    }
  });

 if(process.env.NODE_ENV === "development"){ 
  console.log("--- 🖼️ Image Data Inspection ---");

formData.getAll("imagesData").forEach((file, index) => {
  if (file instanceof File) {
    const sizeInBytes = file.size;
    const sizeInKB = (sizeInBytes / 1024 ).toFixed(2);
    
    console.log(`[Image ${index}]`);
    console.log(`- Name: ${file.name}`);
    console.log(`- Type: ${file.type}`);
    console.log(`- Size: ${sizeInBytes} bytes (${sizeInKB} KB)`);
  }
});

console.log("--- 📝 Form Fields Check ---");
const formFields = Object.fromEntries(
  Array.from(formData.entries()).filter(([_, value]) => !(value instanceof File))
);
console.log(formFields);
 }



  const response = await apiClient.post<FormData, GenericResponse<CreateProductResData>>(
    `/v1/products`,
    formData,
    {
      params: {
        productName: payload.productName,
        price: payload.price,
        weight: payload.weight,
        description: payload.description,
        active: payload.active,
        featured: payload.featured,
        primary_index: payload.primary_index,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response;
};


export const getProductDetailById = async (productId: string): Promise<ProductDetailResData> => {
  const response = await apiClient.get<void, GenericResponse<ProductDetailResData>>(
    `/v1/products/${productId}`
  );
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



