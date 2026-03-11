import { useState, useEffect, useRef, useCallback } from "react";
import { PaymentService } from "../services/payment.service";
import { toast } from "react-hot-toast";
import imageCompression from "browser-image-compression";

export const usePaymentSlip = (
  onFileSelect: (file: File | null) => void,
  initialPreview: string | null = null,
) => {
  const [slipPreview, setSlipPreview] = useState<string | null>(initialPreview);
  const [fileError, setFileError] = useState(false);
  const [inputKey, setInputKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const revokePreview = useCallback((url: string | null) => {
    if (url && url.startsWith("blob:")) {
      console.log(
        `%c[RAM Released] %cRevoking Slip: ${url}`,
        "color: red; font-weight: bold;",
        "color: inherit;",
      );
      URL.revokeObjectURL(url);
    }
  }, []);

  useEffect(() => {
    return () => revokePreview(slipPreview);
  }, [slipPreview, revokePreview]);

  const handleBoxClick = () => {
    if (fileInputRef.current) {
      setInputKey((prev) => prev + 1);
      setTimeout(() => fileInputRef.current?.click(), 50);
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const errorMessage = PaymentService.validateFile(file);

    if (errorMessage) {
      toast.error(
        <div className="flex flex-col justify-center py-1">
          <span className="text-sm leading-tight">{errorMessage}</span>
        </div>,
        {
          className:
            "bg-white border-2 border-cprojectone rounded-xl font-bold shadow-2xl text-black mx-auto sm:ml-auto sm:mr-6 h-20",
          duration: 3000,
        },
      );
      setFileError(true);
      resetFile();
      return;
    }

    setFileError(false);
    const options = {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1280,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const finalFile = new File([compressedFile], file.name, {
        type: file.type,
      });

      onFileSelect(finalFile);

      revokePreview(slipPreview);

      const previewUrl = URL.createObjectURL(finalFile);
      console.log(
        `%c[RAM Allocated] %cCreated Slip Preview: ${file.name}`,
        "color: green; font-weight: bold;",
        "color: inherit;",
      );
      setSlipPreview(previewUrl);
    } catch (error) {
      console.error("Compression failed:", error);

      onFileSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => setSlipPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

const resetFile = useCallback(() => {
    setSlipPreview((prev) => {
      revokePreview(prev); // ล้างค่าจาก state ล่าสุดตรงนี้เลย
      return null;
    });
    onFileSelect(null);
    setFileError(false);
  }, [onFileSelect, revokePreview]);

  return {
    slipPreview,
    fileError,
    inputKey,
    fileInputRef,
    setSlipPreview,
    handleBoxClick,
    onFileChange,
    resetFile,
  };
};
