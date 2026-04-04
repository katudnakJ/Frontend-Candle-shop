"use client";

import { Trash2, Plus, Minus } from "lucide-react";

import ConfirmDialog from "@/components/commonui/ConfirmDialog";
import { useState } from "react";
import { CartItem } from "../shoppingcartInterface";
import { SmartImage } from "@/components/commonui/SmartImage";
import { CurrencyDisplay } from "@/utils/CurrencyDisplay";

interface CartItemProps {
  item: CartItem;
  isSelected: boolean;
  isCheckout?: boolean;
  onToggle: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  image: string;
  max?: number;
  min?: number;
}

export const CartItemCard = ({
  item,
  isSelected,
  isCheckout = false,
  onToggle,
  onUpdateQty,
  onRemove,
  image,
  max = 1000,
  min = 1,
}: CartItemProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string | number>(item.quantity);
  const [prevQuantity, setPrevQuantity] = useState(item.quantity);
  const handleRemoveClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmRemove = () => {
    onRemove(item.shoppingCartItemId);
    setIsDialogOpen(false);
  };

  if (item.quantity !== prevQuantity) {
    setPrevQuantity(item.quantity);
    setInputValue(item.quantity === 0 ? "" : item.quantity);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      setInputValue("");
      return;
    }

    const num = parseInt(val);
    if (!isNaN(num)) {

      let finalVal = num;
      if (num > max) finalVal = max;

      setInputValue(finalVal);

      onUpdateQty(item.shoppingCartItemId, finalVal - item.quantity);
    }
  };


  const handleBlur = () => {
    if (item.quantity < min || inputValue === "") {
      onUpdateQty(item.shoppingCartItemId, min - item.quantity);
      setInputValue(min);
    } else if (item.quantity > max) {
      onUpdateQty(item.shoppingCartItemId, max);
      setInputValue(max);
    }
  };

  return (
    <>
      <div
        className="flex gap-4 p-4 border-2 border-black rounded-3xl  bg-white shadow-amber-100 hover:shadow-lg hover:translate-y-1
      transition-all duration-300"
      >
        {!isCheckout && (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggle(item.shoppingCartItemId)}
              className="w-5 h-5 accent-green-600 cursor-pointer"
            />
          </div>
        )}

        <div className="relative w-24 h-24 md:w-32 md:h-32 border-2 border-black rounded-2xl overflow-hidden bg-gray-50 shrink-0">
          <SmartImage
            key={image}
            src={image}
            alt={item.productName || "Product Image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 96px, 128px"
          />
        </div>

        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div className="flex  justify-between items-start gap-2">
            <h3 className="font-black text-sm md:text-lg min-[360px]:truncate">
              {item.productName}
            </h3>
            {!isCheckout && (
              <button
                onClick={handleRemoveClick}
                className="text-black hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5 cursor-pointer" />
              </button>
            )}
          </div>
          <ConfirmDialog
            open={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onConfirm={handleConfirmRemove}
            title="ลบสินค้าออกจากรถเข็น?"
            content={
              <div className="flex flex-col items-center gap-2">
                <span className="font-bold text-red-400 ">
                  {`" ${item.productName} "`}
                </span>
                <span>คุณแน่ใจใช่ไหมที่จะลบรายการนี้?</span>
              </div>
            }
            variant="danger"
          />

          <div className="flex max-[420px]:flex-col justify-between  items-end mt-2">
            <p className="font-black text-[16px] md:text-xl">
              ฿{item.price}/ชิ้น
            </p>
            <div className="w-full min-[360px]:w-auto text-right">
              {isCheckout ? (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-gray-500">
                    จำนวน{" "}
                    <span className="text-black ml-4">{item.quantity}</span>
                  </p>
                  <p className="font-black text-[16px] md:text-lg">
                    รวมทั้งหมด{" "}
                    <span className="text-red-500 ml-2">
                      ฿
                      <CurrencyDisplay
                        amount={(item.price ?? 0) * item.quantity}
                      />
                    </span>
                  </p>
                </div>
              ) : (
                /* ปุ่มเพิ่ม/ลดจำนวนเดิม สำหรับหน้า Cart */
                <div className="flex items-center border-2 border-black rounded-xl overflow-hidden bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <button
                    onClick={() => onUpdateQty?.(item.shoppingCartItemId, -1)}
                    disabled={item.quantity <= min}
                    className="px-2 py-1 hover:bg-black hover:text-white transition-colors disabled:cursor-not-allowed cursor-pointer "
                  >
                    <Minus className="w-4 h-4  " />
                  </button>
                  <input
                    type="number"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="w-14 px-1 text-center font-black border-x-2 border-black bg-gray-50 focus:outline-none 
    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    onClick={() => onUpdateQty?.(item.shoppingCartItemId, 1)}
                    disabled={item.quantity >= max}
                    className="px-2 py-1 hover:bg-black hover:text-white transition-colors disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
