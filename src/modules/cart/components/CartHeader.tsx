import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const CartHeader = ({ itemCount }: { itemCount: number }) => (
  <div className="flex items-center gap-2 mb-6">
    <Link href="/customerhome">
      <ChevronLeft className="w-8 h-8 text-black hover:bg-gray-100 transition-colors rounded-full" />
    </Link>
    <h1 className="text-xl md:text-2xl font-black text-black">
      รถเข็นของฉัน ({itemCount})
    </h1>
  </div>
);