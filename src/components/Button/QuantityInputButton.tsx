"use client";
import { Plus, Minus } from "lucide-react";

interface QuantityInputProps {
  value: number;
  onChange: (val: number) => void;
  max?: number;
  min?: number;
}

export default function QuantityInputButton({
  value,
  onChange,
  max = 1000,
  min = 1,
}: QuantityInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputvalue = e.target.value;
    if (inputvalue === "") {
      onChange(0);
      return;
    }
    const val = parseInt(inputvalue);
    if (!isNaN(val)) {
      if (val > max) onChange(max);
      else onChange(val);
    }
  };

  const handleBlur = () => {
    if (value < min) onChange(min);
  };

  const increment = () => onChange(value >= max ? max : value + 1);
  const decrement = () => onChange(value > min ? value - 1 : min);

  return (
    <div className="flex-col ">
      <div className="text-right mr-5 ml-auto">
        <span className="text-red-500 text-[12px] max-[420px]:text-[9px] font-bold">
          กรณีต้องการเพิ่มจำนวนสินมากกว่าเดิม ให้ระบุจำนวนให้มากกว่าครั้งก่อน
        </span>
      </div>
      <div className="flex justify-end items-center gap-4 px-6 mt-10 mb-6 text-black font-sans ">
        <span className="text-lg font-bold">จำนวน</span>
        <div className="flex items-center border-2 border-black rounded-xl overflow-hidden bg-white">
          <button
            type="button"
            onClick={decrement}
            disabled={value <= min}
            className="p-2 hover:bg-gray-100 disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <Minus size={20} />
          </button>
          <input
            type="number"
            value={value === 0 ? "" : value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="w-12 text-center font-bold text-lg focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={increment}
            disabled={value >= max}
            className="p-2 hover:bg-gray-100 disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
