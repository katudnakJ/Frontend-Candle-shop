'use client'

import Link from "next/link";


export default function EmptyCartState() {


  return(
   
    <div className="text-center py-20 border-2 border-dashed border-black rounded-3xl">
      <p className="text-gray-500 font-bold">🚚ไม่มีสินค้าในรถเข็น ~</p>
      <Link
        href="/"
        className="text-blue-500 underline mt-2 inline-block"
      >
        ไปช้อปกันเถอะ!
      </Link>
    </div>
  );
}
