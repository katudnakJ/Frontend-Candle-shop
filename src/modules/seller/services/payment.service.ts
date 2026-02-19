import { toast } from "react-hot-toast";

export const PaymentService = {
  // Logic การดาวน์โหลดรูป
  downloadQR: async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      toast.error("ไม่สามารถดาวน์โหลดรูปภาพได้");
    }
  },

  // Logic การตรวจสอบไฟล์
  validateFile: (file: File) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      return "รองรับเฉพาะไฟล์รูปภาพ (JPG, JPEG, PNG)";
    }
    if (file.size > 1024 * 1024) {
      return "กรุณาใช้ไฟล์ขนาดไม่เกิน 1MB";
    }
    return null;
  },
};
