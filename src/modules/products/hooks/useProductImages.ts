import { useState, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";
import imageCompression from "browser-image-compression";

export const useProductImages = (maxFiles = 3) => {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [inputKey, setInputKey] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  

  const handleBoxClick = () => {
    if (fileInputRef.current) {
      setInputKey((prev) => prev + 1);
      setTimeout(() => fileInputRef.current?.click(), 50);
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const hasOversizedFile = selectedFiles.some(file => file.size > 2 * 1024 * 1024);

    if (hasOversizedFile) {
    toast.error("บางไฟล์มีขนาดเกิน 2MB กรุณาเลือกใหม่");
    e.target.value = ""; 
    return; 
  }

    if (selectedFiles.length === 0) return;

    if (images.length + selectedFiles.length > maxFiles) {
      toast.error(`ลงรูปได้สูงสุด ${maxFiles} รูปครับ`, {
        className:
          "font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
      });
      return;
    }

    setIsCompressing(true);
    const compressionOptions = {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1280,
      useWebWorker: true,
    };

    try {
      const processedImages = await Promise.all(
        selectedFiles.map(async (file) => {
          const compressedFile = await imageCompression(
            file,
            compressionOptions,
          );

          const finalFile = new File([compressedFile], file.name, {
            type: file.type,
          });
          const previewUrl = URL.createObjectURL(finalFile);

          console.log(
            `%c[RAM Allocated] %cCreated Preview for: ${file.name}`,
            "color: green; font-weight: bold;",
            "color: inherit;",
          );
          console.log("URL:", previewUrl);
          return {
            file: finalFile,
            preview: previewUrl,
          };
        }),
      );

      setImages((prev) => [...prev, ...processedImages]);
    } catch (error) {
      console.error("Compression failed:", error);
      toast.error("เกิดข้อผิดพลาดในการประมวลผลรูปภาพ");
    } finally {
      setIsCompressing(false);
    }
  };

  const resetAll = useCallback(() => {
    setImages((prevImages) => {

        if(prevImages.length === 0)return[];

      prevImages.forEach((img) => {
        if (img.preview.startsWith("blob:")) {
          console.log(
            `%c[RAM Released1] %cRevoking: ${img.preview}`,
            "color: red; font-weight: bold;",
            "color: inherit;",
          );
          URL.revokeObjectURL(img.preview);
        }
      });

      return [];
    });
  }, []);

  const removeImage = (index: number) => {
    setImages((prev) => {

      if (index < 0 || index >= prev.length) return prev;
      
        

      const targetImage = prev[index];
      const updated = [...prev];
     if (targetImage.preview && targetImage.preview.startsWith("blob:")) {
      console.log(
        `%c[RAM Released2] %cRevoking: ${targetImage.preview}`,
        "color: red; font-weight: bold;",
        "color: inherit;"
      );
      URL.revokeObjectURL(targetImage.preview);
    }
      updated.splice(index, 1);
      return updated;
    });
  };

  return {
    images,
    inputKey,
    fileInputRef,
    isCompressing,
    handleBoxClick,
    onFileChange,
    removeImage,
    resetAll,
    setImages,
  };
};
