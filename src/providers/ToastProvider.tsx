"use client";

import { Toaster } from "react-hot-toast";
import { useToastPosition } from "@/hooks/useToastPosition";

export const ToastProvider = () => {
  const toastPosition = useToastPosition();

  return (
    <Toaster
      position={toastPosition}
      toastOptions={{
       
        className: "bg-white border-2 border-cprojectone rounded-xl font-bold shadow-2xl text-black mx-auto sm:ml-auto sm:mr-6 h-20",
        duration: 3000,
      }}
    />
  );
};