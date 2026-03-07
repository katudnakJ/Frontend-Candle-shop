import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface OrderHeaderProps {
  mode?: "customerorders" | "sellerorders";
}

export function OrderHeader ({ mode = "customerorders" }: OrderHeaderProps) {
  const clickback = mode === "sellerorders" ? "/sellerhome" : "/customerhome"
   const primarylabel = mode === "sellerorders" ? "จัดการคำสั่งซื้อ" : "ประวัติคำสั่งซื้อ"

   return(
  <div className="flex items-center gap-2 mb-6">
    <div className="flex items-center">
      <Link href={clickback}>
        <ChevronLeft className="w-8 h-8 text-black hover:bg-gray-100 transition-colors rounded-full" />
      </Link>
      <span>
        <p className="text-xl md:text-2xl font-black text-black">
          {primarylabel}
        </p>
      </span>
    </div>
  </div>
);
}
