

import { Package } from 'lucide-react';

interface FullscreenLoaderProps {
  message?: string;
}

export default function FullscreenLoader({ message = "กำลังจัดการข้อมูล..." }: FullscreenLoaderProps) {
  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm transition-all">
      <div className="relative flex flex-col items-center">
        
     
        {/* <div className="absolute inset-0 flex items-center justify-center">
           <div  className="w-20 h-20 border-4 border-gray-100 border-t-red-600 rounded-full animate-spin">

           </div>
        </div> */}

       
        <div className="relative bg-white p-4 rounded-2xl shadow-xl border border-gray-50 flex items-center justify-center mb-6">
          <Package size={32} className="text-red-600 animate-bounce" />
        </div>

     
        <div className="flex flex-col items-center gap-2">
          <p className="font-prompt font-black text-gray-800 text-lg tracking-wide">
            {message}
          </p>
          <div className="flex gap-1">
             <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
             <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
             <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce"></span>
          </div>
        </div>
      </div>
    </div>
  );
}