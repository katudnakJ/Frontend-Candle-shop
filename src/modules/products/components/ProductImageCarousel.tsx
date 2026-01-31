"use client";
import Image from "next/image";
import { useState } from "react";
import { ProductImage } from "@/modules/products/types";


function CarouselImage({ img, index }: { img: ProductImage; index: number }) {
  const [imgSrc, setImgSrc] = useState(img.product_img_slug || "/placeholder-image.svg");

  return (
    <div className="relative w-full h-full flex-shrink-0 snap-center">
      <Image
        src={imgSrc}
        alt={`Product image ${index + 1}`}
        fill
        className="object-cover"
        priority={index === 0}
      
        onError={() => setImgSrc("/placeholder-image.svg")}
      />
    </div>
  );
}


export default function ProductImageCarousel({ images }: { images: ProductImage[] }) {
  const sortedImages = [...images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return 0;
  });

  return (
    <div className="flex flex-col items-center w-full max-w-[400px] mx-auto">
      <div className="relative w-full aspect-square rounded-3xl overflow-hidden border-4 border-cprojectfour shadow-md">
        <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar">
          {sortedImages.map((img, index) => (
            
            <CarouselImage key={img.product_img_id || index} img={img} index={index} />
          ))}
        </div>
        
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white text-[10px] px-3 py-1 rounded-full backdrop-blur-sm">
            {images.length} รูป (ปัดเพื่อดู)
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        {sortedImages.map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-gray-300" />
        ))}
      </div>
    </div>
  );
}