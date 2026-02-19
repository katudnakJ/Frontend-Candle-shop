import { useState, useRef } from "react";
import { PaymentService } from "../services/payment.service";
import { toast } from "react-hot-toast";

export const usePaymentSlip = (onFileSelect: (file: File | null) => void) => {
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState(false);
  const [inputKey, setInputKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBoxClick = () => {
    if (fileInputRef.current) {
      setInputKey((prev) => prev + 1);
      setTimeout(() => fileInputRef.current?.click(), 50);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const errorMessage = PaymentService.validateFile(file);
    
   if (errorMessage) {

      toast.error(
        <div className="flex flex-col justify-center py-1">
          <span className="text-sm leading-tight">
            {errorMessage}
          </span>
        </div>,
        {
          className: "bg-white border-2 border-cprojectone rounded-xl font-bold shadow-2xl text-black mx-auto sm:ml-auto sm:mr-6 h-20",
          duration: 3000,
        }
      );
      setFileError(true);
      setSlipPreview(null);
      onFileSelect(null);
      return;
    }

    setFileError(false);
    onFileSelect(file);
    const reader = new FileReader();
    reader.onloadend = () => setSlipPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const resetFile = () => {
    setSlipPreview(null);
    onFileSelect(null);
    setFileError(false);
  };

  return { 
    slipPreview, fileError, inputKey, fileInputRef, 
    handleBoxClick, onFileChange, resetFile 
  };
};