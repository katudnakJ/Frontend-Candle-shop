import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface ProductHeaderProps {
  mode?: "customerproducts" | "sellerproducs";
  namemode?: string;
  isAddEditProduct?: boolean;
  issellerProduct?:boolean;
}

export function ProductHeader({
  mode = "customerproducts",
  namemode,
  issellerProduct= false,
  isAddEditProduct = false,
}: ProductHeaderProps) {
  const clickback = mode === "sellerproducs" ? "/sellerhome" : "/customerhome";

  return (
    <div className="flex items-center gap-2 mb-6">
      <div className="flex items-center">
        {issellerProduct &&
        <Link href={clickback}>
          <ChevronLeft className="w-8 h-8 text-black hover:bg-gray-100 transition-colors rounded-full" />
        </Link>
        }

         {isAddEditProduct &&
        <Link href="/seller/sellerproducts">
          <ChevronLeft className="w-8 h-8 text-black hover:bg-gray-100 transition-colors rounded-full" />
        </Link>
        }

        <span>
          <p className="text-xl md:text-2xl font-black text-black">
            {namemode}
          </p>
        </span>
      </div>
    </div>
  );
}
