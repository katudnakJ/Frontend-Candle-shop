"use client";

import { Toaster } from "react-hot-toast";
import { useToastPosition } from "@/hooks/useToastPosition";

export const ToastProvider = () => {
  const toastPosition = useToastPosition();

  return (
    <Toaster
      position={toastPosition}
      containerStyle={{ zIndex: 20050 }}
      toastOptions={{
        style: { zIndex: 20050 },
        className: `
          !bg-white border-2 border-cprojectone rounded-xl !font-bold shadow-2xl 
          mx-auto sm:ml-auto sm:mr-6 flex items-center !text-black
          
          
          h-16 
          sm:!text-sm px-4 

          md:h-28 
          md:!text-xl 
          md:px-10
          md:border-4  
          
          lg:h-28               /* เพิ่มความสูงเป็น 28 (112px) */
          lg:!text-xl          /* เพิ่มขนาดตัวอักษรเป็น 2XL */
          lg:px-10               /* เพิ่มระยะห่างภายในซ้าย-ขวา */
       
          lg:border-4            /* เพิ่มความหนาของเส้นขอบให้ดูเด่นขึ้น */
        `,
    
        duration: 3000,
      }}
    />
  );
};
