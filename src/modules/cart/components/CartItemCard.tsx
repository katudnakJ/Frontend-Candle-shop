import { Trash2, Plus, Minus } from "lucide-react";
import { ShoppingCartItem } from "@/modules/cart/types";
import Image from "next/image";

interface CartItemProps {
  item: ShoppingCartItem;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  image: string;
}

export const CartItemCard = ({ item, isSelected, onToggle, onUpdateQty, onRemove, image }: CartItemProps) => (
  <div className="flex gap-4 p-4 border-2 border-black rounded-3xl  bg-white">
    <div className="flex items-center">
      <input 
        type="checkbox" 
        checked={isSelected}
        onChange={() => onToggle(item.Shopping_Cart_Item_id)}
        className="w-5 h-5 accent-green-600 cursor-pointer"
      />
    </div>

    <div className="relative w-24 h-24 md:w-32 md:h-32 border-2 border-black rounded-2xl overflow-hidden bg-gray-50 shrink-0">
    
    <Image
   src={image} 
      alt={item.product?.product_name || "Product Image"}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 96px, 128px"
      priority={false}
    />
    
    </div>

    <div className="flex flex-col justify-between flex-1 min-w-0">
      <div className="flex max-[360px]:flex-col justify-between items-start gap-2">
        <h3 className="font-black text-sm md:text-lg min-[360px]:truncate uppercase">{item.product?.product_name}</h3>
        <button onClick={() => onRemove(item.Shopping_Cart_Item_id)} className="text-black hover:text-red-500 transition-colors">
          <Trash2 className="w-5 h-5 cursor-pointer" />
        </button>
      </div>

      <div className="flex max-[360px]:flex-col justify-between items-end mt-2">
        <p className="font-black text-lg md:text-xl">฿{item.product?.price}</p>
        
        <div className="flex items-center border-2 border-black rounded-xl overflow-hidden bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <button onClick={() => onUpdateQty(item.Shopping_Cart_Item_id, -1)} className="px-2 py-1 hover:bg-black hover:text-white transition-colors">
            <Minus className="w-4 h-4 cursor-pointer" />
          </button>
          <span className="px-3 font-black border-x-2 border-black bg-gray-50">{item.quantity}</span>
          <button onClick={() => onUpdateQty(item.Shopping_Cart_Item_id, 1)} className="px-2 py-1 hover:bg-black hover:text-white transition-colors">
            <Plus className="w-4 h-4 cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  </div>
);