"use client";

import { Product } from "@/modules/products/types";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import {useState} from "react"

interface ProductCardProps {
  product: Product;
  isRecommended?: boolean;
}

const ProductCard = ({ product, isRecommended = false }: ProductCardProps) => {
  const displayImage =
    product.images?.find((img) => img.is_primary)?.product_img_slug ||
    product.images?.[0]?.product_img_slug ||
    "";

  const getFinalSrc = (slug: string) => {
    if (!slug) return "/placeholder-image.jpg";

    if (slug.startsWith("http://") || slug.startsWith("https://")) {
        const separator = slug.includes("?") ? "&" : "?";
      return `${slug}${separator}w=400&q=80&auto=format&fit=crop`;
    }
    return slug;
  };

  const [imgSrc, setImgSrc] = useState(getFinalSrc(displayImage));

  return (


      <div className="group
      bg-cprojecttwo border border-gray-200 rounded-2xl overflow-hidden shadow-sm
      cursor-pointer
      hover:shadow-lg hover:translate-y-1
      transition-all duration-300">
      <div className="p-3">
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-50">
       

          <Image
            src={imgSrc}
            alt={product.product_name}
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
            className="object-cover" 
            priority={isRecommended} 
            onError={() => setImgSrc("/placeholder-image.svg")} 
          />
          
        </div>
      </div>

      <div className="px-4 pb-4">
        <h3 className="text-sm font-medium text-black line-clamp-1 mb-2">
          {product.product_name}
        </h3>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-red-500 font-bold text-lg">฿{product.price}</p>

            <p className="text-gray-400 text-xs mt-1">
              ขายแล้ว {product.total_selled}
            </p>
          </div>
          {!isRecommended && (
            <button className="p-2 border border-black rounded-lg hover:bg-gray-50 transition-colors">
              <ShoppingCart size={18} className="text-black hover:text-yellow-500 transition-colors"/>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
