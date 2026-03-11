// components/seller/ProductCard.tsx
import { Pencil, Trash2, Package,EyeOff } from "lucide-react";
import { ProductHomeItem } from "@/modules/products/homeproduct";
import Image from "next/image";

interface ShopProductCardProps {
  product: ProductHomeItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isFeatured?: boolean;
}

export default function ShopProductCard({
  product,
  isFeatured = false,
  onEdit,
  onDelete,
}: ShopProductCardProps) {
  return (
    <div
      className={`relative bg-white rounded-2xl p-4 mb-3 flex gap-4 border transition-all ${
        isFeatured
          ? "bordewr-blue-200 shadow-md shadow-blue-50"
          : "border-gray-100 shadow-sm"
      }`}
    >
      {!product.isActive && (
        <div className="absolute top-2 right-2 bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
          หยุดการขายชั่วคราว
        </div>
      )}
      {isFeatured && (
        <div className="absolute -top-2 -left-2 bg-blue-600 text-white p-1 rounded-full shadow-lg">
          <Package size={12} className="" />
        </div>
      )}
      <div className="relative w-20 h-20 bg-gray-50 rounded-xl shrink-0 overflow-hidden border border-gray-100">
        <Image
          src={product.productImgPath || "/placeholder-image.svg"}
          alt={product.productName}
          fill
          unoptimized
          sizes="80px"
          className={`object-cover transition-all duration-300 ${
      !product.isActive ? "grayscale opacity-60" : "hover:scale-105"
    }`} 
        />
        {!product.isActive && (
          <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
            <span className="text-[10px] font-bold bg-white/80 px-1 rounded text-gray-500">
              <EyeOff/>
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-gray-800 truncate font-prompt text-sm">
            {product.productName}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-red-600 font-black font-k2d text-lg">
              ฿{product.price.toLocaleString()}
            </span>
            <span className="text-[10px] text-gray-400 font-k2d">
              ขายแล้ว {product.totalSelled} ชิ้น
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between items-end">
        
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(product.productSlug)}
              className="p-2 text-blue-600 bg-blue-50 rounded-lg"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => onDelete(product.productId)}
              className="p-2 text-red-600 bg-red-50 rounded-lg"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
