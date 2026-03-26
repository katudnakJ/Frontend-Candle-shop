"use client";
import Image from "next/image";
import { useState } from "react";
import { ProductDetailImage } from "@/modules/products/detailproduct";
import { SmartImage } from "@/components/commonui/SmartImage";

function CarouselImage({
  img,
  index,
}: {
  img: ProductDetailImage;
  index: number;
}) {


  return (
    <div className="relative w-full h-full flex-shrink-0 snap-center">
      <SmartImage
        src={img.productImgPath}
        alt={`Product image ${index + 1}`}
        fill
        className="object-cover"
        priority={index === 0}
       
      />
    </div>
  );
}

export default function ProductImageCarousel({
  images,
}: {
  images: ProductDetailImage[];
}) {
  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center w-full max-w-[400px] mx-auto">
        <div className="relative w-full aspect-square rounded-3xl overflow-hidden border-4 border-cprojectfour shadow-md bg-gray-50 flex items-center justify-center">
          <SmartImage
            src="" 
            alt="No product image"
            fill
            className="object-cover"
          />
        </div>
      </div>
    );
  }

  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return 0;
  });

  return (
    <div className="flex flex-col items-center w-full max-w-[400px] mx-auto">
      <div className="relative w-full aspect-square rounded-3xl overflow-hidden border-4 border-cprojectfour shadow-md">
        <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory custom-scrollbar">
          {sortedImages.map((img, index) => (
            <CarouselImage
              key={img.productImgId || index}
              img={img}
              index={index}
            />
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
